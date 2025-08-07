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

export async function sendContactEmail(data: ContactFormData) {
  try {
    console.log('📧 Envoi email contact - PRODUCTION')

    // Vérification des variables d'environnement
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('❌ Variables SMTP manquantes')
      return { success: false, error: 'Configuration email manquante' }
    }

    // Configuration SMTP - CORRECTION ICI
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // Adresse de destination explicite
    const destinationEmail = 'contact@docv.fr'
    
    const servicesText = data.services.length > 0 ? data.services.join(', ') : 'Aucun service sélectionné'

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: destinationEmail,
      replyTo: data.email,
      subject: `[DocV] Contact - ${data.nom} ${data.prenom}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
            <h1>🔐 DocV - Nouvelle demande de contact</h1>
          </div>
          
          <div style="padding: 20px;">
            <h2 style="color: #2563eb;">👤 Informations de contact</h2>
            <p><strong>Nom :</strong> ${data.nom}</p>
            <p><strong>Prénom :</strong> ${data.prenom}</p>
            <p><strong>Email :</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            ${data.telephone ? `<p><strong>Téléphone :</strong> ${data.telephone}</p>` : ''}
            ${data.entreprise ? `<p><strong>Entreprise :</strong> ${data.entreprise}</p>` : ''}
            ${data.fonction ? `<p><strong>Fonction :</strong> ${data.fonction}</p>` : ''}
            
            <h2 style="color: #2563eb;">🎯 Projet</h2>
            ${data.typeProjet ? `<p><strong>Type de projet :</strong> ${data.typeProjet}</p>` : ''}
            ${data.budget ? `<p><strong>Budget estimé :</strong> ${data.budget}</p>` : ''}
            ${data.delai ? `<p><strong>Délai souhaité :</strong> ${data.delai}</p>` : ''}
            
            <h2 style="color: #2563eb;">📝 Description</h2>
            <div style="background: #f9fafb; padding: 15px; border-left: 4px solid #2563eb;">
              ${data.description.replace(/\n/g, '<br>')}
            </div>
            
            ${data.objectifs ? `
            <h3 style="color: #10b981;">🎯 Objectifs</h3>
            <div style="background: #f0fdf4; padding: 15px; border-left: 4px solid #10b981;">
              ${data.objectifs.replace(/\n/g, '<br>')}
            </div>
            ` : ''}
            
            ${data.contraintes ? `
            <h3 style="color: #f59e0b;">⚠️ Contraintes</h3>
            <div style="background: #fefce8; padding: 15px; border-left: 4px solid #f59e0b;">
              ${data.contraintes.replace(/\n/g, '<br>')}
            </div>
            ` : ''}
            
            <h2 style="color: #2563eb;">🛠️ Services demandés</h2>
            <p>${servicesText}</p>
            
            <h2 style="color: #2563eb;">⚙️ Options</h2>
            <p><strong>Démonstration souhaitée :</strong> ${data.demo ? '✅ Oui' : '❌ Non'}</p>
            <p><strong>Accompagnement personnalisé :</strong> ${data.accompagnement ? '✅ Oui' : '❌ Non'}</p>
          </div>
          
          <div style="background: #f3f4f6; padding: 15px; text-center; font-size: 12px; color: #6b7280;">
            <p>📧 Message envoyé depuis <strong>docv.fr</strong> le ${new Date().toLocaleString('fr-FR')}</p>
            <p>🔐 DocV - Solutions de souveraineté numérique by 4NK</p>
          </div>
        </div>
      `,
      text: `
DocV - Nouvelle demande de contact

INFORMATIONS DE CONTACT:
- Nom: ${data.nom}
- Prénom: ${data.prenom}
- Email: ${data.email}
${data.telephone ? `- Téléphone: ${data.telephone}` : ''}
${data.entreprise ? `- Entreprise: ${data.entreprise}` : ''}
${data.fonction ? `- Fonction: ${data.fonction}` : ''}

PROJET:
${data.typeProjet ? `- Type: ${data.typeProjet}` : ''}
${data.budget ? `- Budget: ${data.budget}` : ''}
${data.delai ? `- Délai: ${data.delai}` : ''}

DESCRIPTION:
${data.description}

${data.objectifs ? `OBJECTIFS:\n${data.objectifs}\n` : ''}
${data.contraintes ? `CONTRAINTES:\n${data.contraintes}\n` : ''}

SERVICES: ${servicesText}

OPTIONS:
- Démonstration: ${data.demo ? 'Oui' : 'Non'}
- Accompagnement: ${data.accompagnement ? 'Oui' : 'Non'}

---
Message envoyé depuis docv.fr le ${new Date().toLocaleString('fr-FR')}
      `
    }

    console.log('📤 Envoi vers:', destinationEmail)
    console.log('📤 Depuis:', process.env.SMTP_USER)
    
    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Email contact envoyé:', result.messageId)
    
    return { success: true }

  } catch (error: any) {
    console.error('❌ Erreur envoi email contact:', error.message)
    console.error('❌ Stack:', error.stack)
    return { 
      success: false, 
      error: `Erreur d'envoi: ${error.message}` 
    }
  }
}

