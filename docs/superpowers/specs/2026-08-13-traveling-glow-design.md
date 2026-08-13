# Vandrande skugga bakom projekt-mockups (StyledTimeline)

## Bakgrund

`StyledTimeline` ([Frontend/apps/frontend/app/tjanster/components/styled/StyledTimeline.tsx](../../../Frontend/apps/frontend/app/tjanster/components/styled/StyledTimeline.tsx)) renderar ett projekts `steps` som en vertikal zigzag-kedja av mockup-bilder, växlande vänster/höger. Varje mockup har idag sin egen statiska `<GlowBackground />` bakom sig.

Önskemål: en enda "magisk" färgad skugga som glider mellan mockuparnas positioner när användaren scrollar, istället för separata statiska glows. Skuggan byter färg mellan varje mockups accentfärg när den flyttar sig, och följer position i både sidled och höjdled (matchar zigzag-layouten).

## Omfattning

Gäller endast `StyledTimeline` (projektsidans "Processen"-sektion). `StyledHero` och `StyledBenefitScroll` behåller sina befintliga `GlowBackground`-anrop oförändrade.

## Datamodell

`ProjectStep` ([projekt-data.ts](../../../Frontend/apps/frontend/app/tjanster/projekt-data.ts)) får ett nytt valfritt fält:

```ts
export type ProjectStep = {
  title: string;
  description: string;
  image?: string;
  bullets?: string[];
  accentColor?: string; // nytt
};
```

Färgprioritet per steg: `step.accentColor` → `project.accentColor` → `'#E8C547'` (befintlig default).

## Komponent: `TravelingGlow`

Ny komponent i `StyledPrimitives.tsx` (eller egen fil `TravelingGlow.tsx` om den växer för mycket för primitives-filen).

**Props:**
```ts
{
  activeRect: { top: number; left: number; width: number; height: number } | null; // relativt timeline-containern
  color: string;
}
```

**Rendering:**
- En `motion.div` med samma radial-gradient-uppbyggnad som dagens `GlowBackground` (strong-varianten), positionerad `absolute` i en container som omsluter hela `steps`-listan.
- Storlek/spridning matchar dagens `-inset-56` relativt en `w-[300px] h-[420px]`-mockup-yta (samma dimensioner som mockup-bilderna i timelinen idag).
- Position animeras via `animate={{ top: activeRect.top, left: activeRect.left }}` med `transition={{ type: 'spring', stiffness: 120, damping: 20 }}`.
- Färg animeras separat: bakgrundsfärgen interpoleras genom att hålla två överlagrade gradient-lager (förra och nya färgen) och crossfada mellan dem med `opacity` över ~0.6s när `color`-propen ändras (`AnimatePresence` med `key={color}` för de två lagren, enklare än att interpolera hex-värden direkt).
- `pointer-events-none`, ligger under mockup-bilderna i z-ordning (som idag).

## Positionsspårning i `StyledTimeline`

- Timeline-listan (`steps.map(...)`) wrappas i en positionerad container (`relative`) som redan finns (`<div className="relative w-full mx-auto">`).
- Varje steg med bild får en `ref` kopplad till ett gemensamt state-objekt (array av `RefObject`).
- En `IntersectionObserver` med `threshold` runt `[0, 0.5, 1]` (eller flera trösklar) observerar alla mockup-element. På `entries`-callback: hitta det entry med högst `intersectionRatio` och sätt `activeIndex` till dess index, men bara om `intersectionRatio > 0.5` för att undvika flimmer mellan två nästan lika synliga steg.
- När `activeIndex` ändras, mät `getBoundingClientRect()` för det aktiva mockup-elementet och för timeline-containern, räkna ut `activeRect` relativt containern, och skicka till `TravelingGlow` som props.
- Mätningen görs i en `useEffect` som körs vid `activeIndex`-ändring (inte per scroll-event) — undviker layout-thrashing.
- Lyssna på `resize` (debounced) för att räkna om `activeRect` om layouten ändras (t.ex. rotation på mobil).

**Initialt state:** `activeIndex = 0`, `activeRect` sätts efter mount via samma mätlogik (`useEffect` med tom dependency-array plus en `ResizeObserver`/`window resize`-lyssnare).

## Mobil / fallback

- Ingen speciallogik behövs: på mobil blir layouten redan en kolumn (Tailwind `md:` bryts bort), så zigzag-positionerna kollapsar naturligt till vertikal rörelse — samma `IntersectionObserver`-mätning fungerar oförändrat.
- Om ett `steps`-item saknar `image`, exkluderas det ur ref-listan och `IntersectionObserver`-uppsättningen (matchar redan att `GlowBackground`/bilden villkorligt renderas idag).
- Om projektet har färre än 2 steg med bild, eller inga alls, renderas ingen `TravelingGlow` (samma nollresultat som idag där ingen glow syns om ingen bild finns).

## Borttaget

- De individuella `<GlowBackground />`-anropen i `StyledTimeline.tsx` (rad 51 och 84) tas bort, ersätts av den enda `TravelingGlow`.
- `GlowBackground` i `StyledPrimitives.tsx` lämnas orörd i övrigt — används fortfarande av `StyledHero` och `StyledBenefitScroll`.

## Testplan

1. `npx tsc --noEmit` — inga typfel.
2. Manuell verifiering i browser (chrome-devtools MCP) på `/tjanster/projekt/crownmatch`:
   - Scrolla genom timeline-sektionen, verifiera att skuggan flyttar position mellan varje mockup (mät `top`/`left` för `TravelingGlow`-elementet vid olika scrollpositioner).
   - Verifiera färgövergång mellan steg med olika `accentColor` (sätt test-värden om steg saknar egna).
   - Testa på mobil viewport (emulate) att layouten inte bryts.
   - Kontrollera konsolen för fel/varningar.
