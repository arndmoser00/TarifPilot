# TarifPilot

TarifPilot ist ein deutschsprachiges Ratgeber- und Vergleichsportal für Mobilfunk, Internet, Streaming und Energie. Die Website läuft statisch auf GitHub Pages. Es werden keine Datenbank, kein kostenpflichtiges Hosting und kein eigener Server benötigt.

## GitHub Pages: korrigierte Bereitstellung

Die weiße Seite unter `https://arndmoser00.github.io/TarifPilot/` entstand, weil GitHub Pages die unbearbeitete Quellcode-`index.html` auslieferte. Diese Datei enthält noch `%BASE_URL%` und `<script type="module" src="/src/main.tsx">`; Browser können TSX-Quelldateien nicht direkt ausführen. Im Repository lagen zudem nicht alle extrahierten Projektdateien (`src/`, `public/`, `scripts/`) vor, sodass der Pages-Build nicht erfolgreich laufen konnte.

Dieses Projekt ist jetzt vollständig korrigiert:

- Der GitHub-Pages-Basispfad ist `/TarifPilot/` (siehe `vite.config.js`, das die ursprüngliche `vite.config.ts` erweitert).
- `npm run build` erzeugt `dist/` und rendert alle statischen Routen über `scripts/postbuild.mjs`.
- Der Workflow `.github/workflows/deploy.yml` installiert Abhängigkeiten, prüft TypeScript, baut mit `/TarifPilot/` und veröffentlicht `dist/` über GitHub Actions.

**Wichtig beim Upload:** Den Inhalt der ZIP-Datei in das Repository-Root extrahieren, nicht die ZIP-Datei selbst als Projekt hochladen. Danach in GitHub unter **Settings → Pages → Build and deployment → Source** die Option **GitHub Actions** auswählen und den Workflow **Deploy TarifPilot to GitHub Pages** ausführen.

## Vor der Veröffentlichung

1. In `src/App.tsx` bei `impressum`, `kontakt` und `datenschutz` alle gekennzeichneten Angaben durch die tatsächlichen Betreiber- und Kontaktdaten ersetzen. Nicht zutreffende Pflichtangaben entsprechend anpassen. Eine erreichbare E-Mail-Adresse einrichten und auf Kontaktseite, im Impressum und im Datenschutz ergänzen.
2. Impressum, Datenschutzerklärung, Hosting und die tatsächlich benötigten Pflichtangaben für die eigene Betreiberkonstellation fachkundig prüfen lassen. Insbesondere internationale Datenübermittlung und Protokollierung durch GitHub Pages prüfen. Die vorhandenen Texte sind keine Rechtsberatung.
3. Inhalte und externe Quellen regelmäßig auf Aktualität überprüfen. Die Website enthält bewusst keine Live-Preise, Anbieterangebote, Affiliate-Links oder behaupteten Partnerschaften.

## Kostenlos auf GitHub Pages veröffentlichen

**Wichtig zur geplanten Monetarisierung:** GitHub untersagt GitHub Pages unter anderem für den Betrieb eines Onlinegeschäfts und für Websites, die hauptsächlich kommerzielle Transaktionen vermitteln. Ob ein späteres Affiliate-Vergleichsportal im konkreten Betrieb zulässig ist, muss vor der Monetarisierung anhand der [GitHub-Pages-Nutzungsgrenzen](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) und gegebenenfalls mit GitHub geklärt werden. Falls nicht, ist ein dafür zugelassener statischer Hostinganbieter nötig. Die aktuelle Fassung enthält keine Affiliate-Links oder Live-Angebote.

1. Ein öffentliches Repository auf GitHub erstellen, zum Beispiel `tarifpilot`. Mit GitHub Free ist GitHub Pages für öffentliche Repositories verfügbar.
2. Den gesamten Projektinhalt einschließlich `.github/workflows/deploy.yml` und `package-lock.json` in das Repository auf den Branch `main` hochladen. Die Ordner `node_modules` und `dist` werden nicht benötigt.
3. Im Repository **Settings → Pages → Build and deployment → Source → GitHub Actions** wählen.
4. Unter **Actions** den Workflow „Deploy TarifPilot to GitHub Pages“ ausführen lassen. Er startet bei jedem Push auf `main` automatisch und kann auch manuell gestartet werden.
5. Nach erfolgreichem Deployment ist die Projektseite normalerweise unter `https://BENUTZERNAME.github.io/REPOSITORY/` erreichbar. Bei einem Repository namens `BENUTZERNAME.github.io` lautet die Adresse `https://BENUTZERNAME.github.io/`.

