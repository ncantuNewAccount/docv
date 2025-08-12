import { v4 as uuidv4 } from "uuid"
import { IframeReference } from "./IframeReference"
import { EventBus } from "./EventBus"
import { UserStore } from "./UserStore"

/**
 * MessageBus - Passerelle de communication avec l'iframe 4NK
 * Gère l'authentification, les process et la corrélation des messages
 */
export class MessageBus {
  private static instance: MessageBus | null = null
  private origin: string
  private eventBus: EventBus
  private userStore: UserStore
  private errors: Map<string, any> = new Map()

  private constructor(origin: string) {
    this.origin = origin
    this.eventBus = EventBus.getInstance()
    this.userStore = UserStore.getInstance()

    console.log("🔧 MessageBus initialized with origin:", origin)
  }

  static getInstance(origin: string): MessageBus {
    if (!MessageBus.instance) {
      MessageBus.instance = new MessageBus(origin)
    }
    return MessageBus.instance
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

  private sendMessage(type: string, data: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const correlationId = uuidv4()
      const iframe = IframeReference.getIframe()

      if (!iframe || !iframe.contentWindow) {
        reject(new Error("Iframe not available"))
        return
      }

      const accessToken = this.userStore.getAccessToken()
      const targetOrigin = this.getOriginFromUrl(this.origin)

      const message = {
        type,
        correlationId,
        accessToken,
        ...data,
      }

      console.log(`📤 Sending message ${type} to origin:`, targetOrigin)

      const cleanup = this.initMessageListener(correlationId, resolve, reject)

      try {
        iframe.contentWindow.postMessage(message, targetOrigin)
      } catch (error) {
        console.error("❌ PostMessage error:", error)
        console.log("🔄 Trying with wildcard origin...")

        try {
          iframe.contentWindow.postMessage(message, "*")
        } catch (fallbackError) {
          cleanup()
          reject(new Error(`Communication failed: ${error.message}`))
        }
      }
    })
  }

  private initMessageListener(correlationId: string, resolve: Function, reject: Function): () => void {
    const handleMessage = (event: MessageEvent) => {
      console.log("📥 Received message from:", event.origin, "Type:", event.data.type)

      // Accepter les messages de domaines 4NK
      const is4NKOrigin = event.origin.includes("4nk") || event.origin.includes("localhost")

      if (!is4NKOrigin) {
        console.log("🚫 Message ignored - not from 4NK origin")
        return
      }

      if (event.data.correlationId !== correlationId) {
        console.log("🚫 Message ignored - correlation ID mismatch")
        return
      }

      cleanup()

      if (event.data.type?.startsWith("ERROR_")) {
        console.error("❌ Received error:", event.data.message)
        reject(new Error(event.data.message || "Unknown error"))
      } else {
        console.log("✅ Message processed successfully")
        resolve(event.data)
      }
    }

    const cleanup = () => {
      window.removeEventListener("message", handleMessage)
    }

    window.addEventListener("message", handleMessage)
    return cleanup
  }

  // Méthodes d'authentification
  async isReady(): Promise<void> {
    return new Promise((resolve, reject) => {
      const correlationId = uuidv4()
      const iframe = IframeReference.getIframe()

      if (!iframe || !iframe.contentWindow) {
        reject(new Error("Iframe not available"))
        return
      }

      const targetOrigin = this.getOriginFromUrl(this.origin)
      console.log("🔍 Checking if iframe is ready, target origin:", targetOrigin)

      // Timeout de 15 secondes
      const timeout = setTimeout(() => {
        cleanup()
        reject(new Error("Timeout: Iframe 4NK ne répond pas après 15 secondes"))
      }, 15000)

      const cleanup = () => {
        clearTimeout(timeout)
        window.removeEventListener("message", handleMessage)
      }

      const handleMessage = (event: MessageEvent) => {
        console.log("📥 Ready check - received from:", event.origin)

        // Accepter les messages de domaines 4NK
        const is4NKOrigin = event.origin.includes("4nk") || event.origin.includes("localhost")

        if (!is4NKOrigin) return
        if (event.data.correlationId !== correlationId) return

        cleanup()

        if (event.data.type === "READY") {
          console.log("✅ Iframe is ready!")
          resolve()
        } else if (event.data.type?.startsWith("ERROR_")) {
          console.error("❌ Iframe ready check failed:", event.data.message)
          reject(new Error(event.data.message || "Unknown error"))
        }
      }

      window.addEventListener("message", handleMessage)

      try {
        iframe.contentWindow.postMessage(
          {
            type: "IS_READY",
            correlationId,
          },
          targetOrigin,
        )
      } catch (error) {
        console.log("🔄 Fallback to wildcard origin for ready check")
        iframe.contentWindow.postMessage(
          {
            type: "IS_READY",
            correlationId,
          },
          "*",
        )
      }
    })
  }

  async requestLink(): Promise<void> {
    console.log("🔐 Requesting authentication link...")
    const response = await this.sendMessage("REQUEST_LINK")

    if (response.type === "LINK_ACCEPTED") {
      console.log("✅ Authentication link accepted")
      this.userStore.connect(response.accessToken, response.refreshToken)
    } else {
      console.error("❌ Authentication failed:", response)
      throw new Error("Authentication failed")
    }
  }

  async getUserPairingId(): Promise<string> {
    console.log("🆔 Getting user pairing ID...")
    const response = await this.sendMessage("GET_PAIRING_ID")
    const pairingId = response.userPairingId
    this.userStore.pair(pairingId)
    console.log("✅ User pairing ID retrieved:", pairingId?.slice(0, 8) + "...")
    return pairingId
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await this.sendMessage("VALIDATE_TOKEN")
      return response.valid === true
    } catch {
      return false
    }
  }

  async renewToken(): Promise<void> {
    const response = await this.sendMessage("RENEW_TOKEN", {
      refreshToken: this.userStore.getRefreshToken(),
    })

    if (response.type === "TOKEN_RENEWED") {
      this.userStore.connect(response.accessToken, response.refreshToken)
    }
  }

  // Méthodes de gestion des process
  async getProcesses(): Promise<any> {
    return this.sendMessage("GET_PROCESSES")
  }

  async getMyProcesses(): Promise<string[]> {
    const response = await this.sendMessage("GET_MY_PROCESSES")
    return response.processIds || []
  }

  async getData(processId: string, stateId: string): Promise<Record<string, any>> {
    return this.sendMessage("RETRIEVE_DATA", { processId, stateId })
  }

  async createProfile(profileData: any, privateFields: string[], roles: any): Promise<any> {
    return this.sendMessage("CREATE_PROCESS", {
      processType: "profile",
      data: profileData,
      privateFields,
      roles,
    })
  }

  async createFolder(folderData: any, privateFields: string[], roles: any): Promise<any> {
    return this.sendMessage("CREATE_PROCESS", {
      processType: "folder",
      data: folderData,
      privateFields,
      roles,
    })
  }

  async updateProcess(
    processId: string,
    lastStateId: string,
    newData: any,
    privateFields: string[],
    roles: any,
  ): Promise<any> {
    return this.sendMessage("UPDATE_PROCESS", {
      processId,
      lastStateId,
      data: newData,
      privateFields,
      roles,
    })
  }

  async notifyProcessUpdate(processId: string, stateId: string): Promise<void> {
    return this.sendMessage("NOTIFY_UPDATE", { processId, stateId })
  }

  async validateState(processId: string, stateId: string): Promise<any> {
    return this.sendMessage("VALIDATE_STATE", { processId, stateId })
  }
}
