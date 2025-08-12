"use client"

import { useRef, useEffect, memo } from "react"
import { IframeReference } from "@/lib/4nk/IframeReference"

interface IframeProps {
  iframeUrl: string
  showIframe?: boolean
}

export const Iframe = memo(function Iframe({ iframeUrl, showIframe = false }: IframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current) {
      IframeReference.setIframe(iframeRef.current)
    }

    return () => {
      IframeReference.setIframe(null)
    }
  }, [])

  return (
    <iframe
      ref={iframeRef}
      src={iframeUrl}
      style={{
        width: showIframe ? "100%" : "0",
        height: showIframe ? "400px" : "0",
        border: "none",
        display: showIframe ? "block" : "none",
      }}
      sandbox="allow-scripts allow-same-origin allow-forms"
      title="4NK Authentication"
    />
  )
})