Der Workflow ist auf `https://arndmoser00.github.io/TarifPilot/` vorkonfiguriert. Er baut das Projekt mit dem Vite-Basispfad `/TarifPilot/` und erzeugt für alle Themen, Ratgeber und Informationsseiten direkt aufrufbare HTML-Dateien. Zusätzlich entstehen `404.html`, `robots.txt`, eine Sitemap mit den tatsächlichen absoluten URLs und `.nojekyll`.

Bei abweichendem Hauptbranch den Branch-Namen in `.github/workflows/deploy.yml` anpassen. Für eine eigene Domain oder einen anderen Repository-Namen müssen `base` in `vite.config.js`, `--base` im Workflow und `SITE_URL` auf die vollständige öffentliche Adresse gesetzt werden.

## Lokal entwickeln

Voraussetzung: Node.js 20 oder neuer.

```bash
npm install
npm run dev
```

Die von Vite angezeigte lokale Adresse im Browser öffnen. Wegen des GitHub-Pages-Basispfads liegt die lokale Entwicklungsumgebung unter `http://localhost:5173/TarifPilot/`. Änderungen an Texten und Ratgebern stehen in `src/content.ts`; Bildzuordnung, FAQ und Vor-/Nachteile stehen in `src/editorial.ts`. Layout, Navigation und Informationsseiten stehen in `src/App.tsx`, das Design in `src/index.css`.

Für ein bekanntes Veröffentlichungsdatum kann beim jeweiligen Artikel in `src/content.ts` das optionale Feld `publishedAt` im Format `JJJJ-MM-TT` ergänzt werden. Ohne bestätigtes Datum zeigt die Seite bewusst keinen erfundenen Zeitpunkt. Die Newsletter-Anmeldung ist rein visuell vorbereitet und deaktiviert; es werden keine E-Mail-Adressen erfasst. Vor einer späteren Aktivierung sind ein geeigneter Dienst, Einwilligung und Datenschutzhinweise erforderlich.

## Produktionsbuild prüfen

Für die korrigierte GitHub-Pages-Vorschau:

```bash
npm run build
npm run preview
```

`npm run build` erzeugt `dist/` mit der Basis `/TarifPilot/` und führt `scripts/postbuild.mjs` automatisch aus. Die Vorschau liegt anschließend unter `http://localhost:4173/TarifPilot/`.

Für eine andere öffentliche Adresse kann der Build überschrieben werden:

```bash
SITE_URL=https://BENUTZERNAME.github.io/REPOSITORY/ npm run build -- --base=/REPOSITORY/
```

`SITE_URL` muss die tatsächliche öffentliche Adresse inklusive abschließendem Repository-Pfad enthalten. `scripts/postbuild.mjs` rendert die Inhalte statisch, setzt Canonical- und Open-Graph-Angaben und erzeugt Sitemap, Robots und 404-Seite.

Die optionale Browserprüfung benötigt einmalig Chromium:

```bash
npx playwright install chromium
BASE_PATH=/TarifPilot/ node scripts/verify-site.mjs
```

Auf Linux-Systemen ohne die nötigen Browserbibliotheken kann zusätzlich `npx playwright install-deps chromium` erforderlich sein. Der Test erwartet einen zuvor mit demselben Basispfad erzeugten Produktionsbuild. Er prüft direkte Seitenaufrufe, interne Links, Metadaten, Suche, Filter, Tarifvergleich, Cookie-Einstellungen sowie Desktop- und Mobilansichten.

## Ratgeber, Blog und Vergleich

