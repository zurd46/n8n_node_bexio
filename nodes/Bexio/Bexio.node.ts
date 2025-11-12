import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	NodeApiError,
} from 'n8n-workflow';

import { contactOperations, contactFields } from './descriptions/ContactDescription';
import { invoiceOperations, invoiceFields } from './descriptions/InvoiceDescription';
import { projectOperations, projectFields } from './descriptions/ProjectDescription';
import { itemOperations, itemFields } from './descriptions/ItemDescription';
import { timesheetOperations, timesheetFields } from './descriptions/TimesheetDescription';
import { quoteOperations, quoteFields } from './descriptions/QuoteDescription';
import { orderOperations, orderFields } from './descriptions/OrderDescription';
import { billOperations, billFields } from './descriptions/BillDescription';
import { expenseOperations, expenseFields } from './descriptions/ExpenseDescription';
import { taskOperations, taskFields } from './descriptions/TaskDescription';
import { fileOperations, fileFields } from './descriptions/FileDescription';
import { bankingOperations, bankingFields } from './descriptions/BankingDescription';
import { accountingOperations, accountingFields } from './descriptions/AccountingDescription';
import { payrollOperations, payrollFields } from './descriptions/PayrollDescription';

import { bexioApiRequest, bexioApiRequestAllItems } from './GenericFunctions';

