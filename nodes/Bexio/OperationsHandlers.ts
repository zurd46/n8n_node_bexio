import {
	IExecuteFunctions,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

import { bexioApiRequest, bexioApiRequestAllItems, bexioApiRequestBinary } from './GenericFunctions';

// Criteria names per the Bexio API documentation; "in" and "not_in" expect an array as value.
function buildSearchBody(searchCriteria: IDataObject): IDataObject[] {
	const criteria = searchCriteria.criteria;
	if (!Array.isArray(criteria)) {
		return [];
	}
	return (criteria as IDataObject[]).map((criterion) => {
		const isList = criterion.criteria === 'in' || criterion.criteria === 'not_in';
		const value =
			isList && typeof criterion.value === 'string'
				? criterion.value.split(',').map((part) => part.trim()).filter((part) => part !== '')
				: criterion.value;
		return { field: criterion.field, value, criteria: criterion.criteria };
	});
}

// Workflows saved with older versions still carry "address". The API expects street_name.
function migrateContactAddress(fields: IDataObject): IDataObject {
	const { address, ...rest } = fields;
	if (address && !rest.street_name) {
		rest.street_name = address;
	}
	return rest;
}

function parsePositions(this: IExecuteFunctions, fields: IDataObject, index: number): void {
	if (fields.positions && typeof fields.positions === 'string') {
		try {
			fields.positions = JSON.parse(fields.positions);
		} catch (error) {
			throw new NodeOperationError(this.getNode(), 'Invalid JSON format for positions field. Please provide valid JSON.', { itemIndex: index });
		}
	}
}

// The API expects article_type_id and prices as strings. article_type and user_name come from older versions.
function normalizeItemFields(fields: IDataObject): IDataObject {
	const { article_type: articleType, user_name: _userName, ...rest } = fields;
	if (articleType && rest.article_type_id === undefined) {
		rest.article_type_id = articleType === 'service' ? 2 : 1;
	}
	for (const price of ['sale_price', 'purchase_price']) {
		if (rest[price] !== undefined) {
			rest[price] = String(rest[price]);
		}
	}
	return rest;
}

// =====================================
// Contact Operations
// =====================================
export async function handleContactOperations(this: IExecuteFunctions, operation: string, index: number): Promise<IDataObject | IDataObject[]> {
	const resource = 'contact';

	if (operation === 'create') {
		const contactTypeId = this.getNodeParameter('contact_type_id', index) as number;
		const userId = this.getNodeParameter('user_id', index) as number;
		const ownerId = this.getNodeParameter('owner_id', index) as number;
		const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;
		// Older workflows stored name_1 inside the additional fields
		const name1 = (this.getNodeParameter('name_1', index, '') as string) || additionalFields.name_1;

		if (!name1) {
			throw new NodeOperationError(this.getNode(), 'Name 1 is required: company name for a company, last name for a person.', { itemIndex: index });
		}

		const body: IDataObject = {
			contact_type_id: contactTypeId,
			user_id: userId,
			owner_id: ownerId,
			...migrateContactAddress(additionalFields),
			name_1: name1,
		};

		return await bexioApiRequest.call(this, 'POST', '/2.0/contact', body);
	}

	if (operation === 'delete') {
		const contactId = this.getNodeParameter('contactId', index) as string;
		return await bexioApiRequest.call(this, 'DELETE', `/2.0/contact/${contactId}`);
	}

	if (operation === 'get') {
		const contactId = this.getNodeParameter('contactId', index) as string;
		return await bexioApiRequest.call(this, 'GET', `/2.0/contact/${contactId}`);
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		const qs: IDataObject = { ...options };

		if (returnAll) {
			return await bexioApiRequestAllItems.call(this, 'GET', '/2.0/contact', {}, qs);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			qs.limit = limit;
			return await bexioApiRequest.call(this, 'GET', '/2.0/contact', {}, qs);
		}
	}

	if (operation === 'search') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const searchCriteria = this.getNodeParameter('searchCriteria', index, {}) as IDataObject;
		const body = buildSearchBody(searchCriteria);

		if (returnAll) {
			return await bexioApiRequestAllItems.call(this, 'POST', '/2.0/contact/search', body);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const qs = { limit };
			return await bexioApiRequest.call(this, 'POST', '/2.0/contact/search', body, qs);
		}
	}

	if (operation === 'update') {
		const contactId = this.getNodeParameter('contactId', index) as string;
		const updateFields = migrateContactAddress(this.getNodeParameter('updateFields', index) as IDataObject);

		// The API requires these four fields on every update. Unchanged values come from the contact.
		const required = ['contact_type_id', 'name_1', 'user_id', 'owner_id'];
		let body = updateFields;
		if (required.some((field) => updateFields[field] === undefined)) {
			const current = (await bexioApiRequest.call(this, 'GET', `/2.0/contact/${contactId}`)) as IDataObject;
			body = { ...updateFields };
			for (const field of required) {
				if (body[field] === undefined) {
					body[field] = current[field];
				}
			}
		}

		return await bexioApiRequest.call(this, 'POST', `/2.0/contact/${contactId}`, body);
	}

	throw new Error(`Unknown operation: ${operation}`);
}

