import { INodeProperties } from 'n8n-workflow';

export const itemOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['item'],
			},
		},
		options: [
			{ name: 'Create', value: 'create', description: 'Create an item', action: 'Create an item' },
			{ name: 'Delete', value: 'delete', description: 'Delete an item', action: 'Delete an item' },
			{ name: 'Get', value: 'get', description: 'Get an item', action: 'Get an item' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many items', action: 'Get many items' },
			{ name: 'Search', value: 'search', description: 'Search items', action: 'Search items' },
			{ name: 'Update', value: 'update', description: 'Update an item', action: 'Update an item' },
		],
		default: 'getAll',
	},
];

export const itemFields: INodeProperties[] = [
	{
		displayName: 'Item ID',
		name: 'itemId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['item'],
				operation: ['delete', 'get', 'update'],
			},
		},
		default: '',
		description: 'ID of the item',
	},
	{
		displayName: 'Internal Name',
		name: 'intern_name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['item'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Internal name of the item',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['item'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'User Name',
				name: 'user_name',
				type: 'string',
				default: '',
				description: 'Display name for the item',
			},
			{
				displayName: 'Article Type',
				name: 'article_type',
				type: 'options',
				options: [
					{ name: 'Physical', value: 'physical' },
					{ name: 'Service', value: 'service' },
				],
				default: 'physical',
			},
			{
				displayName: 'Unit Name or ID',
				name: 'unit_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getUnits',
				},
				default: '',
				description: 'Unit of measurement. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
			},
			{
				displayName: 'Sale Price',
				name: 'sale_price',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: 0,
				description: 'Sales price',
			},
			{
				displayName: 'Purchase Price',
				name: 'purchase_price',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: 0,
				description: 'Purchase price',
			},
			{
				displayName: 'Tax Income Name or ID',
				name: 'tax_income_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getTaxes',
				},
				default: '',
				description: 'Income tax. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['item'],
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
				resource: ['item'],
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
				resource: ['item'],
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
							{ name: 'Internal Name', value: 'intern_name' },
							{ name: 'User Name', value: 'user_name' },
						],
						default: 'intern_name',
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
				resource: ['item'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'User Name',
				name: 'user_name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Sale Price',
				name: 'sale_price',
				type: 'number',
				default: 0,
			},
		],
	},
];
