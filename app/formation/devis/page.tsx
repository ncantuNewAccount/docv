'use client'

import { useState } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, ArrowLeft, Users, Calendar, MapPin, Mail, Phone, Building, User, FileText, CheckCircle } from 'lucide-react'

export default function DevisFormationPage() {
  const [formData, setFormData] = useState({
    // Informations entreprise
    entreprise: '',
    secteur: '',
    taille: '',
    siret: '',
    
    // Contact
    nom: '',
    prenom: '',
    fonction: '',
    email: '',
    telephone: '',
    
    // Formation
    formations: [] as string[],
    modalite: '',
    participants: '',
    dates: '',
    lieu: '',
    
    // Besoins spécifiques
    objectifs: '',
    niveau: '',
    contraintes: '',
    
    // Options
    certification: false,
    support: false,
    accompagnement: false
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleFormationChange = (formation: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        formations: [...prev.formations, formation]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        formations: prev.formations.filter(f => f !== formation)
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ici on traiterait normalement l'envoi du formulaire
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-2 border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-3xl text-green-700">Demande envoyée !</CardTitle>
            <CardDescription className="text-lg">
              Votre demande de devis a été transmise avec succès
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-white p-6 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3">Prochaines étapes :</h3>
              <ul className="text-left space-y-2 text-gray-700">
                <li>• Un expert 4NK vous contactera sous 24h</li>
                <li>• Analyse personnalisée de vos besoins</li>
                <li>• Proposition de devis détaillé</li>
                <li>• Planification des sessions de formation</li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                <strong>Contact direct :</strong> contact@4nkweb.com
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/formation">
                  <Button variant="outline">Retour aux formations</Button>
                </Link>
                <Link href="/">
                  <Button>Accueil DocV</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/formation" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">DocV</span>
            <Badge variant="secondary" className="ml-2">By 4NK</Badge>
          </Link>
          <Link href="/formation" className="flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux formations
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Demande de <span className="text-blue-600">Devis Formation</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Obtenez un devis personnalisé pour vos formations en souveraineté numérique. 
              Nos experts vous accompagnent dans la définition de vos besoins.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informations Entreprise */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-blue-600" />
                  Informations Entreprise
                </CardTitle>
                <CardDescription>
                  Renseignez les informations de votre organisation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entreprise">Nom de l'entreprise *</Label>
                    <Input
                      id="entreprise"
                      value={formData.entreprise}
                      onChange={(e) => setFormData(prev => ({ ...prev, entreprise: e.target.value }))}
                      placeholder="Votre entreprise"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secteur">Secteur d'activité</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, secteur: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre secteur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="finance">Finance / Banque</SelectItem>
                        <SelectItem value="sante">Santé</SelectItem>
                        <SelectItem value="notariat">Notariat / Juridique</SelectItem>
                        <SelectItem value="industrie">Industrie</SelectItem>
                        <SelectItem value="service-public">Service Public</SelectItem>
                        <SelectItem value="education">Éducation</SelectItem>
                        <SelectItem value="tech">Technologies</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taille">Taille de l'entreprise</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, taille: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Nombre d'employés" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employés</SelectItem>
                        <SelectItem value="11-50">11-50 employés</SelectItem>
                        <SelectItem value="51-200">51-200 employés</SelectItem>
                        <SelectItem value="201-1000">201-1000 employés</SelectItem>
                        <SelectItem value="1000+">Plus de 1000 employés</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siret">SIRET (optionnel)</Label>
                    <Input
                      id="siret"
                      value={formData.siret}
                      onChange={(e) => setFormData(prev => ({ ...prev, siret: e.target.value }))}
                      placeholder="Numéro SIRET"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Contact
                </CardTitle>
                <CardDescription>
                  Vos coordonnées pour le suivi de la demande
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom *</Label>
                    <Input
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom *</Label>
                    <Input
                      id="prenom"
                      value={formData.prenom}
                      onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fonction">Fonction</Label>
                  <Input
                    id="fonction"
                    value={formData.fonction}
                    onChange={(e) => setFormData(prev => ({ ...prev, fonction: e.target.value }))}
                    placeholder="Votre fonction dans l'entreprise"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="votre.email@entreprise.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      id="telephone"
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                      placeholder="01 23 45 67 89"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formations souhaitées */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Formations souhaitées
                </CardTitle>
                <CardDescription>
                  Sélectionnez les formations qui vous intéressent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cybersecurite"
                      checked={formData.formations.includes('cybersecurite')}
                      onCheckedChange={(checked) => handleFormationChange('cybersecurite', checked as boolean)}
                    />
                    <Label htmlFor="cybersecurite" className="flex-1">
                      <div className="font-medium">Cybersécurité (5 jours)</div>
                      <div className="text-sm text-gray-600">Fondamentaux de la sécurité informatique et spécialisation DocV</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hygiene"
                      checked={formData.formations.includes('hygiene')}
                      onCheckedChange={(checked) => handleFormationChange('hygiene', checked as boolean)}
                    />
                    <Label htmlFor="hygiene" className="flex-1">
                      <div className="font-medium">Hygiène Numérique (3 jours)</div>
                      <div className="text-sm text-gray-600">Bonnes pratiques pour un environnement numérique sain</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="developpement"
                      checked={formData.formations.includes('developpement')}
                      onCheckedChange={(checked) => handleFormationChange('developpement', checked as boolean)}
                    />
                    <Label htmlFor="developpement" className="flex-1">
                      <div className="font-medium">Développement Souverain (7 jours)</div>
                      <div className="text-sm text-gray-600">Applications indépendantes et sécurisées</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="parcours-complet"
                      checked={formData.formations.includes('parcours-complet')}
                      onCheckedChange={(checked) => handleFormationChange('parcours-complet', checked as boolean)}
                    />
                    <Label htmlFor="parcours-complet" className="flex-1">
                      <div className="font-medium">Parcours Complet (15 jours)</div>
                      <div className="text-sm text-gray-600">Formation intégrée avec certification 4NK</div>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modalités */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Modalités de formation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Mode de formation préféré</Label>
                  <RadioGroup
                    value={formData.modalite}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, modalite: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="presentiel" id="presentiel" />
                      <Label htmlFor="presentiel">Présentiel</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="distanciel" id="distanciel" />
                      <Label htmlFor="distanciel">Distanciel</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hybride" id="hybride" />
                      <Label htmlFor="hybride">Hybride</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="participants">Nombre de participants</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, participants: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Nombre de participants" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">1-5 participants</SelectItem>
                        <SelectItem value="6-10">6-10 participants</SelectItem>
                        <SelectItem value="11-15">11-15 participants</SelectItem>
                        <SelectItem value="16-20">16-20 participants</SelectItem>
                        <SelectItem value="20+">Plus de 20 participants</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dates">Période souhaitée</Label>
                    <Input
                      id="dates"
                      value={formData.dates}
                      onChange={(e) => setFormData(prev => ({ ...prev, dates: e.target.value }))}
                      placeholder="Ex: Mars 2024, Trimestre 2..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lieu">Lieu (si présentiel)</Label>
                  <Input
                    id="lieu"
                    value={formData.lieu}
                    onChange={(e) => setFormData(prev => ({ ...prev, lieu: e.target.value }))}
                    placeholder="Ville ou adresse"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Besoins spécifiques */}
            <Card>
              <CardHeader>
                <CardTitle>Besoins spécifiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="objectifs">Objectifs de formation</Label>
                  <Textarea
                    id="objectifs"
                    value={formData.objectifs}
                    onChange={(e) => setFormData(prev => ({ ...prev, objectifs: e.target.value }))}
                    placeholder="Décrivez vos objectifs et attentes..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="niveau">Niveau des participants</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, niveau: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Niveau technique" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debutant">Débutant</SelectItem>
                      <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                      <SelectItem value="avance">Avancé</SelectItem>
                      <SelectItem value="mixte">Mixte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contraintes">Contraintes particulières</Label>
                  <Textarea
                    id="contraintes"
                    value={formData.contraintes}
                    onChange={(e) => setFormData(prev => ({ ...prev, contraintes: e.target.value }))}
                    placeholder="Contraintes horaires, techniques, organisationnelles..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <Card>
              <CardHeader>
                <CardTitle>Options supplémentaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="certification"
                    checked={formData.certification}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, certification: checked as boolean }))}
                  />
                  <Label htmlFor="certification">
                    Certification RNCP "Développeur Blockchain" (niveau 6)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="support"
                    checked={formData.support}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, support: checked as boolean }))}
                  />
                  <Label htmlFor="support">
                    Support technique 6 mois post-formation
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="accompagnement"
                    checked={formData.accompagnement}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, accompagnement: checked as boolean }))}
                  />
                  <Label htmlFor="accompagnement">
                    Accompagnement personnalisé sur projet
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="text-center">
              <Button type="submit" size="lg" className="text-lg px-12 py-3">
                <Mail className="h-5 w-5 mr-2" />
                Envoyer la demande de devis
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                Réponse sous 24h • Devis gratuit et sans engagement
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