// =====================================
// Invoice Operations
// =====================================
export async function handleInvoiceOperations(this: IExecuteFunctions, operation: string, index: number): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const contactId = this.getNodeParameter('contact_id', index) as string;
		const userId = this.getNodeParameter('user_id', index) as number;
		const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

		const { contact_address: contactAddress, project_id: projectId, ...fields } = additionalFields;
		const body: IDataObject = {
			contact_id: parseInt(contactId, 10),
			user_id: userId,
			...fields,
		};
		// Field names saved by older versions
		if (contactAddress && !body.contact_address_manual) {
			body.contact_address_manual = contactAddress;
		}
		if (projectId && !body.pr_project_id) {
			body.pr_project_id = projectId;
		}

		parsePositions.call(this, body, index);

		return await bexioApiRequest.call(this, 'POST', '/2.0/kb_invoice', body);
	}

	if (operation === 'delete') {
		const invoiceId = this.getNodeParameter('invoiceId', index) as string;
		return await bexioApiRequest.call(this, 'DELETE', `/2.0/kb_invoice/${invoiceId}`);
	}

	if (operation === 'get') {
		const invoiceId = this.getNodeParameter('invoiceId', index) as string;
		return await bexioApiRequest.call(this, 'GET', `/2.0/kb_invoice/${invoiceId}`);
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		const qs: IDataObject = { ...options };

		// GET /2.0/kb_invoice has no status filter, these filters need the search endpoint.
		// Values 1, 5, 10 are the IDs saved by older versions.
		const legacyStatus: IDataObject = { '1': '7', '5': '8', '10': '16' };
		const { kb_item_status_id: statusOption, overdue_only: overdueOnly, unpaid_only: unpaidOnly, ...listOptions } = qs;
		const status = statusOption === '18' ? undefined : (legacyStatus[statusOption as string] ?? statusOption);
		const onlyOverdue = overdueOnly === true || statusOption === '18';
		const openStatuses = ['8', '16', '31'];
		const criteria: IDataObject[] = [];

		if (status !== undefined && status !== '') {
			criteria.push({ field: 'kb_item_status_id', value: status, criteria: '=' });
		} else if (onlyOverdue || unpaidOnly === true) {
			criteria.push({ field: 'kb_item_status_id', value: openStatuses, criteria: 'in' });
		}
		if (onlyOverdue) {
			criteria.push({ field: 'is_valid_to', value: new Date().toISOString().slice(0, 10), criteria: '<' });
		}

		if (criteria.length > 0) {
			if (returnAll) {
				return await bexioApiRequestAllItems.call(this, 'POST', '/2.0/kb_invoice/search', criteria, listOptions);
			}
			listOptions.limit = this.getNodeParameter('limit', index) as number;
			return await bexioApiRequest.call(this, 'POST', '/2.0/kb_invoice/search', criteria, listOptions);
		}

		if (returnAll) {
			return await bexioApiRequestAllItems.call(this, 'GET', '/2.0/kb_invoice', {}, listOptions);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			listOptions.limit = limit;
			return await bexioApiRequest.call(this, 'GET', '/2.0/kb_invoice', {}, listOptions);
		}
	}

	if (operation === 'getPdf') {
		const invoiceId = this.getNodeParameter('invoiceId', index) as string;

		// Download PDF as binary data
		const pdfBuffer = await bexioApiRequestBinary.call(this, 'GET', `/2.0/kb_invoice/${invoiceId}/pdf`);

		// Return as binary data that n8n can handle
		const binaryData = await this.helpers.prepareBinaryData(
			pdfBuffer,
			`invoice_${invoiceId}.pdf`,
			'application/pdf',
		);

		return {
			json: {
				invoiceId,
				fileName: `invoice_${invoiceId}.pdf`,
				mimeType: 'application/pdf',
				fileSize: pdfBuffer.length,
			},
			binary: {
				data: binaryData,
			},
		} as any;
	}

	if (operation === 'issue') {
		const invoiceId = this.getNodeParameter('invoiceId', index) as string;
		return await bexioApiRequest.call(this, 'POST', `/2.0/kb_invoice/${invoiceId}/issue`);
	}

	if (operation === 'markAsSent') {
		const invoiceId = this.getNodeParameter('invoiceId', index) as string;
		return await bexioApiRequest.call(this, 'POST', `/2.0/kb_invoice/${invoiceId}/mark_as_sent`);
	}

	if (operation === 'search') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const searchCriteria = this.getNodeParameter('searchCriteria', index, {}) as IDataObject;
		const body = buildSearchBody(searchCriteria);

		if (returnAll) {
			return await bexioApiRequestAllItems.call(this, 'POST', '/2.0/kb_invoice/search', body);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const qs = { limit };
			return await bexioApiRequest.call(this, 'POST', '/2.0/kb_invoice/search', body, qs);
		}
	}

	if (operation === 'send') {
		const invoiceId = this.getNodeParameter('invoiceId', index) as string;
		const recipient = this.getNodeParameter('recipient', index) as string;
		const subject = this.getNodeParameter('subject', index) as string;
		const message = this.getNodeParameter('message', index) as string;
		const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

		if (!message.includes('[Network Link]')) {
			throw new NodeOperationError(this.getNode(), 'The message must contain the placeholder [Network Link].', { itemIndex: index });
		}

		const body: IDataObject = {
			recipient_email: recipient,
			subject,
			message,
			...additionalFields,
		};

		return await bexioApiRequest.call(this, 'POST', `/2.0/kb_invoice/${invoiceId}/send`, body);
	}

	if (operation === 'update') {
		const invoiceId = this.getNodeParameter('invoiceId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		parsePositions.call(this, updateFields, index);

		return await bexioApiRequest.call(this, 'POST', `/2.0/kb_invoice/${invoiceId}`, updateFields);
	}

	throw new Error(`Unknown operation: ${operation}`);
}

