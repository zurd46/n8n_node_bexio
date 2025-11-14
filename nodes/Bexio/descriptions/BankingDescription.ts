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
			{ name: 'Get Bank Account', value: 'getBankAccount', description: 'Get a bank account', action: 'Get a bank account' },
			{ name: 'Get Bank Accounts', value: 'getBankAccounts', description: 'Get all bank accounts', action: 'Get all bank accounts' },
			{ name: 'Get Payment', value: 'getPayment', description: 'Get a payment', action: 'Get a payment' },
			{ name: 'Get Payments', value: 'getPayments', description: 'Get many payments', action: 'Get many payments' },
		],
		default: 'getBankAccounts',
	},
];

export const bankingFields: INodeProperties[] = [
	// ----------------------------------
	//         banking: getBankAccount
	// ----------------------------------
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['banking'], operation: ['getBankAccount'] } },
		default: '',
		description: 'ID of the bank account',
	},

	// ----------------------------------
	//         banking: getBankAccounts
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['banking'], operation: ['getBankAccounts'] } },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['banking'], operation: ['getBankAccounts'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 2000 },
		default: 500,
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         banking: getPayment
	// ----------------------------------
	{
		displayName: 'Payment ID',
		name: 'paymentId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['banking'], operation: ['getPayment'] } },
		default: '',
		description: 'ID of the payment',
	},

	// ----------------------------------
	//         banking: getPayments
	// ----------------------------------
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

	// ----------------------------------
	//         banking: createPayment
	// ----------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['banking'], operation: ['createPayment'] } },
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Payment title',
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: 0,
				description: 'Payment amount',
			},
			{
				displayName: 'Bank Account ID',
				name: 'bank_account_id',
				type: 'string',
				default: '',
				description: 'ID of the bank account',
			},
		],
	},
];
