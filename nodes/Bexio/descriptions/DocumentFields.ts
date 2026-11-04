import { INodeProperties } from 'n8n-workflow';
import { searchOperatorOptions } from './SearchOperators';

// Writable fields shared by quotes and orders (Bexio API, POST /2.0/kb_offer and /2.0/kb_order)
const commonFields: INodeProperties[] = [
	{ displayName: 'API Reference', name: 'api_reference', type: 'string', default: '' },
	{ displayName: 'Bank Account ID', name: 'bank_account_id', type: 'number', default: 0 },
	{ displayName: 'Contact Address (Manual)', name: 'contact_address_manual', type: 'string', typeOptions: { alwaysOpenEditWindow: true }, default: '' },
	{ displayName: 'Contact Sub ID', name: 'contact_sub_id', type: 'number', default: 0 },
	{
		displayName: 'Currency Name or ID',
		name: 'currency_id',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getCurrencies' },
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
	},
	{
		displayName: 'Delivery Address Type',
		name: 'delivery_address_type',
		type: 'options',
		options: [
			{ name: 'Use Invoice Address', value: 0 },
			{ name: 'Use Custom Address', value: 1 },
		],
		default: 0,
	},
	{ displayName: 'Delivery Address (Manual)', name: 'delivery_address_manual', type: 'string', typeOptions: { alwaysOpenEditWindow: true }, default: '' },
	{ displayName: 'Document Number', name: 'document_nr', type: 'string', default: '' },
	{ displayName: 'Footer', name: 'footer', type: 'string', typeOptions: { alwaysOpenEditWindow: true }, default: '' },
	{ displayName: 'Header', name: 'header', type: 'string', typeOptions: { alwaysOpenEditWindow: true }, default: '' },
	{ displayName: 'Valid From', name: 'is_valid_from', type: 'string', default: '', description: 'Date in the format YYYY-MM-DD' },
	{
		displayName: 'Language Name or ID',
		name: 'language_id',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getLanguages' },
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
	},
	{ displayName: 'Logopaper ID', name: 'logopaper_id', type: 'number', default: 0 },
	{ displayName: 'Net Prices', name: 'mwst_is_net', type: 'boolean', default: true, description: 'Whether the prices are net' },
	{
		displayName: 'Tax Type',
		name: 'mwst_type',
		type: 'options',
		options: [
			{ name: 'Including Taxes', value: 0 },
			{ name: 'Excluding Taxes', value: 1 },
			{ name: 'Exempt From Taxes', value: 2 },
		],
		default: 0,
	},
	{ displayName: 'Payment Type ID', name: 'payment_type_id', type: 'number', default: 0 },
	{
		displayName: 'Project Name or ID',
		name: 'pr_project_id',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getProjects' },
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
	},
	{ displayName: 'Show Position Taxes', name: 'show_position_taxes', type: 'boolean', default: false, description: 'Whether to show taxes per position' },
	{ displayName: 'Template Slug', name: 'template_slug', type: 'string', default: '' },
	{ displayName: 'Title', name: 'title', type: 'string', default: '' },
];

const quoteOnlyFields: INodeProperties[] = [
	{ displayName: 'Valid Until', name: 'is_valid_until', type: 'string', default: '', description: 'Date in the format YYYY-MM-DD' },
	{ displayName: 'Terms of Payment Template ID', name: 'kb_terms_of_payment_template_id', type: 'number', default: 0 },
];

const positionsField: INodeProperties = {
	displayName: 'Positions',
	name: 'positions',
	type: 'json',
	default: '[]',
	description: 'Document positions as a JSON array. Bexio accepts positions only when the document is created.',
};

export function documentFields(resource: 'quote' | 'order'): INodeProperties[] {
	const extra = resource === 'quote' ? quoteOnlyFields : [];
	const searchFields = [
		{ name: 'Contact ID', value: 'contact_id' },
		{ name: 'Contact Sub ID', value: 'contact_sub_id' },
		{ name: 'Currency ID', value: 'currency_id' },
		{ name: 'Document Number', value: 'document_nr' },
		{ name: 'ID', value: 'id' },
		{ name: 'Status ID', value: 'kb_item_status_id' },
		{ name: 'Title', value: 'title' },
		{ name: 'Total', value: 'total' },
		{ name: 'Total Gross', value: 'total_gross' },
		{ name: 'Total Net', value: 'total_net' },
		{ name: 'Updated At', value: 'updated_at' },
		{ name: 'User ID', value: 'user_id' },
		{ name: 'Valid From', value: 'is_valid_from' },
		{ name: resource === 'quote' ? 'Valid Until' : 'Valid To', value: resource === 'quote' ? 'is_valid_until' : 'is_valid_to' },
		...(resource === 'quote' ? [{ name: 'Valid To', value: 'is_valid_to' }] : []),
	];

	return [
		{
			displayName: 'Additional Fields',
			name: 'additionalFields',
			type: 'collection',
			placeholder: 'Add Field',
			default: {},
			displayOptions: { show: { resource: [resource], operation: ['create'] } },
			options: [...commonFields, ...extra, positionsField],
		},
		{
			displayName: 'Update Fields',
			name: 'updateFields',
			type: 'collection',
			placeholder: 'Add Field',
			default: {},
			displayOptions: { show: { resource: [resource], operation: ['update'] } },
			options: [
				{ displayName: 'Contact ID', name: 'contact_id', type: 'number', default: 0 },
				{
					displayName: 'User Name or ID',
					name: 'user_id',
					type: 'options',
					typeOptions: { loadOptionsMethod: 'getUsers' },
					default: '',
					description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
				},
				...commonFields,
				...extra,
			],
		},
		{
			displayName: 'Search Criteria',
			name: 'searchCriteria',
			type: 'fixedCollection',
			typeOptions: { multipleValues: true },
			placeholder: 'Add Criterion',
			default: {},
			displayOptions: { show: { resource: [resource], operation: ['search'] } },
			options: [
				{
					name: 'criteria',
					displayName: 'Criterion',
					values: [
						{ displayName: 'Field', name: 'field', type: 'options', options: searchFields, default: 'document_nr', description: 'Field to search in' },
						{ displayName: 'Criteria', name: 'criteria', type: 'options', options: searchOperatorOptions, default: '=', description: 'Comparison operator' },
						{ displayName: 'Value', name: 'value', type: 'string', default: '', description: 'Value to search for' },
					],
				},
			],
		},
	];
}
