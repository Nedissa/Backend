# Techpilots — Fullständig Audit & Förbättringsguide

> Stack: Next.js 16 · React 19 · Medusa v2.14 · TypeScript 5 · PostgreSQL · PM2 · Nginx · Hetzner VPS · Vercel · Cloudflare · Brevo · Stripe · Payload CMS

Denna guide är avsedd att köras som en strukturerad genomgång av hela projektet — kod, infrastruktur, säkerhet, prestanda och best practices. Gå igenom varje sektion uppifrån och ned. Bocka av när det är åtgärdat.

---

## 1. SÄKERHET

### 1.1 Autentisering & Sessioner
- [ ] JWT-hemligheter är minst 32 tecken och slumpmässiga (inte ordbaserade)
- [ ] `JWT_SECRET` och `COOKIE_SECRET` sätts endast via miljövariabler — aldrig hårdkodade fallbacks
- [ ] Alla auth-cookies har flaggorna: `HttpOnly`, `Secure`, `SameSite=Lax`
- [ ] Tokens löper ut — kontrollera att `Max-Age` är rimlig (t.ex. 7 dagar)
- [ ] Logout rensar faktiskt cookies server-side (inte bara client-side)
- [ ] Medusa admin-panel är skyddad bakom autentisering — aldrig publik
- [ ] Lösenordsåterställningstoken har kort TTL (max 1 timme rekommenderas)
- [ ] Brute-force-skydd på `/api/auth/login` (rate limiting eller lockout)

### 1.2 API-säkerhet
- [ ] Alla API-routes som kräver inloggning validerar `medusa_token` från cookie — inte från request body
- [ ] Ingen route exponerar interna fel (`error.message`, stack traces) till klienten
- [ ] Ingen route läcker miljövariabler i svar (t.ex. lista med `process.env`-nycklar)
- [ ] CORS är begränsat till egna domäner — inte `*`
- [ ] Rate limiting på alla publika API-endpoints (speciellt checkout, contact, newsletter)
- [ ] Input-validering på alla POST-endpoints — tomma fält, typkontroll, maxlängd
- [ ] HTML-escape på all användarinput som injiceras i e-postmallar

### 1.3 SSRF & Injektioner
- [ ] Image proxy (`/api/image`) har domän-whitelist — inga godtyckliga externa URLs
- [ ] URL-protokoll valideras (endast `https://` tillåtet i proxy)
- [ ] Content-Type valideras på proxysvar (endast `image/*`)
- [ ] SQL-parametrar skickas alltid via parameteriserade queries — aldrig string-interpolation
- [ ] Alla dynamiska routes med `[id]` validerar att ID-formatet stämmer innan databasanrop

### 1.4 Hemligheter & Nycklar
- [ ] `.env` och `.env.production` finns i `.gitignore` — kontrollera med `git log --all -- .env`
- [ ] Inga hemligheter i git-historiken — kör `git log -S "secret" --all` och `git log -S "sk_live" --all`
- [ ] Stripe live-nycklar (`sk_live_`) är ALDRIG i koden eller git
- [ ] Brevo API-nyckel är ALDRIG i koden
- [ ] VPS SSH-nyckel är ALDRIG committad
- [ ] Deploy-token för webhook är stark och unik
- [ ] Alla produktionsnycklar roteras regelbundet (minst 1 gång per år)

### 1.5 Infrastruktur & Nätverk
- [ ] VPS-brandvägg: endast portarna 22, 80, 443 är öppna (Hetzner Firewall)
- [ ] Port 22 är begränsad till kända IP-adresser om möjligt
- [ ] PostgreSQL lyssnar inte på `0.0.0.0` — endast `localhost`
- [ ] PM2 körs som icke-root-användare om möjligt
- [ ] Nginx har `server_tokens off` (döljer versionsnummer)
- [ ] Nginx har `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` headers
- [ ] HTTPS fungerar på alla endpoints — inga HTTP-resurser på HTTPS-sidor (mixed content)
- [ ] SSL-certifikat löper inte ut inom 30 dagar — kontrollera med `openssl s_client`
- [ ] Cloudflare Tunnel är konfigurerad korrekt — origin server accepterar bara Cloudflare IPs

---

## 2. KOD-KVALITET

