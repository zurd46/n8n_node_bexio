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

		// If response is already a Buffer, return it
		if (Buffer.isBuffer(response)) {
			return response;
		}

		// If it's an ArrayBuffer, convert to Buffer
		if (response instanceof ArrayBuffer) {
			return Buffer.from(response);
		}

		// If it's a Uint8Array, convert to Buffer
		if (response instanceof Uint8Array) {
			return Buffer.from(response);
		}

		// If it's a string, convert with binary encoding
		if (typeof response === 'string') {
			return Buffer.from(response, 'binary');
		}

		// If it's an object with data property (axios response format)
		if (response && typeof response === 'object' && 'data' in response) {
			const data = (response as any).data;
			if (Buffer.isBuffer(data)) {
				return data;
			}
			if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
				return Buffer.from(data);
			}
			if (typeof data === 'string') {
				return Buffer.from(data, 'binary');
			}
		}

		// If it's an object with body property (http response format)
		if (response && typeof response === 'object' && 'body' in response) {
			const bodyData = (response as any).body;
			if (Buffer.isBuffer(bodyData)) {
				return bodyData;
			}
			if (bodyData instanceof ArrayBuffer || bodyData instanceof Uint8Array) {
				return Buffer.from(bodyData);
			}
			if (typeof bodyData === 'string') {
				return Buffer.from(bodyData, 'binary');
			}
		}

		// If response is an object, it might be an error or unexpected format
		throw new Error(`Unexpected response type: ${typeof response}. Response: ${JSON.stringify(response).substring(0, 200)}`);
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