// =====================================
// Project Operations
// =====================================
export async function handleProjectOperations(this: IExecuteFunctions, operation: string, index: number): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const name = this.getNodeParameter('name', index) as string;
		const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

		const body: IDataObject = {
			name,
			...additionalFields,
		};

		return await bexioApiRequest.call(this, 'POST', '/2.0/pr_project', body);
	}

	if (operation === 'delete') {
		const projectId = this.getNodeParameter('projectId', index) as string;
		return await bexioApiRequest.call(this, 'DELETE', `/2.0/pr_project/${projectId}`);
	}

	if (operation === 'get') {
		const projectId = this.getNodeParameter('projectId', index) as string;
		return await bexioApiRequest.call(this, 'GET', `/2.0/pr_project/${projectId}`);
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			return await bexioApiRequestAllItems.call(this, 'GET', '/2.0/pr_project');
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const qs = { limit };
			return await bexioApiRequest.call(this, 'GET', '/2.0/pr_project', {}, qs);
		}
	}

	if (operation === 'archive') {
		const projectId = this.getNodeParameter('projectId', index) as string;
		return await bexioApiRequest.call(this, 'POST', `/2.0/pr_project/${projectId}/archive`);
	}

	if (operation === 'unarchive') {
		const projectId = this.getNodeParameter('projectId', index) as string;
		return await bexioApiRequest.call(this, 'POST', `/2.0/pr_project/${projectId}/unarchive`);
	}

	if (operation === 'search') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const searchCriteria = this.getNodeParameter('searchCriteria', index, {}) as IDataObject;
		const body = buildSearchBody(searchCriteria);

		if (returnAll) {
			return await bexioApiRequestAllItems.call(this, 'POST', '/2.0/pr_project/search', body);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const qs = { limit };
			return await bexioApiRequest.call(this, 'POST', '/2.0/pr_project/search', body, qs);
		}
	}

	if (operation === 'update') {
		const projectId = this.getNodeParameter('projectId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		return await bexioApiRequest.call(this, 'POST', `/2.0/pr_project/${projectId}`, updateFields);
	}

	throw new Error(`Unknown operation: ${operation}`);
}

