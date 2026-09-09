# Projektdetaljsida — Relume-wireframe redesign

**Datum:** 2026-08-10
**Sida:** `Frontend/apps/frontend/app/tjanster/projekt/[slug]/page.tsx`
**Status:** Godkänd design, redo för implementationsplan

## Bakgrund

Nuvarande projektdetaljsida (t.ex. `/tjanster/projekt/sagateatern`) är byggd med Techpilots visuella identitet direkt (italic-typsnitt, gula stjärnor, gradient-placeholders, `ServicesAccordion`). Den ska byggas om i två steg:

1. **Detta steg:** Relume neutral-style wireframe — validera layout och informationsarkitektur i gråskala, utan färg/motion.
2. **Nästa steg (separat, ej del av denna spec):** Färgsätt och applicera Techpilots UX-UI.md-designsystem (16-punkters audit) ovanpå den validerade strukturen.

Relume Wireframing Protocol är nu dokumenterat i `docs/UX-UI.md` (avsnitt 5) och styr denna leverans.

## Omfattning

Endast `app/tjanster/projekt/[slug]/page.tsx` och ev. nya delade wireframe-komponenter under `app/tjanster/components/`. Ingen ny listningssida på `/tjanster/projekt/` (finns inte idag, inte del av denna uppgift). `projekt-data.ts` utökas INTE med nya fält i detta steg — metrics-sektionen använder platshållarsiffror i wireframen.

`ServicesAccordion`, `ProjectMockups`, tech-icon-mappningen (`react-icons/si`) och marquee-tickern i nuvarande sidan ersätts i wireframen av neutrala Relume-block; de återinförs eventuellt i färgsättningssteget.

## Informationsarkitektur (godkänd: Approach A — Case study, story-driven)

Nio sektioner i linjär scroll-ordning, alla `py-16 md:py-24 lg:py-32`, `max-w-[1440px] mx-auto px-12`-innehållscontainer (befintligt mönster, se `Frontend/apps/frontend/CLAUDE.md`):

1. **Hero** — Eyebrow ("Projektöversikt · {category}") → H1 ({title} — {year}) → brödtext max 60ch ({challenge} eller fallback till {description} trunkerad) → CTA-grupp (Primary "Besök live-sida ↗" villkorat på `project.website`, Secondary "Se alla projekt") → `aspect-video` bild-placeholder.
2. **Metrics** — 3-4 sifferblock i grid (`grid-cols-2 md:grid-cols-4`), platshållarvärden (`[XX] veckor`, `[XX] sidor`, `[XX]% snabbare`, `[XX] integrationer`) med etikett under varje. Data är hårdkodade placeholders i denna wireframe, inte kopplade till `projekt-data.ts`.
3. **Utmaningen** — 2-kol, bild vänster / text höger (`grid-cols-1 md:grid-cols-2 gap-12 items-center`). Text = `project.challenge`.
4. **Lösningen** — samma 2-kol-mönster, spegelvänd (bild höger). Text = `project.solution`.
5. **Resultatet** — samma 2-kol-mönster, bild vänster. Text = `project.result`.
6. **Tech-stack** — rubrik "Verktyg & plattform" + rad neutrala pills från `project.technologies` (textlabels, inga ikoner i wireframe-läget).
7. **Bildgalleri** — bento-grid: 1 stor placeholder + 2-3 mindre, labels genererade från `project.steps[].title` om fältet finns, annars generiska ("[Skrivbordsvy]", "[Mobilvy]").
8. **Kundcitat** — fristående centrerad sektion. Citattext = `project.solution` (återanvänds, inget nytt datafält). Platshållare för kundnamn/roll under citatet.
9. **CTA + Nav** — konverteringssektion ("Vill du ha samma resultat? [Boka möte]", länk till `/tjanster/kontakt`) + föregående/nästa-projekt-länkar (samma `prevProject`/`nextProject`-logik som idag).

## Villkorad rendering

- Sektion "Tech-stack" (6) döljs helt om `project.technologies` saknas eller är tom — samma mönster som nuvarande kod.
- Hero CTA "Besök live-sida" visas bara om `project.website` finns.
- Sektion "Bildgalleri" (7) renderas alltid; använder generiska labels om `project.steps` saknas.

## Visuell stil (Relume neutral)

- Bakgrund: `bg-neutral-50`, kort/paneler `bg-neutral-100`.
- Text: `text-neutral-900` rubriker, `text-neutral-600` brödtext.
- Borders: `border-neutral-200`.
- Bild-placeholders: `bg-neutral-200 rounded-lg flex items-center justify-center text-neutral-500 font-mono text-sm` med explicit aspect-ratio och beskrivande text i brackets, t.ex. `[Hero Product Showcase - 16:9]`.
- Ingen `italic`-font, ingen gul stjärn-rating, inga gradients, ingen Framer Motion i detta steg.
- Knappar: enkla neutrala rektanglar/pills utan skugga, tydlig men gråskale-affordance.

## Komponenter

Ny fil `app/tjanster/components/wireframe/ProjectDetailWireframe.tsx` (eller motsvarande uppdelning) med mindre presentationskomponenter per sektionstyp (t.ex. `MetricsBlock`, `AlternatingSection`, `BentoGallery`) — följer projektets mönster att bryta ned i återanvändbara delar snarare än en monolitisk fil. Exakt filuppdelning avgörs i implementationsplanen.

`ProjectNav` (befintlig header/nav-komponent) återanvänds oförändrad.

## Testning / verifiering

Ingen automatiserad testsvit för denna route sedan tidigare. Verifiering sker visuellt: `npm run dev`, besök `/tjanster/projekt/sagateatern` (och minst ett projekt utan `website`/`technologies` för att kontrollera villkorad rendering), jämför mot denna spec.

## Explicit utanför scope

- Ingen ny listningssida på `/tjanster/projekt/`.
- Inga nya fält i `Project`-typen eller `projekt-data.ts`.
- Ingen färgsättning, motion eller Techpilots-branding — det är nästa steg, egen brainstorming-cykel.
- Ingen ändring av `ProjectsSection.tsx` (den inbäddade projektlistan på `/tjanster`).
