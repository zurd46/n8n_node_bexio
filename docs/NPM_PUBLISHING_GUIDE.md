# 🚀 Quick Start Guide: Publishing @zurdai/n8n-nodes-bexio to npm

## ✅ Pre-Flight Check (Already Done!)

- [x] Project built successfully
- [x] All TypeScript files compiled
- [x] Icon files copied to dist/
- [x] Dry-run completed successfully
- [x] Package size: ~100KB

## 📦 What Will Be Published

The following files will be included in the npm package:
```
- LICENSE.md
- README.md
- dist/credentials/
- dist/nodes/Bexio/
  - Bexio.node.js + .d.ts
  - bexio.svg
  - descriptions/ (all 14 resource descriptions)
  - GenericFunctions.js + .d.ts
  - OperationsHandlers.js + .d.ts
```

## 🔑 Step 1: Login to npm

If you're not already logged in:

```bash
npm login
```

Enter your credentials:
- Username: (your npm username)
- Password: (your npm password)
- Email: dzurmuehle@gmail.com
- OTP: (if you have 2FA enabled)

## 🚀 Step 2: Publish to npm

### First Time Publishing

```bash
cd c:\GitHub\n8n_bexio
npm publish
```

### If You Have 2FA Enabled

```bash
npm publish --otp=123456
```
(Replace `123456` with your current 2FA code)

## ✅ Step 3: Verify Publication

After publishing, verify the package:

```bash
npm view @zurdai/n8n-nodes-bexio
```

Or visit: https://www.npmjs.com/package/@zurdai/n8n-nodes-bexio

## 🎯 Step 4: Test Installation in n8n

### Via npm
```bash
npm install @zurdai/n8n-nodes-bexio
```

### Via n8n UI
1. Open n8n
2. Go to **Settings > Community Nodes**
3. Click **Install**
4. Enter: `@zurdai/n8n-nodes-bexio`
5. Click **Install**

## 🔄 Future Updates

When you need to publish an update:

```bash
# 1. Make your changes

# 2. Update version (choose one):
npm version patch   # 1.0.0 -> 1.0.1 (bug fixes)
npm version minor   # 1.0.0 -> 1.1.0 (new features)
npm version major   # 1.0.0 -> 2.0.0 (breaking changes)

# 3. Build and publish
npm run build
npm publish

# 4. Push to GitHub with tags
git push origin main --tags
```

## 📊 Package Information

- **Name**: @zurdai/n8n-nodes-bexio
- **Version**: 1.0.0
- **Keywords**: n8n-community-node-package, n8n, bexio, accounting, crm
- **License**: MIT
- **Homepage**: https://github.com/zurd46/n8n_node_bexio

## 🎉 What's Included

### Resources (14 total):
1. **Contact** - CRM contacts
2. **Invoice** - Sales invoices
3. **Project** - Project management
4. **Item** - Products/Services
5. **Timesheet** - Time tracking
6. **Quote** - Sales quotes
7. **Order** - Customer orders
8. **Bill** - Supplier bills
9. **Expense** - Expense tracking
10. **Task** - Task management
11. **File** - Document management
12. **Banking** - Bank accounts & payments
13. **Accounting** - Chart of accounts, taxes, VAT
14. **Payroll** - Employee management

### Operations per Resource:
- Create, Read, Update, Delete (CRUD)
- Search with flexible criteria
- List with pagination
- Special operations (Issue, Send, Archive, etc.)

## 🔧 Troubleshooting

### Error: You must be logged in
```bash
npm login
```

### Error: Package name already exists
The package name `@zurdai/n8n-nodes-bexio` is available. If you get this error, someone else published it first. Choose a different name.

### Error: Version already published
You're trying to publish a version that already exists. Update the version:
```bash
npm version patch
npm publish
```

### Build fails
```bash
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

## 📝 Post-Publication Checklist

After successful publication:

- [ ] Verify package on npm: https://www.npmjs.com/package/@zurdai/n8n-nodes-bexio
- [ ] Test installation in n8n
- [ ] Update GitHub README with npm badge
- [ ] Create GitHub release
- [ ] Share on n8n community forum
- [ ] Tweet about it (optional)

## 🎖️ npm Badges for README

Add these to your GitHub README:

```markdown
![npm](https://img.shields.io/npm/v/@zurdai/n8n-nodes-bexio)
![npm downloads](https://img.shields.io/npm/dm/@zurdai/n8n-nodes-bexio)
![license](https://img.shields.io/npm/l/@zurdai/n8n-nodes-bexio)
```

## 📞 Support

If you encounter any issues during publishing:

1. Check the [npm documentation](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
2. Review the [n8n community node guidelines](https://docs.n8n.io/integrations/community-nodes/)
3. Open an issue on GitHub

## 🎊 Success!

Once published, your node will be available to the entire n8n community!

Users can install it with:
```bash
npm install @zurdai/n8n-nodes-bexio
```

Or via the n8n UI under **Settings > Community Nodes**.

---

**Good luck with your publication! 🚀**
