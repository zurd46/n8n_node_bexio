import {
	IPollFunctions,
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
	IDataObject,
	NodeApiError,
	NodeConnectionTypes,
	JsonObject,
} from 'n8n-workflow';

import { bexioApiRequest, bexioApiRequestAllItems } from './GenericFunctions';

/**
 * Bexio does not offer native webhooks that are reliably documented for
 * status / cancellation events, so this trigger works by polling the Bexio
 * REST API on a schedule and emitting records that are new (or updated) since
 * the previous poll. State is kept in the workflow's static data so no event
 * is emitted twice.
 */

interface IResourceConfig {
	endpoint: string;
	// Whether the resource exposes an `updated_at` field usable for the
	// "created or updated" event. When false, that event degrades gracefully
	// to id-based detection (see poll()).
	supportsUpdatedAt: boolean;
}

const RESOURCE_CONFIG: { [key: string]: IResourceConfig } = {
	contact: { endpoint: '/2.0/contact', supportsUpdatedAt: true },
	invoice: { endpoint: '/2.0/kb_invoice', supportsUpdatedAt: true },
	order: { endpoint: '/2.0/kb_order', supportsUpdatedAt: true },
	quote: { endpoint: '/2.0/kb_offer', supportsUpdatedAt: true },
	item: { endpoint: '/2.0/article', supportsUpdatedAt: false },
};

// Page size used to establish the initial watermark on first activation.
const RECENT_PAGE_SIZE = 100;

function toNumber(value: unknown): number | undefined {
	const n = Number(value);
	return Number.isFinite(n) ? n : undefined;
}

/**
 * Returns the maximum value of `field` across `items`.
 * - For `id` a numeric maximum is used.
 * - For `updated_at` (string `YYYY-MM-DD HH:MM:SS`) a lexicographic maximum is
 *   used, which is equivalent to chronological ordering for that format.
 */
function computeMax(items: IDataObject[], field: string): number | string | undefined {
	if (field === 'id') {
		let max: number | undefined;
		for (const item of items) {
			const n = toNumber(item.id);
			if (n !== undefined && (max === undefined || n > max)) {
				max = n;
			}
		}
		return max;
	}

	let max: string | undefined;
	for (const item of items) {
		const v = item[field];
		if (typeof v === 'string' && v !== '' && (max === undefined || v > max)) {
			max = v;
		}
	}
	return max;
}

/** Sorts items ascending by `field` (numeric for id, string otherwise). */
function sortByField(items: IDataObject[], field: string): IDataObject[] {
	return [...items].sort((a, b) => {
		if (field === 'id') {
			return (toNumber(a.id) ?? 0) - (toNumber(b.id) ?? 0);
		}
		const av = (a[field] as string) ?? '';
		const bv = (b[field] as string) ?? '';
		return av < bv ? -1 : av > bv ? 1 : 0;
	});
}

