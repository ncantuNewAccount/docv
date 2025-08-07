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

// Fonction pour créer le transporteur email
function createEmailTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true pour 465, false pour 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    // Options supplémentaires pour améliorer la compatibilité
    tls: {
      rejectUnauthorized: false // Accepter les certificats auto-signés si nécessaire
    }
  })
}

// Fonction de fallback pour l'environnement de développement
async function simulateEmailSend(emailData: any, type: 'contact' | 'formation'): Promise<{ success: boolean; error?: string }> {
  console.log(`📧 [SIMULATION] Email ${type} - Environnement de développement`)
  console.log('Données:', {
    to: 'contact@docv.fr',
    from: emailData.email,
    subject: type === 'contact' 
      ? `[DocV] Nouvelle demande de contact - ${emailData.nom} ${emailData.prenom}`
      : `[DocV] Demande de devis formation - ${emailData.entreprise || emailData.nom}`,
    timestamp: new Date().toISOString()
  })
  
  // Simulation d'un délai réseau
  await new Promise(resolve => setTimeout(resolve, 1500))
  return { success: true }
}

export async function sendContactEmail(data: ContactFormData) {
  try {
    // Vérifier si nous sommes en environnement de production avec configuration SMTP
    const isProductionReady = process.env.SMTP_HOST && 
                              process.env.SMTP_USER && 
                              process.env.SMTP_PASSWORD &&
                              typeof window === 'undefined' // Vérifier qu'on est côté serveur

    if (!isProductionReady) {
      console.log('🔄 Mode développement - Simulation d\'envoi d\'email')
      return await simulateEmailSend(data, 'contact')
    }

    // Configuration pour l'envoi réel
    const transporter = createEmailTransporter()

    const servicesText = data.services.length > 0 
      ? data.services.join(', ') 
      : 'Aucun service spécifique sélectionné'

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nouvelle demande de contact - DocV</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .section { margin-bottom: 25px; }
          .section h3 { color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
          .field { margin-bottom: 10px; }
          .field strong { color: #374151; }
          .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔐 DocV - Nouvelle demande de contact</h1>
        </div>
        
        <div class="content">
          <div class="section">
            <h3>👤 Informations de contact</h3>
            <div class="field"><strong>Nom :</strong> ${data.nom}</div>
            <div class="field"><strong>Prénom :</strong> ${data.prenom}</div>
            <div class="field"><strong>Email :</strong> <a href="mailto:${data.email}">${data.email}</a></div>
            ${data.telephone ? `<div class="field"><strong>Téléphone :</strong> ${data.telephone}</div>` : ''}
            ${data.entreprise ? `<div class="field"><strong>Entreprise :</strong> ${data.entreprise}</div>` : ''}
            ${data.fonction ? `<div class="field"><strong>Fonction :</strong> ${data.fonction}</div>` : ''}
          </div>
          
          <div class="section">
            <h3>🎯 Projet</h3>
            ${data.typeProjet ? `<div class="field"><strong>Type de projet :</strong> ${data.typeProjet}</div>` : ''}
            ${data.budget ? `<div class="field"><strong>Budget estimé :</strong> ${data.budget}</div>` : ''}
            ${data.delai ? `<div class="field"><strong>Délai souhaité :</strong> ${data.delai}</div>` : ''}
          </div>
          
          <div class="section">
            <h3>📝 Description</h3>
            <div class="field">
              <strong>Description générale :</strong><br>
              <div style="background: #f9fafb; padding: 15px; border-left: 4px solid #2563eb; margin-top: 5px;">
                ${data.description.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            ${data.objectifs ? `
            <div class="field">
              <strong>Objectifs principaux :</strong><br>
              <div style="background: #f9fafb; padding: 15px; border-left: 4px solid #10b981; margin-top: 5px;">
                ${data.objectifs.replace(/\n/g, '<br>')}
              </div>
            </div>
            ` : ''}
            
            ${data.contraintes ? `
            <div class="field">
              <strong>Contraintes :</strong><br>
              <div style="background: #f9fafb; padding: 15px; border-left: 4px solid #f59e0b; margin-top: 5px;">
                ${data.contraintes.replace(/\n/g, '<br>')}
              </div>
            </div>
            ` : ''}
          </div>
          
          <div class="section">
            <h3>🛠️ Services souhaités</h3>
            <div class="field">${servicesText}</div>
          </div>
          
          <div class="section">
            <h3>⚙️ Options</h3>
            <div class="field"><strong>Démonstration souhaitée :</strong> ${data.demo ? '✅ Oui' : '❌ Non'}</div>
            <div class="field"><strong>Accompagnement personnalisé :</strong> ${data.accompagnement ? '✅ Oui' : '❌ Non'}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>📧 Message envoyé depuis <strong>docv.fr</strong> le ${new Date().toLocaleString('fr-FR')}</p>
          <p>🔐 DocV - Solutions de souveraineté numérique by 4NK</p>
        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: `"DocV Contact" <${process.env.SMTP_FROM}>`,
      to: 'contact@docv.fr',
      replyTo: data.email,
      subject: `[DocV] 📧 Nouvelle demande de contact - ${data.nom} ${data.prenom}`,
      html: htmlContent,
      // Version texte pour les clients email qui ne supportent pas HTML
      text: `
Nouvelle demande de contact - DocV

Informations de contact:
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

${data.objectifs ? `Objectifs: ${data.objectifs}` : ''}
${data.contraintes ? `Contraintes: ${data.contraintes}` : ''}

Services: ${servicesText}
Démo: ${data.demo ? 'Oui' : 'Non'}
Accompagnement: ${data.accompagnement ? 'Oui' : 'Non'}

Message envoyé depuis docv.fr
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('✅ Email de contact envoyé avec succès à contact@docv.fr')
    return { success: true }
    
  } catch (error) {
    console.error('❌ Erreur envoi email contact:', error)
    return { success: false, error: 'Erreur lors de l\'envoi de l\'email' }
  }
}

export async function sendFormationEmail(data: FormationFormData) {
  try {
    // Vérifier si nous sommes en environnement de production avec configuration SMTP
    const isProductionReady = process.env.SMTP_HOST && 
                              process.env.SMTP_USER && 
                              process.env.SMTP_PASSWORD &&
                              typeof window === 'undefined' // Vérifier qu'on est côté serveur

    if (!isProductionReady) {
      console.log('🔄 Mode développement - Simulation d\'envoi d\'email formation')
      return await simulateEmailSend(data, 'formation')
    }

    // Configuration pour l'envoi réel
    const transporter = createEmailTransporter()

    const formationsText = data.formations.length > 0 
      ? data.formations.join(', ') 
      : 'Aucune formation spécifique sélectionnée'

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Demande de devis formation - DocV</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .section { margin-bottom: 25px; }
          .section h3 { color: #059669; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
          .field { margin-bottom: 10px; }
          .field strong { color: #374151; }
          .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
          .formations { background: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #059669; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎓 DocV - Demande de devis formation</h1>
        </div>
        
        <div class="content">
          <div class="section">
            <h3>🏢 Informations entreprise</h3>
            <div class="field"><strong>Entreprise :</strong> ${data.entreprise}</div>
            ${data.secteur ? `<div class="field"><strong>Secteur :</strong> ${data.secteur}</div>` : ''}
            ${data.taille ? `<div class="field"><strong>Taille :</strong> ${data.taille}</div>` : ''}
            ${data.siret ? `<div class="field"><strong>SIRET :</strong> ${data.siret}</div>` : ''}
          </div>
          
          <div class="section">
            <h3>👤 Contact</h3>
            <div class="field"><strong>Nom :</strong> ${data.nom}</div>
            <div class="field"><strong>Prénom :</strong> ${data.prenom}</div>
            <div class="field"><strong>Email :</strong> <a href="mailto:${data.email}">${data.email}</a></div>
            ${data.telephone ? `<div class="field"><strong>Téléphone :</strong> ${data.telephone}</div>` : ''}
            ${data.fonction ? `<div class="field"><strong>Fonction :</strong> ${data.fonction}</div>` : ''}
          </div>
          
          <div class="section">
            <h3>📚 Formations souhaitées</h3>
            <div class="formations">
              <strong>${formationsText}</strong>
            </div>
          </div>
          
          <div class="section">
            <h3>📅 Modalités</h3>
            ${data.modalite ? `<div class="field"><strong>Mode de formation :</strong> ${data.modalite}</div>` : ''}
            ${data.participants ? `<div class="field"><strong>Nombre de participants :</strong> ${data.participants}</div>` : ''}
            ${data.dates ? `<div class="field"><strong>Période souhaitée :</strong> ${data.dates}</div>` : ''}
            ${data.lieu ? `<div class="field"><strong>Lieu :</strong> ${data.lieu}</div>` : ''}
          </div>
          
          <div class="section">
            <h3>🎯 Besoins spécifiques</h3>
            ${data.objectifs ? `
            <div class="field">
              <strong>Objectifs :</strong><br>
              <div style="background: #f0fdf4; padding: 15px; border-left: 4px solid #059669; margin-top: 5px;">
                ${data.objectifs.replace(/\n/g, '<br>')}
              </div>
            </div>
            ` : ''}
            
            ${data.niveau ? `<div class="field"><strong>Niveau des participants :</strong> ${data.niveau}</div>` : ''}
            
            ${data.contraintes ? `
            <div class="field">
              <strong>Contraintes :</strong><br>
              <div style="background: #fefce8; padding: 15px; border-left: 4px solid #f59e0b; margin-top: 5px;">
                ${data.contraintes.replace(/\n/g, '<br>')}
              </div>
            </div>
            ` : ''}
          </div>
          
          <div class="section">
            <h3>⚙️ Options</h3>
            <div class="field"><strong>Certification RNCP :</strong> ${data.certification ? '✅ Oui' : '❌ Non'}</div>
            <div class="field"><strong>Support 6 mois :</strong> ${data.support ? '✅ Oui' : '❌ Non'}</div>
            <div class="field"><strong>Accompagnement personnalisé :</strong> ${data.accompagnement ? '✅ Oui' : '❌ Non'}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>📧 Message envoyé depuis <strong>docv.fr</strong> le ${new Date().toLocaleString('fr-FR')}</p>
          <p>🎓 DocV Formation - Centre agréé 4NK</p>
        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: `"DocV Formation" <${process.env.SMTP_FROM}>`,
      to: 'contact@docv.fr',
      replyTo: data.email,
      subject: `[DocV] 🎓 Demande de devis formation - ${data.entreprise}`,
      html: htmlContent,
      text: `
Demande de devis formation - DocV

Entreprise: ${data.entreprise}
${data.secteur ? `Secteur: ${data.secteur}` : ''}
${data.taille ? `Taille: ${data.taille}` : ''}

Contact:
- ${data.nom} ${data.prenom}
- ${data.email}
${data.telephone ? `- ${data.telephone}` : ''}

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

Message envoyé depuis docv.fr
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('✅ Email de formation envoyé avec succès à contact@docv.fr')
    return { success: true }
    
  } catch (error) {
    console.error('❌ Erreur envoi email formation:', error)
    return { success: false, error: 'Erreur lors de l\'envoi de l\'email' }
  }
}