Der Menüpunkt **Ratgeber** öffnet die eigenständige Blog- und Archivseite `ratgeber/`. Dort lassen sich alle 21 ausführlichen Artikel nach Themenwelt filtern; jeder Ratgeber besitzt eine eigene statisch gerenderte Seite unter `ratgeber/<slug>/`. Die Artikel liegen weiterhin in `src/content.ts`, Bildzuordnungen und FAQ in `src/editorial.ts`.

Die Seite `vergleich/` enthält einen bedienbaren Tarifvergleich mit Kategorien, Filter, Sortierung und einer Gegenüberstellung von bis zu drei Tarifen. **Die zwölf Datensätze in `src/comparisonData.ts` sind ausdrücklich frei erfundene Beispieldaten.** Anbieter wie „MusterNetz“ oder „MusterStrom“ existieren nicht als angebliche Partner; Preise und Leistungen sind keine Marktangaben. Die Oberfläche kennzeichnet dies an mehreren Stellen. Vor dem Austausch gegen echte Daten müssen mindestens Quelle, Erhebungsdatum, Verfügbarkeit, Preisbestandteile und Bedingungen für jeden Datensatz geprüft werden. Ohne diese Prüfung ist die Tabelle eine reine Funktionsdemo und darf nicht als echter Marktüberblick beworben werden.

`src/integrations.ts` enthält vorbereitete Typen für spätere verifizierte Angebote, Affiliate-Links, Widgets und Banner, aber keine aktive Verbindung zu einem Netzwerk. `ComparisonSlot` in `src/App.tsx` bleibt der Ansatzpunkt für die redaktionelle Checkliste.

Nach einer tatsächlichen Zulassung können beispielsweise offizielle CommunicationAds-Werkzeuge anhand der dann gültigen Dokumentation integriert werden. Zugangsdaten dürfen nicht in die öffentlich ausgelieferten Dateien geschrieben werden. Vor einer Integration müssen unter anderem Datenquelle, Aktualität, Marktabdeckung, Sortierung, Werbekennzeichnung und gegebenenfalls eine rechtskonforme Einwilligung geklärt und technisch umgesetzt werden. Die Seiten zu Datenschutz, Cookies, Affiliate-Hinweis und Vergleichsmethoden sind dann entsprechend zu aktualisieren.

Eine spätere Bewerbung bei einem Affiliate-Netzwerk ist möglich; eine Zulassung, Integration oder Partnerschaft wird hier nicht vorausgesetzt oder behauptet.

## Bildnachweise

- Das Titelbild, das Streamingbild und das Energiebild wurden für TarifPilot generiert.
- Smartphone: [Kampus Production / Pexels](https://www.pexels.com/de-de/foto/mann-person-smartphone-sitzung-7555850/).
- Internet: [Pavel Danilyuk / Pexels](https://www.pexels.com/de-de/foto/laptop-arbeiten-internet-sitzung-7055847/).
- Router: [Pascal / Pexels](https://www.pexels.com/de-de/foto/moderner-wifi-6-router-auf-holzschreibtisch-32698507/).
- SIM-Karte: [Pascal / Pexels](https://www.pexels.com/de-de/foto/leuchtend-blaue-sim-karte-mit-abnehmbarem-mikrochip-33092906/).
- Glasfaser: [Atlantic Ambience / Pexels](https://www.pexels.com/de-de/foto/blau-grun-farben-beleuchtet-12932191/).
- Mobile Nutzung: [Roberto Hund / Pexels](https://www.pexels.com/de-de/foto/stadt-frau-tasse-wolkenkratzer-5356635/).
- Hausanschluss: [Jan van der Wolf / Pexels](https://www.pexels.com/de-de/foto/modernes-apartmentgebaude-vor-strahlend-blauem-himmel-37224965/).
- Mobilfunknetz: [Ulrick Trappschuh / Pexels](https://www.pexels.com/de-de/foto/verbindung-technologie-turm-turme-15407743/).
- Kostenvergleich: [SHVETS production / Pexels](https://www.pexels.com/de-de/foto/frau-laptop-arbeiten-technologie-9052858/).

Die Bilder und die Schrift werden lokal mit der Website ausgeliefert; beim bloßen Seitenaufruf werden keine externen Bild- oder Schriftserver eingebunden.