// =====================================
// Item Operations
// =====================================
export async function handleItemOperations(this: IExecuteFunctions, operation: string, index: number): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const internName = this.getNodeParameter('intern_name', index) as string;
		const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

		const body = normalizeItemFields({
			intern_name: internName,
			...additionalFields,
		});

		return await bexioApiRequest.call(this, 'POST', '/2.0/article', body);
	}

	if (operation === 'delete') {
		const itemId = this.getNodeParameter('itemId', index) as string;
		return await bexioApiRequest.call(this, 'DELETE', `/2.0/article/${itemId}`);
	}

	if (operation === 'get') {
		const itemId = this.getNodeParameter('itemId', index) as string;
		return await bexioApiRequest.call(this, 'GET', `/2.0/article/${itemId}`);
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			return await bexioApiRequestAllItems.call(this, 'GET', '/2.0/article');
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const qs = { limit };
			return await bexioApiRequest.call(this, 'GET', '/2.0/article', {}, qs);
		}
	}

	if (operation === 'search') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const searchCriteria = this.getNodeParameter('searchCriteria', index, {}) as IDataObject;
		const body = buildSearchBody(searchCriteria);

		if (returnAll) {
			return await bexioApiRequestAllItems.call(this, 'POST', '/2.0/article/search', body);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const qs = { limit };
			return await bexioApiRequest.call(this, 'POST', '/2.0/article/search', body, qs);
		}
	}

	if (operation === 'update') {
		const itemId = this.getNodeParameter('itemId', index) as string;
		const updateFields = normalizeItemFields(this.getNodeParameter('updateFields', index) as IDataObject);

		return await bexioApiRequest.call(this, 'POST', `/2.0/article/${itemId}`, updateFields);
	}

	throw new Error(`Unknown operation: ${operation}`);
}

// =====================================
// Timesheet Operations
// =====================================
export async function handleTimesheetOperations(this: IExecuteFunctions, operation: string, index: number): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const userId = this.getNodeParameter('user_id', index) as number;
		const date = this.getNodeParameter('date', index) as string;
		const duration = this.getNodeParameter('duration', index) as number;
		const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

		const body: IDataObject = {
			user_id: userId,
			date,
			duration,
			...additionalFields,
		};

		return await bexioApiRequest.call(this, 'POST', '/2.0/timesheet', body);
	}

	if (operation === 'delete') {
		const timesheetId = this.getNodeParameter('timesheetId', index) as string;
		return await bexioApiRequest.call(this, 'DELETE', `/2.0/timesheet/${timesheetId}`);
	}

	if (operation === 'get') {
		const timesheetId = this.getNodeParameter('timesheetId', index) as string;
		return await bexioApiRequest.call(this, 'GET', `/2.0/timesheet/${timesheetId}`);
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			return await bexioApiRequestAllItems.call(this, 'GET', '/2.0/timesheet');
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const qs = { limit };
			return await bexioApiRequest.call(this, 'GET', '/2.0/timesheet', {}, qs);
		}
	}

	if (operation === 'search') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const searchCriteria = this.getNodeParameter('searchCriteria', index, {}) as IDataObject;
		const body = buildSearchBody(searchCriteria);

		if (returnAll) {
			return await bexioApiRequestAllItems.call(this, 'POST', '/2.0/timesheet/search', body);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const qs = { limit };
			return await bexioApiRequest.call(this, 'POST', '/2.0/timesheet/search', body, qs);
		}
	}

	if (operation === 'update') {
		const timesheetId = this.getNodeParameter('timesheetId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		return await bexioApiRequest.call(this, 'POST', `/2.0/timesheet/${timesheetId}`, updateFields);
	}

	throw new Error(`Unknown operation: ${operation}`);
}

// =====================================
// Stub handlers for remaining resources
// =====================================
export async function handleQuoteOperations(this: IExecuteFunctions, operation: string, index: number): Promise<IDataObject | IDataObject[]> {
	// Similar to invoice operations
	const endpoint = '/2.0/kb_offer';
	return handleDocumentOperations.call(this, operation, index, endpoint, 'quoteId');
}

export async function handleOrderOperations(this: IExecuteFunctions, operation: string, index: number): Promise<IDataObject | IDataObject[]> {
	// Similar to invoice operations
	const endpoint = '/2.0/kb_order';
	return handleDocumentOperations.call(this, operation, index, endpoint, 'orderId');
}

