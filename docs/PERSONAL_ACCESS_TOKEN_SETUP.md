# 🔑 Bexio Personal Access Token (PAT) Setup

## Was ist ein Personal Access Token?

Ein Personal Access Token (PAT) ist eine einfachere Alternative zu OAuth2. Es ist ein langlebiger Token, den Sie direkt verwenden können, ohne den komplexen OAuth-Flow durchlaufen zu müssen.

## ✅ Vorteile von PAT

- **Einfacher**: Kein OAuth-Flow erforderlich
- **Schneller**: Sofort einsatzbereit
- **Keine Scope-Probleme**: Berechtigungen werden im Developer Portal festgelegt
- **Langlebig**: Token läuft nicht nach 1 Stunde ab

## 📋 Anleitung: PAT erstellen

### Schritt 1: Bexio Developer Portal öffnen

1. Gehen Sie zu: **https://developer.bexio.com/**
2. Melden Sie sich mit Ihrem Bexio-Account an
3. Wählen Sie Ihre Organisation aus

### Schritt 2: Personal Access Token erstellen

Im Developer Portal sollten Sie eine Option finden für:
- **"Personal Access Token"** oder
- **"API Token"** oder
- **"Token erstellen"** oder
- **"Generate Token"**

**Hinweis**: Die genaue Position kann variieren. Suchen Sie nach:
- Menüpunkt "Tokens" oder "Access Tokens"
- Button "Neuer Token" oder "Create Token"
- Eventuell unter "Settings" oder "API"

### Schritt 3: Token-Berechtigungen festlegen

Wenn Sie den Token erstellen, können Sie die Berechtigungen auswählen:

**Minimal (für Tests)**:
- ✅ Kontakte lesen

**Empfohlen (für produktiven Einsatz)**:
- ✅ Kontakte: Lesen, Erstellen, Bearbeiten, Löschen
- ✅ Rechnungen: Lesen, Erstellen, Bearbeiten
- ✅ Offerten: Lesen, Erstellen, Bearbeiten
- ✅ Bestellungen: Lesen, Erstellen, Bearbeiten
- ✅ Artikel: Lesen, Erstellen, Bearbeiten
- ✅ Projekte: Lesen, Erstellen, Bearbeiten
- ✅ Zeiterfassung: Lesen, Erstellen, Bearbeiten

### Schritt 4: Token kopieren

⚠️ **WICHTIG**: Der Token wird nur EINMAL angezeigt!

1. Kopieren Sie den Token sofort
2. Speichern Sie ihn sicher (z.B. in einem Passwort-Manager)
3. Sie können den Token NICHT später erneut abrufen

Beispiel-Token-Format:
```
bxo_123abc456def789ghi012jkl345mno678pqr901stu
```

### Schritt 5: Token in n8n verwenden

#### 5.1 n8n öffnen

1. Öffnen Sie Ihre n8n-Instanz
2. Gehen Sie zu **"Credentials"**
3. Klicken Sie auf **"+ Add Credential"**

#### 5.2 Bexio API Credential erstellen

1. Suchen Sie nach **"Bexio API"**
2. Wählen Sie **"Bexio API"** (NICHT "Bexio OAuth2 API")
3. Fügen Sie Ihren Personal Access Token ein
4. Klicken Sie auf **"Save"**

#### 5.3 Credential testen

Die Credentials werden automatisch getestet durch einen API-Aufruf:
```
GET https://api.bexio.com/2.0/contact
```

Wenn der Test erfolgreich ist: ✅ Grünes Häkchen
Wenn der Test fehlschlägt: ❌ Fehlermeldung

## 🧪 Ersten Test durchführen

### Test 1: Kontakte abrufen

1. Erstellen Sie einen neuen Workflow
2. Fügen Sie einen **Bexio-Knoten** hinzu
3. Wählen Sie Ihre **Bexio API** Credentials aus
4. Konfiguration:
   - **Resource**: Contact
   - **Operation**: Get Many
   - **Return All**: Yes
5. Führen Sie den Workflow aus

