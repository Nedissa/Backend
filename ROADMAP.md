# Techpilots — Roadmap

> Uppdaterad: 2026-07-31

---

## STATUS: Pre-launch

---

## FAS 1 — Launch-ready (Nu → Launch)

### Produkt & Checkout
- [ ] Fler produkter i Medusa (sortiment)
- [ ] Produktsidor — bilder, beskrivningar, specifikationer
- [ ] Checkout-flödet testat end-to-end (Stripe live-läge)
- [ ] Orderbekräftelse-mail fungerar (Brevo)
- [ ] Fraktpriser konfigurerade i Medusa
- [ ] Returpolicy-sida

### Konto & Kundklubb
- [x] Orderhistorik
- [x] Favoriter
- [x] Kundklubb — nivåer & förmåner
- [x] Reklamation
- [ ] Poäng tjänas faktiskt vid köp (backend-logik)
- [ ] Profilredigering sparar till Medusa

### UX & Design
- [x] Header responsiv (mobil/desktop)
- [x] Banner (Mina sidor)
- [x] CartAside
- [ ] 404-sida
- [ ] Tom varukorg-vy
- [ ] Laddningstillstånd på alla tunga sidor
- [ ] Felhantering synlig för kund (toast/alerts)

### SEO & Prestanda
- [ ] Meta-titlar och beskrivningar på alla sidor
- [ ] `sitemap.xml` genereras automatiskt
- [ ] `robots.txt` konfigurerad
- [ ] Lighthouse-score ≥ 90
- [ ] Produktbilder optimerade (WebP, rätt storlek)

### Säkerhet
- [x] HTTPS-redirect (nginx)
- [x] .gitignore täcker .env-varianter
- [ ] Rate limiting på checkout/auth-endpoints
- [ ] CORS begränsat till egna domäner
- [ ] SSL-certifikat autoförnyelse verifierad

---

## FAS 2 — Post-launch (Månad 1–3)

### Försäljning & Marketing
- [ ] Nyhetsbrev-signup + välkomstmail (Brevo)
- [ ] Första email-kampanj
- [ ] Instagram + TikTok-konton aktiva
- [ ] Google Analytics / Plausible uppsatt
- [ ] Meta Pixel installerat

### Kundklubb (backend)
- [ ] Poäng-logik kopplad till riktiga köp
- [ ] Automatisk nivåuppgradering
- [ ] Förmåner faktiskt aktiverade per nivå (fri frakt etc.)

### Sortiment
- [ ] Itegra-sortiment integrerat (se project_itegra_sortiment)
- [ ] Kategorisidor fyllda med produkter
- [ ] Sökning fungerar korrekt

### Tekniskt
- [ ] Payload CMS aktivt för innehållshantering
- [ ] Backup-rutin för PostgreSQL
- [ ] Monitoring/alerting på VPS (uptime, disk, CPU)

---

## FAS 3 — Tillväxt (Månad 3–6)

- [ ] Techpilots Studio — landingpage live
- [ ] Betald annonsering (Meta Ads, Google Ads)
- [ ] Affiliate/influencer-program
- [ ] Recensioner på produktsidor
- [ ] Fler betalningsmetoder (Klarna, Swish)
- [ ] Lagerhantering i Medusa

---

## Blockers just nu

| Problem | Prioritet |
|---|---|
| Poäng-logik ej kopplad till köp | Hög |
| Stripe live-läge ej testat | Hög |
| Ordermail-flödet ej verifierat | Hög |
| Produktsortiment för litet | Medel |
