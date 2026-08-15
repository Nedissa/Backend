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

### Admin-dashboard helt trasig efter uppgradering till 2.19.0 (Löst 2026-08-15)
**Problem:** Efter uppgradering från Medusa 2.14.2 till 2.19.0 gick admin-panelen inte att använda:
- Produktsidan kraschade med `column o3.product_id does not exist` när options/variants laddades
- `medusa build` failade med `[vite]: Rollup failed to resolve import` för ett paket i taget
- Nedgradering tillbaka till 2.14.2 och testning av 2.13.0 gav **samma fel** — inte version-specifikt

**Root cause (tre separata buggar, inte en):**

1. **`@medusajs/dashboard` deklarerar inte sina runtime-dependencies korrekt.** Paketet importerar ~60 paket (hela `@radix-ui/*`-familjen, `@ariakit/*`, `react-aria`/`react-stately`-ekosystemet, `qs`/`side-channel`-kedjan m.fl.) utan att lista dem som dependencies. pnpm hoistar dem inte automatiskt till `apps/backend/node_modules`, så Vite kan inte resolva importerna vid build. Detta ser ut som ett versionsfel men fanns likadant i 2.13, 2.14 och 2.19.

2. **PM2 körde `medusa develop`** (dev-mode med Vite HMR) istället för `medusa start` (production build). Dev-mode öppnar en separat WebSocket-port för Hot Module Reload som inte är proxad genom nginx → `net::ERR_CONNECTION_TIMED_OUT` → admin-sidan renderade helt blank/vit, oavsett om build-felen ovan var fixade.

3. **`@medusajs/js-sdk` var fastlåst på 2.14.2** i `package.json` (kvarleva från tidigare nedgraderingsförsök) medan `@medusajs/dashboard@2.19.0` är byggd mot js-sdk 2.19.0's API-yta. Det gjorde att `sdk.auth.listProviders("user")` anropades fel/failade tyst, vilket fick login-sidan att visa "Register an auth provider in your Medusa config" istället för email/lösenord-formuläret — trots att `emailpass`-inloggning fungerade perfekt via rått API-anrop.

**Lösning (i ordning):**
1. Identifiera varje saknat paket genom att köra `medusa build` upprepade gånger — varje körning avslöjar nästa saknade import i felmeddelandet (`Rollup failed to resolve import "X" from "Y"`). Lägg till paketet i `package.json` med samma version som `Y`s egen `package.json` anger, kör `pnpm install`, bygg igen. Iterera tills build lyckas (~15 iterationer, se commit `609ad7f` för full lista).
2. Ändra `ecosystem.config.js`: `args: 'medusa develop'` → `args: 'medusa start'`, samt `NODE_ENV: 'development'` → `NODE_ENV: 'production'`.
3. Pinna `@medusajs/js-sdk` till samma version som `@medusajs/dashboard` (2.19.0, inte 2.14.2).
4. Registrera auth-modulen explicit i `medusa-config.ts` (paketvägen i v2 är `@medusajs/medusa/auth` och `@medusajs/medusa/auth-emailpass`, INTE `@medusajs/auth`):
   ```ts
   modules: [
     {
       resolve: '@medusajs/medusa/auth',
       options: {
         providers: [
           { resolve: '@medusajs/medusa/auth-emailpass', id: 'emailpass' },
         ],
       },
     },
     // ... övriga moduler
   ]
   ```
5. Ta bort de tillfälliga route-workarounds som fetchade produkt-options via rå SQL (`src/api/admin/products/[id]/route.ts` m.fl.) — grundbugen (`product_id does not exist`) var en direkt konsekvens av bugg #1 ovan (trasigt query-lager pga saknade deps i själva Medusa-koden, inte i dashboard). När dependency-trädet är komplett försvinner den.
6. `pm2 delete medusa && pm2 start ecosystem.config.js && pm2 save`.

**Verifiering:** Login fungerar, produktlista renderas, produktdetalj med Options (färg/storlek) och Variants renderas utan konsolfel. Testat i browser via chrome-devtools MCP, inte bara curl.

**Nästa gång detta händer:** Om `medusa build` failar med "Rollup failed to resolve import", det är alltid en saknad dependency — leta upp paketets egen `package.json` (`node_modules/<the-importing-package>/package.json`) och lägg till dess deps i `apps/backend/package.json`. Om admin-sidan renderar helt blank/vit, kolla `pm2 show medusa` för `script args` — om det säger `medusa develop`, det är fel i produktion.

Se commit `609ad7f` i Backend-repot för fullständig diff.

---

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
- [ ] `pm2 show medusa` visar `script args: medusa start` (inte `develop`) i produktion
