"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Folder,
  Users,
  Activity,
  TrendingUp,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle,
  Download,
  Upload,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Share2,
  TestTube,
  Zap,
  HardDrive,
  X,
} from "lucide-react"
import { MessageBus } from "@/lib/4nk/MessageBus"
import Link from "next/link"

export default function DashboardPage() {
  const [isMockMode, setIsMockMode] = useState(false)
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalFolders: 0,
    totalUsers: 0,
    storageUsed: 0,
    storageLimit: 100,
    recentActivity: 0,
    // Nouveaux indicateurs
    permanentStorage: 0,
    permanentStorageLimit: 1000, // 1 To en Go
    temporaryStorage: 0,
    temporaryStorageLimit: 100, // 100 Mo
    newFoldersThisMonth: 0,
    newFoldersLimit: 75,
    tokensUsed: 0,
    tokensTotal: 1000,
  })

  const [recentDocuments, setRecentDocuments] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const iframeUrl = process.env.NEXT_PUBLIC_4NK_IFRAME_URL || "https://dev.4nk.io"
    const messageBus = MessageBus.getInstance(iframeUrl)
    const mockMode = messageBus.isInMockMode()
    setIsMockMode(mockMode)

    // Simuler le chargement des données
    if (mockMode) {
      setStats({
        totalDocuments: 1247,
        totalFolders: 89,
        totalUsers: 12,
        storageUsed: 67.3,
        storageLimit: 100,
        recentActivity: 24,
        // Nouveaux indicateurs avec données réalistes
        permanentStorage: 673, // 673 Go utilisés sur 1000 Go
        permanentStorageLimit: 1000,
        temporaryStorage: 45, // 45 Mo utilisés sur 100 Mo
        temporaryStorageLimit: 100,
        newFoldersThisMonth: 23, // 23 nouveaux dossiers ce mois
        newFoldersLimit: 75,
        tokensUsed: 673, // Environ 67% des jetons utilisés
        tokensTotal: 1000,
      })

      setRecentDocuments([
        {
          id: "doc_001",
          name: "Contrat_Client_ABC_2024.pdf",
          type: "PDF",
          size: "2.4 MB",
          modifiedAt: "Il y a 2 heures",
          modifiedBy: "Marie Dubois",
          status: "Signé",
          folder: "Contrats 2024",
        },
        {
          id: "doc_002",
          name: "Rapport_Financier_Q1.xlsx",
          type: "Excel",
          size: "1.8 MB",
          modifiedAt: "Il y a 4 heures",
          modifiedBy: "Jean Martin",
          status: "En révision",
          folder: "Finance",
        },
        {
          id: "doc_003",
          name: "Présentation_Produit_V2.pptx",
          type: "PowerPoint",
          size: "15.2 MB",
          modifiedAt: "Hier",
          modifiedBy: "Sophie Laurent",
          status: "Finalisé",
          folder: "Marketing",
        },
        {
          id: "doc_004",
          name: "Cahier_des_charges_Projet_X.docx",
          type: "Word",
          size: "892 KB",
          modifiedAt: "Il y a 2 jours",
          modifiedBy: "Pierre Durand",
          status: "Brouillon",
          folder: "Projets",
        },
        {
          id: "doc_005",
          name: "Facture_2024_001.pdf",
          type: "PDF",
          size: "156 KB",
          modifiedAt: "Il y a 3 jours",
          modifiedBy: "Marie Dubois",
          status: "Payée",
          folder: "Comptabilité",
        },
      ])

      setRecentActivity([
        {
          id: "act_001",
          type: "upload",
          user: "Marie Dubois",
          action: "a téléchargé",
          target: "Contrat_Client_ABC_2024.pdf",
          time: "Il y a 2 heures",
          icon: Upload,
          color: "text-green-600",
        },
        {
          id: "act_002",
          type: "edit",
          user: "Jean Martin",
          action: "a modifié",
          target: "Rapport_Financier_Q1.xlsx",
          time: "Il y a 4 heures",
          icon: Edit,
          color: "text-blue-600",
        },
        {
          id: "act_003",
          type: "share",
          user: "Sophie Laurent",
          action: "a partagé",
          target: "Présentation_Produit_V2.pptx",
          time: "Hier",
          icon: Share2,
          color: "text-purple-600",
        },
        {
          id: "act_004",
          type: "create",
          user: "Pierre Durand",
          action: "a créé le dossier",
          target: "Projets 2024",
          time: "Il y a 2 jours",
          icon: Folder,
          color: "text-orange-600",
        },
        {
          id: "act_005",
          type: "download",
          user: "Marie Dubois",
          action: "a téléchargé",
          target: "Facture_2024_001.pdf",
          time: "Il y a 3 jours",
          icon: Download,
          color: "text-indigo-600",
        },
      ])

      setNotifications([
        {
          id: "notif_001",
          type: "success",
          title: "Document signé",
          message: "Le contrat ABC a été signé par toutes les parties",
          time: "Il y a 1 heure",
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          id: "notif_002",
          type: "warning",
          title: "Stockage temporaire élevé",
          message: "45 Mo utilisés sur 100 Mo de stockage temporaire ce mois",
          time: "Il y a 2 heures",
          icon: AlertCircle,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
        {
          id: "notif_003",
          type: "info",
          title: "Nouveau collaborateur",
          message: "Thomas Petit a rejoint l'équipe Marketing",
          time: "Hier",
          icon: Users,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
      ])
    }
  }, [])

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return "📄"
      case "excel":
        return "📊"
      case "powerpoint":
        return "📈"
      case "word":
        return "📝"
      default:
        return "📄"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "signé":
      case "finalisé":
      case "payée":
        return "bg-green-100 text-green-800"
      case "en révision":
        return "bg-orange-100 text-orange-800"
      case "brouillon":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600">Vue d'ensemble de votre espace documentaire sécurisé</p>
        </div>
        {isMockMode && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <TestTube className="h-4 w-4 mr-2" />
            Données de démonstration
          </Badge>
        )}
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dossiers</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFolders}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +3 cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collaborateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +1 ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jetons utilisés</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tokensUsed}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(stats.tokensUsed / stats.tokensTotal) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.tokensUsed} / {stats.tokensTotal} jetons
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Nouveaux indicateurs de stockage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stockage permanent</CardTitle>
            <HardDrive className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.permanentStorage} Go</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(stats.permanentStorage / stats.permanentStorageLimit) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.permanentStorage} Go / {stats.permanentStorageLimit} Go (1 To)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stockage temporaire</CardTitle>
            <Zap className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.temporaryStorage} Mo</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${
                  stats.temporaryStorage > 80
                    ? "bg-red-600"
                    : stats.temporaryStorage > 60
                      ? "bg-orange-600"
                      : "bg-green-600"
                }`}
                style={{ width: `${(stats.temporaryStorage / stats.temporaryStorageLimit) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.temporaryStorage} Mo / {stats.temporaryStorageLimit} Mo ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux dossiers</CardTitle>
            <Plus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newFoldersThisMonth}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${(stats.newFoldersThisMonth / stats.newFoldersLimit) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.newFoldersThisMonth} / {stats.newFoldersLimit} ce mois
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Actions rapides
          </CardTitle>
          <CardDescription>Accédez rapidement aux fonctionnalités principales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/documents">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <Upload className="h-6 w-6" />
                <span>Télécharger un document</span>
              </Button>
            </Link>
            <Link href="/dashboard/folders">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <Folder className="h-6 w-6" />
                <span>Créer un dossier</span>
              </Button>
            </Link>
            <Link href="/dashboard/search">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <Search className="h-6 w-6" />
                <span>Rechercher</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documents récents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Documents récents
              </span>
              <Link href="/dashboard/documents">
                <Button variant="ghost" size="sm">
                  Voir tout
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                  <div className="text-2xl">{getFileIcon(doc.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{doc.folder}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{doc.modifiedAt}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activité récente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Notifications importantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div key={notif.id} className={`p-4 rounded-lg ${notif.bgColor} border`}>
                <div className="flex items-start space-x-3">
                  <notif.icon className={`h-5 w-5 ${notif.color} mt-0.5`} />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{notif.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {notif.time}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-600" />
            Statut de sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <h4 className="font-medium text-green-900">Sécurité optimale</h4>
              <p className="text-sm text-green-700">
                Tous vos documents sont chiffrés et sécurisés par la technologie 4NK
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3">
              <Shield className="h-6 w-6 mx-auto text-green-600 mb-2" />
              <p className="text-sm font-medium">Chiffrement bout en bout</p>
            </div>
            <div className="text-center p-3">
              <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-2" />
              <p className="text-sm font-medium">Authentification 4NK</p>
            </div>
            <div className="text-center p-3">
              <Activity className="h-6 w-6 mx-auto text-green-600 mb-2" />
              <p className="text-sm font-medium">Audit complet</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
