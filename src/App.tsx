import React from 'react'
import { Shield, Key, Database, Zap, Users, Globe, CheckCircle, ArrowRight, Code } from "lucide-react"

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">DocV</span>
            <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
              By 4NK
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#produit" className="text-gray-600 hover:text-blue-600 transition-colors">
              Le produit
            </a>
            <a href="#securite" className="text-gray-600 hover:text-blue-600 transition-colors">
              Sécurité
            </a>
            <a href="#tarifs" className="text-gray-600 hover:text-blue-600 transition-colors">
              Tarifs
            </a>
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              Formation
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Connexion
            </button>
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
            <button className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-lg flex items-center justify-center">
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="px-8 py-3 border border-gray-300 rounded-md hover:bg-gray-50 text-lg bg-transparent">
              Découvrir nos formations
            </button>
          </div>
        </div>
      </section>

      {/* Product Features */}
      <section id="produit" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Le produit</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-200 transition-colors">
              <div className="mb-4">
                <Key className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-4">Login cryptographique ultra-simplifié</h3>
              </div>
              <div>
                <p className="text-gray-600 mb-4">
                  Aucun mot de passe, aucun OTP, aucun mail, aucun code, aucune application.
                </p>
                <p className="text-gray-600">
                  Notifications transverses et temps réel sur l'avancement des traitements.
                </p>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-200 transition-colors">
              <div className="mb-4">
                <Zap className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-4">IA embarquée</h3>
              </div>
              <div>
                <p className="text-gray-600 mb-4">OCR, classification et extraction avec IA locale.</p>
                <p className="text-gray-600">L'IA, ses données et ses traitements restent locaux.</p>
                <p className="text-gray-600 mt-2">Interface conversationnelle pour suivre les dossiers.</p>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-200 transition-colors">
              <div className="mb-4">
                <Database className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-4">Gestion souveraine</h3>
              </div>
              <div>
                <p className="text-gray-600 mb-4">Vos données restent sur vos serveurs.</p>
                <p className="text-gray-600">Conformité RGPD et standards de sécurité.</p>
                <p className="text-gray-600 mt-2">Audit trail complet et traçabilité.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 DocV by 4NK. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}

export default App

