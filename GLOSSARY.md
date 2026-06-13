## Ordlista — Techpilots


## Webbutveckling

<details>
<summary><strong>Claude & AI</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Claude Code** | Anthropics CLI-verktyg för att koda med Claude | Hela tiden — verktyget du använder nu | Låter Claude läsa, skriva och köra kod i projektet | Du skriver "fixa checkout-buggen" och Claude hittar filen och ändrar koden |
| **Skill** | Förbyggt kommando med definierat beteende | När du vill att Claude ska göra något konsekvent | Slipper förklara vad du vill varje gång | `/code-review` granskar alltid koden på samma strukturerade sätt |
| **Hook** | Automatisk trigger som körs när Claude gör något | I bakgrunden — du märker det inte | Automatiserar repetitiva kontroller | Varje gång Claude sparar en fil körs ESLint automatiskt |
| **Agent** | Självständig Claude-instans för en avgränsad uppgift | När en uppgift är för stor för ett svar | Kan arbeta parallellt utan att du guidar varje steg | En agent kollar TypeScript-fel, en annan kollar säkerhet — samtidigt |
| **Subagent** | Agent startad av en annan agent | Automatiskt när Superpowers delar upp ett jobb | Parallelliserar arbetet — snabbare och mer fokuserat | Superpowers startar tre subagenter för produktsida, tester och API |
| **MCP** | Model Context Protocol — låter Claude prata med externa verktyg | När Claude behöver läsa databasen eller skapa GitHub-issues | Utan MCP kan Claude bara läsa filer | Claude kör SQL mot er databas via dbhub-MCP:n |
| **MCP-server** | Program som exponerar verktyg till Claude | Alltid aktivt i bakgrunden | Varje MCP-server ger Claude nya förmågor | `dbhub` ger databasåtkomst, `github` låter Claude skapa PRs |
| **Plugin** | Paket med skills, agents och hooks | En gång vid installation | Utökar Claude med ett nytt arbetssätt | Superpowers installerades och gav 5 agents och 1 hook direkt |
| **Superpowers** | Plugin som lär Claude planera och debugga systematiskt | Aktivt automatiskt | Förhindrar att Claude kastar sig in i kod utan att tänka | "Bygg rabattsystem" → Claude frågar, skriver plan, väntar på godkännande |
| **Memory** | Fil där Claude sparar insikter mellan konversationer | Claude sparar när den lär sig något | Slipper förklara samma preferenser om och om igen | Claude minns att du aldrig vill att den pushar utan tillåtelse |
| **CLAUDE.md** | Textfil som Claude alltid läser vid start | Varje ny konversation | Sätter regler och kontext för hela projektet | Er CLAUDE.md säger "svara alltid på svenska" |
| **Context** | All info Claude har i en konversation | Hela konversationen | Ju mer relevant context, desto bättre svar | Claude läser CLAUDE.md, dina meddelanden och de filer du visat |
| **Prompt** | Din instruktion eller fråga till Claude | Varje gång du skriver i chatten | Hur du kommunicerar vad du vill ha gjort | "Fixa så att rabattkoder fungerar i checkout" |

</details>

---

<details>
<summary><strong>Utveckling & Workflow</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **TDD** | Metodik där du skriver testet innan koden | Innan du implementerar ny funktionalitet | Tvingar dig att tänka igenom logiken — hittar buggar tidigt | Skriv test "SUMMER10 ska ge 10% rabatt" → skriv koden som gör testet grönt |
| **Red/Green** | TDD-cykelns två faser | Under TDD-arbete | Ger ett tydligt mål — gör testet grönt, inget mer | Red = testet misslyckas, Green = testet går igenom |
| **YAGNI** | "You Aren't Gonna Need It" | När du frestas att bygga något "för framtiden" | Sparar tid och håller koden enkel | Bygg inte avancerat rabattsystem om du bara behöver enkel procent nu |
| **DRY** | "Don't Repeat Yourself" | När du märker att du kopierar kod | Om logiken ändras behöver du bara ändra på ett ställe | Prisuträkning ska ligga i en funktion, inte kopieras i varje komponent |
| **Refactor** | Omstrukturera kod utan att ändra vad den gör | När koden fungerar men är svår att läsa | Håller kodbasen hälsosam på lång sikt | Bryta ut en 200-raders komponent till tre mindre |
| **Deploy** | Publicera kod så att den är live | Efter en godkänd kodändring | Gör dina ändringar tillgängliga för riktiga användare | Push → Vercel bygger → techpilots.se uppdateras |
| **CI/CD** | Automatisk bygg- och deployprocess | Varje gång du pushar kod | Eliminerar manuella steg och fångar fel tidigt | GitHub Actions kör TypeScript-kontroll → deployas till Vercel |
| **Git** | Versionshantering som spårar alla ändringar | Hela tiden — varje kodändring bör committas | Du kan alltid gå tillbaka till en tidigare version | Något gick sönder → `git revert` återställer |
| **Branch** | Parallell kopia av koden för isolerat arbete | När du börjar jobba på en ny feature | Håller ofärdig kod borta från live-sajten | `feature/checkout-rabatt` påverkar inte produktionen |
| **PR (Pull Request)** | Förslag på att slå ihop din branch med huvudkoden | När din feature är klar | Möjlighet att granska koden innan den går live | Öppna PR → granska → merga → deployas |
| **Merge** | Slå ihop två branches | När en PR godkänts | För in din färdiga feature i huvudkoden | Mergar `feature/checkout-rabatt` → `main` → deploy |
| **Commit** | Sparad ögonblicksbild av dina ändringar | Efter varje meningsfull förändring | Skapar historik av vad som ändrades och varför | `git commit -m "Lägg till rabattkod-validering"` |
| **Push** | Skicka lokala commits till GitHub | När du vill dela ändringar eller trigga deploy | Synkroniserar med GitHub och triggar CI/CD | `git push` → GitHub tar emot → Vercel börjar bygga |
| **Webhook** | URL som anropas automatiskt när något händer | I bakgrunden, automatiskt | Kopplar ihop system utan manuella steg | Stripe anropar er webhook vid lyckad betalning → Medusa skapar order |

</details>

---

<details>
<summary><strong>Programmeringsspråk</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **JavaScript (JS)** | Webbens grundspråk | Överallt i er stack | Det enda språket som körs direkt i browsern | All interaktivitet — kundvagn, filter, checkout |
| **TypeScript (TS)** | JavaScript med typer | Alla `.ts` och `.tsx`-filer | Fångar fel innan koden körs | Varnar om du skriver `order.customerId` när fältet heter `order.customer_id` |
| **HTML** | Definierar strukturen på en webbsida | I React-komponenter som JSX | Berättar för browsern vad som finns på sidan | `<button>Lägg i kundvagn</button>` |
| **CSS** | Styr utseendet på HTML-element | Via Tailwind-klasser i JSX | Utan CSS ser allt ut som ett Word-dokument från 1995 | `className="bg-black text-white rounded-lg"` |
| **SQL** | Språk för databaser | När du frågar PostgreSQL direkt | Det enda sättet att kommunicera med databasen | `SELECT * FROM product WHERE title LIKE '%iPhone%'` |
| **Shell** | Terminalens kommandotolk | Varje gång du skriver i terminalen | Låter dig styra datorn med text | Allt du skriver i terminalen tolkas av en Shell |
| **Bash** | Vanligaste Shell-varianten på Linux/Mac | På er VPS och i deploy-scripts | Standardspråket för automatisering på Linux | `pm2 restart medusa` på servern |
| **PowerShell** | Microsofts Shell för Windows | I din lokala Windows-terminal | Inbyggt i Windows, kraftfullt för Windows-uppgifter | Claude kör kommandon på din dator via PowerShell |
| **Git Bash** | Bash-emulator för Windows | I terminalen i VSCode | Samma Bash-kommandon fungerar på Windows | `git push`, `ssh`, `ls` fungerar trots Windows |
| **JSON** | Textformat för strukturerad data | API-svar, konfigfiler, paketfiler | Universellt format alla system förstår | `{"id": "prod_123", "title": "iPhone 15", "price": 9999}` |
| **YAML** | Konfigurationsformat — mer läsbart än JSON | GitHub Actions, Docker | Lättare att läsa och skriva för människor | Er GitHub Actions-workflow är i YAML |
| **Markdown (MD)** | Textformat med enkel formatering | Alla `.md`-filer | Ser ut som vanlig text men renderas snyggt | `**fet**` blir fet, `# Rubrik` blir stor rubrik |
| **RegEx** | Mönsterspråk för att söka i text | Validering, sökning, textbearbetning | Hittar komplexa mönster som vanlig sökning inte klarar | `^[^\s@]+@[^\s@]+\.[^\s@]+$` validerar e-postadress |

</details>

---

<details>
<summary><strong>Ramverk & Bibliotek</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **React** | JavaScript-bibliotek för att bygga UI med komponenter | All frontend-kod | Gör det enkelt att bygga UI som uppdateras automatiskt | `<ProductCard product={product} />` |
| **Next.js** | React-ramverk med routing, SSR och API-routes | Er hela frontend | Ger React routing, SEO och snabbare sidladdning | `app/products/[id]/page.tsx` blir automatiskt en sida |
| **Medusa v2** | Open source e-handelsramverk | All backend-logik | Färdigbyggd e-handelslogik — slipper bygga från grunden | Hanterar lager, rabatter, frakt och betalning |
| **Payload CMS** | Headless CMS för att hantera innehåll | Uppdatera banners, texter, bilder | Innehållsredaktörer jobbar självständigt utan utvecklare | Uppdatera hero-banner inför kampanj utan deploy |
| **Tailwind CSS** | CSS-ramverk med utility-klasser i JSX | All styling i frontend | Slipper skriva och namnge CSS-klasser | `className="flex items-center gap-4 p-6 bg-white"` |
| **Node.js** | JavaScript-runtime på servern | Kör er Medusa-backend | Utan Node.js kan JS bara köras i browsern | Medusa-servern på `api.techpilots.se` är Node.js |
| **Express** | Minimalt Node.js-webbramverk | Internt i Medusa | Hanterar routing och middleware för API:et | Tar emot `/store/products` och skickar till rätt handler |
| **Prisma** | ORM — skriver JS istället för SQL | Internt i Medusa | Skyddar mot SQL-injektioner, enklare queries | `await prisma.product.findMany({ where: { status: 'published' } })` |
| **React Hook Form** | Bibliotek för formulärhantering | Checkout, inloggning, adressformulär | Hanterar validering och state utan massa boilerplate | Checkout-formuläret med adress och kortuppgifter |
| **Zustand / Context API** | State management — delar data mellan komponenter | Kundvagn, inloggningsstatus | Utan det måste du skicka data manuellt genom varje komponent | Kundvagnens innehåll tillgängligt från header till checkout |