export async function sendFormationEmail(data: FormationFormData) {
  try {
    console.log('📧 Envoi email formation - PRODUCTION')

    // Vérification des variables d'environnement
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('❌ Variables SMTP manquantes')
      return { success: false, error: 'Configuration email manquante' }
    }

    // Configuration SMTP - CORRECTION ICI
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // Adresse de destination explicite
    const destinationEmail = 'contact@docv.fr'
    
    const formationsText = data.formations.length > 0 ? data.formations.join(', ') : 'Aucune formation sélectionnée'

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: destinationEmail,
      replyTo: data.email,
      subject: `[DocV] Formation - ${data.entreprise}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #059669; color: white; padding: 20px; text-align: center;">
            <h1>🎓 DocV - Demande de devis formation</h1>
          </div>
          
          <div style="padding: 20px;">
            <h2 style="color: #059669;">🏢 Informations entreprise</h2>
            <p><strong>Entreprise :</strong> ${data.entreprise}</p>
            ${data.secteur ? `<p><strong>Secteur :</strong> ${data.secteur}</p>` : ''}
            ${data.taille ? `<p><strong>Taille :</strong> ${data.taille}</p>` : ''}
            ${data.siret ? `<p><strong>SIRET :</strong> ${data.siret}</p>` : ''}
            
            <h2 style="color: #059669;">👤 Contact</h2>
            <p><strong>Nom :</strong> ${data.nom}</p>
            <p><strong>Prénom :</strong> ${data.prenom}</p>
            <p><strong>Email :</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            ${data.telephone ? `<p><strong>Téléphone :</strong> ${data.telephone}</p>` : ''}
            ${data.fonction ? `<p><strong>Fonction :</strong> ${data.fonction}</p>` : ''}
            
            <h2 style="color: #059669;">📚 Formations souhaitées</h2>
            <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #059669;">
              <strong>${formationsText}</strong>
            </div>
            
            <h2 style="color: #059669;">📅 Modalités</h2>
            ${data.modalite ? `<p><strong>Mode de formation :</strong> ${data.modalite}</p>` : ''}
            ${data.participants ? `<p><strong>Nombre de participants :</strong> ${data.participants}</p>` : ''}
            ${data.dates ? `<p><strong>Période souhaitée :</strong> ${data.dates}</p>` : ''}
            ${data.lieu ? `<p><strong>Lieu :</strong> ${data.lieu}</p>` : ''}
            
            ${data.objectifs ? `
            <h2 style="color: #059669;">🎯 Objectifs</h2>
            <div style="background: #f0fdf4; padding: 15px; border-left: 4px solid #059669;">
              ${data.objectifs.replace(/\n/g, '<br>')}
            </div>
            ` : ''}
            
            ${data.niveau ? `<p><strong>Niveau des participants :</strong> ${data.niveau}</p>` : ''}
            
            ${data.contraintes ? `
            <h3 style="color: #f59e0b;">⚠️ Contraintes</h3>
            <div style="background: #fefce8; padding: 15px; border-left: 4px solid #f59e0b;">
              ${data.contraintes.replace(/\n/g, '<br>')}
            </div>
            ` : ''}
            
            <h2 style="color: #059669;">⚙️ Options</h2>
            <p><strong>Certification RNCP :</strong> ${data.certification ? '✅ Oui' : '❌ Non'}</p>
            <p><strong>Support 6 mois :</strong> ${data.support ? '✅ Oui' : '❌ Non'}</p>
            <p><strong>Accompagnement personnalisé :</strong> ${data.accompagnement ? '✅ Oui' : '❌ Non'}</p>
          </div>
          
          <div style="background: #f3f4f6; padding: 15px; text-center; font-size: 12px; color: #6b7280;">
            <p>📧 Message envoyé depuis <strong>docv.fr</strong> le ${new Date().toLocaleString('fr-FR')}</p>
            <p>🎓 DocV Formation - Centre agréé 4NK</p>
          </div>
        </div>
      `,
      text: `
DocV - Demande de devis formation

ENTREPRISE: ${data.entreprise}
${data.secteur ? `Secteur: ${data.secteur}` : ''}
${data.taille ? `Taille: ${data.taille}` : ''}

CONTACT: ${data.nom} ${data.prenom}
Email: ${data.email}
${data.telephone ? `Téléphone: ${data.telephone}` : ''}

FORMATIONS: ${formationsText}

MODALITÉS:
${data.modalite ? `Mode: ${data.modalite}` : ''}
${data.participants ? `Participants: ${data.participants}` : ''}
${data.dates ? `Dates: ${data.dates}` : ''}

${data.objectifs ? `OBJECTIFS: ${data.objectifs}` : ''}
${data.contraintes ? `CONTRAINTES: ${data.contraintes}` : ''}

OPTIONS:
- Certification: ${data.certification ? 'Oui' : 'Non'}
- Support: ${data.support ? 'Oui' : 'Non'}
- Accompagnement: ${data.accompagnement ? 'Oui' : 'Non'}

---
Message envoyé depuis docv.fr le ${new Date().toLocaleString('fr-FR')}
      `
    }

    console.log('📤 Envoi formation vers:', destinationEmail)
    console.log('📤 Depuis:', process.env.SMTP_USER)
    
    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Email formation envoyé:', result.messageId)
    
    return { success: true }

  } catch (error: any) {
    console.error('❌ Erreur envoi email formation:', error.message)
    console.error('❌ Stack:', error.stack)
    return { 
      success: false, 
      error: `Erreur d'envoi: ${error.message}` 
    }
  }
}
