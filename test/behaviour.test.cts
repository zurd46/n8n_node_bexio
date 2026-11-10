// Fachliches Verhalten und Rückwärtskompatibilität für gespeicherte Workflows.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as handlers from '../nodes/Bexio/OperationsHandlers';
import { BexioTrigger } from '../nodes/Bexio/BexioTrigger.node';

function ctx(werte: Record<string, unknown>, antwort: (o: any) => unknown = () => ({})) {
	const anfragen: any[] = [];
	return {
		anfragen,
		c: {
			getNodeParameter: (n: string, _i: number, d?: unknown) => (n in werte ? werte[n] : d),
			getNode: () => ({ name: 'Bexio', type: 'bexio', typeVersion: 1, id: 'x', position: [0, 0], parameters: {} }),
			helpers: {
				httpRequestWithAuthentication: async (_n: string, o: any) => {
					anfragen.push(o);
					return antwort(o);
				},
			},
		} as any,
	};
}

test('Kontakt: gespeicherter Wert bleibt auf der Leitung gleich', async () => {
	const { c, anfragen } = ctx({ contact_type_id: 2, user_id: 1, owner_id: 1, name_1: 'Muster', additionalFields: {} });
	await handlers.handleContactOperations.call(c, 'create', 0);
	assert.equal(anfragen[0].body.contact_type_id, 2);
	assert.equal(anfragen[0].body.name_1, 'Muster');
});

test('Kontakt: name_1 und address aus alten Workflows werden übernommen', async () => {
	const { c, anfragen } = ctx({ contact_type_id: 1, user_id: 1, owner_id: 1, additionalFields: { name_1: 'Alt AG', address: 'Weg 1' } });
	await handlers.handleContactOperations.call(c, 'create', 0);
	assert.equal(anfragen[0].body.name_1, 'Alt AG');
	assert.equal(anfragen[0].body.street_name, 'Weg 1');
	assert.equal('address' in anfragen[0].body, false);
});

test('Kontakt: ohne Name 1 kommt eine klare Meldung und kein Request', async () => {
	const { c, anfragen } = ctx({ contact_type_id: 1, user_id: 1, owner_id: 1, additionalFields: {} });
	await assert.rejects(handlers.handleContactOperations.call(c, 'create', 0), /Name 1 is required/);
	assert.equal(anfragen.length, 0);
});

test('Kontakt-Update ergänzt fehlende Pflichtfelder aus dem Bestand', async () => {
	const { c, anfragen } = ctx({ contactId: '7', updateFields: { city: 'Bern' } }, (o) => (o.method === 'GET' ? { contact_type_id: 2, name_1: 'Muster', user_id: 3, owner_id: 4, city: 'Basel' } : {}));
	await handlers.handleContactOperations.call(c, 'update', 0);
	assert.deepEqual(anfragen[1].body, { city: 'Bern', contact_type_id: 2, name_1: 'Muster', user_id: 3, owner_id: 4 });
});

test('Kontakt-Update ohne Lesezugriff, wenn alle Pflichtfelder da sind', async () => {
	const felder = { contact_type_id: 1, name_1: 'X', user_id: 1, owner_id: 1 };
	const { c, anfragen } = ctx({ contactId: '7', updateFields: felder });
	await handlers.handleContactOperations.call(c, 'update', 0);
	assert.equal(anfragen.length, 1);
	assert.equal(anfragen[0].method, 'POST');
});

test('Suche: in und not_in schicken ein Array', async () => {
	const { c, anfragen } = ctx({ returnAll: false, limit: 1, searchCriteria: { criteria: [{ field: 'id', criteria: 'in', value: '1, 2' }, { field: 'mail', criteria: '=', value: 'a,b' }] } }, () => []);
	await handlers.handleContactOperations.call(c, 'search', 0);
	assert.deepEqual(anfragen[0].body, [{ field: 'id', criteria: 'in', value: ['1', '2'] }, { field: 'mail', criteria: '=', value: 'a,b' }]);
});

test('Rechnungen: Statusfilter läuft über die Suche und übersetzt alte Werte', async () => {
	const { c, anfragen } = ctx({ returnAll: false, limit: 5, options: { kb_item_status_id: '5' } }, () => []);
	await handlers.handleInvoiceOperations.call(c, 'getAll', 0);
	assert.ok(anfragen[0].url.endsWith('/2.0/kb_invoice/search'));
	assert.deepEqual(anfragen[0].body, [{ field: 'kb_item_status_id', value: '8', criteria: '=' }]);
});

