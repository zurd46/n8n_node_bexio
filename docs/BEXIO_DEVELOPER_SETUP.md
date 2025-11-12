# 🔧 Bexio Developer Portal Setup - Schritt für Schritt

## ⚠️ WICHTIG: Das Problem

Der Fehler `"Invalid scopes"` bedeutet, dass die OAuth-Scopes **in Ihrer Bexio-Anwendung nicht aktiviert** sind.

Bexio **erfordert**, dass Sie jeden Scope explizit in Ihrer OAuth-App im Developer Portal aktivieren, bevor Sie ihn verwenden können!

## 📋 Schritt-für-Schritt Anleitung

### Schritt 1: Bexio Developer Portal öffnen

1. Gehen Sie zu: **https://developer.bexio.com/**
2. Melden Sie sich mit Ihrem Bexio-Account an
3. Wählen Sie Ihre Organisation aus

### Schritt 2: OAuth-Anwendung erstellen oder bearbeiten

**Neue App erstellen:**
1. Klicken Sie auf **"App erstellen"** oder **"New App"**
2. Wählen Sie **"OAuth 2.0"** als App-Typ
3. Geben Sie einen Namen ein (z.B. "n8n Integration")

**Bestehende App bearbeiten:**
1. Finden Sie Ihre App in der Liste
2. Klicken Sie auf **"Bearbeiten"** oder **"Edit"**

### Schritt 3: Redirect URL konfigurieren

Tragen Sie die Redirect URL ein:

**Für lokales n8n:**
```
http://localhost:5678/rest/oauth2-credential/callback
```

**Für gehostetes n8n:**
```
https://ihre-domain.com/rest/oauth2-credential/callback
```

**Für n8n Cloud:**
```
https://app.n8n.cloud/rest/oauth2-credential/callback
```

### Schritt 4: Scopes aktivieren ⭐ WICHTIGSTER SCHRITT!

Im Bexio Developer Portal gibt es einen Bereich für **"Berechtigungen"** oder **"Scopes"**.

**Sie MÜSSEN jeden Scope einzeln aktivieren!**

#### Minimal-Setup (Start):
Aktivieren Sie mindestens:
- ✅ `contact_show` - Kontakte anzeigen

#### Empfohlene Scopes:
Aktivieren Sie diese für die volle Funktionalität:

**Kontakte:**
- ✅ `contact_show`
- ✅ `contact_edit`
- ✅ `contact_delete`

**Rechnungen:**
- ✅ `invoice_show`
- ✅ `invoice_edit`
- ✅ `invoice_delete`

**Offerten:**
- ✅ `quote_show`
- ✅ `quote_edit`
- ✅ `quote_delete`

**Bestellungen:**
- ✅ `order_show`
- ✅ `order_edit`
- ✅ `order_delete`

**Artikel/Produkte:**
- ✅ `item_show`
- ✅ `item_edit`
- ✅ `item_delete`

**Projekte:**
- ✅ `project_show`
- ✅ `project_edit`
- ✅ `project_delete`

**Zeiterfassung:**
- ✅ `timesheet_show`
- ✅ `timesheet_edit`
- ✅ `timesheet_delete`

**Buchhaltung:**
- ✅ `accounting_show`
- ✅ `accounting_edit`

**Banking:**
- ✅ `bank_account_show`
- ✅ `payment_show`
- ✅ `payment_edit`
- ✅ `payment_delete`

**Firma:**
- ✅ `company_profile`

### Schritt 5: Speichern

1. Klicken Sie auf **"Speichern"** oder **"Save"**
2. Notieren Sie sich:
   - **Client ID**
   - **Client Secret**

### Schritt 6: In n8n konfigurieren

#### 6.1 Credential erstellen

1. Öffnen Sie n8n
2. Gehen Sie zu **Credentials**
3. Klicken Sie **"+ Add Credential"**
4. Suchen Sie nach **"Bexio OAuth2 API"**

#### 6.2 Credentials ausfüllen

**Client ID:**
```
[Ihre Client ID aus dem Developer Portal]
```

**Client Secret:**
```
[Ihr Client Secret aus dem Developer Portal]
```

