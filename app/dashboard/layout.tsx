"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  FileText,
  Folder,
  Search,
  Users,
  Settings,
  Shield,
  MessageSquare,
  Bell,
  LogOut,
  Menu,
  X,
  TestTube,
  ChevronRight,
  Home,
} from "lucide-react"
import { AuthModal } from "@/components/4nk/AuthModal"
import { MessageBus } from "@/lib/4nk/MessageBus"
import { UserStore } from "@/lib/4nk/UserStore"
import { DebugInfo } from "@/components/4nk/DebugInfo"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMockMode, setIsMockMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const iframeUrl = process.env.NEXT_PUBLIC_4NK_IFRAME_URL || "https://dev.4nk.io"

  const navigation = [
    { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    { name: "Documents", href: "/dashboard/documents", icon: FileText },
    { name: "Dossiers", href: "/dashboard/folders", icon: Folder },
    { name: "Recherche", href: "/dashboard/search", icon: Search },
    { name: "Collaborateurs", href: "/dashboard/users", icon: Users },
    { name: "Messages", href: "/dashboard/chat", icon: MessageSquare },
    { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
  ]

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const userStore = UserStore.getInstance()
        const accessToken = userStore.getAccessToken()
        const messageBus = MessageBus.getInstance(iframeUrl)

        if (accessToken) {
          // Vérifier si on est en mode mock
          const mockMode = messageBus.isInMockMode()
          setIsMockMode(mockMode)

          if (mockMode) {
            console.log("🎭 Dashboard en mode mock")
            setIsAuthenticated(true)
            setUserInfo({
              id: "mock_user_001",
              name: "Utilisateur Démo",
              email: "demo@docv.fr",
              role: "Administrateur",
              company: "Entreprise Démo (ID: 1234)",
            })
          } else {
            // Vérifier la validité du token en mode production
            const isValid = await messageBus.validateToken()
            if (isValid) {
              setIsAuthenticated(true)
              const pairingId = userStore.getUserPairingId()
              setUserInfo({
                id: pairingId?.slice(0, 8) + "...",
                name: "Utilisateur 4NK",
                email: "user@4nk.io",
                role: "Utilisateur",
                company: "Organisation 4NK",
              })
            } else {
              setIsAuthModalOpen(true)
            }
          }
        } else {
          setIsAuthModalOpen(true)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        setIsAuthModalOpen(true)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthentication()
  }, [iframeUrl])

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false)
    setIsAuthenticated(true)
    // Recharger la page pour récupérer les nouvelles données
    window.location.reload()
  }

  const handleLogout = () => {
    const userStore = UserStore.getInstance()
    const messageBus = MessageBus.getInstance(iframeUrl)

    userStore.disconnect()
    messageBus.disableMockMode()

    // Afficher un message de confirmation avec options
    setShowLogoutConfirm(true)
  }

  const confirmLogout = (goToHome = false) => {
    setShowLogoutConfirm(false)
    if (goToHome) {
      router.push("/")
    } else {
      router.push("/login")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-pulse" />
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <AuthModal
          isOpen={isAuthModalOpen}
          onConnect={handleAuthSuccess}
          onClose={() => router.push("/login")}
          iframeUrl={iframeUrl}
        />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:flex lg:flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">DocV</span>
              {isMockMode && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                  <TestTube className="h-3 w-3 mr-1" />
                  Démo
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User info */}
          {userInfo && (
            <div className="px-6 py-4 border-b bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">{userInfo.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{userInfo.name}</p>
                  <p className="text-xs text-gray-500 truncate">{userInfo.company}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Sécurisé par 4NK</span>
                <Shield className="h-3 w-3" />
              </div>
              {isMockMode && (
                <div className="text-xs text-green-600 bg-green-50 p-2 rounded">Mode démonstration actif</div>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout} className="w-full bg-transparent">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>

              <div className="hidden lg:block">
                <nav className="flex space-x-1 text-sm text-gray-500">
                  <Link href="/dashboard" className="hover:text-gray-700">
                    Tableau de bord
                  </Link>
                  {pathname !== "/dashboard" && (
                    <>
                      <ChevronRight className="h-4 w-4 mx-1" />
                      <span className="text-gray-900 font-medium">
                        {navigation.find((item) => item.href === pathname)?.name || "Page"}
                      </span>
                    </>
                  )}
                </nav>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {isMockMode && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <TestTube className="h-4 w-4 mr-1" />
                  Mode Démo
                </Badge>
              )}

              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">{children}</div>
        </main>
      </div>

      {/* Modal de confirmation de déconnexion */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Déconnexion réussie</h3>
              <p className="text-gray-600 mb-6">Vous avez été déconnecté de votre espace sécurisé DocV.</p>

              <div className="space-y-3">
                <Button onClick={() => confirmLogout(false)} className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Aller à la page de connexion
                </Button>

                <Button onClick={() => confirmLogout(true)} variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Retourner à l'accueil
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-4">Vos données restent sécurisées par le chiffrement 4NK</p>
            </div>
          </div>
        </div>
      )}

      {/* Debug info en mode développement */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 z-50">
          <DebugInfo />
        </div>
      )}
    </div>
  )
}
