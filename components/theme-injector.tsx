"use client"

import { useEffect, useState } from "react"
import { getActiveTheme, type LocalTheme } from "@/lib/local-storage"

export function ThemeInjector() {
  const [theme, setTheme] = useState<LocalTheme | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const activeTheme = getActiveTheme()
    setTheme(activeTheme)

    // Listen for theme changes via custom event
    const handleThemeChange = () => {
      const newTheme = getActiveTheme()
      setTheme(newTheme)
    }

    window.addEventListener("themeChange", handleThemeChange)
    return () => window.removeEventListener("themeChange", handleThemeChange)
  }, [])

  if (!mounted || !theme || theme.isDefault) {
    return null
  }

  // Inject custom theme CSS
  return (
    <style
      id="custom-theme-styles"
      dangerouslySetInnerHTML={{
        __html: theme.css,
      }}
    />
  )
}

// Helper to trigger theme change event
export function triggerThemeChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("themeChange"))
  }
}
