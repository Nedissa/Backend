# Bild-URL Fix via Cronjob

## Problem
Medusa v2 sparar uppladdade bilder med `http://localhost:9000/static/...` istället för `https://api.techpilots.se/static/...`.

## Lösning
Cronjob som postgres-användaren fixar URL:erna automatiskt varje minut.

## Crontab-konfiguration
```bash
crontab -u postgres -e
```

Innehåll:
```
PGHOST=/var/run/postgresql
* * * * * /usr/bin/psql -d medusa -c "UPDATE image SET url = REPLACE(url, 'http://localhost:9000', 'https://api.techpilots.se') WHERE url LIKE '\%localhost\%';" >> /tmp/psql_cron.log 2>&1
```

## Viktiga lärdomar
- `PGHOST=/var/run/postgresql` måste sättas - cron har ingen miljö
- `\%` måste escapas i crontab - `%` tolkas annars som radbrytning
- Logga alltid med `>> /tmp/psql_cron.log 2>&1` för att se fel
- Kör som postgres-användaren, inte root med sudo

## Manuell fix (vid behov)
```bash
sudo -u postgres psql -d medusa -c "UPDATE image SET url = REPLACE(url, 'http://localhost:9000', 'https://api.techpilots.se') WHERE url LIKE '%localhost%';"
```
