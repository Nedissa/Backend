# Core Web Vitals-optimering — Techpilots spelbok

Återanvändbar process för att ta en Next.js-sajt (eller motsvarande) från medioker till 90+ i PageSpeed Insights, byggd på samtliga verkliga fynd och fixar som gjorts i detta projekt, plus generisk branschteori. Målet: kunna leverera detta som en avgränsad, säljbar tjänst per kund utan att börja om från noll varje gång.

Verkligt resultat i detta projekt: startsidan gick från **73 → 97** (mobil, PageSpeed Insights) under en enda arbetssession, via två fixar (bild-`sizes` + borttagen kontinuerlig hero-animation). Övriga fixar nedan är från projektets tidigare arbete och höjde andra sidor (`/digital`, projektsidor, produktkort) på samma sätt.

---

## Del 1: Generisk teori

### Vad Core Web Vitals faktiskt mäter

| Mätvärde | Vad det mäter | Vad som förstör det |
|---|---|---|
| **LCP** (Largest Contentful Paint) | Tid tills det största synliga elementet (oftast en bild eller rubrik) är färdigmålat | Överdimensionerade bilder, render-blockerande CSS/fonts, sen serverrespons, tredjepartsskript som konkurrerar om bandbredd |
| **CLS** (Cumulative Layout Shift) | Hur mycket innehåll "hoppar" under laddning | Bilder utan `width`/`height`, innehåll som skjuts in efter att sidan redan renderats (banners, cookie-notiser, annonser) |
| **TBT** (Total Blocking Time) / **INP** | Hur länge huvudtråden är upptagen och inte kan svara på interaktion | Tung JavaScript-exekvering vid sidladdning, kontinuerliga animationsloopar, stora komponentträd som monteras i onödan |
| **FCP** (First Contentful Paint) | Tid tills *något* syns överhuvudtaget | Render-blockerande resurser i `<head>` (externa fonts, synkron CSS/JS) |

Poängen (0-100) räknas fram som ett viktat snitt av dessa, inte ett enkelt medelvärde — LCP och TBT/INP väger tyngst.

### Varför mobil alltid ger lägre poäng än desktop

PageSpeed Insights kör mobil-testet med **simulerad svag hårdvara** (Moto G Power, ca 4x nedsaktad CPU) och **simulerad långsam 4G**, medan desktop-testet körs obegränsat. Samma kod, samma bilder — bara olika, avsiktligt pessimistiska testförutsättningar. En sajt med 97 desktop / 73 mobil har **inte** dubbelt så dålig verklig mobilupplevelse; skillnaden är till stor del testmetodik. Förklara alltid detta för kund innan ni visar mobilsiffran, annars uppfattas den som ett större problem än den är.

**Verifiera med riktig data om kunden är orolig:** Google Search Console → Core Web Vitals-rapporten, eller Google Analytics, visar faktiska besökares mätvärden — inte simulerade.

### Diminishing returns — vet när ni ska sluta

- 0-49 → 50-89: stora, enkla vinster finns nästan alltid
- 50-89 → 90+: kräver riktade fixar, men fortfarande rimlig insats
- 90-97 → 100: kräver att man jagar millisekunder i saker som knappt märks av riktiga användare. Flagga detta till kund som "diminishing returns" istället för att fortsätta gräva på klientens bekostnad.

Mätningar varierar ±5-10 poäng mellan körningar pga nätverk/servercache/cold start. Kör alltid om 2-3 gånger innan ni drar slutsatser av en enskild siffra.

---

## Del 2: Konkreta fyndkategorier (i prioritetsordning)

### A. Överdimensionerade bilder (högst prioritet, oftast störst enskild vinst)

**Symptom i rapporten:** "Förbättra bildleveransen" / "Den här bildfilen är större än nödvändigt (WxH) för de visade måtten (wxh)".

**Orsak 1 — fel `sizes`-attribut:** `sizes` på `next/image` matchar inte den verkliga renderade bredden i layouten. Vanligast: breakpointen i `sizes` (t.ex. `1024px`) matchar inte CSS-ramverkets faktiska brytpunkt (Tailwinds `md:` = 768px, inte 1024px) — Next.js väljer då en bildvariant baserad på fel antagande om hur bred bilden faktiskt blir.

**Fix:**
1. Hitta komponenten som renderar bilden (sök på alt-texten eller klassnamnet från rapporten).
2. Läs CSS/Tailwind-klasserna för att se **verklig** renderad bredd vid varje brytpunkt — gissa aldrig.
3. Sätt `sizes` till att matcha exakt, t.ex. `sizes="(max-width: 768px) 75vw, 25vw"` om desktop visar 4 kort i rad.

**Orsak 2 — saknad liten `deviceSizes`-breakpoint:** Next.js standard `deviceSizes` börjar på 640px, bredare än många telefoners viewport (~360-430px). Lägg till en mindre breakpoint i `next.config.mjs`:
```js
images: {
  deviceSizes: [420, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
}
```

