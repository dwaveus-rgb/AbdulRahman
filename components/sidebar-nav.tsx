"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const sections = [
  { id: "hero", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
]

export function SidebarNav() {
  const [activeSection, setActiveSection] = useState("hero")
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id)
        if (section) {
          const offsetTop = section.offsetTop
          if (scrollPosition >= offsetTop) {
            setActiveSection(sections[i].id)
            break
          }
        }
      }

      // If at the very top, set hero as active
      if (window.scrollY < 100) {
        setActiveSection("hero")
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav 
      className="fixed left-6 top-1/2 -translate-y-1/2 z-[60] hidden md:flex flex-col items-center gap-6"
      aria-label="Section navigation"
    >
      {/* Vertical line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/10" />
      
      {sections.map((section) => {
        const isActive = activeSection === section.id
        const isHovered = hoveredSection === section.id
        const showLabel = isActive || isHovered

        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            onMouseEnter={() => setHoveredSection(section.id)}
            onMouseLeave={() => setHoveredSection(null)}
            className="relative flex items-center group"
            aria-label={`Navigate to ${section.label}`}
            aria-current={isActive ? "true" : undefined}
          >
            {/* Dot */}
            <motion.div
              className={cn(
                "relative z-10 rounded-full transition-colors duration-200",
                isActive 
                  ? "bg-white" 
                  : "bg-white/30 group-hover:bg-white/60"
              )}
              animate={{
                width: isActive ? 12 : 8,
                height: isActive ? 12 : 8,
              }}
              transition={{ duration: 0.2 }}
            />

            {/* Label */}
            <AnimatePresence>
              {showLabel && (
                <motion.span
                  className="absolute left-6 whitespace-nowrap text-sm font-medium text-white/80 bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-lg border border-white/10"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  {section.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        )
      })}
    </nav>
  )
}
