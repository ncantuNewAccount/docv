import { v4 as uuidv4 } from "uuid"
import { IframeReference } from "./IframeReference"
import { EventBus } from "./EventBus"
import { UserStore } from "./UserStore"
import { MockService } from "./MockService"

/**
 * MessageBus - Passerelle de communication avec l'iframe 4NK
 * Supporte le mode mock avec l'identifiant d'entreprise "1234"
 */
export class MessageBus {
  private static instance: MessageBus | null = null
  private origin: string
  private eventBus: EventBus
  private userStore: UserStore
  private mockService: MockService
  private errors: Map<string, any> = new Map()
  private isMockMode = false

  private constructor(origin: string) {
    this.origin = origin
    this.eventBus = EventBus.getInstance()
    this.userStore = UserStore.getInstance()
    this.mockService = MockService.getInstance()

    console.log("🔧 MessageBus initialized with origin:", origin)
  }

  static getInstance(origin: string): MessageBus {
    if (!MessageBus.instance) {
      MessageBus.instance = new MessageBus(origin)
    }
    return MessageBus.instance
  }

  // Activer le mode mock
  enableMockMode(): void {
    this.isMockMode = true
    console.log("🎭 Mock mode enabled")
  }

  // Désactiver le mode mock
  disableMockMode(): void {
    this.isMockMode = false
    this.mockService.disconnect()
    console.log("🎭 Mock mode disabled")
  }

  isInMockMode(): boolean {
    return this.isMockMode
  }

  private getOriginFromUrl(url: string): string {
    try {
      const urlObj = new URL(url)
      return `${urlObj.protocol}//${urlObj.host}`
    } catch (error) {
      console.error("Invalid URL:", url)
      return url
    }
  }

  private sendMessage(type: string, data: any = {}, timeoutMs = 30000): Promise<any> {
    // Si en mode mock, utiliser le service mock
    if (this.isMockMode) {
      return this.handleMockMessage(type, data)
    }

    return new Promise((resolve, reject) => {
      const messageId = uuidv4()
      const iframe = IframeReference.getIframe()

      if (!iframe || !iframe.contentWindow) {
        reject(new Error("Iframe not available"))
        return
      }

      const targetOrigin = this.getOriginFromUrl(this.origin)

      // Construire le message selon le protocole 4NK
      const message: any = {
        type,
        messageId,
        timestamp: Date.now(),
        ...data,
      }

      // Ajouter l'accessToken pour tous les messages sauf REQUEST_LINK
      if (type !== "REQUEST_LINK") {
        const accessToken = this.userStore.getAccessToken()
        if (accessToken) {
          message.accessToken = accessToken
        }
      }

      console.log(`📤 Sending message ${type} to origin:`, targetOrigin)
      console.log(`📤 Message data:`, {
        type,
        messageId,
        hasAccessToken: !!message.accessToken,
      })

      const cleanup = this.initMessageListener(messageId, resolve, reject, timeoutMs)

      // Essayer d'envoyer le message avec plusieurs stratégies
      const sendStrategies = [
        () => iframe.contentWindow!.postMessage(message, targetOrigin),
        () => iframe.contentWindow!.postMessage(message, "*"),
      ]

      let strategyIndex = 0
      const trySend = () => {
        if (strategyIndex >= sendStrategies.length) {
          cleanup()
          reject(new Error("Impossible d'envoyer le message après plusieurs tentatives"))
          return
        }

        try {
          sendStrategies[strategyIndex]()
          console.log(`✅ Message sent with strategy ${strategyIndex + 1}`)
        } catch (error) {
          console.error(`❌ Strategy ${strategyIndex + 1} failed:`, error)
          strategyIndex++
          setTimeout(trySend, 500)
        }
      }

      trySend()
    })
  }

