import { INodeProperties } from 'n8n-workflow';
import { searchOperatorOptions } from './SearchOperators';

const show = (operation: string[]) => ({ show: { resource: ['additionalAddress'], operation } });

const addressFields: INodeProperties[] = [
	{ displayName: 'Name', name: 'name', type: 'string', default: '' },
	{ displayName: 'Name Addition', name: 'name_addition', type: 'string', default: '' },
	{ displayName: 'Street Name', name: 'street_name', type: 'string', default: '', description: 'Required if a house number or address addition is set' },
	{ displayName: 'House Number', name: 'house_number', type: 'string', default: '' },
	{ displayName: 'Address Addition', name: 'address_addition', type: 'string', default: '' },
	{ displayName: 'Postcode', name: 'postcode', type: 'string', default: '' },
	{ displayName: 'City', name: 'city', type: 'string', default: '' },
	{
		displayName: 'Country Name or ID',
		name: 'country_id',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getCountries' },
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
	},
	{ displayName: 'Subject', name: 'subject', type: 'string', default: '' },
	{ displayName: 'Description', name: 'description', type: 'string', default: '' },
];

export const additionalAddressOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['additionalAddress'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Add an address to a contact', action: 'Create an additional address' },
			{ name: 'Delete', value: 'delete', description: 'Delete an additional address', action: 'Delete an additional address' },
			{ name: 'Get', value: 'get', description: 'Get an additional address', action: 'Get an additional address' },
			{ name: 'Get Many', value: 'getAll', description: 'Get many additional addresses of a contact', action: 'Get many additional addresses' },
			{ name: 'Search', value: 'search', description: 'Search additional addresses of a contact', action: 'Search additional addresses' },
			{ name: 'Update', value: 'update', description: 'Update an additional address', action: 'Update an additional address' },
		],
		default: 'getAll',
	},
];

export const additionalAddressFields: INodeProperties[] = [
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['additionalAddress'] } },
		default: '',
		description: 'ID of the contact the address belongs to',
	},
	{
		displayName: 'Additional Address ID',
		name: 'additionalAddressId',
		type: 'string',
		required: true,
		displayOptions: show(['delete', 'get', 'update']),
		default: '',
	},
	{
		displayName: 'Address',
		name: 'addressFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: show(['create', 'update']),
		options: addressFields,
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
		displayOptions: { show: { resource: ['additionalAddress'], operation: ['getAll', 'search'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 2000 },
		default: 500,
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
							{ name: 'Address', value: 'address' },
							{ name: 'City', value: 'city' },
							{ name: 'Country ID', value: 'country_id' },
							{ name: 'Email', value: 'email' },
							{ name: 'Name', value: 'name' },
							{ name: 'Postcode', value: 'postcode' },
							{ name: 'Subject', value: 'subject' },
						],
						default: 'name',
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
