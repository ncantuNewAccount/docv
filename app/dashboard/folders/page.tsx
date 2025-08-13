"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Folder,
  FolderOpen,
  Grid3X3,
  List,
  Search,
  Filter,
  Share2,
  Trash2,
  Users,
  FileText,
  Clock,
  Star,
  ChevronRight,
  FolderPlus,
  Upload,
  Download,
  Lock,
  SortAsc,
  SortDesc,
  X,
  UserPlus,
  Crown,
  Shield,
  User,
  CheckCircle,
  XCircle,
  Info,
  CloudUpload,
  Cloud,
  HardDrive,
  Calendar,
  Database,
  Zap,
  Server,
  Snowflake,
  Brain,
  AlertTriangle,
} from "lucide-react"

interface FolderData {
  id: number
  name: string
  description: string
  documentsCount: number
  subfoldersCount: number
  size: string
  created: Date
  modified: Date
  owner: string
  access: "shared" | "private"
  members: string[]
  tags: string[]
  color: string
  favorite: boolean
  storageType: "temporary" | "permanent"
  activity: Array<{
    user: string
    action: string
    item: string
    time: string
  }>
  permissions: {
    canView: boolean
    canEdit: boolean
    canDelete: boolean
    canInvite: boolean
    canArchive: boolean
    canAnalyze: boolean
  }
}

interface ActionModal {
  type: "invite" | "delete" | "create" | "edit" | "archive" | null
  folder: FolderData | null
  folders: FolderData[]
}

interface UserWithRoles {
  id: string
  name: string
  email: string
  avatar: string
  folderRoles: {
    [folderId: string]: {
      role: "owner" | "editor" | "viewer" | "validator" | "contributor"
      assignedDate: Date
    }
  }
  spaceRole: "admin" | "manager" | "user" | "guest"
  spaceRoles: {
    [spaceId: string]: {
      role: "admin" | "manager" | "user" | "guest"
      spaceName: string
    }
  }
}

interface Role {
  id: string
  name: string
  description: string
  level: "folder" | "space" | "global"
}