### 2.1 TypeScript
- [ ] `strict: true` i `tsconfig.json` — inga `any` utan motivering
- [ ] Inga `// @ts-ignore` eller `// @ts-nocheck` utan kommentar om varför
- [ ] Alla API-responses har typade interfaces — inte `any[]`
- [ ] Inga oanvända imports eller variabler (kör `tsc --noEmit`)
- [ ] Konsekvent namngivning: camelCase för variabler, PascalCase för komponenter

### 2.2 React & Next.js
- [ ] Inga `useEffect`-loopar (dependency arrays är korrekta)
- [ ] Inga memory leaks — event listeners och timers rensas i cleanup-funktioner
- [ ] `'use client'` används minimalt — server components där möjligt
- [ ] Bilder använder `next/image` med korrekt `width`/`height` för Core Web Vitals
- [ ] Dynamiska routes har `generateStaticParams` där det är möjligt (statisk generering)
- [ ] Error boundaries täcker alla kritiska sektioner
- [ ] `loading.tsx` finns för tunga server-rendered routes
- [ ] Inga `console.log`/`console.error` i produktionskod

### 2.3 API Routes (Next.js)
- [ ] Alla routes returnerar korrekt HTTP-statuskod (201 för POST, 400 för valideringsfel, 401 för auth-fel)
- [ ] Alla catch-block hanterar felet — inte tysta `catch {}`  på kritiska operationer
- [ ] Token extraheras från `HttpOnly`-cookie server-side — aldrig från Authorization-header via client
- [ ] Medusa-anrop sker server-side — publishable key exponeras inte i client-requests onödigt

### 2.4 Backend (Medusa)
- [ ] Alla custom routes har korrekt Medusa-middleware (autentisering, CORS)
- [ ] Subscribers är idempotenta — kan köras flera gånger utan bieffekter
- [ ] Inga blockande operationer i subscribers — allt asynkront
- [ ] `crypto.randomUUID()` används för ID-generering — aldrig `Math.random()`
- [ ] Databas-migrations är versionskontrollerade och körs automatiskt vid deploy
- [ ] `.medusa/server/.env` synkas med källkoden `.env` vid varje deploy

---

## 3. PRESTANDA

### 3.1 Frontend
- [ ] Lighthouse-score ≥ 90 på Performance, Accessibility, Best Practices, SEO
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] First Input Delay (FID) / Interaction to Next Paint (INP) < 200ms
- [ ] Bilder är WebP/AVIF-format och komprimerade
- [ ] Inga render-blocking scripts (defer/async)
- [ ] Bundle-storlek kontrollerad — kör `next build` och analysera output
- [ ] Fonts laddas med `font-display: swap`
- [ ] Kritisk CSS är inlinad — resten lazy-loaded

### 3.2 API & Caching
- [ ] Produktlista cachas lämpligt (`Cache-Control: s-maxage=60`)
- [ ] Medusa-anrop från layout-komponenter cachas med Next.js `fetch` cache
- [ ] Statiska sidor (FAQ, policies) är statiskt genererade — inte server-rendered per request
- [ ] Bilder servas via CDN (Vercel Image Optimization eller Cloudflare)
- [ ] Inga N+1-problem i databasanrop (join istället för loop med queries)

### 3.3 VPS & Backend
- [ ] PostgreSQL connection pool är konfigurerad korrekt (`pool.max` i Medusa-config)
- [ ] PM2 cluster-läge används om servern har flera CPU-kärnor
- [ ] Swap-minne finns som säkerhetsnät (minst 2GB)
- [ ] Nginx gzip-komprimering är aktiverad
- [ ] Node.js heap-storlek är begränsad i PM2-config för att förhindra OOM
- [ ] Loggar roteras — inte obegränsat växande filer

---

## 4. TILLFÖRLITLIGHET & DRIFTSÄKERHET

### 4.1 Deploy-pipeline
- [ ] GitHub Actions kör vid push till `main`
- [ ] Deploy-webhook på VPS är autentiserad med token
- [ ] `deploy.sh` bygger om Medusa efter varje pull (`npm run build`)
- [ ] `.env` kopieras till `.medusa/server/` efter varje build
- [ ] PM2 `startup` och `save` är konfigurerade — överlever omstart
- [ ] Deploy-fel notifieras (Slack, mail eller liknande)
- [ ] Rollback-strategi finns — kan man snabbt gå tillbaka till föregående commit?

