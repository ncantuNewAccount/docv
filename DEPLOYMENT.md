# 🚀 Guide de déploiement DocV avec envoi d'emails

## 📋 Prérequis

### 1. Variables d'environnement
Configurez ces variables sur votre plateforme de déploiement :

\`\`\`env
SMTP_HOST=smtp.protonmail.ch
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@docv.fr
SMTP_PASSWORD=YLRLZ6Z837ZU57BB
SMTP_FROM=contact@docv.fr
\`\`\`

## 🌐 Déploiement sur Vercel

### 1. Installation Vercel CLI
\`\`\`bash
npm i -g vercel
\`\`\`

### 2. Configuration des variables
\`\`\`bash
vercel env add SMTP_HOST
vercel env add SMTP_PORT
vercel env add SMTP_SECURE
vercel env add SMTP_USER
vercel env add SMTP_PASSWORD
vercel env add SMTP_FROM
\`\`\`

### 3. Déploiement
\`\`\`bash
vercel --prod
\`\`\`

## 🔧 Déploiement sur Netlify

### 1. Variables d'environnement
Dans le dashboard Netlify :
- Site settings > Environment variables
- Ajoutez toutes les variables SMTP

### 2. Build settings
\`\`\`toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
\`\`\`

## 🐳 Déploiement Docker

### 1. Dockerfile
\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### 2. Variables d'environnement
\`\`\`bash
docker run -d \
  -p 3000:3000 \
  -e SMTP_HOST=smtp.protonmail.ch \
  -e SMTP_PORT=587 \
  -e SMTP_USER=contact@docv.fr \
  -e SMTP_PASSWORD=YLRLZ6Z837ZU57BB \
  -e SMTP_FROM=contact@docv.fr \
  docv-app
\`\`\`

## ✅ Test de l'envoi d'emails

### 1. Vérification des variables
\`\`\`bash
# Sur votre serveur
echo $SMTP_HOST
echo $SMTP_USER
\`\`\`

### 2. Test des formulaires
- Accédez à `/contact`
- Remplissez et envoyez le formulaire
- Vérifiez les logs serveur
- Vérifiez la réception à contact@docv.fr

## 🔍 Debugging

### 1. Logs serveur
\`\`\`bash
# Vercel
vercel logs

# Netlify
netlify logs

# Docker
docker logs container-name
\`\`\`

### 2. Test SMTP manuel
\`\`\`javascript
// test-smtp.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.protonmail.ch',
  port: 587,
  secure: false,
  auth: {
    user: 'contact@docv.fr',
    pass: 'YLRLZ6Z837ZU57BB',
  },
});

transporter.sendMail({
  from: 'contact@docv.fr',
  to: 'contact@docv.fr',
  subject: 'Test SMTP',
  text: 'Test de configuration SMTP'
}).then(() => {
  console.log('✅ SMTP fonctionne');
}).catch(err => {
  console.error('❌ Erreur SMTP:', err);
});
\`\`\`

## 🔐 Sécurité

### 1. Variables d'environnement
- ✅ Jamais dans le code source
- ✅ Configurées sur la plateforme de déploiement
- ✅ Différentes par environnement (dev/prod)

### 2. Mot de passe d'application
- ✅ Utilisez un mot de passe d'application Protonmail
- ✅ Pas le mot de passe principal du compte
- ✅ Révocable si compromis

## 📧 Configuration alternative

### Gmail
\`\`\`env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
\`\`\`

### Serveur SMTP dédié
\`\`\`env
SMTP_HOST=mail.docv.fr
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@docv.fr
SMTP_PASSWORD=your-password
\`\`\`

## 🎯 Résultat attendu

Une fois déployé avec les bonnes variables :
- ✅ Formulaires fonctionnels
- ✅ Emails HTML formatés
- ✅ Réception à contact@docv.fr
- ✅ Logs de confirmation
- ✅ Gestion d'erreurs robuste
