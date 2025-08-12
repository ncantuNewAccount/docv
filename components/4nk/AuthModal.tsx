"use client"

import { useState, useEffect, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, CheckCircle, Loader2 } from "lucide-react"
import { Iframe } from "./Iframe"
import { MessageBus } from "@/lib/4nk/MessageBus"
import { IframeReference } from "@/lib/4nk/IframeReference"

interface AuthModalProps {
  isOpen: boolean
  onConnect: () => void
  onClose: () => void
  iframeUrl: string
}

export const AuthModal = memo(function AuthModal({ isOpen, onConnect, onClose, iframeUrl }: AuthModalProps) {
  const [isIframeReady, setIsIframeReady] = useState(false)
  const [showIframe, setShowIframe] = useState(false)
  const [authSuccess, setAuthSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      // Reset des états à la fermeture
      setIsIframeReady(false)
      setShowIframe(false)
      setAuthSuccess(false)
      setIsLoading(false)
      setError(null)
      return
    }

    const initAuth = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log("🔗 Initialisation authentification avec:", iframeUrl)

        // Attendre que l'iframe soit disponible
        let attempts = 0
        const maxAttempts = 20 // Augmenté à 10 secondes

        while (attempts < maxAttempts) {
          const iframe = IframeReference.getIframe()
          if (iframe && iframe.contentWindow) {
            console.log("✅ Iframe disponible après", attempts * 500, "ms")
            break
          }
          await new Promise((resolve) => setTimeout(resolve, 500))
          attempts++
        }

        if (attempts >= maxAttempts) {
          throw new Error("Iframe 4NK non disponible après 10 secondes")
        }

        const messageBus = MessageBus.getInstance(iframeUrl)

        // Attendre que l'iframe soit prête
        console.log("⏳ Vérification de la disponibilité de l'iframe...")
        await messageBus.isReady()
        console.log("✅ Iframe prête")

        setIsIframeReady(true)
        setShowIframe(true)

        // Demander l'authentification
        console.log("🔐 Demande d'authentification...")
        await messageBus.requestLink()
        console.log("✅ Authentification acceptée")

        // Récupérer l'ID d'appairage
        console.log("🆔 Récupération de l'ID d'appairage...")
        await messageBus.getUserPairingId()
        console.log("✅ ID d'appairage récupéré")

        setAuthSuccess(true)

        // Délai avant de déclencher onConnect
        setTimeout(() => {
          onConnect()
        }, 500)
      } catch (err) {
        console.error("❌ Authentication error:", err)
        const errorMessage = err instanceof Error ? err.message : "Erreur d'authentification"

        // Messages d'erreur plus spécifiques
        if (errorMessage.includes("origin")) {
          setError("Erreur de configuration : les domaines ne correspondent pas. Vérifiez la configuration 4NK.")
        } else if (errorMessage.includes("Timeout")) {
          setError("Timeout : L'iframe 4NK ne répond pas. Vérifiez votre connexion.")
        } else {
          setError(errorMessage)
        }

        setIsIframeReady(false)
        setShowIframe(false)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [isOpen, iframeUrl, onConnect])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Authentification 4NK</CardTitle>
          <CardDescription>Connexion sécurisée avec votre identité cryptographique</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 bg-transparent"
                onClick={() => window.location.reload()}
              >
                Réessayer
              </Button>
            </div>
          )}

          {isLoading && !authSuccess && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">{!isIframeReady ? "Initialisation..." : "Authentification en cours..."}</p>
            </div>
          )}

          {authSuccess && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-green-700 font-semibold">Authentification réussie !</p>
              <p className="text-gray-600 text-sm mt-2">Redirection en cours...</p>
            </div>
          )}

          {showIframe && !authSuccess && (
            <div className="border rounded-lg overflow-hidden">
              <Iframe iframeUrl={iframeUrl} showIframe={true} />
            </div>
          )}

          <div className="text-center">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})
