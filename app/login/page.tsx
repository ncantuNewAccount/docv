"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Building2, TestTube, ArrowLeft, Home } from "lucide-react"
import { AuthModal } from "@/components/4nk/AuthModal"
import { MessageBus } from "@/lib/4nk/MessageBus"
import { MockService } from "@/lib/4nk/MockService"
import { UserStore } from "@/lib/4nk/UserStore"

export default function LoginPage() {
  const [companyId, setCompanyId] = useState("")
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const iframeUrl = process.env.NEXT_PUBLIC_4NK_IFRAME_URL || "https://dev.4nk.io"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!companyId.trim()) {
      return
    }

    setIsLoading(true)

    try {
      // Si l'identifiant est "1234", activer le mode mock directement
      if (companyId === "1234") {
        console.log("🎭 Activation du mode mock avec l'identifiant:", companyId)

        const messageBus = MessageBus.getInstance(iframeUrl)
        const mockService = MockService.getInstance()
        const userStore = UserStore.getInstance()

        // Activer le mode mock
        messageBus.enableMockMode()

        // Authentification mock
        const authResult = await mockService.mockAuthentication(companyId)
        if (!authResult) {
          throw new Error("Échec de l'authentification de démonstration")
        }

        // Simuler la récupération des tokens
        const tokens = await mockService.mockRequestLink()
        userStore.connect(tokens.accessToken, tokens.refreshToken)

        // Simuler la récupération de l'ID d'appairage
        const pairingId = await mockService.mockGetUserPairingId()
        userStore.pair(pairingId)

        console.log("✅ Mode mock activé avec succès")

        // Redirection directe vers le dashboard
        router.push("/dashboard")
      } else {
        // Mode normal - ouvrir la modal d'authentification 4NK
        setIsAuthModalOpen(true)
      }
    } catch (error) {
      console.error("Erreur lors de l'activation du mode mock:", error)
      // En cas d'erreur, ouvrir quand même la modal d'authentification
      setIsAuthModalOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Lien de retour vers l'accueil */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
        </div>

        {/* Logo et titre */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DocV</h1>
          <p className="text-gray-600">Gestion électronique de documents sécurisée</p>
        </div>

        {/* Carte de connexion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-blue-600" />
              Identification d'entreprise
            </CardTitle>
            <CardDescription>Connectez-vous avec votre identifiant unique sécurisé par 4NK</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyId">Votre identifiant unique</Label>
                <Input
                  id="companyId"
                  type="text"
                  placeholder="Saisissez votre identifiant d'entreprise"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              {/* Info mode démonstration */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <TestTube className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-green-700">
                    <p className="font-medium mb-1">Mode démonstration</p>
                    <p>
                      Utilisez l'identifiant <strong>"1234"</strong> pour accéder directement aux écrans de
                      démonstration avec des données simulées.
                    </p>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Badges de sécurité */}
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Shield className="h-3 w-3 mr-1" />
            Sécurisé 4NK
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Chiffrement bout en bout
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Blockchain
          </Badge>
        </div>

        {/* Lien vers l'espace public */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Découvrir DocV sans se connecter
          </Link>
        </div>

        {/* Informations légales */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>En vous connectant, vous acceptez nos conditions d'utilisation</p>
          <p>Vos données sont protégées par le chiffrement 4NK</p>
        </div>
      </div>

      {/* Modal d'authentification 4NK */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onConnect={handleAuthSuccess}
        onClose={() => setIsAuthModalOpen(false)}
        iframeUrl={iframeUrl}
      />
    </div>
  )
}
