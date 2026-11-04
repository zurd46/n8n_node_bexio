import { INodePropertyOptions } from 'n8n-workflow';

// Search criteria as listed in the Bexio API documentation, section "Search"
export const searchOperatorOptions: INodePropertyOptions[] = [
	{ name: '!=', value: '!=' },
	{ name: '<', value: '<' },
	{ name: '<=', value: '<=' },
	{ name: '=', value: '=' },
	{ name: '>', value: '>' },
	{ name: '>=', value: '>=' },
	{ name: 'In (Comma-Separated)', value: 'in' },
	{ name: 'Is Null', value: 'is_null' },
	{ name: 'Like', value: 'like' },
	{ name: 'Not In (Comma-Separated)', value: 'not_in' },
	{ name: 'Not Like', value: 'not_like' },
	{ name: 'Not Null', value: 'not_null' },
];
