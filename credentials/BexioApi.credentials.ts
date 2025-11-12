import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BexioApi implements ICredentialType {
	name = 'bexioApi';
	displayName = 'Bexio API';
	documentationUrl = 'https://docs.bexio.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'Personal Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Personal Access Token (PAT) from the Bexio Developer Portal',
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
