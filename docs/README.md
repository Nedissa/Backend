# Dokumentation — index

Kort översikt över vad varje fil i `docs/` innehåller.

## Kod & drift
- **AUDIT.md** — stor checklista för hela projektet: kod, infrastruktur, säkerhet, prestanda. Körs som en genomgång, bockas av när åtgärdat.
- **ARCHITECTURE.md** — mappstruktur och teknisk arkitektur (Next.js App Router, submoduler, komponentindelning).
- **UX-UI.md** — designdirektiv: visuell identitet, designsystem, motion design, 16-punkters UX-audit. Läs innan UX/UI-tung kod skrivs eller granskas.
- **SOLUTIONS.md** — teknisk logg över lösta buggar och hur de löstes.
- **ROADMAP.md** — vad som är planerat framåt.
- **KEYS.md** — var alla API-nycklar och miljövariabler finns. Gitignorad, pushas ALDRIG till GitHub.

## Ordlista & sortiment
- **GLOSSARY.md** — ordlista för webbutveckling/projektet.
- **ITEGRA-PRODUCTS.md** — leverantören Itegras sortiment, varumärken, kontaktuppgifter.

## Verksamhet
- **BOKFÖRING.md** — bolagsstruktur och ekonomi. Inget med kod att göra.
- **MARKETING.md** — instruktioner för marketing-agenten (Techpilots Webshop & Studio).

## Historik
- **historik/** — arkiverade designbeslut från tidigare AI-sessioner (döpt efter datum). Beskriver VARFÖR något byggdes som det gjorde, inte hur koden ser ut idag. Två filer nämner den gamla mappen `app/webbstudio/` — den heter numera `app/tjanster/` efter ett namnbyte, men besluten som beskrivs gäller fortfarande.

---

Utanför `docs/` finns bara det som Claude Code kräver på specifika platser för att läsas in automatiskt:
- **CLAUDE.md** (repo-rot) — huvudinstruktioner, laddas alltid.
- **Frontend/apps/frontend/CLAUDE.md** — frontend-specifika instruktioner, laddas när den mappen är aktiv.

Allt annat (arkitektur, UX/UI-riktlinjer, ekonomidata, ordlistor, historik) ligger samlat här i `docs/`.
