import { INodeProperties } from 'n8n-workflow';

export const fileOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['file'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Upload a file', action: 'Upload a file' },
			{ name: 'Delete', value: 'delete', description: 'Delete a file', action: 'Delete a file' },
			{ name: 'Download', value: 'download', description: 'Download a file', action: 'Download a file' },
			{ name: 'Get', value: 'get', description: 'Get a file', action: 'Get a file' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many files', action: 'Get many files' },
			{ name: 'Search', value: 'search', description: 'Search files', action: 'Search files' },
		],
		default: 'getAll',
	},
];

export const fileFields: INodeProperties[] = [
	{
		displayName: 'File ID',
		name: 'fileId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['file'], operation: ['delete', 'get', 'download'] } },
		default: '',
		description: 'ID of the file',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['file'], operation: ['getAll', 'search'] } },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['file'], operation: ['getAll', 'search'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 2000 },
		default: 500,
		description: 'Max number of results to return',
	},
];
