import { INodeProperties } from 'n8n-workflow';

export const taskOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['task'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a task', action: 'Create a task' },
			{ name: 'Delete', value: 'delete', description: 'Delete a task', action: 'Delete a task' },
			{ name: 'Get', value: 'get', description: 'Get a task', action: 'Get a task' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many tasks', action: 'Get many tasks' },
			{ name: 'Search', value: 'search', description: 'Search tasks', action: 'Search tasks' },
			{ name: 'Update', value: 'update', description: 'Update a task', action: 'Update a task' },
		],
		default: 'getAll',
	},
];

export const taskFields: INodeProperties[] = [
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['task'], operation: ['delete', 'get', 'update'] } },
		default: '',
		description: 'ID of the task',
	},
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['task'], operation: ['create'] } },
		default: '',
		description: 'Task subject',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['task'], operation: ['getAll', 'search'] } },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['task'], operation: ['getAll', 'search'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 2000 },
		default: 500,
		description: 'Max number of results to return',
	},
];
