'use server'

import { sendContactEmail, type ContactFormData } from '@/lib/email'
import { z } from 'zod'

const contactSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  email: z.string().email('Email invalide'),
  telephone: z.string().optional(),
  entreprise: z.string().optional(),
  fonction: z.string().optional(),
  typeProjet: z.string().optional(),
  budget: z.string().optional(),
  delai: z.string().optional(),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  objectifs: z.string().optional(),
  contraintes: z.string().optional(),
  services: z.array(z.string()),
  demo: z.boolean(),
  accompagnement: z.boolean(),
})

export async function submitContactForm(formData: FormData) {
  try {
    console.log('Traitement formulaire contact')

    // Extraction des données
    const rawData = {
      nom: (formData.get('nom') as string || '').trim(),
      prenom: (formData.get('prenom') as string || '').trim(),
      email: (formData.get('email') as string || '').trim(),
      telephone: (formData.get('telephone') as string || '').trim() || undefined,
      entreprise: (formData.get('entreprise') as string || '').trim() || undefined,
      fonction: (formData.get('fonction') as string || '').trim() || undefined,
      typeProjet: (formData.get('typeProjet') as string) || undefined,
      budget: (formData.get('budget') as string) || undefined,
      delai: (formData.get('delai') as string) || undefined,
      description: (formData.get('description') as string || '').trim(),
      objectifs: (formData.get('objectifs') as string || '').trim() || undefined,
      contraintes: (formData.get('contraintes') as string || '').trim() || undefined,
      services: formData.getAll('services') as string[],
      demo: formData.get('demo') === 'true',
      accompagnement: formData.get('accompagnement') === 'true',
    }

    // Validation
    const validatedData = contactSchema.parse(rawData)

    // Envoi email
    const result = await sendContactEmail(validatedData as ContactFormData)

    if (result.success) {
      return { 
        success: true, 
        message: 'Votre message a été envoyé avec succès. Nous vous recontacterons sous 24h.' 
      }
    } else {
      return { 
        success: false, 
        message: result.error || 'Une erreur est survenue lors de l\'envoi.' 
      }
    }

  } catch (error: any) {
    console.error('Erreur formulaire contact:', error.message)
    
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
