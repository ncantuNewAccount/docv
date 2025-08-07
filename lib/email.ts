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

// Fonction de simulation d'envoi d'email pour l'environnement de développement
async function simulateEmailSend(emailData: any, type: 'contact' | 'formation'): Promise<{ success: boolean; error?: string }> {
  // Simulation d'un délai réseau
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
  
  // Log des données pour le développement
  console.log(`📧 [SIMULATION] Email ${type} envoyé:`, {
    to: 'contact@docv.fr',
    from: emailData.email,
    subject: type === 'contact' 
      ? `[DocV] Nouvelle demande de contact - ${emailData.nom} ${emailData.prenom}`
      : `[DocV] Demande de devis formation - ${emailData.entreprise}`,
    timestamp: new Date().toISOString()
  })
  
  // Simulation d'un taux de succès de 95%
  const success = Math.random() > 0.05
  
  if (success) {
    return { success: true }
  } else {
    return { success: false, error: 'Erreur de simulation réseau' }
  }
}

export async function sendContactEmail(data: ContactFormData) {
  try {
    // Dans l'environnement Next.js, nous simulons l'envoi d'email
    // En production, cette fonction utiliserait nodemailer avec un vrai serveur SMTP
    
    const servicesText = data.services.length > 0 
      ? data.services.join(', ') 
      : 'Aucun service spécifique sélectionné'

    // Préparation du contenu email (pour logging et future implémentation)
    const emailContent = {
      to: 'contact@docv.fr',
      replyTo: data.email,
      subject: `[DocV] Nouvelle demande de contact - ${data.nom} ${data.prenom}`,
      data: {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        telephone: data.telephone,
        entreprise: data.entreprise,
        fonction: data.fonction,
        typeProjet: data.typeProjet,
        budget: data.budget,
        delai: data.delai,
        description: data.description,
        objectifs: data.objectifs,
        contraintes: data.contraintes,
        services: servicesText,
        demo: data.demo,
        accompagnement: data.accompagnement
      }
    }

    // Simulation de l'envoi
    const result = await simulateEmailSend(data, 'contact')
    
    if (result.success) {
      console.log('✅ Email de contact simulé avec succès')
      return { success: true }
    } else {
      console.error('❌ Échec de simulation email contact:', result.error)
      return { success: false, error: result.error }
    }
    
  } catch (error) {
    console.error('Erreur envoi email contact:', error)
    return { success: false, error: 'Erreur lors de l\'envoi de l\'email' }
  }
}

export async function sendFormationEmail(data: FormationFormData) {
  try {
    // Dans l'environnement Next.js, nous simulons l'envoi d'email
    // En production, cette fonction utiliserait nodemailer avec un vrai serveur SMTP
    
    const formationsText = data.formations.length > 0 
      ? data.formations.join(', ') 
      : 'Aucune formation spécifique sélectionnée'

    // Préparation du contenu email (pour logging et future implémentation)
    const emailContent = {
      to: 'contact@docv.fr',
      replyTo: data.email,
      subject: `[DocV] Demande de devis formation - ${data.entreprise}`,
      data: {
        entreprise: data.entreprise,
        secteur: data.secteur,
        taille: data.taille,
        siret: data.siret,
        nom: data.nom,
        prenom: data.prenom,
        fonction: data.fonction,
        email: data.email,
        telephone: data.telephone,
        formations: formationsText,
        modalite: data.modalite,
        participants: data.participants,
        dates: data.dates,
        lieu: data.lieu,
        objectifs: data.objectifs,
        niveau: data.niveau,
        contraintes: data.contraintes,
        certification: data.certification,
        support: data.support,
        accompagnement: data.accompagnement
      }
    }

    // Simulation de l'envoi
    const result = await simulateEmailSend(data, 'formation')
    
    if (result.success) {
      console.log('✅ Email de formation simulé avec succès')
      return { success: true }
    } else {
      console.error('❌ Échec de simulation email formation:', result.error)
      return { success: false, error: result.error }
    }
    
  } catch (error) {
    console.error('Erreur envoi email formation:', error)
    return { success: false, error: 'Erreur lors de l\'envoi de l\'email' }
  }
}

// Note pour la production:
// Pour utiliser cette fonctionnalité en production avec de vrais emails,
// remplacez les fonctions simulateEmailSend par l'implémentation nodemailer:
/*
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

// Puis utilisez transporter.sendMail(mailOptions) dans chaque fonction
*/
