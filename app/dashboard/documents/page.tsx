"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Grid3X3,
  List,
  Search,
  Filter,
  Plus,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  FolderOpen,
  Star,
  Clock,
  FileImage,
  FileSpreadsheet,
  FileVideo,
  Archive,
  SortAsc,
  SortDesc,
  X,
  CheckCircle,
  XCircle,
  Info,
  UserPlus,
  FileQuestion,
  ShieldCheck,
  Cloud,
  HardDrive,
  CloudUpload,
  Users,
  Crown,
  Shield,
  User,
  Folder,
  Brain,
  Settings,
  Calendar,
  AlertTriangle,
} from "lucide-react"

interface Document {
  id: number
  name: string
  type: string
  size: string
  modified: Date
  created: Date
  author: string
  folder: string
  folderId: string
  tags: string[]
  favorite: boolean
  status: string
  thumbnail: string
  description?: string
  version: string
  isValidated: boolean
  hasCertificate: boolean
  summary?: string
  storageType: "temporary" | "permanent"
  permissions: {
    canView: boolean
    canEdit: boolean
    canDelete: boolean
    canInvite: boolean
    canValidate: boolean
    canArchive: boolean
    canAnalyze: boolean
  }
  temporaryStorageConfig?: {
    duration: number // en jours
    dataUsage: string
    thirdPartyAccess: string
  }
}

interface ActionModal {
  type:
    | "view"
    | "edit"
    | "invite"
    | "delete"
    | "move"
    | "rename"
    | "request"
    | "validate"
    | "certificate"
    | "archive"
    | "storage_config"
    | "import"
    | null
  document: Document | null
  documents: Document[]
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

export default function DocumentsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const folderFilter = searchParams.get("folder")

