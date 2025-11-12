import { INodeProperties } from 'n8n-workflow';

export const bankingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['banking'] } },
		options: [
			{ name: 'Create Payment', value: 'createPayment', description: 'Create a payment', action: 'Create a payment' },
			{ name: 'Get Bank Accounts', value: 'getBankAccounts', description: 'Get bank accounts', action: 'Get bank accounts' },
			{ name: 'Get Payment', value: 'getPayment', description: 'Get a payment', action: 'Get a payment' },
			{ name: 'Get Payments', value: 'getPayments', description: 'Get many payments', action: 'Get many payments' },
		],
		default: 'getBankAccounts',
	},
];

export const bankingFields: INodeProperties[] = [
	{
		displayName: 'Payment ID',
		name: 'paymentId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['banking'], operation: ['getPayment'] } },
		default: '',
		description: 'ID of the payment',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['banking'], operation: ['getPayments'] } },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['banking'], operation: ['getPayments'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 2000 },
		default: 500,
		description: 'Max number of results to return',
	},
];
