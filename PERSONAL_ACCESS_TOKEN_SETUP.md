# 🔑 Bexio Personal Access Token (PAT) Setup

## What is a Personal Access Token?

A Personal Access Token (PAT) is a simpler alternative to OAuth2. It's a long-lived token that you can use directly without having to go through the complex OAuth flow.

## ✅ Benefits of PAT

- **Simpler**: No OAuth flow required
- **Faster**: Ready to use immediately
- **No scope issues**: Permissions are set in the Developer Portal
- **Long-lived**: Token doesn't expire after 1 hour

## 📋 Guide: Creating a PAT

### Step 1: Open Bexio Developer Portal

1. Go to: **https://developer.bexio.com/**
2. Log in with your Bexio account
3. Select your organization

### Step 2: Create Personal Access Token

In the Developer Portal, you should find an option for:
- **"Personal Access Token"**

### Step 3: Create Token

**Important**: In the Bexio Developer Portal, permissions are automatically assigned based on your Bexio account. You cannot select permissions individually like in the OAuth2 flow.

The created token automatically has access to all API endpoints available for your Bexio account.

### Step 4: Copy Token

⚠️ **IMPORTANT**: The token is only shown ONCE!

1. Copy the token immediately
2. Store it securely (e.g., in a password manager)
3. You CANNOT retrieve the token later

Example token format:
```
bxo_123abc456def789ghi012jkl34fjdj....
```

### Step 5: Use Token in n8n

#### 5.1 Open n8n

1. Open your n8n instance
2. Go to **"Credentials"**
3. Click on **"+ Add Credential"**

#### 5.2 Create Bexio API Credential

1. Search for **"Bexio API"**
2. Select **"Bexio API"** (NOT "Bexio OAuth2 API")
3. Paste your Personal Access Token
4. Click **"Save"**

#### 5.3 Test Credential

The credentials are automatically tested through an API call:
```
GET https://api.bexio.com/2.0/contact
```

If the test succeeds: ✅ Green checkmark
If the test fails: ❌ Error message

## 🧪 Perform First Test

### Test 1: Retrieve Contacts

1. Create a new workflow
2. Add a **Bexio node**
3. Select your **Bexio API** credentials
4. Configuration:
   - **Resource**: Contact
   - **Operation**: Get Many
   - **Return All**: Yes
5. Execute the workflow

**Expected Result**: List of all contacts in your Bexio account

### Test 2: Create Invoice

1. Add a **Bexio node**
2. Configuration:
   - **Resource**: Invoice
   - **Operation**: Create
   - Fill in the required fields
3. Execute the workflow

**Expected Result**: New invoice has been created

## 🔍 Troubleshooting

### Problem: "Invalid token" Error

**Cause**: Token is incorrect or invalid

**Solution**:
1. Check if you copied the complete token
2. Watch for spaces at the beginning/end
3. Create a new token in the Developer Portal
4. Update the credentials in n8n

### Problem: "Unauthorized" or 401 Error

**Cause**: Token is invalid or your Bexio account doesn't have the required permissions

**Solution**:
1. Verify that the token was copied correctly
2. Ensure your Bexio account has the required permissions
3. Create a new token in the Developer Portal
4. If the problem persists, contact Bexio Support

## 🔒 Security

### Store Token Securely

❌ **DON'T**:
- Commit to Git
- Output in logs
- Share publicly
- Store in unencrypted files

✅ **RECOMMENDED**:
- Use password manager
- Use n8n credentials manager
- Use environment variables
- Rotate regularly

### Token Rotation

Recommendation: Create a new token every 3-6 months:

1. Create new token in Developer Portal
2. Update credentials in n8n
3. Test that everything works
4. Delete the old token in Developer Portal

## 📞 Support

**Contact Bexio Support**:
- Developer Portal: https://developer.bexio.com/
- Documentation: https://docs.bexio.com/
- Support: Through your Bexio account

**What to have ready**:
1. Your Bexio Account ID
2. Error messages (screenshots)
3. Description of the problem
4. What you've already tried

## ✅ Success Checklist

After setup, you should have:

- [ ] Personal Access Token created in Bexio Developer Portal
- [ ] Token securely copied and saved
- [ ] Credentials created in n8n with the PAT
- [ ] Credential test successful (green checkmark)
- [ ] First test request works (e.g., retrieve contacts)
- [ ] All required permissions are activated

## 🎯 Next Steps

Now you can:

1. **Create workflows** with the Bexio node
2. **Build automation** for:
   - Invoice creation and management
   - Contact management (customers and suppliers)
   - Quote and order processing
   - Item/Product management
   - Banking and payment operations
3. **Integrations** with other n8n nodes:
   - Send email after invoice creation
   - CRM synchronization
   - Automated reports
   - E-commerce integration

---

**Good luck with your Bexio integration!** 🚀
