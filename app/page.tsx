import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Key, Database, Zap, Users, Globe, Lock, CheckCircle, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">DocV</span>
            <Badge variant="secondary" className="ml-2">By 4NK</Badge>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#produit" className="text-gray-600 hover:text-blue-600 transition-colors">
              Le produit
            </Link>
            <Link href="#securite" className="text-gray-600 hover:text-blue-600 transition-colors">
              Sécurité
            </Link>
            <Link href="#tarifs" className="text-gray-600 hover:text-blue-600 transition-colors">
              Tarifs
            </Link>
            <Link href="/formation">
              <Button variant="outline">Formation</Button>
            </Link>
            <Link href="/login">
              <Button>Connexion</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Sécurisez votre entreprise avec la{" "}
            <span className="text-blue-600">GED simple et souveraine</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            DocV propose une approche révolutionnaire de la gestion d'identité, garantissant sécurité, 
            souveraineté et conformité dans la gestion de vos documents et processus métier.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-3">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/formation">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Découvrir nos formations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Features */}
      <section id="produit" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Le produit</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Key className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Login cryptographique ultra-simplifié</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Aucun mot de passe, aucun OTP, aucun mail, aucun code, aucune application.
                </p>
                <p className="text-gray-600">
                  Notifications transverses et temps réel sur l'avancement des traitements.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Zap className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>IA embarquée</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  OCR, classification et extraction avec IA locale.
                </p>
                <p className="text-gray-600">
                  L'IA, ses données et ses traitements restent locaux.
                </p>
                <p className="text-gray-600 mt-2">
                  Interface conversationnelle pour suivre les dossiers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Facilite l'usage quotidien</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">
                  • Réduction massive des emails
                </p>
                <p className="text-gray-600 mb-2">
                  • Protection des identités et accès
                </p>
                <p className="text-gray-600">
                  • Traçabilité sur blockchain
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">⚙️ Facilite l'usage de la GED au quotidien</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Clés cryptographiques locales :</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Utilisées pour signer, chiffrer, authentifier, prouver</li>
                  <li>• Synchroniser ou chiffrer les traitements IA</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Gestion des rôles et autorisations :</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Tracée, versionnée, et vérifiable</li>
                  <li>• Normes : OWASP, ISO/IEC 27001, SecNumCloud, RGPD</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="securite" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">🔐 Sécurité de bout en bout, par conception</h2>
            <p className="text-xl text-gray-600">DocV intègre dès l'entrée : chiffrement, confidentialité, intégrité, authentification forte, décentralisation et preuves.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="bg-white border-2 hover:border-red-200 transition-colors">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle className="text-red-700">🛡️ Moins de failles, plus de confiance</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Aucune interface admin exposée</li>
                  <li>• Aucun mot de passe</li>
                  <li>• Aucun serveur d'identité</li>
                  <li>• Aucune dépendance cloud</li>
                  <li>• Aucune dépendance API</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <Globe className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-green-700">🌐 Une identité pour tout faire et tout vérifier</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Identité auto-générée, auto-portée, vérifiable, privée :</p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Accéder à l'interface GED sécurisée</li>
                  <li>• Signer les documents et les flux</li>
                  <li>• Ancrer les preuves sur Bitcoin</li>
                  <li>• Recevoir des notifications</li>
                  <li>• Reconnue par d'autres systèmes</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Database className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-blue-700">🔄 Migration simple et à forte valeur ajoutée</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Aucune infrastructure à déployer</li>
                  <li>• Migration automatisée avec indexation</li>
                  <li>• Compatible bases de données, clouds, API</li>
                  <li>• Base locale chiffrée et distribuée</li>
                  <li>• Accompagnement de vos prestataires</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">🤝 Références et Intégrations</h2>
            <p className="text-xl text-gray-600">DocV fait confiance aux plus grands éditeurs et sert d'infrastructure à des secteurs critiques</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-blue-200">
              <CardHeader>
                <Globe className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-blue-700">🏢 Intégration Marque Blanche</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  DocV est intégrée en marque blanche par de grands éditeurs qui font confiance 
                  à notre technologie pour sécuriser leurs solutions documentaires.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Infrastructure invisible mais essentielle</li>
                  <li>• Sécurisation des échanges documentaires</li>
                  <li>• Conformité réglementaire garantie</li>
                  <li>• Scalabilité pour les grands volumes</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
              <CardHeader>
                <Shield className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-green-700">⚖️ Référence Notariale : lecoffre.io</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  DocV sert d'infrastructure au site <strong>lecoffre.io</strong>, plateforme de référence 
                  pour la gestion sécurisée des échanges documentaires notariaux.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Échanges notaires ↔ clients sécurisés</li>
                  <li>• Communications inter-notaires chiffrées</li>
                  <li>• Partenariats bancaires sécurisés</li>
                  <li>• Conformité aux exigences notariales</li>
                </ul>
                <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>lecoffre.io</strong> : La confiance des notaires français 
                    pour leurs échanges documentaires les plus sensibles.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">🔒 Une technologie éprouvée</h3>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Quand les secteurs les plus exigeants en matière de sécurité et de confidentialité 
                choisissent DocV, c'est la preuve de la robustesse et de la fiabilité de notre solution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">🔐 En résumé</h2>
          <p className="text-xl mb-8 max-w-4xl mx-auto">
            DocV transforme la GED : plus simple, plus sûre, plus souveraine, moins chère, 
            et parfaitement compatible avec vos outils existants.
          </p>
          <p className="text-lg mb-8">
            C'est l'identité numérique que vous contrôlez, qui vous protège, 
            et qui vous suit dans tous vos usages documentaires
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="tarifs" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Tarification simple et universelle</h2>
          
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-blue-700">2 990 € HT</CardTitle>
                <CardDescription className="text-xl">par To sécurisé par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>Pas de coût par utilisateur</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>Pas de surcoût pour l'IA embarquée</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>Pas de frais de licence à la signature ou au document</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>Pas de facturation par API ou par traitement</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>👉 Un To</strong> = 1 To de documents réellement cryptés, ancrés, 
                    classifiés, traçables et auto-vérifiables.
                  </p>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-lg font-semibold text-blue-700 mb-4">
                    Un tarif unique, tout compris, pour un environnement souverain et sécurisé
                  </p>
                  <Link href="/login">
                    <Button size="lg" className="w-full">
                      Commencer maintenant
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">DocV</span>
                <Badge variant="secondary" className="ml-2">By 4NK</Badge>
              </div>
              <p className="text-gray-400 mb-4">
                4NK, pionnier du Web 5.0. Conçoit et développe des solutions de souveraineté.
              </p>
              <p className="text-gray-400">
                contact@4nkweb.com
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Navigation</h3>
              <div className="space-y-2">
                <Link href="#produit" className="block text-gray-400 hover:text-white transition-colors">
                  Le produit
                </Link>
                <Link href="#securite" className="block text-gray-400 hover:text-white transition-colors">
                  Sécurité
                </Link>
                <Link href="#tarifs" className="block text-gray-400 hover:text-white transition-colors">
                  Tarifs
                </Link>
                <Link href="/formation" className="block text-gray-400 hover:text-white transition-colors">
                  Formation
                </Link>
                <Link href="/login" className="block text-gray-400 hover:text-white transition-colors">
                  Connexion
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 4NK. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
