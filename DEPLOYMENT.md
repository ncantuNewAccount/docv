# 🚀 Guide de déploiement DocV avec envoi d'emails

## 📋 Prérequis

### 1. Variables d'environnement
Configurez ces variables sur votre plateforme de déploiement :

\`\`\`env
SMTP_HOST=votre-serveur-smtp
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@domaine.com
SMTP_PASSWORD=votre-mot-de-passe-application
SMTP_FROM=votre-email@domaine.com
\`\`\`

⚠️ **Important** : Utilisez toujours des mots de passe d'application, jamais vos mots de passe principaux.

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
  -e SMTP_HOST=votre-smtp-host \
  -e SMTP_PORT=587 \
  -e SMTP_USER=votre-email@domaine.com \
  -e SMTP_PASSWORD=votre-mot-de-passe \
  -e SMTP_FROM=votre-email@domaine.com \
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
- Accédez à \`/contact\`
- Remplissez et envoyez le formulaire
- Vérifiez les logs serveur
- Vérifiez la réception dans votre boîte email

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
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.sendMail({
  from: process.env.SMTP_FROM,
  to: 'test@example.com',
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

### 2. Mots de passe d'application
- ✅ Utilisez des mots de passe d'application
- ✅ Pas les mots de passe principaux des comptes
- ✅ Révocables si compromis

## 📧 Configuration par fournisseur

### Protonmail
\`\`\`env
SMTP_HOST=smtp.protonmail.ch
SMTP_PORT=587
SMTP_SECURE=false
\`\`\`

### Gmail
\`\`\`env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
\`\`\`

### Serveur SMTP dédié
\`\`\`env
SMTP_HOST=mail.votre-domaine.com
SMTP_PORT=587
SMTP_SECURE=false
\`\`\`

## 🎯 Résultat attendu

Une fois déployé avec les bonnes variables :
- ✅ Formulaires fonctionnels
- ✅ Emails HTML formatés
- ✅ Réception dans votre boîte email
- ✅ Logs de confirmation
- ✅ Gestion d'erreurs robuste

## 📞 Support

En cas de problème :
1. Vérifiez les variables d'environnement
2. Consultez les logs serveur
3. Testez la configuration SMTP manuellement
4. Vérifiez les paramètres de votre fournisseur email
