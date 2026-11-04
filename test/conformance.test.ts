// Gleicht jede Operation des Nodes mit der Live-Doku von https://docs.bexio.com/ ab.
// Es wird kein Bexio-Konto angesprochen: die Requests werden nur abgefangen und geprüft.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { before, test } from 'node:test';
import { INodeProperties } from 'n8n-workflow';
import { Bexio } from '../nodes/Bexio/Bexio.node';
import { BexioTrigger } from '../nodes/Bexio/BexioTrigger.node';
import * as handlers from '../nodes/Bexio/OperationsHandlers';
import { searchOperatorOptions } from '../nodes/Bexio/descriptions/SearchOperators';

type Req = { method: string; url: string; body?: any; qs?: Record<string, unknown> };

let spec: any;

before(async () => {
	if (process.env.BEXIO_SPEC) {
		spec = JSON.parse(readFileSync(process.env.BEXIO_SPEC, 'utf8'));
		return;
	}
	const html = await (await fetch('https://docs.bexio.com/')).text();
	const marke = '__redoc_state = ';
	const start = html.indexOf(marke) + marke.length;
	let tiefe = 0;
	let inText = false;
	let esc = false;
	let i = start;
	for (; i < html.length; i++) {
		const c = html[i];
		if (inText) {
			if (esc) esc = false;
			else if (c === '\\') esc = true;
			else if (c === '"') inText = false;
			continue;
		}
		if (c === '"') inText = true;
		else if (c === '{') tiefe++;
		else if (c === '}' && --tiefe === 0) break;
	}
	spec = JSON.parse(html.slice(start, i + 1)).spec.data;
});

const res = (x: any): any => {
	while (x?.$ref) x = x.$ref.replace('#/', '').split('/').reduce((a: any, k: string) => a[k], spec);
	return x;
};
const props = (x: any): Record<string, any> => {
	x = res(x) ?? {};
	let out: Record<string, any> = {};
	for (const a of [...(x.allOf ?? []), ...(x.oneOf ?? []).slice(0, 1)]) out = { ...out, ...props(a) };
	if (x.type === 'array') out = { ...out, ...props(x.items) };
	for (const [k, v] of Object.entries(x.properties ?? {})) out[k] = res(v);
	return out;
};
const required = (x: any): string[] => {
	x = res(x) ?? {};
	return [...(x.required ?? []), ...(x.allOf ?? []).flatMap(required)];
};

function findOperation(method: string, url: string) {
	const pfad = new URL(url).pathname;
	for (const [template, ops] of Object.entries<any>(spec.paths)) {
		const muster = new RegExp('^' + template.replace(/\{[^}]+\}/g, '[^/]+') + '$');
		if (muster.test(pfad) && ops[method.toLowerCase()]) return { template, op: ops[method.toLowerCase()] };
	}
	return undefined;
}

const SUCHKRITERIEN = ['=', 'equal', '!=', 'not_equal', '>', 'greater_than', '<', 'less_than', '>=', 'greater_equal', '<=', 'less_equal', 'like', 'not_like', 'is_null', 'not_null', 'in', 'not_in'];

function checkRequest(name: string, r: Req) {
	const treffer = findOperation(r.method, r.url);
	assert.ok(treffer, `${name}: ${r.method} ${new URL(r.url).pathname} fehlt in der Doku`);
	const { template, op } = treffer;
	const params = (op.parameters ?? []).map(res).filter((p: any) => p.in === 'query').map((p: any) => p.name);
	for (const k of Object.keys(r.qs ?? {})) {
		assert.ok(params.includes(k), `${name}: Query ${k} fehlt in der Doku von ${template} (${params})`);
	}
	const schema = op.requestBody ? res(op.requestBody).content['application/json'].schema : undefined;
	if (template.endsWith('/search')) {
		const felder = (op.description ?? '').match(/`[a-z_0-9]+`/g)?.map((f: string) => f.replaceAll('`', '')) ?? [];
		for (const k of r.body ?? []) {
			assert.ok(felder.includes(k.field), `${name}: Suchfeld ${k.field} fehlt in der Doku von ${template}`);
			assert.ok(SUCHKRITERIEN.includes(k.criteria), `${name}: Kriterium ${k.criteria}`);
		}
		return;
	}
	if (!schema || !r.body) return;
	const erlaubt = props(schema);
	for (const k of Object.keys(r.body)) {
		assert.ok(erlaubt[k], `${name}: Feld ${k} fehlt in der Doku von ${r.method} ${template}`);
		assert.ok(!erlaubt[k].readOnly, `${name}: Feld ${k} ist laut Doku schreibgeschützt`);
		if (erlaubt[k].enum) assert.ok(erlaubt[k].enum.includes(r.body[k]), `${name}: Wert ${r.body[k]} für ${k}, Doku: ${erlaubt[k].enum}`);
	}
	// Die Doku nennt bei additional_address contact_id und contact_sub_id als Pflicht,
	// definiert sie dort aber gar nicht als Felder. Geprüft wird nur, was definiert ist.
	for (const k of required(schema).filter((f) => erlaubt[f])) {
		assert.ok(r.body[k] !== undefined, `${name}: Pflichtfeld ${k} fehlt für ${r.method} ${template}`);
	}
}