</details>

---

<details>
<summary><strong>Filtyper</strong></summary>

| Filtyp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **.ts** | TypeScript-fil | Backend-logik, utilities, typer | Ren logik utan UI | `medusa-config.ts`, handlers |
| **.tsx** | TypeScript + JSX (React) | Alla React-komponenter | TypeScript-säkerhet i komponenter | `ProductCard.tsx`, `CheckoutForm.tsx` |
| **.js** | JavaScript-fil | Äldre kod eller config | Grundläggande skriptfil | `next.config.js` |
| **.jsx** | JavaScript + JSX | Äldre React-komponenter | Som .tsx men utan typer | Sällan i moderna projekt |
| **.json** | JSON-datafil | Konfiguration, paketinfo | Universellt läsbart format | `package.json` listar alla npm-paket |
| **.md** | Markdown-dokumentation | README, CLAUDE.md, GLOSSARY.md | Lättläst text som renderas snyggt | Denna fil |
| **.env** | Miljövariabelfil | Lokalt under utveckling | Håller hemliga nycklar borta från GitHub | `STRIPE_SECRET_KEY=sk_live_...` |
| **.gitignore** | Ignorerade filer för git | Alltid aktiv | Förhindrar att nycklar pushas till GitHub | `node_modules/` och `.env` ignoreras alltid |
| **.yml / .yaml** | YAML-konfigurationsfil | GitHub Actions, Docker | Konfigurerar automatiserade processer | `.github/workflows/deploy.yml` |
| **.css / .scss** | Stilmall | Global styling | Stilar som inte passar i Tailwind | Global typsnitt, CSS-reset |
| **.svg** | Vektorgrafik | Ikoner och logotyper | Skalbar utan kvalitetsförlust | Er logotyp som SVG |
| **.webp** | Modernt bildformat | Produktbilder | Minst filstorlek med bäst kvalitet | Produktbilder i webp sparar laddningstid |
| **.sh** | Shell-skript | Deploy-scripts, automation | Körbara terminalkommandon | `deploy.sh` som bygger och startar om servern |
| **package.json** | Node.js projektfil | Varje Node.js-projekt | Listar paket, scripts och metadata | `npm run dev` är definierat här |
| **tsconfig.json** | TypeScript-konfiguration | En per projekt | Styr hur TypeScript kompileras | Bestämmer om strikt typkontroll är på |
| **medusa-config.ts** | Medusas huvudkonfiguration | Konfigurering av backend | Allt Medusa behöver veta | Stripe-integration och databasanslutning |
| **.mcp.json** | MCP-serverkonfiguration | Läses av Claude Code vid start | Talar om vilka MCP-servrar Claude ska använda | dbhub, github, brevo, slack |

</details>

---

<details>
<summary><strong>Verktyg & Pakethantering</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **npm** | Node Package Manager | Installera, uppdatera, ta bort paket | Ger tillgång till miljontals färdiga bibliotek | `npm install @medusajs/medusa` |
| **npx** | Kör npm-paket utan permanent installation | Engångskommandon | Slipper installera verktyg globalt | `npx create-next-app` |
| **node_modules** | Mapp med alla installerade paket | Skapas av `npm install` | Lagrar all kod från externa bibliotek | Kan vara 500MB+ — pushas aldrig till GitHub |
| **dependency** | Paket din kod behöver i produktion | I `dependencies` i package.json | Koden fungerar inte utan dem | React, Medusa, Stripe |
| **devDependency** | Paket som bara behövs under utveckling | I `devDependencies` i package.json | Ingår inte i produktionsbygget | TypeScript, ESLint, Prettier |
| **ESLint** | Analyserar koden och hittar fel | Automatiskt vid sparning eller CI/CD | Fångar vanliga misstag och håller koden konsekvent | Varnar om du definierar en variabel men aldrig använder den |
| **Prettier** | Automatisk kodformatering | Vid sparning av filer | Alla får samma kodstil utan diskussion | Lägger automatiskt till semikolon och fixar indragningar |
| **Webpack / Turbopack** | Bundler — paketerar filer för browsern | I bakgrunden vid `npm run build` | Browsern kan inte läsa TypeScript direkt | Tar 200 `.tsx`-filer och gör dem till optimerade JS-filer |
| **GitHub** | Plattform för kod och samarbete | Varje gång du pushar | Central plats för kod, triggerpunkt för deploy | Push → Vercel deployas, VPS-webhook triggas |
| **GitHub Actions** | CI/CD inbyggt i GitHub | Vid varje push eller PR | Automatiserar tester och deploy | Kör TypeScript-kontroll → deployas till Vercel |
| **Docker** | Containerverktyg | Driftsättning | "Fungerar på min dator"-problemet försvinner | Medusa kan köras i en Docker-container på VPS:en |

</details>

---

<details>
<summary><strong>Frontend</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Komponent** | Återanvändbar UI-byggsten i React | Allt visuellt är en komponent | Bygg en gång, använd överallt | `<ProductCard />` på kategorisida, sökresultat och startsida |
| **SSR** | Server-Side Rendering — sidan byggs på servern | Produktsidor, kategorisidor | Snabbare laddning och bättre SEO | Produktsida renderas med aktuellt pris och lager |
| **SSG** | Static Site Generation — byggs vid deploy | Sidor som sällan ändras | Snabbast möjliga laddning från CDN | Om-sida, kontaktsida |
| **CSR** | Client-Side Rendering — byggs i browsern | Dynamiska delar | Interaktiva element utan sidomladdning | Kundvagnsikonen uppdateras direkt när du lägger till en produkt |
| **Hydration** | SSR-sida blir interaktiv i browsern | Automatiskt efter SSR-laddning | Kombinerar SSR:s snabbhet med CSR:s interaktivitet | Sidan syns direkt, sedan "vaknar" React och knapparna fungerar |
| **Props** | Data som skickas in till en komponent | När komponenten ska visa olika innehåll | Gör komponenter återanvändbara | `<ProductCard product={iphone} />` — `product` är en prop |
| **State** | Intern data i en komponent som kan ändras | Formulär, toggle-knappar, laddningsstatus | När state ändras uppdateras UI:t automatiskt | `const [quantity, setQuantity] = useState(1)` |
| **Hook (React)** | Funktion som ger React-funktionalitet | I alla funktionskomponenter | Återanvändbar logik utan att skriva klasser | `useState`, `useEffect`, `useCart` |

</details>



<details>
<summary><strong>Webshop & E-handel</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Hero** | Stor sektion högst upp på startsidan | Alltid synlig för nya besökare | Första intrycket — kommunicerar vad sajten handlar om | Stor bild på senaste iPhone med "Bästa priset på teknik" |
| **Hero Banner** | Bildbanderoll i hero med rubrik och CTA | Kampanjer, nyheter, rea | Drar blicken och guidar besökaren | "Sommarrea — upp till 30% på allt" med knappen "Shoppa nu" |
| **Banner** | Reklamremsa eller informationsremsa | Kampanjer, erbjudanden, info | Kommunicerar ett tydligt budskap snabbt | "Fri frakt över 500 kr" i toppen av sidan |
| **CTA** | Call To Action — uppmaning till handling | Överallt där du vill att besökaren ska agera | Tydliga CTA:s ökar konvertering | "Lägg i kundvagn", "Köp nu", "Se alla produkter" |
| **Header** | Sidhuvudet — fast rad högst upp | Alltid synlig | Navigation och snabbåtkomst till kundvagn | Logotyp, meny, kundvagn-ikon |
| **Footer** | Sidfoten — längst ned på sidan | Synlig när man scrollat ner | Kontaktinfo, policys, sekundär navigation | Kontaktuppgifter, leveransinfo, GDPR-policy |
| **Sidebar / Aside** | Sidopanel | Kategorisidor | Filter och kategorier lättåtkomliga | Filtrera på pris, märke, skärmstorlek |
| **Modul** | Fristående sektion på sidan | Startsida, kampanjsidor | Bygg sidor av block utan att koda | "Populära produkter", "Senast sedda" |
| **PDP** | Product Detail Page — produktsida | När kunden klickar på en produkt | Ger all info för köpbeslut | `/products/iphone-15-pro` — bilder, spec, pris, "Lägg i kundvagn" |
| **PLP** | Product Listing Page — kategorisida | Kategorier, sök, kampanjer | Låter kunden bläddra och hitta rätt | `/categories/mobiler` — alla mobiler med filter |
| **Kundvagn (Cart)** | Temporär samling av valda produkter | Under hela shoppingupplevelsen | Samla produkter innan köp | iPhone + skal — båda visas i kundvagnen |
| **Checkout** | Köpflödet från kundvagn till order | När kunden är redo att köpa | Samlar adress, frakt och betalning | Adress → Frakt → Betalning → Bekräftelse |
| **SKU** | Unik kod per produkt/variant | Lagerhantering och ordrar | Identifierar exakt vilken variant som köpts | `IPH15P-256-BLK` = iPhone 15 Pro 256GB Svart |
| **Variant** | En specifik version av en produkt | Produkter med storlek eller färg | En produkt kan ha många varianter | iPhone 15 Pro i 128GB, 256GB, 512GB |
| **Rabattkod** | Kod som ger rabatt vid checkout | Kampanjer, kundlojalitet | Ökar konvertering och belönar kunder | `SUMMER10` ger 10% rabatt |
| **Upsell** | Förslag på dyrare alternativ | På produktsidan | Ökar snittvärdet per order | "Uppgradera till 256GB för 400 kr mer" |
| **Cross-sell** | Förslag på relaterade produkter | På produktsidan och i checkout | Ökar antalet produkter per order | "Passar till din iPhone: skal, skärmskydd, laddare" |
| **SEO** | Optimering för sökmotorer | Alltid, byggs in i strukturen | Organisk trafik från Google är gratis | Rätt `<title>`, `<meta>` och strukturerad data |
| **Slug** | URL-vänlig version av ett namn | I alla URL:er | Läsbar och SEO-vänlig URL | `iphone-15-pro` → `/products/iphone-15-pro` |
| **Breadcrumb** | Navigeringsväg på sidan | Produkt- och kategorisidor | Hjälper kunden navigera, förbättrar SEO | `Hem > Mobiler > iPhone > iPhone 15 Pro` |
| **Pagination** | Sidnumrering för långa listor | Kategorisidor med många produkter | Snabbare laddning än att visa allt | Sida 1, 2, 3... |
| **Filter** | Möjlighet att filtrera produkter | Kategorisidor | Hjälper kunden hitta rätt snabbare | Filtrera på pris, märke, lagerstatus |

