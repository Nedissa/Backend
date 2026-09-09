# Kravspecifikation: GDPR-anpassad Cookie Banner i Världsklass

Detta dokument beskriver de tekniska, funktionella och juridiska kraven för att utveckla en egendesignad samtyckeslösning (Cookie Banner) som uppfyller kraven enligt GDPR, ePrivacy-direktivet, Tillgänglighetsdirektivet samt vägledningar från EDPB och Integritetsskyddsmyndigheten (IMY).

---

## 1. Banner & Användargränssnitt (UX / UI)

- **Lika villkor för val:**  
  Knapparna för `"Godkänn alla"` och `"Neka alla"` måste ha exakt samma visuella storlek, färg, kontrast och framträdande placering. Det får inte vara svårare att neka än att godkänna.
- **Förbud mot "Mörka mönster" (Dark Patterns):**  
  Inga förkryssade rutor, inga förvillande färgval (t.ex. en lysande grön godkänn-knapp och en osynlig grå neka-knapp) eller manipulativ text som påverkar användarens val.
- **Tydlig kategorisering:**  
  Möjlighet att välja eller välja bort cookies per specifik kategori:
  - **Nödvändiga:** Får vara förkryssade och går inte att välja bort.
  - **Funktionella:** Valbara.
  - **Statistik / Analys:** Valbara.
  - **Marknadsföring / Riktad reklam:** Valbara.
- **Direkt information i första vyn:**  
  Bannern måste förklara vilka typer av cookies som används och med vilka syften innan något val görs.
- **Återkallande av samtycke:**  
  En permanent och lättillgänglig länk eller ikon ska finnas tillgänglig på sajten (t.ex. i sidfoten) där användaren när som helst kan öppna inställningarna och ändra sina val lika enkelt som de gavs.

---

## 2. Skriptblockering & Logik (Technical Execution)

- **Strikt förhandssamtycke (*Prior Consent*):**  
  Inga icke-nödvändiga cookies, pixlar eller spårningsskript (Google Analytics, Meta Pixel, Hotjar etc.) får laddas eller sättas i webbläsaren förrän användaren aktivt tryckt "Godkänn".
- **Kategoribaserad aktivering:**  
  Om användaren enbart godkänner kategorin *Statistik* får endast statistikskript laddas, medan *Marknadsföring* ska förbli helt blockerad.
- **Integration med Google Consent Mode v2:**  
  Skriptet måste dynamiskt uppdatera signaler via Googles API (`gtag('consent', 'update', ...)`) för parametrar som:
  - `ad_storage`
  - `analytics_storage`
  - `ad_user_data`
  - `ad_personalization`

---

## 3. Loggningsinfrastruktur & Audit Readiness

- **Spara samtyckesbevis:**  
  Varje val ska generera en loggpost innehållande:
  - Ett anonymt, slumpmässigt Samtyckes-ID (Cryptographic UUID).
  - Exakt tidsstämpel (datum och UTC-tid).
  - Versionsnummer på den gällande cookie-policyn.
  - Specifikation av vilka kategorier/syften som godkändes respektive nekades.
- **Anonymisering & Dataminimering:**  
  Klartext-IP-adresser får inte lagras. IP-adresser måste anonymiseras eller hashas innan de sparas i databasen.
- **Oföränderlig lagring (*Immutability*):**  
  Loggarna ska lagras i en säkrad databas där poster inte kan redigeras i efterhand för att fungera som juridisk bevisbörda.
- **Sök- och exportfunktion:**  
  Systemet ska göra det möjligt att söka fram och exportera samtyckesloggar baserat på Samtyckes-ID vid en eventuell tillsynsgranskning.

---

## 4. Cross-Domain & Domängränser

- **Multi-domän Samtycke (Cross-Domain Consent):**  
  Om företaget har flera domäner eller underdomäner (t.ex. `site.se`, `site.com`, `app.site.se`), måste samtycket kunna synkroniseras säkert mellan domänerna utan att tvinga användaren att godkänna på nytt för varje sida.
- **Säker samtyckeslagring:**  
  Själva samtyckes-cookien måste lagras som en strikt förstapartscookie med `SameSite=Lax` eller `SameSite=Strict` samt `Secure`-flaggor för att uppfylla moderna webbläsarkrav.

---

## 5. Tillgänglighet & Webbregler (Accessibility / WCAG)

- **WCAG 2.1 AA-efterlevnad:**  
  Enligt Tillgänglighetsdirektivet måste bannern vara tillgänglig för alla användare:
  - **Tangentbordsnavigering:** Alla knappar och val måste gå att nå och aktivera enbart via tangentbordet (Tab/Enter/Space).
  - **Skärmläsarstöd (ARIA-attribut):** Rätt ARIA-roller (t.ex. `role="dialog"`, `aria-modal="true"`, `aria-describedby`) så att skärmläsare uppfattar att en dialogruta har öppnats.
  - **Fokushantering (Focus Trapping):** När bannern visas ska fokus låsas i dialogrutan tills användaren gjort sitt val, så att man inte navigerar runt bakom bannern av misstag.

---

## 6. Prestanda, Resiliens & Fail-Safe

- **Ingen påverkan på Core Web Vitals:**  
  Bannern måste laddas asynkront utan att orsaka *Layout Shift* (CLS) eller blockera den huvudsakliga renderingen av sidan (LCP/INP).
- **Fail-Safe Mode (Standardnekan):**  
  Om samtyckesskriptet eller databasen ligger nere eller misslyckas att ladda, måste systemet som standard anta **Neka alla** (*Deny by default*). Inga spårningsskript får aktiveras om samtyckesstatusen inte kan verifieras.

---

## 7. Transparens & Dokumentation

- **Komplett Cookie-deklaration:**  
  En tillgänglig sida eller flik i bannern som redovisar samtliga aktiva cookies med följande detaljer:
  - **Namn:** Tekniskt namn (t.ex. `_ga`).
  - **Leverantör:** Tredjepart eller förstapart.
  - **Syfte:** Vad cookien används till.
  - **Lagringstid:** Utgångsdatum / Livslängd.
- **Kontinuerlig rensning:**  
  Aktiv rutin för att manuellt eller automatiskt uppdatera cookie-deklarationen så fort nya verktyg, plugins eller skript läggs till på webbplatsen.