### 4.2 Monitoring & Observability
- [ ] Uptime-monitoring finns (UptimeRobot, Better Uptime eller liknande) — varnar vid nersida
- [ ] Error-tracking finns (Sentry eller liknande) — fångar fel i produktion
- [ ] Server-metrics monitoreras: CPU, RAM, disk (Hetzner Metrics eller Grafana)
- [ ] PM2 logs inspekteras regelbundet — inga tysta krascher
- [ ] PostgreSQL-logs kontrolleras för slow queries

### 4.3 Backup
- [ ] PostgreSQL backas upp dagligen — automatiserat
- [ ] Backupen testas regelbundet — kan den återställas?
- [ ] Medusa-filer (uploads/static) backas upp
- [ ] Backup lagras off-site (inte bara på samma VPS)
- [ ] Retention-policy: minst 30 dagars backup-historik

### 4.4 Feltolerans
- [ ] Medusa kraschar inte vid saknad miljövariabel — startvalidering finns
- [ ] Frontend visar meningsfulla felmeddelanden vid API-timeout
- [ ] Checkout-flödet hanterar Stripe-timeout gracefully
- [ ] Newsletter-signup och välkomstmail misslyckas tyst — blockerar inte registrering
- [ ] Loyalty-points-subscriber kraschar inte orderkompletteringen

---

## 5. SEO & TILLGÄNGLIGHET

### 5.1 SEO
- [ ] `<title>` och `<meta description>` är unika per sida
- [ ] `sitemap.ts` genererar korrekt sitemap med alla produkter och kategorier
- [ ] `robots.txt` finns och är korrekt konfigurerad
- [ ] Canonical URLs är satta korrekt
- [ ] Strukturerad data (JSON-LD) finns på produktsidor (Product, BreadcrumbList)
- [ ] Open Graph-taggar finns för sociala delningar
- [ ] Alla bilder har `alt`-attribut
- [ ] Inga 404-sidor indexeras av sökmotorer

### 5.2 Tillgänglighet (WCAG 2.1 AA)
- [ ] Alla interaktiva element är nåbara via tangentbord (Tab-ordning logisk)
- [ ] Kontrastratio ≥ 4.5:1 för brödtext, ≥ 3:1 för stor text
- [ ] Alla formulärfält har `<label>` kopplad med `htmlFor`
- [ ] Felmeddelanden i formulär är kopplade till fältet via `aria-describedby`
- [ ] Modaler och dialoger fångar fokus korrekt (focus trap)
- [ ] `<main>`, `<nav>`, `<header>`, `<footer>` landmarks används
- [ ] Inga enbart färgbaserade informationsbärare (t.ex. rött = fel — lägg till ikon också)

---

## 6. DATAHANTERING & GDPR

- [ ] Cookie-banner frågar om samtycke innan analytics-cookies sätts
- [ ] Integritetspolicy är aktuell och täcker all databehandling
- [ ] Kunddata (namn, email, adress) lagras endast i Medusa/PostgreSQL — inte i localStorage
- [ ] Kunder kan begära radering av sitt konto och all data
- [ ] Loggar innehåller inte personuppgifter (email, namn, IP)
- [ ] Brevo-integrationen är GDPR-kompatibel (EU-baserad databehandling)
- [ ] Stripe hanterar kortdata — vi lagrar aldrig kortnummer själva

---

## 7. UNDERHÅLL & TEKNISK SKULD

### 7.1 Beroenden
- [ ] Kör `npm audit` i frontend och backend — inga kritiska sårbarheter
- [ ] Kör `npm outdated` — identifiera beroenden som är > 2 majors bakom
- [ ] Node.js-version på VPS matchar `.nvmrc` eller `engines` i `package.json`
- [ ] Inga oanvända paket i `package.json`

### 7.2 Kodstäd
- [ ] Inga oanvända filer, sidor eller komponenter i repot
- [ ] Inga mock-data eller `MOCK_`-konstanter i produktionskod
- [ ] Inga hårdkodade URL:er till `localhost` utanför `process.env`-fallbacks
- [ ] Inga kommenterade kodblock (`// old code`)
- [ ] Git-historiken är ren — inga accidentellt committade hemligheter

### 7.3 Dokumentation
- [ ] `README.md` förklarar hur man sätter upp projektet lokalt
- [ ] Deploy-processen är dokumenterad
- [ ] Miljövariabler är dokumenterade (vad varje variabel gör)
- [ ] VPS-konfigurationen är dokumenterad (Nginx-config, PM2-setup, ports)

