import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Monitor, Code, ArrowLeft, Clock, Users, Award, BookOpen } from 'lucide-react'

export default function FormationPage() {
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

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Formations <span className="text-blue-600">Souveraineté Numérique</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Développez vos compétences en cybersécurité, hygiène numérique et développement d'applications souveraines 
            avec nos formations expertes dispensées par 4NK.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Award className="h-4 w-4 mr-2" />
              Certifiantes
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              Formateurs experts
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <BookOpen className="h-4 w-4 mr-2" />
              Pratique intensive
            </Badge>
          </div>
        </div>
      </section>

      {/* Formations */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Cybersécurité */}
            <Card className="border-2 hover:border-red-200 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="text-center">
                <Shield className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <CardTitle className="text-2xl text-red-700">Cybersécurité</CardTitle>
                <CardDescription className="text-lg">
                  Maîtrisez les fondamentaux de la sécurité informatique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Programme de formation :</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Analyse des menaces et vulnérabilités</li>
                    <li>• Cryptographie appliquée et PKI</li>
                    <li>• Sécurisation des infrastructures</li>
                    <li>• Gestion des incidents de sécurité</li>
                    <li>• Audit et conformité (ISO 27001, RGPD)</li>
                    <li>• Tests d'intrusion et pentest</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-red-800 mb-2">Spécialisation DocV :</h5>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Authentification sans mot de passe</li>
                    <li>• Chiffrement de bout en bout</li>
                    <li>• Blockchain et preuves cryptographiques</li>
                    <li>• Architecture zero-trust</li>
                  </ul>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    5 jours
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Max 12 pers.
                  </div>
                </div>

                <Button className="w-full bg-red-600 hover:bg-red-700">
                  S'inscrire à la formation
                </Button>
              </CardContent>
            </Card>

            {/* Hygiène Numérique */}
            <Card className="border-2 hover:border-green-200 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="text-center">
                <Monitor className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-2xl text-green-700">Hygiène Numérique</CardTitle>
                <CardDescription className="text-lg">
                  Adoptez les bonnes pratiques pour un environnement numérique sain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Programme de formation :</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Gestion sécurisée des mots de passe</li>
                    <li>• Protection de la vie privée en ligne</li>
                    <li>• Sécurisation des communications</li>
                    <li>• Sauvegarde et archivage sécurisé</li>
                    <li>• Sensibilisation aux risques numériques</li>
                    <li>• RGPD et protection des données</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-800 mb-2">Approche DocV :</h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Identité numérique souveraine</li>
                    <li>• Gestion documentaire sécurisée</li>
                    <li>• Réduction de l'empreinte numérique</li>
                    <li>• Autonomie technologique</li>
                  </ul>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    3 jours
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Max 15 pers.
                  </div>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700">
                  S'inscrire à la formation
                </Button>
              </CardContent>
            </Card>

            {/* Développement d'Applications Souveraines */}
            <Card className="border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="text-center">
                <Code className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-2xl text-blue-700">Développement Souverain</CardTitle>
                <CardDescription className="text-lg">
                  Créez des applications indépendantes et sécurisées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Programme de formation :</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Architecture décentralisée</li>
                    <li>• Développement sans dépendances cloud</li>
                    <li>• Intégration blockchain et cryptographie</li>
                    <li>• APIs souveraines et sécurisées</li>
                    <li>• Déploiement on-premise</li>
                    <li>• Maintenance et évolutivité</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-2">Technologies DocV :</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Stack technologique souveraine</li>
                    <li>• Intégration IA locale</li>
                    <li>• Gestion d'identité décentralisée</li>
                    <li>• Protocoles de communication sécurisés</li>
                  </ul>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    7 jours
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Max 8 pers.
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  S'inscrire à la formation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Formation Package */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-gray-900">Parcours Complet de Souveraineté Numérique</h2>
            
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-3xl text-blue-700">Formation Intégrée 4NK</CardTitle>
                <CardDescription className="text-xl">
                  Maîtrisez l'écosystème complet de la souveraineté numérique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Shield className="h-12 w-12 text-red-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Cybersécurité</h4>
                    <p className="text-sm text-gray-600">Fondamentaux sécuritaires</p>
                  </div>
                  <div className="text-center">
                    <Monitor className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Hygiène Numérique</h4>
                    <p className="text-sm text-gray-600">Bonnes pratiques</p>
                  </div>
                  <div className="text-center">
                    <Code className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Développement</h4>
                    <p className="text-sm text-gray-600">Applications souveraines</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">Avantages du parcours complet :</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <ul className="space-y-2 text-gray-600">
                      <li>• Certification 4NK reconnue</li>
                      <li>• Accompagnement personnalisé</li>
                      <li>• Accès privilégié aux outils DocV</li>
                    </ul>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Support technique 6 mois</li>
                      <li>• Communauté d'experts</li>
                      <li>• Mises à jour formations incluses</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="text-lg px-8">
                    Parcours Complet (15 jours)
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8">
                    Demander un devis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Besoin d'informations ?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Nos experts sont à votre disposition pour vous conseiller sur le parcours de formation 
            le plus adapté à vos besoins.
          </p>
          <div className="space-y-4">
            <p className="text-lg">
              <strong>Contact formations :</strong>{" "}
              <a href="mailto:contact@4nkweb.com" className="text-blue-600 hover:text-blue-700">
                contact@4nkweb.com
              </a>
            </p>
            <p className="text-gray-600">
              Formations disponibles en présentiel, distanciel ou format hybride
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold">DocV</span>
            <Badge variant="secondary">By 4NK</Badge>
          </div>
          <p className="text-gray-400">
            4NK, pionnier du Web 5.0 - Solutions de souveraineté numérique
          </p>
        </div>
      </footer>
    </div>
  )
}