export async function handleBillOperations(this: IExecuteFunctions, operation: string, index: number): Promise<IDataObject | IDataObject[]> {
	const endpoint = '/3.0/purchase/bills';
	return handleGenericCRUD.call(this, operation, index, endpoint, 'billId');
}

export async function handleExpenseOperations(this: IExecuteFunctions, operation: string, index: number): Promise<IDataObject | IDataObject[]> {
	const endpoint = '/3.0/purchase/expenses';
	return handleGenericCRUD.call(this, operation, index, endpoint, 'expenseId');
}

export async function handleTaskOperations(this: IExecuteFunctions, operation: string, index: number): Promise<IDataObject | IDataObject[]> {
	const endpoint = '/2.0/task';
	return handleGenericCRUDWithSearch.call(this, operation, index, endpoint, 'taskId');
}

export async function handleFileOperations(this: IExecuteFunctions, operation: string, index: number): Promise<IDataObject | IDataObject[]> {
	const endpoint = '/3.0/files';
	if (operation === 'download') {
		const fileId = this.getNodeParameter('fileId', index) as string;
		return await bexioApiRequest.call(this, 'GET', `${endpoint}/${fileId}/download`);
	}
	return handleGenericCRUDWithSearch.call(this, operation, index, endpoint, 'fileId');
}

export async function handleBankingOperations(this: IExecuteFunctions, operation: string, index: number): Promise<IDataObject | IDataObject[]> {
	if (operation === 'getBankAccounts') {
		const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
		if (returnAll) {
			return await bexioApiRequestAllItems.call(this, 'GET', '/3.0/banking/accounts');
		} else {
			const limit = this.getNodeParameter('limit', index, 500) as number;
			const qs = { limit };
			return await bexioApiRequest.call(this, 'GET', '/3.0/banking/accounts', {}, qs);
		}
	}
	if (operation === 'getBankAccount') {
		const accountId = this.getNodeParameter('accountId', index) as string;
		return await bexioApiRequest.call(this, 'GET', `/3.0/banking/accounts/${accountId}`);
	}
	if (operation === 'getPayments') {
		const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
		const unwrap = (response: IDataObject | IDataObject[]): IDataObject[] => {
			if (Array.isArray(response)) {
				return response;
			}
			return Array.isArray(response?.data) ? (response.data as IDataObject[]) : [response];
		};
		if (returnAll) {
			// This v4 endpoint pages with "page" and "per-page", not with limit and offset
			const perPage = 500;
			const payments: IDataObject[] = [];
			for (let page = 0; page < 1000; page++) {
				const batch = unwrap(await bexioApiRequest.call(this, 'GET', '/4.0/banking/payments', {}, { page, 'per-page': perPage }));
				payments.push(...batch);
				if (batch.length < perPage) {
					break;
				}
			}
			return payments;
		}
		const limit = this.getNodeParameter('limit', index, 500) as number;
		return unwrap(await bexioApiRequest.call(this, 'GET', '/4.0/banking/payments', {}, { page: 0, 'per-page': limit }));
	}
	if (operation === 'getPayment') {
		const paymentId = this.getNodeParameter('paymentId', index) as string;
		return await bexioApiRequest.call(this, 'GET', `/4.0/banking/payments/${paymentId}`);
	}
	if (operation === 'createPayment') {
		const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
		const body: IDataObject = {
			type: this.getNodeParameter('paymentType', index) as string,
			account_id: this.getNodeParameter('account_id', index) as string,
			amount: this.getNodeParameter('amount', index) as number,
			currency: this.getNodeParameter('currency', index) as string,
			execution_date: this.getNodeParameter('execution_date', index) as string,
			is_salary: this.getNodeParameter('is_salary', index) as boolean,
			recipient: {
				name: this.getNodeParameter('recipientName', index) as string,
				iban: this.getNodeParameter('recipientIban', index) as string,
				address: {
					street_name: this.getNodeParameter('recipientStreetName', index) as string,
					house_number: this.getNodeParameter('recipientHouseNumber', index) as string,
					zip: this.getNodeParameter('recipientZip', index) as string,
					city: this.getNodeParameter('recipientCity', index) as string,
					country_code: this.getNodeParameter('recipientCountryCode', index) as string,
				},
			},
			...additionalFields,
		};
		return await bexioApiRequest.call(this, 'POST', '/4.0/banking/payments', body);
	}
	throw new Error(`Unknown operation: ${operation}`);
}