---

## 8. BETALNINGAR & E-HANDEL

- [ ] Stripe är i live-läge i produktion — inte test-läge
- [ ] Webhook från Stripe är verifierad med `stripe.webhooks.constructEvent`
- [ ] Order skapas i Medusa EFTER bekräftad betalning — inte före
- [ ] Inventory minskas korrekt när order läggs
- [ ] Priser valideras server-side — kunden kan inte manipulera priset client-side
- [ ] Rabattkoder valideras server-side via Medusa
- [ ] Orderbekräftelse-mail skickas efter lyckad betalning
- [ ] Retur- och reklamationsflöde är kopplat till Medusa

---

## HUR MAN KÖR AUDITEN

### Säkerhet — snabbkoll
```bash
# Kolla efter hemligheter i git-historiken
git log --all -S "sk_live" --oneline
git log --all -S "supersecret" --oneline
git log --all -- .env

# Kolla öppna portar på VPS
ssh root@api.techpilots.se "ss -tlnp"

# SSL-certifikat utgångsdatum
echo | openssl s_client -connect api.techpilots.se:443 2>/dev/null | openssl x509 -noout -dates

# npm-sårbarheter
cd Techpilots-Frontend && npm audit
cd Techpilots-Backend && npm audit
```

### Prestanda — snabbkoll
```bash
# Lighthouse via CLI
npx lighthouse https://techpilots.vercel.app --output=html --output-path=./lighthouse.html

# Bundle-analys
cd Techpilots-Frontend && ANALYZE=true npm run build
```

### Backend-hälsa
```bash
# PM2-status
ssh root@api.techpilots.se "pm2 status && pm2 logs medusa --lines 50"

# PostgreSQL aktiva connections
ssh root@api.techpilots.se "psql -U postgres -c 'SELECT count(*) FROM pg_stat_activity;'"

# Diskutrymme
ssh root@api.techpilots.se "df -h && free -h"
```

---

## 9. VPS-KONFIGURATION

> Gäller Hetzner VPS med Ubuntu. Om servern behöver byggas om från scratch — följ denna sektion i ordning.

### 9.1 PM2 (Processhanterare)
- [ ] PM2 är installerat globalt: `npm install -g pm2`
- [ ] Alla processer körs: `pm2 status` ska visa `medusa`, `payload`, `webhook` som `online`
- [ ] PM2 startar automatiskt vid omstart: `pm2 startup` + `pm2 save`
- [ ] PM2 log-rotation är konfigurerad: `pm2 install pm2-logrotate`
- [ ] Max log-storlek satt: `pm2 set pm2-logrotate:max_size 50M`
- [ ] PM2 cluster-läge används om servern har ≥ 2 CPU-kärnor (`instances: 2` i ecosystem.config.js)
- [ ] Node.js heap-gräns satt i PM2-config för att förhindra OOM-krasch:
  ```json
  { "node_args": "--max-old-space-size=512" }
  ```

**Snabbkoll PM2:**
```bash
pm2 status                        # Alla processer online?
pm2 logs medusa --lines 100       # Fel i Medusa?
pm2 logs webhook --lines 50       # Webhookfel?
pm2 monit                         # Live CPU/RAM per process
```

**Återstart vid problem:**
```bash
pm2 stop all
systemctl restart postgresql@18-main   # Frigör connection pool
pm2 start medusa
pm2 start webhook
pm2 save
```

---

### 9.2 Nginx (Reverse Proxy)
- [ ] Nginx är installerat och aktivt: `systemctl status nginx`
- [ ] Config finns i `/etc/nginx/sites-available/medusa` med symlink till `sites-enabled/`
- [ ] Nginx vidarebefordrar `/` → Medusa port 9000
- [ ] Nginx vidarebefordrar `/deploy` → Webhook port 9001
- [ ] `server_tokens off` finns i nginx.conf (döljer versionsnummer)
- [ ] Säkerhetsheaders är satta:
  ```nginx
  add_header X-Frame-Options "SAMEORIGIN";
  add_header X-Content-Type-Options "nosniff";
  add_header Referrer-Policy "strict-origin-when-cross-origin";
  add_header X-XSS-Protection "1; mode=block";
  ```
