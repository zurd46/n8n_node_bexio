import { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['contact'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a contact',
				action: 'Create a contact',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a contact',
				action: 'Delete a contact',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a contact',
				action: 'Get a contact',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many contacts',
				action: 'Get many contacts',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search contacts',
				action: 'Search contacts',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a contact',
				action: 'Update a contact',
			},
		],
		default: 'getAll',
	},
];

export const contactFields: INodeProperties[] = [
	// ----------------------------------
	//         contact: create
	// ----------------------------------
	{
		displayName: 'Contact Type',
		name: 'contact_type_id',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Company',
				value: 2,
			},
			{
				name: 'Person',
				value: 1,
			},
		],
		default: 1,
		description: 'Type of contact (1 = Person, 2 = Company)',
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
				resource: ['contact'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'User responsible for this contact. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	{
		displayName: 'Owner Name or ID',
		name: 'owner_id',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getUsers',
		},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Owner of this contact. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'First Name',
				name: 'name_1',
				type: 'string',
				default: '',
				description: 'First name of the contact (for persons)',
			},
			{
				displayName: 'Last Name',
				name: 'name_2',
				type: 'string',
				default: '',
				description: 'Last name of the contact (for persons) or company name',
			},
			{
				displayName: 'Salutation Name or ID',
				name: 'salutation_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getContactSalutations',
				},
				default: '',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
			},
			{
				displayName: 'Title Name or ID',
				name: 'title_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getContactTitles',
				},
				default: '',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
			},
			{
				displayName: 'Birthday',
				name: 'birthday',
				type: 'dateTime',
				default: '',
				description: 'Birthday of the contact',
			},
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				description: 'Street address',
			},
			{
				displayName: 'Postcode',
				name: 'postcode',
				type: 'string',
				default: '',
				description: 'Postal code',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City',
			},
			{
				displayName: 'Country Name or ID',
				name: 'country_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getCountries',
				},
				default: '',
				description: 'Country ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
			},
			{
				displayName: 'Mail',
				name: 'mail',
				type: 'string',
				default: '',
				description: 'Email address',
			},
			{
				displayName: 'Mail Second',
				name: 'mail_second',
				type: 'string',
				default: '',
				description: 'Second email address',
			},
			{
				displayName: 'Phone Fixed',
				name: 'phone_fixed',
				type: 'string',
				default: '',
				description: 'Landline phone number',
			},
			{
				displayName: 'Phone Mobile',
				name: 'phone_mobile',
				type: 'string',
				default: '',
				description: 'Mobile phone number',
			},
			{
				displayName: 'Fax',
				name: 'fax',
				type: 'string',
				default: '',
				description: 'Fax number',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'Website URL',
			},
			{
				displayName: 'Skype Name',
				name: 'skype_name',
				type: 'string',
				default: '',
				description: 'Skype username',
			},
			{
				displayName: 'Remarks',
				name: 'remarks',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				description: 'Additional notes about the contact',
			},
			{
				displayName: 'Language Name or ID',
				name: 'language_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getLanguages',
				},
				default: '',
				description: 'Language preference. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
			},
			{
				displayName: 'Is Lead',
				name: 'is_lead',
				type: 'boolean',
				default: false,
				description: 'Whether the contact is a lead',
			},
			{
				displayName: 'Contact Group IDs',
				name: 'contact_group_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of contact group IDs',
			},
			{
				displayName: 'Contact Branch IDs',
				name: 'contact_branch_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of contact branch IDs',
			},
		],
	},

	// ----------------------------------
	//         contact: delete
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'ID of the contact to delete',
	},

	// ----------------------------------
	//         contact: get
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'ID of the contact to retrieve',
	},

	// ----------------------------------
	//         contact: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['contact'],
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
				resource: ['contact'],
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
				resource: ['contact'],
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
		],
	},

	// ----------------------------------
	//         contact: search
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
				resource: ['contact'],
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
							{ name: 'Name', value: 'name_1' },
							{ name: 'Surname', value: 'name_2' },
							{ name: 'Mail', value: 'mail' },
							{ name: 'City', value: 'city' },
							{ name: 'Postcode', value: 'postcode' },
							{ name: 'Phone Fixed', value: 'phone_fixed' },
							{ name: 'Phone Mobile', value: 'phone_mobile' },
						],
						default: 'name_1',
						description: 'Field to search in',
					},
					{
						displayName: 'Criteria',
						name: 'criteria',
						type: 'options',
						options: [
							{ name: '=', value: '=' },
							{ name: 'Like', value: 'like' },
							{ name: 'Not Equal', value: '!=' },
							{ name: '>', value: '>' },
							{ name: '<', value: '<' },
						],
						default: '=',
						description: 'Comparison operator',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value to search for',
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
				resource: ['contact'],
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
				resource: ['contact'],
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
	//         contact: update
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'ID of the contact to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Contact Type',
				name: 'contact_type_id',
				type: 'options',
				options: [
					{ name: 'Person', value: 1 },
					{ name: 'Company', value: 2 },
				],
				default: 1,
			},
			{
				displayName: 'First Name',
				name: 'name_1',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Last Name',
				name: 'name_2',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Postcode',
				name: 'postcode',
				type: 'string',
				default: '',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Mail',
				name: 'mail',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Phone Fixed',
				name: 'phone_fixed',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Phone Mobile',
				name: 'phone_mobile',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Remarks',
				name: 'remarks',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
			},
		],
	},
];
