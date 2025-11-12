import {
	IExecuteFunctions,
	IDataObject,
} from 'n8n-workflow';

import { bexioApiRequest, bexioApiRequestAllItems, bexioApiRequestBinary } from './GenericFunctions';

// =====================================
// Contact Operations
// =====================================
export async function handleContactOperations(this: IExecuteFunctions, operation: string, index: number): Promise<IDataObject | IDataObject[]> {
	const resource = 'contact';

	if (operation === 'create') {
		const contactTypeId = this.getNodeParameter('contact_type_id', index) as number;
		const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

		const body: IDataObject = {
			contact_type_id: contactTypeId,
			...additionalFields,
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

		const body: any[] = [];
		if (searchCriteria.criteria && Array.isArray(searchCriteria.criteria)) {
			for (const criterion of searchCriteria.criteria) {
				body.push({
					field: criterion.field,
					value: criterion.value,
					criteria: criterion.criteria,
				});
			}
		}

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
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		return await bexioApiRequest.call(this, 'POST', `/2.0/contact/${contactId}`, updateFields);
	}

	throw new Error(`Unknown operation: ${operation}`);
}

// =====================================
// Invoice Operations
// =====================================
export async function handleInvoiceOperations(this: IExecuteFunctions, operation: string, index: number): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const contactId = this.getNodeParameter('contact_id', index) as string;
		const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

		const body: IDataObject = {
			contact_id: parseInt(contactId, 10),
			...additionalFields,
		};

		if (body.positions && typeof body.positions === 'string') {
			body.positions = JSON.parse(body.positions as string);
		}

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

		// Remove empty status filter
		if (qs.kb_item_status_id === '') {
			delete qs.kb_item_status_id;
		}

		// Handle special filters
		if (qs.overdue_only) {
			qs.kb_item_status_id = '18'; // Overdue status
			delete qs.overdue_only;
		}

		if (qs.unpaid_only) {
			// Unpaid includes: Pending (5), Partially Paid (10), Overdue (18)
			// Note: Bexio API might not support multiple status IDs in one request
			// We'll filter for Pending status and let user handle other statuses via search
			if (!qs.kb_item_status_id) {
				qs.kb_item_status_id = '5'; // Pending
			}
			delete qs.unpaid_only;
		}

		if (returnAll) {
			return await bexioApiRequestAllItems.call(this, 'GET', '/2.0/kb_invoice', {}, qs);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			qs.limit = limit;
			return await bexioApiRequest.call(this, 'GET', '/2.0/kb_invoice', {}, qs);
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

		const body: any[] = [];
		if (searchCriteria.criteria && Array.isArray(searchCriteria.criteria)) {
			for (const criterion of searchCriteria.criteria) {
				body.push({
					field: criterion.field,
					value: criterion.value,
					criteria: criterion.criteria,
				});
			}
		}

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
		const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

		const body: IDataObject = {
			recipient,
			...additionalFields,
		};

		return await bexioApiRequest.call(this, 'POST', `/2.0/kb_invoice/${invoiceId}/send`, body);
	}

	if (operation === 'update') {
		const invoiceId = this.getNodeParameter('invoiceId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		if (updateFields.positions && typeof updateFields.positions === 'string') {
			updateFields.positions = JSON.parse(updateFields.positions as string);
		}

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

		const body: any[] = [];
		if (searchCriteria.criteria && Array.isArray(searchCriteria.criteria)) {
			for (const criterion of searchCriteria.criteria) {
				body.push({
					field: criterion.field,
					value: criterion.value,
					criteria: criterion.criteria,
				});
			}
		}

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

		const body: IDataObject = {
			intern_name: internName,
			...additionalFields,
		};

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

		const body: any[] = [];
		if (searchCriteria.criteria && Array.isArray(searchCriteria.criteria)) {
			for (const criterion of searchCriteria.criteria) {
				body.push({
					field: criterion.field,
					value: criterion.value,
					criteria: criterion.criteria,
				});
			}
		}

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
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

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

		const body: any[] = [];
		if (searchCriteria.criteria && Array.isArray(searchCriteria.criteria)) {
			for (const criterion of searchCriteria.criteria) {
				body.push({
					field: criterion.field,
					value: criterion.value,
					criteria: criterion.criteria,
				});
			}
		}

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
		return await bexioApiRequest.call(this, 'GET', '/3.0/banking/accounts');
	}
	if (operation === 'getPayments') {
		return await bexioApiRequest.call(this, 'GET', '/3.0/banking/payments');
	}
	if (operation === 'getPayment') {
		const paymentId = this.getNodeParameter('paymentId', index) as string;
		return await bexioApiRequest.call(this, 'GET', `/3.0/banking/payments/${paymentId}`);
	}
	if (operation === 'createPayment') {
		return await bexioApiRequest.call(this, 'POST', '/3.0/banking/payments', {});
	}
	throw new Error(`Unknown operation: ${operation}`);
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
		const body: IDataObject = { contact_id: parseInt(contactId, 10) };
		return await bexioApiRequest.call(this, 'POST', endpoint, body);
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