- [ ] Gzip-komprimering aktiverad:
  ```nginx
  gzip on;
  gzip_types text/plain application/json application/javascript text/css;
  gzip_min_length 1000;
  ```
- [ ] Rate limiting konfigurerat för auth-endpoints:
  ```nginx
  limit_req_zone $binary_remote_addr zone=auth:10m rate=10r/m;
  limit_req zone=auth burst=5 nodelay;
  ```
- [ ] `client_max_body_size` satt rimligt (t.ex. `10m` för bilduppladdningar)

**Snabbkoll Nginx:**
```bash
nginx -t                          # Syntaxkontroll
systemctl status nginx            # Körs?
tail -f /var/log/nginx/error.log  # Aktuella fel
tail -f /var/log/nginx/access.log # Inkommande requests
```

---

### 9.3 PostgreSQL
- [ ] PostgreSQL körs: `systemctl status postgresql`
- [ ] Lyssnar endast på localhost — inte publik IP:
  ```bash
  ss -tlnp | grep 5432   # Ska visa 127.0.0.1:5432, INTE 0.0.0.0:5432
  ```
- [ ] Connection pool i Medusa-config är rimlig (rekommenderat: `max: 10` för liten VPS)
- [ ] Regelbunden VACUUM körs (PostgreSQL sköter detta automatiskt med autovacuum — verifiera att det är på)
- [ ] Slow query logging aktiverat för queries > 1 sekund:
  ```sql
  ALTER SYSTEM SET log_min_duration_statement = '1000';
  SELECT pg_reload_conf();
  ```
- [ ] Databas-backup körs dagligen (se sektion 4.3)

**Snabbkoll PostgreSQL:**
```bash
# Aktiva connections
psql -U postgres -c "SELECT count(*), state FROM pg_stat_activity GROUP BY state;"

# Databasstorlek
psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('medusa'));"

# Slow queries (kräver pg_stat_statements)
psql -U postgres -c "SELECT query, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"

# Lås och blockeringar
psql -U postgres -c "SELECT pid, query, state, wait_event FROM pg_stat_activity WHERE wait_event IS NOT NULL;"
```

---

### 9.4 Swap & Minne
- [ ] Swap finns (minst 2GB): `swapon --show`
- [ ] Om swap saknas — skapa:
  ```bash
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  ```
- [ ] `vm.swappiness` är satt lågt (10) för att prioritera RAM:
  ```bash
  echo 'vm.swappiness=10' >> /etc/sysctl.conf
  sysctl -p
  ```
- [ ] RAM-användning monitoreras: `free -h` ska ha headroom
- [ ] OOM-killer har inte slagit till nyligen: `dmesg | grep -i "oom\|killed"`

---

### 9.5 Webhook & Auto-deploy
- [ ] Webhook-server körs på port 9001 via PM2 (`webhook`-processen)
- [ ] `/opt/webhook.js` autentiserar med `X-Deploy-Token`-header
- [ ] `/opt/deploy.sh` innehåller:
  1. `git pull origin main`
  2. `npm install`
  3. `cd apps/backend && npm run build`
  4. `cp .env .medusa/server/.env`
  5. `pm2 restart medusa --update-env`
- [ ] Deploy-token i Nginx-config matchar token i `webhook.js` och GitHub Actions secret
- [ ] GitHub Actions-workflow triggar webhook vid push till `main`
- [ ] Deploy-loggar sparas: kontrollera att `webhook.js` loggar utfall

**Testa deploy manuellt:**
```bash
curl -X POST https://api.techpilots.se/deploy \
  -H "X-Deploy-Token: <din-token>" \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/main"}'
```

---

### 9.6 Brandvägg (Hetzner Firewall)
- [ ] Endast dessa portar är öppna:
  | Port | Protokoll | Syfte |
  |---|---|---|
  | 22 | TCP | SSH |
  | 80 | TCP | HTTP (Nginx → redirect till HTTPS) |
  | 443 | TCP | HTTPS |
- [ ] Port 9000 (Medusa), 9001 (Webhook), 5432 (PostgreSQL) är INTE publikt öppna
- [ ] SSH (port 22) bör begränsas till din IP om möjligt
- [ ] Hetzner Firewall-regler appliceras på servern i Hetzner Cloud Console

---

