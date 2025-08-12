/**
 * UserStore - Singleton pour la gestion des tokens et identifiants utilisateur
 * Stockage en sessionStorage selon les spécifications 4NK
 */
export class UserStore {
  private static instance: UserStore | null = null

  private constructor() {}

  static getInstance(): UserStore {
    if (!UserStore.instance) {
      UserStore.instance = new UserStore()
    }
    return UserStore.instance
  }

  connect(accessToken: string, refreshToken: string): void {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("4nk_access_token", accessToken)
      sessionStorage.setItem("4nk_refresh_token", refreshToken)
    }
  }

  isConnected(): boolean {
    if (typeof window === "undefined") return false
    const accessToken = sessionStorage.getItem("4nk_access_token")
    const refreshToken = sessionStorage.getItem("4nk_refresh_token")
    return !!(accessToken && refreshToken)
  }

  disconnect(): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("4nk_access_token")
      sessionStorage.removeItem("4nk_refresh_token")
      sessionStorage.removeItem("4nk_user_pairing_id")
    }
  }

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null
    return sessionStorage.getItem("4nk_access_token")
  }

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null
    return sessionStorage.getItem("4nk_refresh_token")
  }

  pair(userPairingId: string): void {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("4nk_user_pairing_id", userPairingId)
    }
  }

  getUserPairingId(): string | null {
    if (typeof window === "undefined") return null
    return sessionStorage.getItem("4nk_user_pairing_id")
  }
}
