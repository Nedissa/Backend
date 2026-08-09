# Intern /design-galleri-sida

## Mål
En friststående, intern sida på `/design` där referensdesigner/wireframes för olika sidtyper kan samlas och visas, som gemensam utgångspunkt innan produktionskod byggs — för att undvika upprepade skärmdumps-baserade iterationer i produktionskod.

## Scope
- Ny route `/design`, helt frikopplad från `webbstudio/`-mappen (egen `layout.tsx`, ingen `SiteNav`/`Footer`).
- Renderar ett rutnät (grid) av "design-kort": bild, titel, valfri kort anteckning.
- Data i en enkel TypeScript-array (`DESIGNS`) i koden — inget CMS, ingen databas.
- Bilder sparas i `public/design/`.
- Startar tomt (`DESIGNS: []`), visar "Inga designer tillagda än" tills första kortet läggs till.
- Framtida tillägg: användaren visar en bild i chatten, Claude lägger till den som ett nytt kort via kod (redigerar `DESIGNS`-arrayen + sparar bildfilen).

## Ej i scope
- Ingen egen uppladdningsfunktion i UI.
- Ingen publik länkning från webbstudio-sajten.
- Ingen kategorisering/filtrering vid första versionen (kan läggas till senare om listan växer).
- Ingen autentisering/skydd — sidan är intern men inte lösenordsskyddad i denna version.

## Filer
- `app/design/layout.tsx` — minimal layout, ingen nav/footer.
- `app/design/page.tsx` — rutnät + tomt-state.
- `app/design/design-data.ts` — `DESIGNS`-array, typ `{ title: string; image?: string; note?: string }`.
- `public/design/` — bildmapp.
