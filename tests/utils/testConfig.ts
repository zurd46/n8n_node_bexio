import * as fs from 'fs';
import * as path from 'path';

interface TestConfig {
	token: string;
	baseUrl: string;
}

export function loadTestConfig(): TestConfig {
	const envPath = path.join(__dirname, '..', '.env.test');
	const envContent = fs.readFileSync(envPath, 'utf-8');

	const config: any = {};
	envContent.split('\n').forEach(line => {
		if (line.startsWith('#') || !line.trim()) return;
		const [key, ...valueParts] = line.split('=');
		if (key && valueParts.length) {
			config[key.trim()] = valueParts.join('=').trim();
		}
	});

	return {
		token: config.BEXIO_PAT_TOKEN,
		baseUrl: config.BEXIO_API_BASE_URL || 'https://api.bexio.com',
	};
}
