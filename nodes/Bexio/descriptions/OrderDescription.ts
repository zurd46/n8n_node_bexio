import { INodeProperties } from 'n8n-workflow';

export const orderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['order'],
			},
		},
		options: [
			{ name: 'Create', value: 'create', description: 'Create an order', action: 'Create an order' },
			{ name: 'Delete', value: 'delete', description: 'Delete an order', action: 'Delete an order' },
			{ name: 'Get', value: 'get', description: 'Get an order', action: 'Get an order' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many orders', action: 'Get many orders' },
			{ name: 'Get PDF', value: 'getPdf', description: 'Get order PDF', action: 'Get order PDF' },
			{ name: 'Search', value: 'search', description: 'Search orders', action: 'Search orders' },
			{ name: 'Update', value: 'update', description: 'Update an order', action: 'Update an order' },
		],
		default: 'getAll',
	},
];

export const orderFields: INodeProperties[] = [
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['delete', 'get', 'update', 'getPdf'],
			},
		},
		default: '',
		description: 'ID of the order',
	},
	{
		displayName: 'Contact ID',
		name: 'contact_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'ID of the contact for this order',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['order'],
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
				resource: ['order'],
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