</details>

---

<details>
<summary><strong>Backend & Medusa</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **API** | Gränssnitt för kommunikation med backend | Varje datahämtning från frontend | Standardiserat sätt att prata med servern | `GET /store/products` → produktlistan |
| **REST API** | API med standard HTTP-metoder | All kommunikation med Medusa | Enkelt och fungerar med alla klienter | GET = hämta, POST = skapa, PUT = uppdatera, DELETE = ta bort |
| **Endpoint** | Specifik URL för en operation | Varje API-anrop | Varje endpoint har ett tydligt syfte | `POST /store/carts` skapar en kundvagn |
| **Handler** | Funktionen som körs vid ett anrop | I bakgrunden vid varje request | Innehåller affärslogiken | Handler för checkout skapar order och triggar betalning |
| **Middleware** | Kod som körs mellan request och handler | Automatiskt vid varje anrop | Gemensam logik för autentisering och loggning | Kontrollerar att kunden är inloggad innan checkout |
| **PostgreSQL** | Relationsdatabas för all er data | Alltid — all data lagras här | Pålitlig och snabb med stöd för komplexa queries | Alla produkter, ordrar och kunder finns här |
| **Migration** | Fil som beskriver en databasändring | När du lägger till fält eller tabeller | Versionshanterar databasen | Lägger till `discount_percentage` i orders-tabellen |
| **Region** | Geografisk marknad med egna priser | I Medusa admin | Sälj i flera länder med lokala priser | Sverige: SEK, 25% moms, Klarna |
| **Sales Channel** | Försäljningskanal | Konfiguration i Medusa | Separera webshop, app och B2B | Webshop-kanalen har egna priser och regler |
| **Collection** | Grupp av produkter | Startsida, kampanjer | Kurerade produktlistor utan kategorier | "Nyheter", "Bästsäljare", "Rea" |
| **Admin** | Medusas admin-panel | Daglig drift | Hantera produkter, ordrar och kunder utan kod | Lägg till produkt, hantera lager, se ordrar |

</details>

---

<details>
<summary><strong>Betaltjänster & Integrationer</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Stripe** | Betaltjänst för kortbetalningar | Vid checkout | PCI-certifierad — ni hanterar aldrig kortnummer | Kunden betalar → Stripe hanterar → bekräftar till Medusa |
| **Payment Intent** | Stripes objekt för ett betalningsförsök | Skapas vid betalningssteget | Spårar betalningens status | Medusa skapar → kunden betalar → Stripe bekräftar → order skapas |
| **Webhook (Stripe)** | Stripe meddelar er vid betalningshändelse | Automatiskt efter betalning | Synkroniserar Stripe och Medusa | Betalning lyckades → webhook → Medusa skapar order |
| **Brevo** | Email-tjänst för transaktions- och kampanjmejl | Orderbekräftelse, leverans, nyhetsbrev | Professionell leverans med spårning | Automatiskt orderbekräftelsemejl via Brevo |
| **Transaktionsmejl** | Automatiska mejl vid specifika händelser | Order, betalning, frakt | Håller kunden informerad automatiskt | "Din order #1234 är bekräftad" |
| **Orderbekräftelse** | Mail till kund vid lyckad betalning | `webhooks/stripe` → `checkout.session.completed` | Kvitto och bekräftelse | Skickas direkt efter Stripe bekräftar |
| **Ny order (intern)** | Mail till info@techpilots.se vid ny order | `webhooks/stripe` | Notis om inkommande order | Skickas samtidigt som orderbekräftelsen |
| **Välkommen — ny kund** | Mail vid kontoregistrering | `lib/mailer.ts` → `sendWelcomeEmail()` | 10% rabatt på första köpet | Skickas direkt vid registrering |
| **Återställ lösenord** | Mail med återställningslänk | `api/auth/reset-password` | Länk giltig i 24 timmar | Triggas av "Glömt lösenord" |
| **Nyhetsbrev — välkommen** | Mail till kund vid nyhetsbrevs-anmälan | `api/newsletter` | Bekräftar prenumeration + 10% rabatt | Skickas direkt vid anmälan |
| **Nyhetsbrev — notis (intern)** | Mail till info@techpilots.se vid nyhetsbrevs-anmälan | `api/newsletter` | Intern notis om ny prenumerant | Skickas samtidigt som välkomstmejlet |
| **Kontaktformulär (intern)** | Mail till info@techpilots.se vid kontakt | `api/contact` | Vidarebefordrar kundens meddelande | Svar-till satt till kundens e-post |
| **Felanmälan mottagen** | Mail till kund vid felanmälan | `api/complaints` | Bekräftar ärendenummer och svarstid | Triggas när kund skickar felanmälan på Mina sidor |
| **Ny felanmälan (intern)** | Mail till info@techpilots.se vid felanmälan | `api/complaints` | Intern notis med kundinfo och beskrivning | Skickas samtidigt som kundbekräftelsen |
| **Payload CMS** | Headless CMS för innehållshantering | Banners, texter, bilder | Redaktörer jobbar utan att involvera utvecklare | Uppdatera hero-banner inför kampanj |
| **Headless CMS** | CMS utan inbyggt frontend | Payload CMS är er headless CMS | Fri hand att bygga vilket frontend som helst | Next.js hämtar banners från Payload via API |

</details>

---

<details>
<summary><strong>Konfiguration & Miljö</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **.env-fil** | Fil med miljövariabler som inte pushas | Lokalt under utveckling | Håller hemliga nycklar borta från koden | `STRIPE_SECRET_KEY=sk_live_abc123` |
| **Miljövariabel** | Namngiven inställning som varierar per miljö | Alltid | Samma kod med test-nycklar lokalt, riktiga i produktion | `DATABASE_URL` pekar på lokal db lokalt, VPS i produktion |
| **API-nyckel** | Hemlig sträng som identifierar er mot en tjänst | Vid varje anrop till Stripe, Brevo etc. | Tjänsten vet vem som anropar | `STRIPE_SECRET_KEY` används vid varje betalning |
| **Public key** | Nyckel som får vara synlig i browsern | Frontend-kod | Identifierar er utan att ge full åtkomst | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| **Secret key** | Nyckel som bara används på servern | Backend-kod | Ger fullständig åtkomst — läcker den ut är det allvarligt | `STRIPE_SECRET_KEY` — aldrig i frontend |
| **NEXT_PUBLIC_** | Prefix som gör variabel tillgänglig i browsern | Next.js-variabler frontend behöver | Bara variabler med detta prefix exponeras | `NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.techpilots.se` |
| **JWT** | Krypterad token som bevisar vem du är | När kunden loggar in | Servern behöver inte spara sessioner | Medusa skickar JWT → frontend sparar och skickar med varje anrop |
| **CORS** | Regler för vilka domäner som får anropa API:et | Alltid — webbläsaren kontrollerar automatiskt | Förhindrar att slumpmässiga sajter anropar ert API | Medusa tillåter bara `techpilots.se` och `localhost:3000` |
| **NODE_ENV** | Anger vilken miljö koden körs i | Automatiskt satt av Node.js | Aktiverar/inaktiverar debug-läge och optimeringar | `development` lokalt, `production` på Vercel och VPS |
| **DATABASE_URL** | Miljövariabel med adress till databasen | Konfigureras i .env och Vercel | Kopplar Medusa till rätt databas | `postgresql://user:pass@localhost:5432/medusa` |

</details>

---

