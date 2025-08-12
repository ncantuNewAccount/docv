"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Folder, Users, Activity, TrendingUp, Shield, Clock, CheckCircle } from "lucide-react"
import { MessageBus } from "@/lib/4nk/MessageBus"

export default function DashboardPage() {
  const [processes, setProcesses] = useState<any[]>([])
  const [myProcesses, setMyProcesses] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const iframeUrl = process.env.NEXT_PUBLIC_4NK_IFRAME_URL || "https://dev.4nk.io"

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const messageBus = MessageBus.getInstance(iframeUrl)

        const [allProcesses, userProcesses] = await Promise.all([
          messageBus.getProcesses(),
          messageBus.getMyProcesses(),
        ])

        setProcesses(allProcesses || [])
        setMyProcesses(userProcesses || [])
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [iframeUrl])

  const stats = [
    {
      title: "Documents",
      value: processes.filter((p) => p.type === "document").length,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Dossiers",
      value: processes.filter((p) => p.type === "folder").length,
      icon: Folder,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Mes Process",
      value: myProcesses.length,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Activité",
      value: processes.length,
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de votre espace DocV sécurisé</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Shield className="h-4 w-4 mr-1" />
          Sécurisé 4NK
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Activité récente
            </CardTitle>
            <CardDescription>Dernières actions sur vos process</CardDescription>
          </CardHeader>
          <CardContent>
            {processes.slice(0, 5).map((process, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Process {process.id?.slice(0, 8)}...</p>
                    <p className="text-sm text-gray-600">Type: {process.type || "unknown"}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Actif
                </Badge>
              </div>
            ))}

            {processes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune activité récente</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Sécurité & Conformité
            </CardTitle>
            <CardDescription>État de votre infrastructure sécurisée</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Chiffrement bout en bout</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Actif</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Ancrage blockchain</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Actif</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Authentification 4NK</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Connecté</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Conformité RGPD</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Conforme</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>Accédez rapidement aux fonctionnalités principales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex-col space-y-2">
              <FileText className="h-6 w-6" />
              <span>Nouveau document</span>
            </Button>

            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <Folder className="h-6 w-6" />
              <span>Créer un dossier</span>
            </Button>

            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <Users className="h-6 w-6" />
              <span>Inviter un collaborateur</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
