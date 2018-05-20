
### Website Adressen

- Lokal: File manuell im Browser öffnen
- Dev: http://quodera.com-dev.s3-website.eu-central-1.amazonaws.com
- Prod https://www.quodera.com

### Lokales Development

- npm install
- npm start

### Deployment

- AWS CLI installieren `install:aws_cli`
- AWS IAM Credentials von Lucas holen (zB per Wormhole)
- In `/home/XXX` Odner `.aws` anlegen und credentials dort ablegen
- `npm run deploy:dev`
- Falls Änderungen sofort redistributiert werden sollen, CloudFront Cache über AWS Webinterface löschen

