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
		displayName: 'Payment Type',
		name: 'paymentType',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['banking'], operation: ['createPayment'] } },
		options: [
			{ name: 'IBAN', value: 'iban' },
			{ name: 'QR', value: 'qr' },
		],
		default: 'iban',
	},
	{
		displayName: 'Bank Account UUID',
		name: 'account_id',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['banking'], operation: ['createPayment'] } },
		default: '',
		description: 'UUID of the bank account the payment is made from',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		required: true,
		typeOptions: { numberPrecision: 2 },
		displayOptions: { show: { resource: ['banking'], operation: ['createPayment'] } },
		default: 0,
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['banking'], operation: ['createPayment'] } },
		default: 'CHF',
		description: 'Currency according to ISO 4217',
	},
	{
		displayName: 'Execution Date',
		name: 'execution_date',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['banking'], operation: ['createPayment'] } },
		default: '',
		description: 'Date according to ISO 8601, for example 2026-12-31',
	},
	{
		displayName: 'Salary Payment',
		name: 'is_salary',
		type: 'boolean',
		required: true,
		displayOptions: { show: { resource: ['banking'], operation: ['createPayment'] } },
		default: false,
		description: 'Whether this is a salary payment',
	},
	{
		displayName: 'Recipient Name',
		name: 'recipientName',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['banking'], operation: ['createPayment'] } },
		default: '',
	},
	{
		displayName: 'Recipient IBAN',
		name: 'recipientIban',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['banking'], operation: ['createPayment'] } },
		default: '',
	},
	{
		displayName: 'Recipient Street Name',
		name: 'recipientStreetName',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['banking'], operation: ['createPayment'] } },
		default: '',
	},
	{
		displayName: 'Recipient House Number',
		name: 'recipientHouseNumber',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['banking'], operation: ['createPayment'] } },
		default: '',
	},
	{
		displayName: 'Recipient Postcode',
		name: 'recipientZip',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['banking'], operation: ['createPayment'] } },
		default: '',
	},
	{
		displayName: 'Recipient City',
		name: 'recipientCity',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['banking'], operation: ['createPayment'] } },
		default: '',
	},
	{
		displayName: 'Recipient Country Code',
		name: 'recipientCountryCode',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['banking'], operation: ['createPayment'] } },
		default: 'CH',
		description: 'Country code according to ISO 3166-1 alpha-2',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['banking'], operation: ['createPayment'] } },
		options: [
			{ displayName: 'Additional Information', name: 'additional_information', type: 'string', default: '' },
			{
				displayName: 'Allowance',
				name: 'allowance',
				type: 'options',
				options: [
					{ name: 'Fee Paid by Payee', value: 'fee_paid_by_payee' },
					{ name: 'Fee Paid by Payer', value: 'fee_paid_by_payer' },
					{ name: 'Fee Split', value: 'fee_split' },
					{ name: 'No Fee', value: 'no_fee' },
				],
				default: 'no_fee',
				description: 'For payments to other countries or with different currencies',
			},
			{ displayName: 'Message', name: 'message', type: 'string', default: '' },
			{ displayName: 'QR Reference Number', name: 'qr_reference_number', type: 'string', default: '' },
		],
	},
];
