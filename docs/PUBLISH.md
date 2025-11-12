# Publishing n8n-nodes-bexio to npm

## Prerequisites

1. **npm Account**: You need an npm account. Create one at [npmjs.com](https://www.npmjs.com/signup)
2. **npm CLI**: Make sure npm is installed and updated
3. **Git Repository**: Your code should be pushed to GitHub

## Pre-Publication Checklist

### 1. Verify Package Name Availability

Check if the package name is available:
```bash
npm search n8n-nodes-bexio
```

If the name is taken, update the `name` field in `package.json`.

### 2. Install Dependencies

```bash
cd c:\GitHub\n8n_bexio
npm install
```

### 3. Build the Project

```bash
npm run build
```

This will:
- Compile TypeScript files to JavaScript in the `dist/` folder
- Copy icon files to `dist/`

### 4. Test the Build

Verify that the `dist/` folder contains:
- `dist/credentials/BexioOAuth2Api.credentials.js`
- `dist/nodes/Bexio/Bexio.node.js`
- `dist/nodes/Bexio/bexio.svg`
- All description files

### 5. Login to npm

```bash
npm login
```

Enter your:
- Username
- Password
- Email
- Two-factor authentication code (if enabled)

## Publishing Steps

### Option 1: First Time Publishing

```bash
npm publish
```

### Option 2: Publishing with OTP (if 2FA is enabled)

```bash
npm publish --otp=123456
```

Replace `123456` with your current 2FA code.

### Option 3: Dry Run (Test without actually publishing)

```bash
npm publish --dry-run
```

This shows what files would be published without actually publishing.

## Version Management

### Update Version Before Publishing

Follow semantic versioning (semver):

**Patch Release** (bug fixes): 1.0.0 → 1.0.1
```bash
npm version patch
```

**Minor Release** (new features, backward compatible): 1.0.0 → 1.1.0
```bash
npm version minor
```

**Major Release** (breaking changes): 1.0.0 → 2.0.0
```bash
npm version major
```

These commands will:
1. Update `package.json` version
2. Create a git commit
3. Create a git tag

Then push to GitHub:
```bash
git push origin main --tags
```

Then publish:
```bash
npm publish
```

## Post-Publication Steps

### 1. Verify Publication

Check your package on npm:
```bash
npm view n8n-nodes-bexio
```

Or visit: https://www.npmjs.com/package/n8n-nodes-bexio

### 2. Test Installation

In a test n8n instance:
```bash
npm install n8n-nodes-bexio
```

Or install via n8n UI:
1. Go to **Settings > Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-bexio`
4. Click **Install**

### 3. Update README

Update the README.md with:
- npm badge: `![npm](https://img.shields.io/npm/v/n8n-nodes-bexio)`
- Installation instructions
- Link to npm package page

## Troubleshooting

### Error: Package name too similar to existing packages

If you get this error, you need to:
1. Choose a different name
2. Or request access to the namespace

### Error: You must be logged in to publish packages

Run:
```bash
npm login
```

### Error: You do not have permission to publish

This means the package name is already taken by someone else. Choose a different name.

### Files not included in package

Check `.npmignore` and the `files` field in `package.json`. The `files` field should include:
```json
"files": [
  "dist"
]
```

## Complete Publishing Command Sequence

Here's the complete sequence for first-time publishing:

```bash
# Navigate to project
cd c:\GitHub\n8n_bexio

# Install dependencies
npm install

# Build the project
npm run build

# Login to npm (if not already logged in)
npm login

# Dry run to check what will be published
npm publish --dry-run

# Publish to npm
npm publish

# Push to GitHub with tags
git push origin main --tags
```

## Updating After First Publish

```bash
# Make your changes
# ...

# Build
npm run build

# Update version (patch/minor/major)
npm version patch

# Publish
npm publish

# Push to GitHub
git push origin main --tags
```

## npm Package Settings

### Access Level

This package is public by default. If you want to make it private:
```bash
npm publish --access restricted
```

### Package Scope

If you want to publish under your username scope:
```bash
# Update package.json name to: "@zurd46/n8n-nodes-bexio"
npm publish --access public
```

## Support and Maintenance

After publishing:
1. Monitor issues on GitHub
2. Respond to user questions
3. Release updates regularly
4. Keep dependencies up to date
5. Follow n8n community node guidelines

## Useful npm Commands

```bash
# Check package details
npm view n8n-nodes-bexio

# Check package versions
npm view n8n-nodes-bexio versions

# Unpublish a version (only within 72 hours)
npm unpublish n8n-nodes-bexio@1.0.0

# Deprecate a version
npm deprecate n8n-nodes-bexio@1.0.0 "Please upgrade to 1.0.1"

# Check who owns the package
npm owner ls n8n-nodes-bexio

# Add a maintainer
npm owner add <username> n8n-nodes-bexio
```

## Links

- npm Package: https://www.npmjs.com/package/n8n-nodes-bexio
- GitHub Repository: https://github.com/zurd46/n8n-nodes-bexio
- n8n Community Nodes Documentation: https://docs.n8n.io/integrations/community-nodes/