### 9.7 SSH & Åtkomst
- [ ] SSH-nyckelbaserad inloggning fungerar: `ssh root@api.techpilots.se`
- [ ] Root-lösenord är starkt och sparat säkert (lösenordshanterare)
- [ ] SSH-nyckel för deploy (GitHub → VPS git pull) finns i `/root/.ssh/` och är tillagd på GitHub som Deploy Key
- [ ] `PasswordAuthentication no` i `/etc/ssh/sshd_config` (om du bara använder nycklar)
- [ ] Hetzner Console finns som backup-åtkomst om SSH inte fungerar

**Om SSH går sönder:**
1. Logga in via Hetzner Console (webbläsaren)
2. Återställ root-lösenord i Hetzner Cloud
3. Kolla `/etc/systemd/system/ssh.socket.d/` — ta bort felaktiga override-filer
4. `systemctl daemon-reload && systemctl restart ssh.socket`

---

### 9.8 Disk & Loggar
- [ ] Diskutrymme är tillräckligt: `df -h` — varning vid > 80% användning
- [ ] Loggar roteras automatiskt: `logrotate --debug /etc/logrotate.conf`
- [ ] PM2-loggar rensas: `pm2 flush` vid behov
- [ ] Nginx-loggar roteras via `/etc/logrotate.d/nginx`
- [ ] PostgreSQL WAL-filer växer inte okontrollerat

**Snabbkoll disk:**
```bash
df -h                             # Totalt diskutrymme
du -sh /opt/*                     # Vad tar plats i /opt?
du -sh /var/log/*                 # Loggstorlekar
pm2 logs --lines 0 2>/dev/null | wc -c  # PM2 loggstorlek
```

---

### 9.9 Återbyggnad från scratch (Disaster Recovery)
Om VPS:en behöver byggas om helt:

```bash
# 1. Installera Node.js (LTS)
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt-get install -y nodejs

# 2. Installera PM2
npm install -g pm2

# 3. Installera PostgreSQL
apt install postgresql postgresql-contrib

# 4. Installera Nginx
apt install nginx

# 5. Klona backend
cd /opt
git clone git@github.com:Nedissa/Techpilots-Backend.git
cd Techpilots-Backend
npm install
cp .env.example .env   # Fyll i riktiga värden!

# 6. Bygg Medusa
cd apps/backend
npm run build
cp .env .medusa/server/.env

# 7. Starta PM2
pm2 start .medusa/server/main.js --name medusa
pm2 start /opt/webhook.js --name webhook
pm2 startup
pm2 save

# 8. Konfigurera Nginx
cp /opt/medusa-nginx.conf /etc/nginx/sites-available/medusa
ln -s /etc/nginx/sites-available/medusa /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 9. Skapa swap
fallocate -l 2G /swapfile && chmod 600 /swapfile
mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## 10. PAYLOAD CMS (Pilotbloggen)

> Payload CMS körs på `https://cms.techpilots.se` som en separat PM2-process (`payload`) på VPS:en. Frontendens blogg (`/pilotbloggen`) hämtar inlägg via Payload REST API.

### 10.1 Driftstatus
- [ ] Payload-processen körs: `pm2 status` → `payload` ska vara `online`
- [ ] API svarar: `curl https://cms.techpilots.se/api/posts?limit=1` ska ge JSON
- [ ] Admin-panelen är åtkomlig: `https://cms.techpilots.se/admin`
- [ ] Payload-processen startar automatiskt med PM2 startup

**Snabbkoll Payload:**
```bash
pm2 logs payload --lines 50       # Fel i Payload?
curl -s https://cms.techpilots.se/api/posts?limit=1 | head -c 200
```

### 10.2 Koppling till Frontend
- [ ] `PAYLOAD_URL` miljövariabel är satt i Vercel: `https://cms.techpilots.se`
- [ ] Blogg-sidan (`/pilotbloggen`) hämtar inlägg med `revalidate: 60` — cacheas 60 sekunder
- [ ] Enskilda blogginlägg (`/pilotbloggen/[slug]`) hämtas med `revalidate: 60`
- [ ] Om Payload är nere — bloggsidan visar fallback-inlägg (DUMMY_POSTS), kraschar inte
- [ ] Bilder från Payload har korrekt URL — inte `localhost`-adresser