**Orsak 3 — fast pixelbredd i `sizes` som inte skalar:** t.ex. `sizes="860px"` på en bild i en container med `max-width` (inte fast `width`) — på mindre skärmar krymper containern men `sizes` säger fortfarande 860px, så en onödigt stor variant laddas. Använd relativa enheter (`vw`) eller matchande media queries.

**Orsak 4 — rå `<img>` istället för `next/image`:** ger ingen automatisk responsiv `srcset`, ingen lazy-loading, ingen formatkonvertering. Byt till `next/image` med korrekt `width`/`height` eller `fill` + `sizes`.

**Orsak 5 — fel format:** PNG/JPG istället för WebP/AVIF ger 2-5x större filstorlek för samma visuella kvalitet på foton. Konvertera produktbilder, mockups och banners till WebP (eller AVIF för ännu bättre kompression på hero-bilder).

### B. Kontinuerliga CSS/JS-animationer (lätt att missa, kan kosta mycket)

**Symptom:** Hög TBT, "Minska arbetsbelastningen på modertråden" med mycket "Rendering"/"Style & Layout"-tid, eller "Framtvingad flödesomformning" (forced reflow).

**Orsak — fel CSS-egenskap animeras:** att animera `background-position` (eller andra layout-/paint-triggande egenskaper) tvingar webbläsaren att rita om elementet varje frame — den kan inte GPU-accelereras (compositas). Det konkurrerar direkt med målningen av LCP-elementet om det ligger i samma område av sidan.

**Fix:** Animera bara `transform` och `opacity` (dessa kan compositas av GPU:n utan reflow/repaint). En bakgrundsgradient som ska "glida" ska flyttas till ett `::before`-pseudoelement som är större än sin container och animeras med `transform: translate()`, inte `background-position`.

**Alternativ fix om rörelsen inte tillför värde:** ta bort animationen helt och gör bakgrunden statisk. Fråga alltid: "behövs rörelsen för användarupplevelsen, eller är det bara dekoration som kostar prestanda?"

**Relaterat — synkron mobildetektion:** om `isMobile` sätts i en `useEffect` (körs *efter* första render) hinner tung logik (t.ex. 40 Framer Motion-partiklar med fjäderfysik) montera och köra på huvudtråden innan de villkorligt tas bort. Läs `window.innerWidth` synkront via en lazy `useState`-initializer istället, så förgreningen sker innan första render.

### C. Render-blockerande externa resurser

**Symptom:** "Begäranden om renderingsblockering", hög FCP.

**Vanlig orsak — dubbelladdade fonts:** en undersida laddar samma typsnitt på nytt via en extern `<link>`-tagg mot Google Fonts CDN, trots att root-layouten redan bäddar in samma font lokalt via `next/font/google`. Detta ger en extra, blockerande nätverksresa. Sök efter hårdkodade fontnamn som strängar (`"Geist"` etc) och byt till CSS-variabeln som redan finns (`var(--font-sans)`).

**Fix:** Ett typsnitt ska bara laddas en gång, i root-layouten, och återanvändas via CSS-variabel i hela appen.

### D. Tredjepartsskript som konkurrerar om bandbredd/CPU vid sidladdning

**Symptom:** Hög TBT/LCP-fördröjning trots att den egna koden är optimerad; ofta osynligt i "vad utvecklaren skrev" men syns i nätverksfliken som anrop till chattwidgetar, bokningskalendrar, marketing-pixlar.

**Exempel från detta projekt:**
- **Tidio-chatt + Klaviyo-tracking:** fördröjdes till webbläsarens idle-tid (`requestIdleCallback` eller motsvarande) istället för att ladda direkt vid sidladdning, eftersom de inte behövs för första renderingen.
- **Cal.com-bokningsembed:** laddades tidigare direkt vid sidladdning trots att den bara behövs när användaren klickar på en boknings-CTA. Byttes till att ladda embedden vid interaktion (klick), inte vid sidladdning.

**Fix-mönster:** Fråga för varje tredjepartsskript: "behöver detta finnas redo innan användaren gjort något?" Om nej — fördröj till idle-tid eller ladda det bara vid den interaktion som faktiskt kräver det.

### E. Prioritering av LCP-bilden specifikt

**Symptom:** Hög LCP trots att bilden i sig inte är extremt stor.

**Fix:**
- Sätt `priority` (Next.js `<Image>`-prop) på just den bild som är LCP-kandidaten (oftast hero-bilden eller första produktbilden ovanför mitten).
- Notera: i nyare Next.js-versioner sätter `priority`-propen **inte** automatiskt `fetchPriority="high"` på `<img>`-elementet — lägg till `fetchPriority="high"` explicit om det behövs.
- Lazy-ladda **allt annat** som inte är LCP-kandidaten, särskilt andra bilder i samma karusell/slideshow (de tävlar annars om samma bandbredd som den bild som faktiskt räknas).

### F. Onödiga API-anrop som blockerar eller kostar tid

