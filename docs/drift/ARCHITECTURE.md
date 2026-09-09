# Techpilots System Architecture & Project Structure

Denna fil definierar den tekniska arkitekturen och mappstrukturen för Techpilots-applikationen (Next.js App Router, TypeScript, Tailwind CSS, Framer Motion).

Strukturen nedan speglar koden som faktiskt finns i repot, inte en målbild — uppdatera denna fil när strukturen ändras i verkligheten.

---

## 1. Repo-struktur (monorepo, två submoduler)

```text
techpilots/                       # Huvudrepo (Backend, git-host för submoduler)
├── Frontend/                     # Git-submodul — Next.js-appen (eget repo, egen historik)
│   └── apps/frontend/            # Faktisk Next.js-app
├── Backend/                      # Medusa v2.14 (backend/API), körs på Hetzner VPS
├── docs/                         # KEYS, AUDIT, GLOSSARY, ROADMAP, BOKFÖRING, MARKETING
├── infra/                        # Serverkonfiguration (medusa-nginx.conf, email-preview.html)
├── CLAUDE.md                     # Design- & kodregler för Claude AI
└── ARCHITECTURE.md               # Denna fil
```

`Frontend/` är ett git-submodul. Ändringar committas och pushas **inuti** `Frontend/` först, sedan uppdateras submodul-pekaren i huvudrepot separat.

---

## 2. Mappstruktur — `Frontend/apps/frontend/` (Next.js App Router)

```text
apps/frontend/
├── app/                         # App Router — sidor ligger direkt under app/, ingen (site)-route group
│   ├── page.tsx                 # Startsidan
│   ├── layout.tsx               # Root layout (Header, Footer, providers)
│   ├── layout-metadata.ts       # Delad metadata för root layout
│   ├── globals.css              # Tailwind-import, CSS-variabler, global reset
│   ├── sitemap.ts                # Dynamisk sitemap-generering för SEO
│   ├── error.tsx / not-found.tsx
│   │
│   ├── produkter/[handle]/       # Produktdetaljsida
│   ├── produktserier/[slug]/     # Produktseriesida
│   ├── kategori/[slug]/          # Kategorisida
│   ├── kassa/                    # Checkout-flöde
│   ├── varukorg/[id]/            # Varukorg
│   ├── konto/                    # Mina sidor (account-context.tsx för klient-state)
│   ├── inlogg/ · aterstall-losenord/
│   ├── kundservice/              # Accordion-baserad kundservicesida (villkor, retur, FAQ)
│   ├── tjanster/                 # Tjänstesidor (webbutveckling/e-handel/VPS) — eget subsystem,
│   │                             #   se app/tjanster/CLAUDE.md-relevanta noteringar nedan
│   ├── pilotbloggen/[slug]/      # Blogg
│   ├── erbjudanden/ · design/    # Kampanj-/designsidor
│   ├── cookiepolicy/ · integritetspolicy/
│   ├── order-bekraftelse/
│   ├── hooks/                    # Delade React-hooks
│   └── api/                      # Route handlers (webhooks, formulärmottagning, integrationer)
│
├── app/components/                # Delade komponenter, grupperade efter ANSVAR (inte atomär UI-nivå)
│   ├── Header/                   # menuData, MobileHeader, MobileMenu, DesktopHeader, MegaMenu, index
│   ├── layout/                   # RootLayoutClient, FooterWrapper, MainLayout m.fl.
│   ├── product/                  # ProductCard, CompareBar, CompareContext (localStorage + events)
│   ├── cart/                     # Varukorgskomponenter
│   ├── checkout/                 # Kassa-komponenter
│   ├── auth/                     # Inlogg/konto-komponenter
│   ├── home/                     # Startsidespecifika sektioner
│   ├── shared/                   # Generiska, återanvändningsbara komponenter
│   └── CookieBanner.tsx
│
├── app/tjanster/components/       # Sektionskomponenter EGET till /tjanster (ej delade globalt)
│   ├── HeroSection, StatsSection, AwardsSection, CustomersSection, PricingSection,
│   │   FeaturesSection, ProjectsSection, ProcessStatsSection, PlatformsSection,
│   │   FaqSection, CtaSection, Footer, SiteNav
│   ├── ServiceSection.tsx        # Delad shell-wrapper för alla /tjanster-sektioner
│   ├── SectionHeader.tsx         # Sektionsnumrering + dold h2 för a11y/SEO
│   ├── StructuredData.tsx        # JSON-LD (Service + FAQPage), datan hämtas från pricing-data.ts/faq-data.ts
│   ├── DonutChart, AnimatedBars, AnimatedDots, CountUp, FadeIn
│   └── useScrollActiveIndex.ts   # Delad hook: mobil scroll-driven "aktiv"-state
│
├── app/lib/                       # Verktygsfunktioner, klienter, statisk data
│   ├── medusa-client.ts / medusa.ts   # Medusa API-klient
│   ├── mailer.ts                 # E-postutskick (Brevo)
│   ├── menu-data.ts              # Navigationsstruktur
│   └── products.ts               # Produktrelaterad datalogik
│
├── public/                       # Statiska tillgångar (bilder, ikoner, faviconer)
├── middleware.ts                 # Next.js middleware (routing/redirects)
├── next.config.mjs               # Headers, redirects, bildoptimering, optimizePackageImports
├── tailwind.config.ts
└── package.json
```

**Avvikelser från en "standard" Next.js-mall värda att notera:**
- Ingen `app/(site)/`-route group — sidor ligger platt direkt under `app/`.
- Ingen dedikerad `types/`-mapp på toppnivå — typer definieras lokalt i respektive fil/komponent.
- Ingen `app/actions/`-mapp för Server Actions — formulärhantering sker via `app/api/`-route handlers.
- Komponenter grupperas efter **affärsansvar** (`product/`, `cart/`, `checkout/`) snarare än efter abstraktionsnivå (`ui/` vs `sections/`).
- `/tjanster` har ett eget, isolerat komponentbibliotek (`app/tjanster/components/`) separat från de globala `app/components/` — sidan är ett tidigare fristående subsystem ("webbstudio") som flyttades in i webbshopens route-struktur.

---

## 3. Kommunikationsmönster

Komponenter kommunicerar via `window.dispatchEvent(new CustomEvent(...))` istället för prop-drilling eller global state-hantering:
- `toggleCompare` — lägg till/ta bort produkt från jämförelse
- `clearCompare` — nollställ jämförelselistan
- `addToCart` — lägg till i varukorg

`CompareContext.tsx` håller jämförelselistans state i `localStorage` + samma event-mönster.

---

## 4. Backend & driftsättning

- **Backend:** Medusa v2.14, körs på Hetzner VPS (`api.techpilots.se`), path `/opt/medusa-backend/` på servern.
- **CMS:** Payload CMS (`cms.techpilots.se`).
- **E-post:** Brevo.
- **Betalningar:** Stripe.
- **Frontend-deploy:** Vercel, automatisk vid push till `Frontend/`-submodulens `main`.
- **Backend-deploy:** Webhook vid push till huvudrepots `main`.

Se `CLAUDE.md` för kommandon, SSH-uppgifter och kredit-/tokenhanteringsregler.
