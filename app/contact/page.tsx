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
import { Shield, ArrowLeft, Mail, Phone, Building, User, MessageSquare, CheckCircle, Code, Lightbulb } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    // Informations contact
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    entreprise: '',
    fonction: '',
    
    // Type de demande
    typeProjet: '',
    budget: '',
    delai: '',
    
    // Description du projet
    description: '',
    objectifs: '',
    contraintes: '',
    
    // Services souhaités
    services: [] as string[],
    
    // Options
    demo: false,
    accompagnement: false
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleServiceChange = (service: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, service]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        services: prev.services.filter(s => s !== service)
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
            <CardTitle className="text-3xl text-green-700">Message envoyé !</CardTitle>
            <CardDescription className="text-lg">
              Votre demande de contact a été transmise avec succès
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-white p-6 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3">Prochaines étapes :</h3>
              <ul className="text-left space-y-2 text-gray-700">
                <li>• Un expert DocV vous contactera sous 24h</li>
                <li>• Analyse de votre projet et de vos besoins</li>
                <li>• Proposition de solution personnalisée</li>
                <li>• Planification d'une démonstration si demandée</li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                <strong>Contact direct :</strong> contact@docv.fr
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button variant="outline">Retour à l'accueil</Button>
                </Link>
                <Link href="/formation">
                  <Button>Découvrir nos formations</Button>
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
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">DocV</span>
            <Badge variant="secondary" className="ml-2">By 4NK</Badge>
          </Link>
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contactez-nous pour <span className="text-blue-600">votre projet</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discutons de votre projet de souveraineté numérique. Nos experts vous accompagnent 
              dans la mise en œuvre de solutions DocV adaptées à vos besoins.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informations Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Vos informations
                </CardTitle>
                <CardDescription>
                  Renseignez vos coordonnées pour que nous puissions vous recontacter
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
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entreprise">Entreprise</Label>
                    <Input
                      id="entreprise"
                      value={formData.entreprise}
                      onChange={(e) => setFormData(prev => ({ ...prev, entreprise: e.target.value }))}
                      placeholder="Nom de votre entreprise"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fonction">Fonction</Label>
                    <Input
                      id="fonction"
                      value={formData.fonction}
                      onChange={(e) => setFormData(prev => ({ ...prev, fonction: e.target.value }))}
                      placeholder="Votre fonction"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Type de projet */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-blue-600" />
                  Votre projet
                </CardTitle>
                <CardDescription>
                  Décrivez-nous votre projet et vos besoins
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Type de projet</Label>
                  <RadioGroup
                    value={formData.typeProjet}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, typeProjet: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="integration" id="integration" />
                      <Label htmlFor="integration">Intégration DocV dans notre système</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="developpement" id="developpement" />
                      <Label htmlFor="developpement">Développement d'une solution sur-mesure</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="migration" id="migration" />
                      <Label htmlFor="migration">Migration vers une GED souveraine</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="conseil" id="conseil" />
                      <Label htmlFor="conseil">Conseil en souveraineté numérique</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="autre" id="autre" />
                      <Label htmlFor="autre">Autre</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget estimé</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une fourchette" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<10k">Moins de 10k€</SelectItem>
                        <SelectItem value="10k-50k">10k€ - 50k€</SelectItem>
                        <SelectItem value="50k-100k">50k€ - 100k€</SelectItem>
                        <SelectItem value="100k-500k">100k€ - 500k€</SelectItem>
                        <SelectItem value=">500k">Plus de 500k€</SelectItem>
                        <SelectItem value="non-defini">Non défini</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delai">Délai souhaité</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, delai: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Échéance du projet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent (&lt; 1 mois)</SelectItem>
                        <SelectItem value="court">Court terme (1-3 mois)</SelectItem>
                        <SelectItem value="moyen">Moyen terme (3-6 mois)</SelectItem>
                        <SelectItem value="long">Long terme ({'> 6 mois'})</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services souhaités */}
            <Card>
              <CardHeader>
                <CardTitle>Services souhaités</CardTitle>
                <CardDescription>
                  Sélectionnez les services qui vous intéressent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ged-souveraine"
                    checked={formData.services.includes('ged-souveraine')}
                    onCheckedChange={(checked) => handleServiceChange('ged-souveraine', checked as boolean)}
                  />
                  <Label htmlFor="ged-souveraine">GED souveraine DocV</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="integration-marque-blanche"
                    checked={formData.services.includes('integration-marque-blanche')}
                    onCheckedChange={(checked) => handleServiceChange('integration-marque-blanche', checked as boolean)}
                  />
                  <Label htmlFor="integration-marque-blanche">Intégration marque blanche</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="solutions-open-source"
                    checked={formData.services.includes('solutions-open-source')}
                    onCheckedChange={(checked) => handleServiceChange('solutions-open-source', checked as boolean)}
                  />
                  <Label htmlFor="solutions-open-source">Solutions open source</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="formation"
                    checked={formData.services.includes('formation')}
                    onCheckedChange={(checked) => handleServiceChange('formation', checked as boolean)}
                  />
                  <Label htmlFor="formation">Formation et accompagnement</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="audit"
                    checked={formData.services.includes('audit')}
                    onCheckedChange={(checked) => handleServiceChange('audit', checked as boolean)}
                  />
                  <Label htmlFor="audit">Audit de sécurité</Label>
                </div>
              </CardContent>
            </Card>

            {/* Description détaillée */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                  Description du projet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description générale *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez votre projet, vos besoins, votre contexte..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objectifs">Objectifs principaux</Label>
                  <Textarea
                    id="objectifs"
                    value={formData.objectifs}
                    onChange={(e) => setFormData(prev => ({ ...prev, objectifs: e.target.value }))}
                    placeholder="Quels sont vos objectifs avec ce projet ?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contraintes">Contraintes techniques ou organisationnelles</Label>
                  <Textarea
                    id="contraintes"
                    value={formData.contraintes}
                    onChange={(e) => setFormData(prev => ({ ...prev, contraintes: e.target.value }))}
                    placeholder="Contraintes techniques, réglementaires, budgétaires..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <Card>
              <CardHeader>
                <CardTitle>Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="demo"
                    checked={formData.demo}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, demo: checked as boolean }))}
                  />
                  <Label htmlFor="demo">
                    Je souhaite une démonstration de DocV
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="accompagnement"
                    checked={formData.accompagnement}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, accompagnement: checked as boolean }))}
                  />
                  <Label htmlFor="accompagnement">
                    Je souhaite un accompagnement personnalisé
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="text-center">
              <Button type="submit" size="lg" className="text-lg px-12 py-3">
                <Mail className="h-5 w-5 mr-2" />
                Envoyer la demande
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                Réponse sous 24h • Contact direct : contact@docv.fr
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
