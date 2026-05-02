"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart, Code } from "lucide-react"
import { getFooterSettings, type FooterSettings } from "@/lib/local-storage"

export function Footer() {
  const [settings, setSettings] = useState<FooterSettings | null>(null)
  const [mounted, setMounted] = useState(false)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    setMounted(true)
    setSettings(getFooterSettings())
  }, [])

  const logoText = settings?.logoText || "Portfolio"
  const copyright = settings?.copyright || "All rights reserved."
  const builtWith = settings?.builtWith || "Built with Next.js"

  return (
    <footer className="relative border-t border-white/[0.06] bg-gradient-to-b from-transparent to-black/20">
      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />
      
      <div className="container mx-auto px-6 md:px-8 max-w-7xl py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/[0.1] to-white/[0.05] border border-white/[0.1] flex items-center justify-center group-hover:border-white/[0.2] transition-colors">
                <Code size={18} className="text-white/70" />
              </div>
              <span className="font-bold text-white text-lg">
                {logoText}
              </span>
            </Link>
            <p className="text-sm text-white/30">
              &copy; {currentYear} {copyright}
            </p>
          </div>

          {/* Built with */}
          <p className="text-sm text-white/30 flex items-center gap-1.5">
            {builtWith.includes("love") || builtWith.includes("heart") || builtWith.includes("Love") ? (
              <>
                Built with <Heart size={14} className="text-red-400/70 fill-red-400/70" /> 
              </>
            ) : (
              builtWith
            )}
          </p>
        </div>
      </div>
    </footer>
  )
}