export class Bexio implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Bexio',
		name: 'bexio',
		icon: 'file:bexio.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Bexio API',
		defaults: {
			name: 'Bexio',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'bexioApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Accounting',
						value: 'accounting',
					},
					{
						name: 'Banking',
						value: 'banking',
					},
					{
						name: 'Bill',
						value: 'bill',
					},
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'Expense',
						value: 'expense',
					},
					{
						name: 'File',
						value: 'file',
					},
					{
						name: 'Invoice',
						value: 'invoice',
					},
					{
						name: 'Item',
						value: 'item',
					},
					{
						name: 'Order',
						value: 'order',
					},
					{
						name: 'Payroll',
						value: 'payroll',
					},
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Quote',
						value: 'quote',
					},
					{
						name: 'Task',
						value: 'task',
					},
					{
						name: 'Timesheet',
						value: 'timesheet',
					},
				],
				default: 'contact',
			},
			...contactOperations,
			...contactFields,
			...invoiceOperations,
			...invoiceFields,
			...projectOperations,
			...projectFields,
			...itemOperations,
			...itemFields,
			...timesheetOperations,
			...timesheetFields,
			...quoteOperations,
			...quoteFields,
			...orderOperations,
			...orderFields,
			...billOperations,
			...billFields,
			...expenseOperations,
			...expenseFields,
			...taskOperations,
			...taskFields,
			...fileOperations,
			...fileFields,
			...bankingOperations,
			...bankingFields,
			...accountingOperations,
			...accountingFields,
			...payrollOperations,
			...payrollFields,
		],
	};

	methods = {
		loadOptions: {
			async getContactSalutations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const salutations = await bexioApiRequest.call(this, 'GET', '/2.0/salutation');
				for (const salutation of salutations) {
					returnData.push({
						name: salutation.name,
						value: salutation.id,
					});
				}
				return returnData;
			},
			async getContactTitles(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const titles = await bexioApiRequest.call(this, 'GET', '/2.0/title');
				for (const title of titles) {
					returnData.push({
						name: title.name,
						value: title.id,
					});
				}
				return returnData;
			},
			async getCountries(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const countries = await bexioApiRequest.call(this, 'GET', '/2.0/country');
				for (const country of countries) {
					returnData.push({
						name: country.name,
						value: country.id,
					});
				}
				return returnData;
			},
			async getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const projects = await bexioApiRequest.call(this, 'GET', '/2.0/project');
				for (const project of projects) {
					returnData.push({
						name: project.name,
						value: project.id,
					});
				}
				return returnData;
			},
			async getProjectStatuses(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const statuses = await bexioApiRequest.call(this, 'GET', '/2.0/project/status');
				for (const status of statuses) {
					returnData.push({
						name: status.name,
						value: status.id,
					});
				}
				return returnData;
			},
			async getProjectTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const types = await bexioApiRequest.call(this, 'GET', '/2.0/project/type');
				for (const type of types) {
					returnData.push({
						name: type.name,
						value: type.id,
					});
				}
				return returnData;
			},
			async getActivities(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const activities = await bexioApiRequest.call(this, 'GET', '/2.0/business_activity');
				for (const activity of activities) {
					returnData.push({
						name: activity.name,
						value: activity.id,
					});
				}
				return returnData;
			},
			async getTimesheetStatuses(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const statuses = await bexioApiRequest.call(this, 'GET', '/2.0/timesheet/status');
				for (const status of statuses) {
					returnData.push({
						name: status.name,
						value: status.id,
					});
				}
				return returnData;
			},
			async getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const users = await bexioApiRequest.call(this, 'GET', '/2.0/user');
				for (const user of users) {
					const name = `${user.firstname} ${user.lastname}`;
					returnData.push({
						name,
						value: user.id,
					});
				}
				return returnData;
			},
			async getUnits(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const units = await bexioApiRequest.call(this, 'GET', '/2.0/unit');
				for (const unit of units) {
					returnData.push({
						name: unit.name,
						value: unit.id,
					});
				}
				return returnData;
			},
			async getAccounts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const accounts = await bexioApiRequest.call(this, 'GET', '/2.0/account');
				for (const account of accounts) {
					const name = `${account.account_no} - ${account.name}`;
					returnData.push({
						name,
						value: account.id,
					});
				}
				return returnData;
			},
			async getTaxes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const taxes = await bexioApiRequest.call(this, 'GET', '/2.0/tax');
				for (const tax of taxes) {
					returnData.push({
						name: `${tax.name} (${tax.value}%)`,
						value: tax.id,
					});
				}
				return returnData;
			},
			async getCurrencies(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const currencies = await bexioApiRequest.call(this, 'GET', '/2.0/currency');
				for (const currency of currencies) {
					returnData.push({
						name: `${currency.name} (${currency.code})`,
						value: currency.id,
					});
				}
				return returnData;
			},
			async getTaskPriorities(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const priorities = await bexioApiRequest.call(this, 'GET', '/2.0/task/priority');
				for (const priority of priorities) {
					returnData.push({
						name: priority.name,
						value: priority.id,
					});
				}
				return returnData;
			},
			async getTaskStatuses(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const statuses = await bexioApiRequest.call(this, 'GET', '/2.0/task/status');
				for (const status of statuses) {
					returnData.push({
						name: status.name,
						value: status.id,
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

				if (resource === 'contact') {
					responseData = await handleContactOperations.call(this, operation, i);
				} else if (resource === 'invoice') {
					responseData = await handleInvoiceOperations.call(this, operation, i);
				} else if (resource === 'project') {
					responseData = await handleProjectOperations.call(this, operation, i);
				} else if (resource === 'item') {
					responseData = await handleItemOperations.call(this, operation, i);
				} else if (resource === 'timesheet') {
					responseData = await handleTimesheetOperations.call(this, operation, i);
				} else if (resource === 'quote') {
					responseData = await handleQuoteOperations.call(this, operation, i);
				} else if (resource === 'order') {
					responseData = await handleOrderOperations.call(this, operation, i);
				} else if (resource === 'bill') {
					responseData = await handleBillOperations.call(this, operation, i);
				} else if (resource === 'expense') {
					responseData = await handleExpenseOperations.call(this, operation, i);
				} else if (resource === 'task') {
					responseData = await handleTaskOperations.call(this, operation, i);
				} else if (resource === 'file') {
					responseData = await handleFileOperations.call(this, operation, i);
				} else if (resource === 'banking') {
					responseData = await handleBankingOperations.call(this, operation, i);
				} else if (resource === 'accounting') {
					responseData = await handleAccountingOperations.call(this, operation, i);
				} else if (resource === 'payroll') {
					responseData = await handlePayrollOperations.call(this, operation, i);
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
				throw error;
			}
		}

		return [returnData];
	}
}

import * as handlers from './OperationsHandlers';

// Re-export handlers for use in execute function
const handleContactOperations = handlers.handleContactOperations;
const handleInvoiceOperations = handlers.handleInvoiceOperations;
const handleProjectOperations = handlers.handleProjectOperations;
const handleItemOperations = handlers.handleItemOperations;
const handleTimesheetOperations = handlers.handleTimesheetOperations;
const handleQuoteOperations = handlers.handleQuoteOperations;
const handleOrderOperations = handlers.handleOrderOperations;
const handleBillOperations = handlers.handleBillOperations;
const handleExpenseOperations = handlers.handleExpenseOperations;
const handleTaskOperations = handlers.handleTaskOperations;
const handleFileOperations = handlers.handleFileOperations;
const handleBankingOperations = handlers.handleBankingOperations;
const handleAccountingOperations = handlers.handleAccountingOperations;
const handlePayrollOperations = handlers.handlePayrollOperations;
