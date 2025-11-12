import { INodeProperties } from 'n8n-workflow';

export const invoiceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an invoice',
				action: 'Create an invoice',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an invoice',
				action: 'Delete an invoice',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an invoice',
				action: 'Get an invoice',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many invoices',
				action: 'Get many invoices',
			},
			{
				name: 'Get PDF',
				value: 'getPdf',
				description: 'Get invoice PDF',
				action: 'Get invoice PDF',
			},
			{
				name: 'Issue',
				value: 'issue',
				description: 'Issue an invoice',
				action: 'Issue an invoice',
			},
			{
				name: 'Mark as Sent',
				value: 'markAsSent',
				description: 'Mark invoice as sent',
				action: 'Mark invoice as sent',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search invoices',
				action: 'Search invoices',
			},
			{
				name: 'Send',
				value: 'send',
				description: 'Send invoice by email',
				action: 'Send invoice by email',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an invoice',
				action: 'Update an invoice',
			},
		],
		default: 'getAll',
	},
];

export const invoiceFields: INodeProperties[] = [
	// ----------------------------------
	//         invoice: create
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contact_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'ID of the contact for this invoice',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Invoice title',
			},
			{
				displayName: 'Document Number',
				name: 'document_nr',
				type: 'string',
				default: '',
				description: 'Invoice number (auto-generated if not provided)',
			},
			{
				displayName: 'Reference',
				name: 'reference',
				type: 'string',
				default: '',
				description: 'Your reference number',
			},
			{
				displayName: 'Contact Address',
				name: 'contact_address',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				description: 'Complete address of the contact',
			},
			{
				displayName: 'User ID',
				name: 'user_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getUsers',
				},
				default: '',
				description: 'Responsible user',
			},
			{
				displayName: 'Project ID',
				name: 'project_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getProjects',
				},
				default: '',
				description: 'Associated project',
			},
			{
				displayName: 'Language',
				name: 'language_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getLanguages',
				},
				default: '',
				description: 'Language of the invoice',
			},
			{
				displayName: 'Bank Account ID',
				name: 'bank_account_id',
				type: 'string',
				default: '',
				description: 'Bank account for payment',
			},
			{
				displayName: 'Currency ID',
				name: 'currency_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getCurrencies',
				},
				default: '',
				description: 'Currency for the invoice',
			},
			{
				displayName: 'Payment Type ID',
				name: 'payment_type_id',
				type: 'string',
				default: '',
				description: 'Payment type',
			},
			{
				displayName: 'Header',
				name: 'header',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				description: 'Header text',
			},
			{
				displayName: 'Footer',
				name: 'footer',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				description: 'Footer text',
			},
			{
				displayName: 'Mwst Type',
				name: 'mwst_type',
				type: 'options',
				options: [
					{ name: 'Including', value: 0 },
					{ name: 'Excluding', value: 1 },
					{ name: 'Exempt', value: 2 },
				],
				default: 0,
				description: 'VAT type',
			},
			{
				displayName: 'Mwst is Net',
				name: 'mwst_is_net',
				type: 'boolean',
				default: true,
				description: 'Whether the VAT is calculated on net amounts',
			},
			{
				displayName: 'Show Position Taxes',
				name: 'show_position_taxes',
				type: 'boolean',
				default: false,
				description: 'Whether to show taxes on positions',
			},
			{
				displayName: 'Is Valid From',
				name: 'is_valid_from',
				type: 'dateTime',
				default: '',
				description: 'Valid from date',
			},
			{
				displayName: 'Is Valid To',
				name: 'is_valid_to',
				type: 'dateTime',
				default: '',
				description: 'Valid to date',
			},
			{
				displayName: 'Positions',
				name: 'positions',
				type: 'json',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				description: 'Invoice positions as JSON array',
			},
		],
	},

	// ----------------------------------
	//         invoice: delete/get/issue/markAsSent
	// ----------------------------------
	{
		displayName: 'Invoice ID',
		name: 'invoiceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['delete', 'get', 'issue', 'markAsSent', 'getPdf'],
			},
		},
		default: '',
		description: 'ID of the invoice',
	},

	// ----------------------------------
	//         invoice: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 2000,
		},
		default: 500,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Order By',
				name: 'order_by',
				type: 'string',
				default: 'id',
				description: 'Field to sort by',
			},
			{
				displayName: 'Status',
				name: 'kb_item_status_id',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Draft', value: '1' },
					{ name: 'Pending', value: '5' },
					{ name: 'Paid', value: '9' },
					{ name: 'Partially Paid', value: '10' },
					{ name: 'Overdue', value: '18' },
					{ name: 'Cancelled', value: '19' },
				],
				default: '',
				description: 'Filter invoices by status',
			},
			{
				displayName: 'Overdue Only',
				name: 'overdue_only',
				type: 'boolean',
				default: false,
				description: 'Whether to return only overdue invoices',
			},
			{
				displayName: 'Unpaid Only',
				name: 'unpaid_only',
				type: 'boolean',
				default: false,
				description: 'Whether to return only unpaid invoices',
			},
		],
	},

	// ----------------------------------
	//         invoice: search
	// ----------------------------------
	{
		displayName: 'Search Criteria',
		name: 'searchCriteria',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Criterion',
		default: {},
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['search'],
			},
		},
		options: [
			{
				name: 'criteria',
				displayName: 'Criterion',
				values: [
					{
						displayName: 'Field',
						name: 'field',
						type: 'options',
						options: [
							{ name: 'Contact ID', value: 'contact_id' },
							{ name: 'Document Number', value: 'document_nr' },
							{ name: 'Title', value: 'title' },
							{ name: 'Total', value: 'total' },
						],
						default: 'contact_id',
					},
					{
						displayName: 'Criteria',
						name: 'criteria',
						type: 'options',
						options: [
							{ name: '=', value: '=' },
							{ name: 'Like', value: 'like' },
							{ name: '>', value: '>' },
							{ name: '<', value: '<' },
						],
						default: '=',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['search'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['search'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 2000,
		},
		default: 500,
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         invoice: send
	// ----------------------------------
	{
		displayName: 'Invoice ID',
		name: 'invoiceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['send'],
			},
		},
		default: '',
		description: 'ID of the invoice to send',
	},
	{
		displayName: 'Recipient',
		name: 'recipient',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['send'],
			},
		},
		default: '',
		description: 'Email address of the recipient',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['send'],
			},
		},
		options: [
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				description: 'Email subject',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				description: 'Email message',
			},
			{
				displayName: 'Mark as Sent',
				name: 'mark_as_sent',
				type: 'boolean',
				default: true,
				description: 'Whether to mark the invoice as sent',
			},
		],
	},

	// ----------------------------------
	//         invoice: update
	// ----------------------------------
	{
		displayName: 'Invoice ID',
		name: 'invoiceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'ID of the invoice to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Reference',
				name: 'reference',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Header',
				name: 'header',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
			},
			{
				displayName: 'Footer',
				name: 'footer',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
			},
			{
				displayName: 'Positions',
				name: 'positions',
				type: 'json',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
			},
		],
	},
];
