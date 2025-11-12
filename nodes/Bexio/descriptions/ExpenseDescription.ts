import { INodeProperties } from 'n8n-workflow';

export const expenseOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['expense'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create an expense', action: 'Create an expense' },
			{ name: 'Delete', value: 'delete', description: 'Delete an expense', action: 'Delete an expense' },
			{ name: 'Get', value: 'get', description: 'Get an expense', action: 'Get an expense' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many expenses', action: 'Get many expenses' },
			{ name: 'Update', value: 'update', description: 'Update an expense', action: 'Update an expense' },
		],
		default: 'getAll',
	},
];

export const expenseFields: INodeProperties[] = [
	{
		displayName: 'Expense ID',
		name: 'expenseId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['expense'], operation: ['delete', 'get', 'update'] } },
		default: '',
		description: 'ID of the expense',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['expense'], operation: ['getAll'] } },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['expense'], operation: ['getAll'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 2000 },
		default: 500,
		description: 'Max number of results to return',
	},
];
