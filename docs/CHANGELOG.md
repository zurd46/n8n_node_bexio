# Changelog

All notable changes to the @zurdai/n8n-nodes-bexio project will be documented in this file.

## [1.0.7] - 2025-11-12

### Fixed
- **BREAKING**: Corrected API endpoints to match Bexio API documentation
  - Changed `/2.0/item` → `/2.0/article` (Items are called Articles in Bexio)
  - Changed `/2.0/employee` → `/2.0/payroll_employee`
  - Changed `/2.0/activity` → `/2.0/business_activity`
  - Changed `/2.0/manual_entry` → `/2.0/journal`
  - Fixed payroll absence endpoint to `/2.0/payroll_absence`

### Note
- These endpoint corrections may affect existing workflows using Item, Payroll, or Accounting resources
- Update your workflows accordingly

## [1.0.6] - 2025-11-12 (unpublished)

### Fixed
- **BREAKING**: Corrected API endpoints to match Bexio API documentation
  - Changed `/2.0/item` → `/2.0/article` (Items are called Articles in Bexio)
  - Changed `/2.0/employee` → `/2.0/payroll_employee`
  - Changed `/2.0/activity` → `/2.0/business_activity`
  - Changed `/2.0/manual_entry` → `/2.0/journal`
  - Fixed payroll absence endpoint to `/2.0/payroll_absence`

### Note
- These endpoint corrections may affect existing workflows using Item, Payroll, or Accounting resources
- Update your workflows accordingly

## [1.0.4] - 2025-11-12

### Changed
- **BREAKING**: Switched from OAuth2 to Personal Access Token (PAT) authentication
  - Removed `BexioOAuth2Api.credentials.ts`
  - Added `BexioApi.credentials.ts` with simple token-based auth
  - Updated `GenericFunctions.ts` to use PAT authentication
  - Updated `Bexio.node.ts` to require `bexioApi` credentials

### Added
- `PERSONAL_ACCESS_TOKEN_SETUP.md` - Comprehensive guide for PAT setup
- `TROUBLESHOOTING.md` - OAuth troubleshooting guide (kept for reference)

### Updated
- `README.md` - Updated authentication section with PAT instructions
- `package.json` - Version bumped to 1.0.4
- Documentation simplified for easier onboarding

### Why This Change?
The OAuth2 implementation was causing persistent "Invalid token" errors due to:
1. Scope configuration complexity in Bexio Developer Portal
2. Unclear scope naming conventions
3. Difficulty finding scope settings in the portal UI

Personal Access Tokens provide:
- Simpler setup process
- More reliable authentication
- Direct permission management in Bexio Portal
- No scope configuration issues

## [1.0.3] - 2025-11-11

### Fixed
- TypeScript compilation errors with zod types
- Array parameter handling in API requests

### Updated
- TypeScript from 4.9.4 to 5.6.0
- @typescript-eslint/parser to 7.18.0
- n8n-workflow to 1.52.0
- Other dev dependencies to latest compatible versions

### Changed
- `GenericFunctions.bexioApiRequest()` now accepts arrays in body parameter
- Improved error handling with NodeApiError

## [1.0.0] - 2025-11-10

### Added
- Initial release of @zurdai/n8n-nodes-bexio
- Support for 14 major Bexio API resources:
  - Contact (CRUD, Search)
  - Invoice (CRUD, Search, PDF, Issue, Send)
  - Project (CRUD, Search, Archive/Unarchive)
  - Item (CRUD, Search)
  - Timesheet (CRUD, Search)
  - Quote (CRUD, Search, PDF, Issue)
  - Order (CRUD, Search, PDF)
  - Bill (CRUD)
  - Expense (CRUD)
  - Task (CRUD, Search)
  - File (CRUD, Download, Search)
  - Banking (Get accounts, payments, create payment)
  - Accounting (Get accounts, currencies, taxes, VAT periods, manual entries)
  - Payroll (Get employees, create absence)

### Features
- OAuth2 authentication (later replaced with PAT in v1.0.4)
- Comprehensive CRUD operations
- Search and filtering capabilities
- Pagination support with "Get Many" operations
- PDF generation for invoices, quotes, and orders
- File upload and download
- Proper error handling and validation

### Documentation
- README.md with full API documentation
- Setup guides for OAuth (deprecated)
- Development instructions
- Project structure documentation

---

## Migration Guide: v1.0.3 → v1.0.4

If you were using v1.0.3 with OAuth2:

### Step 1: Create Personal Access Token
1. Go to https://developer.bexio.com/
2. Create a new Personal Access Token
3. Select all required permissions
4. Copy the token (shown only once!)

### Step 2: Update n8n Credentials
1. In n8n, delete old "Bexio OAuth2 API" credentials
2. Create new "Bexio API" credentials
3. Paste your Personal Access Token
4. Save and test

### Step 3: Update Workflows
Your workflows will automatically use the new credentials once you select them. No changes needed to workflow nodes themselves.

### Step 4: Cleanup (Optional)
1. Delete OAuth app from Bexio Developer Portal if no longer needed
2. Remove any OAuth-related documentation from your projects

---

## Upgrade Instructions

### From npm (Production)
```bash
npm install @zurdai/n8n-nodes-bexio@latest
```

### From source (Development)
```bash
cd @zurdai/n8n-nodes-bexio
git pull
npm install
npm run build
```

### In n8n
1. Go to Settings > Community Nodes
2. Find "@zurdai/n8n-nodes-bexio"
3. Click "Update" if available
4. Restart n8n

---

## Support

For issues, questions, or feature requests:
- GitHub Issues: https://github.com/zurd46/n8n_node_bexio/issues
- Bexio API Docs: https://docs.bexio.com/
- n8n Community: https://community.n8n.io/

## License

MIT License - See LICENSE file for details
