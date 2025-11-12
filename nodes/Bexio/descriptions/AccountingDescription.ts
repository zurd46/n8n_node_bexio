import { INodeProperties } from 'n8n-workflow';

export const accountingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['accounting'] } },
		options: [
			{ name: 'Create Manual Entry', value: 'createManualEntry', description: 'Create a manual entry', action: 'Create a manual entry' },
			{ name: 'Get Accounts', value: 'getAccounts', description: 'Get accounts', action: 'Get accounts' },
			{ name: 'Get Currencies', value: 'getCurrencies', description: 'Get currencies', action: 'Get currencies' },
			{ name: 'Get Taxes', value: 'getTaxes', description: 'Get taxes', action: 'Get taxes' },
			{ name: 'Get VAT Periods', value: 'getVatPeriods', description: 'Get VAT periods', action: 'Get VAT periods' },
		],
		default: 'getAccounts',
	},
];

export const accountingFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['accounting'], operation: ['getAccounts', 'getCurrencies', 'getTaxes', 'getVatPeriods'] } },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['accounting'], operation: ['getAccounts', 'getCurrencies', 'getTaxes', 'getVatPeriods'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 2000 },
		default: 500,
		description: 'Max number of results to return',
	},
];