**Symptom:** Nätverksanrop i traces som inte har någon synlig effekt men tar tid (ofta ett anrop som resulterar i 401/403 eller ett tomt svar).

**Exempel från detta projekt:** kundvagnskomponenten anropade `/api/orders` även för icke-inloggade besökare, vilket alltid resulterade i ett bortkastat 401-svar. Fix: hoppa över anropet villkorligt baserat på inloggningsstatus.

**Fix-mönster:** Granska nätverksfliken för anrop som konsekvent misslyckas eller returnerar tomt för en hel användarkategori (utloggade, nya konton, etc) — dessa kan ofta villkorsstyras bort helt.

### G. Tillgänglighet & kontrast (påverkar inte alltid prestandapoängen direkt, men hör ihop)

PageSpeed Insights/Lighthouse rapporterar tillgänglighet som en separat poäng, men fynden dyker ofta upp i samma granskning och är lika enkla att fixa på samma gång:

- **Kontrast:** text i ljusgrå nyanser (`text-gray-400` eller liknande) mot vit bakgrund klarar sällan WCAG AA. Höj till minst `text-gray-500` eller mörkare för brödtext/etiketter.
- **Tryckytor:** interaktiva element (karusellpunkter, ikonknappar) bör vara minst 44x44px för att vara lätta att träffa på mobil.
- **aria-label på icon-only-knappar:** knappar som bara innehåller en ikon (ingen synlig text) behöver `aria-label` så skärmläsare kan namnge dem. Gå igenom header, kundvagn, produktkort, bildzoom, jämförelsefunktion — alla ikonknappar.
- **Rubrikhierarki:** hoppa aldrig från t.ex. `h2` till `h4` utan mellanliggande `h3` — bryter semantisk struktur för skärmläsare.
- **alt-text-fallback:** bildkomponenter (särskilt zoom-/lightbox-komponenter) ska ha en fallback om `alt` saknas i datan, aldrig lämnas tom.

### H. Stora, oanvända beroenden i huvudbunten

**Symptom:** "Reducera JavaScript som inte används" på en chunk som laddas globalt (även på startsidan), inte bara en specifik route.

**Exempel från detta projekt:** `react-icons/si` (hela paketet, 5.6MB) importerades för ett fåtal varumärkesikoner. Fix: byt till lokala, handplockade SVG-filer för just de ikoner som faktiskt används, istället för att importera hela ikonbiblioteket.

**Fix-mönster:** Sök efter breda barrel-imports (`import { X } from 'stort-paket'` där paketet är känt för att vara tungt) och ersätt med riktade imports eller lokala assets. Kontrollera också om `experimental.optimizePackageImports` i `next.config.mjs` kan tree-shake paketet automatiskt (redan konfigurerat för `react-icons` i detta projekt).

### I. Döda tillgångar som ökar repo-/build-storlek (indirekt kostnad)

Inte en direkt Core Web Vitals-poäng, men värt att städa samtidigt: gamla bildversioner från tidigare designiterationer som ligger kvar i `public/` utan att refereras någonstans. Sök filnamnet i hela `app/`-katalogen innan radering (radera aldrig en hel mapp baserat på en lista utan att verifiera varje fil individuellt).

---

## Del 3: Arbetsprocess

### 1. Baslinjemätning
Kör PageSpeed Insights (https://pagespeed.web.dev) på startsidan **och** minst en produkt-/innehållssida, både Mobilt och Dator. Spara skärmdump/siffror innan något ändras — det är beviset för värdet ni levererar till kund.

### 2. Gå igenom kategori A–I ovan i ordning
Bilder (A) och animationer (B) ger oftast störst enskild vinst för minst insats — börja där.

### 3. Verifiera efter varje fix
1. `npm run build` lokalt — säkerställ att inget går sönder innan push.
2. Committa och pusha en logisk fix i taget när möjligt — gör det lätt att se vilken ändring som gav vilken poängförbättring (bra underlag för kundrapportering).
3. Kör om PageSpeed Insights efter deploy (vänta på Vercel-build + eventuell cache).
4. Kör om mätningen 2-3 gånger — enstaka körningar kan variera ±5-10 poäng av ren mätvariation.

### 4. Leveransmall till kund
1. Baslinje-skärmdump (före).
2. Punktlista över konkreta fynd och vad som fixades — i vanligt språk för kund, tekniskt (fil + rad) internt.
3. Efter-skärmdump.
4. En kort förklaring om att mobilpoäng under desktop är normalt (undvik att kunden blir onödigt orolig över en siffra som redan är förväntad).
5. Var tydlig om var ni valde att stanna och varför (diminishing returns vid t.ex. 95+), så kunden förstår att det är ett medvetet beslut, inte ofullständigt arbete.

---

*Sammanställd 2026-09-08 från techpilots.vercel.app:s faktiska commit-historik (samtliga prestanda-/tillgänglighetsfixar sedan projektstart) plus etablerad branschteori kring Core Web Vitals.*
