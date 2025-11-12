import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
	NodeApiError,
	JsonObject,
} from 'n8n-workflow';

export async function bexioApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject | any[] = {},
	qs: IDataObject = {},
	uri?: string,
	option: IDataObject = {},
): Promise<any> {
	const options: IHttpRequestOptions = {
		method,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body,
		qs,
		url: uri || `https://api.bexio.com${endpoint}`,
		json: true,
	};

	if (Object.keys(option).length !== 0) {
		Object.assign(options, option);
	}

	if (Array.isArray(body)) {
		if (body.length === 0) {
			delete options.body;
		}
	} else if (Object.keys(body).length === 0) {
		delete options.body;
	}

	if (Object.keys(qs).length === 0) {
		delete options.qs;
	}

	try {
		return await this.helpers.httpRequestWithAuthentication.call(
			this,
			'bexioApi',
			options,
		);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function bexioApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject | any[] = {},
	query: IDataObject = {},
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;
	query.limit = 500;
	query.offset = 0;

	do {
		responseData = await bexioApiRequest.call(this, method, endpoint, body, query);
		if (Array.isArray(responseData)) {
			returnData.push.apply(returnData, responseData);
			if (responseData.length < query.limit) {
				break;
			}
			query.offset += query.limit;
		} else {
			returnData.push(responseData);
			break;
		}
	} while (true);

	return returnData;
}

export async function bexioApiRequestBinary(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject | any[] = {},
	qs: IDataObject = {},
): Promise<Buffer> {
	const options: IHttpRequestOptions = {
		method,
		headers: {
			Accept: 'application/pdf',
		},
		body,
		qs,
		url: `https://api.bexio.com${endpoint}`,
		json: false,
		encoding: 'arraybuffer',
		returnFullResponse: false,
	};

	if (Array.isArray(body)) {
		if (body.length === 0) {
			delete options.body;
		}
	} else if (Object.keys(body).length === 0) {
		delete options.body;
	}

	if (Object.keys(qs).length === 0) {
		delete options.qs;
	}

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'bexioApi',
			options,
		);
		return Buffer.from(response as Buffer);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export function validateJSON(json: string | undefined): any {
	let result;
	try {
		result = JSON.parse(json!);
	} catch (exception) {
		result = undefined;
	}
	return result;
}
