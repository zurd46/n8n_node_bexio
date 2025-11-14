import { BexioTestClient } from '../utils/bexioClient';
import { TestLogger } from '../utils/testLogger';

export async function testInvoiceResource(logger: TestLogger) {
	const client = new BexioTestClient();
	const resource = 'Invoice';
	let createdInvoiceId: number | null = null;
	let contactId: number | null = null;

	console.log('\n🧾 Testing Invoice Resource...\n');

	// First, get a contact to use for invoice
	try {
		const contactResult = await client.get('/2.0/contact', { limit: 1 });
		if (contactResult.success && contactResult.data && contactResult.data.length > 0) {
			contactId = contactResult.data[0].id;
		}
	} catch (error) {
		console.log('Warning: Could not fetch contact for invoice tests');
	}

	// Test 1: Create Invoice
	if (contactId) {
		try {
			const start = Date.now();
			const invoiceData = {
				title: `Test Invoice ${Date.now()}`,
				contact_id: contactId,
				is_valid_from: new Date().toISOString().split('T')[0],
				positions: [
					{
						type: 'KbPositionCustom',
						text: 'Test Position',
						unit_price: 100,
						amount: 1,
						tax_id: 1,
					},
				],
			};

			const result = await client.post('/2.0/kb_invoice', invoiceData);
			const duration = Date.now() - start;

			if (result.success && result.data?.id) {
				createdInvoiceId = result.data.id;
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
	} else {
		logger.logTest({
			resource,
			operation: 'create',
			success: false,
			duration: 0,
			error: 'No contact ID available',
			timestamp: new Date().toISOString(),
		});
	}

	// Test 2: Get Invoice
	if (createdInvoiceId) {
		try {
			const start = Date.now();
			const result = await client.get(`/2.0/kb_invoice/${createdInvoiceId}`);
			const duration = Date.now() - start;

			logger.logTest({
				resource,
				operation: 'get',
				success: result.success && result.data?.id === createdInvoiceId,
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
			error: 'No invoice ID available (create failed)',
			timestamp: new Date().toISOString(),
		});
	}

	// Test 3: Update Invoice
	if (createdInvoiceId) {
		try {
			const start = Date.now();
			const updateData = {
				title: `Updated Invoice ${Date.now()}`,
			};

			const result = await client.post(`/2.0/kb_invoice/${createdInvoiceId}`, updateData);
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
			error: 'No invoice ID available (create failed)',
			timestamp: new Date().toISOString(),
		});
	}

	// Test 4: Get All Invoices
	try {
		const start = Date.now();
		const result = await client.get('/2.0/kb_invoice', { limit: 10 });
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

	// Test 5: Search Invoices
	try {
		const start = Date.now();
		const searchParams = [
			{
				field: 'kb_item_status_id',
				value: 1,
				criteria: '>=',
			},
		];

		const result = await client.search('/2.0/kb_invoice/search', searchParams);
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

	// Test 6: Get PDF (only if invoice exists)
	if (createdInvoiceId) {
		try {
			const start = Date.now();
			const result = await client.get(`/2.0/kb_invoice/${createdInvoiceId}/pdf`);
			const duration = Date.now() - start;

			logger.logTest({
				resource,
				operation: 'getPdf',
				success: result.success,
				duration,
				error: result.success ? undefined : JSON.stringify(result.error),
				timestamp: new Date().toISOString(),
			});
		} catch (error: any) {
			logger.logTest({
				resource,
				operation: 'getPdf',
				success: false,
				duration: 0,
				error: error.message,
				timestamp: new Date().toISOString(),
			});
		}
	} else {
		logger.logTest({
			resource,
			operation: 'getPdf',
			success: false,
			duration: 0,
			error: 'No invoice ID available (create failed)',
			timestamp: new Date().toISOString(),
		});
	}

	// Test 7: Issue Invoice (skip if no invoice)
	if (createdInvoiceId) {
		try {
			const start = Date.now();
			const result = await client.post(`/2.0/kb_invoice/${createdInvoiceId}/issue`);
			const duration = Date.now() - start;

			logger.logTest({
				resource,
				operation: 'issue',
				success: result.success,
				duration,
				error: result.success ? undefined : JSON.stringify(result.error),
				timestamp: new Date().toISOString(),
			});
		} catch (error: any) {
			logger.logTest({
				resource,
				operation: 'issue',
				success: false,
				duration: 0,
				error: error.message,
				timestamp: new Date().toISOString(),
			});
		}
	} else {
		logger.logTest({
			resource,
			operation: 'issue',
			success: false,
			duration: 0,
			error: 'No invoice ID available (create failed)',
			timestamp: new Date().toISOString(),
		});
	}

	// Test 8: Mark as Sent
	if (createdInvoiceId) {
		try {
			const start = Date.now();
			const result = await client.post(`/2.0/kb_invoice/${createdInvoiceId}/mark_as_sent`);
			const duration = Date.now() - start;

			logger.logTest({
				resource,
				operation: 'markAsSent',
				success: result.success,
				duration,
				error: result.success ? undefined : JSON.stringify(result.error),
				timestamp: new Date().toISOString(),
			});
		} catch (error: any) {
			logger.logTest({
				resource,
				operation: 'markAsSent',
				success: false,
				duration: 0,
				error: error.message,
				timestamp: new Date().toISOString(),
			});
		}
	} else {
		logger.logTest({
			resource,
			operation: 'markAsSent',
			success: false,
			duration: 0,
			error: 'No invoice ID available (create failed)',
			timestamp: new Date().toISOString(),
		});
	}

	// Test 9: Send Invoice (skip - requires email setup)
	logger.logTest({
		resource,
		operation: 'send',
		success: true,
		duration: 0,
		error: 'Skipped - requires email configuration',
		timestamp: new Date().toISOString(),
	});

	// Test 10: Delete Invoice
	if (createdInvoiceId) {
		try {
			const start = Date.now();
			const result = await client.delete(`/2.0/kb_invoice/${createdInvoiceId}`);
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
			error: 'No invoice ID available (create failed)',
			timestamp: new Date().toISOString(),
		});
	}
}
