# HD/QHD-anpassad content-container — Design

Datum: 2026-08-09

## Problem

Webbshoppens content-container (den centrerade `max-width`-diven som begränsar innehållets bredd inuti header, hero, footer, produktsida, breadcrumb, jämförelsemodal, blogg och erbjudandesida) har idag ett enda fast pixelvärde oavsett skärmstorlek.

- Ursprungligt värde: 1280px (Tailwind `max-w-7xl` samt hårdkodat på flera ställen)
- På en QHD-skärm (2560px bred) uppfattades detta som för smalt/glest — jämförbart med Clas Ohlsons webbshop
- Ett provisoriskt test med 1600px uppfattades som för brett på en Full HD-skärm (1920px) — tog nästan hela skärmbredden
- Ett mellanläge på 1400px uppfattades fortsatt som för brett på HD

Slutsats: ett enda gemensamt värde kan inte tillfredsställa både HD och QHD samtidigt. Lösningen kräver två separata värden, valda per skärmstorlek.

## Lösning

Två nya Tailwind-breakpoints läggs till, utöver (inte i stället för) standardskalan:

| Skärmbredd (min-width) | Container max-width |
|---|---|
| < 2560px (inkl. HD/1920px) | 1080px |
| ≥ 2560px (QHD) | 1600px |

HD-värdet justerades under implementation i flera steg (1280 → 1200 → 1140 → 1080px) efter visuell bedömning direkt på en faktisk Full HD-skärm; varje mellansteg bedömdes fortfarande för brett. QHD-värdet startade på 1440px (Elgigantens motsvarande container) men bedömdes för smalt på en faktisk QHD-skärm och justerades upp till 1600px.

**Implementationsdetalj:** löst med en global CSS custom property (`--content-max-width`, satt i `app/layout.tsx`) som växlar värde vid `@media (min-width: 2560px)`, snarare än Tailwinds `hd:`/`qhd:`-breakpoint-prefix. Detta eftersom flera av de 15 ställena satte bredden via inline `style={{ maxWidth }}` (inklusive ett `calc()`-uttryck i `Aside.tsx`) som inte kan uttrycka Tailwind-varianter. Tailwind-klass-baserade ställen använder `qhd:max-w-[1440px]` (kräver ändå `qhd: '2560px'` i `tailwind.config.ts` `theme.extend.screens`), inline-style-baserade ställen använder klasserna `.ml-container`/`.content-container` eller `var(--content-max-width)` direkt.

## Scope

**Ändras:** Endast de 15 kända content-container-förekomsterna:

- `app/layout.tsx` (global `.ml-container`-regel)
- `app/components/layout/MainLayout.tsx`
- `app/components/Header/DesktopHeader.tsx`
- `app/components/Header/MegaMenu.tsx` (2 ställen: nav-rad + dropdown-panel)
- `app/components/home/HeroBanner.tsx`
- `app/components/layout/Breadcrumb.tsx`
- `app/components/layout/FooterWrapper.tsx`
- `app/components/product/CompareBar.tsx` (2 ställen)
- `app/components/shared/Aside.tsx` (positioneringsberäkning för cart/login-panel)
- `app/erbjudanden/[slug]/page.tsx`
- `app/pilotbloggen/page.tsx`
- `app/pilotbloggen/[slug]/page.tsx`
- `app/produktserier/[slug]/[handle]/ProductDetailClient.tsx` (4 ställen)

**Rörs inte:** Webbstudio-sidorna (9 ställen, separat produkt, behåller sitt fasta 1440px enligt tidigare beslut i samma session). Projektets 147 befintliga användningar av standardbreakpoints (`sm/md/lg/xl/2xl`) i övriga 31 filer — dessa styr mobilmeny, grid-kolumner och textstorlekar och påverkas inte av detta arbete.

## Teknisk implementation

1. **`tailwind.config.ts`**: lägg till `hd: '1920px'` och `qhd: '2560px'` under `theme.extend.screens`. Tailwind slår ihop `extend.screens` med standardskalan — `sm/md/lg/xl/2xl` förblir orörda.
2. **Tailwind-klass-baserade ställen** (de flesta): byt `max-w-[1280px]` (eller nuvarande 1400px-rest) mot `max-w-[1280px] qhd:max-w-[1440px]`. Ingen explicit `hd:`-klass behövs eftersom HD-värdet är detsamma som basvärdet.
3. **Inline-style-baserade ställen** (`DesktopHeader.tsx`, `pilotbloggen/*.tsx`, `CompareBar.tsx`, `Aside.tsx`): dessa använder `style={{ maxWidth: '...' }}` och kan inte använda Tailwinds `qhd:`-prefix direkt. Lösning: byt till en delad CSS-klass (t.ex. `.content-container` definierad en gång i global CSS med en `@media (min-width: 2560px)`-regel), eller konvertera dessa ställen till Tailwind-klasser för konsekvens. Väljs vid implementation baserat på minsta ändring per fil.
4. **`Aside.tsx`**: `right: 'max(0px, calc((100vw - 1280px) / 2))'` uppdateras till att spegla samma breakpoint-logik (kräver en `@media`-variant snarare än en Tailwind-klass, eftersom uttrycket ligger i en JS-beräknad style-sträng).

## Verifiering

Genomfört: `getComputedStyle` bekräftar att alla 5 mätbara container-element (header, hero, footer, m.fl.) rapporterar `1080px` max-width vid skärmbredd < 2560px. CSS-koden för `@media (min-width: 2560px)`-regeln är verifierad korrekt renderad i DOM via läsning av den faktiska `<style>`-taggen. QHD-läget (1440px) kunde inte verifieras visuellt i en riktig 2560px-bred vy i den här sessionen (verktygets webbläsarfönster begränsades till värdens faktiska skärmstorlek) — kvarstår att bekräfta visuellt på en riktig QHD-skärm eller via en bredare extern monitor.