**Scope:**
```
contact_show invoice_show project_show timesheet_show
```
_(Passen Sie die Scopes an die Scopes an, die Sie in Schritt 4 aktiviert haben!)_

**Wichtig:** Die Scopes müssen **EXAKT** mit den in Bexio aktivierten Scopes übereinstimmen!

#### 6.3 Verbinden

1. Klicken Sie auf **"Connect my account"**
2. Sie werden zu Bexio weitergeleitet
3. Autorisieren Sie die App
4. Sie werden zurück zu n8n geleitet

### Schritt 7: Testen

Nach erfolgreicher Verbindung:
1. Die Credentials sollten ein ✅ grünes Häkchen zeigen
2. Erstellen Sie einen neuen Workflow
3. Fügen Sie einen Bexio-Knoten hinzu
4. Wählen Sie die Credentials aus
5. Testen Sie z.B. "Contact" → "Get Many"

## 🔍 Troubleshooting

### Problem: "Invalid scopes" Fehler

**Ursache:** Die Scopes sind nicht in der Bexio-App aktiviert.

**Lösung:**
1. Gehen Sie zurück zum Developer Portal
2. Bearbeiten Sie Ihre App
3. Aktivieren Sie ALLE Scopes, die Sie verwenden möchten
4. Speichern Sie
5. Warten Sie 1-2 Minuten (manchmal dauert die Synchronisation)
6. Löschen Sie die Credentials in n8n
7. Erstellen Sie neue Credentials
8. Versuchen Sie erneut zu verbinden

### Problem: "Redirect URI mismatch"

**Ursache:** Die Redirect-URL stimmt nicht überein.

**Lösung:**
1. Überprüfen Sie die n8n-URL (mit/ohne Port, http/https)
2. Aktualisieren Sie die Redirect-URL im Developer Portal
3. Achten Sie auf exakte Übereinstimmung (inkl. Groß-/Kleinschreibung)

### Problem: "Invalid client"

**Ursache:** Client ID oder Secret sind falsch.

**Lösung:**
1. Kopieren Sie Client ID und Secret neu aus dem Developer Portal
2. Achten Sie auf Leerzeichen am Anfang/Ende
3. Erstellen Sie die Credentials in n8n neu

### Problem: Verbindung funktioniert, aber API-Aufrufe schlagen fehl

**Ursache:** Sie versuchen eine Operation, für die der Scope nicht aktiviert ist.

**Beispiel:** Sie versuchen Rechnungen zu erstellen, aber nur `invoice_show` ist aktiviert.

**Lösung:**
1. Aktivieren Sie den fehlenden Scope im Developer Portal (z.B. `invoice_edit`)
2. Die Credentials müssen NICHT neu erstellt werden
3. Versuchen Sie die Operation erneut

## ✅ Erfolgs-Checkliste

Nach der Konfiguration sollten Sie folgendes haben:

- [ ] OAuth-App im Bexio Developer Portal erstellt
- [ ] Redirect-URL korrekt konfiguriert
- [ ] Alle benötigten Scopes in Bexio aktiviert
- [ ] Client ID und Secret kopiert
- [ ] Credentials in n8n erstellt
- [ ] Scopes in n8n entsprechen den in Bexio aktivierten Scopes
- [ ] Erfolgreich verbunden (grünes Häkchen)
- [ ] Test-Request funktioniert (z.B. Kontakte abrufen)

## 💡 Tipps

1. **Start klein:** Beginnen Sie nur mit `contact_show` und fügen Sie nach und nach weitere Scopes hinzu
2. **Dokumentation:** Notieren Sie sich, welche Scopes Sie aktiviert haben
3. **Testen:** Testen Sie jede neue Funktion einzeln
4. **Updates:** Wenn Sie später mehr Scopes brauchen, aktivieren Sie sie einfach im Developer Portal

## 📚 Weitere Hilfe

- Bexio Developer Portal: https://developer.bexio.com/
- Bexio API Dokumentation: https://docs.bexio.com/
- Bexio Support: Über das Developer Portal

---

**Wichtig:** Ohne korrekt konfigurierte Scopes im Bexio Developer Portal wird die OAuth-Verbindung NICHT funktionieren!
