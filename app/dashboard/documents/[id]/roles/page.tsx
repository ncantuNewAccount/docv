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
  FileText,
  Download,
  Share2,
} from "lucide-react"

interface DocumentRole {
  userId: string
  userName: string
  userEmail: string
  userAvatar: string
  role: "owner" | "editor" | "viewer" | "validator" | "contributor"
  assignedDate: Date
  assignedBy: string
  defaultRole: "admin" | "editor" | "viewer"
  permissions: {
    canView: boolean
    canEdit: boolean
    canDelete: boolean
    canShare: boolean
    canValidate: boolean
    canDownload: boolean
  }
}

interface User {
  id: string
  name: string
  email: string
  avatar: string
  defaultRole: "admin" | "editor" | "viewer"
  department: string
}

interface Document {
  id: string
  name: string
  type: string
  size: string
  folder: string
  author: string
  modified: Date
  isValidated: boolean
  storageType: "temporary" | "permanent"
}

export default function DocumentRolesPage() {
  const router = useRouter()
  const params = useParams()
  const documentId = params.id as string

  const [document, setDocument] = useState<Document | null>(null)
  const [documentRoles, setDocumentRoles] = useState<DocumentRole[]>([])
  const [availableUsers, setAvailableUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddUser, setShowAddUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedRole, setSelectedRole] = useState("viewer")
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)

  // Simuler le chargement des données
  useEffect(() => {
    // Charger les informations du document
    const mockDocument: Document = {
      id: documentId,
      name: "Contrat_Client_ABC.pdf",
      type: "PDF",
      size: "2.4 MB",
      folder: "Contrats",
      author: "Marie Dubois",
      modified: new Date("2024-01-15T14:30:00"),
      isValidated: true,
      storageType: "permanent",
    }
    setDocument(mockDocument)

    // Charger les rôles existants sur le document
    const mockDocumentRoles: DocumentRole[] = [
      {
        userId: "1",
        userName: "Marie Dubois",
        userEmail: "marie.dubois@docv.fr",
        userAvatar: "MD",
        role: "owner",
        assignedDate: new Date("2024-01-15"),
        assignedBy: "Système",
        defaultRole: "admin",
        permissions: {
          canView: true,
          canEdit: true,
          canDelete: true,
          canShare: true,
          canValidate: true,
          canDownload: true,
        },
      },
      {
        userId: "2",
        userName: "Pierre Martin",
        userEmail: "pierre.martin@docv.fr",
        userAvatar: "PM",
        role: "editor",
        assignedDate: new Date("2024-01-16"),
        assignedBy: "Marie Dubois",
        defaultRole: "editor",
        permissions: {
          canView: true,
          canEdit: true,
          canDelete: false,
          canShare: true,
          canValidate: false,
          canDownload: true,
        },
      },
      {
        userId: "5",
        userName: "Julie Moreau",
        userEmail: "julie.moreau@docv.fr",
        userAvatar: "JM",
        role: "validator",
        assignedDate: new Date("2024-01-17"),
        assignedBy: "Marie Dubois",
        defaultRole: "admin",
        permissions: {
          canView: true,
          canEdit: false,
          canDelete: false,
          canShare: false,
          canValidate: true,
          canDownload: true,
        },
      },
    ]
    setDocumentRoles(mockDocumentRoles)

    // Charger les utilisateurs disponibles
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

    const usersWithRoles = mockDocumentRoles.map((dr) => dr.userId)
    const available = allUsers.filter((user) => !usersWithRoles.includes(user.id))
    setAvailableUsers(available)
  }, [documentId])

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

  const getPermissionsForRole = (role: string) => {
    switch (role) {
      case "owner":
        return {
          canView: true,
          canEdit: true,
          canDelete: true,
          canShare: true,
          canValidate: true,
          canDownload: true,
        }
      case "editor":
        return {
          canView: true,
          canEdit: true,
          canDelete: false,
          canShare: true,
          canValidate: false,
          canDownload: true,
        }
      case "validator":
        return {
          canView: true,
          canEdit: false,
          canDelete: false,
          canShare: false,
          canValidate: true,
          canDownload: true,
        }
      case "contributor":
        return {
          canView: true,
          canEdit: false,
          canDelete: false,
          canShare: false,
          canValidate: false,
          canDownload: true,
        }
      case "viewer":
        return {
          canView: true,
          canEdit: false,
          canDelete: false,
          canShare: false,
          canValidate: false,
          canDownload: true,
        }
      default:
        return {
          canView: true,
          canEdit: false,
          canDelete: false,
          canShare: false,
          canValidate: false,
          canDownload: false,
        }
    }
  }

  const handleAddUser = () => {
    if (!selectedUser) return

    const user = availableUsers.find((u) => u.id === selectedUser)
    if (!user) return

    const newRole: DocumentRole = {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userAvatar: user.avatar,
      role: selectedRole as "owner" | "editor" | "viewer" | "validator" | "contributor",
      assignedDate: new Date(),
      assignedBy: "Utilisateur actuel",
      defaultRole: user.defaultRole,
      permissions: getPermissionsForRole(selectedRole),
    }

    setDocumentRoles((prev) => [...prev, newRole])
    setAvailableUsers((prev) => prev.filter((u) => u.id !== selectedUser))

    showNotification("success", `${user.name} ajouté avec le rôle ${selectedRole}`)

    // Reset form
    setSelectedUser("")
    setSelectedRole("viewer")
    setShowAddUser(false)
  }

  const handleChangeRole = (userId: string, newRole: string) => {
    setDocumentRoles((prev) =>
      prev.map((dr) =>
        dr.userId === userId
          ? {
              ...dr,
              role: newRole as "owner" | "editor" | "viewer" | "validator" | "contributor",
              permissions: getPermissionsForRole(newRole),
            }
          : dr,
      ),
    )

    const user = documentRoles.find((dr) => dr.userId === userId)
    showNotification("success", `Rôle de ${user?.userName} mis à jour vers ${newRole}`)
  }

  const handleRemoveUser = (userId: string) => {
    const userRole = documentRoles.find((dr) => dr.userId === userId)
    if (!userRole) return

    if (userRole.role === "owner") {
      showNotification("error", "Impossible de supprimer le propriétaire du document")
      return
    }

    setDocumentRoles((prev) => prev.filter((dr) => dr.userId !== userId))

    // Remettre l'utilisateur dans la liste des disponibles
    const user: User = {
      id: userRole.userId,
      name: userRole.userName,
      email: userRole.userEmail,
      avatar: userRole.userAvatar,
      defaultRole: userRole.defaultRole,
      department: "Département",
    }
    setAvailableUsers((prev) => [...prev, user])

    showNotification("success", `${userRole.userName} retiré du document`)
  }

  const filteredRoles = documentRoles.filter(
    (role) =>
      role.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.userEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!document) {
    return <div>Chargement...</div>
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
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <FileText className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des rôles - Document "{document.name}"</h1>
            <p className="text-gray-600">Gérez les permissions d'accès et les rôles des utilisateurs sur ce document</p>
          </div>
        </div>
      </div>

      {/* Document Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <FileText className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{document.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span>
                    {document.type} • {document.size}
                  </span>
                  <span>Dossier: {document.folder}</span>
                  <span>Auteur: {document.author}</span>
                  <Badge
                    className={document.isValidated ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                  >
                    {document.isValidated ? "Validé" : "En attente"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{documentRoles.length}</p>
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
                  {documentRoles.filter((r) => r.permissions.canEdit).length}
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
                  {documentRoles.filter((r) => r.permissions.canValidate).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lecteurs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {documentRoles.filter((r) => r.role === "viewer").length}
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
              <h3 className="font-medium text-blue-900 mb-3">Ajouter un utilisateur au document</h3>
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
                  <Label>Rôle sur ce document</Label>
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
                            <p className="text-xs text-gray-500">Lecture et téléchargement</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="contributor">
                        <div className="flex items-center space-x-2">
                          <UserPlus className="h-4 w-4" />
                          <div>
                            <span>Contributeur</span>
                            <p className="text-xs text-gray-500">Lecture et commentaires</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="editor">
                        <div className="flex items-center space-x-2">
                          <Edit className="h-4 w-4" />
                          <div>
                            <span>Éditeur</span>
                            <p className="text-xs text-gray-500">Peut modifier le document</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="validator">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4" />
                          <div>
                            <span>Validateur</span>
                            <p className="text-xs text-gray-500">Peut valider le document</p>
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
          <CardTitle>Utilisateurs avec accès au document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Utilisateur</th>
                  <th className="text-left p-4 font-medium">Rôle par défaut</th>
                  <th className="text-left p-4 font-medium">Rôle sur ce document</th>
                  <th className="text-left p-4 font-medium">Permissions</th>
                  <th className="text-left p-4 font-medium">Assigné le</th>
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
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {roleAssignment.permissions.canView && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            <Eye className="h-3 w-3 mr-1" />
                            Voir
                          </Badge>
                        )}
                        {roleAssignment.permissions.canEdit && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            <Edit className="h-3 w-3 mr-1" />
                            Éditer
                          </Badge>
                        )}
                        {roleAssignment.permissions.canValidate && (
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                            <Shield className="h-3 w-3 mr-1" />
                            Valider
                          </Badge>
                        )}
                        {roleAssignment.permissions.canShare && (
                          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                            <Share2 className="h-3 w-3 mr-1" />
                            Partager
                          </Badge>
                        )}
                        {roleAssignment.permissions.canDownload && (
                          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700">
                            <Download className="h-3 w-3 mr-1" />
                            Télécharger
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{roleAssignment.assignedDate.toLocaleDateString("fr-FR")}</td>
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
