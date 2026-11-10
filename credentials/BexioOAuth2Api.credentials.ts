import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

export class BexioOAuth2Api implements ICredentialType {
	name = 'bexioOAuth2Api';
	extends = ['oAuth2Api'];
	displayName = 'Bexio OAuth2 API';
	icon: Icon = { light: 'file:../icons/bexio.svg', dark: 'file:../icons/bexio.dark.svg' };
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
			default: 'openid profile email company_profile offline_access contact_show',
			description: 'Space-separated list of scopes. Keep offline_access so n8n can refresh the token. Add the API scopes you need, e.g. contact_edit kb_invoice_show kb_invoice_edit',
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
}
