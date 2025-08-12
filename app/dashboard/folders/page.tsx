"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Folder,
  FolderOpen,
  Grid3X3,
  List,
  Search,
  Filter,
  Share2,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Users,
  FileText,
  Clock,
  Star,
  ChevronRight,
  FolderPlus,
  Upload,
  Download,
  Settings,
  Lock,
  SortAsc,
  SortDesc,
} from "lucide-react"

export default function FoldersPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFolders, setSelectedFolders] = useState<number[]>([])
  const [sortBy, setSortBy] = useState("modified")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterAccess, setFilterAccess] = useState("all")
  const [filterOwner, setFilterOwner] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPath, setCurrentPath] = useState<string[]>(["Racine"])

  const [folders, setFolders] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    shared: 0,
    private: 0,
    thisWeek: 0,
  })

  useEffect(() => {
    // Simuler le chargement des dossiers
    const loadFolders = () => {
      const mockFolders = [
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
          activity: [
            { user: "Marie Dubois", action: "ajouté", item: "Contrat_ABC.pdf", time: "Il y a 2h" },
            { user: "Jean Martin", action: "modifié", item: "Contrat_XYZ.pdf", time: "Il y a 5h" },
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
          activity: [
            { user: "Sophie Laurent", action: "créé", item: "Rapport_Nov.docx", time: "Il y a 1j" },
            { user: "Pierre Durand", action: "consulté", item: "Analyse_Q4.xlsx", time: "Il y a 2j" },
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
          activity: [
            { user: "Jean Martin", action: "partagé", item: "Specs_Alpha.pdf", time: "Il y a 3h" },
            { user: "Marie Dubois", action: "commenté", item: "Design_Beta.figma", time: "Il y a 6h" },
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
          activity: [
            { user: "Marie Dubois", action: "mis à jour", item: "Budget_2024.xlsx", time: "Il y a 1j" },
            { user: "Admin", action: "vérifié", item: "Factures_Dec.pdf", time: "Il y a 2j" },
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
          owner: "Admin",
          access: "shared",
          members: ["Admin", "Marie Dubois", "Sophie Laurent"],
          tags: ["RH", "politique", "employés"],
          color: "red",
          favorite: false,
          activity: [
            { user: "Admin", action: "ajouté", item: "Politique_Télétravail.pdf", time: "Il y a 3j" },
            { user: "Sophie Laurent", action: "lu", item: "Guide_Onboarding.docx", time: "Il y a 4j" },
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
          activity: [
            { user: "Pierre Durand", action: "uploadé", item: "Campagne_Q1.psd", time: "Il y a 4j" },
            { user: "Design Team", action: "approuvé", item: "Logo_V2.png", time: "Il y a 5j" },
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
      })
    }

    loadFolders()
  }, [])

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
    const colors = {
      blue: "text-blue-600 bg-blue-100",
      green: "text-green-600 bg-green-100",
      purple: "text-purple-600 bg-purple-100",
      orange: "text-orange-600 bg-orange-100",
      red: "text-red-600 bg-red-100",
      pink: "text-pink-600 bg-pink-100",
    }
    return colors[color as keyof typeof colors] || "text-gray-600 bg-gray-100"
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
          <Button size="sm">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterAccess("all")
                      setFilterOwner("all")
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
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
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
                              {folder.favorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
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
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
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
                    className={`relative group border rounded-lg p-6 hover:shadow-md transition-shadow ${
                      selectedFolders.includes(folder.id) ? "bg-blue-50 border-blue-200" : "bg-white"
                    }`}
                  >
                    <div className="absolute top-4 left-4">
                      <Checkbox
                        checked={selectedFolders.includes(folder.id)}
                        onCheckedChange={() => toggleFolderSelection(folder.id)}
                      />
                    </div>

                    <div className="absolute top-4 right-4 flex items-center space-x-1">
                      {folder.favorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
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

                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm">
                          <FolderOpen className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
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
                {searchTerm || filterAccess !== "all" || filterOwner !== "all"
                  ? "Essayez de modifier vos critères de recherche"
                  : "Commencez par créer votre premier dossier"}
              </p>
              <Button>
                <FolderPlus className="h-4 w-4 mr-2" />
                Nouveau dossier
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