  private async handleMockMessage(type: string, data: any): Promise<any> {
    console.log(`🎭 Handling mock message: ${type}`)

    switch (type) {
      case "REQUEST_LINK":
        const tokens = await this.mockService.mockRequestLink()
        return {
          type: "LINK_ACCEPTED",
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        }

      case "GET_PAIRING_ID":
        const pairingId = await this.mockService.mockGetUserPairingId()
        return {
          type: "GET_PAIRING_ID",
          userPairingId: pairingId,
        }

      case "GET_PROCESSES":
        const processes = await this.mockService.mockGetProcesses()
        return {
          type: "PROCESSES_RETRIEVED",
          processes,
        }

      case "GET_MY_PROCESSES":
        const myProcesses = await this.mockService.mockGetMyProcesses()
        return {
          type: "GET_MY_PROCESSES",
          myProcesses,
        }

      case "RETRIEVE_DATA":
        const processData = await this.mockService.mockGetData(data.processId, data.stateId)
        return {
          type: "DATA_RETRIEVED",
          data: processData,
        }

      case "CREATE_PROCESS":
        const created = await this.mockService.mockCreateProcess(data.processData, data.privateFields, data.roles)
        return {
          type: "PROCESS_CREATED",
          processCreated: created,
        }

      case "NOTIFY_UPDATE":
        await this.mockService.mockNotifyProcessUpdate(data.processId, data.stateId)
        return {
          type: "UPDATE_NOTIFIED",
        }

      case "VALIDATE_STATE":
        const validated = await this.mockService.mockValidateState(data.processId, data.stateId)
        return {
          type: "STATE_VALIDATED",
          validatedProcess: validated,
        }

      case "VALIDATE_TOKEN":
        const isValid = await this.mockService.mockValidateToken()
        return {
          type: "VALIDATE_TOKEN",
          isValid,
        }

      case "RENEW_TOKEN":
        const newTokens = await this.mockService.mockRenewToken()
        return {
          type: "RENEW_TOKEN",
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
        }

      default:
        throw new Error(`Mock message type not implemented: ${type}`)
    }
  }

  private initMessageListener(messageId: string, resolve: Function, reject: Function, timeoutMs: number): () => void {
    const timeout = setTimeout(() => {
      cleanup()
      reject(new Error(`Timeout: Aucune réponse après ${timeoutMs / 1000} secondes`))
    }, timeoutMs)

    const handleMessage = (event: MessageEvent) => {
      console.log(
        "📥 Received message from:",
        event.origin,
        "Type:",
        event.data.type,
        "MessageId:",
        event.data.messageId,
      )

      // Accepter les messages de domaines 4NK ou localhost
      const is4NKOrigin =
        event.origin.includes("4nk") ||
        event.origin.includes("localhost") ||
        event.origin.includes("127.0.0.1") ||
        event.origin === "null" // Pour les iframes en mode file://

      if (!is4NKOrigin) {
        console.log("🚫 Message ignored - not from 4NK origin:", event.origin)
        return
      }

      if (event.data.messageId !== messageId) {
        console.log("🚫 Message ignored - messageId mismatch")
        return
      }

      cleanup()

      // Gérer les erreurs selon le protocole 4NK
      if (event.data.type === "ERROR") {
        console.error("❌ Received error:", event.data.error)
        reject(new Error(event.data.error || "Unknown error"))
      } else {
        console.log("✅ Message processed successfully:", event.data.type)
        resolve(event.data)
      }
    }

    const cleanup = () => {
      clearTimeout(timeout)
      window.removeEventListener("message", handleMessage)
    }

    window.addEventListener("message", handleMessage)
    return cleanup
  }