export default function FoldersPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFolders, setSelectedFolders] = useState<number[]>([])
  const [sortBy, setSortBy] = useState("modified")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterAccess, setFilterAccess] = useState("all")
  const [filterOwner, setFilterOwner] = useState("all")
  const [filterStorage, setFilterStorage] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPath, setCurrentPath] = useState<string[]>(["Racine"])
  const [actionModal, setActionModal] = useState<ActionModal>({ type: null, folder: null, folders: [] })

  // Modal states
  const [inviteMessage, setInviteMessage] = useState("")
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [inviteScope, setInviteScope] = useState<"user" | "role">("user")
  const [folderName, setFolderName] = useState("")
  const [folderDescription, setFolderDescription] = useState("")
  const [folderColor, setFolderColor] = useState("blue")
  const [folderTags, setFolderTags] = useState("")
  const [folderAccess, setFolderAccess] = useState<"shared" | "private">("private")
  const [archiveReason, setArchiveReason] = useState("")
  const [retentionPeriod, setRetentionPeriod] = useState("5")
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)

  const [folders, setFolders] = useState<FolderData[]>([])
  const [stats, setStats] = useState({
    total: 0,
    shared: 0,
    private: 0,
    thisWeek: 0,
    permanent: 0,
    temporary: 0,
  })

  const [users] = useState<UserWithRoles[]>([
    {
      id: "1",
      name: "Marie Dubois",
      email: "marie.dubois@company.com",
      avatar: "MD",
      folderRoles: {
        "1": { role: "owner", assignedDate: new Date("2024-01-01") },
        "4": { role: "editor", assignedDate: new Date("2024-01-05") },
      },
      spaceRole: "manager",
      spaceRoles: {
        main: { role: "manager", spaceName: "Espace Principal" },
        legal: { role: "admin", spaceName: "Espace Juridique" },
      },
    },
    {
      id: "2",
      name: "Sophie Laurent",
      email: "sophie.laurent@company.com",
      avatar: "SL",
      folderRoles: {
        "2": { role: "owner", assignedDate: new Date("2024-01-02") },
        "3": { role: "contributor", assignedDate: new Date("2024-01-10") },
      },
      spaceRole: "user",
      spaceRoles: {
        main: { role: "user", spaceName: "Espace Principal" },
        analytics: { role: "manager", spaceName: "Espace Analytics" },
      },
    },
    {
      id: "3",
      name: "Jean Martin",
      email: "jean.martin@company.com",
      avatar: "JM",
      folderRoles: {
        "3": { role: "owner", assignedDate: new Date("2024-01-03") },
        "2": { role: "viewer", assignedDate: new Date("2024-01-15") },
      },
      spaceRole: "user",
      spaceRoles: {
        main: { role: "user", spaceName: "Espace Principal" },
        projects: { role: "admin", spaceName: "Espace Projets" },
      },
    },
    {
      id: "4",
      name: "Pierre Durand",
      email: "pierre.durand@company.com",
      avatar: "PD",
      folderRoles: {
        "6": { role: "owner", assignedDate: new Date("2024-01-04") },
        "5": { role: "validator", assignedDate: new Date("2024-01-08") },
      },
      spaceRole: "user",
      spaceRoles: {
        main: { role: "user", spaceName: "Espace Principal" },
        training: { role: "admin", spaceName: "Espace Formation" },
      },
    },
    {
      id: "5",
      name: "Admin Système",
      email: "admin@company.com",
      avatar: "AD",
      folderRoles: {
        "5": { role: "owner", assignedDate: new Date("2024-01-01") },
        "1": { role: "validator", assignedDate: new Date("2024-01-01") },
        "4": { role: "validator", assignedDate: new Date("2024-01-01") },
      },
      spaceRole: "admin",
      spaceRoles: {
        main: { role: "admin", spaceName: "Espace Principal" },
        legal: { role: "admin", spaceName: "Espace Juridique" },
        analytics: { role: "admin", spaceName: "Espace Analytics" },
        projects: { role: "admin", spaceName: "Espace Projets" },
        training: { role: "admin", spaceName: "Espace Formation" },
      },
    },
  ])

  const [roles] = useState<Role[]>([
    {
      id: "folder-owner",
      name: "Propriétaire du dossier",
      description: "Contrôle total sur le dossier",
      level: "folder",
    },
    { id: "folder-editor", name: "Éditeur du dossier", description: "Peut modifier les documents", level: "folder" },
    {
      id: "folder-validator",
      name: "Validateur du dossier",
      description: "Peut valider les documents",
      level: "folder",
    },
    {
      id: "folder-contributor",
      name: "Contributeur du dossier",
      description: "Peut ajouter des documents",
      level: "folder",
    },
    { id: "folder-viewer", name: "Lecteur du dossier", description: "Lecture seule", level: "folder" },
    { id: "space-admin", name: "Administrateur d'espace", description: "Contrôle total sur l'espace", level: "space" },
    {
      id: "space-manager",
      name: "Gestionnaire d'espace",
      description: "Gestion des utilisateurs et dossiers",
      level: "space",
    },
    { id: "space-user", name: "Utilisateur d'espace", description: "Accès standard à l'espace", level: "space" },
    { id: "space-guest", name: "Invité d'espace", description: "Accès limité à l'espace", level: "space" },
    { id: "global-admin", name: "Administrateur global", description: "Accès à tous les espaces", level: "global" },
    { id: "global-manager", name: "Gestionnaire global", description: "Gestion multi-espaces", level: "global" },
  ])

  const colors = [
    { id: "blue", name: "Bleu", class: "text-blue-600 bg-blue-100" },
    { id: "green", name: "Vert", class: "text-green-600 bg-green-100" },
    { id: "purple", name: "Violet", class: "text-purple-600 bg-purple-100" },
    { id: "orange", name: "Orange", class: "text-orange-600 bg-orange-100" },
    { id: "red", name: "Rouge", class: "text-red-600 bg-red-100" },
    { id: "pink", name: "Rose", class: "text-pink-600 bg-pink-100" },
    { id: "yellow", name: "Jaune", class: "text-yellow-600 bg-yellow-100" },
    { id: "gray", name: "Gris", class: "text-gray-600 bg-gray-100" },
  ]

  useEffect(() => {
    // Simuler le chargement des dossiers
    const loadFolders = () => {
      const mockFolders: FolderData[] = [
        {
          id: 1,
          name: "Contrats",
          description: "Tous les contrats clients et fournisseurs",
          documentsCount: 45,
          subfoldersCount: 3,
          size: "125 MB",
          created: new Date("2024-01-01T10:00:00"),
          modified: new Date("2024-01-15T14:30:00"),
          owner: "Marie Dubois",
          access: "shared",
          members: ["Marie Dubois", "Jean Martin", "Sophie Laurent"],
          tags: ["juridique", "contrats", "clients"],
          color: "blue",
          favorite: true,
          storageType: "permanent",
          activity: [
            { user: "Marie Dubois", action: "ajouté", item: "Contrat_ABC.pdf", time: "Il y a 2h" },
            { user: "Jean Martin", action: "modifié", item: "Contrat_XYZ.pdf", time: "Il y a 5h" },
          ],
          permissions: {
            canView: true,
            canEdit: true,
            canDelete: true,
            canInvite: true,
            canArchive: false,
            canAnalyze: true,
          },
        },
        {
          id: 2,
          name: "Rapports",
          description: "Rapports mensuels et analyses",
          documentsCount: 28,
          subfoldersCount: 2,
          size: "89 MB",
          created: new Date("2024-01-05T09:15:00"),
          modified: new Date("2024-01-14T16:45:00"),
          owner: "Sophie Laurent",
          access: "private",
          members: ["Sophie Laurent", "Pierre Durand"],
          tags: ["rapports", "analyse", "mensuel"],
          color: "green",
          favorite: false,
          storageType: "temporary",
          activity: [
            { user: "Sophie Laurent", action: "créé", item: "Rapport_Nov.docx", time: "Il y a 1j" },
            { user: "Pierre Durand", action: "consulté", item: "Analyse_Q4.xlsx", time: "Il y a 2j" },
          ],
          permissions: {
            canView: true,
            canEdit: true,
            canDelete: true,
            canInvite: true,
            canArchive: true,
            canAnalyze: true,
          },
        },
        {
          id: 3,
          name: "Projets",
          description: "Documentation des projets en cours",
          documentsCount: 67,
          subfoldersCount: 8,
          size: "234 MB",
          created: new Date("2023-12-15T11:30:00"),
          modified: new Date("2024-01-15T09:20:00"),
          owner: "Jean Martin",
          access: "shared",
          members: ["Jean Martin", "Marie Dubois", "Sophie Laurent", "Pierre Durand"],
          tags: ["projets", "développement", "documentation"],
          color: "purple",
          favorite: true,
          storageType: "temporary",
          activity: [
            { user: "Jean Martin", action: "partagé", item: "Specs_Alpha.pdf", time: "Il y a 3h" },
            { user: "Marie Dubois", action: "commenté", item: "Design_Beta.figma", time: "Il y a 6h" },
          ],
          permissions: {
            canView: true,
            canEdit: true,
            canDelete: true,
            canInvite: true,
            canArchive: true,
            canAnalyze: true,
          },
        },
        {
          id: 4,
          name: "Finance",
          description: "Documents financiers et budgets",
          documentsCount: 32,
          subfoldersCount: 4,
          size: "156 MB",
          created: new Date("2024-01-08T14:20:00"),
          modified: new Date("2024-01-13T11:10:00"),
          owner: "Marie Dubois",
          access: "private",
          members: ["Marie Dubois", "Admin"],
          tags: ["finance", "budget", "comptabilité"],
          color: "orange",
          favorite: false,
          storageType: "permanent",
          activity: [
            { user: "Marie Dubois", action: "mis à jour", item: "Budget_2024.xlsx", time: "Il y a 1j" },
            { user: "Admin", action: "vérifié", item: "Factures_Dec.pdf", time: "Il y a 2j" },
          ],
          permissions: {
            canView: true,
            canEdit: true,
            canDelete: true,
            canInvite: true,
            canArchive: false,
            canAnalyze: true,
          },
        },
        {
          id: 5,
          name: "Ressources Humaines",
          description: "Politiques RH et documents employés",
          documentsCount: 19,
          subfoldersCount: 2,
          size: "67 MB",
          created: new Date("2024-01-10T08:45:00"),
          modified: new Date("2024-01-12T15:30:00"),
          owner: "Admin Système",
          access: "shared",
          members: ["Admin", "Marie Dubois", "Sophie Laurent"],
          tags: ["RH", "politique", "employés"],
          color: "red",
          favorite: false,
          storageType: "temporary",
          activity: [
            { user: "Admin", action: "ajouté", item: "Politique_Télétravail.pdf", time: "Il y a 3j" },
            { user: "Sophie Laurent", action: "lu", item: "Guide_Onboarding.docx", time: "Il y a 4j" },
          ],
          permissions: {
            canView: true,
            canEdit: true,
            canDelete: true,
            canInvite: true,
            canArchive: true,
            canAnalyze: true,
          },
        },
        {
          id: 6,
          name: "Marketing",
          description: "Matériel marketing et campagnes",
          documentsCount: 41,
          subfoldersCount: 5,
          size: "198 MB",
          created: new Date("2023-12-20T16:00:00"),
          modified: new Date("2024-01-11T13:45:00"),
          owner: "Pierre Durand",
          access: "shared",
          members: ["Pierre Durand", "Jean Martin", "Design Team"],
          tags: ["marketing", "campagne", "design"],
          color: "pink",
          favorite: true,
          storageType: "temporary",
          activity: [
            { user: "Pierre Durand", action: "uploadé", item: "Campagne_Q1.psd", time: "Il y a 4j" },
            { user: "Design Team", action: "approuvé", item: "Logo_V2.png", time: "Il y a 5j" },
          ],
          permissions: {
            canView: true,
            canEdit: true,
            canDelete: false,
            canInvite: true,
            canArchive: true,
            canAnalyze: true,
          },
        },
      ]

      setFolders(mockFolders)
      setStats({
        total: mockFolders.length,
        shared: mockFolders.filter((folder) => folder.access === "shared").length,
        private: mockFolders.filter((folder) => folder.access === "private").length,
        thisWeek: mockFolders.filter((folder) => {
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return folder.modified > weekAgo
        }).length,
        permanent: mockFolders.filter((folder) => folder.storageType === "permanent").length,
        temporary: mockFolders.filter((folder) => folder.storageType === "temporary").length,
      })
    }

    loadFolders()
  }, [])

  // Notification system
  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  // Fonction pour envoyer une notification dans le chat du dossier
  const sendFolderChatNotification = (folderId: string, message: string, actionType: string) => {
    const folderUsers = users.filter((user) => user.folderRoles[folderId])

    console.log("Notification envoyée dans le chat du dossier:", {
      folderId,
      recipients: folderUsers.map((u) => ({ name: u.name, role: u.folderRoles[folderId]?.role })),
      message,
      actionType,
      timestamp: new Date().toISOString(),
    })

    folderUsers.forEach((user) => {
      console.log(`📱 Notification push envoyée à ${user.name} (${user.email})`)
    })
  }

  // Fonction pour organiser les utilisateurs par rôles
  const organizeUsersForInvitation = (currentFolderId: string) => {
    const organized = {
      folderRoles: {} as { [role: string]: UserWithRoles[] },
      spaceRoles: {} as { [role: string]: UserWithRoles[] },
      otherSpaces: {} as { [spaceName: string]: UserWithRoles[] },
    }

    users.forEach((user) => {
      if (user.folderRoles[currentFolderId]) {
        const role = user.folderRoles[currentFolderId].role
        if (!organized.folderRoles[role]) organized.folderRoles[role] = []
        organized.folderRoles[role].push(user)
      }

      const spaceRole = user.spaceRole
      if (!organized.spaceRoles[spaceRole]) organized.spaceRoles[spaceRole] = []
      organized.spaceRoles[spaceRole].push(user)

      Object.values(user.spaceRoles).forEach((spaceInfo) => {
        if (spaceInfo.spaceName !== "Espace Principal") {
          if (!organized.otherSpaces[spaceInfo.spaceName]) organized.otherSpaces[spaceInfo.spaceName] = []
          organized.otherSpaces[spaceInfo.spaceName].push(user)
        }
      })
    })

    return organized
  }

  // Folder actions
  const handleOpenFolder = (folder: FolderData) => {
    // Rediriger vers la page documents avec le filtre du dossier
    router.push(`/dashboard/documents?folder=${encodeURIComponent(folder.name)}`)
  }

  const handleInviteFolder = (folder: FolderData) => {
    setInviteMessage("")
    setSelectedUser("")
    setSelectedRole("")
    setInviteScope("user")
    setActionModal({ type: "invite", folder, folders: [] })
  }

  const handleArchiveFolder = (folder: FolderData) => {
    setArchiveReason("")
    setRetentionPeriod("5")
    setActionModal({ type: "archive", folder, folders: [] })
  }

  const handleAIAnalysis = (folder: FolderData) => {
    showNotification("info", `Analyse IA en cours pour ${folder.name}...`)

    // Simuler une analyse IA
    setTimeout(
      () => {
        const analysisResults = [
          `📊 **Analyse du dossier "${folder.name}"**\n\n` +
            `**Contenu :** ${folder.documentsCount} documents analysés (${folder.size})\n` +
            `**Thématiques principales :** ${folder.tags.join(", ")}\n` +
            `**Niveau d'activité :** ${folder.activity.length > 2 ? "Élevé" : "Modéré"} (dernière modification ${formatDate(folder.modified)})\n\n` +
            `**Recommandations :**\n` +
            `• ${folder.storageType === "temporary" ? "Considérer l'archivage vers le stockage permanent" : "Dossier déjà archivé de manière optimale"}\n` +
            `• ${folder.access === "private" ? "Évaluer les possibilités de partage avec l'équipe" : "Partage actuel avec " + folder.members.length + " membre(s)"}\n` +
            `• Dernière activité significative détectée il y a ${Math.floor(Math.random() * 7) + 1} jour(s)\n\n` +
            `**Score de pertinence :** ${Math.floor(Math.random() * 30) + 70}/100`,

          `🔍 **Analyse approfondie du dossier "${folder.name}"**\n\n` +
            `**Structure documentaire :**\n` +
            `• ${Math.floor(folder.documentsCount * 0.4)} documents principaux\n` +
            `• ${Math.floor(folder.documentsCount * 0.3)} documents de support\n` +
            `• ${Math.floor(folder.documentsCount * 0.3)} documents annexes\n\n` +
            `**Analyse temporelle :**\n` +
            `• Création : ${folder.created.toLocaleDateString("fr-FR")}\n` +
            `• Pic d'activité détecté en ${new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}\n` +
            `• Tendance : ${Math.random() > 0.5 ? "Croissante" : "Stable"}\n\n` +
            `**Recommandations stratégiques :**\n` +
            `• ${folder.documentsCount > 50 ? "Envisager une réorganisation en sous-dossiers" : "Structure actuelle optimale"}\n` +
            `• ${folder.members.length < 3 ? "Potentiel de collaboration à explorer" : "Équipe collaborative active"}\n` +
            `• Prochaine révision recommandée : ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR")}`,

          `🎯 **Insights IA pour "${folder.name}"**\n\n` +
            `**Analyse sémantique :**\n` +
            `• Cohérence thématique : ${Math.floor(Math.random() * 20) + 80}%\n` +
            `• Mots-clés dominants : ${folder.tags.slice(0, 3).join(", ")}\n` +
            `• Complexité moyenne : ${["Faible", "Modérée", "Élevée"][Math.floor(Math.random() * 3)]}\n\n` +
            `**Patterns détectés :**\n` +
            `• ${Math.random() > 0.5 ? "Cycle de révision régulier identifié" : "Activité sporadique détectée"}\n` +
            `• ${Math.random() > 0.5 ? "Collaboration inter-équipes active" : "Usage principalement individuel"}\n` +
            `• ${folder.storageType === "permanent" ? "Archivage conforme aux bonnes pratiques" : "Optimisation de stockage possible"}\n\n` +
            `**Actions suggérées :**\n` +
            `• ${Math.random() > 0.5 ? "Créer un template basé sur ce dossier" : "Standardiser la nomenclature"}\n` +
            `• ${Math.random() > 0.5 ? "Planifier une session de nettoyage" : "Maintenir la structure actuelle"}\n` +
            `• Prochaine analyse automatique : ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR")}`,
        ]

        const randomAnalysis = analysisResults[Math.floor(Math.random() * analysisResults.length)]

        // Envoyer l'analyse dans le chat du dossier
        sendFolderChatNotification(folder.id.toString(), `🤖 ${randomAnalysis}`, "ai_analysis")

        showNotification("success", `Analyse IA terminée pour ${folder.name}. Redirection vers le chat...`)

        // Rediriger vers le chat après 1.5 secondes
        setTimeout(() => {
          router.push("/dashboard/chat")
        }, 1500)
      },
      2000 + Math.random() * 3000,
    )
  }

  const handleDeleteFolder = (folder: FolderData) => {
    setActionModal({ type: "delete", folder, folders: [] })
  }

  const handleCreateFolder = () => {
    setFolderName("")
    setFolderDescription("")
    setFolderColor("blue")
    setFolderTags("")
    setFolderAccess("private")
    setActionModal({ type: "create", folder: null, folders: [] })
  }

  const handleToggleFavorite = (folderId: number) => {
    const folder = folders.find((f) => f.id === folderId)
    if (!folder) return

    setFolders((prev) => prev.map((f) => (f.id === folderId ? { ...f, favorite: !f.favorite } : f)))

    const action = folder.favorite ? "retiré des" : "ajouté aux"
    showNotification("success", `${folder.name} ${action} favoris`)

    sendFolderChatNotification(folderId.toString(), `⭐ Le dossier a été ${action} favoris`, "favorite")
  }

  // Bulk actions
  const handleBulkDownload = () => {
    const selectedFolderData = folders.filter((folder) => selectedFolders.includes(folder.id))
    showNotification("info", `Téléchargement de ${selectedFolderData.length} dossier(s)...`)

    selectedFolderData.forEach((folder) => {
      sendFolderChatNotification(folder.id.toString(), `📥 Le dossier a été téléchargé`, "download")
    })

    setTimeout(() => {
      showNotification("success", `${selectedFolderData.length} dossier(s) téléchargé(s) avec succès`)
      setSelectedFolders([])
    }, 2000)
  }

  const handleBulkInvite = () => {
    const selectedFolderData = folders.filter(
      (folder) => selectedFolders.includes(folder.id) && folder.permissions.canInvite,
    )
    if (selectedFolderData.length === 0) {
      showNotification("error", "Aucun dossier sélectionné ne peut être partagé")
      return
    }
    setInviteMessage("")
    setSelectedUser("")
    setSelectedRole("")
    setInviteScope("user")
    setActionModal({ type: "invite", folder: null, folders: selectedFolderData })
  }

  const handleBulkArchive = () => {
    const selectedFolderData = folders.filter(
      (folder) => selectedFolders.includes(folder.id) && folder.permissions.canArchive,
    )
    if (selectedFolderData.length === 0) {
      showNotification("error", "Aucun dossier sélectionné ne peut être archivé")
      return
    }
    setArchiveReason("")
    setRetentionPeriod("5")
    setActionModal({ type: "archive", folder: null, folders: selectedFolderData })
  }

  const handleBulkAIAnalysis = () => {
    const selectedFolderData = folders.filter(
      (folder) => selectedFolders.includes(folder.id) && folder.permissions.canAnalyze,
    )
    if (selectedFolderData.length === 0) {
      showNotification("error", "Aucun dossier sélectionné ne peut être analysé")
      return
    }

    showNotification("info", `Analyse IA en cours pour ${selectedFolderData.length} dossier(s)...`)

    // Analyser chaque dossier avec un délai échelonné
    selectedFolderData.forEach((folder, index) => {
      setTimeout(() => {
        const bulkAnalysis =
          `📊 **Analyse IA groupée - Dossier "${folder.name}"**\n\n` +
          `**Position dans l'analyse :** ${index + 1}/${selectedFolderData.length}\n` +
          `**Contenu :** ${folder.documentsCount} documents (${folder.size})\n` +
          `**Tags :** ${folder.tags.join(", ")}\n\n` +
          `**Analyse comparative :**\n` +
          `• Taille relative : ${folder.documentsCount > 40 ? "Au-dessus de la moyenne" : "Dans la moyenne"}\n` +
          `• Activité : ${folder.activity.length > 1 ? "Active" : "Modérée"}\n` +
          `• Collaboration : ${folder.members.length} membre(s)\n\n` +
          `**Recommandation :** ${folder.storageType === "temporary" ? "Candidat à l'archivage" : "Archivage optimal"}\n` +
          `**Score global :** ${Math.floor(Math.random() * 30) + 70}/100`

        sendFolderChatNotification(folder.id.toString(), `🤖 ${bulkAnalysis}`, "bulk_ai_analysis")
      }, index * 1500) // Échelonner les analyses
    })

    setTimeout(
      () => {
        const totalDocs = selectedFolderData.reduce((sum, folder) => sum + folder.documentsCount, 0)
        showNotification(
          "success",
          `Analyse IA terminée pour ${selectedFolderData.length} dossier(s) (${totalDocs} documents). Redirection vers le chat...`,
        )
        setSelectedFolders([])

        // Rediriger vers le chat après l'analyse groupée
        setTimeout(() => {
          router.push("/dashboard/chat")
        }, 1500)
      },
      selectedFolderData.length * 1500 + 1000,
    )
  }

  const handleBulkDelete = () => {
    const selectedFolderData = folders.filter(
      (folder) => selectedFolders.includes(folder.id) && folder.permissions.canDelete,
    )
    if (selectedFolderData.length === 0) {
      showNotification("error", "Aucun dossier sélectionné ne peut être supprimé")
      return
    }
    setActionModal({ type: "delete", folder: null, folders: selectedFolderData })
  }

  // Modal actions
  const confirmInvite = () => {
    const recipient =
      inviteScope === "user"
        ? users.find((u) => u.id === selectedUser)?.name
        : roles.find((r) => r.id === selectedRole)?.name

    if (actionModal.folder) {
      showNotification("success", `${actionModal.folder.name} partagé avec ${recipient}. Un message a été envoyé.`)
      sendFolderChatNotification(
        actionModal.folder.id.toString(),
        `👥 Le dossier a été partagé avec ${recipient}. Message: ${inviteMessage}`,
        "invite",
      )
    } else if (actionModal.folders.length > 0) {
      actionModal.folders.forEach((folder) => {
        sendFolderChatNotification(
          folder.id.toString(),
          `👥 Le dossier a été partagé avec ${recipient}. Message: ${inviteMessage}`,
          "bulk_invite",
        )
      })
      showNotification(
        "success",
        `${actionModal.folders.length} dossier(s) partagé(s) avec ${recipient}. Messages envoyés.`,
      )
      setSelectedFolders([])
    }
    setActionModal({ type: null, folder: null, folders: [] })
  }

  const confirmArchive = () => {
    if (actionModal.folder) {
      const updatedFolder = {
        ...actionModal.folder,
        storageType: "permanent" as const,
        modified: new Date(),
      }
      setFolders((prev) => prev.map((f) => (f.id === updatedFolder.id ? updatedFolder : f)))
      showNotification(
        "success",
        `${actionModal.folder.name} et tous ses documents archivés vers le stockage permanent`,
      )

      // Notification dans le chat du dossier
      let message = `📦 Le dossier et tous ses ${actionModal.folder.documentsCount} document(s) ont été archivés vers le stockage permanent (conservation: ${retentionPeriod} ans)`
      if (archiveReason.trim()) {
        message += ` - Raison: ${archiveReason}`
      }

      sendFolderChatNotification(actionModal.folder.id.toString(), message, "archive")
    } else if (actionModal.folders.length > 0) {
      const folderIds = actionModal.folders.map((f) => f.id)
      setFolders((prev) =>
        prev.map((f) =>
          folderIds.includes(f.id)
            ? {
                ...f,
                storageType: "permanent" as const,
                modified: new Date(),
              }
            : f,
        ),
      )

      actionModal.folders.forEach((folder) => {
        let message = `📦 Le dossier et tous ses ${folder.documentsCount} document(s) ont été archivés vers le stockage permanent (conservation: ${retentionPeriod} ans)`
        if (archiveReason.trim()) {
          message += ` - Raison: ${archiveReason}`
        }
        sendFolderChatNotification(folder.id.toString(), message, "bulk_archive")
      })

      const totalDocuments = actionModal.folders.reduce((sum, folder) => sum + folder.documentsCount, 0)
      showNotification(
        "success",
        `${actionModal.folders.length} dossier(s) et ${totalDocuments} document(s) archivés vers le stockage permanent`,
      )
      setSelectedFolders([])
    }
    setActionModal({ type: null, folder: null, folders: [] })
  }

  const confirmCreate = () => {
    const newFolder: FolderData = {
      id: Math.max(...folders.map((f) => f.id)) + 1,
      name: folderName,
      description: folderDescription,
      documentsCount: 0,
      subfoldersCount: 0,
      size: "0 MB",
      created: new Date(),
      modified: new Date(),
      owner: "Utilisateur actuel",
      access: folderAccess,
      members: ["Utilisateur actuel"],
      tags: folderTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      color: folderColor,
      favorite: false,
      storageType: "temporary",
      activity: [],
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canInvite: true,
        canArchive: true,
        canAnalyze: true,
      },
    }
    setFolders((prev) => [...prev, newFolder])
    showNotification("success", `Dossier "${folderName}" créé avec succès`)
    setActionModal({ type: null, folder: null, folders: [] })
  }

  const confirmDelete = () => {
    if (actionModal.folder) {
      sendFolderChatNotification(actionModal.folder.id.toString(), `🗑️ Le dossier a été supprimé`, "delete")
      setFolders((prev) => prev.filter((f) => f.id !== actionModal.folder!.id))
      showNotification("success", `${actionModal.folder.name} supprimé`)
    } else if (actionModal.folders.length > 0) {
      actionModal.folders.forEach((folder) => {
        sendFolderChatNotification(folder.id.toString(), `🗑️ Le dossier a été supprimé`, "bulk_delete")
      })
      const folderIds = actionModal.folders.map((f) => f.id)
      setFolders((prev) => prev.filter((f) => !folderIds.includes(f.id)))
      showNotification("success", `${actionModal.folders.length} dossier(s) supprimé(s)`)
      setSelectedFolders([])
    }
    setActionModal({ type: null, folder: null, folders: [] })
  }

  const filteredFolders = folders
    .filter((folder) => {
      if (searchTerm && !folder.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      if (filterAccess !== "all" && folder.access !== filterAccess) {
        return false
      }
      if (filterOwner !== "all" && folder.owner !== filterOwner) {
        return false
      }
      if (filterStorage !== "all" && folder.storageType !== filterStorage) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      let aValue, bValue
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "size":
          aValue = Number.parseFloat(a.size.replace(/[^\d.]/g, ""))
          bValue = Number.parseFloat(b.size.replace(/[^\d.]/g, ""))
          break
        case "owner":
          aValue = a.owner.toLowerCase()
          bValue = b.owner.toLowerCase()
          break
        case "documents":
          aValue = a.documentsCount
          bValue = b.documentsCount
          break
        case "modified":
        default:
          aValue = a.modified.getTime()
          bValue = b.modified.getTime()
          break
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const getFolderColor = (color: string) => {
    const colorObj = colors.find((c) => c.id === color)
    return colorObj?.class || "text-gray-600 bg-gray-100"
  }

  const getStorageIcon = (storageType: string) => {
    return storageType === "permanent" ? (
      <Cloud className="h-4 w-4 text-blue-600" title="Stockage permanent" />
    ) : (
      <HardDrive className="h-4 w-4 text-gray-600" title="Stockage temporaire" />
    )
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-600" />
      case "editor":
        return <FileText className="h-4 w-4 text-blue-600" />
      case "validator":
        return <Shield className="h-4 w-4 text-green-600" />
      case "contributor":
        return <UserPlus className="h-4 w-4 text-purple-600" />
      case "viewer":
        return <FileText className="h-4 w-4 text-gray-600" />
      case "admin":
        return <Shield className="h-4 w-4 text-red-600" />
      case "manager":
        return <Users className="h-4 w-4 text-orange-600" />
      case "user":
        return <User className="h-4 w-4 text-blue-600" />
      case "guest":
        return <User className="h-4 w-4 text-gray-400" />
      default:
        return <User className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Il y a quelques minutes"
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)} heure${Math.floor(diffInHours) > 1 ? "s" : ""}`
    } else if (diffInHours < 48) {
      return "Hier"
    } else {
      return date.toLocaleDateString("fr-FR")
    }
  }

  const toggleFolderSelection = (folderId: number) => {
    setSelectedFolders((prev) => (prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]))
  }

  const selectAllFolders = () => {
    if (selectedFolders.length === filteredFolders.length) {
      setSelectedFolders([])
    } else {
      setSelectedFolders(filteredFolders.map((folder) => folder.id))
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
          {notification.type === "error" && <XCircle className="h-5 w-5" />}
          {notification.type === "info" && <Info className="h-5 w-5" />}
          <span>{notification.message}</span>
          <Button variant="ghost" size="sm" onClick={() => setNotification(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dossiers</h1>
          <p className="text-gray-600 mt-1">Organisez vos documents par dossiers</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button size="sm" onClick={handleCreateFolder}>
            <FolderPlus className="h-4 w-4 mr-2" />
            Nouveau dossier
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        {currentPath.map((path, index) => (
          <div key={index} className="flex items-center space-x-2">
            {index > 0 && <ChevronRight className="h-4 w-4" />}
            <button
              className={`hover:text-gray-900 ${index === currentPath.length - 1 ? "font-medium text-gray-900" : ""}`}
              onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
            >
              {path}
            </button>
          </div>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Folder className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Partagés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.shared}</p>
              </div>
              <Share2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Privés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.private}</p>
              </div>
              <Lock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cette semaine</p>
                <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Permanents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.permanent}</p>
              </div>
              <Cloud className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Temporaires</p>
                <p className="text-2xl font-bold text-gray-900">{stats.temporary}</p>
              </div>
              <HardDrive className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher des dossiers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Label htmlFor="sort" className="text-sm">
                  Trier par:
                </Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modified">Modifié</SelectItem>
                    <SelectItem value="name">Nom</SelectItem>
                    <SelectItem value="size">Taille</SelectItem>
                    <SelectItem value="owner">Propriétaire</SelectItem>
                    <SelectItem value="documents">Documents</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                  {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center space-x-1 border rounded-md">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="filterAccess" className="text-sm font-medium">
                    Accès
                  </Label>
                  <Select value={filterAccess} onValueChange={setFilterAccess}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les accès</SelectItem>
                      <SelectItem value="shared">Partagés</SelectItem>
                      <SelectItem value="private">Privés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="filterOwner" className="text-sm font-medium">
                    Propriétaire
                  </Label>
                  <Select value={filterOwner} onValueChange={setFilterOwner}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les propriétaires</SelectItem>
                      <SelectItem value="Marie Dubois">Marie Dubois</SelectItem>
                      <SelectItem value="Sophie Laurent">Sophie Laurent</SelectItem>
                      <SelectItem value="Jean Martin">Jean Martin</SelectItem>
                      <SelectItem value="Pierre Durand">Pierre Durand</SelectItem>
                      <SelectItem value="Admin Système">Admin Système</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="filterStorage" className="text-sm font-medium">
                    Type de stockage
                  </Label>
                  <Select value={filterStorage} onValueChange={setFilterStorage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les stockages</SelectItem>
                      <SelectItem value="temporary">
                        <div className="flex items-center space-x-2">
                          <HardDrive className="h-4 w-4" />
                          <span>Temporaire</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="permanent">
                        <div className="flex items-center space-x-2">
                          <Cloud className="h-4 w-4" />
                          <span>Permanent</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterAccess("all")
                      setFilterOwner("all")
                      setFilterStorage("all")
                      setSearchTerm("")
                    }}
                  >
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedFolders.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedFolders.length === filteredFolders.length}
                  onCheckedChange={selectAllFolders}
                />
                <span className="text-sm font-medium">
                  {selectedFolders.length} dossier{selectedFolders.length > 1 ? "s" : ""} sélectionné
                  {selectedFolders.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleBulkDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkInvite}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkArchive}>
                  <CloudUpload className="h-4 w-4 mr-2" />
                  Archiver
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkAIAnalysis}>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyse IA
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="text-red-600 hover:text-red-700 bg-transparent"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Folders List/Grid */}
      <Card>
        <CardContent className="p-0">
          {viewMode === "list" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 w-8">
                      <Checkbox
                        checked={selectedFolders.length === filteredFolders.length}
                        onCheckedChange={selectAllFolders}
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Nom</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Documents</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Taille</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Modifié</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Propriétaire</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Stockage</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Accès</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Membres</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFolders.map((folder) => (
                    <tr key={folder.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={selectedFolders.includes(folder.id)}
                          onCheckedChange={() => toggleFolderSelection(folder.id)}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${getFolderColor(folder.color)}`}>
                            <Folder className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{folder.name}</span>
                              <button onClick={() => handleToggleFavorite(folder.id)}>
                                <Star
                                  className={`h-4 w-4 ${folder.favorite ? "text-yellow-500 fill-current" : "text-gray-300"} hover:text-yellow-500`}
                                />
                              </button>
                              {folder.access === "private" && <Lock className="h-4 w-4 text-gray-400" />}
                            </div>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{folder.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        <div className="flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span>{folder.documentsCount}</span>
                          {folder.subfoldersCount > 0 && (
                            <>
                              <span className="text-gray-400">•</span>
                              <Folder className="h-4 w-4" />
                              <span>{folder.subfoldersCount}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{folder.size}</td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(folder.modified)}</td>
                      <td className="py-3 px-4 text-gray-600">{folder.owner}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          {getStorageIcon(folder.storageType)}
                          <span className="text-sm text-gray-600 capitalize">
                            {folder.storageType === "permanent" ? "Permanent" : "Temporaire"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className={
                            folder.access === "shared"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-orange-50 text-orange-700 border-orange-200"
                          }
                        >
                          {folder.access === "shared" ? "Partagé" : "Privé"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{folder.members.length}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenFolder(folder)}>
                            <FolderOpen className="h-4 w-4" />
                          </Button>
                          {folder.permissions.canInvite && (
                            <Button variant="ghost" size="sm" onClick={() => handleInviteFolder(folder)}>
                              <Share2 className="h-4 w-4" />
                            </Button>
                          )}
                          {folder.permissions.canArchive && (
                            <Button variant="ghost" size="sm" onClick={() => handleArchiveFolder(folder)}>
                              <CloudUpload className="h-4 w-4" />
                            </Button>
                          )}
                          {folder.permissions.canAnalyze && (
                            <Button variant="ghost" size="sm" onClick={() => handleAIAnalysis(folder)}>
                              <Brain className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredFolders.map((folder) => (
                  <div
                    key={folder.id}
                    className={`relative group border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer ${
                      selectedFolders.includes(folder.id) ? "bg-blue-50 border-blue-200" : "bg-white"
                    }`}
                    onClick={() => handleOpenFolder(folder)}
                  >
                    <div className="absolute top-4 left-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedFolders.includes(folder.id)}
                        onCheckedChange={() => toggleFolderSelection(folder.id)}
                      />
                    </div>

                    <div
                      className="absolute top-4 right-4 flex items-center space-x-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button onClick={() => handleToggleFavorite(folder.id)}>
                        <Star
                          className={`h-4 w-4 ${folder.favorite ? "text-yellow-500 fill-current" : "text-gray-300"} hover:text-yellow-500`}
                        />
                      </button>
                      {getStorageIcon(folder.storageType)}
                      {folder.access === "private" && <Lock className="h-4 w-4 text-gray-400" />}
                    </div>

                    <div className="flex flex-col items-center space-y-4 mt-8">
                      <div className={`p-4 rounded-xl ${getFolderColor(folder.color)}`}>
                        <Folder className="h-12 w-12" />
                      </div>

                      <div className="text-center space-y-2 w-full">
                        <h3 className="font-semibold text-gray-900 text-lg truncate" title={folder.name}>
                          {folder.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{folder.description}</p>

                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <FileText className="h-4 w-4" />
                            <span>{folder.documentsCount}</span>
                          </div>
                          {folder.subfoldersCount > 0 && (
                            <div className="flex items-center space-x-1">
                              <Folder className="h-4 w-4" />
                              <span>{folder.subfoldersCount}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{folder.members.length}</span>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          <p>{folder.size}</p>
                          <p>{formatDate(folder.modified)}</p>
                          <div className="flex items-center justify-center space-x-1 mt-1">
                            {getStorageIcon(folder.storageType)}
                            <span>{folder.storageType === "permanent" ? "Permanent" : "Temporaire"}</span>
                          </div>
                        </div>

                        <Badge
                          variant="outline"
                          className={
                            folder.access === "shared"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-orange-50 text-orange-700 border-orange-200"
                          }
                        >
                          {folder.access === "shared" ? "Partagé" : "Privé"}
                        </Badge>
                      </div>

                      <div
                        className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="sm" onClick={() => handleOpenFolder(folder)}>
                          <FolderOpen className="h-4 w-4" />
                        </Button>
                        {folder.permissions.canInvite && (
                          <Button variant="ghost" size="sm" onClick={() => handleInviteFolder(folder)}>
                            <Share2 className="h-4 w-4" />
                          </Button>
                        )}
                        {folder.permissions.canArchive && (
                          <Button variant="ghost" size="sm" onClick={() => handleArchiveFolder(folder)}>
                            <CloudUpload className="h-4 w-4" />
                          </Button>
                        )}
                        {folder.permissions.canAnalyze && (
                          <Button variant="ghost" size="sm" onClick={() => handleAIAnalysis(folder)}>
                            <Brain className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-xs font-medium text-gray-700 mb-2">Activité récente</h4>
                      <div className="space-y-1">
                        {folder.activity.slice(0, 2).map((activity, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            <span className="font-medium">{activity.user}</span> a {activity.action}{" "}
                            <span className="font-medium">{activity.item}</span>
                            <div className="text-gray-500">{activity.time}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredFolders.length === 0 && (
            <div className="text-center py-12">
              <Folder className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun dossier trouvé</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterAccess !== "all" || filterOwner !== "all" || filterStorage !== "all"
                  ? "Essayez de modifier vos critères de recherche"
                  : "Commencez par créer votre premier dossier"}
              </p>
              <Button onClick={handleCreateFolder}>
                <FolderPlus className="h-4 w-4 mr-2" />
                Nouveau dossier
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {actionModal.type && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Invite Modal */}
            {actionModal.type === "invite" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Partager le dossier</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActionModal({ type: null, folder: null, folders: [] })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {actionModal.folder ? (
                        <>
                          Le dossier <strong>{actionModal.folder.name}</strong> sera partagé avec la personne invitée.
                        </>
                      ) : (
                        <>
                          <strong>{actionModal.folders.length} dossier(s)</strong> seront partagés avec la personne
                          invitée.
                        </>
                      )}
                    </p>
                  </div>

                  {actionModal.folders.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Dossiers à partager :</p>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {actionModal.folders.map((folder) => (
                          <div key={folder.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm">
                            <div className={`p-1 rounded ${getFolderColor(folder.color)}`}>
                              <Folder className="h-4 w-4" />
                            </div>
                            <span className="flex-1 truncate">{folder.name}</span>
                            <span className="text-xs text-gray-500">{folder.documentsCount} docs</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium">Type d'invitation</Label>
                    <div className="flex space-x-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="inviteScope"
                          value="user"
                          checked={inviteScope === "user"}
                          onChange={(e) => setInviteScope(e.target.value as "user" | "role")}
                          className="mr-2"
                        />
                        Utilisateur spécifique
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="inviteScope"
                          value="role"
                          checked={inviteScope === "role"}
                          onChange={(e) => setInviteScope(e.target.value as "user" | "role")}
                          className="mr-2"
                        />
                        Rôle/Groupe
                      </label>
                    </div>
                  </div>

                  {inviteScope === "user" ? (
                    <div>
                      <Label htmlFor="selectedUser">Sélectionner un utilisateur</Label>
                      <Select value={selectedUser} onValueChange={setSelectedUser}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un utilisateur" />
                        </SelectTrigger>
                        <SelectContent className="max-h-80">
                          {(() => {
                            const currentFolderId =
                              actionModal.folder?.id.toString() ||
                              (actionModal.folders.length > 0 ? actionModal.folders[0].id.toString() : "")
                            const organizedUsers = organizeUsersForInvitation(currentFolderId)

                            return (
                              <>
                                {/* Rôles sur le dossier */}
                                {Object.keys(organizedUsers.folderRoles).length > 0 && (
                                  <>
                                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 bg-gray-100">
                                      👑 Rôles sur ce dossier
                                    </div>
                                    {Object.entries(organizedUsers.folderRoles).map(([role, roleUsers]) => (
                                      <div key={`folder-${role}`}>
                                        <div className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50 flex items-center">
                                          {getRoleIcon(role)}
                                          <span className="ml-1 capitalize">{role}</span>
                                        </div>
                                        {roleUsers.map((user) => (
                                          <SelectItem key={`folder-${role}-${user.id}`} value={user.id}>
                                            <div className="flex items-center space-x-2">
                                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">
                                                {user.avatar}
                                              </div>
                                              <div>
                                                <span className="font-medium">{user.name}</span>
                                                <span className="text-gray-500 ml-2 text-xs">
                                                  ({user.folderRoles[currentFolderId]?.role})
                                                </span>
                                              </div>
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </div>
                                    ))}
                                  </>
                                )}

                                {/* Rôles dans l'espace principal */}
                                <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 bg-gray-100">
                                  🏢 Rôles dans l'espace principal
                                </div>
                                {Object.entries(organizedUsers.spaceRoles).map(([role, roleUsers]) => (
                                  <div key={`space-${role}`}>
                                    <div className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50 flex items-center">
                                      {getRoleIcon(role)}
                                      <span className="ml-1 capitalize">{role}</span>
                                    </div>
                                    {roleUsers.map((user) => (
                                      <SelectItem key={`space-${role}-${user.id}`} value={user.id}>
                                        <div className="flex items-center space-x-2">
                                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs">
                                            {user.avatar}
                                          </div>
                                          <div>
                                            <span className="font-medium">{user.name}</span>
                                            <span className="text-gray-500 ml-2 text-xs">({user.spaceRole})</span>
                                          </div>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </div>
                                ))}

                                {/* Autres espaces */}
                                {Object.keys(organizedUsers.otherSpaces).length > 0 && (
                                  <>
                                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 bg-gray-100">
                                      🌐 Autres espaces
                                    </div>
                                    {Object.entries(organizedUsers.otherSpaces).map(([spaceName, spaceUsers]) => (
                                      <div key={`other-${spaceName}`}>
                                        <div className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50">
                                          {spaceName}
                                        </div>
                                        {spaceUsers.map((user) => (
                                          <SelectItem key={`other-${spaceName}-${user.id}`} value={user.id}>
                                            <div className="flex items-center space-x-2">
                                              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs">
                                                {user.avatar}
                                              </div>
                                              <div>
                                                <span className="font-medium">{user.name}</span>
                                                <span className="text-gray-500 ml-2 text-xs">
                                                  (
                                                  {
                                                    user.spaceRoles[
                                                      Object.keys(user.spaceRoles).find(
                                                        (key) => user.spaceRoles[key].spaceName === spaceName,
                                                      ) || ""
                                                    ]?.role
                                                  }
                                                  )
                                                </span>
                                              </div>
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </div>
                                    ))}
                                  </>
                                )}
                              </>
                            )
                          })()}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="selectedRole">Sélectionner un rôle</Label>
                      <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Rôles sur dossier */}
                          <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 bg-gray-100">
                            📁 Rôles sur dossier
                          </div>
                          {roles
                            .filter((role) => role.level === "folder")
                            .map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                <div className="flex items-center space-x-2">
                                  {getRoleIcon(role.id.replace("folder-", ""))}
                                  <div>
                                    <span className="font-medium">{role.name}</span>
                                    <p className="text-xs text-gray-500">{role.description}</p>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}

                          {/* Rôles dans l'espace */}
                          <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 bg-gray-100">
                            🏢 Rôles dans l'espace
                          </div>
                          {roles
                            .filter((role) => role.level === "space")
                            .map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                <div className="flex items-center space-x-2">
                                  {getRoleIcon(role.id.replace("space-", ""))}
                                  <div>
                                    <span className="font-medium">{role.name}</span>
                                    <p className="text-xs text-gray-500">{role.description}</p>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}

                          {/* Rôles globaux */}
                          <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 bg-gray-100">
                            🌐 Rôles globaux
                          </div>
                          {roles
                            .filter((role) => role.level === "global")
                            .map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                <div className="flex items-center space-x-2">
                                  {getRoleIcon(role.id.replace("global-", ""))}
                                  <div>
                                    <span className="font-medium">{role.name}</span>
                                    <p className="text-xs text-gray-500">{role.description}</p>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="inviteMessage">Message d'invitation</Label>
                    <Textarea
                      id="inviteMessage"
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      placeholder="Ajouter un message pour expliquer pourquoi vous partagez ce dossier..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setActionModal({ type: null, folder: null, folders: [] })}>
                      Annuler
                    </Button>
                    <Button onClick={confirmInvite} disabled={inviteScope === "user" ? !selectedUser : !selectedRole}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Partager
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Archive Modal */}
            {actionModal.type === "archive" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Archiver vers le stockage permanent</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActionModal({ type: null, folder: null, folders: [] })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CloudUpload className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Archivage du dossier complet</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      {actionModal.folder
                        ? `Le dossier "${actionModal.folder.name}" et tous ses ${actionModal.folder.documentsCount} document(s) seront transférés vers le stockage permanent.`
                        : `${actionModal.folders.length} dossier(s) et tous leurs documents seront transférés vers le stockage permanent.`}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <Database className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Architecture de stockage souveraine</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Zap className="h-4 w-4 text-green-600" />
                          <h5 className="font-semibold text-green-800 text-sm">Stockage Temporaire</h5>
                        </div>
                        <p className="text-xs text-gray-700 mb-2">
                          <strong>Store chiffré local, distribué strictement en parties prenantes</strong>
                        </p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Accès rapide pour modifications</li>
                          <li>• Chiffrement bout en bout</li>
                          <li>• Distribution contrôlée</li>
                        </ul>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Server className="h-4 w-4 text-blue-600" />
                          <h5 className="font-semibold text-blue-800 text-sm">Stockage Permanent</h5>
                        </div>
                        <p className="text-xs text-gray-700 mb-2">
                          <strong>
                            Store chiffré d'archivage local, distribué strictement en parties prenantes et sur un
                            serveur de backup sans accès aux données compatible avec du cold storage
                          </strong>
                        </p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Conservation longue durée</li>
                          <li>• Lecture seule sécurisée</li>
                          <li>• Backup cold storage</li>
                          <li>• Extraction IA pour data room distribuée</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-3 p-2 bg-blue-100 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Snowflake className="h-4 w-4 text-blue-600" />
                        <p className="text-xs text-blue-800">
                          <strong>🔐 Souveraineté totale :</strong> Vos données restent sous votre contrôle exclusif,
                          même en backup cold storage
                        </p>
                      </div>
                    </div>
                  </div>

                  {actionModal.folder && (
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className={`p-2 rounded-lg ${getFolderColor(actionModal.folder.color)}`}>
                        <Folder className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{actionModal.folder.name}</h4>
                        <p className="text-sm text-gray-500">
                          {actionModal.folder.documentsCount} document(s) • {actionModal.folder.size}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Zap className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-gray-500">Store chiffré local temporaire</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl">→</div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Server className="h-3 w-3 text-blue-500" />
                          <span className="text-xs text-blue-600">Store permanent</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {actionModal.folders.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Dossiers à archiver :</p>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {actionModal.folders.map((folder) => (
                          <div key={folder.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm">
                            <div className={`p-1 rounded ${getFolderColor(folder.color)}`}>
                              <Folder className="h-4 w-4" />
                            </div>
                            <span className="flex-1 truncate">{folder.name}</span>
                            <span className="text-xs text-gray-500">{folder.documentsCount} docs</span>
                            <div className="flex items-center space-x-1">
                              <Zap className="h-3 w-3 text-green-500" />
                              <span className="text-xs">→</span>
                              <Server className="h-3 w-3 text-blue-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="retentionPeriod">Période de conservation</Label>
                    <Select value={retentionPeriod} onValueChange={setRetentionPeriod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 an</SelectItem>
                        <SelectItem value="3">3 ans</SelectItem>
                        <SelectItem value="5">5 ans (recommandé)</SelectItem>
                        <SelectItem value="7">7 ans</SelectItem>
                        <SelectItem value="10">10 ans</SelectItem>
                        <SelectItem value="permanent">Conservation permanente</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      Durée de conservation dans le stockage permanent
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="archiveReason">Raison de l'archivage (optionnel)</Label>
                    <Textarea
                      id="archiveReason"
                      value={archiveReason}
                      onChange={(e) => setArchiveReason(e.target.value)}
                      placeholder="Expliquer pourquoi ce dossier doit être archivé..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setActionModal({ type: null, folder: null, folders: [] })}>
                      Annuler
                    </Button>
                    <Button onClick={confirmArchive}>
                      <CloudUpload className="h-4 w-4 mr-2" />
                      Archiver ({retentionPeriod === "permanent" ? "permanent" : `${retentionPeriod} ans`})
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Create Modal */}
            {actionModal.type === "create" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Créer un nouveau dossier</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActionModal({ type: null, folder: null, folders: [] })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="folderName">Nom du dossier *</Label>
                    <Input
                      id="folderName"
                      value={folderName}
                      onChange={(e) => setFolderName(e.target.value)}
                      placeholder="Nom du dossier"
                    />
                  </div>
                  <div>
                    <Label htmlFor="folderDescription">Description</Label>
                    <Textarea
                      id="folderDescription"
                      value={folderDescription}
                      onChange={(e) => setFolderDescription(e.target.value)}
                      placeholder="Description du dossier"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="folderTags">Tags (séparés par des virgules)</Label>
                    <Input
                      id="folderTags"
                      value={folderTags}
                      onChange={(e) => setFolderTags(e.target.value)}
                      placeholder="juridique, contrats, clients"
                    />
                  </div>
                  <div>
                    <Label htmlFor="folderColor">Couleur</Label>
                    <Select value={folderColor} onValueChange={setFolderColor}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map((color) => (
                          <SelectItem key={color.id} value={color.id}>
                            <div className="flex items-center space-x-2">
                              <div className={`w-4 h-4 rounded ${color.class}`}></div>
                              <span>{color.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="folderAccess">Accès</Label>
                    <Select value={folderAccess} onValueChange={setFolderAccess}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">
                          <div className="flex items-center space-x-2">
                            <Lock className="h-4 w-4" />
                            <span>Privé</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="shared">
                          <div className="flex items-center space-x-2">
                            <Share2 className="h-4 w-4" />
                            <span>Partagé</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setActionModal({ type: null, folder: null, folders: [] })}>
                      Annuler
                    </Button>
                    <Button onClick={confirmCreate} disabled={!folderName.trim()}>
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Créer
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Delete Modal */}
            {actionModal.type === "delete" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-red-600">Confirmer la suppression</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActionModal({ type: null, folder: null, folders: [] })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        {actionModal.folder
                          ? `Êtes-vous sûr de vouloir supprimer le dossier "${actionModal.folder.name}" ?`
                          : `Êtes-vous sûr de vouloir supprimer ${actionModal.folders.length} dossier(s) ?`}
                      </p>
                      <p className="text-xs text-red-600">
                        Cette action supprimera également tous les documents contenus dans{" "}
                        {actionModal.folder ? "ce dossier" : "ces dossiers"}. Cette action est irréversible.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setActionModal({ type: null, folder: null, folders: [] })}>
                      Annuler
                    </Button>
                    <Button variant="destructive" onClick={confirmDelete}>
                      Supprimer
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
