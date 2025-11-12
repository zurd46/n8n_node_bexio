import { INodeProperties } from 'n8n-workflow';

export const payrollOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['payroll'] } },
		options: [
			{ name: 'Create Absence', value: 'createAbsence', description: 'Create an absence', action: 'Create an absence' },
			{ name: 'Get Employee', value: 'getEmployee', description: 'Get an employee', action: 'Get an employee' },
			{ name: 'Get Employees', value: 'getEmployees', description: 'Get employees', action: 'Get employees' },
		],
		default: 'getEmployees',
	},
];

export const payrollFields: INodeProperties[] = [
	{
		displayName: 'Employee ID',
		name: 'employeeId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['payroll'], operation: ['getEmployee', 'createAbsence'] } },
		default: '',
		description: 'ID of the employee',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['payroll'], operation: ['getEmployees'] } },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['payroll'], operation: ['getEmployees'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 2000 },
		default: 500,
		description: 'Max number of results to return',
	},
];
