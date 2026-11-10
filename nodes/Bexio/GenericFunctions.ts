import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IPollFunctions,
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
	NodeApiError,
	NodeOperationError,
	JsonObject,
} from 'n8n-workflow';

type BexioContext = IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions;
export type BexioResponse = IDataObject | IDataObject[];

/** Credential type selected by the node's "Authentication" parameter (default: access token). */
function credentialType(this: BexioContext): 'bexioApi' | 'bexioOAuth2Api' {
	return this.getNode().parameters.authentication === 'oAuth2' ? 'bexioOAuth2Api' : 'bexioApi';
}

export async function bexioApiRequest(
	this: BexioContext,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject | IDataObject[] = {},
	qs: IDataObject = {},
	uri?: string,
	option: IDataObject = {},
): Promise<BexioResponse> {
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
		return (await this.helpers.httpRequestWithAuthentication.call(
			this,
			credentialType.call(this),
			options,
		)) as BexioResponse;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function bexioApiRequestAllItems(
	this: BexioContext,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject | IDataObject[] = {},
	query: IDataObject = {},
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	const maxIterations = 1000; // Protection against infinite loops
	let iterations = 0;

	const pageSize = 500;
	query.limit = pageSize;
	query.offset = 0;

	let hasMore = true;
	while (hasMore) {
		if (iterations++ >= maxIterations) {
			throw new NodeOperationError(
				this.getNode(),
				'Stopped after 1000 pages. Add filters to narrow down the results.',
			);
		}

		const responseData = await bexioApiRequest.call(this, method, endpoint, body, query);
		if (Array.isArray(responseData)) {
			returnData.push(...responseData);
			hasMore = responseData.length === pageSize;
			if (hasMore) {
				query.offset = (query.offset as number) + pageSize;
			}
		} else {
			returnData.push(responseData);
			hasMore = false;
		}
	}

	return returnData;
}

export async function bexioApiRequestBinary(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject | IDataObject[] = {},
	qs: IDataObject = {},
): Promise<Buffer> {
	const options: IHttpRequestOptions = {
		method,
		headers: {
			Accept: 'application/json',
		},
		body,
		qs,
		url: `https://api.bexio.com${endpoint}`,
		json: true,
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

	let response: unknown;
	try {
		response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			credentialType.call(this),
			options,
		);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}

	// If response is already a Buffer, return it
	if (Buffer.isBuffer(response)) {
		return response;
	}

	// If it's an ArrayBuffer, convert to Buffer
	if (response instanceof ArrayBuffer) {
		return Buffer.from(new Uint8Array(response));
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
		const data = (response as IDataObject).data;
		if (Buffer.isBuffer(data)) {
			return data;
		}
		if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
			return Buffer.from(new Uint8Array(data));
		}
		if (typeof data === 'string') {
			return Buffer.from(data, 'binary');
		}
	}

	// If it's an object with body property (http response format)
	if (response && typeof response === 'object' && 'body' in response) {
		const bodyData = (response as IDataObject).body;
		if (Buffer.isBuffer(bodyData)) {
			return bodyData;
		}
		if (bodyData instanceof ArrayBuffer || bodyData instanceof Uint8Array) {
			return Buffer.from(new Uint8Array(bodyData));
		}
		if (typeof bodyData === 'string') {
			return Buffer.from(bodyData, 'binary');
		}
	}

	// If it's a Bexio PDF response with content property (base64 encoded)
	if (response && typeof response === 'object' && 'content' in response) {
		const content = (response as IDataObject).content;
		if (typeof content === 'string') {
			// Content is base64 encoded
			return Buffer.from(content, 'base64');
		}
	}

	// If response is an object, it might be an error or unexpected format
	throw new NodeOperationError(
		this.getNode(),
		`Bexio returned ${typeof response} instead of a file. Check that the document ID is correct.`,
	);
}
