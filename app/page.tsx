import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Key, Database, Zap, Users, Globe, CheckCircle, ArrowRight, Code } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">DocV</span>
            <Badge variant="secondary" className="ml-2">
              By 4NK
            </Badge>
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
            Sécurisez votre entreprise avec la <span className="text-blue-600">GED simple et souveraine</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            DocV propose une approche révolutionnaire de la gestion d'identité, garantissant sécurité, souveraineté et
            conformité dans la gestion de vos documents et processus métier.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-3">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/formation">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
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
                <p className="text-gray-600 mb-4">OCR, classification et extraction avec IA locale.</p>
                <p className="text-gray-600">L'IA, ses données et ses traitements restent locaux.</p>
                <p className="text-gray-600 mt-2">Interface conversationnelle pour suivre les dossiers.</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Facilite l'usage quotidien</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">• Réduction massive des emails</p>
                <p className="text-gray-600 mb-2">• Protection des identités et accès</p>
                <p className="text-gray-600">• Traçabilité sur blockchain</p>
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
            <p className="text-xl text-gray-600">
              DocV intègre dès l'entrée : chiffrement, confidentialité, intégrité, authentification forte,
              décentralisation et preuves.
            </p>
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
            <p className="text-xl text-gray-600">
              DocV fait confiance aux plus grands éditeurs et sert d'infrastructure à des secteurs critiques
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-blue-200">
              <CardHeader>
                <Globe className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-blue-700">🏢 Intégration Marque Blanche</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  DocV est intégrée en marque blanche par de grands éditeurs qui font confiance à notre technologie pour
                  sécuriser leurs solutions documentaires.
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
                  DocV sert d'infrastructure au site <strong>lecoffre.io</strong>, plateforme de référence pour la
                  gestion sécurisée des échanges documentaires notariaux.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Échanges notaires ↔ clients sécurisés</li>
                  <li>• Communications inter-notaires chiffrées</li>
                  <li>• Partenariats bancaires sécurisés</li>
                  <li>• Conformité aux exigences notariales</li>
                </ul>
                <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>lecoffre.io</strong> : La confiance des notaires français pour leurs échanges documentaires
                    les plus sensibles.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">🔒 Une technologie éprouvée</h3>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Quand les secteurs les plus exigeants en matière de sécurité et de confidentialité choisissent DocV,
                c'est la preuve de la robustesse et de la fiabilité de notre solution.
              </p>
            </div>
          </div>
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200">
              <CardHeader className="text-center">
                <Code className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-purple-700 text-2xl">🔓 Solutions Open Source</CardTitle>
                <CardDescription className="text-lg text-gray-700">
                  Développez vos solutions distribuées avec nos technologies ouvertes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-700 mb-6 text-lg">
                    DocV met à disposition ses briques technologiques en open source pour permettre aux développeurs et
                    organisations de créer leurs propres solutions distribuées et souveraines.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-3">🛠️ Composants disponibles :</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Authentification cryptographique</li>
                      <li>• Gestion d'identité décentralisée</li>
                      <li>• Chiffrement de bout en bout</li>
                      <li>• Ancrage blockchain</li>
                      <li>• APIs souveraines</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-3">🎯 Cas d'usage :</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Applications métier distribuées</li>
                      <li>• Plateformes collaboratives sécurisées</li>
                      <li>• Solutions sectorielles sur-mesure</li>
                      <li>• Intégrations système existant</li>
                      <li>• Prototypes et POC</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-lg border border-purple-300">
                  <div className="text-center">
                    <h4 className="font-semibold text-purple-800 mb-3 text-lg">💡 Accompagnement personnalisé</h4>
                    <p className="text-gray-700 mb-4">
                      Notre équipe d'experts vous accompagne dans l'intégration et le développement de vos solutions
                      distribuées basées sur nos composants open source.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a href="https://git.4nkweb.com" target="_blank" rel="noopener noreferrer">
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          <Code className="h-4 w-4 mr-2" />
                          Accéder au code source
                        </Button>
                      </a>
                      <Link href="/contact">
                        <Button
                          variant="outline"
                          className="border-purple-300 text-purple-700 hover:bg-purple-50 bg-transparent"
                        >
                          Contactez-nous pour un projet
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    <strong>Licence :</strong> Solutions disponibles sous licence open source permissive. Support
                    commercial et accompagnement disponibles.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">🔐 En résumé</h2>
          <p className="text-xl mb-8 max-w-4xl mx-auto">
            DocV transforme la GED : plus simple, plus sûre, plus souveraine, et parfaitement compatible avec vos outils
            existants.
          </p>
          <p className="text-lg mb-8">
            C'est l'identité numérique que vous contrôlez, qui vous protège, et qui vous suit dans tous vos usages
            documentaires
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="tarifs" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Tarification simple et universelle</h2>

          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-blue-700">Offre Découverte</CardTitle>
                <CardDescription className="text-2xl font-semibold text-blue-600">2990 € HT / mois</CardDescription>
                <Badge className="bg-green-600 text-white text-lg px-4 py-2 mt-2">1000 jetons inclus</Badge>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">🎯 Que comprennent 1000 jetons ?</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Database className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                      <h4 className="font-semibold text-blue-800">Stockage permanent</h4>
                      <p className="text-2xl font-bold text-blue-600">1 To</p>
                      <p className="text-sm text-blue-700">Documents chiffrés et sécurisés</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Zap className="h-8 w-8 mx-auto text-green-600 mb-2" />
                      <h4 className="font-semibold text-green-800">Stockage temporaire</h4>
                      <p className="text-2xl font-bold text-green-600">100 Go</p>
                      <p className="text-sm text-green-700">Traitement IA et OCR</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Users className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                      <h4 className="font-semibold text-purple-800">Nouveaux dossiers</h4>
                      <p className="text-2xl font-bold text-purple-600">75</p>
                      <p className="text-sm text-purple-700">Par mois maximum</p>
                    </div>
                  </div>
                </div>

                {/* Architecture de stockage détaillée */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg mb-6">
                  <h4 className="font-semibold text-gray-800 mb-4 text-center">
                    🏗️ Architecture de stockage souveraine
                  </h4>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2 mb-3">
                        <Zap className="h-5 w-5 text-green-600" />
                        <h5 className="font-semibold text-green-800">Stockage Temporaire</h5>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Store chiffré local, distribué strictement en parties prenantes</strong>
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Accès rapide pour modifications</li>
                        <li>• Chiffrement bout en bout</li>
                        <li>• Distribution contrôlée</li>
                        <li>• Traitement IA local</li>
                      </ul>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2 mb-3">
                        <Database className="h-5 w-5 text-blue-600" />
                        <h5 className="font-semibold text-blue-800">Stockage Permanent</h5>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>
                          Store chiffré d'archivage local, distribué strictement en parties prenantes et sur un serveur
                          de backup sans accès aux données compatible avec du cold storage
                        </strong>
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Conservation longue durée</li>
                        <li>• Lecture seule sécurisée</li>
                        <li>• Backup cold storage</li>
                        <li>• Extraction IA pour data room distribuée</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                    <p className="text-sm text-blue-800 text-center">
                      <strong>🔐 Souveraineté totale :</strong> Vos données restent sous votre contrôle exclusif, même
                      en backup
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
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

                {/* Jetons supplémentaires */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-200 mb-6">
                  <h4 className="font-semibold text-orange-800 mb-3 text-center">📦 Jetons supplémentaires</h4>
                  <div className="text-center mb-4">
                    <p className="text-lg font-semibold text-orange-700">Lots de 250 jetons</p>
                    <p className="text-2xl font-bold text-orange-600">+747,50 € HT/mois</p>
                    <p className="text-sm text-orange-600">(2990 € ÷ 4 = 747,50 € par lot de 250 jetons)</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div className="bg-white p-3 rounded border border-orange-200">
                      <p className="font-medium text-orange-800">+250 Go</p>
                      <p className="text-xs text-orange-600">Stockage permanent</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-orange-200">
                      <p className="font-medium text-orange-800">+25 Go</p>
                      <p className="text-xs text-orange-600">Stockage temporaire</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-orange-200">
                      <p className="font-medium text-orange-800">+18 dossiers</p>
                      <p className="text-xs text-orange-600">Nouveaux dossiers/mois</p>
                    </div>
                  </div>
                  <p className="text-xs text-orange-600 mt-3 text-center font-medium">
                    💡 Achetez uniquement ce dont vous avez besoin, quand vous en avez besoin
                  </p>
                </div>

                {/* Coût de setup */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border border-gray-200 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">⚙️ Coût de setup initial</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Frais de mise en place unique, calculés selon vos contraintes spécifiques :
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Migration de données existantes</li>
                    <li>• Intégrations systèmes tiers</li>
                    <li>• Personnalisations interface</li>
                    <li>• Formation équipes techniques</li>
                    <li>• Accompagnement déploiement</li>
                  </ul>
                  <p className="text-xs text-gray-600 mt-2 font-medium">
                    💡 Devis personnalisé selon la complexité de votre environnement
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-lg font-semibold text-blue-700 mb-4">
                    Tarification à la consommation + setup personnalisé
                  </p>
                  <Link href="/contact">
                    <Button size="lg" className="w-full">
                      Obtenir un devis complet
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
                <Badge variant="secondary" className="ml-2">
                  By 4NK
                </Badge>
              </div>
              <p className="text-gray-400 mb-4">
                4NK, pionnier du Web 5.0. Conçoit et développe des solutions de souveraineté.
              </p>
              <p className="text-gray-400">contact@docv.fr</p>
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
