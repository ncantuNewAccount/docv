/**
 * MockService - Service de simulation 4NK pour les tests et développement
 * S'active avec l'identifiant d'entreprise "1234"
 */
export class MockService {
  private static instance: MockService | null = null
  private isAuthenticated = false
  private mockTokens = {
    accessToken: "mock_access_token_1234567890",
    refreshToken: "mock_refresh_token_0987654321",
  }
  private mockUserPairingId = "mock_pairing_id_abcdef123456"

  private constructor() {}

  static getInstance(): MockService {
    if (!MockService.instance) {
      MockService.instance = new MockService()
    }
    return MockService.instance
  }

  // Données mockées
  private mockProcesses = [
    {
      id: "process_001",
      type: "document",
      name: "Contrat de travail - Jean Dupont",
      status: "validated",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T14:20:00Z",
      owner: "user_001",
      states: [
        {
          state_id: "state_001_001",
          timestamp: "2024-01-15T10:30:00Z",
          status: "created",
        },
        {
          state_id: "state_001_002",
          timestamp: "2024-01-15T14:20:00Z",
          status: "validated",
        },
      ],
    },
    {
      id: "process_002",
      type: "folder",
      name: "Dossier RH - Marie Martin",
      status: "pending",
      created_at: "2024-01-16T09:15:00Z",
      updated_at: "2024-01-16T16:45:00Z",
      owner: "user_002",
      states: [
        {
          state_id: "state_002_001",
          timestamp: "2024-01-16T09:15:00Z",
          status: "created",
        },
      ],
    },
    {
      id: "process_003",
      type: "document",
      name: "Facture SARL TechCorp",
      status: "signed",
      created_at: "2024-01-17T11:00:00Z",
      updated_at: "2024-01-17T17:30:00Z",
      owner: "user_001",
      states: [
        {
          state_id: "state_003_001",
          timestamp: "2024-01-17T11:00:00Z",
          status: "created",
        },
        {
          state_id: "state_003_002",
          timestamp: "2024-01-17T17:30:00Z",
          status: "signed",
        },
      ],
    },
    {
      id: "process_004",
      type: "document",
      name: "Rapport d'audit 2024",
      status: "draft",
      created_at: "2024-01-18T08:45:00Z",
      updated_at: "2024-01-18T08:45:00Z",
      owner: "user_003",
      states: [
        {
          state_id: "state_004_001",
          timestamp: "2024-01-18T08:45:00Z",
          status: "draft",
        },
      ],
    },
    {
      id: "process_005",
      type: "folder",
      name: "Dossier Comptabilité Q1",
      status: "validated",
      created_at: "2024-01-10T14:20:00Z",
      updated_at: "2024-01-19T10:15:00Z",
      owner: "user_001",
      states: [
        {
          state_id: "state_005_001",
          timestamp: "2024-01-10T14:20:00Z",
          status: "created",
        },
        {
          state_id: "state_005_002",
          timestamp: "2024-01-19T10:15:00Z",
          status: "validated",
        },
      ],
    },
  ]

  private mockMyProcesses = ["process_001", "process_003", "process_005"]

  private mockProcessData = {
    process_001: {
      employee_name: "Jean Dupont",
      employee_email: "jean.dupont@example.com",
      position: "Développeur Senior",
      salary: "45000",
      start_date: "2024-02-01",
      contract_type: "CDI",
    },
    process_002: {
      employee_name: "Marie Martin",
      employee_email: "marie.martin@example.com",
      documents_count: 12,
      last_review: "2023-12-15",
      department: "Ressources Humaines",
    },
    process_003: {
      client_name: "SARL TechCorp",
      amount: "15750.00",
      invoice_number: "INV-2024-001",
      due_date: "2024-02-15",
      status: "paid",
    },
    process_004: {
      audit_year: "2024",
      auditor: "Cabinet Expertise",
      scope: "Audit financier complet",
      completion: "25%",
    },
    process_005: {
      quarter: "Q1 2024",
      documents_count: 45,
      total_amount: "125000.00",
      status: "closed",
    },
  }

  // Simulation de l'authentification
  async mockAuthentication(companyId: string): Promise<boolean> {
    console.log("🎭 Mock authentication for company:", companyId)

    // Simuler un délai d'authentification
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (companyId === "1234") {
      this.isAuthenticated = true
      console.log("✅ Mock authentication successful")
      return true
    }

    console.log("❌ Mock authentication failed - invalid company ID")
    return false
  }

  // Simulation des méthodes 4NK
  async mockRequestLink(): Promise<{ accessToken: string; refreshToken: string }> {
    console.log("🎭 Mock REQUEST_LINK")
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!this.isAuthenticated) {
      throw new Error("Not authenticated")
    }

