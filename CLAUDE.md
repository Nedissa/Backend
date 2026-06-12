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
- Pusha alltid till GitHub efter varje kodändring
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
