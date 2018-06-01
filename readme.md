# Quodera Website

## Entwicklung
### Quelldateien & Überblick
Die Entwicklungsdateien befinden sich im `src/` Ordner. Alle auf der Website angezeigten HTML Dateien befinden sich direkt in diesem Ordner. Sie verlinken auf globale Javascript und CSS Bundles, welche über `Gulp` gebaut wird.

Wir nutzen wir [Handlebars](https://handlebarsjs.com/) Templates, um modulare Komponenten zu entwickeln. Diese werden in den HTML Dateien referenziert und über `Gulp` gebildet sowie in die HTML Dateien eingefügt. Die Templates liegen unter `templates/` und haben alle die `.hbs` Endung. Ein Template kann einfach über `{{> Dateiname ohne Endung}}` (z.B. `{{> header}}`) eingebunden werden (siehe auch die Handlebars Doku). Attribute kann man auch an die Templates weitergeben. Z.B. kann man an das head.hbs Template den Titel und die Beschreibung einer Seite weitergeben: `{{> head title="Das sind unsere Leistungen" description="Unsere Leistungen sind sehr toll."}}`. Wenn es sich um mehr Text handelt, wie bei den _Anwendungsgebieten_, dann steht der Text in `data/context.json`. Auf diesen kann man dann einfach in Handlebars über den Schlüsselnamen im JSON zugreifen (z.B. servicesApplicationAreas).

Als Icons nutzen wir SVG Dateien. Damit wir diese Modular in HTML Nutzen können, haben wir ein `Gulp` Skript geschrieben, welches SVGs in `icons/` automatisch in `Handlebars Templates` umwandelt. Der Name der Templates setzt sich aus dem SVG Namen plus dem `icon` Prefix zusammen. D.h. diese können dann über z.B. `{{> icon-idea}}` in HTML eingebunden werden (idea.svg heißt das Icon).

Für mehr Dynamik in CSS nutzen wir Less. Dadurch können wir pro Komponente eine Less Datei entwickeln. Diese werden dann in `styles.less` importiert. Fremdbibliotheken wie `Bootstrap` werden in `css/libs/` eingefügt.

Unser JavaScript Code steht unter `js/`. Wir haben aktuell sehr wenig Code, sodass es sich nicht lohnt ihn in Koponenten zu zerlegen. Alle Fremdbibliotheken wie z.B. jQuery befinden sich in `js/libs/`. Ein `Gulp` Task packt alle JavaScript Dateien zusammen in eine `bundle.js` Datei, die alle HTML Dateien referenzieren.

Hier nochmal ein Dateiüberblick:
- Bilder in `assets/img/`
- Less und CSS Dateien in `css/` und Fremdbibliotheken in `css/libs/`
- Daten für die Handlebars Templates in `data/`
- Fonts in `fonts/` (wird glaube ich aktuell nicht genutzt)
- SVG Icons in `icons/`
- JavaScript Dateien in `js/` und Fremdbibliotheken in `js/libs/`
- Handlebars Templates in `templates/` und automatisch generierte Icon Templates aus `icons/` in `templates/icons/`

### Buildprozess

Alles wird über `Gulp` gebaut und befindet sich in `gulpfile.js`. Nach dem erfolgreichen Build befindet sich alles unter `dist/`. Es gibt die folgenden Tasks:

- build-html: Baut die Templates, fügt sie in das HTML ein und schreibt das die HTML-Ergebnisse direkt nach `dist/`
- build-js: Baut eine einzelne bundle.js Datei. Wenn die Umgebungsvariable `NODE_ENV=production` gesetzt wird, dann minimiert sie das JavaScript (das ist der Fall im Production Build)
- compile-less: Kompiliert alle Less Dateien in die `styles.css` unter `src/css/`
- build-css: Baut eine einzelne bundle.css Datei aus `styles.css` und den Fremdbibliotheken. Vorher wird der Task `compile-less` ausgeführt. Wenn die Umgebungsvariable `NODE_ENV=production` gesetzt wird, dann minimiert sie das CSS (das ist der Fall im Production Build)
- build-assets: Alles was in `assets/`, `fonts/` steht wird kopiert. Das Favicon aus `assets/img/favicon.ico` wird in den root von `dist` kopiert. Die Icons werden in Handlebars Templates verwandelt indem sie nach `src/templates/icons` kopiert werden und der Dateiname angepasst wird
- watch: Ruft bei Änderungen der Quelldateien den jeweiligen Task auf, sodass man nicht manuell im Entwicklungsprozess builden muss
- build: Führt alle Build Prozesse einmal aus

**In der Entwicklung sollte jedoch alles über npm ausgeführt werden!** Führt deshalb folgendes aus:

Buildprozess starten und index.html im Browser öffnen
```
npm start
```
Buildergebnis löschen
```
npm run clean
```

Development Build ausführen
```
npm run build:dev
```

Production Build ausführen
```
npm run build:prod
```

## Deployment

Wir deployen unsere Website, indem wir die gebauten Dateien in zwei S3 Bucket hochladen: Eins für den Development und eins für den Production Build. **Dafür braucht man jedoch die AWS Rechte in Form von Credentials einer IAM Rolle. Diese bekommt ihr von Lucas bei Bedarf. Ihr müsst in eurem `/home/XXX` Ordner (z.B. /home/lucas/) den Ordner `.aws` anlegen und die credentials dort ablegen. Dann führt ihr `npm run install:aws_cli` aus (ihr braucht dafür pip).**

Folgendes müsst ihr für das Deployment ausführen:

Developement Deployment
```
npm run deploy:dev
```

Production Deployment
```
npm run deploy:prod
```

Es wird danach immer der Browser mit der Startseite geöffnet, wodurch ihr testen könnt, ob das Deployment erfolgreich war und keine Fehler vorhanden sind.

### Website Adressen

- Lokal: File manuell im Browser öffnen
- Dev in S3: http://quodera.com-dev.s3-website.eu-central-1.amazonaws.com
- Prod in S3: http://quodera.com.s3-website.eu-central-1.amazonaws.com
- Prod mit Cloudfront https://www.quodera.com

Achtung: *Falls Änderungen sofort redistributiert werden sollen, CloudFront Cache über AWS Webinterface löschen*
