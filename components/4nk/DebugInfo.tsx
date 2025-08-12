"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff } from "lucide-react"

export function DebugInfo() {
  const [showDebug, setShowDebug] = useState(false)

  if (process.env.NODE_ENV === "production" && !showDebug) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 opacity-50 hover:opacity-100"
      >
        <Eye className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Debug Info</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowDebug(false)}>
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div>
            <Badge variant="outline" className="mb-1">
              Environment
            </Badge>
            <p>{process.env.NODE_ENV}</p>
          </div>

          <div>
            <Badge variant="outline" className="mb-1">
              4NK Iframe URL
            </Badge>
            <p className="break-all">{process.env.NEXT_PUBLIC_4NK_IFRAME_URL || "Non configuré"}</p>
          </div>

          <div>
            <Badge variant="outline" className="mb-1">
              Current Origin
            </Badge>
            <p className="break-all">{typeof window !== "undefined" ? window.location.origin : "SSR"}</p>
          </div>

          <div>
            <Badge variant="outline" className="mb-1">
              User Agent
            </Badge>
            <p className="break-all">
              {typeof window !== "undefined" ? navigator.userAgent.slice(0, 50) + "..." : "SSR"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
