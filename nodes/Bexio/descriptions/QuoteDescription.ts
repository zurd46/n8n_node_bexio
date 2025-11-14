import { INodeProperties } from 'n8n-workflow';

export const quoteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['quote'],
			},
		},
		options: [
			{ name: 'Create', value: 'create', description: 'Create a quote', action: 'Create a quote' },
			{ name: 'Delete', value: 'delete', description: 'Delete a quote', action: 'Delete a quote' },
			{ name: 'Get', value: 'get', description: 'Get a quote', action: 'Get a quote' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many quotes', action: 'Get many quotes' },
			{ name: 'Get PDF', value: 'getPdf', description: 'Get quote PDF', action: 'Get quote PDF' },
			{ name: 'Issue', value: 'issue', description: 'Issue a quote', action: 'Issue a quote' },
			{ name: 'Search', value: 'search', description: 'Search quotes', action: 'Search quotes' },
			{ name: 'Update', value: 'update', description: 'Update a quote', action: 'Update a quote' },
		],
		default: 'getAll',
	},
];

export const quoteFields: INodeProperties[] = [
	{
		displayName: 'Quote ID',
		name: 'quoteId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['quote'],
				operation: ['delete', 'get', 'update', 'issue', 'getPdf'],
			},
		},
		default: '',
		description: 'ID of the quote',
	},
	{
		displayName: 'Contact ID',
		name: 'contact_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['quote'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'ID of the contact for this quote',
	},
	{
		displayName: 'User Name or ID',
		name: 'user_id',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getUsers',
		},
		displayOptions: {
			show: {
				resource: ['quote'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'User responsible for this quote. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['quote'],
				operation: ['getAll', 'search'],
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
				resource: ['quote'],
				operation: ['getAll', 'search'],
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
];