const beispiel = (p: any): unknown => {
	if (p.type === 'options' && p.options?.length && !p.typeOptions) return p.options[0].value;
	if (p.type === 'options') return 1;
	if (p.type === 'number') return p.name.endsWith('_id') ? 1 : 2;
	if (p.type === 'boolean') return true;
	if (p.type === 'json') return '[]';
	if (p.name === 'message') return 'Hallo [Network Link]';
	if (p.name === 'contact_id' || p.name === 'contact_sub_id') return '1';
	return '1';
};

function parameter(properties: INodeProperties[], resource: string, operation: string, returnAll: boolean) {
	const werte: Record<string, unknown> = { resource, operation, returnAll, limit: 10 };
	for (const p of properties as any[]) {
		const s = p.displayOptions?.show;
		if (!s || !s.resource?.includes(resource)) continue;
		if (s.operation && !s.operation.includes(operation)) continue;
		if (s.returnAll) continue;
		if (p.name === 'operation' || p.name === 'returnAll') continue;
		if (p.type === 'collection') {
			werte[p.name] = Object.fromEntries(p.options.map((o: any) => [o.name, beispiel(o)]));
		} else if (p.type === 'fixedCollection') {
			const v = p.options[0].values;
			const feld = v.find((x: any) => x.name === 'field');
			werte[p.name] = { criteria: feld.options.map((o: any) => ({ field: o.value, criteria: '=', value: '1' })) };
		} else {
			werte[p.name] = beispiel(p);
		}
	}
	return werte;
}

function kontext(werte: Record<string, unknown>, antwort: (r: Req) => unknown = () => []) {
	const anfragen: Req[] = [];
	const ctx: any = {
		getNodeParameter: (n: string, _i: number, d?: unknown) => (n in werte ? werte[n] : d),
		getNode: () => ({ name: 'Bexio', type: 'bexio', typeVersion: 1, id: 'x', position: [0, 0], parameters: {} }),
		helpers: {
			httpRequestWithAuthentication: async (_c: string, o: any) => {
				const r = { method: o.method, url: o.url, body: o.body, qs: o.qs };
				anfragen.push(r);
				return antwort(r);
			},
			prepareBinaryData: async () => ({}),
		},
	};
	return { ctx, anfragen };
}

const HANDLER: Record<string, any> = {
	banking: handlers.handleBankingOperations,
	contact: handlers.handleContactOperations,
	contactRelation: handlers.handleContactRelationOperations,
	additionalAddress: handlers.handleAdditionalAddressOperations,
	invoice: handlers.handleInvoiceOperations,
	item: handlers.handleItemOperations,
	order: handlers.handleOrderOperations,
	quote: handlers.handleQuoteOperations,
};

const kontaktDaten = { contact_type_id: 1, name_1: 'X', user_id: 1, owner_id: 1 };

test('jede Operation jeder Ressource entspricht der Doku', async () => {
	const properties = new Bexio().description.properties;
	const anzahl: Record<string, number> = {};
	for (const resource of Object.keys(HANDLER)) {
		const ops = (properties as any[]).find((p) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes(resource));
		assert.ok(ops, `Keine Operationen für ${resource}`);
		for (const { value: operation } of ops.options) {
			for (const returnAll of [false, true]) {
				const werte = parameter(properties, resource, operation, returnAll);
				const { ctx, anfragen } = kontext(werte, (r) => (r.method === 'GET' && resource === 'contact' ? kontaktDaten : operation === 'getPdf' ? Buffer.from('x') : []));
				await HANDLER[resource].call(ctx, operation, 0);
				assert.ok(anfragen.length > 0, `${resource}.${operation}: kein Request`);
				for (const r of anfragen) checkRequest(`${resource}.${operation}`, r);
				anzahl[resource] = (anzahl[resource] ?? 0) + 1;
			}
		}
	}
	assert.deepEqual(Object.keys(anzahl).sort(), Object.keys(HANDLER).sort());
});

