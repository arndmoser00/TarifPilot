export type FaqItem = { question: string; answer: string };
export type ArticleVisual = { file: string; alt: string };

export const categoryVisuals: Record<string, ArticleVisual> = {
  'mobilfunk': { file: 'mobilfunk.jpg', alt: 'Ein Mann nutzt sein Smartphone zu Hause' },
  'sim-only-prepaid': { file: 'sim-cover.jpg', alt: 'Eine SIM-Karte auf dunklem Hintergrund' },
  'internet-dsl': { file: 'router-cover.jpg', alt: 'Ein WLAN-Router auf einem Schreibtisch' },
  'glasfaser-kabel': { file: 'fiber-cover.jpg', alt: 'Leuchtende Glasfasern aus nächster Nähe' },
  '5g-unlimited': { file: '5g-cover.jpg', alt: 'Eine Frau nutzt ihr Smartphone unterwegs in der Stadt' },
  'streaming-tv': { file: 'streaming.jpg', alt: 'Zwei Menschen verbringen einen Filmabend zu Hause' },
  'strom-gas': { file: 'energy-cover.jpg', alt: 'Eine Hand stellt das Thermostat an einem Heizkörper ein' },
};

export const articleVisuals: Record<string, ArticleVisual> = {
  'telekom-vodafone-o2-netze': { file: 'network-cover.jpg', alt: 'Ein Mobilfunkmast vor blauem Himmel' },
  'datenvolumen-im-alltag': { file: '5g-cover.jpg', alt: 'Eine Frau nutzt ihr Smartphone unterwegs in der Stadt' },
  'sim-only-oder-handyvertrag': { file: 'mobilfunk.jpg', alt: 'Ein Mann nutzt sein Smartphone zu Hause' },
  'esim-oder-klassische-sim': { file: '5g-cover.jpg', alt: 'Eine Frau nutzt ihr Smartphone unterwegs in der Stadt' },
  'guenstigen-internetanbieter-finden': { file: 'internet.jpg', alt: 'Eine Frau arbeitet an einem Laptop zu Hause' },
  'internetgeschwindigkeit-mbit': { file: 'internet.jpg', alt: 'Eine Frau arbeitet an einem Laptop zu Hause' },
  'glasfaser-hausanschluss': { file: 'house-cover.jpg', alt: 'Ein modernes Wohngebäude mit mehreren Wohnungen' },
  'kabelinternet-oder-dsl': { file: 'router-cover.jpg', alt: 'Ein WLAN-Router auf einem Schreibtisch' },
  '5g-oder-lte': { file: 'network-cover.jpg', alt: 'Ein Mobilfunkmast vor blauem Himmel' },
  'streaming-datenverbrauch': { file: '5g-cover.jpg', alt: 'Eine Frau nutzt ihr Smartphone unterwegs in der Stadt' },
  'stromtarife-vergleichen': { file: 'bills-cover.jpg', alt: 'Eine Frau prüft Unterlagen und berechnet Ausgaben zu Hause' },
  'grundversorgung-oder-sondertarif': { file: 'bills-cover.jpg', alt: 'Eine Frau prüft Unterlagen und berechnet Ausgaben zu Hause' },
};

export const homeFaqs: FaqItem[] = [
  { question: 'Zeigt TarifPilot aktuelle Tarifangebote?', answer: 'Noch nicht. TarifPilot bietet derzeit redaktionelle Ratgeber und eine Vergleichs-Checkliste, aber keine Live-Preise oder Anbieterangebote. Konkrete Konditionen solltest du direkt beim Anbieter prüfen.' },
  { question: 'Wie finde ich den passenden Ratgeber?', answer: 'Nutze die Suche auf der Startseite oder wähle eine Themenwelt. In jedem Artikel findest du verwandte Ratgeber und weiterführende Informationen.' },
  { question: 'Wie geht TarifPilot mit Werbung um?', answer: 'Aktuell sind keine Affiliate-Links oder Werbebanner eingebunden. Sollten später kommerzielle Verweise hinzukommen, werden sie transparent gekennzeichnet und redaktionelle Inhalte davon getrennt.' },
];

