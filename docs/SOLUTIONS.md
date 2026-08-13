# SOLUTIONS.md — Kända Problem & Lösningar

## Email/Mail-flöden

### Brevo IP-blockering (Återkommande)
**Problem:** Kundmailet från registrering/beställning når inte kunden. Du får istället ett säkerhetsvarnmail från Brevo ("Security Alert: Verify a new IP").

**Root cause:** Brevo hade IP-verifiering aktiverad för API-anrop. Vercel serverless-funktioner använder roterande utgående IP-adresser mellan varje anrop, så varje ny registrering från en "okänd" IP blockeras av Brevo och mailet skickas aldrig.

**Lösning:**
1. Logga in på brevo.com
2. Gå till **Settings → Security → Authorized IPs**
3. Klicka **"Deactivate for API keys"** (under "API keys ● Activated")
4. Testa registrera igen — mailet ska nu gå fram direkt

**Notering:** Detta gjordes senast 2026-08-12. Testade mailflöden som då bekräftades fungerande:
- Välkomstmail (registrering) ✓
- Lösenordsåterställning ✓
- Orderbekräftelse ✓
- Kontaktformulär (internt) ✓
- Skadeanmälan mottagen (claim_received) ✓

---

## VPS & Server

### SSH timeout till VPS (Periodisk)
**Problem:** SSH-anslutning till `95.217.163.97` timeout:ar, även om servern är igång och frisk.

**Root cause:** Intermittent nätverksblockering mellan användarens ISP (Tele2) och Hetzners datacenter, troligt utlöst av bot-anfall/brute-force-försök mot servern som många leverantörer reagerar på.

**Snabbaste lösning:**
- Testa direkt på mobildata (använd ett annat nätverk) — om det fungerar där är felet lokalt/ISP-nivå
- Använd **Hetzner webbkonsol** (VNC) istället för SSH medan blockeringen pågår
- Vänta några minuter och testa SSH igen — brukar lösa sig själv

**Om SSH fortfarande inte fungerar senare:**
1. Verifiera servern är uppe i Hetzner Cloud Console
2. Traceroute visar vägen in i Hetzners molnnätverk? Om ja, är det inte ett routingproblem
3. Gå till webbkonsolen och kolla `systemctl status ssh`, `ufw status`, `ip a` — servern själv är troligt frisk
4. Kontakta Hetzner support med traceroute-output om det kvarstår

**Referens:** Dokumenterat 2026-08-12 efter flera återkommande tillfällen av samma problem.

---

## Medusa Admin

### Admin-användarkonton
**Aktuell status (2026-08-12):**
- `admin@techpilots.se` / `Admin123!` — fungerar ✓
- `nedalissa@outlook.com` — borttagen (var bara för Medusa Admin, behövdes inte längre)

Se `docs/KEYS.md` för inloggningsuppgifter.

---

## Checklist före deployment

- [ ] Brevo IP-verifiering för API-nycklar är **av** (Settings → Security → Authorized IPs → "Deactivate for API keys")
- [ ] Alla mailmallar i Brevo är **Active**: password_reset, order_confirmation, claim_received
- [ ] Testmail från Brevo når inbox (inte spam/blockerad)
- [ ] VPS SSH fungerar, eller webbkonsolen är åtkomlig via Hetzner