test('Auswahlwerte der Beschreibungen entsprechen der Doku', () => {
	const properties = new Bexio().description.properties as any[];
	const doku = (p: string) => props(res(spec.paths[p].post.requestBody).content['application/json'].schema);
	const kontakt = doku('/2.0/contact');
	assert.match(kontakt.contact_type_id.description, /`1` for companies or `2` for persons/);
	const typ = properties.find((p) => p.name === 'contact_type_id');
	assert.deepEqual(typ.options.map((o: any) => [o.name, o.value]), [['Company', 1], ['Person', 2]]);

	const status = props(res(spec.paths['/2.0/kb_invoice/{invoice_id}'].get.responses['200']).content['application/json'].schema).kb_item_status_id.enum;
	const optionen = properties.find((p) => p.name === 'options' && p.displayOptions?.show?.resource?.includes('invoice'));
	const werte = optionen.options.find((o: any) => o.name === 'kb_item_status_id').options.map((o: any) => o.value).filter((v: string) => v !== '');
	assert.deepEqual(werte.map(Number).sort((a: number, b: number) => a - b), [...status].sort((a: number, b: number) => a - b));
});

test('Suchoperatoren stehen in der Doku', () => {
	const doku = (res(spec.info).description as string);
	const start = doku.indexOf('### Criterias');
	const abschnitt = doku.slice(start, doku.indexOf('### Code example', start));
	const dokumentiert = [...abschnitt.matchAll(/^\| `([^`]+)`/gm)].map((m) => m[1]);
	assert.ok(dokumentiert.length > 10, 'Kriterien nicht gefunden');
	assert.deepEqual(dokumentiert.sort(), [...SUCHKRITERIEN].sort());
	for (const o of searchOperatorOptions) assert.ok(dokumentiert.includes(o.value as string), `Operator ${o.value} fehlt in der Doku`);
});

test('alle Dropdowns nutzen dokumentierte Pfade', async () => {
	const node = new Bexio() as any;
	const benutzt = new Set<string>();
	const walk = (x: any) => {
		if (Array.isArray(x)) x.forEach(walk);
		else if (x && typeof x === 'object') {
			if (x.loadOptionsMethod) benutzt.add(x.loadOptionsMethod);
			Object.values(x).forEach(walk);
		}
	};
	walk(node.description.properties);
	assert.ok(benutzt.has('getUsers'));
	for (const methode of benutzt) {
		const { ctx, anfragen } = kontext({});
		await node.methods.loadOptions[methode].call(ctx);
		for (const r of anfragen) assert.ok(findOperation(r.method, r.url), `${methode}: ${r.url} fehlt in der Doku`);
	}
});

for (const [resource, event] of [['contact', 'updated'], ['invoice', 'updated'], ['order', 'updated'], ['quote', 'updated'], ['order', 'created'], ['item', 'created'], ['item', 'updated']]) {
	test(`Trigger ${resource}/${event} entspricht der Doku`, async () => {
		const statisch: Record<string, unknown> = {};
		const { ctx, anfragen } = kontext({ resource, event }, () => []);
		ctx.getMode = () => 'trigger';
		ctx.getWorkflowStaticData = () => statisch;
		const t = new BexioTrigger() as any;
		await t.poll.call(ctx);
		statisch[`${resource}:${event}`] = resource === 'item' || event === 'created' ? 5 : '2026-01-01 00:00:00';
		await t.poll.call(ctx);
		assert.equal(anfragen.length, 2);
		for (const r of anfragen) {
			const treffer = findOperation(r.method, r.url);
			assert.ok(treffer, r.url);
			if (r.qs?.order_by) {
				const erlaubt = (treffer.op.parameters ?? []).map(res).find((p: any) => p.name === 'order_by')?.schema?.enum;
				assert.ok(erlaubt.includes(String(r.qs.order_by).replace(/_(asc|desc)$/, '')), `order_by ${r.qs.order_by}, Doku: ${erlaubt}`);
			}
			checkRequest(`trigger.${resource}`, r);
		}
	});
}