export const comparisonFaqs: FaqItem[] = [
  { question: 'Sind die angezeigten Tarife echte Angebote?', answer: 'Nein. Die Tarifvergleichstabelle arbeitet aktuell ausschließlich mit frei erfundenen Musterdaten. Sie dient dazu, die Funktion und die relevanten Vergleichskriterien zu zeigen. Es werden keine aktuellen Marktpreise oder Partnerschaften behauptet.' },
  { question: 'Kann ich die Tarife direkt beim Anbieter abschließen?', answer: 'Nein. Es sind keine Buchungs- oder Affiliate-Links eingebunden. Konkrete Verträge lassen sich derzeit nur direkt und eigenständig bei einem Anbieter prüfen.' },
  { question: 'Was sollte ich vor einem echten Tarifvergleich prüfen?', answer: 'Vergleiche Verfügbarkeit, Leistung, alle Kosten über die Laufzeit und die Bedingungen nach einer Rabattphase. Bei Energie kommen Jahresverbrauch, Arbeitspreis, Grundpreis und Preisgarantie hinzu.' },
];

export const categoryFaqs: Record<string, FaqItem[]> = {
  'mobilfunk': [
    { question: 'Welches Mobilfunknetz passt zu mir?', answer: 'Prüfe die Abdeckung an den Orten, an denen du dein Smartphone regelmäßig nutzt. Auch Gerät, Gebäude und die freigeschalteten Tarifleistungen beeinflussen das Ergebnis.' },
    { question: 'Wie viel Datenvolumen brauche ich?', answer: 'Deine Smartphone-Einstellungen oder die letzten Rechnungen zeigen deinen bisherigen Verbrauch. Berücksichtige zusätzlich Reisen, Streaming und die Nutzung als Hotspot.' },
  ],
  'sim-only-prepaid': [
    { question: 'Was bedeutet SIM-Only?', answer: 'Ein SIM-Only-Tarif enthält kein neues Smartphone. Du nutzt dein vorhandenes Gerät weiter oder kaufst ein Gerät unabhängig vom Mobilfunktarif.' },
    { question: 'Kann ich meine Rufnummer mitnehmen?', answer: 'Eine Rufnummernmitnahme ist grundsätzlich möglich. Gleiche deine Kundendaten ab und kläre den konkreten Ablauf rechtzeitig mit dem bisherigen und dem neuen Anbieter.' },
  ],
  'internet-dsl': [
    { question: 'Wie schnell muss mein Internet sein?', answer: 'Das hängt davon ab, wie viele Geräte gleichzeitig genutzt werden und ob du beispielsweise im Homeoffice arbeitest oder Videos streamst. Auch der Upload und eine stabile WLAN-Verbindung zählen.' },
    { question: 'Was gehört zu den Gesamtkosten?', answer: 'Berücksichtige neben den monatlichen Gebühren auch Bereitstellung, Versand und gegebenenfalls Routerkosten. Prüfe außerdem den Preis nach einer Rabattphase.' },
  ],
  'glasfaser-kabel': [
    { question: 'Ist Glasfaser an meiner Adresse verfügbar?', answer: 'Das hängt vom Ausbau vor Ort ab. Prüfe die Adresse beim Anbieter und kläre, ob die Glasfaser bereits bis zum Gebäude oder bis in die Wohnung führt.' },
    { question: 'Sind Kabelinternet und Fernsehen dasselbe?', answer: 'Nein. Der Anschluss kann für unterschiedliche Dienste genutzt werden. Ob Fernsehen enthalten ist und welche Kosten entstehen, steht im konkreten Vertrag.' },
  ],
  '5g-unlimited': [
    { question: 'Brauche ich für 5G ein neues Smartphone?', answer: 'Das Gerät muss 5G unterstützen. Zusätzlich benötigst du einen Tarif mit 5G-Zugang und Netzversorgung an deinem Standort.' },
    { question: 'Ist Unlimited auch im Ausland unbegrenzt?', answer: 'Nicht unbedingt. Für Roaming können eigene Daten- oder Fair-Use-Regeln gelten. Lies vor einer Reise die Bedingungen für dein Zielland.' },
  ],
  'streaming-tv': [
    { question: 'Worauf sollte ich bei Streaming-Abos achten?', answer: 'Vergleiche die aktuell verfügbaren Inhalte, unterstützten Geräte, parallelen Streams und die Kündigungsbedingungen. Addiere die Kosten aller genutzten Abos.' },
    { question: 'Verbraucht Streaming mobile Daten?', answer: 'Ja, wenn du über Mobilfunk statt WLAN schaust. Der Verbrauch hängt unter anderem von Qualität, Dauer und der jeweiligen Anwendung ab.' },
  ],
  'strom-gas': [
    { question: 'Welche Angaben brauche ich für einen Energievergleich?', answer: 'Hilfreich sind dein Jahresverbrauch in Kilowattstunden, die Postleitzahl und die Daten deines bisherigen Vertrags. Bei einem Wechsel wird häufig auch die Zählernummer benötigt.' },
    { question: 'Was ist der Unterschied zwischen Grund- und Arbeitspreis?', answer: 'Der Grundpreis ist ein regelmäßiger fixer Betrag. Der Arbeitspreis wird pro verbrauchter Kilowattstunde berechnet. Für einen Vergleich solltest du beide Bestandteile berücksichtigen.' },
  ],
};

