# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Techpilots Webshop — Claude instruktioner

## Projekt
E-handelsplattform för teknikprodukter.
- **Frontend:** Next.js 16, React 19, TypeScript 5 — Vercel
- **Backend:** Medusa v2.14 — Hetzner VPS (api.techpilots.se)
- **CMS:** Payload CMS (cms.techpilots.se)
- **Email:** Brevo
- **Betalningar:** Stripe

## Regler
- Svara alltid på svenska
- Kort och vertikalt — ingen klumpig text
- Pusha till GitHub ENDAST när användaren explicit säger "pusha"
- Lägg aldrig till CSS/styling utan explicit godkännande
- Kör npm update efter npm install

## Deploy
- Frontend → Vercel (automatisk via GitHub push)
- Backend → VPS via webhook (GitHub push till main)
- SSH: `ssh -i C:/Users/nedal/.ssh/techpilots root@95.217.163.97`
- Backend path på VPS: `/opt/medusa-backend/`

## MCP-servrar
- **dbhub** — SQL mot Medusa PostgreSQL-databasen
- **github** — GitHub issues, PRs, commits
- **brevo** — Email-kampanjer, kontakter, analytics

Avaktiverade (drog tokens utan att användas): chrome-devtools, fetch (borttagna ur `.mcp.json`), Slack, Google Drive (disabled på kontonivå).

## Kredit-/tokenhantering
- Var sparsam med underagenter (Agent-tool) — starta bara vid uppgifter som verkligen kräver bred sökning eller isolerad granskning
- Håll konversationer korta och avgränsade per uppgift. Använd `/compact` när en lång session måste fortsätta, `/clear` eller ny session vid ny uppgift
- Föreslå `claude-md-management:revise-claude-md` efter större arbetssessioner (ny funktion, arkitekturbeslut) innan sessionen stängs, så beslut hamnar här istället för att försvinna med tråden
- Kontrollera `/mcp` då och då för nya inaktiva/oanvända MCP-servrar som laddas i onödan

## Viktiga filer
- `docs/KEYS.md` — var alla nycklar finns
- `docs/AUDIT.md` — felsökning och best practice
- `.mcp.json` — MCP-konfiguration (ej i git)
- `docs/MARKETING.md` — marketing agent för Techpilots Webshop & Studio
- `docs/` — övrig dokumentation (GLOSSARY, ITEGRA-PRODUCTS, ROADMAP, BOKFÖRING)
- `infra/` — serverkonfiguration och verktyg (medusa-nginx.conf, email-preview.html)

## Kommandon

### Frontend (`Frontend/apps/frontend/`)
```bash
npm run dev      # Starta dev-server på localhost:3000
npm run build    # Bygg för produktion
npm run lint     # Kör ESLint
```

### Backend (`/opt/medusa-backend/` på VPS)
```bash
ssh -i C:/Users/nedal/.ssh/techpilots root@95.217.163.97
cd /opt/medusa-backend && npm run start
```

## Arkitektur

### Frontend (Next.js 16 App Router)
- `app/` — sidor och layouts (App Router)
- `app/components/` — delade komponenter, grupperade efter ansvar (`product/`, `cart/`, `auth/`, `layout/`, `home/`, `checkout/`, `shared/`, `Header/`)
  - `product/CompareBar.tsx` — flytande jämförelsebar + modal (komplex, hanterar mobil/desktop separat)
  - `product/CompareContext.tsx` — global state för jämförelselista (localStorage + custom events)
  - `product/ProductCard.tsx` — produktkort används överallt, lyssnar på `toggleCompare`/`clearCompare` events
  - `Header/` — uppdelad i menuData, MobileHeader, MobileMenu, DesktopHeader, MegaMenu, index (state)
- `app/produkter/[handle]/` — produktdetaljsida
- `app/produktserier/[slug]/[handle]/` — produktseriesida

### Kommunikationsmönster
Komponenter kommunicerar via `window.dispatchEvent(new CustomEvent(...))` istället för props:
- `toggleCompare` — lägg till/ta bort produkt från jämförelse
- `clearCompare` — nollställ jämförelselistan
- `addToCart` — lägg till i varukorg

### Frontend är ett Git-submodul
`Frontend/` är ett submodul till huvud-repot. Committa och pusha **inuti** `Frontend/` först, sedan uppdatera submodul-pekaren i huvud-repot.

## Juridik & Returpolicy
- Ångerrätt: 14 dagar enligt distansavtalslagen (INTE 30 dagar)
- Itegra är leverantör — nämns aldrig i kundtexter
- Stora varumärken (Asus, HP, Samsung) hanterar reklamationer direkt med kunden
- Returer: kunden bekostas, produkten ska vara i originalskick

## Textregler (hela frontenden)
- Använd aldrig tankstreck (—) i kundsynliga texter. Punkt eller omformulering istället
- Gästkassa ska alltid finnas. Tvinga aldrig konto vid köp

## Sortimentsstrategi (Webshop)
- Fokus: lågretursortiment (kablar, tillbehör, skärmskydd)
- Stora märken med direktservice = kunden kontaktar tillverkaren
- Fri frakt över 499 kr, 49 kr under
- Dropshipping via Itegra (Komplett Distribution Sweden AB)
