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

Tre nivåer istället för ett enda fast värde, styrda av två nya Tailwind-breakpoints (`hd`, `qhd`) utöver (inte i stället för) standardskalan:

| Skärmbredd (min-width) | Container max-width | Täcker (StatCounter Sverige, juli 2026) |
|---|---|---|
| 1024px (bas) | 960px | 1280×720, 1366×768, 1536×864 — äldre/budget-laptops, ~21% av all trafik |
| 1920px (`hd`) | 1080px | 1920×1080 — vanligaste upplösningen, 11,3% av all trafik |
| 2560px (`qhd`) | 1600px | 2560×1440 — 2,6% av all trafik |

Beslutshistorik:
- Ursprungligt värde (innan detta arbete): 1280px för alla skärmar. Kändes för smalt/glest på QHD.
- HD-värdet testades i flera steg (1280 → 1200 → 1140 → 1080px) innan 1080px bedömdes rätt på en faktisk Full HD-skärm.
- QHD-värdet startade på 1440px (Elgigantens motsvarande container) men bedömdes för smalt på en faktisk QHD-skärm och justerades upp till 1600px.
- Den tredje nivån (960px, <1920px) lades till efter att StatCounter-data visade att 1366×768 och 1280×720 tillsammans utgör en större andel av all trafik (~11%) än QHD (2,6%) — dessa delade tidigare HD:s 1080px-värde med onödigt smal marginal. 1536×864 inkluderas i samma nivå trots att det oftast är en Windows-skalad 1920×1080-panel (125% skalning), inte en fysiskt smalare skärm — men webbläsaren rapporterar det skalade CSS-pixelvärdet, så samma container-regel gäller ändå.

**Implementationsdetalj:** löst med en global CSS custom property (`--content-max-width`, satt i `app/layout.tsx`) som växlar värde vid `@media (min-width: 1920px)` och `@media (min-width: 2560px)`, snarare än enbart Tailwinds `hd:`/`qhd:`-breakpoint-prefix. Detta eftersom flera av de 15 ställena satte bredden via inline `style={{ maxWidth }}` (inklusive ett `calc()`-uttryck i `Aside.tsx`) som inte kan uttrycka Tailwind-varianter. Tailwind-klass-baserade ställen använder `max-w-[960px] hd:max-w-[1080px] qhd:max-w-[1600px]` (kräver `hd: '1920px'` och `qhd: '2560px'` i `tailwind.config.ts` `theme.extend.screens`), inline-style-baserade ställen använder klasserna `.ml-container`/`.content-container` eller `var(--content-max-width)` direkt.

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

Genomfört: `getComputedStyle` bekräftar att `--content-max-width` korrekt rapporterar `960px` vid nuvarande testviewport (1024–1919px-intervallet), och att alla mätbara container-element matchar detta värde. CSS-koden för både `@media (min-width: 1920px)`- och `@media (min-width: 2560px)`-reglerna är verifierad korrekt renderad i DOM via läsning av den faktiska `<style>`-taggen. HD-läget (1080px) verifierades tidigare i samma session direkt i browser. QHD-läget (1600px) kunde inte verifieras visuellt i en riktig 2560px-bred vy i den här sessionen (verktygets webbläsarfönster begränsades till värdens faktiska skärmstorlek) — kvarstår att bekräfta visuellt på en riktig QHD-skärm eller via en bredare extern monitor.
