# Changelog

All notable changes to the @zurdai/n8n-nodes-bexio project will be documented in this file.

### [1.3.0] - 2026-11-04

Full comparison with the Bexio API documentation (https://docs.bexio.com/). Not yet
run against a live Bexio account.

#### Important: check saved contact workflows
- **Contact Type labels were swapped.** Bexio defines `1` = company, `2` = person; the
  node showed the opposite. Saved workflows keep sending the same value, so their
  behaviour does not change, but the label now shows what was really created. A
  workflow set to "Company" that actually created persons now shows "Person".
  Change it if you wanted companies.

#### Fixed
- User, tax, currency and project dropdowns called undocumented paths. They now use
  `/3.0/users`, `/3.0/taxes`, `/3.0/currencies` and `/2.0/pr_project`. Accounts use
  `/2.0/accounts`.
- Contact: `name_1` is the company or last name and `name_2` the addition or first name.
  `name_1` has its own field and is checked before the request.
- Contact: `street_name`, `house_number` and `address_addition` replace `address`.
  A saved `address` is sent as `street_name`.
- Contact update now sends the fields the API requires, reading unchanged values from
  the contact first.
- Banking used paths that are not documented. It now uses `/3.0/banking/accounts` and
  `/4.0/banking/payments`. **Create Payment has new required fields.**
- Invoice status values now match the API (7, 8, 9, 16, 19, 31). Status, unpaid and
  overdue filters use the search endpoint, because the list endpoint has no status
  filter. Saved values 1, 5, 10 and 18 are translated.
- Invoice send now sends `recipient_email`, `subject` and `message`. The message must
  contain `[Network Link]`. **Subject and Message are now required fields.**
- Invoice: `contact_address_manual` and `pr_project_id` replace `contact_address` and
  `project_id`. Saved values are translated.
- Quote and order: create and update now send their fields, and search uses its
  criteria. Before, update sent an empty body and search returned everything.
- Item: `article_type_id` replaces `article_type`, `user_name` is removed, prices are
  sent as text. Search supports `intern_name` and `intern_code`.
- Bexio Trigger for items no longer uses `updated_at` or a search by `id`, which the API
  does not support.

#### Added
- **Contact Relation** resource to link a company and a person.
- **Additional Address** resource for further addresses of a contact.
- All search fields and criteria listed in the API documentation.
- More contact, item, quote and order fields.
- `npm test`: checks every operation against the live documentation.

#### Removed
- Contact `is_lead` from the UI (deprecated in the API) and Invoice update `positions`
  from the UI (not part of the update endpoint).

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
