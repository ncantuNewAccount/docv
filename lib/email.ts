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

// Fonction de simulation pour l'environnement next-lite
async function simulateEmailSend(data: any, type: 'contact' | 'formation'): Promise<{ success: boolean; error?: string }> {
  console.log(`📧 [SIMULATION] Email ${type} - Environnement de développement`)
  console.log('Données:', {
    to: 'contact@docv.fr',
    from: data.email,
    subject: type === 'contact' 
      ? `[DocV] Nouvelle demande de contact - ${data.nom} ${data.prenom}`
      : `[DocV] Demande de devis formation - ${data.entreprise || data.nom}`,
    timestamp: new Date().toISOString()
  })

  // Simulation d'un délai réseau
  await new Promise(resolve => setTimeout(resolve, 1500))
  return { success: true }
}

export async function sendContactEmail(data: ContactFormData) {
  try {
    console.log('🚀 DÉBUT sendContactEmail')
    
    // Dans l'environnement next-lite, nous simulons l'envoi
    console.log('⚠️ Environnement next-lite détecté - Simulation d\'envoi d\'email')
    return await simulateEmailSend(data, 'contact')
    
  } catch (error: any) {
    console.error('❌ Erreur dans sendContactEmail:', error.message)
    return { 
      success: false, 
      error: `Erreur: ${error.message}` 
    }
  }
}

export async function sendFormationEmail(data: FormationFormData) {
  try {
    console.log('🚀 DÉBUT sendFormationEmail')
    
    // Dans l'environnement next-lite, nous simulons l'envoi
    console.log('⚠️ Environnement next-lite détecté - Simulation d\'envoi d\'email formation')
    return await simulateEmailSend(data, 'formation')
    
  } catch (error: any) {
    console.error('❌ Erreur dans sendFormationEmail:', error.message)
    return { 
      success: false, 
      error: `Erreur: ${error.message}` 
    }
  }
}
