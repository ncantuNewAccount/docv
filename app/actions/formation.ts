'use server'

import { sendFormationEmail, type FormationFormData } from '@/lib/email'
import { z } from 'zod'

const formationSchema = z.object({
  entreprise: z.string().min(1, 'Le nom de l\'entreprise est requis'),
  secteur: z.string().optional(),
  taille: z.string().optional(),
  siret: z.string().optional(),
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  fonction: z.string().optional(),
  email: z.string().email('Email invalide'),
  telephone: z.string().optional(),
  formations: z.array(z.string()),
  modalite: z.string().optional(),
  participants: z.string().optional(),
  dates: z.string().optional(),
  lieu: z.string().optional(),
  objectifs: z.string().optional(),
  niveau: z.string().optional(),
  contraintes: z.string().optional(),
  certification: z.boolean(),
  support: z.boolean(),
  accompagnement: z.boolean(),
})

export async function submitFormationForm(formData: FormData) {
  try {
    console.log('Traitement formulaire formation')

    // Extraction des données
    const rawData = {
      entreprise: (formData.get('entreprise') as string)?.trim() || '',
      secteur: (formData.get('secteur') as string)?.trim() || undefined,
      taille: (formData.get('taille') as string) || undefined,
      siret: (formData.get('siret') as string)?.trim() || undefined,
      nom: (formData.get('nom') as string)?.trim() || '',
      prenom: (formData.get('prenom') as string)?.trim() || '',
      fonction: (formData.get('fonction') as string)?.trim() || undefined,
      email: (formData.get('email') as string)?.trim() || '',
      telephone: (formData.get('telephone') as string)?.trim() || undefined,
      formations: formData.getAll('formations') as string[],
      modalite: (formData.get('modalite') as string) || undefined,
      participants: (formData.get('participants') as string) || undefined,
      dates: (formData.get('dates') as string)?.trim() || undefined,
      lieu: (formData.get('lieu') as string)?.trim() || undefined,
      objectifs: (formData.get('objectifs') as string)?.trim() || undefined,
      niveau: (formData.get('niveau') as string) || undefined,
      contraintes: (formData.get('contraintes') as string)?.trim() || undefined,
      certification: formData.get('certification') === 'true',
      support: formData.get('support') === 'true',
      accompagnement: formData.get('accompagnement') === 'true',
    }

    // Validation
    const validatedData = formationSchema.parse(rawData)

    // Envoi email
    const result = await sendFormationEmail(validatedData as FormationFormData)

    if (result.success) {
      return { 
        success: true, 
        message: 'Votre demande de devis a été envoyée avec succès. Nous vous recontacterons sous 24h.' 
      }
    } else {
      return { 
        success: false, 
        message: result.error || 'Une erreur est survenue lors de l\'envoi.' 
      }
    }

  } catch (error: any) {
    console.error('Erreur formulaire formation:', error.message)
    
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(e => e.message).join(', ')
      return { 
        success: false, 
        message: `Données invalides: ${errorMessages}`
      }
    }
    
    return { 
      success: false, 
      message: 'Une erreur inattendue est survenue.' 
    }
  }
}
