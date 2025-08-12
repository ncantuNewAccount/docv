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

  private sendMessage(type: string, data: any = {}, timeoutMs = 30000): Promise<any> {
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
        timestamp: Date.now(),
        ...data,
      }

      console.log(`📤 Sending message ${type} to origin:`, targetOrigin)
      console.log(`📤 Message data:`, { type, correlationId, hasAccessToken: !!accessToken })

      const cleanup = this.initMessageListener(correlationId, resolve, reject, timeoutMs)

      // Essayer d'envoyer le message avec plusieurs stratégies
      const sendStrategies = [
        () => iframe.contentWindow!.postMessage(message, targetOrigin),
        () => iframe.contentWindow!.postMessage(message, "*"),
        () => {
          // Attendre un peu et réessayer
          setTimeout(() => {
            if (iframe.contentWindow) {
              iframe.contentWindow.postMessage(message, targetOrigin)
            }
          }, 1000)
        },
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

  private initMessageListener(
    correlationId: string,
    resolve: Function,
    reject: Function,
    timeoutMs: number,
  ): () => void {
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
        "CorrelationId:",
        event.data.correlationId,
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

      if (event.data.correlationId !== correlationId) {
        console.log("🚫 Message ignored - correlation ID mismatch")
        return
      }

      cleanup()

      if (event.data.type?.startsWith("ERROR_")) {
        console.error("❌ Received error:", event.data.message)
        reject(new Error(event.data.message || "Unknown error"))
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

  // Méthodes d'authentification avec timeouts plus longs
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

      // Timeout de 45 secondes pour isReady
      const timeout = setTimeout(() => {
        cleanup()
        reject(
          new Error(
            "Timeout: L'iframe 4NK ne répond pas après 45 secondes. Vérifiez votre connexion internet et l'URL de l'iframe.",
          ),
        )
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

        if (event.data.correlationId !== correlationId) {
          console.log("🚫 Ready check ignored - correlation ID mismatch")
          return
        }

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

      // Envoyer le message de vérification avec plusieurs tentatives
      const sendReadyCheck = (attempt = 1) => {
        if (attempt > 5) {
          cleanup()
          reject(new Error("Impossible de communiquer avec l'iframe après 5 tentatives"))
          return
        }

        console.log(`🔄 Sending ready check, attempt ${attempt}/5`)

        try {
          iframe.contentWindow!.postMessage(
            {
              type: "IS_READY",
              correlationId,
              timestamp: Date.now(),
              attempt,
            },
            targetOrigin,
          )
        } catch (error) {
          console.log(`🔄 Attempt ${attempt} failed, trying wildcard...`)
          try {
            iframe.contentWindow!.postMessage(
              {
                type: "IS_READY",
                correlationId,
                timestamp: Date.now(),
                attempt,
              },
              "*",
            )
          } catch (fallbackError) {
            console.error(`❌ Both attempts ${attempt} failed:`, error, fallbackError)
          }
        }

        // Réessayer après un délai croissant
        setTimeout(() => sendReadyCheck(attempt + 1), attempt * 2000)
      }

      sendReadyCheck()
    })
  }

  async requestLink(): Promise<void> {
    console.log("🔐 Requesting authentication link...")
    const response = await this.sendMessage("REQUEST_LINK", {}, 60000) // 60 secondes pour l'auth

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
    const response = await this.sendMessage("GET_PAIRING_ID", {}, 30000)
    const pairingId = response.userPairingId
    this.userStore.pair(pairingId)
    console.log("✅ User pairing ID retrieved:", pairingId?.slice(0, 8) + "...")
    return pairingId
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await this.sendMessage("VALIDATE_TOKEN", {}, 15000)
      return response.valid === true
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

    if (response.type === "TOKEN_RENEWED") {
      this.userStore.connect(response.accessToken, response.refreshToken)
    }
  }

  // Méthodes de gestion des process
  async getProcesses(): Promise<any> {
    return this.sendMessage("GET_PROCESSES", {}, 20000)
  }

  async getMyProcesses(): Promise<string[]> {
    const response = await this.sendMessage("GET_MY_PROCESSES", {}, 20000)
    return response.processIds || []
  }

  async getData(processId: string, stateId: string): Promise<Record<string, any>> {
    return this.sendMessage("RETRIEVE_DATA", { processId, stateId }, 20000)
  }

  async createProfile(profileData: any, privateFields: string[], roles: any): Promise<any> {
    return this.sendMessage(
      "CREATE_PROCESS",
      {
        processType: "profile",
        data: profileData,
        privateFields,
        roles,
      },
      30000,
    )
  }

  async createFolder(folderData: any, privateFields: string[], roles: any): Promise<any> {
    return this.sendMessage(
      "CREATE_PROCESS",
      {
        processType: "folder",
        data: folderData,
        privateFields,
        roles,
      },
      30000,
    )
  }

  async updateProcess(
    processId: string,
    lastStateId: string,
    newData: any,
    privateFields: string[],
    roles: any,
  ): Promise<any> {
    return this.sendMessage(
      "UPDATE_PROCESS",
      {
        processId,
        lastStateId,
        data: newData,
        privateFields,
        roles,
      },
      30000,
    )
  }

  async notifyProcessUpdate(processId: string, stateId: string): Promise<void> {
    return this.sendMessage("NOTIFY_UPDATE", { processId, stateId }, 15000)
  }

  async validateState(processId: string, stateId: string): Promise<any> {
    return this.sendMessage("VALIDATE_STATE", { processId, stateId }, 20000)
  }
}
