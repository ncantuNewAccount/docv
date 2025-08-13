"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Database,
  Key,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  HardDrive,
  Activity,
  Lock,
  Smartphone,
  Plus,
  X,
} from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false)
  const [showExportConfirmation, setShowExportConfirmation] = useState(false)
  const [settings, setSettings] = useState({
    profile: {
      firstName: "Utilisateur",
      lastName: "Démo",
      email: "demo@docv.fr",
      phone: "+33 1 23 45 67 89",
      position: "Administrateur",
      department: "Direction",
      bio: "Utilisateur de démonstration pour DocV",
    },
    security: {
      twoFactorEnabled: true,
      sessionTimeout: "30",
      passwordLastChanged: new Date("2024-01-01"),
      activeDevices: 1, // Simuler un seul device
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      documentUpdates: true,
      folderSharing: true,
      systemAlerts: true,
      weeklyReport: false,
    },
    appearance: {
      theme: "light",
      language: "fr",
      timezone: "Europe/Paris",
      dateFormat: "dd/mm/yyyy",
      compactMode: false,
    },
    privacy: {
      profileVisibility: "team",
      activityTracking: true,
      dataSharing: false,
      analyticsOptIn: true,
    },
    storage: {
      used: 67.3,
      total: 100,
      autoBackup: true,
      retentionPeriod: "365",
    },
  })

  const [showApiKey, setShowApiKey] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)
  const [showPairingWords, setShowPairingWords] = useState(false)

  // Vérifier si un seul device est connecté au chargement
  useEffect(() => {
    if (settings.security.activeDevices === 1) {
      // Attendre un peu avant d'afficher la modal pour laisser le temps à la page de se charger
      const timer = setTimeout(() => {
        setShowAddDeviceModal(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [settings.security.activeDevices])

  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const tabs = [
    { id: "profile", name: "Profil", icon: User },
    { id: "security", name: "Sécurité", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "appearance", name: "Apparence", icon: Palette },
    { id: "privacy", name: "Confidentialité", icon: Lock },
    { id: "storage", name: "Stockage", icon: Database },
    { id: "api", name: "API", icon: Key },
  ]

  const handleSave = async () => {
    setIsSaving(true)
    // Simuler la sauvegarde
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    showNotification("success", "Paramètres sauvegardés avec succès")
  }

  const handleExportData = () => {
    setShowExportConfirmation(true)
  }

  const confirmExportData = async () => {
    setShowExportConfirmation(false)
    showNotification("info", "Export des données en cours...")

    // Simuler l'export de toutes les données IndexedDB
    setTimeout(() => {
      // Créer un objet simulant les données exportées
      const exportData = {
        timestamp: new Date().toISOString(),
        userData: settings,
        documents: "Données des documents chiffrées",
        folders: "Données des dossiers chiffrées",
        privateKey: "PRIVATE_KEY_ENCRYPTED_DATA",
        certificates: "Certificats blockchain",
        chatHistory: "Historique des conversations",
        preferences: "Préférences utilisateur",
        warning: "⚠️ Ce fichier contient votre clé privée. Gardez-le en sécurité !",
      }

      // Simuler le téléchargement
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `docv-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      showNotification("success", "Export terminé. Fichier téléchargé avec succès.")
    }, 3000)
  }

  const generateApiKey = () => {
    return "docv_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  const generatePairingWords = () => {
    const words = ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot", "golf", "hotel"]
    return Array.from({ length: 4 }, () => words[Math.floor(Math.random() * words.length)])
  }

  const [pairingWords] = useState(generatePairingWords())

  const handleAddDevice = () => {
    setShowAddDeviceModal(false)
    setSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        activeDevices: prev.security.activeDevices + 1,
      },
    }))
    showNotification("success", "Instructions d'appairage générées. Suivez les étapes sur votre autre appareil.")
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-2xl">
                {settings.profile.firstName.charAt(0)}
                {settings.profile.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Changer la photo
              </Button>
              <p className="text-sm text-gray-500 mt-1">JPG, PNG ou GIF. Max 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={settings.profile.firstName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profile: { ...settings.profile, firstName: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={settings.profile.lastName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profile: { ...settings.profile, lastName: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={settings.profile.email}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, email: e.target.value },
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={settings.profile.phone}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, phone: e.target.value },
                })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position">Poste</Label>
              <Input
                id="position"
                value={settings.profile.position}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profile: { ...settings.profile, position: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="department">Département</Label>
              <Input
                id="department"
                value={settings.profile.department}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profile: { ...settings.profile, department: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Biographie</Label>
            <Textarea
              id="bio"
              value={settings.profile.bio}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, bio: e.target.value },
                })
              }
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Authentification à deux facteurs</h4>
              <p className="text-sm text-gray-500">Sécurisez votre compte avec 4NK (obligatoire)</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={true} disabled={true} className="opacity-50" />
              <Badge className="bg-red-100 text-red-800 border-red-200">Obligatoire</Badge>
            </div>
          </div>

          <div>
            <Label htmlFor="sessionTimeout">Délai d'expiration de session (minutes)</Label>
            <Select
              value={settings.security.sessionTimeout}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  security: { ...settings.security, sessionTimeout: value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 heure</SelectItem>
                <SelectItem value="120">2 heures</SelectItem>
                <SelectItem value="480">8 heures</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-900">Sécurité 4NK active</span>
            </div>
            <p className="text-sm text-green-700 mt-1">Votre compte est protégé par le chiffrement bout en bout 4NK</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appareils connectés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">Navigateur actuel</p>
                  <p className="text-sm text-gray-500">Chrome sur Windows • Maintenant</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Actuel</Badge>
            </div>

            {settings.security.activeDevices > 1 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">iPhone</p>
                    <p className="text-sm text-gray-500">Safari • Il y a 2 heures</p>
                  </div>
                </div>
                <Badge variant="outline">Connecté</Badge>
              </div>
            )}

            {settings.security.activeDevices === 1 && (
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-orange-900">Un seul appareil connecté</span>
                </div>
                <p className="text-sm text-orange-800 mb-3">
                  Pour votre sécurité, nous recommandons d'ajouter un second appareil de confiance.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddDeviceModal(true)}
                  className="bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un appareil
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Préférences de notification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Notifications par email</h4>
              <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
            </div>
            <Switch
              checked={settings.notifications.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, emailNotifications: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Notifications push</h4>
              <p className="text-sm text-gray-500">Notifications dans le navigateur</p>
            </div>
            <Switch
              checked={settings.notifications.pushNotifications}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, pushNotifications: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Mises à jour de documents</h4>
              <p className="text-sm text-gray-500">Quand un document est modifié</p>
            </div>
            <Switch
              checked={settings.notifications.documentUpdates}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, documentUpdates: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Partage de dossiers</h4>
              <p className="text-sm text-gray-500">Quand un dossier est partagé avec vous</p>
            </div>
            <Switch
              checked={settings.notifications.folderSharing}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, folderSharing: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Alertes système</h4>
              <p className="text-sm text-gray-500">Notifications importantes du système</p>
            </div>
            <Switch
              checked={settings.notifications.systemAlerts}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, systemAlerts: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Rapport hebdomadaire</h4>
              <p className="text-sm text-gray-500">Résumé de votre activité chaque semaine</p>
            </div>
            <Switch
              checked={settings.notifications.weeklyReport}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, weeklyReport: checked },
                })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Préférences d'affichage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="theme">Thème</Label>
            <Select
              value={settings.appearance.theme}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  appearance: { ...settings.appearance, theme: value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Clair</SelectItem>
                <SelectItem value="dark">Sombre</SelectItem>
                <SelectItem value="auto">Automatique</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language">Langue</Label>
            <Select
              value={settings.appearance.language}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  appearance: { ...settings.appearance, language: value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="timezone">Fuseau horaire</Label>
            <Select
              value={settings.appearance.timezone}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  appearance: { ...settings.appearance, timezone: value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Europe/Paris">Europe/Paris (UTC+1)</SelectItem>
                <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                <SelectItem value="Asia/Tokyo">Asia/Tokyo (UTC+9)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dateFormat">Format de date</Label>
            <Select
              value={settings.appearance.dateFormat}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  appearance: { ...settings.appearance, dateFormat: value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Mode compact</h4>
              <p className="text-sm text-gray-500">Interface plus dense</p>
            </div>
            <Switch
              checked={settings.appearance.compactMode}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  appearance: { ...settings.appearance, compactMode: checked },
                })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Confidentialité et données</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="profileVisibility">Visibilité du profil</Label>
            <Select
              value={settings.privacy.profileVisibility}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  privacy: { ...settings.privacy, profileVisibility: value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="team">Équipe seulement</SelectItem>
                <SelectItem value="private">Privé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Suivi d'activité</h4>
              <p className="text-sm text-gray-500">Permettre le suivi de votre activité</p>
            </div>
            <Switch
              checked={settings.privacy.activityTracking}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  privacy: { ...settings.privacy, activityTracking: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Partage de données</h4>
              <p className="text-sm text-gray-500">Partager des données anonymisées</p>
            </div>
            <Switch
              checked={settings.privacy.dataSharing}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  privacy: { ...settings.privacy, dataSharing: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Analytics</h4>
              <p className="text-sm text-gray-500">Améliorer l'expérience utilisateur</p>
            </div>
            <Switch
              checked={settings.privacy.analyticsOptIn}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  privacy: { ...settings.privacy, analyticsOptIn: checked },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Zone de danger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Supprimer le compte</h4>
                <p className="text-sm text-red-700 mt-1">
                  Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                </p>
                <Button variant="outline" className="mt-3 text-red-600 border-red-300 hover:bg-red-50 bg-transparent">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer mon compte
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderStorageTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Utilisation du stockage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Espace utilisé</span>
              <span className="text-sm text-gray-600">
                {settings.storage.used} GB / {settings.storage.total} GB
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${settings.storage.used}%` }}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <HardDrive className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <p className="font-medium">Documents</p>
              <p className="text-sm text-gray-600">45.2 GB</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Activity className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <p className="font-medium">Sauvegardes</p>
              <p className="text-sm text-gray-600">15.8 GB</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Database className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <p className="font-medium">Métadonnées</p>
              <p className="text-sm text-gray-600">6.3 GB</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Sauvegarde automatique</h4>
              <p className="text-sm text-gray-500">Sauvegarder automatiquement vos données</p>
            </div>
            <Switch
              checked={settings.storage.autoBackup}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  storage: { ...settings.storage, autoBackup: checked },
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="retentionPeriod">Période de rétention (jours)</Label>
            <Select
              value={settings.storage.retentionPeriod}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  storage: { ...settings.storage, retentionPeriod: value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 jours</SelectItem>
                <SelectItem value="90">90 jours</SelectItem>
                <SelectItem value="180">180 jours</SelectItem>
                <SelectItem value="365">1 an</SelectItem>
                <SelectItem value="unlimited">Illimitée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Exporter les données
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Nettoyer le cache
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderApiTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Clés API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Key className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">API DocV</h4>
                <p className="text-sm text-blue-700 mt-1">Utilisez l'API pour intégrer DocV avec vos applications</p>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="apiKey">Clé API principale</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                value={generateApiKey()}
                readOnly
                className="font-mono"
              />
              <Button variant="outline" size="sm" onClick={() => setShowApiKey(!showApiKey)}>
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Régénérer la clé
            </Button>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Documentation API
            </Button>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Sécurité</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Ne partagez jamais votre clé API. Régénérez-la si elle est compromise.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Globe className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun webhook configuré</h3>
            <p className="text-gray-600 mb-4">Configurez des webhooks pour recevoir des notifications en temps réel</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un webhook
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab()
      case "security":
        return renderSecurityTab()
      case "notifications":
        return renderNotificationsTab()
      case "appearance":
        return renderAppearanceTab()
      case "privacy":
        return renderPrivacyTab()
      case "storage":
        return renderStorageTab()
      case "api":
        return renderApiTab()
      default:
        return renderProfileTab()
    }
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : notification.type === "error"
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-blue-100 text-blue-800 border border-blue-200"
          }`}
        >
          {notification.type === "success" && <CheckCircle className="h-5 w-5" />}
          {notification.type === "error" && <X className="h-5 w-5" />}
          {notification.type === "info" && <AlertTriangle className="h-5 w-5" />}
          <span>{notification.message}</span>
          <Button variant="ghost" size="sm" onClick={() => setNotification(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-1">Gérez vos préférences et paramètres de compte</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {isSaving ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">{renderTabContent()}</div>
      </div>

      {/* Modal d'ajout d'appareil */}
      {showAddDeviceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ajouter un appareil de confiance</h3>
              <p className="text-gray-600 mb-6">
                Pour renforcer la sécurité de votre compte, ajoutez un second appareil de confiance.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-blue-900">Mots de pairing temporaires</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPairingWords(!showPairingWords)}
                    className="text-blue-700 border-blue-300"
                  >
                    {showPairingWords ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                    {showPairingWords ? "Masquer" : "Afficher"}
                  </Button>
                </div>
                <div
                  className="grid grid-cols-2 gap-2 mb-3 select-none"
                  style={{ userSelect: "none", WebkitUserSelect: "none" }}
                >
                  {pairingWords.map((word, index) => (
                    <div
                      key={index}
                      className="bg-white p-2 rounded border font-mono text-center select-none"
                      style={{ userSelect: "none", WebkitUserSelect: "none" }}
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    >
                      {showPairingWords ? word : "••••"}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-blue-700">Ces mots expirent dans 10 minutes</p>
              </div>

              <div className="text-left bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Instructions :</h4>
                <ol className="text-sm text-gray-700 space-y-1">
                  <li>1. Allez sur DocV avec votre autre appareil</li>
                  <li>2. Cliquez sur "Pairing" sur la page de connexion</li>
                  <li>3. Saisissez les 4 mots ci-dessus</li>
                  <li>4. Votre appareil apparaîtra automatiquement</li>
                </ol>
              </div>

              <div className="space-y-3">
                <Button onClick={handleAddDevice} className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  J'ai suivi les instructions
                </Button>
                <Button variant="outline" onClick={() => setShowAddDeviceModal(false)} className="w-full">
                  Plus tard
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Vous pouvez toujours ajouter un appareil plus tard depuis les paramètres de sécurité
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation d'export */}
      {showExportConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmer l'export des données</h3>
              <p className="text-gray-600 mb-4">
                Cette action va exporter toutes vos données stockées localement, y compris votre clé privée.
              </p>

              <div className="bg-red-50 p-4 rounded-lg mb-6 border border-red-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <h4 className="font-medium text-red-900 mb-1">⚠️ Attention - Clé privée incluse</h4>
                    <p className="text-sm text-red-700">
                      Le fichier exporté contiendra votre clé privée chiffrée. Gardez ce fichier en sécurité et ne le
                      partagez jamais.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-left bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-blue-900 mb-2">Contenu de l'export :</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Paramètres utilisateur</li>
                  <li>• Documents et métadonnées</li>
                  <li>• Historique des dossiers</li>
                  <li>• Certificats blockchain</li>
                  <li>• Clé privée chiffrée 🔐</li>
                  <li>• Historique des conversations</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button onClick={confirmExportData} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Confirmer l'export
                </Button>
                <Button variant="outline" onClick={() => setShowExportConfirmation(false)} className="w-full">
                  Annuler
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                L'export peut prendre quelques minutes selon la quantité de données
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
