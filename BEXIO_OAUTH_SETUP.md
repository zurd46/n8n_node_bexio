# 🔐 Bexio OAuth2 Setup Guide

## Problem gelöst! ✅

Der OAuth-Fehler `"Invalid scopes: openid profile contact_show..."` wurde behoben.

### Was war das Problem?

Die ursprünglichen Scopes enthielten:
- ❌ `openid` - Nicht unterstützt von Bexio
- ❌ `kb_invoice_show` - Falscher Scope-Name (sollte `invoice_show` sein)
- ❌ `kb_invoice_edit` - Falscher Scope-Name (sollte `invoice_edit` sein)

### Die Lösung

Die Scopes wurden korrigiert auf die **offiziell unterstützten Bexio OAuth Scopes**:

```
profile email contact_show contact_edit contact_delete
invoice_show invoice_edit quote_show quote_edit
order_show order_edit article_show article_edit
project_show project_edit timesheet_show timesheet_edit
accounting_show accounting_edit payroll_show payroll_edit
company_profile
```

## 📝 Schritt-für-Schritt OAuth Setup

### 1. Bexio Developer Account & App erstellen

1. Gehen Sie zu [developer.bexio.com](https://developer.bexio.com/)
2. Melden Sie sich mit Ihrem Bexio-Account an
3. Erstellen Sie eine neue OAuth-Anwendung:
   - Klicken Sie auf **"Neue App erstellen"**
   - Geben Sie einen **App-Namen** ein (z.B. "n8n Integration")
   - Wählen Sie **"OAuth 2.0"** als Authentifizierungsmethode

### 2. Redirect URL konfigurieren

In den App-Einstellungen bei Bexio:

**Für lokale n8n-Instanz:**
```
http://localhost:5678/rest/oauth2-credential/callback
```

**Für gehostete n8n-Instanz:**
```
https://ihre-domain.com/rest/oauth2-credential/callback
```

**Für n8n Cloud:**
```
https://app.n8n.cloud/rest/oauth2-credential/callback
```

### 3. Scopes auswählen

In der Bexio-App konfigurieren Sie die benötigten Scopes. Minimal-Setup:

**Basis-Scopes (immer erforderlich):**
- ✅ `profile` - Benutzerprofil
- ✅ `email` - E-Mail-Adresse

**Empfohlene Scopes für alle Features:**
- ✅ `contact_show` + `contact_edit` - Kontakte
- ✅ `invoice_show` + `invoice_edit` - Rechnungen
- ✅ `quote_show` + `quote_edit` - Offerten
- ✅ `order_show` + `order_edit` - Bestellungen
- ✅ `article_show` + `article_edit` - Artikel/Produkte
- ✅ `project_show` + `project_edit` - Projekte
- ✅ `timesheet_show` + `timesheet_edit` - Zeiterfassung

**Optional (je nach Bedarf):**
- `accounting_show` + `accounting_edit` - Buchhaltung
- `payroll_show` + `payroll_edit` - Personal
- `company_profile` - Firmenprofil
- `contact_delete` - Kontakte löschen

### 4. Client ID & Secret kopieren

Nach der App-Erstellung erhalten Sie:
- **Client ID** (öffentlich, kann geteilt werden)
- **Client Secret** (geheim, sicher aufbewahren!)

### 5. In n8n konfigurieren

#### Option A: Über n8n UI

1. Gehen Sie zu **Credentials** in n8n
2. Klicken Sie auf **+ Add Credential**
3. Suchen Sie nach **"Bexio OAuth2 API"**
4. Füllen Sie aus:
   - **Client ID**: `[Ihre Client ID von Bexio]`
   - **Client Secret**: `[Ihr Client Secret von Bexio]`
   - **Scope**: Die Standard-Scopes sind bereits ausgefüllt. Passen Sie bei Bedarf an.
5. Klicken Sie auf **"Connect my account"**
6. Sie werden zu Bexio weitergeleitet
7. Autorisieren Sie die App
8. Sie werden zurück zu n8n geleitet

#### Option B: Manuelle Konfiguration

Wenn Sie die Credentials manuell konfigurieren:

```json
{
  "clientId": "ihre-client-id",
  "clientSecret": "ihr-client-secret",
  "scope": "profile email contact_show contact_edit invoice_show invoice_edit quote_show quote_edit order_show order_edit article_show article_edit project_show project_edit timesheet_show timesheet_edit",
  "authUrl": "https://auth.bexio.com/realms/bexio/protocol/openid-connect/auth",
  "accessTokenUrl": "https://auth.bexio.com/realms/bexio/protocol/openid-connect/token",
  "grantType": "authorizationCode",
  "authentication": "body"
}
```

## 🧪 Testen der Verbindung

Nach der Konfiguration:

1. Die Credentials sollten automatisch getestet werden
2. Wenn erfolgreich: ✅ Grünes Häkchen
3. Wenn fehlgeschlagen: ❌ Fehlermeldung mit Details

**Test-Request:**
```
GET https://api.bexio.com/2.0/contact
```

## 🔧 Troubleshooting

### Fehler: "Invalid scopes"

**Problem:** Die angeforderten Scopes sind nicht in der Bexio-App konfiguriert.

**Lösung:**
1. Gehen Sie zu [developer.bexio.com](https://developer.bexio.com/)
2. Bearbeiten Sie Ihre App
3. Aktivieren Sie alle benötigten Scopes
4. Speichern Sie die Änderungen
5. Löschen Sie die Credentials in n8n und erstellen Sie sie neu

### Fehler: "Redirect URI mismatch"

**Problem:** Die Redirect-URL in Bexio stimmt nicht mit n8n überein.

**Lösung:**
1. Überprüfen Sie Ihre n8n-URL
2. Aktualisieren Sie die Redirect-URL in der Bexio-App exakt
3. Achten Sie auf `http` vs `https` und Port-Nummern

### Fehler: "Invalid client"

**Problem:** Client ID oder Secret sind falsch.

**Lösung:**
1. Überprüfen Sie Client ID und Secret in der Bexio-App
2. Kopieren Sie sie erneut (achten Sie auf Leerzeichen)
3. Erstellen Sie die Credentials in n8n neu

### Fehler: "Access denied"

**Problem:** Sie haben die Autorisierung abgelehnt.

**Lösung:**
1. Starten Sie den OAuth-Flow erneut
2. Klicken Sie auf "Autorisieren" in Bexio
3. Aktualisieren Sie die Credentials in n8n

## 📋 Scope-Übersicht

| Scope | Beschreibung | Read | Write | Delete |
|-------|--------------|------|-------|--------|
| `profile` | Benutzerprofil | ✅ | ❌ | ❌ |
| `email` | E-Mail-Adresse | ✅ | ❌ | ❌ |
| `contact_show` | Kontakte anzeigen | ✅ | ❌ | ❌ |
| `contact_edit` | Kontakte bearbeiten | ✅ | ✅ | ❌ |
| `contact_delete` | Kontakte löschen | ✅ | ✅ | ✅ |
| `invoice_show` | Rechnungen anzeigen | ✅ | ❌ | ❌ |
| `invoice_edit` | Rechnungen bearbeiten | ✅ | ✅ | ❌ |
| `quote_show` | Offerten anzeigen | ✅ | ❌ | ❌ |
| `quote_edit` | Offerten bearbeiten | ✅ | ✅ | ❌ |
| `order_show` | Bestellungen anzeigen | ✅ | ❌ | ❌ |
| `order_edit` | Bestellungen bearbeiten | ✅ | ✅ | ❌ |
| `article_show` | Artikel anzeigen | ✅ | ❌ | ❌ |
| `article_edit` | Artikel bearbeiten | ✅ | ✅ | ❌ |
| `project_show` | Projekte anzeigen | ✅ | ❌ | ❌ |
| `project_edit` | Projekte bearbeiten | ✅ | ✅ | ❌ |
| `timesheet_show` | Zeiterfassung anzeigen | ✅ | ❌ | ❌ |
| `timesheet_edit` | Zeiterfassung bearbeiten | ✅ | ✅ | ❌ |
| `accounting_show` | Buchhaltung anzeigen | ✅ | ❌ | ❌ |
| `accounting_edit` | Buchhaltung bearbeiten | ✅ | ✅ | ❌ |
| `payroll_show` | Personal anzeigen | ✅ | ❌ | ❌ |
| `payroll_edit` | Personal bearbeiten | ✅ | ✅ | ❌ |
| `company_profile` | Firmenprofil | ✅ | ❌ | ❌ |

## 🔒 Sicherheitshinweise

1. **Client Secret geheim halten!**
   - Nie in Git committen
   - Nicht in Logs ausgeben
   - Nicht öffentlich teilen

2. **Nur benötigte Scopes verwenden**
   - Minimal Privilege-Prinzip
   - Reduziert Sicherheitsrisiko

3. **Token-Refresh**
   - Access Tokens laufen nach 1 Stunde ab
   - n8n erneuert sie automatisch mit Refresh Token
   - Refresh Tokens sind länger gültig

4. **Redirect-URL schützen**
   - Verwenden Sie HTTPS in Produktion
   - Keine offenen Wildcards

## 📚 Weitere Ressourcen

- [Bexio API Dokumentation](https://docs.bexio.com/)
- [Bexio Developer Portal](https://developer.bexio.com/)
- [n8n Credentials Documentation](https://docs.n8n.io/credentials/)
- [OAuth 2.0 Specification](https://oauth.net/2/)

## ✅ Checkliste

Nach dem Setup sollten Sie folgendes testen:

- [ ] OAuth-Verbindung erfolgreich
- [ ] Credentials-Test erfolgreich (grünes Häkchen)
- [ ] Kontakte abrufen funktioniert
- [ ] Rechnungen abrufen funktioniert
- [ ] Projekte abrufen funktioniert
- [ ] Alle benötigten Ressourcen sind verfügbar

---

**Bei Problemen:** Öffnen Sie ein Issue auf GitHub oder kontaktieren Sie den Bexio Support.
