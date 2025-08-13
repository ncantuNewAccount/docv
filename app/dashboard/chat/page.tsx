"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageSquare,
  Search,
  Plus,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreHorizontal,
  Users,
  Circle,
  CheckCheck,
  Clock,
  File,
  Download,
  Brain,
  Shield,
  TrendingUp,
  CheckCircle,
  FileText,
  BarChart3,
  Zap,
} from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState("1")
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const searchParams = useSearchParams()
  const userId = searchParams.get("user")
  const messageType = searchParams.get("message")
  const groupType = searchParams.get("type")

  useEffect(() => {
    // Gérer les nouveaux messages depuis les autres pages
    if (messageType === "new") {
      if (userId) {
        // Message individuel
        const messageData = sessionStorage.getItem("newMessage")
        if (messageData) {
          const data = JSON.parse(messageData)
          console.log("Nouveau message individuel:", data)

          // Créer ou ouvrir la conversation avec cet utilisateur
          setSelectedConversation(userId)

          // Ajouter le message pré-rempli
          setNewMessage(`${data.subject ? `[${data.subject}] ` : ""}${data.content}`)

          // Nettoyer le sessionStorage
          sessionStorage.removeItem("newMessage")

          // Notification
          showNotification("info", `Conversation ouverte avec ${data.userName}`)
        }
      } else if (groupType === "group") {
        // Message de groupe
        const groupData = sessionStorage.getItem("newGroupMessage")
        if (groupData) {
          const data = JSON.parse(groupData)
          console.log("Nouveau message de groupe:", data)

          // Créer une nouvelle conversation de groupe
          const groupName = `Groupe (${data.users.length} membres)`
          setSelectedConversation("group-new")

          // Ajouter le message pré-rempli
          setNewMessage(`${data.subject ? `[${data.subject}] ` : ""}${data.content}`)

          // Nettoyer le sessionStorage
          sessionStorage.removeItem("newGroupMessage")

          // Notification
          showNotification("info", `Conversation de groupe créée avec ${data.users.length} utilisateur(s)`)
        }
      }
    }
  }, [userId, messageType, groupType])

  const showNotification = (type: "success" | "error" | "info", message: string) => {
    // Implémenter la notification (peut utiliser toast ou état local)
    console.log(`${type.toUpperCase()}: ${message}`)
  }

  const conversations = [
    {
      id: "1",
      name: "Marie Dubois",
      type: "direct",
      avatar: "MD",
      lastMessage: "Parfait, merci pour la validation !",
      lastMessageTime: "14:32",
      unreadCount: 0,
      isOnline: true,
      isTyping: false,
    },
    {
      id: "2",
      name: "Équipe Juridique",
      type: "group",
      avatar: "EJ",
      lastMessage: "IA DocV: Analyse terminée pour Contrat_Client_ABC.pdf",
      lastMessageTime: "13:45",
      unreadCount: 1,
      isOnline: false,
      isTyping: false,
      members: 5,
    },
    {
      id: "3",
      name: "Sophie Laurent",
      type: "direct",
      avatar: "SL",
      lastMessage: "Pouvez-vous m'envoyer le rapport ?",
      lastMessageTime: "12:20",
      unreadCount: 1,
      isOnline: false,
      isTyping: false,
    },
    {
      id: "4",
      name: "Direction",
      type: "group",
      avatar: "DIR",
      lastMessage: "Réunion reportée à demain 10h",
      lastMessageTime: "11:15",
      unreadCount: 0,
      isOnline: false,
      isTyping: false,
      members: 3,
    },
    {
      id: "5",
      name: "Thomas Rousseau",
      type: "direct",
      avatar: "TR",
      lastMessage: "Merci pour l'info !",
      lastMessageTime: "Hier",
      unreadCount: 0,
      isOnline: true,
      isTyping: true,
    },
  ]

  const messages = [
    {
      id: "1",
      senderId: "marie",
      senderName: "Marie Dubois",
      content: "Bonjour ! J'ai besoin de votre avis sur le nouveau contrat client.",
      timestamp: "14:20",
      type: "text",
      status: "read",
    },
    {
      id: "2",
      senderId: "me",
      senderName: "Moi",
      content: "Bien sûr, pouvez-vous me l'envoyer ?",
      timestamp: "14:22",
      type: "text",
      status: "read",
    },
    {
      id: "3",
      senderId: "marie",
      senderName: "Marie Dubois",
      content: "",
      timestamp: "14:25",
      type: "file",
      fileName: "Contrat_Client_ABC.pdf",
      fileSize: "2.3 MB",
      status: "read",
    },
    {
      id: "4",
      senderId: "me",
      senderName: "Moi",
      content: "J'ai relu le contrat, tout me semble correct. Les clauses de confidentialité sont bien définies.",
      timestamp: "14:30",
      type: "text",
      status: "read",
    },
    {
      id: "5",
      senderId: "marie",
      senderName: "Marie Dubois",
      content: "Parfait, merci pour la validation !",
      timestamp: "14:32",
      type: "text",
      status: "delivered",
    },
    {
      id: "6",
      senderId: "ai",
      senderName: "IA DocV",
      content: `📄 **Analyse IA du document "Contrat_Client_ABC.pdf"**

**Type de document :** PDF (2.3 MB)
**Statut :** ✅ Validé
**Dernière modification :** Il y a 2 heures

**📊 Analyse du contenu :**
• Document juridique détecté avec haute précision
• 3 tag(s) identifié(s) : contrat, client, juridique
• Résumé automatique disponible
• 47 pages analysées
• 12 clauses contractuelles détectées

**🎯 Métriques de qualité :**
• Lisibilité : 92%
• Conformité juridique : 100%
• Sécurité documentaire : Maximale
• Complétude des informations : 95%

**🔍 Points clés identifiés :**
• Durée du contrat : 12 mois
• Montant total : 150 000€ HT
• Clauses de confidentialité : ✅ Présentes et conformes
• Propriété intellectuelle : ✅ Bien définie
• Conditions de résiliation : ✅ Équilibrées

**🛡️ Analyse de conformité RGPD :**
• Données personnelles : ⚠️ Détectées (coordonnées client)
• Durée de conservation : Conforme (7 ans)
• Droit à l'oubli : Applicable après expiration
• Consentement : ✅ Explicite

**⚡ Recommandations :**
• ✅ Document prêt pour signature
• 📋 Archivage permanent recommandé
• 🔄 Révision suggérée dans 11 mois
• 📧 Notification client automatique activée

**📈 Score global : 94/100**

*Analyse générée automatiquement par l'IA DocV - Fiabilité : 98%*`,
      timestamp: "14:35",
      type: "ai_analysis",
      status: "delivered",
      analysisType: "document",
      documentName: "Contrat_Client_ABC.pdf",
      confidence: 98,
      processingTime: "2.3s",
    },
    {
      id: "7",
      senderId: "ai",
      senderName: "IA DocV",
      content: `🔍 **Analyse comparative - Dossier Contrats**

**📊 Analyse de 8 documents similaires :**
• Contrats clients : 5 documents
• Avenants : 2 documents  
• Conditions générales : 1 document

**📈 Tendances identifiées :**
• Montant moyen des contrats : +15% vs trimestre précédent
• Durée moyenne : 14 mois (stable)
• Taux de renouvellement : 87% (↗️ +5%)

**⚠️ Points d'attention :**
• 2 contrats expirent dans les 30 jours
• 1 clause de révision tarifaire à activer
• Mise à jour RGPD requise sur 3 documents

**🎯 Actions recommandées :**
1. Planifier renouvellement contrats Q1 2024
2. Standardiser les clauses de confidentialité
3. Créer un modèle basé sur ce contrat (performance optimale)

*Analyse prédictive activée - Prochaine révision : 15 février 2024*`,
      timestamp: "14:37",
      type: "ai_analysis",
      status: "delivered",
      analysisType: "comparative",
      confidence: 95,
      processingTime: "4.1s",
    },
  ]

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const currentConversation = conversations.find((conv) => conv.id === selectedConversation)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Ici on ajouterait la logique pour envoyer le message
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Clock className="h-3 w-3 text-gray-400" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return null
    }
  }

  const getAnalysisIcon = (analysisType: string) => {
    switch (analysisType) {
      case "document":
        return <FileText className="h-4 w-4" />
      case "comparative":
        return <BarChart3 className="h-4 w-4" />
      case "security":
        return <Shield className="h-4 w-4" />
      case "performance":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const renderAIMessage = (message: any) => {
    return (
      <div className="flex justify-start">
        <div className="max-w-4xl">
          {/* AI Header */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">IA DocV</span>
              <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200 text-xs">
                {getAnalysisIcon(message.analysisType)}
                <span className="ml-1">
                  {message.analysisType === "document"
                    ? "Analyse Document"
                    : message.analysisType === "comparative"
                      ? "Analyse Comparative"
                      : "Analyse IA"}
                </span>
              </Badge>
              {message.confidence && (
                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {message.confidence}% fiable
                </Badge>
              )}
            </div>
          </div>

          {/* AI Message Content */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 shadow-sm">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-line text-gray-800 leading-relaxed">{message.content}</div>
            </div>

            {/* AI Message Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-purple-200">
              <div className="flex items-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3" />
                  <span>Traité en {message.processingTime}</span>
                </div>
                {message.documentName && (
                  <div className="flex items-center space-x-1">
                    <FileText className="h-3 w-3" />
                    <span>{message.documentName}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-purple-600">{message.timestamp}</span>
                <div>{getStatusIcon(message.status)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Sidebar - Conversations */}
      <div className="w-80 border-r bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Button size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher une conversation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedConversation === conversation.id ? "bg-blue-50 border-r-2 border-blue-500" : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    {conversation.type === "group" ? (
                      <Users className="h-6 w-6 text-blue-600" />
                    ) : (
                      <span className="text-blue-600 font-medium">{conversation.avatar}</span>
                    )}
                  </div>
                  {conversation.isOnline && conversation.type === "direct" && (
                    <Circle className="absolute -bottom-1 -right-1 h-4 w-4 text-green-500 fill-current" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                    <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.isTyping ? (
                        <span className="text-blue-600 italic">En train d'écrire...</span>
                      ) : (
                        <span
                          className={conversation.lastMessage.includes("IA DocV:") ? "text-purple-600 font-medium" : ""}
                        >
                          {conversation.lastMessage}
                        </span>
                      )}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge
                        className={`text-white text-xs px-2 py-1 rounded-full ${
                          conversation.lastMessage.includes("IA DocV:") ? "bg-purple-600" : "bg-blue-600"
                        }`}
                      >
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                  {conversation.type === "group" && (
                    <p className="text-xs text-gray-500 mt-1">{conversation.members} membres</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {currentConversation.type === "group" ? (
                        <Users className="h-5 w-5 text-blue-600" />
                      ) : (
                        <span className="text-blue-600 font-medium">{currentConversation.avatar}</span>
                      )}
                    </div>
                    {currentConversation.isOnline && currentConversation.type === "direct" && (
                      <Circle className="absolute -bottom-1 -right-1 h-3 w-3 text-green-500 fill-current" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{currentConversation.name}</h3>
                    <p className="text-sm text-gray-500">
                      {currentConversation.type === "group"
                        ? `${currentConversation.members} membres`
                        : currentConversation.isOnline
                          ? "En ligne"
                          : "Hors ligne"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div key={message.id}>
                  {message.type === "ai_analysis" ? (
                    renderAIMessage(message)
                  ) : (
                    <div className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === "me" ? "bg-blue-600 text-white" : "bg-white text-gray-900 shadow-sm"
                        }`}
                      >
                        {message.type === "text" ? (
                          <p className="text-sm">{message.content}</p>
                        ) : message.type === "file" ? (
                          <div className="flex items-center space-x-3 p-2">
                            <File className="h-8 w-8 text-gray-400" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{message.fileName}</p>
                              <p className="text-xs text-gray-500">{message.fileSize}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : null}
                        <div
                          className={`flex items-center justify-between mt-1 ${
                            message.senderId === "me" ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          <span className="text-xs">{message.timestamp}</span>
                          {message.senderId === "me" && <div className="ml-2">{getStatusIcon(message.status)}</div>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-end space-x-2">
                <Button variant="outline" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <Textarea
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    rows={1}
                    className="resize-none"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez une conversation</h3>
              <p className="text-gray-600">Choisissez une conversation pour commencer à discuter</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