<details>
<summary><strong>Vercel & Hosting</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Vercel** | Hosting specialbyggd för Next.js | Varje push till GitHub deployas automatiskt | Zero-config deploy — inget att konfigurera | Push → Vercel bygger → techpilots.se uppdateras på 1-2 min |
| **Preview Deployment** | Automatisk testmiljö per PR eller branch | Varje push till icke-main branch | Testa live utan att påverka produktion | PR för ny checkout → Vercel skapar `preview-checkout.vercel.app` |
| **Production Deployment** | Den live-versionen på er riktiga domän | Vid push till main | Det kunden ser | `techpilots.se` kör alltid senaste main-builden |
| **Build** | Next.js kompileras till optimerade filer | Vid varje deploy | TypeScript måste omvandlas till något browsern förstår | `npm run build` tar ~2 min och skapar `.next`-mappen |
| **Build log** | Logg från Vercel under bygget | När deploy misslyckas | Ser exakt vad som gick fel | TypeScript-fel eller saknade miljövariabler syns här |
| **CDN** | Globalt nätverk som cacher filer | Varje sidladdning | Filer serveras från närmaste server | Kund i Göteborg får filer från Stockholm, inte Finland |
| **Edge function** | Kod som körs nära användaren på CDN | Middleware, A/B-tester | Snabbare än att skicka anropet till er server | Redirect-logik körs på Vercels edge, inte er VPS |
| **Domain** | Er webbadress | Alltid | Identifierar er sajt | `techpilots.se` |
| **Subdomain** | Underdomän för specifik tjänst | Separata tjänster | Separerar frontend, API och CMS | `api.techpilots.se`, `cms.techpilots.se` |

</details>

---

<details>
<summary><strong>Server & VPS</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **VPS** | Dedikerad virtuell server i molnet | Er Medusa-backend körs här | Full kontroll över miljön | Hetzner-servern på `95.217.163.97` kör Medusa |
| **SSH** | Krypterat protokoll för serverinloggning | Felsökning och konfiguration av VPS | Säker inloggning utan lösenord | `ssh -i ~/.ssh/techpilots root@95.217.163.97` |
| **SSH-nyckel** | Fil som identifierar dig vid SSH | Vid varje SSH-inloggning | Säkrare än lösenord | `~/.ssh/techpilots` är er privata nyckel |
| **Root** | Administratörskontot på Linux | På er VPS | Full behörighet — kan göra vad som helst | Loggar in som `root` på er server |
| **PM2** | Process manager för Node.js | Medusa-processen körs via PM2 | Om Medusa kraschar startar PM2 om den automatiskt | `pm2 restart medusa` startar om backend |
| **Nginx** | Webbserver som vidarebefordrar trafik | Varje anrop till `api.techpilots.se` | Tar emot HTTPS och skickar vidare till Medusa | Port 443 → Nginx → port 9000 → Medusa |
| **Reverse Proxy** | Server som vidarebefordrar requests | Nginx fungerar som reverse proxy | Döljer intern struktur och hanterar SSL | Nginx tar HTTPS, terminerar SSL, skickar HTTP till Medusa |
| **Port** | Kommunikationskanal på servern | Alltid — varje process har en port | Flera tjänster kan köras på samma server | Medusa: 9000, HTTP: 80, HTTPS: 443 |
| **SSL/TLS** | Kryptering för HTTPS | Alla anrop till `api.techpilots.se` | Ingen kan avlyssna kommunikationen | Cloudflare Tunnel hanterar SSL-certifikatet |
| **Cloudflare Tunnel** | Säker tunnel från Cloudflare till servern | All trafik till `api.techpilots.se` | HTTPS utan exponerad IP, plus DDoS-skydd | `api.techpilots.se` → Cloudflare → tunnel → VPS → Medusa |
| **Systemd** | Linux-tjänst för processhantering | Startar tjänster automatiskt vid reboot | Servern startar om efter strömavbrott och allt körs igen | Cloudflare Tunnel-processen hanteras av systemd |
| **PM2 Logs** | Realtidsloggar från Medusa-processen | Vid felsökning | Ser exakt vad som hände när felet uppstod | `pm2 logs medusa` visar live-loggar |
| **Cron job** | Schemalagt kommando vid en viss tid | Automatiska uppgifter | Kör saker utan att du behöver komma ihåg | Rensa gamla sessioner varje natt kl 03:00 |

</details>

---

<details>
<summary><strong>Vanliga kommandon — Bash vs PowerShell</strong></summary>

Bash används på er **VPS (Linux)** och i **Git Bash** lokalt.
PowerShell används i **Windows-terminalen** lokalt.

| Vad du vill göra | Bash | PowerShell |
|---|---|---|
| Lista filer i mapp | `ls` | `ls` eller `Get-ChildItem` |
| Gå in i en mapp | `cd mappnamn` | `cd mappnamn` |
| Gå upp en nivå | `cd ..` | `cd ..` |
| Skapa en mapp | `mkdir mappnamn` | `mkdir mappnamn` |
| Ta bort en fil | `rm filnamn` | `rm filnamn` eller `Remove-Item` |
| Ta bort en mapp | `rm -rf mappnamn` | `rm -Recurse -Force mappnamn` |
| Visa innehåll i fil | `cat filnamn` | `cat filnamn` eller `Get-Content` |
| Kopiera en fil | `cp källa mål` | `cp källa mål` eller `Copy-Item` |
| Flytta en fil | `mv källa mål` | `mv källa mål` eller `Move-Item` |
| Hitta text i fil | `grep "text" fil` | `Select-String "text" fil` |
| Visa var du är | `pwd` | `pwd` eller `Get-Location` |
| Rensa terminalen | `clear` | `clear` eller `cls` |
| Kör ett skript | `bash skript.sh` | `.\skript.ps1` |
| Sätt miljövariabel | `export VAR=värde` | `$env:VAR = "värde"` |
| Visa miljövariabel | `echo $VAR` | `echo $env:VAR` |
| Kör kommando som admin | `sudo kommando` | Öppna terminal som administratör |

---

#### Bash-kommandon du använder på VPS

| Kommando | Vad | Exempel |
|---|---|---|
| `ssh` | Logga in på servern | `ssh -i ~/.ssh/techpilots root@95.217.163.97` |
| `pm2 status` | Se alla körande processer | Visar om Medusa är igång |
| `pm2 restart medusa` | Starta om Medusa | Efter en backend-deploy |
| `pm2 logs medusa` | Visa live-loggar från Medusa | Vid felsökning |
| `pm2 stop medusa` | Stoppa Medusa | Innan manuell uppdatering |
| `cd /opt/medusa-backend` | Gå till backend-mappen | Startpunkt för allt på VPS |
| `git pull` | Hämta senaste koden från GitHub | Manuell deploy på VPS |
| `npm install` | Installera nya paket | Efter `git pull` om package.json ändrats |
| `npm run build` | Bygg Medusa | Innan restart efter kodändring |
| `systemctl status cloudflared` | Kolla Cloudflare Tunnel | Om API:et inte svarar |
| `nginx -t` | Testa Nginx-konfiguration | Innan du startar om Nginx |
| `systemctl reload nginx` | Ladda om Nginx | Efter konfigändring |

---

#### Git-kommandon du använder dagligen

| Kommando | Vad | Exempel |
|---|---|---|
| `git status` | Se vad som ändrats | Innan du committar |
| `git add filnamn` | Stagea en specifik fil | `git add src/components/Cart.tsx` |
| `git add .` | Stagea alla ändringar | Var försiktig — kolla `git status` först |
| `git commit -m "meddelande"` | Spara ändringarna | `git commit -m "Lägg till rabattkod"` |
| `git push` | Skicka till GitHub | Triggar deploy |
| `git pull` | Hämta senaste från GitHub | Innan du börjar jobba |
| `git checkout -b branch` | Skapa och byt till ny branch | `git checkout -b feature/checkout` |
| `git checkout main` | Byt till main-branch | |
| `git log --oneline` | Visa commit-historik kort | Senaste 10 commits |
| `git diff` | Visa vad som ändrats | Innan du committar |
| `git stash` | Spara ändringar tillfälligt | När du behöver byta branch snabbt |
| `git stash pop` | Återställ sparade ändringar | Efter att du bytt tillbaka |

---

#### npm-kommandon du använder dagligen

| Kommando | Vad | När |
|---|---|---|
| `npm install` | Installera alla paket i package.json | Efter `git pull` eller ny klon |
| `npm install paketnamn` | Installera ett nytt paket | Lägga till ett bibliotek |
| `npm update` | Uppdatera alla paket | Körs alltid efter `npm install` |
| `npm run dev` | Starta dev-server med hot reload | Under utveckling |
| `npm run build` | Bygg för produktion | Innan deploy |
| `npm run start` | Kör produktionsbygget | På servern |
| `npm uninstall paketnamn` | Ta bort ett paket | Städa bort oanvända paket |

</details>

---

<details>
<summary><strong>VSCode Extensions</strong></summary>

