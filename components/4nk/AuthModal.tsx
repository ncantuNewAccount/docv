"use client"

import { useState, useEffect, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, CheckCircle, Loader2, AlertCircle, RefreshCw } from "lucide-react"
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
  const [loadingStep, setLoadingStep] = useState("")
  const [retryCount, setRetryCount] = useState(0)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  const maxRetries = 3

  useEffect(() => {
    if (!isOpen) {
      // Reset des états à la fermeture
      setIsIframeReady(false)
      setShowIframe(false)
      setAuthSuccess(false)
      setIsLoading(false)
      setError(null)
      setLoadingStep("")
      setRetryCount(0)
      setIframeLoaded(false)
      return
    }

    initAuth()
  }, [isOpen, iframeUrl, retryCount])

  const initAuth = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setLoadingStep("Initialisation...")

      console.log("🔗 Initialisation authentification avec:", iframeUrl)
      console.log("🔄 Tentative:", retryCount + 1, "/", maxRetries + 1)

      // Étape 1: Attendre que l'iframe soit disponible dans le DOM
      setLoadingStep("Chargement de l'iframe...")
      let attempts = 0
      const maxAttempts = 40 // 20 secondes

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
        throw new Error("Iframe 4NK non disponible dans le DOM après 20 secondes")
      }

      // Étape 2: Attendre que l'iframe soit complètement chargée
      setLoadingStep("Attente du chargement complet...")
      await waitForIframeLoad()

      setShowIframe(true)

      // Étape 3: Vérifier que l'iframe répond
      setLoadingStep("Vérification de la communication...")
      const messageBus = MessageBus.getInstance(iframeUrl)

      console.log("⏳ Vérification de la disponibilité de l'iframe...")
      await messageBus.isReady()
      console.log("✅ Iframe prête")

      setIsIframeReady(true)

      // Étape 4: Demander l'authentification
      setLoadingStep("Authentification en cours...")
      console.log("🔐 Demande d'authentification...")
      await messageBus.requestLink()
      console.log("✅ Authentification acceptée")

      // Étape 5: Récupérer l'ID d'appairage
      setLoadingStep("Finalisation...")
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

      setError(errorMessage)
      setIsIframeReady(false)
      setShowIframe(false)
    } finally {
      setIsLoading(false)
      setLoadingStep("")
    }
  }

  const waitForIframeLoad = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const iframe = IframeReference.getIframe()
      if (!iframe) {
        reject(new Error("Iframe not found"))
        return
      }

      // Si l'iframe est déjà chargée
      if (iframeLoaded) {
        resolve()
        return
      }

      const timeout = setTimeout(() => {
        cleanup()
        reject(new Error("Timeout: L'iframe n'a pas fini de se charger"))
      }, 30000) // 30 secondes pour le chargement

      const cleanup = () => {
        clearTimeout(timeout)
        iframe.removeEventListener("load", onLoad)
        iframe.removeEventListener("error", onError)
      }

      const onLoad = () => {
        console.log("✅ Iframe loaded successfully")
        setIframeLoaded(true)
        cleanup()
        // Attendre un peu plus pour que le contenu soit prêt
        setTimeout(resolve, 2000)
      }

      const onError = () => {
        console.error("❌ Iframe failed to load")
        cleanup()
        reject(new Error("Erreur de chargement de l'iframe"))
      }

      iframe.addEventListener("load", onLoad)
      iframe.addEventListener("error", onError)

      // Si l'iframe semble déjà chargée
      if (iframe.contentDocument?.readyState === "complete") {
        onLoad()
      }
    })
  }

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1)
      setError(null)
    } else {
      setError("Nombre maximum de tentatives atteint. Veuillez vérifier votre connexion et réessayer plus tard.")
    }
  }

  const handleForceRetry = () => {
    setRetryCount(0)
    setError(null)
    setIframeLoaded(false)
    // Forcer le rechargement de l'iframe
    const iframe = IframeReference.getIframe()
    if (iframe) {
      iframe.src = iframe.src
    }
  }

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
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-700 text-sm font-medium mb-2">Erreur de connexion</p>
                  <p className="text-red-600 text-xs mb-3">{error}</p>

                  <div className="flex flex-col gap-2">
                    {retryCount < maxRetries && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRetry}
                        className="bg-transparent text-red-700 border-red-300 hover:bg-red-50"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Réessayer ({retryCount + 1}/{maxRetries + 1})
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleForceRetry}
                      className="bg-transparent text-red-700 border-red-300 hover:bg-red-50"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Forcer le rechargement
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoading && !authSuccess && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600 font-medium">{loadingStep}</p>
              {loadingStep && <p className="text-gray-500 text-sm mt-2">Cela peut prendre quelques instants...</p>}

              {/* Barre de progression visuelle */}
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width:
                      loadingStep === "Initialisation..."
                        ? "20%"
                        : loadingStep === "Chargement de l'iframe..."
                          ? "40%"
                          : loadingStep === "Attente du chargement complet..."
                            ? "60%"
                            : loadingStep === "Vérification de la communication..."
                              ? "80%"
                              : loadingStep === "Authentification en cours..."
                                ? "90%"
                                : loadingStep === "Finalisation..."
                                  ? "95%"
                                  : "0%",
                  }}
                />
              </div>
            </div>
          )}

          {authSuccess && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-green-700 font-semibold">Authentification réussie !</p>
              <p className="text-gray-600 text-sm mt-2">Redirection en cours...</p>
            </div>
          )}

          {showIframe && !authSuccess && !error && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-blue-50 p-2 text-center">
                <p className="text-blue-700 text-sm">Interface d'authentification 4NK</p>
              </div>
              <Iframe iframeUrl={iframeUrl} showIframe={true} />
            </div>
          )}

          {/* Informations de debug */}
          {(error || isLoading) && (
            <div className="bg-gray-50 p-3 rounded-lg text-xs">
              <p>
                <strong>URL:</strong> {iframeUrl}
              </p>
              <p>
                <strong>Tentative:</strong> {retryCount + 1}/{maxRetries + 1}
              </p>
              <p>
                <strong>Iframe chargée:</strong> {iframeLoaded ? "Oui" : "Non"}
              </p>
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
