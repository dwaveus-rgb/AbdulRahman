"use client"

import { useEffect, useState } from "react"
import { getSecuritySettings, type SecuritySettings } from "@/lib/local-storage"
import { Shield, Eye, Lock } from "lucide-react"

export function StealingPrevention() {
  const [settings, setSettings] = useState<SecuritySettings | null>(null)
  const [isHidden, setIsHidden] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const loadedSettings = getSecuritySettings()
    setSettings(loadedSettings)

    // Poll for settings changes
    const pollInterval = setInterval(() => {
      const currentSettings = getSecuritySettings()
      setSettings(currentSettings)
    }, 1000)

    return () => {
      clearInterval(pollInterval)
    }
  }, [])

  useEffect(() => {
    if (!mounted || !settings || !settings.securityEnabled) return

    // Block right-click context menu
    function handleContextMenu(e: MouseEvent) {
      if (settings?.preventInspect) {
        e.preventDefault()
        return false
      }
    }

    // Block keyboard shortcuts for dev tools
    function handleKeyDown(e: KeyboardEvent) {
      if (!settings?.preventInspect) return

      // F12
      if (e.key === "F12") {
        e.preventDefault()
        return false
      }

      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C" || e.key === "i" || e.key === "j" || e.key === "c")) {
        e.preventDefault()
        return false
      }

      // Ctrl+U (view source)
      if (e.ctrlKey && (e.key === "U" || e.key === "u")) {
        e.preventDefault()
        return false
      }

      // PrintScreen
      if (settings.preventScreenshot && e.key === "PrintScreen") {
        e.preventDefault()
        // Clear clipboard
        navigator.clipboard.writeText("")
        return false
      }
    }

    // Block text selection and copy
    function handleCopy(e: ClipboardEvent) {
      if (settings?.preventCopy) {
        e.preventDefault()
        return false
      }
    }

    function handleSelectStart(e: Event) {
      if (settings?.preventCopy) {
        e.preventDefault()
        return false
      }
    }

    // Handle visibility change (tab switch, window blur)
    function handleVisibilityChange() {
      if (settings?.hideOnBlur) {
        if (document.hidden || document.visibilityState === "hidden") {
          setIsHidden(true)
        } else {
          setIsHidden(false)
        }
      }
    }

    function handleWindowBlur() {
      if (settings?.hideOnBlur) {
        setIsHidden(true)
      }
    }

    function handleWindowFocus() {
      if (settings?.hideOnBlur) {
        setIsHidden(false)
      }
    }

    // Detect PrintScreen key and clear clipboard
    function handleKeyUp(e: KeyboardEvent) {
      if (settings?.preventScreenshot && e.key === "PrintScreen") {
        navigator.clipboard.writeText("")
      }
    }

    // Add event listeners
    if (settings?.preventInspect) {
      document.addEventListener("contextmenu", handleContextMenu)
      document.addEventListener("keydown", handleKeyDown)
    }

    if (settings?.preventCopy) {
      document.addEventListener("copy", handleCopy)
      document.addEventListener("selectstart", handleSelectStart)
    }

    if (settings?.preventScreenshot) {
      document.addEventListener("keyup", handleKeyUp)
    }

    if (settings?.hideOnBlur) {
      document.addEventListener("visibilitychange", handleVisibilityChange)
      window.addEventListener("blur", handleWindowBlur)
      window.addEventListener("focus", handleWindowFocus)
    }

    // Add CSS to prevent selection if needed
    if (settings?.preventCopy) {
      document.body.style.userSelect = "none"
      document.body.style.webkitUserSelect = "none"
    }

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("copy", handleCopy)
      document.removeEventListener("selectstart", handleSelectStart)
      document.removeEventListener("keyup", handleKeyUp)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleWindowBlur)
      window.removeEventListener("focus", handleWindowFocus)
      document.body.style.userSelect = ""
      document.body.style.webkitUserSelect = ""
    }
  }, [mounted, settings])

  // Protection overlay when hidden
  if (isHidden && settings?.securityEnabled && settings?.hideOnBlur) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
        <div className="text-center space-y-6">
          <div className="relative">
            <Shield className="w-24 h-24 text-white/20 mx-auto" />
            <Lock className="w-10 h-10 text-white/60 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">
              {settings.protectionMessage || "Content Protected"}
            </h2>
            <p className="text-white/40 text-sm">
              Return to this tab to continue viewing
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
            <Eye size={14} />
            <span>Stealing Prevention Active</span>
          </div>
        </div>
      </div>
    )
  }

  return null
}
