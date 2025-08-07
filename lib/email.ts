import nodemailer from 'nodemailer'

export interface ContactFormData {
  nom: string
  prenom: string
  email: string
  telephone?: string
  entreprise?: string
  fonction?: string
  typeProjet?: string
  budget?: string
  delai?: string
  description: string
  objectifs?: string
  contraintes?: string
  services: string[]
  demo: boolean
  accompagnement: boolean
}

export interface FormationFormData {
  entreprise: string
  secteur?: string
  taille?: string
  siret?: string
  nom: string
  prenom: string
  fonction?: string
  email: string
  telephone?: string
  formations: string[]
  modalite?: string
  participants?: string
  dates?: string
  lieu?: string
  objectifs?: string
  niveau?: string
  contraintes?: string
  certification: boolean
  support: boolean
  accompagnement: boolean
}

// Configuration SMTP simple et directe
function createTransporter() {
  const config = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true pour 465, false pour autres ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  }

  console.log('Configuration SMTP:', {
    host: config.host,
    port: config.port,
    user: config.auth.user,
    hasPassword: !!config.auth.pass
  })

  // Correction : utiliser la bonne méthode
  return nodemailer.createTransport(config)
}

export async function sendContactEmail(data: ContactFormData) {
  try {
    console.log('Début envoi email contact')

    // Vérification des variables d'environnement
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('Variables SMTP manquantes')
      return { success: false, error: 'Configuration email manquante' }
    }

    const transporter = createTransporter()

    const servicesText = data.services.length > 0 ? data.services.join(', ') : 'Aucun'

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.SMTP_FROM || process.env.SMTP_USER, // Envoyer à soi-même
      replyTo: data.email,
      subject: `[DocV] Contact - ${data.nom} ${data.prenom}`,
      html: `
        <h2>Nouvelle demande de contact</h2>
        <p><strong>Nom:</strong> ${data.nom}</p>
        <p><strong>Prénom:</strong> ${data.prenom}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.telephone ? `<p><strong>Téléphone:</strong> ${data.telephone}</p>` : ''}
        ${data.entreprise ? `<p><strong>Entreprise:</strong> ${data.entreprise}</p>` : ''}
        ${data.fonction ? `<p><strong>Fonction:</strong> ${data.fonction}</p>` : ''}
        ${data.typeProjet ? `<p><strong>Type de projet:</strong> ${data.typeProjet}</p>` : ''}
        ${data.budget ? `<p><strong>Budget:</strong> ${data.budget}</p>` : ''}
        ${data.delai ? `<p><strong>Délai:</strong> ${data.delai}</p>` : ''}
        
        <h3>Description</h3>
        <p>${data.description.replace(/\n/g, '<br>')}</p>
        
        ${data.objectifs ? `<h3>Objectifs</h3><p>${data.objectifs.replace(/\n/g, '<br>')}</p>` : ''}
        ${data.contraintes ? `<h3>Contraintes</h3><p>${data.contraintes.replace(/\n/g, '<br>')}</p>` : ''}
        
        <h3>Services demandés</h3>
        <p>${servicesText}</p>
        
        <h3>Options</h3>
        <p>Démonstration: ${data.demo ? 'Oui' : 'Non'}</p>
        <p>Accompagnement: ${data.accompagnement ? 'Oui' : 'Non'}</p>
        
        <hr>
        <p><small>Message envoyé depuis docv.fr le ${new Date().toLocaleString('fr-FR')}</small></p>
      `,
      text: `
Nouvelle demande de contact - DocV

Informations:
- Nom: ${data.nom}
- Prénom: ${data.prenom}
- Email: ${data.email}
${data.telephone ? `- Téléphone: ${data.telephone}` : ''}
${data.entreprise ? `- Entreprise: ${data.entreprise}` : ''}
${data.fonction ? `- Fonction: ${data.fonction}` : ''}

Projet:
${data.typeProjet ? `- Type: ${data.typeProjet}` : ''}
${data.budget ? `- Budget: ${data.budget}` : ''}
${data.delai ? `- Délai: ${data.delai}` : ''}

Description:
${data.description}

${data.objectifs ? `Objectifs:\n${data.objectifs}\n` : ''}
${data.contraintes ? `Contraintes:\n${data.contraintes}\n` : ''}

Services: ${servicesText}
Démo: ${data.demo ? 'Oui' : 'Non'}
Accompagnement: ${data.accompagnement ? 'Oui' : 'Non'}

---
Message envoyé depuis docv.fr
      `
    }

    console.log('Envoi email vers:', mailOptions.to)
    const result = await transporter.sendMail(mailOptions)
    console.log('Email envoyé avec succès:', result.messageId)
    
    return { success: true }

  } catch (error: any) {
    console.error('Erreur envoi email:', error.message)
    return { 
      success: false, 
      error: `Erreur d'envoi: ${error.message}` 
    }
  }
}

