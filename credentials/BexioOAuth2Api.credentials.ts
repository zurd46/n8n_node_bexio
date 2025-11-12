import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BexioOAuth2Api implements ICredentialType {
	name = 'bexioOAuth2Api';
	extends = ['oAuth2Api'];
	displayName = 'Bexio OAuth2 API';
	documentationUrl = 'https://docs.bexio.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://auth.bexio.com/realms/bexio/protocol/openid-connect/auth',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://auth.bexio.com/realms/bexio/protocol/openid-connect/token',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'string',
			default: 'profile email contact_show contact_edit contact_delete invoice_show invoice_edit quote_show quote_edit order_show order_edit article_show article_edit project_show project_edit timesheet_show timesheet_edit accounting_show accounting_edit payroll_show payroll_edit company_profile',
			description: 'Space-separated list of scopes. Adjust based on your needs.',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
				Accept: 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.bexio.com/2.0',
			url: '/contact',
			method: 'GET',
		},
	};
}