  const [viewMode, setViewMode] = useState<'list'>('list')
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [sortBy, setSortBy] = useState("modified")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterType, setFilterType] = useState("all")
  const [filterAuthor, setFilterAuthor] = useState("all")
  const [filterStorage, setFilterStorage] = useState("all")
  const [filterFolder, setFilterFolder] = useState(folderFilter || "all")
  const [showFilters, setShowFilters] = useState(false)
  const [actionModal, setActionModal] = useState<ActionModal>({ type: null, document: null, documents: [] })

  // Modal states
  const [inviteMessage, setInviteMessage] = useState("")
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [inviteScope, setInviteScope] = useState<"user" | "role">("user")
  const [newFolderName, setNewFolderName] = useState("")
  const [newDocumentName, setNewDocumentName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editAttachment, setEditAttachment] = useState<File | null>(null)
  const [editMessage, setEditMessage] = useState("")
  const [requestDocumentName, setRequestDocumentName] = useState("")
  const [requestMessage, setRequestMessage] = useState("")
  const [archiveReason, setArchiveReason] = useState("")
  const [retentionPeriod, setRetentionPeriod] = useState("5")
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)

  // Storage configuration states
  const [storageDuration, setStorageDuration] = useState("30")
  const [dataUsage, setDataUsage] = useState("")
  const [thirdPartyAccess, setThirdPartyAccess] = useState("")

  // Import states
  const [importFiles, setImportFiles] = useState<FileList | null>(null)
  const [importFolder, setImportFolder] = useState("")
  const [importDescription, setImportDescription] = useState("")

  const [documents, setDocuments] = useState<Document[]>([])
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    validated: 0,
    favorites: 0,
    permanent: 0,
    temporary: 0,
  })

  const [folders] = useState([
    { id: "contracts", name: "Contrats" },
    { id: "reports", name: "Rapports" },
    { id: "projects", name: "Projets" },
    { id: "finance", name: "Finance" },
    { id: "policies", name: "Politiques" },
    { id: "training", name: "Formation" },
    { id: "assets", name: "Assets" },
    { id: "archives", name: "Archives" },
  ])

  const [users] = useState<UserWithRoles[]>([
    {
      id: "1",
      name: "Marie Dubois",
      email: "marie.dubois@company.com",
      avatar: "MD",
      folderRoles: {
        contracts: { role: "owner", assignedDate: new Date("2024-01-01") },
        finance: { role: "editor", assignedDate: new Date("2024-01-05") },
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
        reports: { role: "owner", assignedDate: new Date("2024-01-02") },
        projects: { role: "contributor", assignedDate: new Date("2024-01-10") },
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
        projects: { role: "owner", assignedDate: new Date("2024-01-03") },
        reports: { role: "viewer", assignedDate: new Date("2024-01-15") },
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
        training: { role: "owner", assignedDate: new Date("2024-01-04") },
        policies: { role: "validator", assignedDate: new Date("2024-01-08") },
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
        policies: { role: "owner", assignedDate: new Date("2024-01-01") },
        archives: { role: "owner", assignedDate: new Date("2024-01-01") },
        contracts: { role: "validator", assignedDate: new Date("2024-01-01") },
        finance: { role: "validator", assignedDate: new Date("2024-01-01") },
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

  // Mettre à jour le filtre de dossier quand l'URL change
  useEffect(() => {
    if (folderFilter) {
      setFilterFolder(folderFilter)
      setShowFilters(true)
    }
  }, [folderFilter])

  useEffect(() => {
    // Simuler le chargement des documents
    const loadDocuments = () => {
      const mockDocuments: Document[] = [
        {
          id: 1,
          name: "Contrat_Client_ABC.pdf",
          type: "PDF",
          size: "2.4 MB",
          modified: new Date("2024-01-15T10:30:00"),
          created: new Date("2024-01-15T09:00:00"),
          author: "Marie Dubois",
          folder: "Contrats",
          folderId: "contracts",
          tags: ["contrat", "client", "juridique"],
          favorite: false,
          status: "validated",
          thumbnail: "/placeholder.svg?height=120&width=120&text=PDF",
          description: "Contrat de prestation de services avec le client ABC Corp.",
          version: "v1.2",
          isValidated: true,
          hasCertificate: true,
          storageType: "permanent",
          summary:
            "Contrat de prestation de services d'une durée de 12 mois avec ABC Corp. Montant total : 150 000€ HT. Clauses de confidentialité et de propriété intellectuelle incluses.",
          permissions: {
            canView: true,
            canEdit: true,
            canDelete: true,
            canInvite: true,
            canValidate: true,
            canArchive: false,
            canAnalyze: true,
          },
        },
        {
          id: 2,
          name: "Rapport_Mensuel_Nov.docx",
          type: "DOCX",
          size: "1.8 MB",
          modified: new Date("2024-01-15T08:45:00"),
          created: new Date("2024-01-10T14:20:00"),
          author: "Sophie Laurent",
          folder: "Rapports",
          folderId: "reports",
          tags: ["rapport", "mensuel", "analyse"],
          favorite: true,
          status: "pending",
          thumbnail: "/placeholder.svg?height=120&width=120&text=DOCX",
          description: "Rapport mensuel d'activité pour novembre 2024.",
          version: "v2.1",
          isValidated: false,
          hasCertificate: false,
          storageType: "temporary",
          summary:
            "Rapport d'activité mensuel présentant les KPIs, les réalisations et les objectifs pour le mois de novembre. Croissance de 15% par rapport au mois précédent.",
          permissions: {
            canView: true,
            canEdit: false,
            canDelete: false,
            canInvite: true,
            canValidate: false,
            canArchive: true,
            canAnalyze: true,
          },
          temporaryStorageConfig: {
            duration: 90,
            dataUsage: "Rapport mensuel d'activité pour suivi des performances",
            thirdPartyAccess: "Équipe direction, consultants externes autorisés",
          },
        },
        {
          id: 3,
          name: "Présentation_Projet.pptx",
          type: "PPTX",
          size: "5.2 MB",
          modified: new Date("2024-01-15T07:15:00"),
          created: new Date("2024-01-12T11:30:00"),
          author: "Jean Martin",
          folder: "Projets",
          folderId: "projects",
          tags: ["présentation", "projet", "alpha"],
          favorite: false,
          status: "draft",
          thumbnail: "/placeholder.svg?height=120&width=120&text=PPTX",
          description: "Présentation du projet Alpha pour le comité de direction.",
          version: "v1.0",
          isValidated: false,
          hasCertificate: false,
          storageType: "temporary",
          summary:
            "Présentation détaillée du projet Alpha incluant le planning, le budget prévisionnel de 500K€ et les ressources nécessaires. Lancement prévu en Q2 2024.",
          permissions: {
            canView: true,
            canEdit: true,
            canDelete: true,
            canInvite: true,
            canValidate: true,
            canArchive: true,
            canAnalyze: true,
          },
          temporaryStorageConfig: {
            duration: 180,
            dataUsage: "Présentation projet pour validation comité de direction",
            thirdPartyAccess: "Comité de direction, équipe projet, partenaires techniques",
          },
        },
        {
          id: 4,
          name: "Budget_2024.xlsx",
          type: "XLSX",
          size: "892 KB",
          modified: new Date("2024-01-14T16:20:00"),
          created: new Date("2024-01-08T09:45:00"),
          author: "Marie Dubois",
          folder: "Finance",
          folderId: "finance",
          tags: ["budget", "2024", "finance"],
          favorite: true,
          status: "validated",
          thumbnail: "/placeholder.svg?height=120&width=120&text=XLSX",
          description: "Budget prévisionnel pour l'année 2024.",
          version: "v3.0",
          isValidated: true,
          hasCertificate: true,
          storageType: "permanent",
          summary:
            "Budget prévisionnel 2024 avec une allocation totale de 2.5M€. Répartition par département et projets stratégiques. Croissance prévue de 20%.",
          permissions: {
            canView: true,
            canEdit: true,
            canDelete: true,
            canInvite: true,
            canValidate: true,
            canArchive: false,
            canAnalyze: true,
          },
        },
        {
          id: 5,
          name: "Politique_Sécurité.pdf",
          type: "PDF",
          size: "1.1 MB",
          modified: new Date("2024-01-14T14:10:00"),
          created: new Date("2024-01-05T10:00:00"),
          author: "Admin Système",
          folder: "Politiques",
          folderId: "policies",
          tags: ["sécurité", "politique", "règlement"],
          favorite: false,
          status: "validated",
          thumbnail: "/placeholder.svg?height=120&width=120&text=PDF",
          description: "Politique de sécurité informatique de l'entreprise.",
          version: "v1.0",
          isValidated: true,
          hasCertificate: true,
          storageType: "permanent",
          summary:
            "Document officiel définissant les règles de sécurité informatique. Couvre la gestion des mots de passe, l'accès aux données et les procédures d'incident.",
          permissions: {
            canView: true,
            canEdit: false,
            canDelete: false,
            canInvite: false,
            canValidate: false,
            canArchive: false,
            canAnalyze: true,
          },
        },
        {
          id: 6,
          name: "Formation_Équipe.mp4",
          type: "MP4",
          size: "45.2 MB",
          modified: new Date("2024-01-13T11:30:00"),
          created: new Date("2024-01-13T11:30:00"),
          author: "Pierre Durand",
          folder: "Formation",
          folderId: "training",
          tags: ["formation", "vidéo", "équipe"],
          favorite: false,
          status: "draft",
          thumbnail: "/placeholder.svg?height=120&width=120&text=MP4",
          description: "Vidéo de formation pour la nouvelle équipe.",
          version: "v1.0",
          isValidated: false,
          hasCertificate: false,
          storageType: "temporary",
          summary:
            "Vidéo de formation de 45 minutes couvrant les processus internes, les outils utilisés et les bonnes pratiques. Destinée aux nouveaux collaborateurs.",
          permissions: {
            canView: true,
            canEdit: true,
            canDelete: true,
            canInvite: true,
            canValidate: true,
            canArchive: true,
            canAnalyze: true,
          },
          temporaryStorageConfig: {
            duration: 365,
            dataUsage: "Vidéo de formation pour onboarding nouveaux collaborateurs",
            thirdPartyAccess: "RH, managers, nouveaux employés, prestataires formation",
          },
        },
        {
          id: 7,
          name: "Logo_Entreprise.png",
          type: "PNG",
          size: "256 KB",
          modified: new Date("2024-01-12T15:45:00"),
          created: new Date("2024-01-12T15:45:00"),
          author: "Design Team",
          folder: "Assets",
          folderId: "assets",
          tags: ["logo", "design", "branding"],
          favorite: true,
          status: "validated",
          thumbnail: "/placeholder.svg?height=120&width=120&text=PNG",
          description: "Logo officiel de l'entreprise en haute résolution.",
          version: "v2.0",
          isValidated: true,
          hasCertificate: false,
          storageType: "temporary",
          summary:
            "Logo officiel de l'entreprise en format PNG haute résolution (300 DPI). Versions couleur et monochrome disponibles pour tous supports de communication.",
          permissions: {
            canView: true,
            canEdit: true,
            canDelete: true,
            canInvite: true,
            canValidate: true,
            canArchive: true,
            canAnalyze: true,
          },
          temporaryStorageConfig: {
            duration: 730,
            dataUsage: "Logo officiel pour supports de communication et marketing",
            thirdPartyAccess: "Équipe marketing, agences externes, partenaires commerciaux",
          },
        },
        {
          id: 8,
          name: "Archive_2023.zip",
          type: "ZIP",
          size: "128 MB",
          modified: new Date("2024-01-10T09:00:00"),
          created: new Date("2024-01-10T09:00:00"),
          author: "Admin Système",
          folder: "Archives",
          folderId: "archives",
          tags: ["archive", "2023", "backup"],
          favorite: false,
          status: "archived",
          thumbnail: "/placeholder.svg?height=120&width=120&text=ZIP",
          description: "Archive complète des documents de l'année 2023.",
          version: "v1.0",
          isValidated: true,
          hasCertificate: false,
          storageType: "permanent",
          summary:
            "Archive complète contenant tous les documents de l'année 2023. Inclut les contrats, rapports, présentations et documents administratifs.",
          permissions: {
            canView: true,
            canEdit: false,
            canDelete: false,
            canInvite: false,
            canValidate: false,
            canArchive: true,
            canAnalyze: true,
          },
        },
      ]

      setDocuments(mockDocuments)
      setStats({
        total: mockDocuments.length,
        thisWeek: mockDocuments.filter((doc) => {
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return doc.modified > weekAgo
        }).length,
        validated: mockDocuments.filter((doc) => doc.isValidated).length,
        favorites: mockDocuments.filter((doc) => doc.favorite).length,
        permanent: mockDocuments.filter((doc) => doc.storageType === "permanent").length,
        temporary: mockDocuments.filter((doc) => doc.storageType === "temporary").length,
      })
    }

    loadDocuments()
  }, [])

  // Notification system
  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  // Fonction pour envoyer une notification dans le chat du dossier
  const sendFolderChatNotification = (folderId: string, message: string, actionType: string, documentName?: string) => {
    const folderUsers = users.filter((user) => user.folderRoles[folderId])

    console.log("Notification envoyée dans le chat du dossier:", {
      folderId,
      folderName: folders.find((f) => f.id === folderId)?.name,
      recipients: folderUsers.map((u) => ({ name: u.name, role: u.folderRoles[folderId]?.role })),
      message,
      actionType,
      documentName,
      timestamp: new Date().toISOString(),
    })

    folderUsers.forEach((user) => {
      console.log(`📱 Notification push envoyée à ${user.name} (${user.email})`)
    })
  }

  // Document actions
  const handleViewDocument = (doc: Document) => {
    setActionModal({ type: "view", document: doc, documents: [] })
  }

  const handleEditDocument = (doc: Document) => {
    setEditDescription(doc.description || "")
    setEditMessage("")
    setEditAttachment(null)
    setActionModal({ type: "edit", document: doc, documents: [] })
  }

  const handleInviteDocument = (doc: Document) => {
    setInviteMessage("")
    setSelectedUser("")
    setSelectedRole("")
    setInviteScope("user")
    setActionModal({ type: "invite", document: doc, documents: [] })
  }

  const handleDeleteDocument = (doc: Document) => {
    setActionModal({ type: "delete", document: doc, documents: [] })
  }

  const handleMoveDocument = (doc: Document) => {
    setNewFolderName(doc.folder)
    setActionModal({ type: "move", document: doc, documents: [] })
  }

  const handleRenameDocument = (doc: Document) => {
    setNewDocumentName(doc.name)
    setActionModal({ type: "rename", document: doc, documents: [] })
  }

  const handleDownloadDocument = (doc: Document) => {
    const storageText = doc.storageType === "permanent" ? "stockage permanent" : "stockage temporaire"
    showNotification("info", `Récupération de ${doc.name} du ${storageText}...`)

    sendFolderChatNotification(doc.folderId, `📥 ${doc.name} a été récupéré du ${storageText}`, "download", doc.name)

    setTimeout(() => {
      showNotification("success", `${doc.name} récupéré avec succès`)
    }, 1500)
  }

  const handleDownloadCertificate = (doc: Document) => {
    if (doc.hasCertificate) {
      showNotification("info", `Téléchargement du certificat blockchain pour ${doc.name}...`)

      sendFolderChatNotification(
        doc.folderId,
        `🔗 Certificat blockchain téléchargé pour ${doc.name}`,
        "blockchain_certificate_download",
        doc.name,
      )

      setTimeout(() => {
        showNotification("success", `Certificat blockchain de ${doc.name} téléchargé avec succès`)
      }, 2000)
    }
  }

  const handleArchiveDocument = (doc: Document) => {
    setArchiveReason("")
    setRetentionPeriod("5")
    setActionModal({ type: "archive", document: doc, documents: [] })
  }

  const handleRequestDocument = () => {
    setRequestDocumentName("")
    setRequestMessage("")
    setActionModal({ type: "request", document: null, documents: [] })
  }

  const handleImportDocuments = () => {
    setImportFiles(null)
    setImportFolder(filterFolder !== "all" ? filterFolder : "")
    setImportDescription("")
    setActionModal({ type: "import", document: null, documents: [] })
  }

  const handleValidateDocument = (doc: Document) => {
    setActionModal({ type: "validate", document: doc, documents: [] })
  }

  const handleViewCertificate = (doc: Document) => {
    if (doc.hasCertificate) {
      setActionModal({ type: "certificate", document: doc, documents: [] })
    }
  }

  const handleConfigureStorage = (doc: Document) => {
    if (doc.temporaryStorageConfig) {
      setStorageDuration(doc.temporaryStorageConfig.duration.toString())
      setDataUsage(doc.temporaryStorageConfig.dataUsage)
      setThirdPartyAccess(doc.temporaryStorageConfig.thirdPartyAccess)
    } else {
      setStorageDuration("30")
      setDataUsage("")
      setThirdPartyAccess("")
    }
    setActionModal({ type: "storage_config", document: doc, documents: [] })
  }

  const handleToggleFavorite = (docId: number) => {
    const doc = documents.find((d) => d.id === docId)
    if (!doc) return

    setDocuments((prev) => prev.map((d) => (d.id === docId ? { ...d, favorite: !d.favorite } : d)))

    const action = doc.favorite ? "retiré des" : "ajouté aux"
    showNotification("success", `${doc.name} ${action} favoris`)

    sendFolderChatNotification(doc.folderId, `⭐ ${doc.name} a été ${action} favoris`, "favorite", doc.name)
  }

  const handleAIAnalysis = (doc: Document) => {
    showNotification("info", `Analyse IA en cours pour ${doc.name}...`)

    setTimeout(
      () => {
        const analysisResults = [
          // Analyse pour PDF/Contrats
          `📄 **Analyse IA du document "${doc.name}"**\n\n` +
            `**Type de document :** ${doc.type} (${doc.size})\n` +
            `**Statut :** ${doc.isValidated ? "✅ Validé" : "⏳ En attente"}\n` +
            `**Dernière modification :** ${formatDate(doc.modified)}\n\n` +
            `**Analyse du contenu :**\n` +
            `• ${doc.type === "PDF" ? "Document juridique détecté" : "Document standard"}\n` +
            `• ${doc.tags.length} tag(s) identifié(s) : ${doc.tags.join(", ")}\n` +
            `• ${doc.summary ? "Résumé automatique disponible" : "Contenu analysé"}\n\n` +
            `**Métriques de qualité :**\n` +
            `• Lisibilité : ${Math.floor(Math.random() * 20) + 80}%\n` +
            `• Conformité : ${doc.isValidated ? "100%" : Math.floor(Math.random() * 30) + 60 + "%"}\n` +
            `• Sécurité : ${doc.storageType === "permanent" ? "Maximale" : "Standard"}\n\n` +
            `**Recommandations :**\n` +
            `• ${doc.storageType === "temporary" ? "Archivage permanent recommandé" : "Archivage optimal"}\n` +
            `• ${!doc.isValidated ? "Validation requise avant finalisation" : "Document prêt pour utilisation"}\n` +
            `• ${doc.tags.length < 3 ? "Améliorer le tagging pour une meilleure recherche" : "Tagging satisfaisant"}\n\n` +
            `**Score global :** ${Math.floor(Math.random() * 20) + 80}/100`,

          // Analyse spécialisée par type
          `🔍 **Analyse spécialisée - ${doc.name}**\n\n` +
            `**Classification automatique :**\n` +
            `• Format : ${doc.type} (${doc.size})\n` +
            `• Catégorie : ${doc.folder}\n` +
            `• Complexité : ${["Faible", "Modérée", "Élevée"][Math.floor(Math.random() * 3)]}\n\n` +
            `**Analyse technique :**\n` +
            `${
              doc.type === "PDF"
                ? "• Pages analysées : " +
                  Math.floor(Math.random() * 50 + 10) +
                  "\n• Clauses détectées : " +
                  Math.floor(Math.random() * 15 + 5)
                : doc.type === "XLSX"
                  ? "• Feuilles analysées : " +
                    Math.floor(Math.random() * 10 + 1) +
                    "\n• Formules détectées : " +
                    Math.floor(Math.random() * 100 + 20)
                  : doc.type === "DOCX"
                    ? "• Mots analysés : " +
                      Math.floor(Math.random() * 5000 + 1000) +
                      "\n• Sections détectées : " +
                      Math.floor(Math.random() * 10 + 3)
                    : "• Contenu multimédia analysé\n• Métadonnées extraites"
            }\n\n` +
            `**Insights IA :**\n` +
            `• ${Math.random() > 0.5 ? "Document fréquemment consulté" : "Usage modéré détecté"}\n` +
            `• ${Math.random() > 0.5 ? "Collaboration active identifiée" : "Document principalement individuel"}\n` +
            `• ${doc.version !== "v1.0" ? "Historique de versions riche" : "Document récent"}\n\n` +
            `**Actions suggérées :**\n` +
            `• ${Math.random() > 0.5 ? "Créer un modèle basé sur ce document" : "Standardiser le format"}\n` +
            `• ${Math.random() > 0.5 ? "Planifier une révision" : "Maintenir la version actuelle"}\n` +
            `• Prochaine analyse : ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR")}`,

          // Analyse de conformité et sécurité
          `🛡️ **Audit de conformité - ${doc.name}**\n\n` +
            `**Analyse de sécurité :**\n` +
            `• Chiffrement : ${doc.storageType === "permanent" ? "AES-256" : "Standard"}\n` +
            `• Accès : ${doc.permissions.canView ? "Contrôlé" : "Restreint"}\n` +
            `• Traçabilité : ${doc.hasCertificate ? "Complète" : "Partielle"}\n\n` +
            `**Conformité RGPD :**\n` +
            `• Données personnelles : ${Math.random() > 0.7 ? "⚠️ Détectées" : "✅ Aucune"}\n` +
            `• Durée de conservation : ${doc.storageType === "permanent" ? "Conforme" : "À vérifier"}\n` +
            `• Droit à l'oubli : ${Math.random() > 0.5 ? "Applicable" : "Non applicable"}\n\n` +
            `**Analyse des risques :**\n` +
            `• Niveau de risque : ${["Faible", "Modéré", "Élevé"][Math.floor(Math.random() * 3)]}\n` +
            `• Exposition : ${doc.permissions.canInvite ? "Partageable" : "Interne uniquement"}\n` +
            `• Criticité : ${doc.isValidated ? "Validée" : "À évaluer"}\n\n` +
            `**Recommandations de sécurité :**\n` +
            `• ${doc.storageType === "temporary" ? "Migration vers stockage sécurisé recommandée" : "Sécurité optimale"}\n` +
            `• ${!doc.hasCertificate ? "Certification numérique suggérée" : "Certification à jour"}\n` +
            `• Audit de sécurité : ${Math.random() > 0.5 ? "Recommandé dans 6 mois" : "Conforme pour 12 mois"}\n\n` +
            `**Score de conformité :** ${Math.floor(Math.random() * 15) + 85}/100`,
        ]

        const randomAnalysis = analysisResults[Math.floor(Math.random() * analysisResults.length)]

        // Envoyer l'analyse dans le chat du dossier
        sendFolderChatNotification(doc.folderId, `🤖 ${randomAnalysis}`, "document_ai_analysis", doc.name)

        showNotification("success", `Analyse IA terminée pour ${doc.name}. Redirection vers le chat...`)

        // Rediriger vers le chat après 1.5 secondes
        setTimeout(() => {
          router.push("/dashboard/chat")
        }, 1500)
      },
      2000 + Math.random() * 2000,
    )
  }

  const handleManageDocumentRoles = (doc: Document) => {
    // Rediriger vers la gestion des rôles du document
    router.push(`/dashboard/documents/${doc.id}/roles`)
  }

  // Bulk actions
  const handleBulkDownload = () => {
    const selectedDocs = documents.filter((doc) => selectedDocuments.includes(doc.id))
    showNotification("info", `Récupération de ${selectedDocs.length} document(s)...`)

    const folderGroups = selectedDocs.reduce(
      (acc, doc) => {
        if (!acc[doc.folderId]) acc[doc.folderId] = []
        acc[doc.folderId].push(doc.name)
        return acc
      },
      {} as { [folderId: string]: string[] },
    )

    Object.entries(folderGroups).forEach(([folderId, docNames]) => {
      sendFolderChatNotification(
        folderId,
        `📥 ${docNames.length} document(s) récupéré(s) : ${docNames.join(", ")}`,
        "bulk_download",
      )
    })

    setTimeout(() => {
      showNotification("success", `${selectedDocs.length} document(s) récupéré(s) avec succès`)
      setSelectedDocuments([])
    }, 2000)
  }

  const handleBulkInvite = () => {
    const selectedDocs = documents.filter((doc) => selectedDocuments.includes(doc.id) && doc.permissions.canInvite)
    if (selectedDocs.length === 0) {
      showNotification("error", "Aucun document sélectionné ne peut être partagé")
      return
    }
    setInviteMessage("")
    setSelectedUser("")
    setSelectedRole("")
    setInviteScope("user")
    setActionModal({ type: "invite", document: null, documents: selectedDocs })
  }

  const handleBulkArchive = () => {
    const selectedDocs = documents.filter((doc) => selectedDocuments.includes(doc.id) && doc.permissions.canArchive)
    if (selectedDocs.length === 0) {
      showNotification("error", "Aucun document sélectionné ne peut être archivé")
      return
    }
    setArchiveReason("")
    setRetentionPeriod("5")
    setActionModal({ type: "archive", document: null, documents: selectedDocs })
  }

  const handleBulkMove = () => {
    const selectedDocs = documents.filter((doc) => selectedDocuments.includes(doc.id))
    setNewFolderName("")
    setActionModal({ type: "move", document: null, documents: selectedDocs })
  }

  const handleBulkDelete = () => {
    const selectedDocs = documents.filter((doc) => selectedDocuments.includes(doc.id))
    setActionModal({ type: "delete", document: null, documents: selectedDocs })
  }

  const handleBulkAIAnalysis = () => {
    const selectedDocs = documents.filter((doc) => selectedDocuments.includes(doc.id) && doc.permissions.canAnalyze)
    if (selectedDocs.length === 0) {
      showNotification("error", "Aucun document sélectionné ne peut être analysé")
      return
    }

    showNotification("info", `Analyse IA en cours pour ${selectedDocs.length} document(s)...`)

    // Analyser chaque document avec un délai échelonné
    selectedDocs.forEach((doc, index) => {
      setTimeout(() => {
        const bulkAnalysis =
          `📊 **Analyse IA groupée - Document "${doc.name}"**\n\n` +
          `**Position dans l'analyse :** ${index + 1}/${selectedDocs.length}\n` +
          `**Type :** ${doc.type} (${doc.size})\n` +
          `**Dossier :** ${doc.folder}\n\n` +
          `**Analyse rapide :**\n` +
          `• Statut : ${doc.isValidated ? "✅ Validé" : "⏳ En attente"}\n` +
          `• Stockage : ${doc.storageType === "permanent" ? "☁️ Permanent" : "💾 Temporaire"}\n` +
          `• Tags : ${doc.tags.join(", ")}\n\n` +
          `**Score de qualité :** ${Math.floor(Math.random() * 20) + 75}/100\n` +
          `**Recommandation :** ${doc.storageType === "temporary" ? "Archivage suggéré" : "Optimisé"}`

        sendFolderChatNotification(doc.folderId, `🤖 ${bulkAnalysis}`, "bulk_document_ai_analysis", doc.name)
      }, index * 1000)
    })

    setTimeout(
      () => {
        const totalSize = selectedDocs.reduce((sum, doc) => sum + Number.parseFloat(doc.size.replace(/[^\d.]/g, "")), 0)
        showNotification(
          "success",
          `Analyse IA terminée pour ${selectedDocs.length} document(s) (${totalSize.toFixed(1)} MB). Redirection vers le chat...`,
        )
        setSelectedDocuments([])

        // Rediriger vers le chat après l'analyse groupée
        setTimeout(() => {
          router.push("/dashboard/chat")
        }, 1500)
      },
      selectedDocs.length * 1000 + 1000,
    )
  }

  // Modal actions
  const confirmInvite = () => {
    const recipient =
      inviteScope === "user"
        ? users.find((u) => u.id === selectedUser)?.name
        : roles.find((r) => r.id === selectedRole)?.name

    if (actionModal.document) {
      showNotification("success", `${actionModal.document.name} partagé avec ${recipient}. Un message a été envoyé.`)

      sendFolderChatNotification(
        actionModal.document.folderId,
        `👥 ${actionModal.document.name} a été partagé avec ${recipient}. Message: ${inviteMessage}`,
        "invite",
        actionModal.document.name,
      )
    } else if (actionModal.documents.length > 0) {
      const folderGroups = actionModal.documents.reduce(
        (acc, doc) => {
          if (!acc[doc.folderId]) acc[doc.folderId] = []
          acc[doc.folderId].push(doc.name)
          return acc
        },
        {} as { [folderId: string]: string[] },
      )

      Object.entries(folderGroups).forEach(([folderId, docNames]) => {
        sendFolderChatNotification(
          folderId,
          `👥 ${docNames.length} document(s) partagé(s) avec ${recipient} : ${docNames.join(", ")}. Message: ${inviteMessage}`,
          "bulk_invite",
        )
      })

      showNotification(
        "success",
        `${actionModal.documents.length} document(s) partagé(s) avec ${recipient}. Messages envoyés.`,
      )
      setSelectedDocuments([])
    }
    setActionModal({ type: null, document: null, documents: [] })
  }

  const confirmDelete = () => {
    if (actionModal.document) {
      sendFolderChatNotification(
        actionModal.document.folderId,
        `🗑️ ${actionModal.document.name} a été supprimé`,
        "delete",
        actionModal.document.name,
      )

      setDocuments((prev) => prev.filter((doc) => doc.id !== actionModal.document!.id))
      showNotification("success", `${actionModal.document.name} supprimé`)
    } else if (actionModal.documents.length > 0) {
      const folderGroups = actionModal.documents.reduce(
        (acc, doc) => {
          if (!acc[doc.folderId]) acc[doc.folderId] = []
          acc[doc.folderId].push(doc.name)
          return acc
        },
        {} as { [folderId: string]: string[] },
      )

      Object.entries(folderGroups).forEach(([folderId, docNames]) => {
        sendFolderChatNotification(
          folderId,
          `🗑️ ${docNames.length} document(s) supprimé(s) : ${docNames.join(", ")}`,
          "bulk_delete",
        )
      })

      const docIds = actionModal.documents.map((doc) => doc.id)
      setDocuments((prev) => prev.filter((doc) => !docIds.includes(doc.id)))
      showNotification("success", `${actionModal.documents.length} document(s) supprimé(s)`)
      setSelectedDocuments([])
    }
    setActionModal({ type: null, document: null, documents: [] })
  }

  const confirmMove = () => {
    if (actionModal.document) {
      const oldFolderId = actionModal.document.folderId
      const newFolder = folders.find((f) => f.name === newFolderName)
      const newFolderId = newFolder?.id || oldFolderId

      const updatedDoc = { ...actionModal.document, folder: newFolderName, folderId: newFolderId }
      setDocuments((prev) => prev.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc)))
      showNotification("success", `${actionModal.document.name} déplacé vers ${newFolderName}`)

      if (oldFolderId !== newFolderId) {
        sendFolderChatNotification(
          oldFolderId,
          `📤 ${actionModal.document.name} a été déplacé vers ${newFolderName}`,
          "move_out",
          actionModal.document.name,
        )
        sendFolderChatNotification(
          newFolderId,
          `📥 ${actionModal.document.name} a été déplacé depuis ${actionModal.document.folder}`,
          "move_in",
          actionModal.document.name,
        )
      }
    } else if (actionModal.documents.length > 0) {
      const newFolder = folders.find((f) => f.name === newFolderName)
      const newFolderId = newFolder?.id || ""

      const folderGroups = actionModal.documents.reduce(
        (acc, doc) => {
          if (!acc[doc.folderId]) acc[doc.folderId] = []
          acc[doc.folderId].push(doc.name)
          return acc
        },
        {} as { [folderId: string]: string[] },
      )

      Object.entries(folderGroups).forEach(([oldFolderId, docNames]) => {
        if (oldFolderId !== newFolderId) {
          sendFolderChatNotification(
            oldFolderId,
            `📤 ${docNames.length} document(s) déplacé(s) vers ${newFolderName} : ${docNames.join(", ")}`,
            "bulk_move_out",
          )
        }
      })

      if (newFolderId) {
        sendFolderChatNotification(
          newFolderId,
          `📥 ${actionModal.documents.length} document(s) déplacé(s) dans ce dossier : ${actionModal.documents.map((d) => d.name).join(", ")}`,
          "bulk_move_in",
        )
      }

      const docIds = actionModal.documents.map((doc) => doc.id)
      setDocuments((prev) =>
        prev.map((doc) => (docIds.includes(doc.id) ? { ...doc, folder: newFolderName, folderId: newFolderId } : doc)),
      )
      showNotification("success", `${actionModal.documents.length} document(s) déplacé(s) vers ${newFolderName}`)
      setSelectedDocuments([])
    }
    setActionModal({ type: null, document: null, documents: [] })
  }

  const confirmRename = () => {
    if (actionModal.document) {
      const updatedDoc = { ...actionModal.document, name: newDocumentName }
      setDocuments((prev) => prev.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc)))
      showNotification("success", `Document renommé en ${newDocumentName}`)

      sendFolderChatNotification(
        actionModal.document.folderId,
        `✏️ Document renommé : "${actionModal.document.name}" → "${newDocumentName}"`,
        "rename",
        newDocumentName,
      )
    }
    setActionModal({ type: null, document: null, documents: [] })
  }

  const confirmEdit = () => {
    if (actionModal.document) {
      const updatedDoc = {
        ...actionModal.document,
        description: editDescription,
        modified: new Date(),
      }
      setDocuments((prev) => prev.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc)))
      showNotification("success", `${actionModal.document.name} mis à jour`)

      let message = `✏️ ${actionModal.document.name} a été modifié`
      if (editMessage.trim()) {
        message += ` - ${editMessage}`
      }
      if (editAttachment) {
        message += ` (avec pièce jointe: ${editAttachment.name})`
      }

      sendFolderChatNotification(actionModal.document.folderId, message, "edit", actionModal.document.name)

      showNotification("info", "Message envoyé dans le chat du dossier")
    }
    setActionModal({ type: null, document: null, documents: [] })
  }

  const confirmRequest = () => {
    if (!requestDocumentName.trim()) {
      showNotification("error", "Veuillez spécifier le nom du document à demander")
      return
    }

    // Créer une demande de document
    const requestData = {
      documentName: requestDocumentName,
      message: requestMessage,
      requestedBy: "Utilisateur actuel",
      requestDate: new Date(),
      folder: importFolder || "Général",
    }

    // Simuler l'envoi de la demande
    showNotification("success", `Demande de document "${requestDocumentName}" envoyée avec succès`)

    // Envoyer une notification dans le chat
    const targetFolder = folders.find((f) => f.name === (importFolder || "Général"))
    if (targetFolder) {
      sendFolderChatNotification(
        targetFolder.id,
        `📋 Nouvelle demande de document : "${requestDocumentName}"\nMessage : ${requestMessage || "Aucun message spécifique"}`,
        "document_request",
      )
    }

    console.log("Demande de document:", requestData)
    setActionModal({ type: null, document: null, documents: [] })
  }

  const confirmImport = () => {
    if (!importFiles || importFiles.length === 0) {
      showNotification("error", "Veuillez sélectionner au moins un fichier à importer")
      return
    }

    if (!importFolder.trim()) {
      showNotification("error", "Veuillez sélectionner un dossier de destination")
      return
    }

    const fileList = Array.from(importFiles)
    const totalSize = fileList.reduce((sum, file) => sum + file.size, 0)
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2)

    showNotification("info", `Import en cours de ${fileList.length} fichier(s) (${totalSizeMB} MB)...`)

    // Simuler l'import avec un délai
    setTimeout(() => {
      const newDocuments: Document[] = fileList.map((file, index) => ({
        id: Math.max(...documents.map((d) => d.id)) + index + 1,
        name: file.name,
        type: file.name.split(".").pop()?.toUpperCase() || "FILE",
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        modified: new Date(),
        created: new Date(),
        author: "Utilisateur actuel",
        folder: importFolder,
        folderId: folders.find((f) => f.name === importFolder)?.id || "general",
        tags: [],
        favorite: false,
        status: "draft",
        thumbnail: `/placeholder.svg?height=120&width=120&text=${file.name.split(".").pop()?.toUpperCase()}`,
        description: importDescription || `Document importé : ${file.name}`,
        version: "v1.0",
        isValidated: false,
        hasCertificate: false,
        storageType: "temporary" as const,
        permissions: {
          canView: true,
          canEdit: true,
          canDelete: true,
          canInvite: true,
          canValidate: true,
          canArchive: true,
          canAnalyze: true,
        },
      }))

      setDocuments((prev) => [...prev, ...newDocuments])

      // Notification de succès
      showNotification("success", `${fileList.length} document(s) importé(s) avec succès dans ${importFolder}`)

      // Notification dans le chat du dossier
      const targetFolder = folders.find((f) => f.name === importFolder)
      if (targetFolder) {
        const fileNames = fileList.map((f) => f.name).join(", ")
        sendFolderChatNotification(
          targetFolder.id,
          `📁 ${fileList.length} nouveau(x) document(s) importé(s) :\n${fileNames}\n\nDescription : ${importDescription || "Aucune description"}`,
          "documents_import",
        )
      }

      // Mettre à jour les stats
      setStats((prev) => ({
        ...prev,
        total: prev.total + fileList.length,
        temporary: prev.temporary + fileList.length,
      }))
    }, 2000)

    setActionModal({ type: null, document: null, documents: [] })
  }

  const confirmValidation = (isValid: boolean) => {
    if (actionModal.document) {
      const updatedDoc = {
        ...actionModal.document,
        isValidated: isValid,
        status: isValid ? "validated" : "rejected",
        hasCertificate: isValid,
      }
      setDocuments((prev) => prev.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc)))
      showNotification("success", `${actionModal.document.name} ${isValid ? "validé" : "invalidé"}`)

      sendFolderChatNotification(
        actionModal.document.folderId,
        `${isValid ? "✅" : "❌"} ${actionModal.document.name} a été ${isValid ? "validé" : "invalidé"}`,
        isValid ? "validate" : "invalidate",
        actionModal.document.name,
      )
    }
    setActionModal({ type: null, document: null, documents: [] })
  }

  const confirmArchive = () => {
    if (actionModal.document) {
      const updatedDoc = {
        ...actionModal.document,
        storageType: "permanent" as const,
        status: "archived",
        modified: new Date(),
      }
      setDocuments((prev) => prev.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc)))
      showNotification("success", `${actionModal.document.name} archivé vers le stockage permanent`)

      let message = `📦 ${actionModal.document.name} a été archivé vers le stockage permanent (conservation: ${retentionPeriod} ans)`
      if (archiveReason.trim()) {
        message += ` - Raison: ${archiveReason}`
      }

      sendFolderChatNotification(actionModal.document.folderId, message, "archive", actionModal.document.name)
    } else if (actionModal.documents.length > 0) {
      const folderGroups = actionModal.documents.reduce(
        (acc, doc) => {
          if (!acc[doc.folderId]) acc[doc.folderId] = []
          acc[doc.folderId].push(doc.name)
          return acc
        },
        {} as { [folderId: string]: string[] },
      )

      Object.entries(folderGroups).forEach(([folderId, docNames]) => {
        let message = `📦 ${docNames.length} document(s) archivé(s) vers le stockage permanent (conservation: ${retentionPeriod} ans) : ${docNames.join(", ")}`
        if (archiveReason.trim()) {
          message += ` - Raison: ${archiveReason}`
        }

        sendFolderChatNotification(folderId, message, "bulk_archive")
      })

      const docIds = actionModal.documents.map((doc) => doc.id)
      setDocuments((prev) =>
        prev.map((doc) =>
          docIds.includes(doc.id)
            ? { ...doc, storageType: "permanent" as const, status: "archived", modified: new Date() }
            : doc,
        ),
      )
      showNotification("success", `${actionModal.documents.length} document(s) archivé(s) vers le stockage permanent`)
      setSelectedDocuments([])
    }
    setActionModal({ type: null, document: null, documents: [] })
  }

  const confirmStorageConfig = () => {
    if (actionModal.document) {
      const updatedDoc = {
        ...actionModal.document,
        temporaryStorageConfig: {
          duration: Number.parseInt(storageDuration),
          dataUsage: dataUsage,
          thirdPartyAccess: thirdPartyAccess,
        },
        modified: new Date(),
      }
      setDocuments((prev) => prev.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc)))
      showNotification("success", `Configuration de stockage mise à jour pour ${actionModal.document.name}`)

      const message =
        `⚙️ Configuration de stockage temporaire mise à jour pour ${actionModal.document.name}:\n` +
        `• Durée: ${storageDuration} jours\n` +
        `• Usage: ${dataUsage}\n` +
        `• Accès tiers: ${thirdPartyAccess}`

      sendFolderChatNotification(actionModal.document.folderId, message, "storage_config", actionModal.document.name)
    }
    setActionModal({ type: null, document: null, documents: [] })
  }

  const filteredDocuments = documents
    .filter((doc) => {
      if (searchTerm && !doc.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      if (filterType !== "all" && doc.type.toLowerCase() !== filterType.toLowerCase()) {
        return false
      }
      if (filterAuthor !== "all" && doc.author !== filterAuthor) {
        return false
      }
      if (filterStorage !== "all" && doc.storageType !== filterStorage) {
        return false
      }
      if (filterFolder !== "all" && doc.folder !== filterFolder) {
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
        case "author":
          aValue = a.author.toLowerCase()
          bValue = b.author.toLowerCase()
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

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-600" />
      case "docx":
      case "doc":
        return <FileText className="h-5 w-5 text-blue-600" />
      case "xlsx":
      case "xls":
        return <FileSpreadsheet className="h-5 w-5 text-green-600" />
      case "pptx":
      case "ppt":
        return <FileText className="h-5 w-5 text-orange-600" />
      case "png":
      case "jpg":
      case "jpeg":
        return <FileImage className="h-5 w-5 text-purple-600" />
      case "mp4":
      case "avi":
        return <FileVideo className="h-5 w-5 text-pink-600" />
      case "zip":
      case "rar":
        return <Archive className="h-5 w-5 text-gray-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
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
        return <Edit className="h-4 w-4 text-blue-600" />
      case "validator":
        return <ShieldCheck className="h-4 w-4 text-green-600" />
      case "contributor":
        return <UserPlus className="h-4 w-4 text-purple-600" />
      case "viewer":
        return <Eye className="h-4 w-4 text-gray-600" />
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

  const getStatusBadge = (status: string, isValidated: boolean) => {
    if (isValidated) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Validé</Badge>
    }

    switch (status) {
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">En attente</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Brouillon</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejeté</Badge>
      case "archived":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Archivé</Badge>
      default:
        return null
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

  const toggleDocumentSelection = (docId: number) => {
    setSelectedDocuments((prev) => (prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]))
  }

  const selectAllDocuments = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(filteredDocuments.map((doc) => doc.id))
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
          <h1 className="text-2xl font-bold text-gray-900">
            Documents
            {filterFolder !== "all" && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                - {filterFolder}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-6 w-6 p-0"
                  onClick={() => {
                    setFilterFolder("all")
                    window.history.replaceState({}, "", "/dashboard/documents")
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-1">
            {filterFolder !== "all" ? `Documents du dossier ${filterFolder}` : "Gérez vos documents et fichiers"}
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" onClick={handleRequestDocument}>
            <FileQuestion className="h-4 w-4 mr-2" />
            Demander un document
          </Button>
          <Button variant="outline" size="sm" onClick={handleImportDocuments}>
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau document
          </Button>
        </div>
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
              <FileText className="h-8 w-8 text-blue-600" />
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
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Validés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.validated}</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Favoris</p>
                <p className="text-2xl font-bold text-gray-900">{stats.favorites}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
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
                  placeholder="Rechercher des documents..."
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
                    <SelectItem value="author">Auteur</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                  {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>

              {/* Vue grille supprimée: forcer la vue liste uniquement */}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="filterType" className="text-sm font-medium">
                    Type de fichier
                  </Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">Word</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                      <SelectItem value="pptx">PowerPoint</SelectItem>
                      <SelectItem value="png">Images</SelectItem>
                      <SelectItem value="mp4">Vidéos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="filterAuthor" className="text-sm font-medium">
                    Auteur
                  </Label>
                  <Select value={filterAuthor} onValueChange={setFilterAuthor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les auteurs</SelectItem>
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

                <div>
                  <Label htmlFor="filterFolder" className="text-sm font-medium">
                    Dossier
                  </Label>
                  <Select value={filterFolder} onValueChange={setFilterFolder}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les dossiers</SelectItem>
                      {folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.name}>
                          <div className="flex items-center space-x-2">
                            <Folder className="h-4 w-4" />
                            <span>{folder.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterType("all")
                      setFilterAuthor("all")
                      setFilterStorage("all")
                      setFilterFolder("all")
                      setSearchTerm("")
                      window.history.replaceState({}, "", "/dashboard/documents")
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

      {/* Bulk Actions minimalistes: certificats et rôles uniquement */}
      {selectedDocuments.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedDocuments.length === filteredDocuments.length}
                  onCheckedChange={selectAllDocuments}
                />
                <span className="text-sm font-medium">
                  {selectedDocuments.length} document{selectedDocuments.length > 1 ? "s" : ""} sélectionné
                  {selectedDocuments.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const docsToDownload = documents.filter((d) => selectedDocuments.includes(d.id) && d.hasCertificate)
                    if (docsToDownload.length === 0) {
                      showNotification("info", "Aucun certificat à télécharger pour la sélection")
                      return
                    }
                    docsToDownload.forEach((d) => handleDownloadCertificate(d))
                  }}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Télécharger certificats
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const first = documents.find((d) => selectedDocuments.includes(d.id))
                    if (first) {
                      handleManageDocumentRoles(first)
                    } else {
                      showNotification("info", "Sélectionnez au moins un document")
                    }
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Configurer les rôles
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents List/Grid */}
      <Card>
        <CardContent className="p-0">
          {viewMode === "list" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 w-8">
                      <Checkbox
                        checked={selectedDocuments.length === filteredDocuments.length}
                        onCheckedChange={selectAllDocuments}
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Nom</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Taille</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Modifié</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Auteur</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Dossier</th>

                    <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={selectedDocuments.includes(doc.id)}
                          onCheckedChange={() => toggleDocumentSelection(doc.id)}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(doc.type)}
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{doc.name}</span>
                            {getStorageIcon(doc.storageType)}
                            <button onClick={() => handleToggleFavorite(doc.id)}>
                              <Star
                                className={`h-4 w-4 ${doc.favorite ? "text-yellow-500 fill-current" : "text-gray-300"} hover:text-yellow-500`}
                              />
                            </button>
                            {doc.isValidated && <ShieldCheck className="h-4 w-4 text-green-600" />}
                            {doc.temporaryStorageConfig && (
                              <AlertTriangle
                                className="h-4 w-4 text-orange-500"
                                title="Configuration de stockage temporaire définie"
                              />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{doc.size}</td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(doc.modified)}</td>
                      <td className="py-3 px-4 text-gray-600">{doc.author}</td>
                      <td className="py-3 px-4 text-gray-600">{doc.folder}</td>

                      <td className="py-3 px-4">{getStatusBadge(doc.status, doc.isValidated)}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className={`relative group border rounded-lg p-4 hover:shadow-md transition-shadow ${
                      selectedDocuments.includes(doc.id) ? "bg-blue-50 border-blue-200" : "bg-white"
                    }`}
                  >
                    <div className="absolute top-2 left-2">
                      <Checkbox
                        checked={selectedDocuments.includes(doc.id)}
                        onCheckedChange={() => toggleDocumentSelection(doc.id)}
                      />
                    </div>
                    <div className="absolute top-2 right-2 flex items-center space-x-1">
                      <button onClick={() => handleToggleFavorite(doc.id)}>
                        <Star
                          className={`h-4 w-4 ${doc.favorite ? "text-yellow-500 fill-current" : "text-gray-300"} hover:text-yellow-500`}
                        />
                      </button>
                      {getStorageIcon(doc.storageType)}
                      {doc.isValidated && <ShieldCheck className="h-4 w-4 text-green-600" />}
                      {doc.temporaryStorageConfig && (
                        <AlertTriangle
                          className="h-4 w-4 text-orange-500"
                          title="Configuration de stockage temporaire définie"
                        />
                      )}
                      {doc.storageType === "temporary" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleConfigureStorage(doc)}
                          className="h-8 w-8 p-0"
                          title="Configurer le stockage temporaire"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleManageDocumentRoles(doc)}
                        className="h-8 w-8 p-0"
                        title="Gérer les rôles du document"
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                      {doc.hasCertificate && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadCertificate(doc)}
                          className="h-8 w-8 p-0"
                          title="Télécharger le certificat blockchain"
                        >
                          <ShieldCheck className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                    </div>

                    <div className="flex flex-col items-center space-y-3 mt-6">
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg">
                        {getFileIcon(doc.type)}
                      </div>

                      <div className="text-center space-y-1">
                        <h3 className="font-medium text-gray-900 text-sm truncate w-full" title={doc.name}>
                          {doc.name}
                        </h3>
                        <p className="text-xs text-gray-500">{doc.size}</p>
                        <p className="text-xs text-gray-500">{formatDate(doc.modified)}</p>
                        <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
                          {getStorageIcon(doc.storageType)}
                          <span>{doc.storageType === "permanent" ? "Permanent" : "Temporaire"}</span>
                          {doc.storageType === "temporary" && doc.temporaryStorageConfig && (
                            <span className="text-orange-600">({doc.temporaryStorageConfig.duration}j)</span>
                          )}
                        </p>
                      </div>

                      {getStatusBadge(doc.status, doc.isValidated) && (
                        <div className="flex justify-center">{getStatusBadge(doc.status, doc.isValidated)}</div>
                      )}

                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDocument(doc)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument(doc)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        {doc.permissions.canAnalyze && (
                          <Button variant="ghost" size="sm" onClick={() => handleAIAnalysis(doc)}>
                            <Brain className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document trouvé</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ||
                filterType !== "all" ||
                filterAuthor !== "all" ||
                filterStorage !== "all" ||
                filterFolder !== "all"
                  ? "Essayez de modifier vos critères de recherche"
                  : "Commencez par importer votre premier document"}
              </p>
              <Button onClick={handleImportDocuments}>
                <Plus className="h-4 w-4 mr-2" />
                Importer des documents
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {actionModal.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Import Modal */}
            {actionModal.type === "import" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Importer des documents</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActionModal({ type: null, document: null, documents: [] })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Upload className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Import de documents</span>
                    </div>
                    <p className="text-sm text-blue-800 mt-1">
                      Sélectionnez les fichiers à importer et choisissez le dossier de destination.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="importFiles" className="text-sm font-medium text-gray-700">
                      Fichiers à importer *
                    </Label>
                    <Input
                      id="importFiles"
                      type="file"
                      multiple
                      onChange={(e) => setImportFiles(e.target.files)}
                      className="mt-1"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif,.mp4,.avi,.zip,.rar"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formats supportés: PDF, Word, Excel, PowerPoint, Images, Vidéos, Archives
                    </p>
                    {importFiles && importFiles.length > 0 && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        <p className="font-medium text-gray-700">{importFiles.length} fichier(s) sélectionné(s):</p>
                        <ul className="mt-1 space-y-1 max-h-32 overflow-y-auto">
                          {Array.from(importFiles).map((file, index) => (
                            <li key={index} className="text-gray-600 flex justify-between">
                              <span className="truncate">{file.name}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="importFolder" className="text-sm font-medium text-gray-700">
                      Dossier de destination *
                    </Label>
                    <Select value={importFolder} onValueChange={setImportFolder}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un dossier" />
                      </SelectTrigger>
                      <SelectContent>
                        {folders.map((folder) => (
                          <SelectItem key={folder.id} value={folder.name}>
                            <div className="flex items-center space-x-2">
                              <Folder className="h-4 w-4" />
                              <span>{folder.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="importDescription" className="text-sm font-medium text-gray-700">
                      Description (optionnel)
                    </Label>
                    <Textarea
                      id="importDescription"
                      value={importDescription}
                      onChange={(e) => setImportDescription(e.target.value)}
                      placeholder="Ajouter une description pour ces documents..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">Information importante</p>
                        <p>
                          Les documents importés seront stockés en mode temporaire par défaut. Vous pourrez les
                          configurer et les valider après l'import.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setActionModal({ type: null, document: null, documents: [] })}
                    >
                      Annuler
                    </Button>
                    <Button onClick={confirmImport} disabled={!importFiles || !importFolder}>
                      <Upload className="h-4 w-4 mr-2" />
                      Importer{" "}
                      {importFiles ? `(${importFiles.length} fichier${importFiles.length > 1 ? "s" : ""})` : ""}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Request Document Modal */}
            {actionModal.type === "request" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Demander un document</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActionModal({ type: null, document: null, documents: [] })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <FileQuestion className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Demande de document</span>
                    </div>
                    <p className="text-sm text-blue-800 mt-1">
                      Spécifiez le document dont vous avez besoin et ajoutez un message explicatif.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="requestDocumentName" className="text-sm font-medium text-gray-700">
                      Nom du document demandé *
                    </Label>
                    <Input
                      id="requestDocumentName"
                      value={requestDocumentName}
                      onChange={(e) => setRequestDocumentName(e.target.value)}
                      placeholder="Ex: Contrat de prestation, Facture janvier 2024..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="requestFolder" className="text-sm font-medium text-gray-700">
                      Dossier de destination
                    </Label>
                    <Select value={importFolder} onValueChange={setImportFolder}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un dossier (optionnel)" />
                      </SelectTrigger>
                      <SelectContent>
                        {folders.map((folder) => (
                          <SelectItem key={folder.id} value={folder.name}>
                            <div className="flex items-center space-x-2">
                              <Folder className="h-4 w-4" />
                              <span>{folder.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="requestMessage" className="text-sm font-medium text-gray-700">
                      Message explicatif
                    </Label>
                    <Textarea
                      id="requestMessage"
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      placeholder="Expliquez pourquoi vous avez besoin de ce document, son usage prévu, l'urgence..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="text-sm text-green-800">
                        <p className="font-medium">Processus de demande</p>
                        <p>
                          Votre demande sera envoyée aux responsables du dossier concerné. Vous recevrez une
                          notification dès qu'une réponse sera disponible.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setActionModal({ type: null, document: null, documents: [] })}
                    >
                      Annuler
                    </Button>
                    <Button onClick={confirmRequest} disabled={!requestDocumentName.trim()}>
                      <FileQuestion className="h-4 w-4 mr-2" />
                      Envoyer la demande
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* View Document Modal */}
            {actionModal.type === "view" && actionModal.document && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Aperçu du document</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActionModal({ type: null, document: null, documents: [] })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg">
                      {getFileIcon(actionModal.document.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{actionModal.document.name}</h4>
                      <p className="text-sm text-gray-600">
                        {actionModal.document.type} • {actionModal.document.size}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStorageIcon(actionModal.document.storageType)}
                        <span className="text-sm text-gray-600">
                          {actionModal.document.storageType === "permanent"
                            ? "Stockage permanent"
                            : "Stockage temporaire"}
                        </span>
                        {actionModal.document.temporaryStorageConfig && (
                          <span className="text-sm text-orange-600">
                            ({actionModal.document.temporaryStorageConfig.duration} jours)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Auteur</Label>
                      <p className="text-sm text-gray-900">{actionModal.document.author}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Dossier</Label>
                      <p className="text-sm text-gray-900">{actionModal.document.folder}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Créé le</Label>
                      <p className="text-sm text-gray-900">
                        {actionModal.document.created.toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Modifié le</Label>
                      <p className="text-sm text-gray-900">
                        {actionModal.document.modified.toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Version</Label>
                      <p className="text-sm text-gray-900">{actionModal.document.version}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Statut</Label>
                      <div className="mt-1">
                        {getStatusBadge(actionModal.document.status, actionModal.document.isValidated)}
                      </div>
                    </div>
                  </div>

                  {actionModal.document.description && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Description</Label>
                      <p className="text-sm text-gray-900 mt-1">{actionModal.document.description}</p>
                    </div>
                  )}

                  {actionModal.document.summary && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Résumé</Label>
                      <p className="text-sm text-gray-900 mt-1">{actionModal.document.summary}</p>
                    </div>
                  )}

                  {actionModal.document.temporaryStorageConfig && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h5 className="font-medium text-orange-900 mb-2">Configuration du stockage temporaire</h5>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-sm font-medium text-orange-700">Durée de conservation</Label>
                          <p className="text-sm text-orange-900">
                            {actionModal.document.temporaryStorageConfig.duration} jours
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-orange-700">Usage de la donnée</Label>
                          <p className="text-sm text-orange-900">
                            {actionModal.document.temporaryStorageConfig.dataUsage}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-orange-700">Accès tiers</Label>
                          <p className="text-sm text-orange-900">
                            {actionModal.document.temporaryStorageConfig.thirdPartyAccess}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {actionModal.document.tags.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Tags</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {actionModal.document.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => handleDownloadDocument(actionModal.document!)}>
                      <Download className="h-4 w-4 mr-2" />
                      Récupérer
                    </Button>
                    {actionModal.document.permissions.canAnalyze && (
                      <Button variant="outline" onClick={() => handleAIAnalysis(actionModal.document!)}>
                        <Brain className="h-4 w-4 mr-2" />
                        Analyse IA
                      </Button>
                    )}
                    {actionModal.document.hasCertificate && (
                      <Button variant="outline" onClick={() => handleViewCertificate(actionModal.document!)}>
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Certificat
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Storage Configuration Modal */}
            {actionModal.type === "storage_config" && actionModal.document && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Configuration du stockage temporaire</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActionModal({ type: null, document: null, documents: [] })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Document: {actionModal.document.name}</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="storageDuration" className="text-sm font-medium text-gray-700">
                      Durée de conservation (en jours)
                    </Label>
                    <Input
                      id="storageDuration"
                      type="number"
                      value={storageDuration}
                      onChange={(e) => setStorageDuration(e.target.value)}
                      placeholder="30"
                      min="1"
                      max="3650"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Durée maximale recommandée: 365 jours pour les documents temporaires
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="dataUsage" className="text-sm font-medium text-gray-700">
                      Usage de la donnée
                    </Label>
                    <Textarea
                      id="dataUsage"
                      value={dataUsage}
                      onChange={(e) => setDataUsage(e.target.value)}
                      placeholder="Décrivez l'usage prévu de ce document..."
                      rows={3}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Précisez le contexte d'utilisation et la finalité du document
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="thirdPartyAccess" className="text-sm font-medium text-gray-700">
                      Tiers ayant potentiellement accès
                    </Label>
                    <Textarea
                      id="thirdPartyAccess"
                      value={thirdPartyAccess}
                      onChange={(e) => setThirdPartyAccess(e.target.value)}
                      placeholder="Listez les personnes ou organisations qui pourraient avoir accès..."
                      rows={3}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Incluez les collaborateurs, partenaires, prestataires externes, etc.
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">Information importante</p>
                        <p>
                          Cette configuration aide à respecter les obligations RGPD et à gérer la durée de vie des
                          données temporaires.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setActionModal({ type: null, document: null, documents: [] })}
                    >
                      Annuler
                    </Button>
                    <Button onClick={confirmStorageConfig}>
                      <Settings className="h-4 w-4 mr-2" />
                      Enregistrer la configuration
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Certificate Modal */}
            {actionModal.type === "certificate" && actionModal.document && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Certificat de validation</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActionModal({ type: null, document: null, documents: [] })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <ShieldCheck className="h-8 w-8 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-900">Document certifié</h4>
                        <p className="text-sm text-green-700">Ce document a été validé et certifié numériquement</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Informations du document</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nom :</span>
                          <span className="font-medium">{actionModal.document.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Version :</span>
                          <span className="font-medium">{actionModal.document.version}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Taille :</span>
                          <span className="font-medium">{actionModal.document.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hash SHA-256 :</span>
                          <span className="font-mono text-xs bg-white p-1 rounded">
                            {Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Certificat numérique</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Émis le :</span>
                          <span className="font-medium">
                            {actionModal.document.modified.toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Validé par :</span>
                          <span className="font-medium">{actionModal.document.author}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Autorité :</span>
                          <span className="font-medium">DocV Certification</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ID Certificat :</span>
                          <span className="font-mono text-xs bg-white p-1 rounded">
                            CERT-{actionModal.document.id}-{new Date().getFullYear()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-medium text-blue-900 mb-2">Détails de la validation</h5>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Intégrité du document vérifiée</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Signature numérique valide</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Horodatage certifié</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Conformité RGPD validée</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-gray-900 mb-2">Chaîne de confiance blockchain</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">
                          Block #{Math.floor(Math.random() * 1000000)} - Hash: 0x
                          {Math.random().toString(16).substring(2, 10)}...
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">
                          Transaction confirmée avec {Math.floor(Math.random() * 50) + 10} confirmations
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-700">
                          Stockage distribué sur {Math.floor(Math.random() * 5) + 3} nœuds souverains
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Simuler le téléchargement du certificat
                        showNotification("success", `Certificat de ${actionModal.document!.name} téléchargé`)
                        sendFolderChatNotification(
                          actionModal.document!.folderId,
                          `📜 Certificat de validation téléchargé pour ${actionModal.document!.name}`,
                          "certificate_download",
                          actionModal.document!.name,
                        )
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le certificat (.pdf)
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Simuler la vérification en ligne
                        showNotification("info", "Vérification en ligne du certificat...")
                        setTimeout(() => {
                          showNotification("success", "Certificat vérifié avec succès")
                        }, 2000)
                      }}
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Vérifier en ligne
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Other existing modals would continue here... */}
          </div>
        </div>
      )}
    </div>
  )
}
