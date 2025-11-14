import { BexioTestClient } from '../utils/bexioClient';
import { TestLogger } from '../utils/testLogger';

export async function testContactResource(logger: TestLogger) {
	const client = new BexioTestClient();
	const resource = 'Contact';
	let createdContactId: number | null = null;

	console.log('\n📋 Testing Contact Resource...\n');

	// Test 1: Create Contact
	try {
		const start = Date.now();
		const contactData = {
			contact_type_id: 1, // Company
			name_1: `Test Company ${Date.now()}`,
			address: 'Test Street 123',
			postcode: '8000',
			city: 'Zurich',
			country_id: 1, // Switzerland
		};

		const result = await client.post('/2.0/contact', contactData);
		const duration = Date.now() - start;

		if (result.success && result.data?.id) {
			createdContactId = result.data.id;
		}

		logger.logTest({
			resource,
			operation: 'create',
			success: result.success && !!result.data?.id,
			duration,
			error: result.success ? undefined : JSON.stringify(result.error),
			timestamp: new Date().toISOString(),
		});
	} catch (error: any) {
		logger.logTest({
			resource,
			operation: 'create',
			success: false,
			duration: 0,
			error: error.message,
			timestamp: new Date().toISOString(),
		});
	}

	// Test 2: Get Contact
	if (createdContactId) {
		try {
			const start = Date.now();
			const result = await client.get(`/2.0/contact/${createdContactId}`);
			const duration = Date.now() - start;

			logger.logTest({
				resource,
				operation: 'get',
				success: result.success && result.data?.id === createdContactId,
				duration,
				error: result.success ? undefined : JSON.stringify(result.error),
				timestamp: new Date().toISOString(),
			});
		} catch (error: any) {
			logger.logTest({
				resource,
				operation: 'get',
				success: false,
				duration: 0,
				error: error.message,
				timestamp: new Date().toISOString(),
			});
		}
	} else {
		logger.logTest({
			resource,
			operation: 'get',
			success: false,
			duration: 0,
			error: 'No contact ID available (create failed)',
			timestamp: new Date().toISOString(),
		});
	}

	// Test 3: Update Contact
	if (createdContactId) {
		try {
			const start = Date.now();
			const updateData = {
				name_1: `Updated Company ${Date.now()}`,
				address: 'Updated Street 456',
			};

			const result = await client.post(`/2.0/contact/${createdContactId}`, updateData);
			const duration = Date.now() - start;

			logger.logTest({
				resource,
				operation: 'update',
				success: result.success,
				duration,
				error: result.success ? undefined : JSON.stringify(result.error),
				timestamp: new Date().toISOString(),
			});
		} catch (error: any) {
			logger.logTest({
				resource,
				operation: 'update',
				success: false,
				duration: 0,
				error: error.message,
				timestamp: new Date().toISOString(),
			});
		}
	} else {
		logger.logTest({
			resource,
			operation: 'update',
			success: false,
			duration: 0,
			error: 'No contact ID available (create failed)',
			timestamp: new Date().toISOString(),
		});
	}

	// Test 4: Get All Contacts
	try {
		const start = Date.now();
		const result = await client.get('/2.0/contact', { limit: 10 });
		const duration = Date.now() - start;

		logger.logTest({
			resource,
			operation: 'getAll',
			success: result.success && Array.isArray(result.data),
			duration,
			error: result.success ? undefined : JSON.stringify(result.error),
			timestamp: new Date().toISOString(),
		});
	} catch (error: any) {
		logger.logTest({
			resource,
			operation: 'getAll',
			success: false,
			duration: 0,
			error: error.message,
			timestamp: new Date().toISOString(),
		});
	}

	// Test 5: Search Contacts
	try {
		const start = Date.now();
		const searchParams = [
			{
				field: 'contact_type_id',
				value: 1,
				criteria: '=',
			},
		];

		const result = await client.search('/2.0/contact/search', searchParams);
		const duration = Date.now() - start;

		logger.logTest({
			resource,
			operation: 'search',
			success: result.success && Array.isArray(result.data),
			duration,
			error: result.success ? undefined : JSON.stringify(result.error),
			timestamp: new Date().toISOString(),
		});
	} catch (error: any) {
		logger.logTest({
			resource,
			operation: 'search',
			success: false,
			duration: 0,
			error: error.message,
			timestamp: new Date().toISOString(),
		});
	}

	// Test 6: Delete Contact
	if (createdContactId) {
		try {
			const start = Date.now();
			const result = await client.delete(`/2.0/contact/${createdContactId}`);
			const duration = Date.now() - start;

			logger.logTest({
				resource,
				operation: 'delete',
				success: result.success,
				duration,
				error: result.success ? undefined : JSON.stringify(result.error),
				timestamp: new Date().toISOString(),
			});
		} catch (error: any) {
			logger.logTest({
				resource,
				operation: 'delete',
				success: false,
				duration: 0,
				error: error.message,
				timestamp: new Date().toISOString(),
			});
		}
	} else {
		logger.logTest({
			resource,
			operation: 'delete',
			success: false,
			duration: 0,
			error: 'No contact ID available (create failed)',
			timestamp: new Date().toISOString(),
		});
	}
}
