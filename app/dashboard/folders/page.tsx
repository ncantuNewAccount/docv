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
  Brain,
  FileQuestion,
  Timer,
  ShieldCheck,
  Archive,
  FileCheck,
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
  status: "active" | "archived" | "pending" | "completed" | "validated"
  type: "contracts" | "reports" | "projects" | "finance" | "hr" | "marketing" | "legal" | "general"
  expectedDocuments: Array<{
    name: string
    required: boolean
    assignedRole: "owner" | "editor" | "validator" | "contributor"
    status: "missing" | "pending" | "received"
  }>
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
  temporaryStorageConfig?: {
    duration: number // en jours
    dataUsage: string
    thirdPartyAccess: string
  }
  documents?: Array<{
    id: string
    name: string
    hasCertificate: boolean
    certificateId?: string
  }>
}

interface ActionModal {
  type:
    | "invite"
    | "delete"
    | "create"
    | "edit"
    | "archive"
    | "request_document"
    | "storage_config"
    | "certificate"
    | "documents_certificates"
    | null
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
  const [viewMode, setViewMode] = useState<'list'>('list')
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
  const [selectedDocument, setSelectedDocument] = useState("")
  const [requestMessage, setRequestMessage] = useState("")
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)

  // Storage config modal states
  const [storageDuration, setStorageDuration] = useState("30")
  const [dataUsage, setDataUsage] = useState("")
  const [thirdPartyAccess, setThirdPartyAccess] = useState("")

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
          status: "active",
          type: "contracts",
          expectedDocuments: [
            { name: "Contrat cadre", required: true, assignedRole: "owner", status: "received" },
            { name: "Conditions générales", required: true, assignedRole: "validator", status: "received" },
            { name: "Annexes techniques", required: false, assignedRole: "editor", status: "missing" },
            { name: "Certificat d'assurance", required: true, assignedRole: "contributor", status: "pending" },
          ],
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
          temporaryStorageConfig: {
            duration: 90,
            dataUsage: "Contrats clients et négociations commerciales",
            thirdPartyAccess: "Avocats externes, clients contractants",
          },
          documents: [
            { id: "doc1", name: "Contrat_ABC.pdf", hasCertificate: true, certificateId: "CERT-DOC-001" },
            { id: "doc2", name: "Contrat_XYZ.pdf", hasCertificate: true, certificateId: "CERT-DOC-002" },
            { id: "doc3", name: "Annexe_A.pdf", hasCertificate: false },
            { id: "doc4", name: "Conditions_Generales.pdf", hasCertificate: true, certificateId: "CERT-DOC-003" },
          ],
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
          status: "pending",
          type: "reports",
          expectedDocuments: [
            { name: "Rapport mensuel", required: true, assignedRole: "owner", status: "received" },
            { name: "Analyse KPI", required: true, assignedRole: "editor", status: "missing" },
            { name: "Graphiques", required: false, assignedRole: "contributor", status: "received" },
          ],
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
          temporaryStorageConfig: {
            duration: 30,
            dataUsage: "Analyses de performance et rapports internes",
            thirdPartyAccess: "Consultants externes, auditeurs",
          },
          documents: [
            { id: "doc5", name: "Rapport_Nov.docx", hasCertificate: true, certificateId: "CERT-DOC-004" },
            { id: "doc6", name: "Analyse_Q4.xlsx", hasCertificate: false },
          ],
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
          status: "active",
          type: "projects",
          expectedDocuments: [
            { name: "Cahier des charges", required: true, assignedRole: "owner", status: "received" },
            { name: "Spécifications techniques", required: true, assignedRole: "editor", status: "received" },
            { name: "Planning projet", required: true, assignedRole: "validator", status: "received" },
            { name: "Budget prévisionnel", required: true, assignedRole: "contributor", status: "missing" },
          ],
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
          documents: [
            { id: "doc7", name: "Specs_Alpha.pdf", hasCertificate: true, certificateId: "CERT-DOC-005" },
            { id: "doc8", name: "Design_Beta.figma", hasCertificate: false },
            { id: "doc9", name: "Planning.xlsx", hasCertificate: true, certificateId: "CERT-DOC-006" },
          ],
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
          status: "completed",
          type: "finance",
          expectedDocuments: [
            { name: "Budget annuel", required: true, assignedRole: "owner", status: "received" },
            { name: "Bilan comptable", required: true, assignedRole: "validator", status: "received" },
            { name: "Factures", required: true, assignedRole: "editor", status: "received" },
          ],
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
          documents: [
            { id: "doc10", name: "Budget_2024.xlsx", hasCertificate: true, certificateId: "CERT-DOC-007" },
            { id: "doc11", name: "Factures_Dec.pdf", hasCertificate: true, certificateId: "CERT-DOC-008" },
          ],
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
          status: "archived",
          type: "hr",
          expectedDocuments: [
            { name: "Politique RH", required: true, assignedRole: "owner", status: "received" },
            { name: "Contrats employés", required: true, assignedRole: "validator", status: "received" },
            { name: "Formation", required: false, assignedRole: "editor", status: "missing" },
          ],
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
          documents: [
            { id: "doc12", name: "Politique_Télétravail.pdf", hasCertificate: false },
            { id: "doc13", name: "Guide_Onboarding.docx", hasCertificate: true, certificateId: "CERT-DOC-009" },
          ],
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
          status: "validated",
          type: "marketing",
          expectedDocuments: [
            { name: "Brief campagne", required: true, assignedRole: "owner", status: "received" },
            { name: "Créations visuelles", required: true, assignedRole: "editor", status: "pending" },
            { name: "Plan média", required: true, assignedRole: "contributor", status: "missing" },
            { name: "Budget marketing", required: false, assignedRole: "validator", status: "received" },
          ],
          activity: [
            { user: "Pierre Durand", action: "uploadé", item: "Campagne_Q1.psd", time: "Il y a 4j" },
            { user: "Design Team", action: "approuvé", item: "Logo_V2.png", time: "Il y a 5j" },
          ],
          permissions: {
            canView: true,
            canEdit: false,
            canDelete: false,
            canInvite: true,
            canArchive: true,
            canAnalyze: true,
          },
          documents: [
            { id: "doc14", name: "Campagne_Q1.psd", hasCertificate: true, certificateId: "CERT-DOC-010" },
            { id: "doc15", name: "Logo_V2.png", hasCertificate: true, certificateId: "CERT-DOC-011" },
            { id: "doc16", name: "Brief_campagne.pdf", hasCertificate: false },
          ],
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

  const handleStorageConfig = (folder: FolderData) => {
    setStorageDuration(folder.temporaryStorageConfig?.duration.toString() || "30")
    setDataUsage(folder.temporaryStorageConfig?.dataUsage || "")
    setThirdPartyAccess(folder.temporaryStorageConfig?.thirdPartyAccess || "")
    setActionModal({ type: "storage_config", folder, folders: [] })
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

  const handleViewCertificate = (folder: FolderData) => {
    setActionModal({ type: "certificate", folder, folders: [] })
  }

  const handleViewDocumentsCertificates = (folder: FolderData) => {
    setActionModal({ type: "documents_certificates", folder, folders: [] })
  }

  const handleDownloadCertificate = (folder: FolderData) => {
    if (folder.status === "validated") {
      showNotification("info", `Téléchargement du certificat blockchain pour le dossier ${folder.name}...`)

      sendFolderChatNotification(
        folder.id.toString(),
        `🔗 Certificat blockchain du dossier téléchargé`,
        "folder_blockchain_certificate_download",
      )

      setTimeout(() => {
        showNotification("success", `Certificat blockchain du dossier ${folder.name} téléchargé avec succès`)
      }, 2000)
    }
  }

  const handleManageRoles = (folder: FolderData) => {
    // Rediriger vers la gestion des rôles du dossier
    router.push(`/dashboard/folders/${folder.id}/roles`)
  }

  const handleRequestDocument = (folder: FolderData) => {
    setSelectedDocument("")
    setRequestMessage("")
    setActionModal({ type: "request_document", folder, folders: [] })
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

  const confirmRequestDocument = () => {
    if (actionModal.folder && selectedDocument) {
      const document = actionModal.folder.expectedDocuments.find((doc) => doc.name === selectedDocument)
      if (document) {
        // Trouver l'utilisateur avec le rôle assigné
        const assignedUser = users.find(
          (user) => user.folderRoles[actionModal.folder!.id.toString()]?.role === document.assignedRole,
        )

        if (assignedUser) {
          // Préparer les données pour le chat
          const messageData = {
            userName: assignedUser.name,
            subject: `Demande de document - ${selectedDocument}`,
            content: `Bonjour ${assignedUser.name},\n\nPouvez-vous fournir le document "${selectedDocument}" pour le dossier "${actionModal.folder.name}" ?\n\n${requestMessage}\n\nMerci !`,
          }

          // Stocker dans sessionStorage pour le chat
          sessionStorage.setItem("newMessage", JSON.stringify(messageData))

          showNotification("success", `Demande envoyée à ${assignedUser.name}. Redirection vers le chat...`)

          // Rediriger vers le chat avec l'utilisateur
          setTimeout(() => {
            router.push(`/dashboard/chat?user=${assignedUser.id}&message=new`)
          }, 1500)
        } else {
          showNotification("error", "Aucun utilisateur trouvé avec le rôle requis pour ce document")
        }
      }
    }
    setActionModal({ type: null, folder: null, folders: [] })
  }

  const confirmStorageConfig = () => {
    if (actionModal.folder) {
      const updatedFolder = {
        ...actionModal.folder,
        temporaryStorageConfig: {
          duration: Number.parseInt(storageDuration),
          dataUsage: dataUsage,
          thirdPartyAccess: thirdPartyAccess,
        },
        modified: new Date(),
      }
      setFolders((prev) => prev.map((f) => (f.id === updatedFolder.id ? updatedFolder : f)))
      showNotification("success", `Configuration du stockage temporaire mise à jour pour ${actionModal.folder.name}`)

      // Notification dans le chat du dossier
      const message = `⚙️ Configuration du stockage temporaire mise à jour :\n• Durée : ${storageDuration} jours\n• Usage : ${dataUsage}\n• Accès tiers : ${thirdPartyAccess}`
      sendFolderChatNotification(actionModal.folder.id.toString(), message, "storage_config")
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
      status: "active",
      type: "general",
      expectedDocuments: [],
      activity: [],
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canInvite: true,
        canArchive: true,
        canAnalyze: true,
      },
      documents: [],
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Actif</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">En attente</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Terminé</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Archivé</Badge>
      case "validated":
        return <Badge className="bg-green-300 text-green-800 border-green-400">Validé</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inconnu</Badge>
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

              {/* Vue grille supprimée: forcer la vue liste uniquement */}
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

      {/* Bulk Actions minimalistes: certificats et rôles uniquement */}
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const selected = folders.filter((f) => selectedFolders.includes(f.id))
                    const withCerts = selected.filter((f) => f.documents && f.documents.some((d) => d.hasCertificate))
                    if (withCerts.length === 0) {
                      setNotification({ type: "info", message: "Aucun certificat à télécharger pour la sélection" })
                      return
                    }
                    withCerts.forEach((f) => handleViewDocumentsCertificates(f))
                  }}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Télécharger certificats
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const first = folders.find((f) => selectedFolders.includes(f.id))
                    if (first) {
                      handleManageRoles(first)
                    } else {
                      setNotification({ type: "info", message: "Sélectionnez au moins un dossier" })
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
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Taille</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Modifié</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Propriétaire</th>

                    <th className="text-left py-3 px-4 font-medium text-gray-900">Accès</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
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
                              {getStorageIcon(folder.storageType)}
                              {folder.access === "private" && <Lock className="h-4 w-4 text-gray-400" />}
                            </div>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{folder.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{folder.size}</td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(folder.modified)}</td>
                      <td className="py-3 px-4 text-gray-600">{folder.owner}</td>
                      <td className="py-3 px-4">

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
                      <td className="py-3 px-4">{getStatusBadge(folder.status)}</td>
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
                      {folder.access === "private" && <Lock className="h-4 w-4 text-gray-400" />}
                      {folder.storageType === "temporary" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStorageConfig(folder)}
                          className="h-8 w-8 p-0"
                          title="Configurer le stockage temporaire"
                        >
                          <Timer className="h-4 w-4" />
                        </Button>
                      )}
                      {folder.status === "validated" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadCertificate(folder)}
                          className="h-8 w-8 p-0"
                          title="Télécharger le certificat blockchain"
                        >
                          <ShieldCheck className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      {folder.documents && folder.documents.some((doc) => doc.hasCertificate) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDocumentsCertificates(folder)}
                          className="h-8 w-8 p-0"
                          title="Certificats des documents"
                        >
                          <FileCheck className="h-4 w-4 text-blue-600" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleManageRoles(folder)}
                        className="h-8 w-8 p-0"
                        title="Gérer les rôles"
                      >
                        <Users className="h-4 w-4" />
                      </Button>
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

                        <div className="text-xs text-gray-500">
                          <p>{folder.size}</p>
                          <p>{formatDate(folder.modified)}</p>
                          <div className="flex items-center justify-center space-x-1 mt-1">
                            {getStorageIcon(folder.storageType)}
                            <span>{folder.storageType === "permanent" ? "Permanent" : "Temporaire"}</span>
                          </div>
                          {folder.temporaryStorageConfig && folder.storageType === "temporary" && (
                            <div className="text-xs text-blue-600 mt-1">
                              Durée: {folder.temporaryStorageConfig.duration} jours
                            </div>
                          )}
                        </div>

                        <div className="flex justify-center">{getStatusBadge(folder.status)}</div>

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
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Documents Certificates Modal */}
            {actionModal.type === "documents_certificates" && actionModal.folder && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Certificats des documents - {actionModal.folder.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActionModal({ type: null, folder: null, folders: [] })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <FileCheck className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-blue-900">Certificats des documents</h4>
                        <p className="text-sm text-blue-700">
                          Téléchargez les certificats blockchain individuels des documents de ce dossier
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {actionModal.folder.documents?.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-8 w-8 text-gray-600" />
                            <div>
                              <h5 className="font-medium text-gray-900">{doc.name}</h5>
                              {doc.hasCertificate && doc.certificateId && (
                                <p className="text-sm text-gray-500">ID: {doc.certificateId}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {doc.hasCertificate ? (
                              <>
                                <Badge className="bg-green-100 text-green-800">Certifié</Badge>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    showNotification("info", `Téléchargement du certificat pour ${doc.name}...`)
                                    setTimeout(() => {
                                      showNotification("success", `Certificat de ${doc.name} téléchargé`)
                                      sendFolderChatNotification(
                                        actionModal.folder!.id.toString(),
                                        `📜 Certificat du document "${doc.name}" téléchargé`,
                                        "document_certificate_download",
                                      )
                                    }, 1500)
                                  }}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Télécharger
                                </Button>
                              </>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100 text-gray-600">
                                Non certifié
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-gray-900 mb-3">Actions groupées</h5>
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const certifiedDocs = actionModal.folder!.documents?.filter((doc) => doc.hasCertificate) || []
                          showNotification("info", `Téléchargement de ${certifiedDocs.length} certificat(s)...`)
                          setTimeout(() => {
                            showNotification("success", `${certifiedDocs.length} certificat(s) téléchargé(s)`)
                            sendFolderChatNotification(
                              actionModal.folder!.id.toString(),
                              `📦 Archive des certificats téléchargée (${certifiedDocs.length} documents)`,
                              "bulk_certificates_download",
                            )
                          }, 2000)
                        }}
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        Télécharger tous les certificats (.zip)
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          showNotification("info", "Vérification en ligne des certificats...")
                          setTimeout(() => {
                            showNotification("success", "Tous les certificats sont valides")
                          }, 3000)
                        }}
                      >
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Vérifier tous en ligne
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Storage Config Modal */}
            {actionModal.type === "storage_config" && actionModal.folder && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Configuration du stockage temporaire</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActionModal({ type: null, folder: null, folders: [] })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Timer className="h-5 w-5 text-orange-600" />
                      <span className="font-medium text-orange-900">Configuration du stockage temporaire</span>
                    </div>
                    <p className="text-sm text-orange-800">
                      Configurez la durée de conservation et les informations d'usage pour le dossier{" "}
                      <strong>{actionModal.folder.name}</strong> en stockage temporaire.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="storageDuration">Durée de conservation (en jours)</Label>
                    <Select value={storageDuration} onValueChange={setStorageDuration}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 jours</SelectItem>
                        <SelectItem value="15">15 jours</SelectItem>
                        <SelectItem value="30">30 jours</SelectItem>
                        <SelectItem value="60">60 jours</SelectItem>
                        <SelectItem value="90">90 jours</SelectItem>
                        <SelectItem value="180">180 jours</SelectItem>
                        <SelectItem value="365">1 an</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Durée pendant laquelle les données seront conservées en stockage temporaire avant archivage
                      automatique
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="dataUsage">Usage de la donnée</Label>
                    <Textarea
                      id="dataUsage"
                      value={dataUsage}
                      onChange={(e) => setDataUsage(e.target.value)}
                      placeholder="Décrivez l'usage prévu de ces données (ex: analyses commerciales, rapports internes, documentation projet...)"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Description de l'utilisation prévue des données contenues dans ce dossier
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="thirdPartyAccess">Tiers pouvant avoir accès</Label>
                    <Textarea
                      id="thirdPartyAccess"
                      value={thirdPartyAccess}
                      onChange={(e) => setThirdPartyAccess(e.target.value)}
                      placeholder="Listez les tiers externes qui pourraient avoir accès à ces données (ex: consultants, partenaires, auditeurs...)"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Liste des parties externes qui pourraient être amenées à consulter ces données
                    </p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Information RGPD</span>
                    </div>
                    <p className="text-xs text-blue-800">
                      Ces informations sont utilisées pour assurer la conformité RGPD et la traçabilité des données.
                      Elles seront incluses dans le registre des traitements.
                    </p>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setActionModal({ type: null, folder: null, folders: [] })}>
                      Annuler
                    </Button>
                    <Button onClick={confirmStorageConfig}>
                      <Timer className="h-4 w-4 mr-2" />
                      Enregistrer la configuration
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Certificate Modal */}
            {actionModal.type === "certificate" && actionModal.folder && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Certificat de validation du dossier</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActionModal({ type: null, folder: null, folders: [] })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <ShieldCheck className="h-8 w-8 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-900">Dossier certifié</h4>
                        <p className="text-sm text-green-700">
                          Ce dossier et tous ses documents ont été validés et certifiés numériquement
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-3">Informations du dossier</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nom :</span>
                          <span className="font-medium">{actionModal.folder.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Documents :</span>
                          <span className="font-medium">{actionModal.folder.documentsCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Taille totale :</span>
                          <span className="font-medium">{actionModal.folder.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type :</span>
                          <span className="font-medium capitalize">{actionModal.folder.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hash du dossier :</span>
                          <span className="font-mono text-xs bg-white p-1 rounded break-all">
                            {Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-3">Certificat numérique</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Émis le :</span>
                          <span className="font-medium">{actionModal.folder.modified.toLocaleDateString("fr-FR")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Validé par :</span>
                          <span className="font-medium">{actionModal.folder.owner}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Autorité :</span>
                          <span className="font-medium">DocV Folder Certification</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ID Certificat :</span>
                          <span className="font-mono text-xs bg-white p-1 rounded">
                            FOLDER-CERT-{actionModal.folder.id}-{new Date().getFullYear()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Validité :</span>
                          <span className="font-medium text-green-600">
                            {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-medium text-blue-900 mb-3">Validation du dossier complet</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 text-sm text-blue-800">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Intégrité de tous les documents vérifiée</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Structure du dossier validée</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Permissions et accès contrôlés</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-blue-800">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Horodatage certifié pour tous les fichiers</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Conformité RGPD du dossier</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Traçabilité complète des modifications</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-gray-900 mb-3">Chaîne de confiance distribuée</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">
                            Block #{Math.floor(Math.random() * 1000000)} - Dossier principal
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">
                            {actionModal.folder.documentsCount} documents liés dans la blockchain
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-700">
                            Réplication sur {Math.floor(Math.random() * 5) + 3} nœuds souverains
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-700">
                            Stockage {actionModal.folder.storageType === "permanent" ? "permanent" : "temporaire"}{" "}
                            certifié
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-gray-700">
                            {Math.floor(Math.random() * 100) + 50} confirmations réseau
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                          <span className="text-gray-700">
                            Audit de sécurité: {new Date().toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {actionModal.folder.expectedDocuments.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h5 className="font-medium text-yellow-900 mb-3">Documents attendus - Statut de validation</h5>
                      <div className="space-y-2">
                        {actionModal.folder.expectedDocuments.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-600" />
                              <span className="text-gray-700">{doc.name}</span>
                              {doc.required && <span className="text-red-500 text-xs">*</span>}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={
                                  doc.status === "received"
                                    ? "bg-green-100 text-green-800"
                                    : doc.status === "pending"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-red-100 text-red-800"
                                }
                              >
                                {doc.status === "received"
                                  ? "✓ Validé"
                                  : doc.status === "pending"
                                    ? "⏳ En attente"
                                    : "❌ Manquant"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Simuler le téléchargement du certificat du dossier
                        showNotification("success", `Certificat du dossier ${actionModal.folder!.name} téléchargé`)
                        sendFolderChatNotification(
                          actionModal.folder!.id.toString(),
                          `📜 Certificat de validation du dossier téléchargé`,
                          "folder_certificate_download",
                        )
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le certificat (.pdf)
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Simuler la vérification en ligne du dossier
                        showNotification("info", "Vérification en ligne du certificat du dossier...")
                        setTimeout(() => {
                          showNotification("success", "Certificat du dossier vérifié avec succès")
                        }, 3000)
                      }}
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Vérifier en ligne
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Simuler le téléchargement de l'archive complète certifiée
                        showNotification("info", "Préparation de l'archive certifiée...")
                        setTimeout(() => {
                          showNotification(
                            "success",
                            `Archive certifiée du dossier ${actionModal.folder!.name} téléchargée`,
                          )
                          sendFolderChatNotification(
                            actionModal.folder!.id.toString(),
                            `📦 Archive certifiée complète téléchargée (${actionModal.folder!.documentsCount} documents)`,
                            "certified_archive_download",
                          )
                        }, 4000)
                      }}
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Archive certifiée (.zip)
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Request Document Modal */}
            {actionModal.type === "request_document" && actionModal.folder && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Demander un document</h3>
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
                      Sélectionnez un document attendu pour le dossier <strong>{actionModal.folder.name}</strong> et
                      envoyez une demande à la personne responsable.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="selectedDocument">Document à demander</Label>
                    <Select value={selectedDocument} onValueChange={setSelectedDocument}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un document" />
                      </SelectTrigger>
                      <SelectContent>
                        {actionModal.folder.expectedDocuments.map((doc) => (
                          <SelectItem key={doc.name} value={doc.name}>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4" />
                                <span>{doc.name}</span>
                                {doc.required && <span className="text-red-500">*</span>}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  className={
                                    doc.status === "received"
                                      ? "bg-green-100 text-green-800"
                                      : doc.status === "pending"
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-red-100 text-red-800"
                                  }
                                >
                                  {doc.status === "received"
                                    ? "Reçu"
                                    : doc.status === "pending"
                                      ? "En attente"
                                      : "Manquant"}
                                </Badge>
                                <span className="text-xs text-gray-500">({doc.assignedRole})</span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="requestMessage">Message de demande</Label>
                    <Textarea
                      id="requestMessage"
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      placeholder="Ajouter un message pour expliquer votre demande..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setActionModal({ type: null, folder: null, folders: [] })}>
                      Annuler
                    </Button>
                    <Button onClick={confirmRequestDocument} disabled={!selectedDocument}>
                      <FileQuestion className="h-4 w-4 mr-2" />
                      Envoyer la demande
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Other modals would continue here... */}
          </div>
        </div>
      )}
    </div>
  )
}