export async function sendFormationEmail(data: FormationFormData) {
  try {
    console.log('Début envoi email formation')

    // Vérification des variables d'environnement
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('Variables SMTP manquantes')
      return { success: false, error: 'Configuration email manquante' }
    }

    const transporter = createTransporter()

    const formationsText = data.formations.length > 0 ? data.formations.join(', ') : 'Aucune'

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.SMTP_FROM || process.env.SMTP_USER, // Envoyer à soi-même
      replyTo: data.email,
      subject: `[DocV] Formation - ${data.entreprise}`,
      html: `
        <h2>Demande de devis formation</h2>
        
        <h3>Entreprise</h3>
        <p><strong>Nom:</strong> ${data.entreprise}</p>
        ${data.secteur ? `<p><strong>Secteur:</strong> ${data.secteur}</p>` : ''}
        ${data.taille ? `<p><strong>Taille:</strong> ${data.taille}</p>` : ''}
        ${data.siret ? `<p><strong>SIRET:</strong> ${data.siret}</p>` : ''}
        
        <h3>Contact</h3>
        <p><strong>Nom:</strong> ${data.nom}</p>
        <p><strong>Prénom:</strong> ${data.prenom}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.telephone ? `<p><strong>Téléphone:</strong> ${data.telephone}</p>` : ''}
        ${data.fonction ? `<p><strong>Fonction:</strong> ${data.fonction}</p>` : ''}
        
        <h3>Formations demandées</h3>
        <p>${formationsText}</p>
        
        <h3>Modalités</h3>
        ${data.modalite ? `<p><strong>Mode:</strong> ${data.modalite}</p>` : ''}
        ${data.participants ? `<p><strong>Participants:</strong> ${data.participants}</p>` : ''}
        ${data.dates ? `<p><strong>Dates:</strong> ${data.dates}</p>` : ''}
        ${data.lieu ? `<p><strong>Lieu:</strong> ${data.lieu}</p>` : ''}
        
        ${data.objectifs ? `<h3>Objectifs</h3><p>${data.objectifs.replace(/\n/g, '<br>')}</p>` : ''}
        ${data.niveau ? `<p><strong>Niveau:</strong> ${data.niveau}</p>` : ''}
        ${data.contraintes ? `<h3>Contraintes</h3><p>${data.contraintes.replace(/\n/g, '<br>')}</p>` : ''}
        
        <h3>Options</h3>
        <p>Certification RNCP: ${data.certification ? 'Oui' : 'Non'}</p>
        <p>Support 6 mois: ${data.support ? 'Oui' : 'Non'}</p>
        <p>Accompagnement: ${data.accompagnement ? 'Oui' : 'Non'}</p>
        
        <hr>
        <p><small>Message envoyé depuis docv.fr le ${new Date().toLocaleString('fr-FR')}</small></p>
      `,
      text: `
Demande de devis formation - DocV

Entreprise: ${data.entreprise}
${data.secteur ? `Secteur: ${data.secteur}` : ''}
${data.taille ? `Taille: ${data.taille}` : ''}

Contact: ${data.nom} ${data.prenom}
Email: ${data.email}
${data.telephone ? `Téléphone: ${data.telephone}` : ''}

Formations: ${formationsText}

${data.modalite ? `Mode: ${data.modalite}` : ''}
${data.participants ? `Participants: ${data.participants}` : ''}
${data.dates ? `Dates: ${data.dates}` : ''}

${data.objectifs ? `Objectifs: ${data.objectifs}` : ''}
${data.contraintes ? `Contraintes: ${data.contraintes}` : ''}

Options:
- Certification: ${data.certification ? 'Oui' : 'Non'}
- Support: ${data.support ? 'Oui' : 'Non'}
- Accompagnement: ${data.accompagnement ? 'Oui' : 'Non'}

---
Message envoyé depuis docv.fr
      `
    }

    console.log('Envoi email formation vers:', mailOptions.to)
    const result = await transporter.sendMail(mailOptions)
    console.log('Email formation envoyé avec succès:', result.messageId)
    
    return { success: true }

  } catch (error: any) {
    console.error('Erreur envoi email formation:', error.message)
    return { 
      success: false, 
      error: `Erreur d'envoi: ${error.message}` 
    }
  }
}
