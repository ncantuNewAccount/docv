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
  }

  static getInstance(origin: string): MessageBus {
    if (!MessageBus.instance) {
      MessageBus.instance = new MessageBus(origin)
    }
    return MessageBus.instance
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

      const message = {
        type,
        correlationId,
        accessToken,
        ...data,
      }

      const cleanup = this.initMessageListener(correlationId, resolve, reject)

      try {
        iframe.contentWindow.postMessage(message, this.origin)
      } catch (error) {
        cleanup()
        reject(error)
      }
    })
  }

  private initMessageListener(correlationId: string, resolve: Function, reject: Function): () => void {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== this.origin) return
      if (event.data.correlationId !== correlationId) return

      cleanup()

      if (event.data.type?.startsWith("ERROR_")) {
        reject(new Error(event.data.message || "Unknown error"))
      } else {
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

      // Timeout de 10 secondes
      const timeout = setTimeout(() => {
        cleanup()
        reject(new Error("Timeout: Iframe 4NK ne répond pas"))
      }, 10000)

      const cleanup = () => {
        clearTimeout(timeout)
        window.removeEventListener("message", handleMessage)
      }

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== this.origin) return
        if (event.data.correlationId !== correlationId) return

        cleanup()

        if (event.data.type === "READY") {
          resolve()
        } else if (event.data.type?.startsWith("ERROR_")) {
          reject(new Error(event.data.message || "Unknown error"))
        }
      }

      window.addEventListener("message", handleMessage)

      iframe.contentWindow.postMessage(
        {
          type: "IS_READY",
          correlationId,
        },
        this.origin,
      )
    })
  }

  async requestLink(): Promise<void> {
    const response = await this.sendMessage("REQUEST_LINK")

    if (response.type === "LINK_ACCEPTED") {
      this.userStore.connect(response.accessToken, response.refreshToken)
    } else {
      throw new Error("Authentication failed")
    }
  }

  async getUserPairingId(): Promise<string> {
    const response = await this.sendMessage("GET_PAIRING_ID")
    const pairingId = response.userPairingId
    this.userStore.pair(pairingId)
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