| Extension | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Claude Code** | Anthropics officiella AI-kodassistent | Hela tiden | Låter Claude läsa, skriva och köra kod direkt i projektet | Du chattar med Claude utan att lämna VSCode |
| **ESLint** | Hittar fel och stilproblem i JS/TS-kod | Automatiskt vid sparning | Fångar vanliga misstag innan de blir buggar | Varnar om du definierar en variabel men aldrig använder den |
| **Prettier** | Automatisk kodformatering | Vid sparning | Alla filer ser likadana ut oavsett vem som skrivit dem | Fixar indragningar, semikolon och radbrytningar automatiskt |
| **Tailwind CSS IntelliSense** | Autocomplete för Tailwind-klasser | När du skriver className | Slipper komma ihåg alla Tailwind-klasser utantill | Skriver `bg-` → ser alla bakgrundsfärger |
| **Biome** | Snabb linter och formatter för JS/TS | Alternativ till ESLint + Prettier | Snabbare — ett verktyg istället för två | Formaterar och lint:ar i ett enda steg |
| **Auto Rename Tag** | Byter namn på HTML/JSX-tagg automatiskt | När du redigerar JSX | Slipper uppdatera öppnings- och stängningstag manuellt | Ändrar `<div>` → stängningstag uppdateras automatiskt |
| **Error Lens** | Visar fel direkt på kodraden | Alltid synlig | Slipper öppna Problems-panelen | Röd text på raden där TypeScript-felet är |
| **Thunder Client** | API-testverktyg inbyggt i VSCode | När du testar Medusa-endpoints | Slipper öppna Postman | Skicka `GET /store/products` och se svaret direkt |
| **Remote SSH** | Anslut till er VPS direkt i VSCode | Vid felsökning på servern | Redigera filer på servern som om de vore lokala | Öppna `/opt/medusa-backend` på VPS:en i VSCode |
| **Docker Explorer** | Hantera Docker-containers i VSCode | Vid Docker-arbete | Visuell vy utan terminal | Se och starta/stoppa containers direkt |
| **Live Server** | Lokal server med hot reload | Vid statisk HTML | Sidan uppdateras automatiskt vid sparning | Öppna HTML-fil → ändringar syns direkt i browsern |
| **Material Icon Theme** | Bättre ikoner för filer och mappar | Alltid synlig | Lättare att skilja filtyper åt visuellt | `.tsx` får React-ikon, `.env` får nyckel-ikon |
| **Markdown Preview Enhanced** | Bättre markdown-förhandsvisning | När du läser `.md`-filer | Renderar tabeller och `<details>`-taggar korrekt | GLOSSARY.md med vertikala linjer i tabeller |
| **Code Spell Checker** | Stavningskontroll i koden | Alltid aktiv | Fångar stavfel i variabelnamn och kommentarer | Varnar om du skriver `custoemr` istället för `customer` |
| **Import Cost** | Visar storleken på importerade paket | När du lägger till imports | Håller koll på bundle-storlek | `import moment` → visar "67.9kb" direkt |
| **Console Ninja** | Visar console.log direkt i editorn | Under frontend-debugging | Slipper öppna webbläsarens DevTools | `console.log(cart)` → resultatet visas på kodraden |
| **Colorize** | Färgar CSS-färgvärden i koden | I CSS/Tailwind-filer | Ser faktisk färg utan att memorera hex-koder | `#FF5733` visas med orange bakgrund |
| **Peacock** | Färgar VSCode-fönstrets ram per projekt | När du har flera projekt öppna | Direkt visuell skillnad mellan projekt | Webshop-fönstret blått, Studio-fönstret grönt |
| **Live Share** | Parprogrammering i realtid | Vid samarbete | Flera personer redigerar samma kod samtidigt | Dela din VSCode-session med en kollega |
| **Open in Browser** | Öppna HTML-filer i browsern | Vid HTML-testning | Snabb förhandsvisning utan Live Server | Högerklicka på HTML → "Open in Browser" |
| **Edge DevTools** | Microsoft Edge DevTools i VSCode | Vid frontend-debugging | Inspektera element utan att lämna VSCode | Se CSS-regler och API-anrop direkt i editorn |
| **ES7 React Snippets** | Kodgenvägar för React/Next.js | När du skriver komponenter | Snabbare boilerplate | Skriv `rafce` → hel React-komponent genereras |
| **Multi Cursor Case Preserve** | Behåller casing vid multi-cursor | Vid bulk-redigering | Ändrar `myVar` och `MyVar` korrekt samtidigt | Byt namn på flera variabler med olika casing |
| **Shopify Theme Check** | Linting för Shopify Liquid | Vid Shopify-arbete | Fångar fel i Liquid-kod | Varnar om en Liquid-variabel inte finns |
| **Liquid Snippets** | Kodgenvägar för Shopify Liquid | Vid Shopify-arbete | Snabbare Liquid-syntax | Skriv `for` → `{% for item in collection %}` |

</details>

<br><br>

## Ekonomi & Administration

<details>
<summary><strong>Bokföring & Ekonomi</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Faktura** | Dokument som begär betalning för en vara eller tjänst | När ni säljer till företagskunder | Juridiskt krav och bevis på affären | Kund köper 10 iPhones — ni skickar faktura på 99 990 kr |
| **Kvitto** | Bekräftelse på att betalning mottagits | Vid konsumentköp | Kundens bevis på köpet | Orderbekräftelsen som skickas via Brevo fungerar som kvitto |
| **Moms (VAT)** | Mervärdesskatt som läggs på priset | På alla försäljningar i Sverige | Statlig skatt ni samlar in och betalar vidare | 25% moms på teknikprodukter — pris 1000 kr + 250 kr moms = 1250 kr |
| **Moms 25%** | Standardsats för de flesta varor | Teknikprodukter, tillbehör | Den vanligaste momssatsen i Sverige | En iPhone till 9999 kr inkl. moms — 1999,80 kr är moms |
| **Inkl. moms** | Priset inkluderar redan momsen | Alltid mot konsumenter (B2C) | Konsumenter ska se slutpriset direkt | Priset på techpilots.se visas alltid inkl. moms |
| **Exkl. moms** | Priset innan moms läggs på | Mot företagskunder (B2B) | Företag drar av momsen — de vill se nettopriset | Faktura till företag visar pris exkl. moms + moms separat |
| **B2C** | Business to Consumer — försäljning till privatpersoner | Er webshop | Privatpersoner betalar alltid inkl. moms | En privatperson köper en iPhone på techpilots.se |
| **B2B** | Business to Business — försäljning till företag | Företagskunder | Andra regler för fakturering och moms | Ett företag beställer 20 laptops — faktura exkl. moms |
| **Kassaflöde** | Pengar som flödar in och ut ur företaget | Löpande ekonomiuppföljning | Även lönsamma företag kan gå under om kassan är tom | Stor lagerbeställning minskar kassan — inbetalningar från kunder fyller den |
| **Kostnad** | Pengar som går ut ur företaget | Alltid | Det du betalar för att driva verksamheten | Serverhyra, lagerkostnader, Stripe-avgifter |
| **Intäkt** | Pengar som kommer in till företaget | Vid varje försäljning | Det du tjänar | En kund betalar 9999 kr för en iPhone |
| **Vinst / Resultat** | Intäkter minus kostnader | Månads- och årsuppföljning | Det som faktiskt blir över efter alla kostnader | 9999 kr intäkt − 7000 kr inköp − 500 kr avgifter = 2499 kr vinst |
| **Bokföring** | Systematisk registrering av alla affärshändelser | Löpande — varje transaktion ska bokföras | Lagkrav och grund för skattedeklaration | Varje försäljning, kostnad och betalning bokförs |
| **Kontoplan** | Lista med konton som används i bokföringen | I bokföringssystemet | Kategoriserar alla intäkter och kostnader | Konto 3001 = försäljning, konto 5010 = lokalkostnader |
| **Debet / Kredit** | Bokföringens två sidor — in och ut | Vid varje bokföringspost | Dubbel bokföring håller balansen | Försäljning: kredit på intäktskonto, debet på bankkonto |
| **Balansräkning** | Ögonblicksbild av tillgångar och skulder | Vid bokslut | Visar vad företaget äger och är skyldigt | Tillgångar: lager + bank. Skulder: leverantörsskulder + lån |
| **Resultaträkning** | Sammanställning av intäkter och kostnader | Vid bokslut och månadsuppföljning | Visar om företaget gick med vinst eller förlust | Intäkter 500 000 kr − Kostnader 380 000 kr = Resultat 120 000 kr |
| **Fortnox** | Populärt bokföringsprogram i Sverige | Löpande bokföring och fakturering | Förenklar bokföring, fakturering och deklaration | Koppla Stripe-betalningar mot Fortnox för automatisk bokföring |
| **Swish** | Mobil betaltjänst | Alternativ betalningsmetod | Populärt i Sverige för snabba betalningar | Kund betalar med Swish vid checkout |
| **Stripe-avgift** | Transaktionsavgift Stripe tar per betalning | Vid varje kortbetalning | Kostnaden för att ta emot kortbetalningar | Ca 1,4% + 1,80 kr per transaktion inom EU |
| **Lagervärde** | Det bokförda värdet av ert lager | Vid bokslut och inköp | Lager är en tillgång i balansräkningen | 50 iPhones × 7000 kr inköpspris = 350 000 kr i lagervärde |
| **Inköpspris** | Vad ni betalar för en produkt | Vid inköp | Grunden för att beräkna marginal och försäljningspris | iPhone 15 Pro kostar 8000 kr att köpa in |
| **Marginal** | Skillnaden mellan inköpspris och försäljningspris | Vid prissättning | Visar hur mycket ni tjänar per produkt | Inköp 8000 kr, säljer för 9999 kr = 1999 kr marginal (20%) |

</details>

---

<br><br>

## Marknadsföring