// =====================================
// Contact Relation Operations
// =====================================
export async function handleContactRelationOperations(this: IExecuteFunctions, operation: string, index: number): Promise<IDataObject | IDataObject[]> {
	const endpoint = '/2.0/contact_relation';
	const body = (): IDataObject => {
		const data: IDataObject = {
			contact_id: parseInt(this.getNodeParameter('contact_id', index) as string, 10),
			contact_sub_id: parseInt(this.getNodeParameter('contact_sub_id', index) as string, 10),
		};
		const description = this.getNodeParameter('description', index, '') as string;
		if (description) {
			data.description = description;
		}
		return data;
	};

	if (operation === 'create') {
		return await bexioApiRequest.call(this, 'POST', endpoint, body());
	}
	if (operation === 'update') {
		const id = this.getNodeParameter('contactRelationId', index) as string;
		return await bexioApiRequest.call(this, 'POST', `${endpoint}/${id}`, body());
	}
	if (operation === 'search') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const criteria = buildSearchBody(this.getNodeParameter('searchCriteria', index, {}) as IDataObject);
		if (returnAll) {
			return await bexioApiRequestAllItems.call(this, 'POST', `${endpoint}/search`, criteria);
		}
		const qs = { limit: this.getNodeParameter('limit', index) as number };
		return await bexioApiRequest.call(this, 'POST', `${endpoint}/search`, criteria, qs);
	}
	return handleGenericCRUD.call(this, operation, index, endpoint, 'contactRelationId');
}

// =====================================
// Additional Address Operations
// =====================================
export async function handleAdditionalAddressOperations(this: IExecuteFunctions, operation: string, index: number): Promise<IDataObject | IDataObject[]> {
	const contactId = this.getNodeParameter('contactId', index) as string;
	const endpoint = `/2.0/contact/${contactId}/additional_address`;

	if (operation === 'create') {
		const fields = this.getNodeParameter('addressFields', index, {}) as IDataObject;
		return await bexioApiRequest.call(this, 'POST', endpoint, fields);
	}
	if (operation === 'update') {
		const id = this.getNodeParameter('additionalAddressId', index) as string;
		const fields = this.getNodeParameter('addressFields', index, {}) as IDataObject;
		return await bexioApiRequest.call(this, 'POST', `${endpoint}/${id}`, fields);
	}
	if (operation === 'search') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const criteria = buildSearchBody(this.getNodeParameter('searchCriteria', index, {}) as IDataObject);
		if (returnAll) {
			return await bexioApiRequestAllItems.call(this, 'POST', `${endpoint}/search`, criteria);
		}
		const qs = { limit: this.getNodeParameter('limit', index) as number };
		return await bexioApiRequest.call(this, 'POST', `${endpoint}/search`, criteria, qs);
	}
	return handleGenericCRUD.call(this, operation, index, endpoint, 'additionalAddressId');
}

export async function handleAccountingOperations(this: IExecuteFunctions, operation: string, index: number): Promise<IDataObject | IDataObject[]> {
	if (operation === 'getAccounts') {
		return await bexioApiRequest.call(this, 'GET', '/3.0/accounts');
	}
	if (operation === 'getCurrencies') {
		return await bexioApiRequest.call(this, 'GET', '/3.0/currencies');
	}
	if (operation === 'getTaxes') {
		return await bexioApiRequest.call(this, 'GET', '/3.0/taxes');
	}
	if (operation === 'getVatPeriods') {
		return await bexioApiRequest.call(this, 'GET', '/3.0/vat_periods');
	}
	if (operation === 'createManualEntry') {
		const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
		return await bexioApiRequest.call(this, 'POST', '/3.0/accounting/manual_entries', additionalFields);
	}
	throw new Error(`Unknown operation: ${operation}`);
}

export async function handlePayrollOperations(this: IExecuteFunctions, operation: string, index: number): Promise<IDataObject | IDataObject[]> {
	if (operation === 'getEmployees') {
		return await bexioApiRequest.call(this, 'GET', '/3.0/payroll/employees');
	}
	if (operation === 'getEmployee') {
		const employeeId = this.getNodeParameter('employeeId', index) as string;
		return await bexioApiRequest.call(this, 'GET', `/3.0/payroll/employees/${employeeId}`);
	}
	if (operation === 'createAbsence') {
		const employeeId = this.getNodeParameter('employeeId', index) as string;
		const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
		const body = {
			employee_id: employeeId,
			...additionalFields,
		};
		return await bexioApiRequest.call(this, 'POST', `/3.0/payroll/absences`, body);
	}
	throw new Error(`Unknown operation: ${operation}`);
}

