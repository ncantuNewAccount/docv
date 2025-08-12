/**
 * IframeReference - Référence globale pour l'iframe 4NK
 * Permet aux autres services d'accéder à l'iframe pour postMessage
 */
export class IframeReference {
  private static iframe: HTMLIFrameElement | null = null

  static setIframe(iframe: HTMLIFrameElement | null): void {
    IframeReference.iframe = iframe
  }

  static getIframe(): HTMLIFrameElement | null {
    return IframeReference.iframe
  }
}
