"use client"

import { useEffect, useState } from "react"
import { getHeaderSettings, type HeaderSettings } from "@/lib/local-storage"
import * as LucideIcons from "lucide-react"

// Generate SVG favicon from Lucide icon or text
function generateSvgFavicon(iconName: string): string {
  const letter = iconName.charAt(0).toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0a0a0a"/><text x="16" y="22" text-anchor="middle" fill="#fafafa" font-family="system-ui" font-size="18" font-weight="600">${letter}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export function DynamicHead() {
  const [settings, setSettings] = useState<HeaderSettings | null>(null)

  useEffect(() => {
    // Load settings on mount
    const loadedSettings = getHeaderSettings()
    setSettings(loadedSettings)

    // Apply title
    if (loadedSettings.title) {
      document.title = loadedSettings.title
    }

    // Apply favicon
    applyFavicon(loadedSettings)

    // Listen for storage changes (when admin updates settings)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "portfolio_header_settings") {
        const newSettings = getHeaderSettings()
        setSettings(newSettings)
        if (newSettings.title) {
          document.title = newSettings.title
        }
        applyFavicon(newSettings)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    
    // Also poll for changes in same tab (storage event doesn't fire in same tab)
    const pollInterval = setInterval(() => {
      const currentSettings = getHeaderSettings()
      if (JSON.stringify(currentSettings) !== JSON.stringify(settings)) {
        setSettings(currentSettings)
        if (currentSettings.title) {
          document.title = currentSettings.title
        }
        applyFavicon(currentSettings)
      }
    }, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(pollInterval)
    }
  }, [])

  function applyFavicon(headerSettings: HeaderSettings) {
    if (!headerSettings.favicon) return

    let faviconUrl: string

    if (headerSettings.favicon.type === "url" || headerSettings.favicon.type === "upload") {
      faviconUrl = headerSettings.favicon.value
    } else {
      // Generate SVG favicon from icon name
      faviconUrl = generateSvgFavicon(headerSettings.favicon.value)
    }

    // Update or create favicon link
    let faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    if (!faviconLink) {
      faviconLink = document.createElement("link")
      faviconLink.rel = "icon"
      document.head.appendChild(faviconLink)
    }
    faviconLink.href = faviconUrl

    // Also update apple-touch-icon if using image
    if (headerSettings.favicon.type === "url" || headerSettings.favicon.type === "upload") {
      let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement
      if (!appleTouchIcon) {
        appleTouchIcon = document.createElement("link")
        appleTouchIcon.rel = "apple-touch-icon"
        document.head.appendChild(appleTouchIcon)
      }
      appleTouchIcon.href = faviconUrl
    }
  }

  return null // This component doesn't render anything visible
}

// Export a helper to get header settings for use in other components
export function useHeaderSettings() {
  const [settings, setSettings] = useState<HeaderSettings | null>(null)

  useEffect(() => {
    setSettings(getHeaderSettings())

    const handleStorageChange = () => {
      setSettings(getHeaderSettings())
    }

    window.addEventListener("storage", handleStorageChange)
    
    // Poll for same-tab changes
    const pollInterval = setInterval(() => {
      setSettings(getHeaderSettings())
    }, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(pollInterval)
    }
  }, [])

  return settings
}
