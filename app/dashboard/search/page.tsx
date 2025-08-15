"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  FileText,
  Folder,
  Tag,
  Clock,
  Eye,
  Download,
  Share2,
  Star,
  ChevronUp,
  Zap,
  Target,
  BookOpen,
  ImageIcon,
  FileSpreadsheet,
  FileVideo,
  Archive,
  MoreHorizontal,
  X,
  SortAsc,
  SortDesc,
} from "lucide-react"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [advancedSearch, setAdvancedSearch] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchStats, setSearchStats] = useState({
    total: 0,
    documents: 0,
    folders: 0,
    searchTime: 0,
  })

  // Advanced search filters
  const [filters, setFilters] = useState({
    fileType: "all",
    dateRange: "all",
    author: "all",
    folder: "all",
    tags: "",
    content: "",
    exactPhrase: "",
    excludeWords: "",
    minSize: "",
    maxSize: "",
  })

  const [sortBy, setSortBy] = useState("relevance")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedResults, setSelectedResults] = useState<number[]>([])

  useEffect(() => {
    // Simuler une recherche automatique si il y a une query
    if (searchQuery.trim()) {
      performSearch()
    } else {
      setSearchResults([])
      setSearchStats({ total: 0, documents: 0, folders: 0, searchTime: 0 })
    }
  }, [searchQuery, filters, sortBy, sortOrder])

  const performSearch = async () => {
    setIsSearching(true)
    const startTime = Date.now()

    // Simuler un délai de recherche
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Données de démonstration pour les résultats de recherche
    const mockResults = [
      {
        id: 1,
        type: "document",
        name: "Contrat_Client_ABC.pdf",
        path: "/Contrats/Clients/",
        content: "Contrat de prestation de services avec le client ABC Corporation...",
        size: "2.4 MB",
        modified: new Date("2024-01-15T10:30:00"),
        author: "Marie Dubois",
        tags: ["contrat", "client", "juridique"],
        relevance: 95,
        highlights: ["Contrat", "client ABC", "prestation de services"],
        fileType: "PDF",
        thumbnail: "/placeholder.svg?height=60&width=60&text=PDF",
      },
      {
        id: 2,
        type: "folder",
        name: "Projets Alpha",
        path: "/Projets/",
        content: "Dossier contenant tous les documents du projet Alpha",
        documentsCount: 23,
        modified: new Date("2024-01-14T16:45:00"),
        author: "Jean Martin",
        tags: ["projet", "alpha", "développement"],
        relevance: 88,
        highlights: ["Projet Alpha", "développement"],
      },
      {
        id: 3,
        type: "document",
        name: "Rapport_Mensuel_Nov.docx",
        path: "/Rapports/2024/",
        content: "Rapport mensuel de novembre avec analyse des performances...",
        size: "1.8 MB",
        modified: new Date("2024-01-13T08:45:00"),
        author: "Sophie Laurent",
        tags: ["rapport", "mensuel", "analyse"],
        relevance: 82,
        highlights: ["Rapport mensuel", "novembre", "performances"],
        fileType: "DOCX",
        thumbnail: "/placeholder.svg?height=60&width=60&text=DOCX",
      },
      {
        id: 4,
        type: "document",
        name: "Budget_2024.xlsx",
        path: "/Finance/Budgets/",
        content: "Budget prévisionnel pour l'année 2024 avec détail par département...",
        size: "892 KB",
        modified: new Date("2024-01-12T14:20:00"),
        author: "Marie Dubois",
        tags: ["budget", "2024", "finance"],
        relevance: 76,
        highlights: ["Budget", "2024", "prévisionnel"],
        fileType: "XLSX",
        thumbnail: "/placeholder.svg?height=60&width=60&text=XLSX",
      },
      {
        id: 5,
        type: "document",
        name: "Présentation_Projet.pptx",
        path: "/Projets/Alpha/",
        content: "Présentation du projet Alpha pour le comité de direction...",
        size: "5.2 MB",
        modified: new Date("2024-01-11T07:15:00"),
        author: "Jean Martin",
        tags: ["présentation", "projet", "alpha"],
        relevance: 71,
        highlights: ["Présentation", "projet Alpha", "comité"],
        fileType: "PPTX",
        thumbnail: "/placeholder.svg?height=60&width=60&text=PPTX",
      },
      {
        id: 6,
        type: "document",
        name: "Formation_Équipe.mp4",
        path: "/Formation/Vidéos/",
        content: "Vidéo de formation pour l'équipe sur les nouvelles procédures...",
        size: "45.2 MB",
        modified: new Date("2024-01-10T11:30:00"),
        author: "Pierre Durand",
        tags: ["formation", "vidéo", "équipe"],
        relevance: 65,
        highlights: ["Formation", "équipe", "procédures"],
        fileType: "MP4",
        thumbnail: "/placeholder.svg?height=60&width=60&text=MP4",
      },
    ]

    // Filtrer les résultats selon les critères
    let filteredResults = mockResults.filter((result) => {
      if (
        !result.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !result.content.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      if (
        filters.fileType !== "all" &&
        result.type === "document" &&
        result.fileType?.toLowerCase() !== filters.fileType.toLowerCase()
      ) {
        return false
      }

      if (filters.author !== "all" && result.author !== filters.author) {
        return false
      }

      return true
    })

    // Trier les résultats
    filteredResults = filteredResults.sort((a, b) => {
      let aValue, bValue
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "date":
          aValue = a.modified.getTime()
          bValue = b.modified.getTime()
          break
        case "author":
          aValue = a.author.toLowerCase()
          bValue = b.author.toLowerCase()
          break
        case "relevance":
        default:
          aValue = a.relevance
          bValue = b.relevance
          break
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    const endTime = Date.now()
    const searchTime = (endTime - startTime) / 1000

    setSearchResults(filteredResults)
    setSearchStats({
      total: filteredResults.length,
      documents: filteredResults.filter((r) => r.type === "document").length,
      folders: filteredResults.filter((r) => r.type === "folder").length,
      searchTime,
    })
    setIsSearching(false)
  }

  const getFileIcon = (type: string) => {
    switch (type?.toLowerCase()) {
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
        return <ImageIcon className="h-5 w-5 text-purple-600" />
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

  const highlightText = (text: string, highlights: string[]) => {
    let highlightedText = text
    highlights.forEach((highlight) => {
      const regex = new RegExp(`(${highlight})`, "gi")
      highlightedText = highlightedText.replace(regex, "<mark class='bg-yellow-200'>$1</mark>")
    })
    return highlightedText
  }

  const toggleResultSelection = (resultId: number) => {
    setSelectedResults((prev) => (prev.includes(resultId) ? prev.filter((id) => id !== resultId) : [...prev, resultId]))
  }

  const clearFilters = () => {
    setFilters({
      fileType: "all",
      dateRange: "all",
      author: "all",
      folder: "all",
      tags: "",
      content: "",
      exactPhrase: "",
      excludeWords: "",
      minSize: "",
      maxSize: "",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recherche</h1>
          <p className="text-gray-600 mt-1">Trouvez rapidement vos documents et dossiers</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant="outline"
            onClick={() => setAdvancedSearch(!advancedSearch)}
            className={advancedSearch ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
          >
            <Target className="h-4 w-4 mr-2" />
            Recherche avancée
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Rechercher dans tous vos documents et dossiers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-lg h-12"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setSearchQuery("contrat")} className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                Contrats
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSearchQuery("rapport")} className="text-xs">
                <BookOpen className="h-3 w-3 mr-1" />
                Rapports
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSearchQuery("budget")} className="text-xs">
                <Target className="h-3 w-3 mr-1" />
                Budgets
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSearchQuery("projet")} className="text-xs">
                <Folder className="h-3 w-3 mr-1" />
                Projets
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Search */}
      {advancedSearch && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Recherche avancée
              </span>
              <Button variant="ghost" size="sm" onClick={() => setAdvancedSearch(false)}>
                <ChevronUp className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="fileType" className="text-sm font-medium">
                  Type de fichier
                </Label>
                <Select value={filters.fileType} onValueChange={(value) => setFilters({ ...filters, fileType: value })}>
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
                <Label htmlFor="dateRange" className="text-sm font-medium">
                  Période
                </Label>
                <Select
                  value={filters.dateRange}
                  onValueChange={(value) => setFilters({ ...filters, dateRange: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les dates</SelectItem>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                    <SelectItem value="year">Cette année</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="author" className="text-sm font-medium">
                  Auteur
                </Label>
                <Select value={filters.author} onValueChange={(value) => setFilters({ ...filters, author: value })}>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exactPhrase" className="text-sm font-medium">
                  Phrase exacte
                </Label>
                <Input
                  id="exactPhrase"
                  placeholder="Rechercher cette phrase exacte"
                  value={filters.exactPhrase}
                  onChange={(e) => setFilters({ ...filters, exactPhrase: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="excludeWords" className="text-sm font-medium">
                  Exclure les mots
                </Label>
                <Input
                  id="excludeWords"
                  placeholder="Mots à exclure (séparés par des espaces)"
                  value={filters.excludeWords}
                  onChange={(e) => setFilters({ ...filters, excludeWords: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tags" className="text-sm font-medium">
                Tags
              </Label>
              <Input
                id="tags"
                placeholder="Rechercher par tags (séparés par des virgules)"
                value={filters.tags}
                onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-sm font-medium">
                Contenu du document
              </Label>
              <Textarea
                id="content"
                placeholder="Rechercher dans le contenu des documents..."
                value={filters.content}
                onChange={(e) => setFilters({ ...filters, content: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={clearFilters}>
                Réinitialiser
              </Button>
              <Button onClick={performSearch}>
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Stats */}
      {searchQuery && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">
                    {isSearching ? "Recherche en cours..." : `${searchStats.total} résultats trouvés`}
                  </span>
                  {!isSearching && searchStats.searchTime > 0 && (
                    <span className="text-xs text-gray-500">({searchStats.searchTime.toFixed(2)}s)</span>
                  )}
                </div>

                {!isSearching && searchStats.total > 0 && (
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span>{searchStats.documents} documents</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Folder className="h-4 w-4" />
                      <span>{searchStats.folders} dossiers</span>
                    </div>
                  </div>
                )}
              </div>

              {!isSearching && searchResults.length > 0 && (
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
                        <SelectItem value="relevance">Pertinence</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="name">Nom</SelectItem>
                        <SelectItem value="author">Auteur</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    >
                      {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions */}
      {selectedResults.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">
                  {selectedResults.length} résultat{selectedResults.length > 1 ? "s" : ""} sélectionné
                  {selectedResults.length > 1 ? "s" : ""}
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
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {searchResults.map((result) => (
                <div key={result.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      checked={selectedResults.includes(result.id)}
                      onCheckedChange={() => toggleResultSelection(result.id)}
                    />

                    <div className="flex-shrink-0">
                      {result.type === "document" ? (
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg">
                          {getFileIcon(result.fileType)}
                        </div>
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
                          <Folder className="h-6 w-6 text-blue-600" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                            {result.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                            <span>{result.path}</span>
                            {result.type === "document" && (
                              <>
                                <span>•</span>
                                <span>{result.size}</span>
                              </>
                            )}
                            {result.type === "folder" && (
                              <>
                                <span>•</span>
                                <span>{result.documentsCount} documents</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{formatDate(result.modified)}</span>
                            <span>•</span>
                            <span>{result.author}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {result.relevance}% pertinent
                          </Badge>
                          <div className="flex items-center space-x-1">
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

                      <p
                        className="mt-2 text-sm text-gray-600 line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(result.content, result.highlights),
                        }}
                      />

                      {result.tags && result.tags.length > 0 && (
                        <div className="flex items-center space-x-2 mt-3">
                          <Tag className="h-4 w-4 text-gray-400" />
                          <div className="flex flex-wrap gap-1">
                            {result.tags.map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.highlights && result.highlights.length > 0 && (
                        <div className="mt-3 text-xs text-gray-500">
                          <span className="font-medium">Mots-clés trouvés:</span> {result.highlights.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {searchQuery && !isSearching && searchResults.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-600 mb-4">
              Aucun document ou dossier ne correspond à votre recherche "{searchQuery}"
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Suggestions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Vérifiez l'orthographe de vos mots-clés</li>
                <li>Essayez des termes plus généraux</li>
                <li>Utilisez la recherche avancée pour affiner vos critères</li>
                <li>Recherchez dans le contenu des documents avec l'OCR</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!searchQuery && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Recherche intelligente</h3>
            <p className="text-gray-600 mb-6">
              Trouvez rapidement vos documents et dossiers grâce à notre moteur de recherche avancé
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Recherche rapide</h4>
                </div>
                <p className="text-sm text-blue-700">Recherchez par nom de fichier, contenu, auteur ou tags</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium text-green-900">Filtres avancés</h4>
                </div>
                <p className="text-sm text-green-700">Affinez votre recherche par type, date, taille et plus</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  <h4 className="font-medium text-purple-900">Recherche OCR</h4>
                </div>
                <p className="text-sm text-purple-700">Recherchez dans le contenu des images et documents scannés</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <h4 className="font-medium text-orange-900">Historique</h4>
                </div>
                <p className="text-sm text-orange-700">Accédez à vos recherches récentes et sauvegardées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
