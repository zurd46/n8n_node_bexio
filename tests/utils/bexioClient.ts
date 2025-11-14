import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { loadTestConfig } from './testConfig';

export class BexioTestClient {
	private client: AxiosInstance;
	private config = loadTestConfig();

	constructor() {
		this.client = axios.create({
			baseURL: this.config.baseUrl,
			headers: {
				'Authorization': `Bearer ${this.config.token}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
		});
	}

	async get(endpoint: string, params?: any) {
		try {
			const response = await this.client.get(endpoint, { params });
			return { success: true, data: response.data, status: response.status };
		} catch (error: any) {
			return {
				success: false,
				error: error.response?.data || error.message,
				status: error.response?.status
			};
		}
	}

	async post(endpoint: string, data?: any, config?: AxiosRequestConfig) {
		try {
			const response = await this.client.post(endpoint, data, config);
			return { success: true, data: response.data, status: response.status };
		} catch (error: any) {
			return {
				success: false,
				error: error.response?.data || error.message,
				status: error.response?.status
			};
		}
	}

	async put(endpoint: string, data?: any) {
		try {
			const response = await this.client.put(endpoint, data);
			return { success: true, data: response.data, status: response.status };
		} catch (error: any) {
			return {
				success: false,
				error: error.response?.data || error.message,
				status: error.response?.status
			};
		}
	}

	async patch(endpoint: string, data?: any) {
		try {
			const response = await this.client.patch(endpoint, data);
			return { success: true, data: response.data, status: response.status };
		} catch (error: any) {
			return {
				success: false,
				error: error.response?.data || error.message,
				status: error.response?.status
			};
		}
	}

	async delete(endpoint: string) {
		try {
			const response = await this.client.delete(endpoint);
			return { success: true, data: response.data, status: response.status };
		} catch (error: any) {
			return {
				success: false,
				error: error.response?.data || error.message,
				status: error.response?.status
			};
		}
	}

	async search(endpoint: string, searchParams: any[]) {
		try {
			const response = await this.client.post(endpoint, searchParams);
			return { success: true, data: response.data, status: response.status };
		} catch (error: any) {
			return {
				success: false,
				error: error.response?.data || error.message,
				status: error.response?.status
			};
		}
	}

	async uploadFile(endpoint: string, fileBuffer: Buffer, filename: string) {
		try {
			const FormData = require('form-data');
			const formData = new FormData();
			formData.append('file', fileBuffer, filename);

			const response = await this.client.post(endpoint, formData, {
				headers: {
					...formData.getHeaders(),
					'Authorization': `Bearer ${this.config.token}`,
				},
			});
			return { success: true, data: response.data, status: response.status };
		} catch (error: any) {
			console.log('Upload error details:', {
				message: error.message,
				response: error.response?.data,
				status: error.response?.status,
			});
			return {
				success: false,
				error: error.response?.data || error.message,
				status: error.response?.status
			};
		}
	}
}
