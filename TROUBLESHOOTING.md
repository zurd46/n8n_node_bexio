# 🔍 Bexio OAuth Troubleshooting Guide

## Current Issue: 401 Invalid Token Error

### Problem Description
OAuth connection succeeds and access token is obtained, but API calls return:
```json
{ "error_code": 401, "message": "Invalid token." }
```

### Root Cause Analysis

The issue is that **Bexio requires scopes to be pre-authorized** in your OAuth application configuration in the Developer Portal. The scopes cannot be requested dynamically - they must be configured first.

## 🎯 Solution Steps

### Step 1: Find Scope Configuration in Bexio Developer Portal

The scope configuration may be located in different places depending on your Bexio Developer Portal interface:

1. **Go to**: https://developer.bexio.com/
2. **Find your OAuth App**
3. **Look for one of these sections**:
   - "Berechtigungen" (Permissions)
   - "Scopes"
   - "API Zugriff" (API Access)
   - "Ressourcen" (Resources)
   - "OAuth Scopes"
   - "API Permissions"

### Step 2: Enable Required Scopes in Bexio

You MUST enable/activate each scope you want to use. Start with minimal scopes:

**Minimal Setup (Testing)**:
- [x] `contact_show` - Read contacts

**Recommended Scopes (Production)**:
- [x] `contact_show` - View contacts
- [x] `contact_edit` - Create/Update contacts
- [x] `invoice_show` - View invoices
- [x] `invoice_edit` - Create/Update invoices
- [x] `project_show` - View projects
- [x] `project_edit` - Create/Update projects

### Step 3: Alternative Scope Names

Bexio may use different scope naming conventions. Try looking for these alternatives:

**Instead of `contact_show`, look for:**
- `kb_contact_show`
- `contact:read`
- `read:contact`
- `api.contact.read`

**Instead of `invoice_show`, look for:**
- `kb_invoice_show`
- `invoice:read`
- `read:invoice`
- `api.invoice.read`

### Step 4: Contact Bexio Support

If you cannot find the scope configuration:

1. **Email**: support@bexio.com or api@bexio.com
2. **Subject**: "OAuth Scope Configuration in Developer Portal"
3. **Message Template**:

```
Hallo Bexio Team,

Ich habe eine OAuth-Anwendung im Developer Portal erstellt und versuche, die API zu nutzen.
Die OAuth-Verbindung funktioniert, aber API-Aufrufe geben "401 Invalid token" zurück.

Ich kann im Developer Portal nicht finden, wo ich die API-Scopes (z.B. contact_show,
invoice_show) aktivieren kann.

Können Sie mir bitte zeigen, wo ich die Scopes für meine Anwendung konfigurieren kann?

Meine App-ID: [Ihre Client ID]

Vielen Dank!
```

## 🔬 Debugging Information

### What Works
✅ OAuth authorization flow completes successfully
✅ Access token is obtained
✅ Token is sent correctly in Authorization header

### What Fails
❌ API calls return 401 "Invalid token"
❌ Token appears to lack necessary permissions

### Token Details
The token is sent as:
```
Authorization: Bearer [access_token]
Accept: application/json
```

To API endpoint:
```
GET https://api.bexio.com/2.0/contact
```

## 🧪 Testing Checklist

Try these steps in order:

1. **Test with Different Scope Configurations**:
   ```
   # Test 1: Empty scope
   scope: ""

   # Test 2: Single scope
   scope: "contact_show"

   # Test 3: Alternative naming
   scope: "kb_contact_show"

   # Test 4: Multiple scopes
   scope: "contact_show invoice_show"
   ```

2. **Check Token Response**:
   - Does the OAuth response include a `scope` field?
   - What scopes are actually granted in the token?

3. **Verify Redirect URL**:
   - Make sure redirect URL in Bexio matches exactly:
   ```
   http://localhost:5678/rest/oauth2-credential/callback
   ```

4. **Check Token Expiry**:
   - Access tokens expire after 1 hour
   - Make sure you're testing immediately after authorization

## 💡 Possible Solutions

### Solution 1: Scope Must Be Configured in Portal First
**Most Likely**: You need to enable scopes in the Bexio Developer Portal before they can be used. The portal should have a checkbox list of available scopes.

### Solution 2: Test API Account Permissions
Your Bexio account itself may need specific permissions. Check:
- Is your Bexio account an admin account?
- Does your subscription level support API access?
- Are there any restrictions on your test organization?

### Solution 3: Use API Key Instead (If Available)
Some Bexio API endpoints may support API Key authentication as an alternative to OAuth. Check the documentation for your specific endpoints.

### Solution 4: Request Beta/Developer Access
You may need to request explicit developer access or API access from Bexio support.

## 📞 Getting Help

If none of these solutions work, contact:

**Bexio Support**:
- Developer Portal: https://developer.bexio.com/
- Documentation: https://docs.bexio.com/
- Support: Through your Bexio account or Developer Portal

**Include in Your Request**:
1. Client ID (safe to share)
2. Error message: "401 Invalid token"
3. Scope you're trying to use: `contact_show`
4. Screenshot of Developer Portal OAuth app configuration
5. Mention you cannot find scope configuration UI

## 🔄 Next Steps After Fix

Once scopes are properly configured in Bexio:

1. Delete existing credentials in n8n
2. Create new credentials
3. Complete OAuth flow again
4. Test with `contact_show` scope
5. Gradually add more scopes as needed

---

**Status**: Awaiting scope configuration in Bexio Developer Portal
