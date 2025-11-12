# @zurdai/n8n-nodes-bexio

This is an n8n community node that provides comprehensive integration with the [Bexio API](https://docs.bexio.com/).

Bexio is a Swiss business software solution for accounting, invoicing, contact management, and more.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes** in your n8n instance
2. Select **Install**
3. Enter `@zurdai/n8n-nodes-bexio` in **Enter npm package name**
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes
5. Select **Install**

### Manual Installation

To install this node manually in your n8n instance:

```bash
npm install @zurdai/n8n-nodes-bexio
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

**Contacts**: View, create, edit, and delete contacts (customers and suppliers)
**Invoices**: View, create, edit, and delete invoices
**Quotes**: View, create, edit, and delete quotes (offers)
**Orders**: View, create, edit, and delete orders
**Items/Products**: View, create, edit, and delete items (products and services)
**Banking**: View bank accounts and manage payments
**Company**: Access company profile information

**Recommended**: Enable all permissions for the resources you plan to use when creating the token. You can always create a new token with different permissions if needed.

## Operations

This node focuses on essential business operations with the following resources:

### Contact (Customers & Suppliers)
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

### Item (Products/Services)
- **Create**: Create a new item
- **Delete**: Delete an item
- **Get**: Retrieve a single item
- **Get Many**: Retrieve multiple items
- **Search**: Search items with criteria
- **Update**: Update an item

### Quote (Offers)
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

### Banking
- **Get Bank Accounts**: Retrieve bank accounts
- **Get Payments**: Retrieve multiple payments
- **Get Payment**: Retrieve a single payment
- **Create Payment**: Create a new payment

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

### Example 3: Create a Quote and Convert to Order
1. Create a quote using the **Quote** resource with **Create** operation
2. Add quote positions (line items) as JSON
3. Use **Issue** operation to finalize the quote
4. Once accepted, create an order from the same data using the **Order** resource

## API Documentation

For detailed information about the Bexio API, visit:
- [Bexio API Documentation](https://docs.bexio.com/)
- [Bexio Developer Portal](https://developer.bexio.com/)

## Compatibility

- Tested with n8n version 1.0.0 and above
- Uses Bexio API v2.0 and v3.0 endpoints
- All endpoints verified and tested against Bexio API documentation

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Bexio API Reference](https://docs.bexio.com/)

## Support

For issues and feature requests, please create an issue on the [GitHub repository](https://github.com/zurd46/n8n_node_bexio/issues).

## Custom Adjustments

If you need specific customizations or have special requirements for this integration, please contact:

- **Email**: daniel.zurmuehle@zurdai.com
- **Phone**: +41 79 127 55 54

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
@zurdai/n8n-nodes-bexio/
├── credentials/
│   ├── BexioApi.credentials.ts          # PAT Authentication (Current)
│   └── BexioOAuth2Api.credentials.ts    # OAuth2 (Deprecated)
├── nodes/
│   └── Bexio/
│       ├── Bexio.node.ts                # Main node implementation
│       ├── GenericFunctions.ts          # API request helpers
│       ├── OperationsHandlers.ts        # Resource operation handlers
│       ├── bexio.svg                    # Node icon
│       └── descriptions/
│           ├── ContactDescription.ts     # Contact resource fields
│           ├── InvoiceDescription.ts     # Invoice resource fields
│           ├── ItemDescription.ts        # Item resource fields
│           ├── QuoteDescription.ts       # Quote resource fields
│           ├── OrderDescription.ts       # Order resource fields
│           └── BankingDescription.ts     # Banking resource fields
├── testing/                             # Test scripts (not in npm package)
│   ├── simple-test.ts                   # Basic API connectivity test
│   ├── create-test-data.ts              # Create comprehensive test data
│   ├── cleanup-test-data.ts             # Clean up test data
│   ├── api-field-explorer.ts            # Explore API field structures
│   └── endpoint-tester.ts               # Test all API endpoints
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

### 1.0.0 (Current) - @zurdai/n8n-nodes-bexio
- **New Scoped Package**: Republished as `@zurdai/n8n-nodes-bexio` under zurdai organization
- All features from the previous package (v1.0.16) included
- Comprehensive PDF binary download support for Invoice, Quote, and Order
- 6 essential business resources: Banking, Contact, Invoice, Item, Order, Quote
- Personal Access Token (PAT) authentication
- All API endpoints verified and tested

### Previous Package (n8n-nodes-bexio) - Deprecated

The package was previously published as `n8n-nodes-bexio` (versions 1.0.0 - 1.0.16, now deprecated).
All functionality has been migrated to the scoped package `@zurdai/n8n-nodes-bexio`.

For complete version history of the previous package, see [CHANGELOG.md](CHANGELOG.md).