export type Tradeoffs = { subject: string; positives: string[]; considerations: string[] };
export const articleTradeoffs: Record<string, Tradeoffs> = {
  'sim-only-oder-handyvertrag': { subject: 'SIM-Only', positives: ['Vorhandenes Smartphone weiterverwenden', 'Gerätekauf und Tarifkosten getrennt vergleichen'], considerations: ['Ein neues Gerät muss separat gekauft werden', 'Auch SIM-Tarife können eine Mindestlaufzeit haben'] },
  'prepaid-oder-vertrag': { subject: 'Prepaid', positives: ['Guthaben und Ausgaben unmittelbar im Blick', 'Für flexible oder seltene Nutzung interessant'], considerations: ['Guthaben muss rechtzeitig aufgeladen werden', 'Automatische Optionen und Gültigkeit prüfen'] },
  'dsl-oder-glasfaser': { subject: 'Glasfaser', positives: ['Technisch hohe Datenraten möglich', 'Je nach Tarif auch hohe Upload-Leistung'], considerations: ['Ausbau und Leitungsweg vor Ort prüfen', 'Installation und Geräte können zusätzliche Kosten verursachen'] },
  'kabelinternet-oder-dsl': { subject: 'Kabelinternet', positives: ['Nutzung eines ausgebauten TV-Kabelnetzes', 'Je nach Angebot hohe Downloadraten möglich'], considerations: ['Verfügbarkeit und geeignete Kabeldose prüfen', 'Die Auslastung des Netzsegments kann eine Rolle spielen'] },
  '5g-oder-lte': { subject: '5G', positives: ['Je nach Standort und Tarif hohe Kapazität möglich', 'Für intensive mobile Nutzung interessant'], considerations: ['Passendes Gerät und freigeschalteter Tarif nötig', 'Ein 5G-Symbol garantiert kein bestimmtes Tempo'] },
  'grundversorgung-oder-sondertarif': { subject: 'Sondertarif', positives: ['Individuelle Vertragsmodelle sind möglich', 'Preisgarantie kann Planung erleichtern'], considerations: ['Laufzeit und Kündigungsfrist genau lesen', 'Boni und Garantieumfang sorgfältig prüfen'] },
};