<details>
<summary><strong>Marknadsföring & SEO</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **SEO** | Search Engine Optimization — optimering för sökmotorer | Alltid, byggs in i strukturen | Organisk trafik från Google är gratis och långsiktig | Rätt titlar och meta-beskrivningar på produktsidor |
| **Organisk trafik** | Besökare som hittar er via Google utan betald annons | Löpande | Gratis och hållbar trafik på lång sikt | Någon söker "köp iPhone 15 Sverige" och hittar techpilots.se |
| **Betald trafik** | Besökare via betalda annonser | Kampanjer och lansering | Snabb synlighet — du betalar per klick | Google Ads-annons visas överst vid sökning |
| **Google Ads** | Googles annonssystem | Betald synlighet i sökresultaten | Syns direkt — till skillnad från SEO som tar tid | Annons för "iPhone 15 billigt" visas för köpklara kunder |
| **Meta Ads** | Annonssystem för Facebook och Instagram | Sociala medier-kampanjer | Når kunder baserat på intressen och beteende | Produktannons visas för personer som tittat på iPhones |
| **Konvertering (CVR)** | Andel besökare som faktiskt köper | Mäts löpande | Viktigare än antal besökare — kvalitet över kvantitet | 1000 besökare, 20 köper = 2% konverteringsgrad |
| **Bounce rate** | Andel besökare som lämnar direkt utan att klicka | I analytics | Hög bounce = sidan lever inte upp till förväntningarna | 80% bounce på en produktsida = något stämmer inte |
| **CTR** | Click-Through Rate — andel som klickar på en länk | I annonser och sökresultat | Mäter hur lockande din rubrik eller annons är | 100 visningar, 5 klick = 5% CTR |
| **CPC** | Cost Per Click — vad du betalar per klick | I Google/Meta Ads | Håller koll på annonskostnaden | 5 kr per klick × 200 klick = 1000 kr i annonskostnad |
| **ROAS** | Return On Ad Spend — intäkt per spenderad annonskrona | Vid kampanjutvärdering | Mäter om annonseringen lönar sig | Spenderar 1000 kr → genererar 5000 kr i försäljning = ROAS 5x |
| **CAC** | Customer Acquisition Cost — vad det kostar att skaffa en kund | Löpande | Måste vara lägre än vad kunden handlar för | 200 kr i marknadsföring per ny kund |
| **LTV** | Lifetime Value — total intäkt från en kund över tid | Strategisk planering | En kund som återkommer är mer värd än CAC | Kund handlar 3 gånger/år × 1000 kr × 3 år = 9000 kr LTV |
| **Email-kampanj** | Massutskick av mejl till er kundlista | Kampanjer, nyheter, erbjudanden | Direktkanal till era kunder — hög ROI | Skicka "Sommarrea" till 5000 prenumeranter via Brevo |
| **Nyhetsbrev** | Regelbundet email-utskick | Veckovis eller månadsvis | Håller varumärket top-of-mind | Veckans erbjudanden och nyheter från Techpilots |
| **Öppningsfrekvens** | Andel mottagare som öppnar ett mejl | Vid email-kampanjer | Mäter hur relevant ämnesraden är | 20% öppningsfrekvens = bra för e-handel |
| **Segmentering** | Dela upp kundlistan i grupper | Riktad marknadsföring | Rätt budskap till rätt person | Skicka iPhone-erbjudande bara till kunder som köpt Apple-produkter |
| **Retargeting** | Visa annonser för personer som besökt er sajt | Återaktivera intresserade | De flesta köper inte vid första besöket | Kund tittade på iPhone 15 → ser annons för iPhone 15 på Instagram |
| **Landningssida** | Sida designad för ett specifikt syfte | Kampanjer och annonser | Optimerad för konvertering — inga distraktioner | Annons leder till sida med bara iPhone 15 och köpknapp |
| **A/B-test** | Testa två versioner mot varandra | Optimering av sidor och annonser | Datadrivet beslutsfattande | Testa röd vs grön "Köp nu"-knapp — vilken ger fler köp? |
| **Pixel (Meta)** | Spårningskod från Meta på sajten | Alltid aktiv i bakgrunden | Spårar besök och köp för att optimera annonser | Meta Pixel ser att kunden köpte iPhone → optimerar annonser |
| **Google Analytics** | Verktyg för att analysera webbplatstrafik | Löpande uppföljning | Förstå var besökare kommer från och vad de gör | Se vilka produktsidor som har högst bounce rate |
| **Impressions** | Antal gånger en annons eller sida visats | I annonser och SEO | Räckvidd — hur många nås av budskapet | Annonsen visades 10 000 gånger den här veckan |
| **ROI** | Return On Investment — avkastning på investering | Vid utvärdering av insatser | Mäter om pengarna är välspenderade | Investerar 10 000 kr i SEO → genererar 100 000 kr i trafik-värde |

</details>

---

---

<br><br>

## Lager & Logistik

<details>
<summary><strong>Lager & Lagerhållning</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Lager** | Fysisk plats där produkter förvaras innan försäljning | Alltid — ni måste veta vad ni har | Utan koll på lager säljer ni produkter ni inte har | Er fysiska lagerlokal med iPhones, tillbehör osv |
| **Lagersaldo** | Antal enheter kvar i lager per produkt/variant | Uppdateras vid varje köp och inleverans | Förhindrar överförsäljning | iPhone 15 Pro 256GB Svart: 12 st kvar |
| **Inleverans** | Varor som anländer från leverantör | Vid ny beställning från leverantör | Uppdaterar lagersaldot uppåt | 50 nya iPhones anländer — lagersaldo +50 |
| **Utleverans** | Varor som skickas till kund | Vid varje order som packas | Uppdaterar lagersaldot nedåt | Order packad och skickad — lagersaldo -1 |
| **Lagervärde** | Det bokförda värdet av allt lager | Vid bokslut | Lager är en tillgång i balansräkningen | 50 iPhones × 8000 kr inköpspris = 400 000 kr |
| **Säkerhetslager** | Minsta antal enheter innan ny beställning görs | Vid inköpsplanering | Undviker att sälja slut på populära produkter | Beställ ny iPhone-batch när lagret når 5 st |
| **Inköpsorder** | Formell beställning till leverantör | Vid ny inköp | Dokumenterar vad som beställts och till vilket pris | Beställning på 100 iPhones till Apple-distributör |
| **Leverantör** | Företaget ni köper produkter från | Vid inköp och prisförhandling | Avgör er kostnad och tillgång på produkter | Apple-distributör, tillbehörsleverantör |
| **Ledtid** | Tid från beställning till leverans | Vid inköpsplanering | Påverkar hur långt i förväg ni måste beställa | 2 veckor ledtid = beställ innan lagret tar slut |

</details>

---

<details>
<summary><strong>Frakt & Leverans</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Fraktsätt** | Metod för att skicka paketet till kunden | Vid checkout — kunden väljer | Olika hastighet och pris | PostNord Hemleverans, DHL Servicepoint |
| **Fraktkostnad** | Vad kunden betalar för leveransen | Visas i checkout | Påverkar konvertering — hög frakt = fler överger kundvagnen | 49 kr standardfrakt, fri frakt över 500 kr |
| **Fri frakt** | Ingen fraktkostnad för kunden | Vid ordervärde över gräns | Ökar konvertering och snittvärde per order | Fri frakt på ordrar över 500 kr |
| **Fraktetikett** | Utskrivbar etikett med adress och spårningsnummer | När order packas | Fästs på paketet — krävs av fraktbolaget | Skriv ut PostNord-etikett från Medusa admin |
| **Spårningsnummer** | Unikt nummer för att följa paketet | Efter utskick | Kunden kan följa sin leverans | Skickas automatiskt i leveransbekräftelsen |
| **PostNord** | Sveriges vanligaste fraktbolag | Standardleverans i Sverige | Täcker hela Sverige, välkänt för konsumenter | Paket till brevlåda eller servicepoint |
| **DHL** | Internationellt fraktbolag | Express och internationell frakt | Snabbare leverans, bra för företagskunder | DHL Express — leverans nästa dag |
| **Budbil** | Snabb lokal leverans med bil | Samedag-leverans i storstad | Premium-tjänst för kunder som vill ha snabbt | Leverans inom 2 timmar i Stockholm |
| **Retur** | Kund skickar tillbaka en produkt | Vid ånger eller reklamation | Lagkrav — konsumenter har 14 dagars ångerrätt | Kund ångrar köp → skickar tillbaka → ni återbetalar |
| **Returporto** | Vem betalar frakten för returen | Vid returpolicy-beslut | Fri retur ökar köpvilja men kostar | Ni betalar returfrakten = bättre kundupplevelse |
| **Leveranstid** | Estimerad tid till kunden | Visas i checkout och orderbekräftelse | Sätter förväntningar — missar ni det tappar ni förtroende | "Leverans 2-3 vardagar" |

</details>

---

<br><br>

## Kundservice

<details>
<summary><strong>Kundkommunikation & Support</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Reklamation** | Kund klagar på en defekt eller felaktig produkt | När produkt är trasig eller fel | Lagkrav — ni har ansvar för produktfel i 3 år | iPhone slutar fungera efter 2 månader — kund reklamerar |
| **Garanti** | Tillverkarens löfte om att produkten fungerar | Vid produktfel | Extra trygghet utöver lagstadgad reklamationsrätt | Apples 1-åriga garanti på iPhones |
| **Reklamationsrätt** | Konsumentens lagstadgade rätt vid fel | Alltid — gäller automatiskt | Svensk lag ger 3 års reklamationsrätt | Kund kan reklamera trasig iPhone i upp till 3 år |
| **Ångerrätt** | Rätt att ångra ett köp utan att ange skäl | Inom 14 dagar från leverans | EU-lag — gäller alla nätköp | Kund ångrar iPhone-köp → 14 dagar på sig att returnera |
| **Återbetalning** | Pengar tillbaka till kunden | Vid retur eller reklamation | Krav vid godkänd retur eller reklamation | Stripe-återbetalning inom 5-10 bankdagar |
| **Supportärende** | En kunds fråga eller problem som hanteras | Vid varje kundkontakt | Spåra och lösa kundens problem | Kund mailar om försenad leverans — ärendet loggas och följs upp |
| **FAQ** | Vanliga frågor och svar | På sajten | Minskar antalet supportärenden | "Hur lång är leveranstiden?" — svaras i FAQ |
| **Kundnöjdhet (NPS)** | Mått på hur nöjda kunderna är | Efter köp | Nöjda kunder återkommer och rekommenderar | "Hur sannolikt är det att du rekommenderar oss?" 0-10 |
| **Livechatt** | Realtidskommunikation med kund på sajten | Under öppettider | Snabb hjälp ökar konvertering | Kund funderar på köp → chattar → får svar → köper |

</details>

---

<br><br>

## Försäljning

