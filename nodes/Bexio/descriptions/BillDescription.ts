import { INodeProperties } from 'n8n-workflow';

export const billOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['bill'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a bill', action: 'Create a bill' },
			{ name: 'Delete', value: 'delete', description: 'Delete a bill', action: 'Delete a bill' },
			{ name: 'Get', value: 'get', description: 'Get a bill', action: 'Get a bill' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many bills', action: 'Get many bills' },
			{ name: 'Update', value: 'update', description: 'Update a bill', action: 'Update a bill' },
		],
		default: 'getAll',
	},
];

export const billFields: INodeProperties[] = [
	{
		displayName: 'Bill ID',
		name: 'billId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['bill'], operation: ['delete', 'get', 'update'] } },
		default: '',
		description: 'ID of the bill',
	},
	{
		displayName: 'Contact ID',
		name: 'contact_id',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['bill'], operation: ['create'] } },
		default: '',
		description: 'ID of the contact',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['bill'], operation: ['getAll'] } },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['bill'], operation: ['getAll'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 2000 },
		default: 500,
		description: 'Max number of results to return',
	},
];
