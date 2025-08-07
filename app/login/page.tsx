import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Key, ArrowLeft } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-10 w-10 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">DocV</span>
            <Badge variant="secondary">By 4NK</Badge>
          </div>
          <p className="text-gray-600">Connexion sécurisée à votre espace GED</p>
        </div>

        <Card className="border-2 border-blue-100 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center">
              <Key className="h-6 w-6 mr-2 text-blue-600" />
              Connexion cryptographique
            </CardTitle>
            <CardDescription>
              Login ultra-simplifié sans mot de passe traditionnel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cryptographic Login Section */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Authentification par clé cryptographique</h3>
              <p className="text-sm text-blue-700 mb-4">
                Utilisez votre clé cryptographique locale pour vous connecter de manière sécurisée.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Key className="h-4 w-4 mr-2" />
                Se connecter avec ma clé cryptographique
              </Button>
            </div>

            {/* Alternative Login */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Ou connexion alternative</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">Identifiant d'entreprise</Label>
                <Input 
                  id="identifier" 
                  type="text" 
                  placeholder="Votre identifiant unique"
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Accéder à DocV
            </Button>

            {/* Security Features */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">🔐 Sécurité garantie</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Aucun mot de passe stocké</li>
                <li>• Aucun OTP ou code par email</li>
                <li>• Chiffrement de bout en bout</li>
                <li>• Authentification décentralisée</li>
              </ul>
            </div>

            {/* Help Links */}
            <div className="text-center space-y-2">
              <Link href="/formation" className="text-sm text-blue-600 hover:text-blue-700 block">
                Besoin d'aide ? Consultez nos formations
              </Link>
              <p className="text-xs text-gray-500">
                Première connexion ? Votre administrateur vous a fourni vos identifiants sécurisés.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Support technique : 
            <a href="mailto:contact@4nkweb.com" className="text-blue-600 hover:text-blue-700 ml-1">
              contact@4nkweb.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