  // Méthodes d'authentification
  async isReady(): Promise<void> {
    if (this.isMockMode) {
      console.log("🎭 Mock mode - iframe ready")
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const iframe = IframeReference.getIframe()

      if (!iframe || !iframe.contentWindow) {
        reject(new Error("Iframe not available"))
        return
      }

      const targetOrigin = this.getOriginFromUrl(this.origin)
      console.log("🔍 Waiting for LISTENING message from iframe...")

      // Timeout de 45 secondes pour isReady
      const timeout = setTimeout(() => {
        cleanup()
        reject(new Error("Timeout: L'iframe 4NK n'a pas envoyé le message LISTENING après 45 secondes."))
      }, 45000)

      const cleanup = () => {
        clearTimeout(timeout)
        window.removeEventListener("message", handleMessage)
      }

      const handleMessage = (event: MessageEvent) => {
        console.log("📥 Ready check - received from:", event.origin, "Type:", event.data.type)

        // Accepter les messages de domaines 4NK
        const is4NKOrigin =
          event.origin.includes("4nk") ||
          event.origin.includes("localhost") ||
          event.origin.includes("127.0.0.1") ||
          event.origin === "null"

        if (!is4NKOrigin) {
          console.log("🚫 Ready check ignored - not from 4NK origin")
          return
        }

        if (event.data.type === "LISTENING") {
          console.log("✅ Iframe is ready and listening!")
          cleanup()
          resolve()
        }
      }

      window.addEventListener("message", handleMessage)
    })
  }

  async requestLink(): Promise<void> {
    console.log("🔐 Requesting authentication link...")

    const response = await this.sendMessage("REQUEST_LINK", {}, 60000)

    console.log("📥 Received response:", response)

    if (response.type === "LINK_ACCEPTED") {
      console.log("✅ Authentication link accepted")

      // Vérifier que nous avons bien reçu les tokens
      if (!response.accessToken || !response.refreshToken) {
        throw new Error("Tokens manquants dans la réponse LINK_ACCEPTED")
      }

      // Stocker les tokens en sessionStorage selon le protocole
      this.userStore.connect(response.accessToken, response.refreshToken)

      console.log("💾 Tokens stored in sessionStorage")
    } else {
      console.error("❌ Authentication failed:", response)
      throw new Error(`Authentication failed: expected LINK_ACCEPTED, got ${response.type}`)
    }
  }

  async getUserPairingId(): Promise<string> {
    console.log("🆔 Getting user pairing ID...")
    const response = await this.sendMessage("GET_PAIRING_ID", {}, 30000)

    if (response.type !== "GET_PAIRING_ID") {
      throw new Error(`Unexpected response type: ${response.type}`)
    }

    const pairingId = response.userPairingId
    this.userStore.pair(pairingId)
    console.log("✅ User pairing ID retrieved:", pairingId?.slice(0, 8) + "...")
    return pairingId
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await this.sendMessage(
        "VALIDATE_TOKEN",
        {
          accessToken: this.userStore.getAccessToken(),
          refreshToken: this.userStore.getRefreshToken(),
        },
        15000,
      )

      return response.isValid === true
    } catch {
      return false
    }
  }

  async renewToken(): Promise<void> {
    const response = await this.sendMessage(
      "RENEW_TOKEN",
      {
        refreshToken: this.userStore.getRefreshToken(),
      },
      30000,
    )

    if (response.type === "RENEW_TOKEN") {
      this.userStore.connect(response.accessToken, response.refreshToken)
    } else {
      throw new Error("Failed to renew token")
    }
  }

  // Méthodes de gestion des process
  async getProcesses(): Promise<any> {
    const response = await this.sendMessage("GET_PROCESSES", {}, 20000)

    if (response.type !== "PROCESSES_RETRIEVED") {
      throw new Error(`Unexpected response type: ${response.type}`)
    }

    return response.processes
  }

  async getMyProcesses(): Promise<string[]> {
    const response = await this.sendMessage("GET_MY_PROCESSES", {}, 20000)

    if (response.type !== "GET_MY_PROCESSES") {
      throw new Error(`Unexpected response type: ${response.type}`)
    }

    return response.myProcesses || []
  }

  async getData(processId: string, stateId: string): Promise<Record<string, any>> {
    const response = await this.sendMessage("RETRIEVE_DATA", { processId, stateId }, 20000)

    if (response.type !== "DATA_RETRIEVED") {
      throw new Error(`Unexpected response type: ${response.type}`)
    }

    return response.data
  }

  async createProfile(profileData: any, privateFields: string[], roles: any): Promise<any> {
    const response = await this.sendMessage(
      "CREATE_PROCESS",
      {
        processData: profileData,
        privateFields,
        roles,
      },
      30000,
    )

    if (response.type !== "PROCESS_CREATED") {
      throw new Error(`Unexpected response type: ${response.type}`)
    }

    return response.processCreated
  }

  async createFolder(folderData: any, privateFields: string[], roles: any): Promise<any> {
    const response = await this.sendMessage(
      "CREATE_PROCESS",
      {
        processData: folderData,
        privateFields,
        roles,
      },
      30000,
    )

    if (response.type !== "PROCESS_CREATED") {
      throw new Error(`Unexpected response type: ${response.type}`)
    }

    return response.processCreated
  }

  async updateProcess(
    processId: string,
    lastStateId: string,
    newData: any,
    privateFields: string[],
    roles: any,
  ): Promise<any> {
    const response = await this.sendMessage(
      "UPDATE_PROCESS",
      {
        processId,
        newData,
        privateFields,
        roles,
      },
      30000,
    )

    if (response.type !== "PROCESS_UPDATED") {
      throw new Error(`Unexpected response type: ${response.type}`)
    }

    return response.updatedProcess
  }

  async notifyProcessUpdate(processId: string, stateId: string): Promise<void> {
    const response = await this.sendMessage("NOTIFY_UPDATE", { processId, stateId }, 15000)

    if (response.type !== "UPDATE_NOTIFIED") {
      throw new Error(`Unexpected response type: ${response.type}`)
    }
  }

  async validateState(processId: string, stateId: string): Promise<any> {
    const response = await this.sendMessage("VALIDATE_STATE", { processId, stateId }, 20000)

    if (response.type !== "STATE_VALIDATED") {
      throw new Error(`Unexpected response type: ${response.type}`)
    }

    return response.validatedProcess
  }

  // Méthodes utilitaires supplémentaires
  async decodePublicData(encodedData: number[]): Promise<any> {
    const response = await this.sendMessage("DECODE_PUBLIC_DATA", { encodedData }, 15000)

    if (response.type !== "PUBLIC_DATA_DECODED") {
      throw new Error(`Unexpected response type: ${response.type}`)
    }

    return response.decodedData
  }

  async hashValue(commitedIn: string, label: string, fileBlob: any): Promise<string> {
    const response = await this.sendMessage("HASH_VALUE", { commitedIn, label, fileBlob }, 15000)

    if (response.type !== "VALUE_HASHED") {
      throw new Error(`Unexpected response type: ${response.type}`)
    }

    return response.hash
  }

  async getMerkleProof(processState: any, attributeName: string): Promise<any> {
    const response = await this.sendMessage("GET_MERKLE_PROOF", { processState, attributeName }, 15000)

    if (response.type !== "MERKLE_PROOF_RETRIEVED") {
      throw new Error(`Unexpected response type: ${response.type}`)
    }

    return response.proof
  }

  async validateMerkleProof(merkleProof: string, documentHash: string): Promise<boolean> {
    const response = await this.sendMessage("VALIDATE_MERKLE_PROOF", { merkleProof, documentHash }, 15000)

    if (response.type !== "MERKLE_PROOF_VALIDATED") {
      throw new Error(`Unexpected response type: ${response.type}`)
    }

    return response.isValid
  }

  // Méthodes spécifiques au mock
  getMockStats() {
    if (this.isMockMode) {
      return this.mockService.getMockStats()
    }
    return null
  }

  getMockRecentActivity() {
    if (this.isMockMode) {
      return this.mockService.getMockRecentActivity()
    }
    return null
  }
}
