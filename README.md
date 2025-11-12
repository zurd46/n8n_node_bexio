# n8n-nodes-bexio

This is an n8n community node that provides comprehensive integration with the [Bexio API](https://docs.bexio.com/).

Bexio is a Swiss business software solution for accounting, invoicing, contact management, and more.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes** in your n8n instance
2. Select **Install**
3. Enter `n8n-nodes-bexio` in **Enter npm package name**
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes
5. Select **Install**

### Manual Installation

To install this node manually in your n8n instance:

```bash
npm install n8n-nodes-bexio
```

## Credentials

This node uses **Personal Access Token (PAT)** authentication for simple and reliable API access.

### Setup Steps

1. Go to the [Bexio Developer Portal](https://developer.bexio.com/)
2. Create a **Personal Access Token (PAT)**
3. Configure the required permissions for your use case
4. Copy the token (it will only be shown once!)
5. In n8n, create a **Bexio API** credential
6. Paste your Personal Access Token

📖 **Detailed Setup Guide**: See [PERSONAL_ACCESS_TOKEN_SETUP.md](PERSONAL_ACCESS_TOKEN_SETUP.md)

### Available Permissions

When creating your Personal Access Token, you can select permissions for:

**Contacts**: View, create, edit, and delete contacts
**Invoices**: View, create, edit, and delete invoices
**Quotes**: View, create, edit, and delete quotes
**Orders**: View, create, edit, and delete orders
**Items/Products**: View, create, edit, and delete items
**Projects**: View, create, edit, and delete projects
**Timesheets**: View, create, edit, and delete timesheet entries
**Accounting**: View and edit accounting data
**Banking**: View bank accounts and manage payments
**Company**: Access company profile information
**Bills**: View, create, edit, and delete purchase bills
**Expenses**: View, create, edit, and delete expenses
**Tasks**: View, create, edit, and delete tasks
**Files**: Upload, download, and manage files
**Payroll**: View employee and absence data

**Recommended**: Enable all permissions you need when creating the token. You can always create a new token with different permissions if needed.

## Operations

This node supports the following resources and operations:

### Contact
- **Create**: Create a new contact (person or company)
- **Delete**: Delete a contact
- **Get**: Retrieve a single contact
- **Get Many**: Retrieve multiple contacts
- **Search**: Search contacts with criteria
- **Update**: Update a contact

### Invoice
- **Create**: Create a new invoice
- **Delete**: Delete an invoice
- **Get**: Retrieve a single invoice
- **Get Many**: Retrieve multiple invoices
- **Get PDF**: Download invoice as PDF
- **Issue**: Issue an invoice
- **Mark as Sent**: Mark invoice as sent
- **Search**: Search invoices with criteria
- **Send**: Send invoice via email
- **Update**: Update an invoice

### Project
- **Create**: Create a new project
- **Delete**: Delete a project
- **Get**: Retrieve a single project
- **Get Many**: Retrieve multiple projects
- **Archive**: Archive a project
- **Unarchive**: Unarchive a project
- **Search**: Search projects with criteria
- **Update**: Update a project

### Item (Products/Services)
- **Create**: Create a new item
- **Delete**: Delete an item
- **Get**: Retrieve a single item
- **Get Many**: Retrieve multiple items
- **Search**: Search items with criteria
- **Update**: Update an item

### Timesheet
- **Create**: Create a new timesheet entry
- **Delete**: Delete a timesheet entry
- **Get**: Retrieve a single timesheet entry
- **Get Many**: Retrieve multiple timesheet entries
- **Search**: Search timesheet entries with criteria
- **Update**: Update a timesheet entry

### Quote
- **Create**: Create a new quote
- **Delete**: Delete a quote
- **Get**: Retrieve a single quote
- **Get Many**: Retrieve multiple quotes
- **Get PDF**: Download quote as PDF
- **Issue**: Issue a quote
- **Search**: Search quotes with criteria
- **Update**: Update a quote

### Order
- **Create**: Create a new order
- **Delete**: Delete an order
- **Get**: Retrieve a single order
- **Get Many**: Retrieve multiple orders
- **Get PDF**: Download order as PDF
- **Search**: Search orders with criteria
- **Update**: Update an order

### Bill (Purchase)
- **Create**: Create a new bill
- **Delete**: Delete a bill
- **Get**: Retrieve a single bill
- **Get Many**: Retrieve multiple bills
- **Update**: Update a bill

### Expense
- **Create**: Create a new expense
- **Delete**: Delete an expense
- **Get**: Retrieve a single expense
- **Get Many**: Retrieve multiple expenses
- **Update**: Update an expense

### Task
- **Create**: Create a new task
- **Delete**: Delete a task
- **Get**: Retrieve a single task
- **Get Many**: Retrieve multiple tasks
- **Search**: Search tasks with criteria
- **Update**: Update a task

### File
- **Create**: Upload a file
- **Delete**: Delete a file
- **Get**: Retrieve file metadata
- **Get Many**: Retrieve multiple files
- **Download**: Download a file
- **Search**: Search files with criteria

### Banking
- **Get Bank Accounts**: Retrieve bank accounts
- **Get Payments**: Retrieve multiple payments
- **Get Payment**: Retrieve a single payment
- **Create Payment**: Create a new payment

### Accounting
- **Get Accounts**: Retrieve chart of accounts
- **Get Currencies**: Retrieve currencies
- **Get Taxes**: Retrieve tax rates
- **Get VAT Periods**: Retrieve VAT periods
- **Create Manual Entry**: Create a manual accounting entry

### Payroll
- **Get Employees**: Retrieve multiple employees
- **Get Employee**: Retrieve a single employee
- **Create Absence**: Create an employee absence

## Usage Examples

### Example 1: Create a Contact
1. Add a Bexio node to your workflow
2. Select **Contact** as the resource
3. Select **Create** as the operation
4. Choose **Contact Type** (Person or Company)
5. Fill in the contact details (name, email, address, etc.)

### Example 2: Create and Send an Invoice
1. Create an invoice using the **Invoice** resource with **Create** operation
2. Add invoice positions (line items) as JSON
3. Use **Issue** operation to finalize the invoice
4. Use **Send** operation to email the invoice to the customer

### Example 3: Track Time on a Project
1. Use the **Timesheet** resource with **Create** operation
2. Select the user, project, and activity
3. Enter the date and duration (in minutes)
4. Add a description of the work performed

## API Documentation

For detailed information about the Bexio API, visit:
- [Bexio API Documentation](https://docs.bexio.com/)
- [Bexio Developer Portal](https://developer.bexio.com/)

## Compatibility

- Tested with n8n version 1.0.0 and above
- Compatible with Bexio API v2.0, v3.0, and v4.0 endpoints

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Bexio API Reference](https://docs.bexio.com/)

## Support

For issues and feature requests, please create an issue on the [GitHub repository](https://github.com/yourusername/n8n-nodes-bexio/issues).

## Development

### Setup

```bash
# Install dependencies
npm install

# Build the node
npm run build

# Run linter
npm run lint

# Fix linting issues
npm run lintfix
```

### Project Structure

```
n8n-nodes-bexio/
├── credentials/
│   └── BexioOAuth2Api.credentials.ts
├── nodes/
│   └── Bexio/
│       ├── Bexio.node.ts
│       ├── GenericFunctions.ts
│       ├── OperationsHandlers.ts
│       ├── bexio.svg
│       └── descriptions/
│           ├── ContactDescription.ts
│           ├── InvoiceDescription.ts
│           ├── ProjectDescription.ts
│           ├── ItemDescription.ts
│           ├── TimesheetDescription.ts
│           ├── QuoteDescription.ts
│           ├── OrderDescription.ts
│           ├── BillDescription.ts
│           ├── ExpenseDescription.ts
│           ├── TaskDescription.ts
│           ├── FileDescription.ts
│           ├── BankingDescription.ts
│           ├── AccountingDescription.ts
│           └── PayrollDescription.ts
├── package.json
├── tsconfig.json
├── gulpfile.js
└── README.md
```

## License

[MIT](LICENSE.md)

## Author

Daniel Zurmühle (daniel.zurmuehle@zurdai.com) zurdai.com

## Version History

### 1.0.6
- Re-publish of 1.0.4/1.0.5 due to npm version conflict
- No code changes

### 1.0.4
- **Changed authentication to Personal Access Token (PAT)**
- Simplified setup - no more OAuth configuration needed
- Improved reliability and ease of use
- Updated documentation with PAT setup guide

### 1.0.3
- Updated dependencies
- Fixed TypeScript compilation issues
- Improved error handling

### 1.0.0
- Initial release
- Support for all major Bexio API resources
- Comprehensive CRUD operations for:
  - Contacts
  - Invoices
  - Projects
  - Items
  - Timesheets
  - Quotes
  - Orders
  - Bills
  - Expenses
  - Tasks
  - Files
  - Banking
  - Accounting
  - Payroll
