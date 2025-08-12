"use client"

import type React from "react"
import { Iframe } from "@/components/4nk/Iframe"
import { DebugInfo } from "@/components/4nk/DebugInfo"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  Home,
  FileText,
  Folder,
  Users,
  MessageSquare,
  Workflow,
  Search,
} from "lucide-react"
import { AuthModal } from "@/components/4nk/AuthModal"
import { UserStore } from "@/lib/4nk/UserStore"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userPairingId, setUserPairingId] = useState<string | null>(null)

  const iframeUrl = process.env.NEXT_PUBLIC_4NK_IFRAME_URL || "https://dev3.4nkweb.com"

  useEffect(() => {
    console.log("🔧 Dashboard Layout - iframe URL:", iframeUrl)

    // Vérifier si l'utilisateur est déjà connecté
    const userStore = UserStore.getInstance()
    const isConnected = userStore.isConnected()
    const pairingId = userStore.getUserPairingId()

    console.log("👤 User connected:", isConnected)
    console.log("🆔 Pairing ID:", pairingId?.slice(0, 8) + "...")

    setIsAuthenticated(isConnected)
    setUserPairingId(pairingId)

    if (!isConnected) {
      setIsAuthModalOpen(true)
    }
  }, [iframeUrl])

  const handleAuthSuccess = () => {
    const userStore = UserStore.getInstance()
    setIsAuthenticated(true)
    setUserPairingId(userStore.getUserPairingId())
    setIsAuthModalOpen(false)
  }

  const handleLogout = () => {
    const userStore = UserStore.getInstance()
    userStore.disconnect()
    setIsAuthenticated(false)
    setUserPairingId(null)
    setIsAuthModalOpen(true)
  }

  const navigationItems = [
    { href: "/dashboard", icon: Home, label: "Tableau de bord" },
    { href: "/dashboard/documents", icon: FileText, label: "Documents" },
    { href: "/dashboard/dossiers", icon: Folder, label: "Dossiers" },
    { href: "/dashboard/recherche", icon: Search, label: "Recherche" },
    { href: "/dashboard/workflows", icon: Workflow, label: "Workflows" },
    { href: "/dashboard/chat", icon: MessageSquare, label: "Chat" },
    { href: "/dashboard/collaborateurs", icon: Users, label: "Collaborateurs" },
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        {/* Iframe cachée pour l'authentification */}
        <Iframe iframeUrl={iframeUrl} showIframe={false} />

        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Shield className="h-12 w-12 text-blue-600" />
            <span className="text-4xl font-bold text-gray-900">DocV</span>
            <Badge variant="secondary" className="ml-2">
              By 4NK
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Connexion sécurisée requise</h1>
          <p className="text-gray-600 mb-8">
            Authentifiez-vous avec votre identité cryptographique pour accéder à votre espace DocV.
          </p>

          <AuthModal
            isOpen={isAuthModalOpen}
            onConnect={handleAuthSuccess}
            onClose={() => setIsAuthModalOpen(false)}
            iframeUrl={iframeUrl}
          />
        </div>

        {/* Composant de debug */}
        <DebugInfo />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Iframe cachée pour les communications 4NK */}
      <Iframe iframeUrl={iframeUrl} showIframe={false} />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>

            <Link href="/dashboard" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">DocV</span>
              <Badge variant="secondary" className="ml-2">
                By 4NK
              </Badge>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>ID: {userPairingId?.slice(0, 8)}...</span>
            </div>

            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200 min-h-screen`}
        >
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* Composant de debug */}
      <DebugInfo />
    </div>
  )
}