### 10.3 Säkerhet
- [ ] Payload admin-panel kräver inloggning — aldrig publik utan auth
- [ ] Admin-användarens lösenord är starkt och unikt
- [ ] Payload API är skyddat — publika endpoints returnerar bara publicerade inlägg (`_status=published`)
- [ ] Payload körs bakom Nginx — inte direkt exponerat på någon port
- [ ] `PAYLOAD_SECRET` miljövariabel är satt och stark (minst 32 tecken)

### 10.4 Kända begränsningar & förbättringsområden
- [ ] **Dummy-inlägg visas om < 4 riktiga inlägg finns** — `DUMMY_POSTS` i `pilotbloggen/page.tsx` fyller ut till 4 kort. Ta bort dessa när Payload har minst 4 publicerade inlägg.
- [ ] **Ingen paginering** — hämtar max 20 inlägg. Lägg till paginering när bloggen växer.
- [ ] **Ingen sökning** — överväg Payload full-text-sökning via `/api/posts?where[title][contains]=sökterm`
- [ ] **Inga kategorisidor** — `/pilotbloggen?kategori=gaming` filtrerar inte ännu
- [ ] **Rich text renderer** är minimal — stöder inte tabeller, citat-block, kodblock eller bilder i innehållet

### 10.5 Hur man publicerar ett inlägg
1. Gå till `https://cms.techpilots.se/admin`
2. Logga in med admin-kontot
3. Klicka **Posts → Create New**
4. Fyll i titel, slug (URL-vänligt namn), innehåll och hero-bild
5. Sätt status till **Published**
6. Spara — inlägget syns på frontend inom 60 sekunder (cache-revalidation)

### 10.6 Återstart vid problem
```bash
# Starta om Payload
pm2 restart payload

# Kolla om porten är i konflikt
ss -tlnp | grep 3001   # eller vilken port Payload kör på

# Kolla Payload-loggar
pm2 logs payload --lines 100
```

---

## 11. PROJEKT-CLEANUP

### 11.1 Åtgärdat 2026-06-10
- [x] Tog bort `trim-svg/` — oanvänt SVG-verktyg med egna node_modules
- [x] Tog bort `dev.log` och `dev_server.log` — gamla loggfiler
- [x] Tog bort `package-lock.json` i projektroten — ingen package.json där
- [x] Tog bort `CRON_IMAGE_FIX.md` — onödig dokumentation (cron körs på VPS)
- [x] Fixade mock-data i `konto/adresser` — använder nu riktig Medusa API
- [x] Fixade mock-data i `erbjudanden` — hämtar nu riktiga produkter
- [x] Fixade metadata-nyckel i `favorites/route.ts` — `wishlist` istället för `favorites`
- [x] Säkerhetsaudit: HTML-escape i newsletter, tog bort env-läcka i products API
- [x] Tog bort alla `console.error` i produktionskod

### 11.2 MCP-setup 2026-06-10
- [x] Installerade DBHub (PostgreSQL MCP) — Connected
- [x] Installerade GitHub MCP — Connected
- [x] Installerade Brevo MCP — Connected
- [x] Skapade `.mcp.json` i projektroten (ej i git)
- [x] Lade till `.mcp.json` i `.gitignore`

### 11.3 Löpande cleanup — checklista
- [ ] Kör `npx depcheck` i frontend och backend — hitta oanvända npm-paket
- [ ] Kolla `node_modules`-storlek — ta bort dev-dependencies som smugit in i prod
- [ ] Granska alla filer i projektroten — inget ska ligga löst utan att höra dit
- [ ] Loggfiler (`*.log`) ska aldrig committas — verifiera `.gitignore`
- [ ] Gammal kommenterad kod — sök efter `// TODO` och `// FIXME` och åtgärda
- [ ] Oanvända routes och komponenter — sök efter filer som inte importeras

---

## PRIORITERINGSORDNING

| Prioritet | Kategori | Åtgärd |
|---|---|---|
| 🔴 Kritisk | Säkerhet | Hemligheter i git, öppna portar, saknad rate limiting |
| 🔴 Kritisk | Betalning | Stripe webhook-verifiering, prisvalidering server-side |
| 🟡 Viktig | Tillförlitlighet | Backup-strategi, uptime-monitoring, error-tracking |
| 🟡 Viktig | Prestanda | Lighthouse < 90, LCP > 2.5s |
| 🟢 Bra att ha | Kodkvalitet | TypeScript strict, oanvända beroenden |
| 🟢 Bra att ha | SEO | Strukturerad data, Open Graph |
