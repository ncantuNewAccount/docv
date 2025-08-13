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
import {
  Shield,
  Building2,
  TestTube,
  ArrowLeft,
  Home,
  Key,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react"
import { AuthModal } from "@/components/4nk/AuthModal"
import { MessageBus } from "@/lib/4nk/MessageBus"
import { MockService } from "@/lib/4nk/MockService"
import { UserStore } from "@/lib/4nk/UserStore"

export default function LoginPage() {
  const [companyId, setCompanyId] = useState("")
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPairingSection, setShowPairingSection] = useState(false)
  const [pairingWords, setPairingWords] = useState(["", "", "", ""])
  const [pairingError, setPairingError] = useState("")
  const [pairingSuccess, setPairingSuccess] = useState(false)
  const router = useRouter()
  const [showPairingInput, setShowPairingInput] = useState(false)

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

  const handlePairingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPairingError("")

    // Vérifier que tous les mots sont remplis
    if (pairingWords.some((word) => !word.trim())) {
      setPairingError("Veuillez saisir les 4 mots de pairing")
      return
    }

    // Simuler la vérification des mots de pairing
    const validWords = ["alpha", "bravo", "charlie", "delta"]
    const isValid = pairingWords.every((word, index) => word.toLowerCase().trim() === validWords[index])

    if (isValid) {
      setPairingSuccess(true)
      setTimeout(() => {
        // Simuler l'ajout de l'appareil et la connexion
        const userStore = UserStore.getInstance()
        const mockService = MockService.getInstance()

        // Simuler des tokens pour le pairing
        userStore.connect("paired_access_token", "paired_refresh_token")
        userStore.pair("paired_device_id")

        router.push("/dashboard")
      }, 2000)
    } else {
      setPairingError("Mots de pairing incorrects. Vérifiez les mots saisis sur votre autre appareil.")
    }
  }

  const handlePairingWordChange = (index: number, value: string) => {
    const newWords = [...pairingWords]
    newWords[index] = value
    setPairingWords(newWords)
    setPairingError("")
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

        {/* Navigation entre connexion et pairing */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setShowPairingSection(false)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              !showPairingSection ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Building2 className="h-4 w-4 inline mr-2" />
            Connexion
          </button>
          <button
            onClick={() => setShowPairingSection(true)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              showPairingSection ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Key className="h-4 w-4 inline mr-2" />
            Pairing
          </button>
        </div>

        {!showPairingSection ? (
          /* Carte de connexion */
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
        ) : (
          /* Carte de pairing */
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2 text-blue-600" />
                Pairing d'appareil
              </CardTitle>
              <CardDescription>Ajoutez cet appareil à votre compte existant</CardDescription>
            </CardHeader>
            <CardContent>
              {!pairingSuccess ? (
                <form onSubmit={handlePairingSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Mots de pairing temporaires</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPairingInput(!showPairingInput)}
                        className="text-blue-700 border-blue-300"
                      >
                        {showPairingInput ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                        {showPairingInput ? "Masquer" : "Afficher"}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">Saisissez les 4 mots affichés sur votre autre appareil</p>
                    <div className="grid grid-cols-2 gap-2">
                      {pairingWords.map((word, index) => (
                        <Input
                          key={index}
                          type={showPairingInput ? "text" : "password"}
                          placeholder={`Mot ${index + 1}`}
                          value={word}
                          onChange={(e) => handlePairingWordChange(index, e.target.value)}
                          className="text-center font-mono select-none"
                          style={{ userSelect: "none", WebkitUserSelect: "none" }}
                          onContextMenu={(e) => e.preventDefault()}
                          onCopy={(e) => e.preventDefault()}
                          onCut={(e) => e.preventDefault()}
                          onPaste={(e) => e.preventDefault()}
                          autoComplete="off"
                          spellCheck={false}
                          required
                        />
                      ))}
                    </div>
                  </div>

                  {pairingError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-700">{pairingError}</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-xs text-blue-700">
                      <p className="font-medium mb-1">Instructions :</p>
                      <ol className="space-y-1">
                        <li>1. Ouvrez DocV sur votre appareil principal</li>
                        <li>2. Allez dans Paramètres → Sécurité</li>
                        <li>3. Cliquez sur "Ajouter un appareil"</li>
                        <li>4. Saisissez les 4 mots affichés ici</li>
                      </ol>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Appairer cet appareil
                  </Button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Pairing réussi !</h3>
                  <p className="text-gray-600 mb-4">Cet appareil a été ajouté à votre compte avec succès.</p>
                  <div className="animate-pulse text-blue-600">Redirection vers le dashboard...</div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