**Erwartetes Ergebnis**: Liste aller Kontakte in Ihrem Bexio-Account

### Test 2: Rechnung erstellen

1. Fügen Sie einen **Bexio-Knoten** hinzu
2. Konfiguration:
   - **Resource**: Invoice
   - **Operation**: Create
   - Füllen Sie die Pflichtfelder aus
3. Führen Sie den Workflow aus

**Erwartetes Ergebnis**: Neue Rechnung wurde erstellt

## 🔍 Troubleshooting

### Problem: "Invalid token" Fehler

**Ursache**: Token ist falsch oder ungültig

**Lösung**:
1. Überprüfen Sie, ob Sie den Token vollständig kopiert haben
2. Achten Sie auf Leerzeichen am Anfang/Ende
3. Erstellen Sie einen neuen Token im Developer Portal
4. Aktualisieren Sie die Credentials in n8n

### Problem: "Unauthorized" oder 401 Fehler

**Ursache**: Token hat nicht die erforderlichen Berechtigungen

**Lösung**:
1. Gehen Sie zum Developer Portal
2. Bearbeiten Sie den Token
3. Aktivieren Sie die fehlenden Berechtigungen
4. ODER: Erstellen Sie einen neuen Token mit allen Berechtigungen

### Problem: Kann PAT im Developer Portal nicht finden

**Lösung 1**: Kontaktieren Sie den Bexio Support
```
Hallo Bexio Team,

Ich möchte einen Personal Access Token (PAT) für die API erstellen,
aber ich kann diese Option im Developer Portal nicht finden.

Können Sie mir bitte zeigen, wo ich einen PAT erstellen kann?

Vielen Dank!
```

**Lösung 2**: Verwenden Sie OAuth2 stattdessen
- Siehe [BEXIO_OAUTH_SETUP.md](BEXIO_OAUTH_SETUP.md)

## 🔒 Sicherheit

### Token sicher aufbewahren

❌ **NICHT**:
- In Git committen
- In Logs ausgeben
- Öffentlich teilen
- In unverschlüsselten Dateien speichern

✅ **EMPFOHLEN**:
- Passwort-Manager verwenden
- n8n Credentials-Manager verwenden
- Umgebungsvariablen verwenden
- Regelmäßig rotieren

### Token-Rotation

Empfehlung: Erstellen Sie alle 3-6 Monate einen neuen Token:

1. Erstellen Sie neuen Token im Developer Portal
2. Aktualisieren Sie die Credentials in n8n
3. Testen Sie, dass alles funktioniert
4. Löschen Sie den alten Token im Developer Portal

## 📞 Support

**Bexio Support kontaktieren**:
- Developer Portal: https://developer.bexio.com/
- Dokumentation: https://docs.bexio.com/
- Support: Über Ihren Bexio-Account

**Was Sie bereithalten sollten**:
1. Ihre Bexio Account-ID
2. Fehlermeldungen (Screenshots)
3. Beschreibung des Problems
4. Was Sie bereits versucht haben

## ✅ Erfolgs-Checkliste

Nach dem Setup sollten Sie folgendes haben:

- [ ] Personal Access Token im Bexio Developer Portal erstellt
- [ ] Token sicher kopiert und gespeichert
- [ ] Credentials in n8n erstellt mit dem PAT
- [ ] Credential-Test erfolgreich (grünes Häkchen)
- [ ] Erster Test-Request funktioniert (z.B. Kontakte abrufen)
- [ ] Alle benötigten Berechtigungen sind aktiviert

## 🎯 Nächste Schritte

Jetzt können Sie:

1. **Workflows erstellen** mit dem Bexio-Knoten
2. **Automation aufbauen** für:
   - Rechnungserstellung
   - Kontaktverwaltung
   - Projektmanagement
   - Zeiterfassung
3. **Integrationen** mit anderen n8n-Knoten:
   - E-Mail versenden nach Rechnungserstellung
   - CRM-Synchronisation
   - Automatische Berichte

---

**Viel Erfolg mit Ihrer Bexio-Integration!** 🚀
