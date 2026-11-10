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

The Bexio and Bexio Trigger nodes support two authentication methods. Pick one in the node's
**Authentication** field:

| Authentication | Credential | Best for |
|---|---|---|
| **Access Token** (default) | Bexio API | One Bexio company, quick setup with a Personal Access Token |
| **OAuth2** | Bexio OAuth2 API | Apps registered in the Bexio Developer Portal, several users or companies |

### Access Token (Personal Access Token)

1. Go to the [Bexio Developer Portal](https://developer.bexio.com/)
2. Create a **Personal Access Token (PAT)**
3. Copy the token (it will only be shown once!)
4. In n8n, create a **Bexio API** credential
5. Paste your Personal Access Token

📖 **Detailed Setup Guide**: See [PERSONAL_ACCESS_TOKEN_SETUP.md](PERSONAL_ACCESS_TOKEN_SETUP.md)

### OAuth2

1. In the [Bexio Developer Portal](https://developer.bexio.com/), create an app and copy its
   **Client ID** and **Client Secret**
2. Add the **OAuth Redirect URL** shown in the n8n credential dialog as a redirect URL of the app
3. In n8n, create a **Bexio OAuth2 API** credential, paste Client ID and Client Secret
4. Adjust **Scope** to the resources you use (keep `offline_access` so n8n can refresh the token),
   e.g. `openid profile email company_profile offline_access contact_show contact_edit kb_invoice_show kb_invoice_edit`
5. Select **Connect my account** and log in to Bexio

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

### Contact Relation
- **Create**: Link a person to a company
- **Delete**, **Get**, **Get Many**, **Search**, **Update**

### Additional Address
- **Create**: Add an address to a contact, for example a delivery address
- **Delete**, **Get**, **Get Many**, **Search**, **Update**

### Invoice
- **Create**: Create a new invoice
- **Delete**: Delete an invoice
- **Get**: Retrieve a single invoice
- **Get Many**: Retrieve multiple invoices with advanced filtering
  - Filter by status: Draft, Pending, Paid, Partial, Canceled, Unpaid
  - Quick filters: Overdue Only, Unpaid Only
  - Supports pagination or "Return All" option
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

## Trigger (Bexio Trigger node)

Bexio does not offer natively documented webhooks for status/cancellation
events, so the **Bexio Trigger** node works by **polling** the API on a schedule
(the poll interval is configured on the node) and starting your workflow when
records appear or change. Already-seen records are never emitted twice — state
is kept in the workflow's static data.

**Resources**: Contact, Invoice, Order, Quote, Item

**Events**:
- **Created** — emits only newly created records (detected via increasing record ID).
- **Created or Updated** — emits new *and* changed records (detected via
  `updated_at`). This is the option to use for **invoice/order status changes and
  cancellations**. For **Item** it automatically falls back to created-only, since
  the `article` resource has no `updated_at` field.

**Behaviour notes**:
- On first activation the node stores a watermark and emits **nothing** (no
  historical replay). In manual/test mode ("Fetch Test Event") it returns the most
  recent record so you can wire up the workflow.
- Uses the same **Bexio API (Personal Access Token)** credentials as the action node.

## Usage Examples

### Example 1: Create a Contact
1. Add a Bexio node to your workflow
2. Select **Contact** as the resource
3. Select **Create** as the operation
4. Choose **Contact Type** (Company or Person)
5. Enter **Name 1**: the company name, or the last name of a person
6. Add further details: Name 2 (first name of a person), street, email, etc.

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

### Example 4: Get All Overdue Invoices
1. Add a Bexio node to your workflow
2. Select **Invoice** as the resource
3. Select **Get Many** as the operation
4. Enable **Return All** to get all invoices
5. Under **Options**, enable **Overdue Only** filter
6. This will return all invoices with overdue status

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

- **Email**: info@impulsai.ch
- **Phone**: +41 79 786 06 46

## Development

### Setup

```bash
# Install dependencies
npm install

# Build the node
npm run build

# Run linter (n8n-node lint, same rules as the n8n Cloud verification)
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Start n8n locally with the node loaded
npm run dev
```

### Releasing

Releases are published to npm by GitHub Actions (`.github/workflows/publish.yml`) with an npm
provenance statement, as required for verified community nodes. Run `npm run release` on `main`
to bump the version, tag and push; the workflow then publishes the package.

### Project Structure

```
@zurdai/n8n-nodes-bexio/
├── credentials/
│   ├── BexioApi.credentials.ts          # Personal Access Token
│   └── BexioOAuth2Api.credentials.ts    # OAuth2
├── nodes/
│   └── Bexio/
│       ├── Bexio.node.ts                # Main node implementation
│       ├── GenericFunctions.ts          # API request helpers
│       ├── OperationsHandlers.ts        # Resource operation handlers
│       └── descriptions/
│           ├── ContactDescription.ts     # Contact resource fields
│           ├── InvoiceDescription.ts     # Invoice resource fields
│           ├── ItemDescription.ts        # Item resource fields
│           ├── QuoteDescription.ts       # Quote resource fields
│           ├── OrderDescription.ts       # Order resource fields
│           └── BankingDescription.ts     # Banking resource fields
├── icons/                               # Node and credential icons (light/dark)
├── test/                                # Unit and API documentation conformance tests
├── package.json
├── tsconfig.json
├── eslint.config.mjs
└── README.md
```

## License

[MIT](LICENSE.md)

## Author

Daniel Zurmühle (dzurmuehle@gmail.com) impulsai.ch

## Version History

### Unreleased
- OAuth2 authentication next to the Personal Access Token
- Built, linted and published with the n8n-node CLI (n8n Cloud verification requirements)
- No runtime dependencies; "Limit" fields default to 50 results

### 1.3.0 - @zurdai/n8n-nodes-bexio
- Full comparison with the Bexio API documentation, see [CHANGELOG.md](CHANGELOG.md)
- **Contact Type labels were swapped and are now correct: check saved contact workflows**
- Dropdowns, Banking, invoice status and send, quote and order update and search corrected
- New resources: Contact Relation, Additional Address

### 1.2.2 - @zurdai/n8n-nodes-bexio
- Updated author website URL to impulsai.ch

### 1.2.1 - @zurdai/n8n-nodes-bexio
- Updated author/contact email

### 1.2.0 - @zurdai/n8n-nodes-bexio
- **New: Bexio Trigger node** (polling) for Contact, Invoice, Order, Quote, and Item
  - Events: *Created* (via record ID) and *Created or Updated* (via `updated_at`,
    catches invoice/order status changes and cancellations)
  - No historical replay on activation; de-duplicated via workflow static data
  - Reuses the existing Personal Access Token credentials
- Shared request layer (`bexioApiRequest`) now also supports the polling context

### 1.1.0 - @zurdai/n8n-nodes-bexio
- **Node Improvements**: Added required fields (`user_id`, `owner_id`) for Contact, Invoice, Quote, and Order resources
- **Comprehensive Test Suite**: Created full test coverage for all 87 operations across 14 resources
  - 85.88% success rate (73/85 tests passing)
  - Automated test runner with JSON and HTML reports
  - Dynamic test data fetching to adapt to any Bexio account
- **API Integration Fixes**: Improved error handling and field validation
- **Developer Experience**: Better error messages and complete test documentation

### 1.0.5 - @zurdai/n8n-nodes-bexio
- **Security Fixes**: Fixed all dependency vulnerabilities (npm audit: 0 vulnerabilities)
- Added JSON parsing error handling
- Added DoS protection with pagination limits
- Implemented missing `getLanguages` LoadOptions method

### 1.0.0 - @zurdai/n8n-nodes-bexio
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
