/**
 * EventBus - Bus d'événements intra-onglet pour la communication interne
 * Pattern Singleton avec pub/sub
 */
export class EventBus {
  private static instance: EventBus | null = null
  private listeners: Map<string, Array<(...args: any[]) => void>> = new Map()

  private constructor() {}

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus()
    }
    return EventBus.instance
  }

  on(event: string, callback: (...args: any[]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }

    const eventListeners = this.listeners.get(event)!
    eventListeners.push(callback)

    // Retourne une fonction d'unsubscribe
    return () => {
      const index = eventListeners.indexOf(callback)
      if (index > -1) {
        eventListeners.splice(index, 1)
      }
    }
  }

  emit(event: string, ...args: any[]): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        try {
          callback(...args)
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error)
        }
      })
    }
  }
}