<details>
<summary><strong>Försäljning & Affär</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Lead** | En potentiell kund som visat intresse | I säljprocessen | Startpunkten för varje affär | Företag hör av sig och frågar om webbshop-lösning |
| **Prospekt** | Ett lead som kvalificerats som köpredo | Efter första kontakt | Fokusera säljenergin på dem med störst chans | Företag med budget och beslutsmakt |
| **Offert** | Formellt priserbjudande till en kund | När kunden vill veta vad det kostar | Dokumenterar vad som ingår och till vilket pris | Offert på webbshop-projekt: 150 000 kr |
| **Pipeline** | Samling av alla pågående säljmöjligheter | Löpande säljuppföljning | Ger översikt över förväntade intäkter | 3 leads, 2 offerter, 1 stängt avtal = pipeline-värde |
| **Konvertering** | Lead som blir betalande kund | Målet för all försäljning | Det enda som räknas i slutändan | Offert accepteras → avtal signeras → kund |
| **Merförsäljning** | Sälja mer till befintlig kund | Vid varje kundkontakt | Billigare än att hitta ny kund | Webbshop-kund köper även SEO-tjänst |
| **Avtal** | Juridiskt bindande överenskommelse | Vid ny kund eller tjänst | Skyddar båda parter | Serviceabonnemang för drift och support |
| **Abonnemang** | Återkommande betalning för en tjänst | Månadsvis eller årsvis | Förutsägbara intäkter | 2 000 kr/mån för hosting, support och uppdateringar |
| **MRR** | Monthly Recurring Revenue — månatliga återkommande intäkter | Löpande | Mäter stabiliteten i intäkterna | 10 kunder × 2 000 kr/mån = 20 000 kr MRR |
| **Churn** | Kunder som avslutar sin tjänst | Löpande | Hög churn = ni förlorar kunder snabbare än ni skaffar | Kund säger upp sitt hostingabonnemang |

</details>

---

<br><br>

## Organisation

<details>
<summary><strong>Roller & Ansvar</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Grundare** | Person som startat företaget | Alltid | Sätter vision, kultur och riktning | Ni som driver Techpilots |
| **VD** | Verkställande direktör — ansvarar för den dagliga driften | Vid bolagsbildning | Juridiskt ansvarig för bolaget | Fattar operativa beslut |
| **Styrelse** | Organ som fattar strategiska beslut | Vid aktiebolag | Övergripande ansvar för bolaget | Beslutar om stora investeringar |
| **Organisationsschema** | Visuell bild av vem som ansvarar för vad | Vid tillväxt | Tydliggör roller och rapporteringsvägar | VD → Sälj, Teknik, Marknad |
| **Ansvarsområde** | Vad en person äger och ansvarar för | Löpande | Undviker att saker faller mellan stolarna | En person äger kundservice, en annan äger teknik |
| **KPI** | Key Performance Indicator — nyckeltal för att mäta framgång | Löpande uppföljning | Konkreta mål att styra mot | Omsättning, konverteringsgrad, NPS, MRR |
| **OKR** | Objectives and Key Results — målramverk | Kvartalsvis | Kopplar dagligt arbete till strategiska mål | Mål: öka omsättning 30% → KR: 500 nya kunder |
| **Bolagsform** | Juridisk form för företaget | Vid start | Påverkar skatt, ansvar och regler | AB (aktiebolag), enskild firma |
| **Aktiebolag (AB)** | Vanligaste bolagsformen för tillväxtbolag | Vid bolagsbildning | Begränsat personligt ansvar | Ni äger aktier — inte personligt ansvariga för bolagets skulder |
| **Enskild firma** | Enklest att starta — du och företaget är samma juridiska person | Soloföretagare | Enkelt men obegränsat personligt ansvar | Risk: företagets skulder är dina skulder |

</details>

---

<br><br>

## Juridik

<details>
<summary><strong>Juridik & GDPR</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **GDPR** | EU:s dataskyddsförordning — reglerar hantering av personuppgifter | Alltid — gäller all hantering av kunddata | Brott mot GDPR kan ge böter på miljoner | Ni måste ha laglig grund för att lagra kundernas e-post |
| **Personuppgift** | All information som kan identifiera en person | Alltid när ni hanterar kunddata | GDPR gäller för alla personuppgifter | Namn, e-post, adress, IP-adress, orderhistorik |
| **Samtycke** | Kundens aktiva godkännande till datahantering | Vid nyhetsbrev och cookies | Utan samtycke får ni inte skicka marknadsmejl | Kund bockar i "Ja, jag vill ha nyhetsbrev" |
| **Integritetspolicy** | Dokument som förklarar hur ni hanterar personuppgifter | Publicerad på sajten | Lagkrav — kunder har rätt att veta | Sida på techpilots.se som förklarar vilken data ni samlar |
| **Cookies** | Små filer som sparas i kundens webbläsare | Vid besök på sajten | Används för spårning, inloggning och analys | Google Analytics-cookie spårar besökarens beteende |
| **Cookie-banner** | Popup som ber om samtycke för cookies | Vid första besök | Lagkrav inom EU | "Vi använder cookies — Acceptera / Avvisa" |
| **Konsumenträtt** | Konsumentens rättigheter vid köp | Vid alla B2C-köp | Svensk och EU-lagstiftning skyddar konsumenter | 14 dagars ångerrätt, 3 års reklamationsrätt |
| **Ångerrätt** | Rätt att ångra nätköp inom 14 dagar | Alltid vid distanshandel | EU-lag — gäller automatiskt | Kund kan returnera utan att ange skäl |
| **Köpvillkor** | Regler för hur köp och returer hanteras | Publicerade på sajten | Juridisk grund för er relation med kunden | Sida med leveransvillkor, returpolicy, betalningsvillkor |
| **Dataskyddsombud (DPO)** | Person ansvarig för GDPR-efterlevnad | Vid behov | Krävs för vissa organisationer | Intern eller extern person som granskar datahantering |
| **Registerutdrag** | Kunds rätt att se vilken data ni har om dem | På begäran | GDPR-krav — svar inom 30 dagar | Kund begär att se sin orderhistorik och adressuppgifter |
| **Rätt att bli glömd** | Kunds rätt att få sin data raderad | På begäran | GDPR-krav | Kund vill inte längre vara kund — ni raderar all deras data |

</details>

---

<br><br>

## Affärsutveckling

<details>
<summary><strong>Strategi & Tillväxt</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Affärsmodell** | Hur företaget tjänar pengar | Vid start och vid pivot | Definierar hela verksamhetens logik | Köp produkter billigt, sälj med marginal online |
| **Sortiment** | Vilka produkter ni erbjuder | Löpande | Rätt sortiment avgör vem som handlar hos er | Fokus på Apple-produkter och tillbehör |
| **Nisch** | Smal och specifik marknad ni fokuserar på | Vid positionering | Lättare att vinna en liten marknad än en stor | "Premium Apple-produkter och tillbehör i Sverige" |
| **Konkurrensanalys** | Studera vad konkurrenter gör | Regelbundet | Förstå marknaden och hitta er fördel | Jämföra priser, sortiment och kundupplevelse mot Webhallen |
| **USP** | Unique Selling Proposition — er unika fördel | Vid all kommunikation | Varför ska kunden välja er och inte konkurrenten | "Snabbast leverans och bäst service på Apple-produkter" |
| **Prissättning** | Strategi för hur ni sätter priser | Vid nya produkter | Påverkar marginal, volym och positionering | Premiumpriser = färre kunder men högre marginal |
| **Marginal** | Skillnad mellan inköpspris och försäljningspris | Vid prissättning | Måste täcka alla kostnader och ge vinst | Inköp 8000 kr, sälj 9999 kr = 1999 kr (20%) |
| **Skalbarhet** | Förmåga att växa utan proportionellt ökade kostnader | Vid tillväxtplanering | Digital handel är skalbar — fler kunder kostar inte mycket mer | Dubbla antalet kunder utan att dubbla personalkostnaden |
| **Pivot** | Byta affärsinriktning baserat på vad marknaden vill ha | Vid strategiförändring | Bättre att ändra riktning tidigt än att köra in i väggen | Byta från generell elektronik till Apple-nisch |
| **Partnerskap** | Samarbete med annan aktör | Vid tillväxt | Når nya kunder eller kapacitet ni inte har själva | Samarbete med Apple-återförsäljare för bättre priser |

</details>

---

<br><br>

## Techpilots Studio

<details>
<summary><strong>Projektledning</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Brief** | Dokument som beskriver vad kunden vill ha | I början av varje projekt | Säkerställer att ni och kunden är överens innan arbetet startar | Kund vill ha webshop — brief beskriver mål, målgrupp, budget |
| **Offert** | Formellt priserbjudande med scope och pris | Efter brief | Dokumenterar vad som ingår och vad det kostar | Offert: "Webshop i Next.js + Medusa — 150 000 kr" |
| **Scope** | Exakt vad som ingår i projektet | Vid offert och projektstart | Förhindrar scope creep — kunden kan inte lägga till utan ny offert | "3 sidor, checkout, betalning — inget mer ingår" |
| **Scope creep** | När projektet växer utanför ursprunglig offert | Under projektet | Kostar er tid och pengar utan betalning | Kund vill ha extra funktion som inte var med i offerten |
| **Tidsplan** | Schema med milestones och deadlines | Vid projektstart | Håller projektet på spår och sätter förväntningar | Vecka 1: design, Vecka 3: utveckling, Vecka 5: lansering |
| **Milestone** | Viktig delpunkt i projektet | Under projektet | Mäter framsteg och triggar delfakturering | "Design godkänd" = milestone 1 → delfaktura skickas |
| **Delfaktura** | Faktura för en del av projektet | Vid milestones | Säkerställer betalning under projektet, inte bara vid slut | 30% vid start, 40% vid design-godkännande, 30% vid lansering |
| **Godkännande** | Kundens formella accept av leverans | Vid varje milestone | Skyddar er — kunden kan inte klaga i efterhand | Kund signerar godkännande av design innan utveckling börjar |
| **Retrospektiv** | Genomgång av vad som gick bra och dåligt | Efter avslutat projekt | Lär er för nästa projekt | "Estimeringen var för optimistisk — ta 20% buffert nästa gång" |

</details>

---

