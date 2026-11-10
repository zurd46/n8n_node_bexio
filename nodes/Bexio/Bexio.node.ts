import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
	JsonObject,
} from 'n8n-workflow';

import { contactOperations, contactFields } from './descriptions/ContactDescription';
import { contactRelationOperations, contactRelationFields } from './descriptions/ContactRelationDescription';
import { additionalAddressOperations, additionalAddressFields } from './descriptions/AdditionalAddressDescription';
import { invoiceOperations, invoiceFields } from './descriptions/InvoiceDescription';
import { itemOperations, itemFields } from './descriptions/ItemDescription';
import { quoteOperations, quoteFields } from './descriptions/QuoteDescription';
import { orderOperations, orderFields } from './descriptions/OrderDescription';
import { bankingOperations, bankingFields } from './descriptions/BankingDescription';

import { bexioApiRequest } from './GenericFunctions';

export class Bexio implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Bexio',
		name: 'bexio',
		icon: { light: 'file:../../icons/bexio.svg', dark: 'file:../../icons/bexio.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Bexio API',
		defaults: {
			name: 'Bexio',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'bexioApi',
				required: true,
				displayOptions: { show: { authentication: ['accessToken'] } },
			},
			{
				name: 'bexioOAuth2Api',
				required: true,
				displayOptions: { show: { authentication: ['oAuth2'] } },
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{ name: 'Access Token', value: 'accessToken' },
					{ name: 'OAuth2', value: 'oAuth2' },
				],
				default: 'accessToken',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Additional Address',
						value: 'additionalAddress',
						description: 'Further addresses of a contact, for example delivery addresses',
					},
					{
						name: 'Banking',
						value: 'banking',
						description: 'Bank accounts and payments',
					},
					{
						name: 'Contact',
						value: 'contact',
						description: 'Customers and suppliers',
					},
					{
						name: 'Contact Relation',
						value: 'contactRelation',
						description: 'Links between a company and a person',
					},
					{
						name: 'Invoice',
						value: 'invoice',
						description: 'Customer invoices',
					},
					{
						name: 'Item',
						value: 'item',
						description: 'Products and services',
					},
					{
						name: 'Order',
						value: 'order',
						description: 'Customer orders',
					},
					{
						name: 'Quote',
						value: 'quote',
						description: 'Customer quotes',
					},
				],
				default: 'contact',
			},
			...bankingOperations,
			...bankingFields,
			...contactOperations,
			...contactFields,
			...contactRelationOperations,
			...contactRelationFields,
			...additionalAddressOperations,
			...additionalAddressFields,
			...invoiceOperations,
			...invoiceFields,
			...itemOperations,
			...itemFields,
			...orderOperations,
			...orderFields,
			...quoteOperations,
			...quoteFields,
		],
		usableAsTool: true,
	};

	methods = {
		loadOptions: {
			async getContactSalutations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const salutations = (await bexioApiRequest.call(this, 'GET', '/2.0/salutation')) as IDataObject[];
				for (const salutation of salutations) {
					returnData.push({
						name: String(salutation.name),
						value: salutation.id as number,
					});
				}
				return returnData;
			},
			async getContactTitles(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const titles = (await bexioApiRequest.call(this, 'GET', '/2.0/title')) as IDataObject[];
				for (const title of titles) {
					returnData.push({
						name: String(title.name),
						value: title.id as number,
					});
				}
				return returnData;
			},
			async getCountries(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const countries = (await bexioApiRequest.call(this, 'GET', '/2.0/country')) as IDataObject[];
				for (const country of countries) {
					returnData.push({
						name: String(country.name),
						value: country.id as number,
					});
				}
				return returnData;
			},
			async getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const projects = (await bexioApiRequest.call(this, 'GET', '/2.0/pr_project')) as IDataObject[];
				for (const project of projects) {
					returnData.push({
						name: String(project.name),
						value: project.id as number,
					});
				}
				return returnData;
			},
			async getProjectStatuses(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const statuses = (await bexioApiRequest.call(this, 'GET', '/2.0/project/status')) as IDataObject[];
				for (const status of statuses) {
					returnData.push({
						name: String(status.name),
						value: status.id as number,
					});
				}
				return returnData;
			},
			async getProjectTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const types = (await bexioApiRequest.call(this, 'GET', '/2.0/project/type')) as IDataObject[];
				for (const type of types) {
					returnData.push({
						name: String(type.name),
						value: type.id as number,
					});
				}
				return returnData;
			},
			async getActivities(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const activities = (await bexioApiRequest.call(this, 'GET', '/2.0/business_activity')) as IDataObject[];
				for (const activity of activities) {
					returnData.push({
						name: String(activity.name),
						value: activity.id as number,
					});
				}
				return returnData;
			},
			async getTimesheetStatuses(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const statuses = (await bexioApiRequest.call(this, 'GET', '/2.0/timesheet/status')) as IDataObject[];
				for (const status of statuses) {
					returnData.push({
						name: String(status.name),
						value: status.id as number,
					});
				}
				return returnData;
			},
			async getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const users = (await bexioApiRequest.call(this, 'GET', '/3.0/users')) as IDataObject[];
				for (const user of users) {
					const name = `${user.firstname} ${user.lastname}`;
					returnData.push({
						name,
						value: user.id as number,
					});
				}
				return returnData;
			},
			async getUnits(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const units = (await bexioApiRequest.call(this, 'GET', '/2.0/unit')) as IDataObject[];
				for (const unit of units) {
					returnData.push({
						name: String(unit.name),
						value: unit.id as number,
					});
				}
				return returnData;
			},
			async getAccounts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const accounts = (await bexioApiRequest.call(this, 'GET', '/2.0/accounts')) as IDataObject[];
				for (const account of accounts) {
					const name = `${account.account_no} - ${account.name}`;
					returnData.push({
						name,
						value: account.id as number,
					});
				}
				return returnData;
			},
			async getTaxes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const taxes = (await bexioApiRequest.call(this, 'GET', '/3.0/taxes')) as IDataObject[];
				for (const tax of taxes) {
					returnData.push({
						name: tax.value === undefined ? String(tax.display_name ?? tax.name) : `${tax.display_name ?? tax.name} (${tax.value}%)`,
						value: tax.id as number,
					});
				}
				return returnData;
			},
			async getCurrencies(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const currencies = (await bexioApiRequest.call(this, 'GET', '/3.0/currencies')) as IDataObject[];
				for (const currency of currencies) {
					returnData.push({
						name: String(currency.name),
						value: currency.id as number,
					});
				}
				return returnData;
			},
			async getLanguages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const languages = (await bexioApiRequest.call(this, 'GET', '/2.0/language')) as IDataObject[];
				for (const language of languages) {
					returnData.push({
						name: String(language.name),
						value: language.id as number,
					});
				}
				return returnData;
			},
			async getTaskPriorities(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const priorities = (await bexioApiRequest.call(this, 'GET', '/2.0/task/priority')) as IDataObject[];
				for (const priority of priorities) {
					returnData.push({
						name: String(priority.name),
						value: priority.id as number,
					});
				}
				return returnData;
			},
			async getTaskStatuses(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const statuses = (await bexioApiRequest.call(this, 'GET', '/2.0/task/status')) as IDataObject[];
				for (const status of statuses) {
					returnData.push({
						name: String(status.name),
						value: status.id as number,
					});
				}
				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

				if (resource === 'banking') {
					responseData = await handleBankingOperations.call(this, operation, i);
				} else if (resource === 'contact') {
					responseData = await handleContactOperations.call(this, operation, i);
				} else if (resource === 'contactRelation') {
					responseData = await handleContactRelationOperations.call(this, operation, i);
				} else if (resource === 'additionalAddress') {
					responseData = await handleAdditionalAddressOperations.call(this, operation, i);
				} else if (resource === 'invoice') {
					responseData = await handleInvoiceOperations.call(this, operation, i);
				} else if (resource === 'item') {
					responseData = await handleItemOperations.call(this, operation, i);
				} else if (resource === 'order') {
					responseData = await handleOrderOperations.call(this, operation, i);
				} else if (resource === 'quote') {
					responseData = await handleQuoteOperations.call(this, operation, i);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: errorMessage }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				// Keep the HTTP details of API errors; wrap everything else with the item index
				if (error instanceof NodeApiError) {
					throw new NodeApiError(this.getNode(), error as unknown as JsonObject, { itemIndex: i });
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}

import * as handlers from './OperationsHandlers';

// Re-export handlers for use in execute function
const handleBankingOperations = handlers.handleBankingOperations;
const handleContactOperations = handlers.handleContactOperations;
const handleContactRelationOperations = handlers.handleContactRelationOperations;
const handleAdditionalAddressOperations = handlers.handleAdditionalAddressOperations;
const handleInvoiceOperations = handlers.handleInvoiceOperations;
const handleItemOperations = handlers.handleItemOperations;
const handleOrderOperations = handlers.handleOrderOperations;
const handleQuoteOperations = handlers.handleQuoteOperations;
