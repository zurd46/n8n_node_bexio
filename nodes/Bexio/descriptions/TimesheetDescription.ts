import { INodeProperties } from 'n8n-workflow';

export const timesheetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['timesheet'],
			},
		},
		options: [
			{ name: 'Create', value: 'create', description: 'Create a timesheet', action: 'Create a timesheet' },
			{ name: 'Delete', value: 'delete', description: 'Delete a timesheet', action: 'Delete a timesheet' },
			{ name: 'Get', value: 'get', description: 'Get a timesheet', action: 'Get a timesheet' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many timesheets', action: 'Get many timesheets' },
			{ name: 'Search', value: 'search', description: 'Search timesheets', action: 'Search timesheets' },
			{ name: 'Update', value: 'update', description: 'Update a timesheet', action: 'Update a timesheet' },
		],
		default: 'getAll',
	},
];

export const timesheetFields: INodeProperties[] = [
	{
		displayName: 'Timesheet ID',
		name: 'timesheetId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['timesheet'],
				operation: ['delete', 'get', 'update'],
			},
		},
		default: '',
		description: 'ID of the timesheet',
	},
	{
		displayName: 'User ID',
		name: 'user_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getUsers',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['timesheet'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'User who performed the work',
	},
	{
		displayName: 'Date',
		name: 'date',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['timesheet'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Date of work',
	},
	{
		displayName: 'Duration (Minutes)',
		name: 'duration',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['timesheet'],
				operation: ['create'],
			},
		},
		default: 0,
		description: 'Duration in minutes',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['timesheet'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Project Name or ID',
				name: 'pr_project_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getProjects',
				},
				default: '',
				description: 'Associated project. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
			},
			{
				displayName: 'Activity Name or ID',
				name: 'pr_activity_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getActivities',
				},
				default: '',
				description: 'Activity type. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				description: 'Description of work',
			},
			{
				displayName: 'Status Name or ID',
				name: 'status_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getTimesheetStatuses',
				},
				default: '',
				description: 'Timesheet status. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['timesheet'],
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
				resource: ['timesheet'],
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
				resource: ['timesheet'],
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
							{ name: 'User ID', value: 'user_id' },
							{ name: 'Project ID', value: 'pr_project_id' },
							{ name: 'Date', value: 'date' },
						],
						default: 'user_id',
					},
					{
						displayName: 'Criteria',
						name: 'criteria',
						type: 'options',
						options: [
							{ name: '=', value: '=' },
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
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['timesheet'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Duration',
				name: 'duration',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				default: '',
			},
		],
	},
];
