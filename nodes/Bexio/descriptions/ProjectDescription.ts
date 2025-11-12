import { INodeProperties } from 'n8n-workflow';

export const projectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['project'],
			},
		},
		options: [
			{ name: 'Archive', value: 'archive', description: 'Archive a project', action: 'Archive a project' },
			{ name: 'Create', value: 'create', description: 'Create a project', action: 'Create a project' },
			{ name: 'Delete', value: 'delete', description: 'Delete a project', action: 'Delete a project' },
			{ name: 'Get', value: 'get', description: 'Get a project', action: 'Get a project' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many projects', action: 'Get many projects' },
			{ name: 'Search', value: 'search', description: 'Search projects', action: 'Search projects' },
			{ name: 'Unarchive', value: 'unarchive', description: 'Unarchive a project', action: 'Unarchive a project' },
			{ name: 'Update', value: 'update', description: 'Update a project', action: 'Update a project' },
		],
		default: 'getAll',
	},
];

export const projectFields: INodeProperties[] = [
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['delete', 'get', 'update', 'archive', 'unarchive'],
			},
		},
		default: '',
		description: 'ID of the project',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Project name',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Contact ID',
				name: 'contact_id',
				type: 'string',
				default: '',
				description: 'Associated contact',
			},
			{
				displayName: 'Project Type Name or ID',
				name: 'pr_project_type_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getProjectTypes',
				},
				default: '',
				description: 'Type of project. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
			},
			{
				displayName: 'Project Status Name or ID',
				name: 'pr_state_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getProjectStatuses',
				},
				default: '',
				description: 'Status of project. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
			},
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'dateTime',
				default: '',
				description: 'Project start date',
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'dateTime',
				default: '',
				description: 'Project end date',
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
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['project'],
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
				resource: ['project'],
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
				resource: ['project'],
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
							{ name: 'Name', value: 'name' },
							{ name: 'Contact ID', value: 'contact_id' },
						],
						default: 'name',
					},
					{
						displayName: 'Criteria',
						name: 'criteria',
						type: 'options',
						options: [
							{ name: '=', value: '=' },
							{ name: 'Like', value: 'like' },
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
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Contact ID',
				name: 'contact_id',
				type: 'string',
				default: '',
			},
		],
	},
];
