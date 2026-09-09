# Webbstudio SiteNav: vit navbar efter hero

## Problem
`SiteNav` (f:\Techpilots\Frontend\apps\frontend\app\webbstudio\components\SiteNav.tsx) är idag alltid mörk/halvtransparent (`rgba(3,4,8,0.3)`) med vit text, över hela webbstudio-sajten. Den ska smälta in bättre: transparent/mörk över hero-sektionen, och byta till vit bakgrund med svart text precis när hero lämnas vid scroll.

## Lösning
- Lägg till en `IntersectionObserver` i `SiteNav` som observerar DOM-elementet med klassen `hero-section` (från HeroSection.tsx), med `rootMargin: "-72px 0px 0px 0px"` (navbarhöjd) och `threshold: 0`.
- State `pastHero: boolean`. `true` när hero-sektionen inte längre skär navbarens nedre kant.
- Om sidan saknar `.hero-section` (t.ex. framtida sidor utan hero): default `pastHero = true` (vit navbar) — observern hittar inget element och state förblir i sitt initiala läge, sätt initialt till `true` och `false` bara efter att observer bekräftat att hero är synlig.
- Styling:
  - `pastHero=false`: `background: rgba(3,4,8,0.3)`, länktext vit (`#fff`), burger-strecken vita.
  - `pastHero=true`: `background: #fff`, länktext svart (`#0a0a0a`), burger-strecken svarta.
  - Aktiv länk-färg (`#e8c547`, gult) ändras inte.
  - `transition: background 0.3s ease` på nav-elementet; textfärg-transition per länk via CSS eller inline style transition.
- Om mobilmenyn är öppen (`open === true`): tvinga mörkt/vitt-tema oavsett `pastHero`, eftersom overlay redan är mörk (`rgb(12,13,18)`) — burger-ikonen ska vara vit när menyn är öppen.
- Gäller bara på `/webbstudio` (startsidan, enda sidan med `HeroSection` just nu). `/webbstudio/kontakt` och `/webbstudio/projekt/*` har ingen hero-section och SiteNav returnerar redan `null` för projektsidorna.

## Ej i scope
- Ingen ändring av webshopens huvudheader (`app/components/Header/`).
- Ingen ändring av `PageHero` eller `HeroBanner` (webshopen).
- Ingen ändring av logga-bild (samma logo.png i båda lägena, ingen mörk/ljus-variant behövs eftersom loggan är en ikon som fungerar på båda bakgrunder — verifieras visuellt vid implementation).
