# Projektsida-redesign: Perspectiva-inspirerad (Hero, klientrad, About, Varför Techpilots)

## Källa
Referens: https://simple-increase-893414.framer.app/ — de fyra första sektionerna, ner till och med de dubbla marmorbilderna ("Elsewhere" vs "With Perspectiva"). Allt efter den sektionen på referenssidan ingår inte.

## Mål
Bygg om `f:\Techpilots\Frontend\apps\frontend\app\webbstudio\projekt\[slug]\page.tsx` (delad mall, påverkar ALLA projektsidor: sagateatern, crownmatch, wastgota-bil, pistolero-studio, ljuva-hem-i-mark) så layout/design matchar Perspectivas fyra första sektioner, med webbstudions egen font och riktig `PROJECTS`-data.

## Ej i scope
- `ProjectNav` (headern/navigationen) rörs inte alls.
- Prev/next-navigeringssektionen längst ner på sidan rörs inte.
- Inget efter "Varför Techpilots"-sektionen i referensen tas med.
- Inga nya fält läggs till i `PROJECTS`-datan (`projekt-data.ts`) — återanvänd befintliga fält (`image`, `mobileImage`, `category`, `title`, `year`, `challenge`, `solution`, `result`, `technologies`, `description`, `website`).

## Global typografi
- Ta bort `SERIF`-konstanten (`Georgia`,`Times New Roman`,serif).
- Ersätt med Geist italic (webbstudions befintliga font, `font-style: italic` på `<em>`-element eller motsvarande) överallt kursiv text används idag.
- Bakgrund `#f0efed` behålls oförändrad.
- Allt sektionsinnehåll ligger inom `max-w-[1440px] mx-auto px-12` (befintligt mönster i filen, ska gälla alla fyra sektioner konsekvent).

## Sektion 1 — Hero
- Tagg (`project.category`) som pill-badge, centrerad överst.
- Stor kursiv rubrik: `{project.title} — {project.year}` (Geist italic, `clamp(44px,7vw,88px)`, oförändrad storlek).
- Brödtext under (`project.challenge ?? project.description.slice(0,180)`), centrerad, `max-w-[500px]`.
- Två knappar oförändrade: "Se alla projekt" (svart) länk till `/webbstudio`, "Besök sajten" (vit, border) om `project.website` finns.
- Stor bild (`project.image`) med rundade hörn (`rounded-[20px]`) direkt under knapparna.
- Dekorativ cirkelformad overlay-bild i botten-högra kvadranten av hero-bilden: `project.mobileImage` om den finns, annars en gradient-platshållare (samma guld/mörk-gradient-mönster som kontaktsidans platshållare, `radial-gradient(circle at 30% 20%, #e8c547 0%, #d9d9d9 55%, #f0f0f0 100%)`). Cirkeln är `border-radius: 50%`, ungefär 40% av hero-bildens bredd, positionerad `absolute` överlappande bildens högra hälft.
- **Borttaget från hero:** stjärnbetyg-raden (5 SVG-stjärnor + kategori-text kombinerat med taggen — taggen ersätter denna rad), och ticker-raden ("Techpilots projekt:" + länkar till andra projekt).

## Sektion 2 — Teknikstack-rad
- Ersätter Perspectivas "Perspectiva clients:"-logotyprad.
- Rubrik-text: "Techpilots teknikstack:" centrerad, liten grå text (`text-[13px] text-[#888]`).
- Under: horisontell rad med `project.technologies`, renderade som text (inte ikoner/loggor — vi har inga ikonfiler per teknik), `opacity-45`, samma stil som nuvarande ticker-rad (`text-sm font-semibold`), `flex gap-12 justify-center flex-wrap`.
- Om `project.technologies` är tom/saknas: sektionen renderas inte alls (villkorlig, som övriga optional-fält i filen).

## Sektion 3 — About
- Två kolumner, grid `45fr 55fr` (samma proportion som nuvarande "Om projektet"-block): bild vänster (`project.mobileImage ?? project.image`), text höger.
- Tagg "Om projektet" (pill-badge, samma stil som befintlig).
- Kursiv rubrik: "En digital resa för {project.title}."
- Tre brödtextstycken i ordning: `project.challenge`, `project.solution`, `project.result` — varje stycke renderas villkorligt om fältet finns (samma mönster som nuvarande kod, `&&`-villkor).

## Sektion 4 — Varför Techpilots (uppdaterad stil)
- Tagg "Varför Techpilots" + kursiv rubrik "Techpilots är *inte* en vanlig webbyrå." + ingress — oförändrat innehåll från nuvarande kod.
- Två kort sida vid sida (`grid grid-cols-2 gap-5`, `rounded-[24px] overflow-hidden relative`):
  - **Bakgrund:** hela kortet fylls av bilden (`mobileImage ?? heroImg` vänster, `heroImg` höger — oförändrat vilka bilder som används). **Ingen mörk overlay (`bg-black/40`) längre** — bilden syns i full färg, som Perspectivas marmorbilder.
  - **Pill-etikett:** centrerad överst i kortet, vit bakgrund (`bg-white`, inte `bg-white/20`), svart text (inte vit text) — matchar Perspectivas vita "Elsewhere"/"With Perspectiva"-pills mot marmor-bakgrund. Vänster kort: "Andra byråer". Höger kort: "Med Techpilots".
  - **Innehållsbox:** vit box (`bg-white/95 rounded-[20px] p-8`) **centrerad i kortets mitt** (`absolute inset-0 flex items-center justify-center` eller motsvarande centrering, inte `justify-between` med boxen nedtill som idag), med punktlista från `project.challenge` (vänster) / `project.result` (höger) — samma split/mappning-logik som befintlig kod.
- Citat-blocket under korten (`project.solution`, avatar-cirkel med projektets initial) — oförändrat.

## Datamappning-sammanfattning
| Fält i `PROJECTS` | Används i |
|---|---|
| `title`, `year` | Hero-rubrik, About-rubrik |
| `category` | Hero-tagg |
| `image` | Hero huvudbild, sektion 4 höger kort-bakgrund |
| `mobileImage` | Hero cirkel-overlay (fallback: gradient), About-bild, sektion 4 vänster kort-bakgrund |
| `challenge` | Hero-brödtext (fallback), About stycke 1, sektion 4 vänster punktlista |
| `solution` | About stycke 2, citat under sektion 4 |
| `result` | About stycke 3, sektion 4 höger punktlista |
| `technologies` | Sektion 2 teknikstack-rad |
| `website` | Hero "Besök sajten"-knapp |
| `description` | Hero-brödtext fallback |

## Risk / påverkan
Detta är en delad mall — ändringen syns direkt på alla befintliga projektsidor (sagateatern, crownmatch, wastgota-bil, pistolero-studio, ljuva-hem-i-mark) så fort den deployas. Ingen migrering av data krävs eftersom inga nya fält introduceras.
