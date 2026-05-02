"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { getSiteHeaderSettings, type SiteHeaderSettings } from "@/lib/local-storage"

export function SiteHeader() {
  const [settings, setSettings] = useState<SiteHeaderSettings | null>(null)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Don't show header on admin pages
  const isAdminPage = pathname?.startsWith("/admin")

  useEffect(() => {
    setMounted(true)
    setSettings(getSiteHeaderSettings())
    
    // Listen for settings updates
    const handleUpdate = () => {
      setSettings(getSiteHeaderSettings())
    }
    
    window.addEventListener("siteHeaderSettingsUpdated", handleUpdate)
    window.addEventListener("storage", (e) => {
      if (e.key === "portfolio_site_header_settings") {
        setSettings(getSiteHeaderSettings())
      }
    })
    
    return () => {
      window.removeEventListener("siteHeaderSettingsUpdated", handleUpdate)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Don't render on admin pages or if header is disabled
  if (!mounted || !settings?.showHeader || isAdminPage) return null

  const headerClasses = `
    ${settings.sticky ? "fixed" : "absolute"} 
    top-0 left-0 right-0 z-50
    transition-all duration-300
    ${scrolled ? "py-3" : "py-4"}
  `

  const headerBgClasses = settings.glassEffect
    ? `el-site-header ${scrolled ? "shadow-lg shadow-black/10" : ""}`
    : `bg-background ${scrolled ? "shadow-lg shadow-black/10" : ""}`

  return (
    <motion.header
      className={`${headerClasses} ${headerBgClasses}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 md:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {settings.logoType === "image" && settings.logoImage ? (
              <img
                src={settings.logoImage}
                alt="Logo"
                className="object-contain"
                style={{ height: settings.logoSize, width: "auto" }}
              />
            ) : (
              <span 
                className="el-logo font-bold tracking-tight"
                style={{ fontSize: settings.logoSize * 0.625 }}
              >
                {settings.logoText}
              </span>
            )}
          </Link>

          {/* Navigation Links */}
          {settings.showNavLinks && settings.navLinks.length > 0 && (
            <div className="hidden md:flex items-center gap-1">
              {settings.navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="el-nav-link px-4 py-2 rounded-xl hover:bg-white/[0.05] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.1] transition-colors"
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </div>
    </motion.header>
  )
}