// Helper functions
async function handleDocumentOperations(this: IExecuteFunctions, operation: string, index: number, endpoint: string, idParam: string): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const contactId = this.getNodeParameter('contact_id', index) as string;
		const userId = this.getNodeParameter('user_id', index) as number;
		const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
		const body: IDataObject = {
			contact_id: parseInt(contactId, 10),
			user_id: userId,
			...additionalFields,
		};
		parsePositions.call(this, body, index);
		return await bexioApiRequest.call(this, 'POST', endpoint, body);
	}
	if (operation === 'update') {
		const id = this.getNodeParameter(idParam, index) as string;
		const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;
		return await bexioApiRequest.call(this, 'POST', `${endpoint}/${id}`, updateFields);
	}
	if (operation === 'search') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const criteria = buildSearchBody(this.getNodeParameter('searchCriteria', index, {}) as IDataObject);
		if (returnAll) {
			return await bexioApiRequestAllItems.call(this, 'POST', `${endpoint}/search`, criteria);
		}
		const qs = { limit: this.getNodeParameter('limit', index) as number };
		return await bexioApiRequest.call(this, 'POST', `${endpoint}/search`, criteria, qs);
	}
	if (operation === 'getPdf') {
		const id = this.getNodeParameter(idParam, index) as string;

		// Download PDF as binary data
		const pdfBuffer = await bexioApiRequestBinary.call(this, 'GET', `${endpoint}/${id}/pdf`);

		// Determine document type from endpoint
		const docType = endpoint.includes('kb_offer') ? 'quote' : endpoint.includes('kb_order') ? 'order' : 'document';

		// Return as binary data that n8n can handle
		const binaryData = await this.helpers.prepareBinaryData(
			pdfBuffer,
			`${docType}_${id}.pdf`,
			'application/pdf',
		);

		return {
			json: {
				[idParam]: id,
				fileName: `${docType}_${id}.pdf`,
				mimeType: 'application/pdf',
				fileSize: pdfBuffer.length,
			},
			binary: {
				data: binaryData,
			},
		} as any;
	}
	if (operation === 'issue') {
		const id = this.getNodeParameter(idParam, index) as string;
		return await bexioApiRequest.call(this, 'POST', `${endpoint}/${id}/issue`);
	}
	return handleGenericCRUDWithSearch.call(this, operation, index, endpoint, idParam);
}

async function handleGenericCRUD(this: IExecuteFunctions, operation: string, index: number, endpoint: string, idParam: string): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		return await bexioApiRequest.call(this, 'POST', endpoint, {});
	}
	if (operation === 'delete') {
		const id = this.getNodeParameter(idParam, index) as string;
		return await bexioApiRequest.call(this, 'DELETE', `${endpoint}/${id}`);
	}
	if (operation === 'get') {
		const id = this.getNodeParameter(idParam, index) as string;
		return await bexioApiRequest.call(this, 'GET', `${endpoint}/${id}`);
	}
	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		if (returnAll) {
			return await bexioApiRequestAllItems.call(this, 'GET', endpoint);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const qs = { limit };
			return await bexioApiRequest.call(this, 'GET', endpoint, {}, qs);
		}
	}
	if (operation === 'update') {
		const id = this.getNodeParameter(idParam, index) as string;
		return await bexioApiRequest.call(this, 'POST', `${endpoint}/${id}`, {});
	}
	throw new Error(`Unknown operation: ${operation}`);
}

async function handleGenericCRUDWithSearch(this: IExecuteFunctions, operation: string, index: number, endpoint: string, idParam: string): Promise<IDataObject | IDataObject[]> {
	if (operation === 'search') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		if (returnAll) {
			return await bexioApiRequestAllItems.call(this, 'POST', `${endpoint}/search`, []);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const qs = { limit };
			return await bexioApiRequest.call(this, 'POST', `${endpoint}/search`, [], qs);
		}
	}
	return handleGenericCRUD.call(this, operation, index, endpoint, idParam);
}
