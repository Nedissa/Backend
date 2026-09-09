# Seven Laws Audit — Techpilots Tjänstesajt

En genomgång av tjänstesajten (https://techpilots.vercel.app/tjanster) mot Crawford's Seven Laws of Web Design.

---

## LAG 1: En webbplats har ett jobb ✅ GODKÄND (med mindre not)

**Jobbet:** "Boka ett kostnadsfritt möte för webbutveckling"

**Status:** KLART
- Primary CTA på Hero: "Boka konsultation" (gul, prominent)
- Secondary CTA: "Se vad vi byggt" (understödjande)
- Alla pricing-cards pekar tillbaka till samma CTA: "Boka konsultation"
- Final CTA: "Starta ditt projekt idag" (invertering på hover, tydlig)

**Styrka:** Konsekvent genom hela sidan — alla vägar leder till möte-booking.

**REKOMMENDATION:** Perfekt tillämpat. Jobbet är kristallklart.

---

## LAG 2: Klarhet före konvertering ✅ GODKÄND (med tips)

**Besökaren måste förstå på 30 sekunder:**

### Var är jag?
- ✅ "Lyft din digitala närvaro" (rubrik)
- ✅ "Moderna webblösningar och e-handel" (subheading)
- ✅ Stjärnor + "4.9/5" för instant social proof

### Vad får jag?
- ✅ Tre tjänstetilbud: Grundläggande (14,900), Företagswebbplats (25,490), E-handel (35,000)
- ✅ Tydliga feature-listor per paket

### Varför ska jag bry mig?
- ✅ "Byggda för prestanda, skalbarhet och tillväxt"
- ✅ Kundreferenser (Sagateatern, Pistolero, Crownmatch, etc.)
- ⚠️ **SVAGHET:** Pricing-sektionen saknar VALUE JUSTIFICATION — varför kostar "Grundläggande" 14,900 kr? Vad ingår exakt?

**REKOMMENDATION:** 
- Lägg till breakdown-text under rubrikerna: "Från 14,900 kr inkluderar: 5 sidor, mobil-responsiv, SEO-setup"
- Gör pricing-cards mer konkreta (ex. "3 veckor delivery", "Unlimited revisions")

---

## LAG 3: Första scrollningen bestämmer allt ✅ GODKÄND (utmärkt)

**Hero-sektionen svarar på:**
- ✅ Där är jag? — "Techpilots" + "Lyft din digitala närvaro"
- ✅ Vad får jag? — "Moderna webblösningar och e-handel"
- ✅ Varför ska jag bry mig? — "Byggda för prestanda, skalbarhet och tillväxt" + stjärnor

**Nästa steg direkt i hero:**
- ✅ "Boka konsultation" (gul knapp, prominent)
- ✅ "Se vad vi byggt" (sekundär)
- ✅ "30 min helt kostnadsfritt — utan bindning" (subtext som risk-reversal)

**STYRKA:** Hero är utmärkt. Besökaren vet exakt vad som händer nästa.

**REKOMMENDATION:** Redan bra — behåll så här.

---

## LAG 4: Ord säljer — design får vägen ✅ GODKÄND (med reservation)

**Copy-kvalitet:**

### Hero
- ✅ "Lyft din digitala närvaro" — action-oriented, klarar säljer
- ✅ "Moderna webblösningar och e-handel" — spesifikt, inte generiskt
- ✅ "Byggda för prestanda, skalbarhet och tillväxt" — benefits-driven

### Pricing
- ⚠️ **PROBLEM:** Card-rubrikerna är för generiska
  - "Grundläggande" ← Vad betyder det?
  - "Företagswebbplats" ← För vem?
  - "E-handel" ← Från noll eller upgrade?
  
- Borde vara: "Startup-webbplats", "Growth-webbplats", "E-commerce Ready"

### Process (Features)
- ✅ "Planering & behovsanalys" → "Prototyp" → "Utveckling" → "Lansering" → "Support"
- ✅ Tydligt narrativ från möte till launch

**REKOMMENDATION:**
1. Byt pricing-rubrikerna från generiska adjektiv → PROCESS/RESULT-baserad namngivning
   - "Startup Website" (för nystartade företag)
   - "Growth Website" (för växande bolag)
   - "E-Commerce Platform" (för försäljning)

2. Lägg till en mening under varje pricing-rubrik som svarar "För vem är denna?" och "Vad är resultatet?"

---

## LAG 5: Premium är vad du tar bort ✅ GODKÄND (utmärkt)

**Restraint-analys:**

- ✅ **Hero:** Enkel, ren, mycket whitespace
- ✅ **Pricing-cards:** Inte överladdade med grafik eller animationer
- ✅ **Font-användning:** Begränsad palett, inte 10 olika storlekar
- ✅ **Färger:** Guld (#e8c547) + svart/vitt + grått — minimalistisk
- ✅ **Sektion-spacing:** Generösa mellanrum mellan sektioner

**Design-övervägande:**
- Glaseffekten på Hero-promo-rutan är elegant, inte överdecorated
- CTA-knapparna är prominenta utan att vara flashy
- Animationer (fade-in, hover) är subtila

**STYRKA:** En av de bästa aspekterna av sidan. Premium-känsla genom LESS, inte MORE.

**REKOMMENDATION:** Behål detta exakt — det fungerar.

---

## LAG 6: Hastighet och sökbarhet är inte features — de är fundamentet ⚠️ OKÄND

**Kan inte testa live utan access till prestandaverktyg.**

**Rekommenderade checks:**
1. Kör Lighthouse audit på `/tjanster`
2. Kolla Core Web Vitals (LCP, FID, CLS)
3. Verifiera SEO-setup:
   - H1 rubrik är tydlig?
   - Meta-description för sidan?
   - Schema markup för Service?
   - Structured data (JSON-LD)?

**Gissa baserat på kod:**
- ✅ Next.js 16 = snabb by default
- ✅ Framer Motion-animationer är optimerade
- ⚠️ **Osäkerhet:** Bildstorlekar på hero/projects — är de optimerade?

**REKOMMENDATION:**
- Kör Lighthouse och rapportera
- Verifiera SEO setup (schema, meta, H1 struktur)
- Optimera project-bilder till WebP

---

## LAG 7: En webbplats är ett system, inte ett projekt ⚠️ VAKEN

**Är sidan byggd för underhål?**

### Uppdateringar som behövs regelbundet:
1. **Kundcase:** "Sagateatern", "Pistolero", "Crownmatch" — är dessa uppdaterade?
2. **Pricing:** Kommer priserna att ändras? Är de enkla att uppdatera?
3. **Process-beskrivning:** Håller denna över tid eller behöver uppdateras varje år?
4. **SEO:** Rankrar sidan för "Webbutveckling Borås"? Behöver kontinuerlig content-push.

**REKOMMENDATION:**
- Skapa en underhålls-kalender (uppdatera case studies var 6 månad)
- Koppla in CMS för pricing och process (Payload redan setup?)
- Planera SEO-push (blog posts, fallstudier) för att hålla sidan rankad

---

## SAMMANFATTNING — Resultat mot de sju lagarna

| Lag | Status | Notering |
|---|---|---|
| 1. Ett jobb | ✅ GODKÄND | Perfekt — allt pekar till "Boka konsultation" |
| 2. Klarhet | ✅ GODKÄND | Bra, men pricing-sektionen behöver VALUE JUSTIFICATION |
| 3. Första scroll | ✅ UTMÄRKT | Hero är perfekt — nästa steg klart |
| 4. Ord säljer | ⚠️ DELVIS | Copy är bra överlag, MEN pricing-rubrikerna är för generiska |
| 5. Premium | ✅ UTMÄRKT | Exkellent restraint — behål detta |
| 6. Speed & SEO | ⚠️ OKÄND | Kan inte verifiera utan live-test; kör Lighthouse audit |
| 7. System | ⚠️ VAKEN | Sidan är snygg MEN behöver underhålls-plan |

---

## PRIORITERADE REKOMMENDATIONER (högst till lägst impact)

### 🔴 HÖGT PRIORITET (gör nu)
1. **Byt pricing-rubrikerna:**
   - "Grundläggande" → "Startup Website"
   - "Företagswebbplats" → "Growth Website"  
   - "E-handel" → "E-Commerce Platform"
   
2. **Lägg till VALUE-text under varje pricing-rubrik:**
   ```
   Startup Website (Från 14,900 kr)
   För små företag och startups. 5 sidor, mobil-responsiv, SEO-setup.
   Delivery: 3-4 veckor.
   ```

3. **Kör Lighthouse audit** och rapportera resultat

### 🟡 MEDEL PRIORITET (nästa sprint)
4. **Optimera projekt-bilder** till WebP/AVIF
5. **Verifiera SEO-setup:** Rankrar för "Webbutveckling Borås"?
6. **Skapa underhålls-plan:** Uppdatera kundcase var 6 månad

### 🟢 LÅG PRIORITET (framtid)
7. **Blog/content-push** för SEO-rankning
8. **Integrera CMS** för pricing/process-uppdateringar

---

## SLUTSATS

Sidan är **övervägande god** och följer de sju lagorna väl. De två största förbättringspunkterna är:
1. **Pricing-rubriker är för generiska** (Lag 4: Ord säljer)
2. **Pricing-kort saknar value-justification** (Lag 2: Klarhet)

Övriga aspekter (hero, design, CTA-struktur, restraint) är **utmärkta** och bör behållas exakt.

En uppdatering av pricing-sektionen skulle förmodligen öka konverteringsgraden **10-20%** baserat på lag 2 & 4 principerna.

---

**Rapport datum:** 2026-08-11  
**Auditor:** Claude AI  
**Referens:** Crawford's Seven Laws of Web Design