test('Rechnungen: überfällig heisst offen und Fälligkeit in der Vergangenheit', async () => {
	const { c, anfragen } = ctx({ returnAll: false, limit: 5, options: { overdue_only: true } }, () => []);
	await handlers.handleInvoiceOperations.call(c, 'getAll', 0);
	assert.deepEqual(anfragen[0].body[0], { field: 'kb_item_status_id', value: ['8', '16', '31'], criteria: 'in' });
	assert.equal(anfragen[0].body[1].field, 'is_valid_to');
	assert.equal(anfragen[0].body[1].criteria, '<');
});

test('Rechnungen ohne Filter nutzen weiter die Liste', async () => {
	const { c, anfragen } = ctx({ returnAll: false, limit: 5, options: {} }, () => []);
	await handlers.handleInvoiceOperations.call(c, 'getAll', 0);
	assert.equal(anfragen[0].method, 'GET');
});

test('Rechnung senden verlangt den Platzhalter [Network Link]', async () => {
	const { c, anfragen } = ctx({ invoiceId: '1', recipient: 'a@b.ch', subject: 'S', message: 'ohne' });
	await assert.rejects(handlers.handleInvoiceOperations.call(c, 'send', 0), /Network Link/);
	assert.equal(anfragen.length, 0);
});

test('Item: alte Felder werden übersetzt, Preise als Text gesendet', async () => {
	const { c, anfragen } = ctx({ intern_name: 'X', additionalFields: { article_type: 'service', user_name: 'alt', sale_price: 12.5 } });
	await handlers.handleItemOperations.call(c, 'create', 0);
	assert.deepEqual(anfragen[0].body, { intern_name: 'X', article_type_id: 2, sale_price: '12.5' });
});

test('Auftrag: Update überträgt die Felder, Suche die Kriterien', async () => {
	const update = ctx({ orderId: '9', updateFields: { title: 'Neu' } });
	await handlers.handleOrderOperations.call(update.c, 'update', 0);
	assert.deepEqual(update.anfragen[0].body, { title: 'Neu' });
	const suche = ctx({ returnAll: false, limit: 1, searchCriteria: { criteria: [{ field: 'contact_id', criteria: '=', value: '4' }] } }, () => []);
	await handlers.handleQuoteOperations.call(suche.c, 'search', 0);
	assert.deepEqual(suche.anfragen[0].body, [{ field: 'contact_id', criteria: '=', value: '4' }]);
});

test('Item-Trigger meldet nur neue Artikel und läuft ohne updated_at', async () => {
	const statisch: Record<string, unknown> = { 'item:updated': 5, 'item:updated:field': 'id' };
	const { c } = ctx({ resource: 'item', event: 'updated' }, () => [{ id: 7 }, { id: 6 }, { id: 5 }]);
	c.getMode = () => 'trigger';
	c.getWorkflowStaticData = () => statisch;
	c.helpers.returnJsonArray = (x: any) => x.map((json: any) => ({ json }));
	const ergebnis = await (new BexioTrigger() as any).poll.call(c);
	assert.deepEqual(ergebnis[0].map((i: any) => i.json.id), [6, 7]);
	assert.equal(statisch['item:updated'], 7);
});

test('Anmeldung: ohne Auswahl Access Token (bexioApi), mit OAuth2 bexioOAuth2Api', async () => {
	const { bexioApiRequest } = await import('../nodes/Bexio/GenericFunctions');
	const { Bexio } = await import('../nodes/Bexio/Bexio.node');
	for (const [auth, erwartet] of [[undefined, 'bexioApi'], ['accessToken', 'bexioApi'], ['oAuth2', 'bexioOAuth2Api']]) {
		let benutzt = '';
		const c = {
			getNode: () => ({ name: 'Bexio', type: 'bexio', typeVersion: 1, id: 'x', position: [0, 0], parameters: auth ? { authentication: auth } : {} }),
			helpers: { httpRequestWithAuthentication: async (n: string) => { benutzt = n; return []; } },
		} as any;
		await bexioApiRequest.call(c, 'GET', '/2.0/contact');
		assert.equal(benutzt, erwartet, `authentication=${auth}`);
	}
	// Gespeicherte Workflows ohne Feld "authentication" laufen weiter mit dem PAT
	const d = new Bexio().description;
	const authFeld = d.properties.find((p) => p.name === 'authentication');
	assert.equal(authFeld?.default, 'accessToken');
	assert.deepEqual(d.credentials?.map((c) => [c.name, c.displayOptions?.show?.authentication]), [['bexioApi', ['accessToken']], ['bexioOAuth2Api', ['oAuth2']]]);
});
