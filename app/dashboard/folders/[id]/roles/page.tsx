"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  UserPlus,
  Search,
  ArrowLeft,
  Crown,
  Edit,
  Eye,
  Shield,
  UserCheck,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  Info,
  Folder,
} from "lucide-react"

interface FolderRole {
  userId: string
  userName: string
  userEmail: string
  userAvatar: string
  role: "owner" | "editor" | "viewer" | "validator" | "contributor"
  assignedDate: Date
  assignedBy: string
  defaultRole: "admin" | "editor" | "viewer"
}

interface User {
  id: string
  name: string
  email: string
  avatar: string
  defaultRole: "admin" | "editor" | "viewer"
  department: string
}

export default function FolderRolesPage() {
  const router = useRouter()
  const params = useParams()
  const folderId = params.id as string

  const [folderName, setFolderName] = useState("")
  const [folderRoles, setFolderRoles] = useState<FolderRole[]>([])
  const [availableUsers, setAvailableUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddUser, setShowAddUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedRole, setSelectedRole] = useState("viewer")
  const [inviteMessage, setInviteMessage] = useState("")
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)

  // Simuler le chargement des données
  useEffect(() => {
    // Charger les informations du dossier
    const folderNames: { [key: string]: string } = {
      "1": "Contrats",
      "2": "Rapports",
      "3": "Projets",
      "4": "Finance",
      "5": "Ressources Humaines",
      "6": "Marketing",
    }
    setFolderName(folderNames[folderId] || "Dossier")

    // Charger les rôles existants sur le dossier
    const mockFolderRoles: FolderRole[] = [
      {
        userId: "1",
        userName: "Marie Dubois",
        userEmail: "marie.dubois@docv.fr",
        userAvatar: "MD",
        role: "owner",
        assignedDate: new Date("2024-01-01"),
        assignedBy: "Système",
        defaultRole: "admin",
      },
      {
        userId: "2",
        userName: "Pierre Martin",
        userEmail: "pierre.martin@docv.fr",
        userAvatar: "PM",
        role: "editor",
        assignedDate: new Date("2024-01-10"),
        assignedBy: "Marie Dubois",
        defaultRole: "editor",
      },
      {
        userId: "5",
        userName: "Julie Moreau",
        userEmail: "julie.moreau@docv.fr",
        userAvatar: "JM",
        role: "validator",
        assignedDate: new Date("2024-01-15"),
        assignedBy: "Marie Dubois",
        defaultRole: "admin",
      },
    ]
    setFolderRoles(mockFolderRoles)

    // Charger les utilisateurs disponibles (ceux qui n'ont pas encore de rôle sur ce dossier)
    const allUsers: User[] = [
      {
        id: "3",
        name: "Sophie Laurent",
        email: "sophie.laurent@docv.fr",
        avatar: "SL",
        defaultRole: "viewer",
        department: "RH",
      },
      {
        id: "4",
        name: "Thomas Rousseau",
        email: "thomas.rousseau@docv.fr",
        avatar: "TR",
        defaultRole: "editor",
        department: "Finance",
      },
    ]

    const usersWithRoles = mockFolderRoles.map((fr) => fr.userId)
    const available = allUsers.filter((user) => !usersWithRoles.includes(user.id))
    setAvailableUsers(available)
  }, [folderId])

  // Notification system
  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-600" />
      case "editor":
        return <Edit className="h-4 w-4 text-blue-600" />
      case "validator":
        return <Shield className="h-4 w-4 text-green-600" />
      case "contributor":
        return <UserPlus className="h-4 w-4 text-purple-600" />
      case "viewer":
        return <Eye className="h-4 w-4 text-gray-600" />
      default:
        return <Eye className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "editor":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "validator":
        return "bg-green-100 text-green-800 border-green-200"
      case "contributor":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "viewer":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDefaultRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200"
      case "editor":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "viewer":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleAddUser = () => {
    if (!selectedUser) return

    const user = availableUsers.find((u) => u.id === selectedUser)
    if (!user) return

    const newRole: FolderRole = {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userAvatar: user.avatar,
      role: selectedRole as "owner" | "editor" | "viewer" | "validator" | "contributor",
      assignedDate: new Date(),
      assignedBy: "Utilisateur actuel",
      defaultRole: user.defaultRole,
    }

    setFolderRoles((prev) => [...prev, newRole])
    setAvailableUsers((prev) => prev.filter((u) => u.id !== selectedUser))

    showNotification("success", `${user.name} ajouté avec le rôle ${selectedRole}`)

    // Reset form
    setSelectedUser("")
    setSelectedRole("viewer")
    setInviteMessage("")
    setShowAddUser(false)
  }

  const handleChangeRole = (userId: string, newRole: string) => {
    setFolderRoles((prev) =>
      prev.map((fr) =>
        fr.userId === userId
          ? { ...fr, role: newRole as "owner" | "editor" | "viewer" | "validator" | "contributor" }
          : fr,
      ),
    )

    const user = folderRoles.find((fr) => fr.userId === userId)
    showNotification("success", `Rôle de ${user?.userName} mis à jour vers ${newRole}`)
  }

  const handleRemoveUser = (userId: string) => {
    const userRole = folderRoles.find((fr) => fr.userId === userId)
    if (!userRole) return

    if (userRole.role === "owner") {
      showNotification("error", "Impossible de supprimer le propriétaire du dossier")
      return
    }

    setFolderRoles((prev) => prev.filter((fr) => fr.userId !== userId))

    // Remettre l'utilisateur dans la liste des disponibles
    const user: User = {
      id: userRole.userId,
      name: userRole.userName,
      email: userRole.userEmail,
      avatar: userRole.userAvatar,
      defaultRole: userRole.defaultRole,
      department: "Département", // Valeur par défaut
    }
    setAvailableUsers((prev) => [...prev, user])

    showNotification("success", `${userRole.userName} retiré du dossier`)
  }

  const filteredRoles = folderRoles.filter(
    (role) =>
      role.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.userEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Folder className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des rôles - Dossier "{folderName}"</h1>
            <p className="text-gray-600">Gérez les permissions d'accès et les rôles des utilisateurs sur ce dossier</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{folderRoles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Propriétaires</p>
                <p className="text-2xl font-bold text-gray-900">
                  {folderRoles.filter((r) => r.role === "owner").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Edit className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Éditeurs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {folderRoles.filter((r) => r.role === "editor").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Validateurs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {folderRoles.filter((r) => r.role === "validator").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Add */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowAddUser(true)} disabled={availableUsers.length === 0}>
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter un utilisateur
            </Button>
          </div>

          {showAddUser && (
            <div className="mt-4 p-4 border rounded-lg bg-blue-50">
              <h3 className="font-medium text-blue-900 mb-3">Ajouter un utilisateur au dossier</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Utilisateur</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un utilisateur" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">
                              {user.avatar}
                            </div>
                            <div>
                              <span className="font-medium">{user.name}</span>
                              <div className="flex items-center space-x-1 mt-1">
                                <span className="text-xs text-gray-500">Rôle par défaut:</span>
                                <Badge variant="outline" className={`text-xs ${getDefaultRoleColor(user.defaultRole)}`}>
                                  {user.defaultRole}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Rôle sur ce dossier</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue />
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
                      <SelectItem value="contributor">
                        <div className="flex items-center space-x-2">
                          <UserPlus className="h-4 w-4" />
                          <div>
                            <span>Contributeur</span>
                            <p className="text-xs text-gray-500">Peut ajouter des documents</p>
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
                      <SelectItem value="validator">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4" />
                          <div>
                            <span>Validateur</span>
                            <p className="text-xs text-gray-500">Peut valider les documents</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="owner">
                        <div className="flex items-center space-x-2">
                          <Crown className="h-4 w-4" />
                          <div>
                            <span>Propriétaire</span>
                            <p className="text-xs text-gray-500">Contrôle total</p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end space-x-2">
                  <Button onClick={handleAddUser} disabled={!selectedUser}>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddUser(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Roles List */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs avec accès au dossier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Utilisateur</th>
                  <th className="text-left p-4 font-medium">Rôle par défaut</th>
                  <th className="text-left p-4 font-medium">Rôle sur ce dossier</th>
                  <th className="text-left p-4 font-medium">Assigné le</th>
                  <th className="text-left p-4 font-medium">Assigné par</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((roleAssignment) => (
                  <tr key={roleAssignment.userId} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">{roleAssignment.userAvatar}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{roleAssignment.userName}</p>
                          <p className="text-sm text-gray-500">{roleAssignment.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={getDefaultRoleColor(roleAssignment.defaultRole)}>
                        {roleAssignment.defaultRole}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Select
                        value={roleAssignment.role}
                        onValueChange={(newRole) => handleChangeRole(roleAssignment.userId, newRole)}
                        disabled={roleAssignment.role === "owner"}
                      >
                        <SelectTrigger className="w-40">
                          <div className="flex items-center space-x-2">
                            {getRoleIcon(roleAssignment.role)}
                            <span className="capitalize">{roleAssignment.role}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">
                            <div className="flex items-center space-x-2">
                              <Eye className="h-4 w-4" />
                              <span>Lecteur</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="contributor">
                            <div className="flex items-center space-x-2">
                              <UserPlus className="h-4 w-4" />
                              <span>Contributeur</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="editor">
                            <div className="flex items-center space-x-2">
                              <Edit className="h-4 w-4" />
                              <span>Éditeur</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="validator">
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4" />
                              <span>Validateur</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="owner">
                            <div className="flex items-center space-x-2">
                              <Crown className="h-4 w-4" />
                              <span>Propriétaire</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4 text-gray-600">{roleAssignment.assignedDate.toLocaleDateString("fr-FR")}</td>
                    <td className="p-4 text-gray-600">{roleAssignment.assignedBy}</td>
                    <td className="p-4">
                      {roleAssignment.role !== "owner" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveUser(roleAssignment.userId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRoles.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
