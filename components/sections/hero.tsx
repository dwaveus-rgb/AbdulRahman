"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { ArrowDown, Github, Linkedin, Mail, Twitter, Sparkles } from "lucide-react"
import Link from "next/link"
import { getHeroSettings, type HeroSettings } from "@/lib/local-storage"

export function Hero() {
  const [settings, setSettings] = useState<HeroSettings | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSettings(getHeroSettings())
  }, [])

  // Default values for SSR
  const name = settings?.name || "Developer"
  const title = settings?.title || "Full-Stack Developer"
  const headline = settings?.headline || "Crafting Digital Experiences"
  const subheadline = settings?.subheadline || "I build modern, performant, and beautiful web applications."
  const badge = settings?.badge || "Available for hire"
  const primaryCta = settings?.primaryCta || "View My Work"
  const secondaryCta = settings?.secondaryCta || "Get In Touch"
  const socialLinks = settings?.socialLinks || {}

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-white/[0.08] to-white/[0.04] border border-white/[0.12] text-white/70 text-sm font-medium mb-8 backdrop-blur-xl shadow-lg shadow-black/20">
              <Sparkles size={14} className="text-blue-400" />
              {badge}
            </span>
          </motion.div>

          {/* Main Headline with gradient */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent">
              {headline}
            </span>
          </motion.h1>

          {/* Title with accent */}
          <motion.p
            className="text-xl md:text-2xl text-white/60 font-medium mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-white/80">{name}</span>
            <span className="mx-3 text-white/30">|</span>
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{title}</span>
          </motion.p>

          {/* Subheadline */}
          <motion.p
            className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-12 leading-relaxed text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Primary CTA - Gradient with glow */}
            <button
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              className="group relative px-8 py-4 rounded-2xl font-semibold text-black bg-gradient-to-r from-white to-white/90 hover:from-white hover:to-white shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300"
            >
              <span className="relative z-10">{primaryCta}</span>
            </button>
            
            {/* Secondary CTA - Glass outline */}
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 rounded-2xl font-semibold text-white/80 bg-white/[0.05] border border-white/[0.15] hover:bg-white/[0.1] hover:border-white/[0.25] backdrop-blur-xl transition-all duration-300"
            >
              {secondaryCta}
            </button>
          </motion.div>

          {/* Social Links */}
          {mounted && (
            <motion.div
              className="flex items-center justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {socialLinks.github && (
                <Link
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 rounded-xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-xl text-white/50 hover:text-white hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-300"
                  aria-label="GitHub"
                >
                  <Github size={20} className="group-hover:scale-110 transition-transform" />
                </Link>
              )}
              {socialLinks.linkedin && (
                <Link
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 rounded-xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-xl text-white/50 hover:text-white hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                </Link>
              )}
              {socialLinks.twitter && (
                <Link
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 rounded-xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-xl text-white/50 hover:text-white hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-300"
                  aria-label="Twitter"
                >
                  <Twitter size={20} className="group-hover:scale-110 transition-transform" />
                </Link>
              )}
              {socialLinks.email && (
                <Link
                  href={`mailto:${socialLinks.email}`}
                  className="group p-3 rounded-xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-xl text-white/50 hover:text-white hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-300"
                  aria-label="Email"
                >
                  <Mail size={20} className="group-hover:scale-110 transition-transform" />
                </Link>
              )}
            </motion.div>
          )}
        </div>

      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 1, duration: 0.5 },
          y: { delay: 1, duration: 1.5, repeat: Infinity },
        }}
      >
        <Link
          href="#projects"
          className="flex flex-col items-center gap-2 text-white/30 hover:text-white/50 transition-colors"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ArrowDown size={18} />
        </Link>
      </motion.div>
    </section>
  )
}