<details>
<summary><strong>Produktion</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Wireframe** | Enkel skiss av sidans layout utan design | Innan design | Snabb och billig validering av struktur | Rita upp hur startsidan ska se ut — flytta block, inte pixlar |
| **Mockup** | Detaljerad visuell design av en sida | Innan utveckling | Kunden godkänner utseendet innan koden skrivs | Figma-design som ser ut precis som den färdiga sajten |
| **Prototyp** | Klickbar mockup som simulerar flöden | Innan utveckling | Testa användarupplevelsen utan att koda | Klicka igenom checkout-flödet i Figma |
| **Figma** | Designverktyg för wireframes och mockups | Under designfasen | Branschstandard för webdesign | Designa produktsida, exportera assets till utvecklare |
| **Design system** | Samling av återanvändbara komponenter och regler | Under och efter design | Konsekvent utseende — komponenter används överallt | Knappar, typsnitt, färger definierade en gång |
| **Copywriting** | Skriva texter för sajten | Under produktion | Rätt text säljer — dålig text tappar kunder | Produktbeskrivningar, hero-texter, CTA-knappar |
| **Asset** | Designfil, bild eller ikon som används i projektet | Under utveckling | Utvecklaren behöver rätt filer i rätt format | Logotyp som SVG, produktbilder i WebP, ikoner |
| **Driftsättning** | Sätta projektet live för riktiga användare | I slutet av projektet | Det sista steget — projektet levereras | Deploy till Vercel, DNS pekas om, kunden är live |
| **Hypercare** | Intensiv support direkt efter lansering | Första 1-2 veckorna live | Buggar dyker alltid upp i produktion | Ni är extra tillgängliga de första två veckorna efter lansering |

</details>

---

---

<br><br>

## Medusa Admin

<details>
<summary><strong>Produkter & Varianter</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Produkt** | Det som säljs — med titel, beskrivning, bilder och kategorier | Lägg till ny produkt i Medusa Admin | Produkten är "mallen" — varianter är de säljbara versionerna | "NVIDIA GeForce RTX 4070 Ti Super" |
| **Variant** | Den säljbara versionen av en produkt — har pris, SKU och lager | Varje köpbar konfiguration | Det är varianten kunden faktiskt köper, inte produkten | Standard-varianten med pris 1 490 kr och SKU `RTX4070TI` |
| **Varianttitel vs produkttitel** | Varianttiteln är ett internt namn (t.ex. "Standard") — produkttiteln är vad kunden ser | I Medusa Admin | Kunden ser alltid produkttiteln — varianttiteln är bara för er interna hantering | Produkttitel: "RTX 4070 Ti Super", Varianttitel: "Standard" |
| **SKU** | Unikt lagernummer per variant | Identifierar exakt vilken variant | Lagerhantering och orderspårning | `RTX4070TI-16GB-BLK` |
| **Status** | Publicerad eller utkast | Styr om produkten syns i webshopen | Unpublished = syns inte för kunder | Sätt till "Published" när produkten är klar |
| **Thumbnail** | Huvudbild på produkten | Visas i produktlistan och på produktkortet | Första intrycket i listan | 800×800 px produktbild i WebP |
| **Media** | Alla produktbilder | På produktsidan | Flera vinklar hjälper kunden | 4–8 bilder per produkt |
| **Metadata** | Extra nyckel-värde-par som kan kopplas till produkten | Teknisk data som inte passar i standardfält | Fri text för egna ändamål | `"brand": "NVIDIA"` |

</details>

---

<details>
<summary><strong>Priser & Valutor</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Price SEK** | Standardpriset i SEK kopplat direkt till varianten | Sätts på variantnivå | Det pris som gäller om ingen region-specifik regel finns | 1 490 kr |
| **Price Sweden** | Region-specifikt pris för Sverige-regionen | Åsidosätter standardpriset för den regionen | Använd om Sverige ska ha ett annat pris än standardpriset | 1 490 kr |
| **Skillnaden** | Price SEK = globalt fallback, Price Sweden = regionspecifikt | Price Sweden vinner om båda finns | Region-priser ger möjlighet till marknadsanpassning | Samma pris i båda fall = det spelar ingen roll vilket |
| **Valuta** | Vilka valutor er butik accepterar | Konfigureras under Store → Currencies | Utan SEK kan inga SEK-priser sättas | Lägg till SEK under Store-inställningarna |
| **Inkl. moms** | Medusa-priser är exklusive moms som standard | Visa rätt pris för kund | Kontrollera att frontendens prisdisplay lägger på momsen | 1 490 kr exkl. moms → 1 862,50 kr inkl. moms |

</details>

---

<details>
<summary><strong>Regioner & Marknader</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Region** | Geografisk marknad med egna regler | Konfigureras i Medusa Admin | Styr valuta, moms, frakt och betalmetoder per land | Sverige-regionen: SEK, 25% moms |
| **Valuta per region** | Vilken valuta som används i regionen | Sätts under Regions | Kunden betalar i sin lokala valuta | Sverige → SEK |
| **Sales Channel** | Vilken försäljningskanal produkten är kopplad till | Ska vara kopplad för att syns i webshoppen | En produkt syns inte om den saknar rätt Sales Channel | Koppla produkt till "Webstore"-kanalen |
| **Skattesats** | Moms-konfiguration per region | Konfigureras i Regions | Rätt moms per land | Sverige: 25% |

</details>

---

<details>
<summary><strong>Lager & Inventering</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Manage inventory** | Toggle som aktiverar lagerspårning | På variantnivå | Om på: köp blockeras när lagret tar slut | Slå på om ni spårar lager |
| **Allow backorder** | Tillåt köp även när lager är 0 | På variantnivå | Möjliggör förbokningar | Ny telefon — kunder kan förbeställa |
| **Stock location** | Fysisk lagerplats | Kopplas till Stock Locations | Spårar var varorna faktiskt finns | "Borås-lagret" |
| **Quantity** | Antal i lager | Uppdateras vid inleverans och utleverans | Styr om produkten är köpbar | 12 st kvar |
| **Reserved** | Antal som är reserverade i pågående ordrar | Automatiskt | Förhindrar dubbel-försäljning | 2 reserverade = 10 tillgängliga av 12 |

</details>

---

<details>
<summary><strong>Ordrar & Kunder</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Order** | En genomförd beställning | Skapas vid lyckad betalning | Central enhet — kopplar kund, produkter och betalning | Order #1001 — 1 st RTX 4070 Ti, 1 490 kr |
| **Order status** | Var i flödet ordern befinner sig | Uppdateras manuellt eller automatiskt | Kommunicerar status till kund och lager | Pending → Processing → Shipped → Delivered |
| **Fulfillment** | Plocka, packa och skicka ordern | Vid orderhantering | Det fysiska steget som uppfyller ordern | Markera som "Fulfilled" när paketet lämnar lagret |
| **Return** | Kund skickar tillbaka en produkt | Initiera i Medusa Admin | Hanterar återbetalning och lageråterföring | Kund ångrar köp — skapa Return i admin |
| **Refund** | Återbetalning till kund | Vid retur eller reklamation | Stripe-återbetalning hanteras via Medusa | Återbetala 1 490 kr — Stripe krediterar kortet |
| **Customer** | En registrerad kund | Under Orders → Customers | Historik över alla köp | E-post, adress, orderhistorik |

</details>

---

<details>
<summary><strong>Inställningar — Store & Admin</strong></summary>

| Begrepp | Vad | När | Varför | Exempel |
|---|---|---|---|---|
| **Store** | Era butiksinställningar | Under Settings → Store | Styr butiksnamn, valutor och standardregion | Butiksnamn: "Techpilots" |
| **Currencies** | Vilka valutor butiken accepterar | Lägg till SEK här | Utan SEK kan inga SEK-priser sättas på varianter | Lägg till SEK → aktivera på Sweden-regionen |
| **Users** | Admin-användare med tillgång till Medusa Admin | Under Settings → Team | Styr vem som kan ändra produkter och ordrar | Lägg till kollega som admin |
| **Tax Regions** | Separata skatteregler per land/region | Under Settings → Tax Regions | Finjustera moms per marknad oberoende av Regions | Sverige: 25% standard, 12% livsmedel |
| **Return Reasons** | Förkonfigurerade anledningar kunden väljer vid retur | Under Settings → Return Reasons | Standardiserar returdata för statistik och hantering | "Defekt produkt", "Fel storlek", "Ångrat köp" |
| **Refund Reasons** | Anledningar för manuell återbetalning av admin | Under Settings → Refund Reasons | Spårar varför ni återbetalar — viktigt för bokföring | "Kundservice-kompensation", "Försenad leverans" |
| **Sales Channels** | Försäljningskanaler produkter kopplas till | Under Settings → Sales Channels | Produkt måste vara kopplad till en kanal för att synas | "Webstore" — koppla alla produkter hit |
| **Product Types** | Kategorisering av produkttyp | Under Settings → Product Types | Gruppera produkter efter typ för filtrering och rapporter | "Grafikkort", "Processor", "Tillbehör" |
| **Product Tags** | Friforma taggar på produkter | Under Settings → Product Tags | Flexibel märkning för sökning och kampanjer | "Nyhet", "Bästsäljare", "NVIDIA" |
| **Locations & Shipping** | Lagerlokationer och fraktzoner | Under Settings → Locations & Shipping | Kopplar lager till regioner och fraktregler | "Borås-lagret" kopplat till Sverige-regionen |
| **Publishable API Key** | Den publika nyckel frontend använder | Under Settings → Publishable API Keys | Identifierar er webshop mot Medusa API — säker att exponera | Sätts som `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` i Vercel |
| **Secret API Key** | Hemlig nyckel för server-till-server-anrop | Under Settings → Secret API Keys | Full åtkomst till Medusa — får aldrig exponeras i frontend | Används i backend-scripts och webhooks |
| **Workflows** | Automatiserade flöden som triggas vid händelser | Under Settings → Workflows | Kör logik automatiskt utan kod — t.ex. vid order eller retur | Skicka Slack-notis när en ny order kommer in |

</details>

---

*Senast uppdaterad: 2026-06-13*
