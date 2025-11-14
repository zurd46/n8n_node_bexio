import * as fs from 'fs';
import * as path from 'path';

export interface TestResult {
	resource: string;
	operation: string;
	success: boolean;
	duration: number;
	error?: string;
	details?: any;
	timestamp: string;
}

export class TestLogger {
	private results: TestResult[] = [];
	private startTime: number = Date.now();

	logTest(result: TestResult) {
		this.results.push(result);
		const status = result.success ? '✓' : '✗';
		const color = result.success ? '\x1b[32m' : '\x1b[31m';
		const reset = '\x1b[0m';

		console.log(
			`${color}${status}${reset} ${result.resource}.${result.operation} (${result.duration}ms)`
		);

		if (!result.success && result.error) {
			console.log(`  Error: ${result.error}`);
		}
	}

	getResults() {
		return this.results;
	}

	getSummary() {
		const total = this.results.length;
		const passed = this.results.filter(r => r.success).length;
		const failed = total - passed;
		const duration = Date.now() - this.startTime;

		return {
			total,
			passed,
			failed,
			duration,
			successRate: total > 0 ? ((passed / total) * 100).toFixed(2) : '0',
		};
	}

	printSummary() {
		const summary = this.getSummary();
		console.log('\n' + '='.repeat(60));
		console.log('TEST SUMMARY');
		console.log('='.repeat(60));
		console.log(`Total Tests: ${summary.total}`);
		console.log(`\x1b[32m✓ Passed: ${summary.passed}\x1b[0m`);
		console.log(`\x1b[31m✗ Failed: ${summary.failed}\x1b[0m`);
		console.log(`Success Rate: ${summary.successRate}%`);
		console.log(`Total Duration: ${summary.duration}ms`);
		console.log('='.repeat(60) + '\n');
	}

	saveReport(filename: string = 'test-report.json') {
		const reportPath = path.join(__dirname, '..', 'results', filename);
		const report = {
			summary: this.getSummary(),
			results: this.results,
			timestamp: new Date().toISOString(),
		};

		fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
		console.log(`\nDetailed report saved to: ${reportPath}`);
	}

	saveHtmlReport(filename: string = 'test-report.html') {
		const reportPath = path.join(__dirname, '..', 'results', filename);
		const summary = this.getSummary();

		const html = `
<!DOCTYPE html>
<html>
<head>
	<title>Bexio Node Test Report</title>
	<style>
		body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
		.container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
		h1 { color: #333; border-bottom: 3px solid #4CAF50; padding-bottom: 10px; }
		.summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
		.summary-card { padding: 15px; border-radius: 5px; color: white; }
		.summary-card h3 { margin: 0 0 10px 0; font-size: 14px; opacity: 0.9; }
		.summary-card .value { font-size: 32px; font-weight: bold; }
		.total { background: #2196F3; }
		.passed { background: #4CAF50; }
		.failed { background: #f44336; }
		.rate { background: #FF9800; }
		table { width: 100%; border-collapse: collapse; margin-top: 20px; }
		th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
		th { background: #f5f5f5; font-weight: bold; color: #333; }
		tr:hover { background: #f9f9f9; }
		.success { color: #4CAF50; font-weight: bold; }
		.failure { color: #f44336; font-weight: bold; }
		.error-details { background: #ffebee; padding: 8px; margin-top: 5px; border-radius: 4px; font-size: 12px; color: #c62828; }
		.resource-group { margin-top: 30px; }
		.resource-header { background: #e3f2fd; padding: 10px; border-radius: 5px; margin-bottom: 10px; }
	</style>
</head>
<body>
	<div class="container">
		<h1>🧪 Bexio Node Test Report</h1>
		<p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>

		<div class="summary">
			<div class="summary-card total">
				<h3>Total Tests</h3>
				<div class="value">${summary.total}</div>
			</div>
			<div class="summary-card passed">
				<h3>Passed</h3>
				<div class="value">${summary.passed}</div>
			</div>
			<div class="summary-card failed">
				<h3>Failed</h3>
				<div class="value">${summary.failed}</div>
			</div>
			<div class="summary-card rate">
				<h3>Success Rate</h3>
				<div class="value">${summary.successRate}%</div>
			</div>
		</div>

		<table>
			<thead>
				<tr>
					<th>Status</th>
					<th>Resource</th>
					<th>Operation</th>
					<th>Duration</th>
					<th>Timestamp</th>
				</tr>
			</thead>
			<tbody>
				${this.results.map(result => `
					<tr>
						<td class="${result.success ? 'success' : 'failure'}">
							${result.success ? '✓ PASS' : '✗ FAIL'}
						</td>
						<td>${result.resource}</td>
						<td>${result.operation}</td>
						<td>${result.duration}ms</td>
						<td>${new Date(result.timestamp).toLocaleTimeString()}</td>
					</tr>
					${!result.success && result.error ? `
					<tr>
						<td colspan="5">
							<div class="error-details">
								<strong>Error:</strong> ${this.escapeHtml(JSON.stringify(result.error, null, 2))}
							</div>
						</td>
					</tr>
					` : ''}
				`).join('')}
			</tbody>
		</table>
	</div>
</body>
</html>
		`;

		fs.writeFileSync(reportPath, html);
		console.log(`HTML report saved to: ${reportPath}`);
	}

	private escapeHtml(text: string): string {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}
}
