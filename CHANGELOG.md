# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## @zurdai/n8n-nodes-bexio

### [1.0.4] - 2025-01-14

#### Changed
- **Documentation Cleanup**: Updated all markdown documentation to match actual implementation
  - Updated PERSONAL_ACCESS_TOKEN_SETUP.md with correct automation examples
  - Updated TROUBLESHOOTING.md with correct OAuth scopes for all supported resources
  - Removed references to deprecated resources (Project, Timesheet, Task, etc.)
  - Consolidated CHANGELOG entries for better readability
- **Code Quality**: Improved documentation accuracy - all MD files now 100% synchronized with code

### [1.0.3] - 2025-01-12

#### Added
- **Invoice Filters**: Added status filters for "Get Many" operation
  - Filter by status: Draft, Pending, Paid, Partially Paid, Overdue, Cancelled
  - Quick filter "Overdue Only" for retrieving only overdue invoices
  - Quick filter "Unpaid Only" for retrieving only unpaid invoices
  - Makes it easy to get specific invoice subsets without using Search operation

### [1.0.2] - 2025-01-12

#### Fixed
- **PDF Download**: Fixed Bexio PDF API response format handling
  - PDFs are returned as JSON objects with base64 encoded content
  - Changed Accept header from 'application/pdf' to 'application/json'
  - Added base64 decoding for 'content' field in response
  - PDFs now download correctly with proper content

### [1.0.1] - 2025-01-12

#### Changed
- Updated all package references from `n8n-nodes-bexio` to `@zurdai/n8n-nodes-bexio`
- Updated documentation to reflect scoped package name

### [1.0.0] - 2025-01-12

#### Changed
- **Package Name**: Republished as scoped package `@zurdai/n8n-nodes-bexio`
- Moved from `n8n-nodes-bexio` to `@zurdai/n8n-nodes-bexio`
- All features from previous package version 1.0.16 included

#### Features
- PDF binary download support for Invoice, Quote, and Order
- 6 essential business resources: Banking, Contact, Invoice, Item, Order, Quote
- Personal Access Token (PAT) authentication
- Comprehensive response handling for all API response formats
- All endpoints verified against Bexio API v2.0 and v3.0

---

## n8n-nodes-bexio (Previous Package - Deprecated)

### [1.0.16] - 2025-01-12

### Fixed
- **PDF Binary Download**: Comprehensive response handling for all possible response formats
- Added support for axios-style responses (data property) and http-style responses (body property)
- Added detailed error message showing response type when unexpected format is received
- Now handles Buffer, ArrayBuffer, Uint8Array, and string responses correctly

## [1.0.15] - 2025-01-12

### Fixed
- **PDF Binary Download Error**: Fixed "Received an instance of Object" error
- Corrected response handling with `returnFullResponse: true` to properly extract PDF body
- PDFs now download correctly without type errors

## [1.0.14] - 2025-01-12

### Fixed
- **PDF Download Issue**: Fixed empty PDF problem by correcting binary data encoding
- Improved Buffer handling to properly receive PDF content from Bexio API
- PDFs now contain the correct invoice/quote/order data instead of being empty

## [1.0.13] - 2025-01-12

### Added
- **PDF Download as Binary**: Invoice, Quote, and Order "Get PDF" operations now return the PDF file directly as binary data
- Added `bexioApiRequestBinary` function for handling binary downloads
- PDF files are now available in the node's binary data output with proper filename and metadata

### Changed
- "Get PDF" operations now return both JSON metadata (fileName, mimeType, fileSize) and binary data
- PDF files are automatically named: `invoice_{id}.pdf`, `quote_{id}.pdf`, `order_{id}.pdf`

## [1.0.12] - 2025-01-12

### Fixed
- Corrected GitHub repository URL in all documentation files
- Changed from `n8n-nodes-bexio` to `n8n_node_bexio` to match actual repository name

## [1.0.11] - 2025-01-12

### Changed
- Minor version update to ensure package consistency

## [1.0.10] - 2025-01-12

### Changed
- Updated README.md documentation to reflect simplified resource selection
- Updated available permissions section to show only supported resources
- Updated operations documentation to show only Banking, Contact, Invoice, Item, Order, Quote
- Updated usage examples to reflect current functionality
- Updated project structure documentation to include testing directory
- Updated compatibility notes

## [1.0.9] - 2025-01-12

### Breaking Changes
- **Simplified Resource Selection**: Node now only shows 6 essential business resources
  - Removed: Project, Timesheet, Bill, Expense, Task, File, Accounting, Payroll
  - Kept: Banking, Contact, Invoice, Item, Order, Quote
  - This focuses the node on core business operations: Customers, Products, Sales, and Banking

### Fixed
- **All API Endpoint Corrections**: Fixed 404 errors by updating to correct Bexio API v3.0 endpoints
  - Invoice: `/2.0/invoice` → `/2.0/kb_invoice`
  - Quote: `/2.0/quote` → `/2.0/kb_offer`
  - Order: `/2.0/order` → `/2.0/kb_order`
  - Banking Accounts: `/2.0/bank_account` → `/3.0/banking/accounts`
  - Banking Payments: `/4.0/payment` → `/3.0/banking/payments`
  - Banking Transactions: `/2.0/banking_transaction` → `/3.0/banking/accounts/{id}/transactions`

### Changed
- Removed unused resource handlers and imports to reduce bundle size
- Simplified node interface for better user experience
- Updated all endpoint paths to match Bexio API documentation

## [1.0.8] / [1.0.7] / [1.0.6] - 2025-01-12

### Changed
- Updated author email and package metadata
- Updated dependencies
- Minor documentation improvements

## [1.0.5] - 2025-01-11

### Breaking Changes
- **Authentication Method Changed**: Switched from OAuth2 to Personal Access Token (PAT)
  - OAuth2 credentials are no longer supported
  - All users must migrate to PAT authentication

### Added
- Personal Access Token (PAT) authentication support
- `PERSONAL_ACCESS_TOKEN_SETUP.md` - Detailed PAT setup guide

### Changed
- Updated README.md with new PAT authentication instructions
- Simplified setup process

### Migration Guide
If you're upgrading from version 1.0.4 or earlier:

1. **Get a Personal Access Token**:
   - Log in to Bexio at https://office.bexio.com
   - Go to Settings → User → API Access
   - Create a new Personal Access Token
   - Select the required scopes
   - Copy the token (shown only once!)

2. **Update Your n8n Credentials**:
   - Open your n8n instance
   - Go to Credentials → Bexio API
   - Remove old OAuth2 credentials
   - Add new credentials using PAT
   - Paste your token

3. **Update Your Workflows**:
   - All existing workflows will need new credentials
   - Replace credential references in all Bexio nodes

## [1.0.4] - Earlier

### Added
- Initial OAuth2 implementation
- Basic CRUD operations for Bexio resources
- Support for Contacts, Invoices, Quotes, Orders, Items, and Banking

---

## Version Comparison

### Authentication Evolution

| Version | Auth Method | Status |
|---------|-------------|--------|
| 1.0.4 and earlier | OAuth2 | ❌ Deprecated |
| 1.0.5+ | Personal Access Token (PAT) | ✅ Current |

### Why the Change?

The switch to Personal Access Token (PAT) provides:
- Simpler setup process (no OAuth2 app registration needed)
- More reliable authentication
- Better developer experience
- Aligned with Bexio's recommended authentication method

## Support

For issues, questions, or contributions:
- GitHub: https://github.com/zurd46/n8n_node_bexio
- Issues: https://github.com/zurd46/n8n_node_bexio/issues

## License

MIT License - see LICENSE file for details
