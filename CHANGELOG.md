# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## @zurdai/n8n-nodes-bexio

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

## [1.0.8] - 2025-01-12

### Added
- Comprehensive testing suite in `testing/` directory
  - `simple-test.ts` - Basic API connectivity test
  - `api-field-explorer.ts` - Explore API field structures
  - `endpoint-tester.ts` - Test all API endpoints
  - `create-test-data.ts` - Create comprehensive test data
  - `cleanup-test-data.ts` - Clean up test data
- Complete testing documentation
  - `testing/GETTING-STARTED.md` - Quick start guide
  - `testing/README.md` - Comprehensive documentation
  - `testing/INDEX.md` - File overview and workflows
  - `testing/ENDPOINT_FINDINGS.md` - API research notes
- Added `tsx` as dev dependency for TypeScript script execution

### Changed
- Updated `.gitignore` to exclude `testing/` directory (contains API tokens)
- Updated `.npmignore` to exclude testing files from npm package

### Fixed
- Corrected timesheet creation format (tracking as object, not array)
- Added required fields for timesheet: `client_service_id`, `allowable_bill`

## [1.0.7] - 2025-01-12

### Changed
- Updated author email in package.json
- Refined permissions in settings.local.json
- Updated dependencies

## [1.0.6] - 2025-01-11

### Added
- Version history documentation
- Note about npm version conflicts

### Changed
- Expanded permissions in settings

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
- Support for Contacts, Articles, Tasks, Projects, etc.

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

## Testing

Version 1.0.8 introduces a comprehensive testing suite that allows developers to:
- Verify API connectivity
- Explore Bexio API field structures
- Create realistic test data
- Test all CRUD operations
- Clean up test data automatically

See `testing/GETTING-STARTED.md` for details.

## Support

For issues, questions, or contributions:
- GitHub: https://github.com/zurd46/n8n_node_bexio
- Issues: https://github.com/zurd46/n8n_node_bexio/issues

## License

MIT License - see LICENSE file for details
