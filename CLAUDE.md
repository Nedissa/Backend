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
- **slack** — Meddelanden och notifikationer

## Viktiga filer
- `KEYS.md` — var alla nycklar finns
- `AUDIT.md` — felsökning och best practice
- `.mcp.json` — MCP-konfiguration (ej i git)
- `MARKETING.md` — marketing agent för Techpilots Webshop & Studio

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
- `app/components/` — delade komponenter
  - `CompareBar.tsx` — flytande jämförelsebar + modal (komplex, hanterar mobil/desktop separat)
  - `CompareContext.tsx` — global state för jämförelselista (localStorage + custom events)
  - `ProductCard.tsx` — produktkort används överallt, lyssnar på `toggleCompare`/`clearCompare` events
- `app/produkter/[handle]/` — produktdetaljsida
- `app/produktserier/[slug]/[handle]/` — produktseriesida

### Kommunikationsmönster
Komponenter kommunicerar via `window.dispatchEvent(new CustomEvent(...))` istället för props:
- `toggleCompare` — lägg till/ta bort produkt från jämförelse
- `clearCompare` — nollställ jämförelselistan
- `addToCart` — lägg till i varukorg

### Frontend är ett Git-submodul
`Frontend/` är ett submodul till huvud-repot. Committa och pusha **inuti** `Frontend/` först, sedan uppdatera submodul-pekaren i huvud-repot.
