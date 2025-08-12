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
  FileText,
  Grid3X3,
  List,
  Search,
  Filter,
  Plus,
  Upload,
  Download,
  Share2,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  FolderOpen,
  Star,
  Clock,
  FileImage,
  FileSpreadsheet,
  FileVideo,
  Archive,
  SortAsc,
  SortDesc,
} from "lucide-react"

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [sortBy, setSortBy] = useState("modified")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterType, setFilterType] = useState("all")
  const [filterAuthor, setFilterAuthor] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const [documents, setDocuments] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    shared: 0,
    favorites: 0,
  })

  useEffect(() => {
    // Simuler le chargement des documents
    const loadDocuments = () => {
      const mockDocuments = [
        {
          id: 1,
          name: "Contrat_Client_ABC.pdf",
          type: "PDF",
          size: "2.4 MB",
          modified: new Date("2024-01-15T10:30:00"),
          created: new Date("2024-01-15T09:00:00"),
          author: "Marie Dubois",
          folder: "Contrats",
          tags: ["contrat", "client", "juridique"],
          shared: true,
          favorite: false,
          status: "recent",
          thumbnail: "/placeholder.svg?height=120&width=120&text=PDF",
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
          tags: ["rapport", "mensuel", "analyse"],
          shared: false,
          favorite: true,
          status: "modified",
          thumbnail: "/placeholder.svg?height=120&width=120&text=DOCX",
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
          tags: ["présentation", "projet", "alpha"],
          shared: true,
          favorite: false,
          status: "shared",
          thumbnail: "/placeholder.svg?height=120&width=120&text=PPTX",
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
          tags: ["budget", "2024", "finance"],
          shared: false,
          favorite: true,
          status: "normal",
          thumbnail: "/placeholder.svg?height=120&width=120&text=XLSX",
        },
        {
          id: 5,
          name: "Politique_Sécurité.pdf",
          type: "PDF",
          size: "1.1 MB",
          modified: new Date("2024-01-14T14:10:00"),
          created: new Date("2024-01-05T10:00:00"),
          author: "Admin",
          folder: "Politiques",
          tags: ["sécurité", "politique", "règlement"],
          shared: true,
          favorite: false,
          status: "important",
          thumbnail: "/placeholder.svg?height=120&width=120&text=PDF",
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
          tags: ["formation", "vidéo", "équipe"],
          shared: false,
          favorite: false,
          status: "normal",
          thumbnail: "/placeholder.svg?height=120&width=120&text=MP4",
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
          tags: ["logo", "design", "branding"],
          shared: true,
          favorite: true,
          status: "normal",
          thumbnail: "/placeholder.svg?height=120&width=120&text=PNG",
        },
        {
          id: 8,
          name: "Archive_2023.zip",
          type: "ZIP",
          size: "128 MB",
          modified: new Date("2024-01-10T09:00:00"),
          created: new Date("2024-01-10T09:00:00"),
          author: "Admin",
          folder: "Archives",
          tags: ["archive", "2023", "backup"],
          shared: false,
          favorite: false,
          status: "archived",
          thumbnail: "/placeholder.svg?height=120&width=120&text=ZIP",
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
        shared: mockDocuments.filter((doc) => doc.shared).length,
        favorites: mockDocuments.filter((doc) => doc.favorite).length,
      })
    }

    loadDocuments()
  }, [])

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "recent":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Nouveau</Badge>
      case "modified":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Modifié</Badge>
      case "shared":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Partagé</Badge>
      case "important":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Important</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Archivé</Badge>
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">Gérez vos documents et fichiers</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-sm font-medium text-gray-600">Partagés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.shared}</p>
              </div>
              <Share2 className="h-8 w-8 text-purple-600" />
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
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterType("all")
                      setFilterAuthor("all")
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
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
                <Button variant="outline" size="sm">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Déplacer
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
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
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
                          <div>
                            <span className="font-medium text-gray-900">{doc.name}</span>
                            {doc.favorite && <Star className="inline h-4 w-4 ml-2 text-yellow-500 fill-current" />}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{doc.type}</td>
                      <td className="py-3 px-4 text-gray-600">{doc.size}</td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(doc.modified)}</td>
                      <td className="py-3 px-4 text-gray-600">{doc.author}</td>
                      <td className="py-3 px-4 text-gray-600">{doc.folder}</td>
                      <td className="py-3 px-4">{getStatusBadge(doc.status)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
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
                    {doc.favorite && (
                      <div className="absolute top-2 right-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      </div>
                    )}

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
                      </div>

                      {getStatusBadge(doc.status) && (
                        <div className="flex justify-center">{getStatusBadge(doc.status)}</div>
                      )}

                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
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
                {searchTerm || filterType !== "all" || filterAuthor !== "all"
                  ? "Essayez de modifier vos critères de recherche"
                  : "Commencez par importer votre premier document"}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau document
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