export class BexioTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Bexio Trigger',
		name: 'bexioTrigger',
		icon: { light: 'file:../../icons/bexio.svg', dark: 'file:../../icons/bexio.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"] + ": " + $parameter["resource"]}}',
		description: 'Starts the workflow when Bexio records are created or updated (polling)',
		defaults: {
			name: 'Bexio Trigger',
		},
		polling: true,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'bexioApi',
				required: true,
				displayOptions: { show: { authentication: ['accessToken'] } },
			},
			{
				name: 'bexioOAuth2Api',
				required: true,
				displayOptions: { show: { authentication: ['oAuth2'] } },
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{ name: 'Access Token', value: 'accessToken' },
					{ name: 'OAuth2', value: 'oAuth2' },
				],
				default: 'accessToken',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Contact',
						value: 'contact',
						description: 'Customers and suppliers',
					},
					{
						name: 'Invoice',
						value: 'invoice',
						description: 'Customer invoices',
					},
					{
						name: 'Item',
						value: 'item',
						description: 'Products and services',
					},
					{
						name: 'Order',
						value: 'order',
						description: 'Customer orders',
					},
					{
						name: 'Quote',
						value: 'quote',
						description: 'Customer quotes (offers)',
					},
				],
				default: 'invoice',
			},
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Created',
						value: 'created',
						description: 'Emit only newly created records (detected via increasing ID)',
					},
					{
						name: 'Created or Updated',
						value: 'updated',
						description:
							'Emit records that were created or changed (detected via updated_at). Also catches status and cancellation changes. For Item this falls back to created-only.',
					},
				],
				default: 'created',
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const resource = this.getNodeParameter('resource') as string;
		const event = this.getNodeParameter('event') as string;

		const config = RESOURCE_CONFIG[resource];
		if (!config) {
			throw new NodeApiError(this.getNode(), {
				message: `Unsupported resource: ${resource}`,
			} as JsonObject);
		}

		const endpoint = config.endpoint;
		const mode = this.getMode();
		const staticData = this.getWorkflowStaticData('node') as IDataObject;

		// State is isolated per resource+event so switching either does not
		// reuse a stale watermark. We also persist which field was actually
		// used, so an `updated_at` fallback to `id` stays consistent.
		const stateKey = `${resource}:${event}`;
		const fieldKey = `${stateKey}:field`;

		// Articles have no updated_at and cannot be searched by id according to the Bexio API.
		const requestedField = event === 'created' || !config.supportsUpdatedAt ? 'id' : 'updated_at';
		let watermarkField = (staticData[fieldKey] as string) || requestedField;
		const lastWatermark = staticData[stateKey] as number | string | undefined;

		// ---- First activation: establish the watermark, do not replay history ----
		if (lastWatermark === undefined || lastWatermark === null || lastWatermark === '') {
			const qs: IDataObject = {
				order_by: `${requestedField}_desc`,
				limit: RECENT_PAGE_SIZE,
			};
			let recentItems: IDataObject[] = [];
			try {
				const response = await bexioApiRequest.call(this, 'GET', endpoint, {}, qs);
				recentItems = Array.isArray(response) ? (response as IDataObject[]) : [];
			} catch (error) {
				throw new NodeApiError(this.getNode(), error as JsonObject);
			}

			// Fallback: if updated_at is requested but not present on the records,
			// switch this resource+event to id-based detection permanently.
			if (
				requestedField === 'updated_at' &&
				recentItems.length > 0 &&
				recentItems.every((item) => item.updated_at === undefined || item.updated_at === null)
			) {
				watermarkField = 'id';
			}

			const initialWatermark = computeMax(recentItems, watermarkField);
			staticData[fieldKey] = watermarkField;
			staticData[stateKey] =
				initialWatermark !== undefined ? initialWatermark : watermarkField === 'id' ? 0 : '';

			// In manual (test) mode, return the most recent record as a sample so
			// the user sees output. In production, emit nothing on first run.
			if (mode === 'manual' && recentItems.length > 0) {
				const sample = sortByField(recentItems, watermarkField).slice(-1);
				return [this.helpers.returnJsonArray(sample)];
			}
			return null;
		}

		// ---- Subsequent polls: fetch everything past the watermark ----
		const criteria = [
			{
				field: watermarkField,
				value: lastWatermark,
				criteria: '>',
			},
		];

		let items: IDataObject[];
		try {
			if (!config.supportsUpdatedAt) {
				// /2.0/article/search only supports intern_name and intern_code: walk the list newest first.
				items = [];
				for (let offset = 0; ; offset += RECENT_PAGE_SIZE) {
					const page = (await bexioApiRequest.call(this, 'GET', endpoint, {}, {
						order_by: 'id_desc',
						limit: RECENT_PAGE_SIZE,
						offset,
					})) as IDataObject[];
					const batch = Array.isArray(page) ? page : [];
					items.push(...batch);
					const oldest = batch.length > 0 ? toNumber(batch[batch.length - 1].id) : undefined;
					if (batch.length < RECENT_PAGE_SIZE || (oldest !== undefined && oldest <= (lastWatermark as number))) {
						break;
					}
				}
			} else {
				const response = await bexioApiRequestAllItems.call(
					this,
					'POST',
					`${endpoint}/search`,
					criteria,
				);
				items = Array.isArray(response) ? (response as IDataObject[]) : [];
			}
		} catch (error) {
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}

		// Guard against the API ignoring the filter and returning the whole set:
		// keep only records strictly beyond the watermark.
		const filtered = items.filter((item) => {
			const v = item[watermarkField];
			if (watermarkField === 'id') {
				const n = toNumber(v);
				return n !== undefined && n > (lastWatermark as number);
			}
			return typeof v === 'string' && v > (lastWatermark as string);
		});

		if (filtered.length === 0) {
			return null;
		}

		const sorted = sortByField(filtered, watermarkField);
		const newWatermark = computeMax(sorted, watermarkField);
		if (newWatermark !== undefined) {
			staticData[stateKey] = newWatermark;
		}

		return [this.helpers.returnJsonArray(sorted)];
	}
}
