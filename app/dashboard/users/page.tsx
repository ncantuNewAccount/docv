"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Mail,
  UserX,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Crown,
  Eye,
  MessageSquare,
  Settings,
  X,
  AlertTriangle,
  UserCheck,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
  status: "active" | "pending" | "inactive"
  lastActive: string
  avatar: string
  department: string
  joinDate: string
  documentsCount: number
  folderRoles: {
    [folderId: string]: {
      role: "owner" | "editor" | "viewer" | "validator" | "contributor"
      folderName: string
      assignedDate: Date
    }
  }
  spaceRole: "admin" | "manager" | "user" | "guest"
  permissions: {
    canInvite: boolean
    canManageRoles: boolean
    canDelete: boolean
    canDeactivate: boolean
  }
}

interface ActionModal {
  type: "invite" | "message" | "roles" | "deactivate" | "delete" | null
  user: User | null
  users: User[]
}

export default function UsersPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [actionModal, setActionModal] = useState<ActionModal>({ type: null, user: null, users: [] })
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)

  // Modal states
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("viewer")
  const [inviteDepartment, setInviteDepartment] = useState("")
  const [inviteMessage, setInviteMessage] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [messageSubject, setMessageSubject] = useState("")
  const [newUserRole, setNewUserRole] = useState("")
  const [newSpaceRole, setNewSpaceRole] = useState("")
  const [deactivateReason, setDeactivateReason] = useState("")

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Marie Dubois",
      email: "marie.dubois@docv.fr",
      role: "admin",
      status: "active",
      lastActive: "Il y a 2 minutes",
      avatar: "MD",
      department: "Direction",
      joinDate: "2023-01-15",
      documentsCount: 245,
      folderRoles: {
        contracts: { role: "owner", folderName: "Contrats", assignedDate: new Date("2024-01-01") },
        finance: { role: "editor", folderName: "Finance", assignedDate: new Date("2024-01-05") },
      },
      spaceRole: "admin",
      permissions: {
        canInvite: true,
        canManageRoles: true,
        canDelete: false,
        canDeactivate: true,
      },
    },
    {
      id: "2",
      name: "Pierre Martin",
      email: "pierre.martin@docv.fr",
      role: "editor",
      status: "active",
      lastActive: "Il y a 1 heure",
      avatar: "PM",
      department: "Juridique",
      joinDate: "2023-03-20",
      documentsCount: 189,
      folderRoles: {
        contracts: { role: "editor", folderName: "Contrats", assignedDate: new Date("2024-01-10") },
        reports: { role: "viewer", folderName: "Rapports", assignedDate: new Date("2024-01-15") },
      },
      spaceRole: "user",
      permissions: {
        canInvite: true,
        canManageRoles: false,
        canDelete: false,
        canDeactivate: false,
      },
    },
    {
      id: "3",
      name: "Sophie Laurent",
      email: "sophie.laurent@docv.fr",
      role: "viewer",
      status: "pending",
      lastActive: "Jamais connecté",
      avatar: "SL",
      department: "RH",
      joinDate: "2024-01-10",
      documentsCount: 0,
      folderRoles: {
        hr: { role: "owner", folderName: "Ressources Humaines", assignedDate: new Date("2024-01-10") },
      },
      spaceRole: "user",
      permissions: {
        canInvite: false,
        canManageRoles: false,
        canDelete: false,
        canDeactivate: false,
      },
    },
    {
      id: "4",
      name: "Thomas Rousseau",
      email: "thomas.rousseau@docv.fr",
      role: "editor",
      status: "inactive",
      lastActive: "Il y a 2 semaines",
      avatar: "TR",
      department: "Finance",
      joinDate: "2023-06-12",
      documentsCount: 156,
      folderRoles: {
        finance: { role: "owner", folderName: "Finance", assignedDate: new Date("2023-06-12") },
        reports: { role: "contributor", folderName: "Rapports", assignedDate: new Date("2023-07-01") },
      },
      spaceRole: "user",
      permissions: {
        canInvite: true,
        canManageRoles: false,
        canDelete: false,
        canDeactivate: false,
      },
    },
    {
      id: "5",
      name: "Julie Moreau",
      email: "julie.moreau@docv.fr",
      role: "admin",
      status: "active",
      lastActive: "Il y a 30 minutes",
      avatar: "JM",
      department: "IT",
      joinDate: "2023-02-28",
      documentsCount: 312,
      folderRoles: {
        projects: { role: "owner", folderName: "Projets", assignedDate: new Date("2023-02-28") },
        contracts: { role: "validator", folderName: "Contrats", assignedDate: new Date("2023-03-01") },
        hr: { role: "editor", folderName: "Ressources Humaines", assignedDate: new Date("2023-03-15") },
      },
      spaceRole: "admin",
      permissions: {
        canInvite: true,
        canManageRoles: true,
        canDelete: true,
        canDeactivate: true,
      },
    },
  ])

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    pending: users.filter((u) => u.status === "pending").length,
    admins: users.filter((u) => u.role === "admin").length,
  }

  // Notification system
  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  // User actions
  const handleInviteUser = () => {
    setInviteEmail("")
    setInviteRole("viewer")
    setInviteDepartment("")
    setInviteMessage("")
    setActionModal({ type: "invite", user: null, users: [] })
  }

  const handleMessageUser = (user: User) => {
    setMessageSubject("")
    setMessageContent("")
    setActionModal({ type: "message", user, users: [] })
  }

  const handleBulkMessage = () => {
    const selectedUserData = users.filter((user) => selectedUsers.includes(user.id))
    setMessageSubject("")
    setMessageContent("")
    setActionModal({ type: "message", user: null, users: selectedUserData })
  }

  const handleChangeRoles = (user: User) => {
    setNewUserRole(user.role)
    setNewSpaceRole(user.spaceRole)
    setActionModal({ type: "roles", user, users: [] })
  }

  const handleBulkChangeRoles = () => {
    const selectedUserData = users.filter((user) => selectedUsers.includes(user.id))
    setNewUserRole("")
    setNewSpaceRole("")
    setActionModal({ type: "roles", user: null, users: selectedUserData })
  }

  const handleDeactivateUser = (user: User) => {
    setDeactivateReason("")
    setActionModal({ type: "deactivate", user, users: [] })
  }

  const handleBulkDeactivate = () => {
    const selectedUserData = users.filter((user) => selectedUsers.includes(user.id) && user.permissions.canDeactivate)
    if (selectedUserData.length === 0) {
      showNotification("error", "Aucun utilisateur sélectionné ne peut être désactivé")
      return
    }
    setDeactivateReason("")
    setActionModal({ type: "deactivate", user: null, users: selectedUserData })
  }

  const handleDeleteUser = (user: User) => {
    setActionModal({ type: "delete", user, users: [] })
  }

  // Modal actions
  const confirmInvite = () => {
    const newUser: User = {
      id: (users.length + 1).toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole as "admin" | "editor" | "viewer",
      status: "pending",
      lastActive: "Jamais connecté",
      avatar: inviteEmail.substring(0, 2).toUpperCase(),
      department: inviteDepartment,
      joinDate: new Date().toISOString().split("T")[0],
      documentsCount: 0,
      folderRoles: {},
      spaceRole: inviteRole === "admin" ? "admin" : "user",
      permissions: {
        canInvite: inviteRole !== "viewer",
        canManageRoles: inviteRole === "admin",
        canDelete: inviteRole === "admin",
        canDeactivate: inviteRole === "admin",
      },
    }

    setUsers((prev) => [...prev, newUser])
    showNotification("success", `Invitation envoyée à ${inviteEmail}`)
    setActionModal({ type: null, user: null, users: [] })
  }

  const confirmMessage = () => {
    if (actionModal.user) {
      // Créer une nouvelle conversation ou rediriger vers une existante
      const conversationData = {
        userId: actionModal.user.id,
        userName: actionModal.user.name,
        subject: messageSubject,
        content: messageContent,
        timestamp: new Date().toISOString(),
      }

      // Stocker les données du message pour le chat
      sessionStorage.setItem("newMessage", JSON.stringify(conversationData))

      showNotification("success", `Redirection vers le chat avec ${actionModal.user.name}...`)
      setTimeout(() => {
        router.push(`/dashboard/chat?user=${actionModal.user.id}&message=new`)
      }, 1000)
    } else if (actionModal.users.length > 0) {
      // Pour les messages groupés
      const groupData = {
        users: actionModal.users.map((u) => ({ id: u.id, name: u.name })),
        subject: messageSubject,
        content: messageContent,
        timestamp: new Date().toISOString(),
      }

      sessionStorage.setItem("newGroupMessage", JSON.stringify(groupData))

      showNotification(
        "success",
        `Redirection vers le chat de groupe avec ${actionModal.users.length} utilisateur(s)...`,
      )
      setTimeout(() => {
        router.push("/dashboard/chat?type=group&message=new")
      }, 1000)
      setSelectedUsers([])
    }
    setActionModal({ type: null, user: null, users: [] })
  }

  const confirmRoleChange = () => {
    if (actionModal.user) {
      const updatedUser = {
        ...actionModal.user,
        role: newUserRole as "admin" | "editor" | "viewer",
        spaceRole: newSpaceRole as "admin" | "manager" | "user" | "guest",
        permissions: {
          canInvite: newUserRole !== "viewer",
          canManageRoles: newUserRole === "admin",
          canDelete: newUserRole === "admin",
          canDeactivate: newUserRole === "admin",
        },
      }
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
      showNotification("success", `Rôles mis à jour pour ${actionModal.user.name}`)
    } else if (actionModal.users.length > 0) {
      const userIds = actionModal.users.map((u) => u.id)
      setUsers((prev) =>
        prev.map((u) =>
          userIds.includes(u.id)
            ? {
                ...u,
                role: newUserRole as "admin" | "editor" | "viewer",
                spaceRole: newSpaceRole as "admin" | "manager" | "user" | "guest",
                permissions: {
                  canInvite: newUserRole !== "viewer",
                  canManageRoles: newUserRole === "admin",
                  canDelete: newUserRole === "admin",
                  canDeactivate: newUserRole === "admin",
                },
              }
            : u,
        ),
      )
      showNotification("success", `Rôles mis à jour pour ${actionModal.users.length} utilisateur(s)`)
      setSelectedUsers([])
    }
    setActionModal({ type: null, user: null, users: [] })
  }

  const confirmDeactivate = () => {
    if (actionModal.user) {
      const updatedUser = { ...actionModal.user, status: "inactive" as const }
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
      showNotification("success", `${actionModal.user.name} désactivé`)
    } else if (actionModal.users.length > 0) {
      const userIds = actionModal.users.map((u) => u.id)
      setUsers((prev) => prev.map((u) => (userIds.includes(u.id) ? { ...u, status: "inactive" as const } : u)))
      showNotification("success", `${actionModal.users.length} utilisateur(s) désactivé(s)`)
      setSelectedUsers([])
    }
    setActionModal({ type: null, user: null, users: [] })
  }

  const confirmDelete = () => {
    if (actionModal.user) {
      setUsers((prev) => prev.filter((u) => u.id !== actionModal.user!.id))
      showNotification("success", `${actionModal.user.name} supprimé`)
    }
    setActionModal({ type: null, user: null, users: [] })
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "editor":
        return "bg-blue-100 text-blue-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "inactive":
        return <XCircle className="h-4 w-4" />
      default:
        return <XCircle className="h-4 w-4" />
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4" />
      case "editor":
        return <Edit className="h-4 w-4" />
      case "viewer":
        return <Eye className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
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
          {notification.type === "info" && <Settings className="h-5 w-5" />}
          <span>{notification.message}</span>
          <Button variant="ghost" size="sm" onClick={() => setNotification(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des rôles - Profils utilisateurs</h1>
          <p className="text-gray-600 mt-1">Gérez les utilisateurs, leurs rôles et leurs permissions dans l'espace</p>
        </div>
        <Button onClick={handleInviteUser}>
          <UserPlus className="h-4 w-4 mr-2" />
          Inviter un utilisateur
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="editor">Éditeur</SelectItem>
                <SelectItem value="viewer">Lecteur</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedUsers.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedUsers.length} utilisateur(s) sélectionné(s)
                </span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleBulkMessage}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Envoyer un message
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleBulkChangeRoles}>
                    <Settings className="h-4 w-4 mr-2" />
                    Changer les rôles
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleBulkDeactivate}>
                    <UserX className="h-4 w-4 mr-2" />
                    Désactiver
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left p-4 font-medium">Utilisateur</th>
                  <th className="text-left p-4 font-medium">Rôle</th>
                  <th className="text-left p-4 font-medium">Statut</th>
                  <th className="text-left p-4 font-medium">Département</th>
                  <th className="text-left p-4 font-medium">Documents</th>
                  <th className="text-left p-4 font-medium">Dernière activité</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleSelectUser(user.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">{user.avatar}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getRoleColor(user.role)}>
                        <div className="flex items-center space-x-1">
                          {getRoleIcon(user.role)}
                          <span className="capitalize">{user.role}</span>
                        </div>
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(user.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(user.status)}
                          <span className="capitalize">{user.status}</span>
                        </div>
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-600">{user.department}</td>
                    <td className="p-4 text-gray-600">{user.documentsCount}</td>
                    <td className="p-4 text-gray-600">{user.lastActive}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleMessageUser(user)}>
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        {user.permissions.canManageRoles && (
                          <Button variant="outline" size="sm" onClick={() => handleChangeRoles(user)}>
                            <Settings className="h-4 w-4" />
                          </Button>
                        )}
                        <div className="relative group">
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 min-w-[150px]">
                            <button
                              onClick={() => handleMessageUser(user)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center"
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Envoyer un message
                            </button>
                            <button
                              onClick={() => handleChangeRoles(user)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center"
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Changer les rôles
                            </button>
                            {user.permissions.canDeactivate && user.status === "active" && (
                              <button
                                onClick={() => handleDeactivateUser(user)}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center text-orange-600"
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Désactiver
                              </button>
                            )}
                            {user.permissions.canDelete && (
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {actionModal.type && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Invite Modal */}
            {actionModal.type === "invite" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Inviter un utilisateur</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActionModal({ type: null, user: null, users: [] })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="inviteEmail">Email</Label>
                    <Input
                      id="inviteEmail"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="utilisateur@exemple.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inviteRole">Rôle</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Lecteur</SelectItem>
                        <SelectItem value="editor">Éditeur</SelectItem>
                        <SelectItem value="admin">Administrateur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="inviteDepartment">Département</Label>
                    <Input
                      id="inviteDepartment"
                      value={inviteDepartment}
                      onChange={(e) => setInviteDepartment(e.target.value)}
                      placeholder="ex: Juridique"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inviteMessage">Message personnalisé (optionnel)</Label>
                    <Textarea
                      id="inviteMessage"
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      placeholder="Bienvenue dans l'équipe DocV..."
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setActionModal({ type: null, user: null, users: [] })}>
                      Annuler
                    </Button>
                    <Button onClick={confirmInvite} disabled={!inviteEmail.trim()}>
                      <Mail className="h-4 w-4 mr-2" />
                      Envoyer l'invitation
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Message Modal */}
            {actionModal.type === "message" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {actionModal.user
                      ? `Envoyer un message à ${actionModal.user.name}`
                      : `Envoyer un message à ${actionModal.users.length} utilisateur(s)`}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActionModal({ type: null, user: null, users: [] })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Message instantané</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      Le message sera envoyé directement dans le chat et par email si l'utilisateur est hors ligne.
                    </p>
                  </div>

                  {actionModal.users.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Destinataires :</p>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {actionModal.users.map((user) => (
                          <div key={user.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">
                              {user.avatar}
                            </div>
                            <span className="flex-1">{user.name}</span>
                            <Badge className={getStatusColor(user.status)} variant="outline">
                              {user.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="messageSubject">Sujet</Label>
                    <Input
                      id="messageSubject"
                      value={messageSubject}
                      onChange={(e) => setMessageSubject(e.target.value)}
                      placeholder="Sujet du message"
                    />
                  </div>
                  <div>
                    <Label htmlFor="messageContent">Message</Label>
                    <Textarea
                      id="messageContent"
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      placeholder="Tapez votre message ici..."
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setActionModal({ type: null, user: null, users: [] })}>
                      Annuler
                    </Button>
                    <Button onClick={confirmMessage} disabled={!messageContent.trim()}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Envoyer le message
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Roles Modal */}
            {actionModal.type === "roles" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {actionModal.user
                      ? `Changer les rôles de ${actionModal.user.name}`
                      : `Changer les rôles de ${actionModal.users.length} utilisateur(s)`}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActionModal({ type: null, user: null, users: [] })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Settings className="h-5 w-5 text-orange-600" />
                      <span className="font-medium text-orange-900">Modification des permissions</span>
                    </div>
                    <p className="text-sm text-orange-800">
                      Changer les rôles modifiera les permissions d'accès aux documents et fonctionnalités.
                    </p>
                  </div>

                  {actionModal.user && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Rôles actuels :</p>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Rôle principal :</span>
                            <Badge className={getRoleColor(actionModal.user.role)}>
                              {getRoleIcon(actionModal.user.role)}
                              <span className="ml-1 capitalize">{actionModal.user.role}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Rôle d'espace :</span>
                            <Badge variant="outline" className="capitalize">
                              {actionModal.user.spaceRole}
                            </Badge>
                          </div>
                        </div>
                        {Object.keys(actionModal.user.folderRoles).length > 0 && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-600">Rôles sur dossiers :</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Object.entries(actionModal.user.folderRoles).map(([folderId, folderRole]) => (
                                <Badge key={folderId} variant="outline" className="text-xs">
                                  {folderRole.folderName}: {folderRole.role}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newUserRole">Nouveau rôle principal</Label>
                      <Select value={newUserRole} onValueChange={setNewUserRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">
                            <div className="flex items-center space-x-2">
                              <Eye className="h-4 w-4" />
                              <div>
                                <span>Lecteur</span>
                                <p className="text-xs text-gray-500">Lecture seule</p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="editor">
                            <div className="flex items-center space-x-2">
                              <Edit className="h-4 w-4" />
                              <div>
                                <span>Éditeur</span>
                                <p className="text-xs text-gray-500">Peut modifier les documents</p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center space-x-2">
                              <Crown className="h-4 w-4" />
                              <div>
                                <span>Administrateur</span>
                                <p className="text-xs text-gray-500">Accès complet</p>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="newSpaceRole">Nouveau rôle d'espace</Label>
                      <Select value={newSpaceRole} onValueChange={setNewSpaceRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle d'espace" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="guest">Invité</SelectItem>
                          <SelectItem value="user">Utilisateur</SelectItem>
                          <SelectItem value="manager">Gestionnaire</SelectItem>
                          <SelectItem value="admin">Administrateur d'espace</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setActionModal({ type: null, user: null, users: [] })}>
                      Annuler
                    </Button>
                    <Button onClick={confirmRoleChange} disabled={!newUserRole || !newSpaceRole}>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Mettre à jour les rôles
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Deactivate Modal */}
            {actionModal.type === "deactivate" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-orange-600">
                    {actionModal.user
                      ? `Désactiver ${actionModal.user.name}`
                      : `Désactiver ${actionModal.users.length} utilisateur(s)`}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActionModal({ type: null, user: null, users: [] })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <UserX className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-orange-800">
                        {actionModal.user
                          ? `${actionModal.user.name} sera désactivé(e) et ne pourra plus accéder au système.`
                          : `${actionModal.users.length} utilisateur(s) seront désactivés et ne pourront plus accéder au système.`}
                      </p>
                      <p className="text-xs text-orange-600">
                        Les utilisateurs désactivés peuvent être réactivés à tout moment.
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="deactivateReason">Raison de la désactivation (optionnel)</Label>
                    <Textarea
                      id="deactivateReason"
                      value={deactivateReason}
                      onChange={(e) => setDeactivateReason(e.target.value)}
                      placeholder="Expliquer pourquoi cet utilisateur est désactivé..."
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setActionModal({ type: null, user: null, users: [] })}>
                      Annuler
                    </Button>
                    <Button variant="destructive" onClick={confirmDeactivate}>
                      <UserX className="h-4 w-4 mr-2" />
                      Désactiver
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
                    onClick={() => setActionModal({ type: null, user: null, users: [] })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        Êtes-vous sûr de vouloir supprimer {actionModal.user?.name} ?
                      </p>
                      <p className="text-xs text-red-600">
                        Cette action est irréversible. Tous les documents et données associés seront transférés à un
                        autre utilisateur.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setActionModal({ type: null, user: null, users: [] })}>
                      Annuler
                    </Button>
                    <Button variant="destructive" onClick={confirmDelete}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer définitivement
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
