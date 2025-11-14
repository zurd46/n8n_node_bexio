import { BexioTestClient } from '../utils/bexioClient';
import { TestLogger } from '../utils/testLogger';

export async function testItemResource(logger: TestLogger) {
	const client = new BexioTestClient();
	const resource = 'Item';
	let createdItemId: number | null = null;

	console.log('\n📦 Testing Item Resource...\n');

	// Test 1: Create Item
	try {
		const start = Date.now();
		const itemData = {
			intern_code: `TEST-${Date.now()}`,
			intern_name: `Test Item ${Date.now()}`,
		};

		const result = await client.post('/2.0/article', itemData);
		const duration = Date.now() - start;

		if (result.success && result.data?.id) {
			createdItemId = result.data.id;
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

	// Test 2: Get Item
	if (createdItemId) {
		try {
			const start = Date.now();
			const result = await client.get(`/2.0/article/${createdItemId}`);
			const duration = Date.now() - start;

			logger.logTest({
				resource,
				operation: 'get',
				success: result.success && result.data?.id === createdItemId,
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
			error: 'No item ID available (create failed)',
			timestamp: new Date().toISOString(),
		});
	}

	// Test 3: Update Item
	if (createdItemId) {
		try {
			const start = Date.now();
			const updateData = {
				intern_name: `Updated Item ${Date.now()}`,
			};

			const result = await client.post(`/2.0/article/${createdItemId}`, updateData);
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
			error: 'No item ID available (create failed)',
			timestamp: new Date().toISOString(),
		});
	}

	// Test 4: Get All Items
	try {
		const start = Date.now();
		const result = await client.get('/2.0/article', { limit: 10 });
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

	// Test 5: Search Items
	try {
		const start = Date.now();
		const searchParams = [
			{
				field: 'intern_name',
				value: 'Test',
				criteria: 'like',
			},
		];

		const result = await client.search('/2.0/article/search', searchParams);
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

	// Test 6: Delete Item
	if (createdItemId) {
		try {
			const start = Date.now();
			const result = await client.delete(`/2.0/article/${createdItemId}`);
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
			error: 'No item ID available (create failed)',
			timestamp: new Date().toISOString(),
		});
	}
}