    return this.mockTokens
  }

  async mockGetUserPairingId(): Promise<string> {
    console.log("🎭 Mock GET_PAIRING_ID")
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (!this.isAuthenticated) {
      throw new Error("Not authenticated")
    }

    return this.mockUserPairingId
  }

  async mockGetProcesses(): Promise<any[]> {
    console.log("🎭 Mock GET_PROCESSES")
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (!this.isAuthenticated) {
      throw new Error("Not authenticated")
    }

    return this.mockProcesses
  }

  async mockGetMyProcesses(): Promise<string[]> {
    console.log("🎭 Mock GET_MY_PROCESSES")
    await new Promise((resolve) => setTimeout(resolve, 600))

    if (!this.isAuthenticated) {
      throw new Error("Not authenticated")
    }

    return this.mockMyProcesses
  }

  async mockGetData(processId: string, stateId: string): Promise<Record<string, any>> {
    console.log("🎭 Mock RETRIEVE_DATA for process:", processId)
    await new Promise((resolve) => setTimeout(resolve, 700))

    if (!this.isAuthenticated) {
      throw new Error("Not authenticated")
    }

    return this.mockProcessData[processId as keyof typeof this.mockProcessData] || {}
  }

  async mockCreateProcess(processData: any, privateFields: string[], roles: any): Promise<any> {
    console.log("🎭 Mock CREATE_PROCESS")
    await new Promise((resolve) => setTimeout(resolve, 1200))

    if (!this.isAuthenticated) {
      throw new Error("Not authenticated")
    }

    const newProcessId = `process_${Date.now()}`
    const newProcess = {
      id: newProcessId,
      type: processData.type || "document",
      name: processData.name || "Nouveau process",
      status: "created",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner: "current_user",
      states: [
        {
          state_id: `state_${newProcessId}_001`,
          timestamp: new Date().toISOString(),
          status: "created",
        },
      ],
    }

    // Ajouter aux processes mockés
    this.mockProcesses.push(newProcess)
    this.mockMyProcesses.push(newProcessId)
    this.mockProcessData[newProcessId as keyof typeof this.mockProcessData] = processData

    return {
      processId: newProcessId,
      process: newProcess,
      processData,
    }
  }

  async mockNotifyProcessUpdate(processId: string, stateId: string): Promise<void> {
    console.log("🎭 Mock NOTIFY_UPDATE for process:", processId)
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (!this.isAuthenticated) {
      throw new Error("Not authenticated")
    }

    // Simuler la notification
    console.log("✅ Mock notification sent")
  }

  async mockValidateState(processId: string, stateId: string): Promise<any> {
    console.log("🎭 Mock VALIDATE_STATE for process:", processId)
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (!this.isAuthenticated) {
      throw new Error("Not authenticated")
    }

    // Trouver le process et mettre à jour son statut
    const process = this.mockProcesses.find((p) => p.id === processId)
    if (process) {
      process.status = "validated"
      process.updated_at = new Date().toISOString()
      process.states.push({
        state_id: `${stateId}_validated`,
        timestamp: new Date().toISOString(),
        status: "validated",
      })
    }

    return process
  }

  async mockValidateToken(): Promise<boolean> {
    console.log("🎭 Mock VALIDATE_TOKEN")
    await new Promise((resolve) => setTimeout(resolve, 300))
    return this.isAuthenticated
  }

  async mockRenewToken(): Promise<{ accessToken: string; refreshToken: string }> {
    console.log("🎭 Mock RENEW_TOKEN")
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (!this.isAuthenticated) {
      throw new Error("Not authenticated")
    }

    // Générer de nouveaux tokens mockés
    this.mockTokens = {
      accessToken: `mock_access_token_${Date.now()}`,
      refreshToken: `mock_refresh_token_${Date.now()}`,
    }

    return this.mockTokens
  }

  // Utilitaires
  isInMockMode(): boolean {
    return this.isAuthenticated
  }

  disconnect(): void {
    this.isAuthenticated = false
    console.log("🎭 Mock disconnected")
  }

  // Données supplémentaires pour les écrans
  getMockStats() {
    return {
      totalDocuments: this.mockProcesses.filter((p) => p.type === "document").length,
      totalFolders: this.mockProcesses.filter((p) => p.type === "folder").length,
      myProcesses: this.mockMyProcesses.length,
      pendingValidations: this.mockProcesses.filter((p) => p.status === "pending" || p.status === "draft").length,
      validatedProcesses: this.mockProcesses.filter((p) => p.status === "validated").length,
    }
  }

  getMockRecentActivity() {
    return this.mockProcesses
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5)
      .map((process) => ({
        id: process.id,
        name: process.name,
        type: process.type,
        status: process.status,
        updated_at: process.updated_at,
      }))
  }
}
