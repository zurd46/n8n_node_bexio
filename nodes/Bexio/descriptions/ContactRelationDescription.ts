import { INodeProperties } from 'n8n-workflow';
import { searchOperatorOptions } from './SearchOperators';

const show = (operation: string[]) => ({ show: { resource: ['contactRelation'], operation } });

export const contactRelationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['contactRelation'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Link a person to a company', action: 'Create a contact relation' },
			{ name: 'Delete', value: 'delete', description: 'Delete a contact relation', action: 'Delete a contact relation' },
			{ name: 'Get', value: 'get', description: 'Get a contact relation', action: 'Get a contact relation' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many contact relations', action: 'Get many contact relations' },
			{ name: 'Search', value: 'search', description: 'Search contact relations', action: 'Search contact relations' },
			{ name: 'Update', value: 'update', description: 'Update a contact relation', action: 'Update a contact relation' },
		],
		default: 'getAll',
	},
];

export const contactRelationFields: INodeProperties[] = [
	{
		displayName: 'Contact Relation ID',
		name: 'contactRelationId',
		type: 'string',
		required: true,
		displayOptions: show(['delete', 'get', 'update']),
		default: '',
	},
	{
		displayName: 'Contact ID',
		name: 'contact_id',
		type: 'string',
		required: true,
		displayOptions: show(['create', 'update']),
		default: '',
		description: 'ID of the main contact, usually the company',
	},
	{
		displayName: 'Sub Contact ID',
		name: 'contact_sub_id',
		type: 'string',
		required: true,
		displayOptions: show(['create', 'update']),
		default: '',
		description: 'ID of the related contact, usually the person',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		displayOptions: show(['create', 'update']),
		default: '',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: show(['getAll', 'search']),
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['contactRelation'], operation: ['getAll', 'search'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 2000 },
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Search Criteria',
		name: 'searchCriteria',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		placeholder: 'Add Criterion',
		default: {},
		displayOptions: show(['search']),
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
							{ name: 'Contact ID', value: 'contact_id' },
							{ name: 'Sub Contact ID', value: 'contact_sub_id' },
							{ name: 'Updated At', value: 'updated_at' },
						],
						default: 'contact_id',
						description: 'Field to search in',
					},
					{
						displayName: 'Criteria',
						name: 'criteria',
						type: 'options',
						options: searchOperatorOptions,
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
];
