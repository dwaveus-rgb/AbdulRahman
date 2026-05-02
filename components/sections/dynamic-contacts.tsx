"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Link as LinkIcon, Users, ArrowUpRight } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { getContacts, type LocalContact } from "@/lib/local-storage"

// Helper to render icon from stored value
function RenderIcon({ 
  value, 
  size = 28, 
  className = "" 
}: { 
  value?: string
  size?: number
  className?: string 
}) {
  if (!value) {
    return <LinkIcon size={size} className={className} />
  }

  // Check if it's a URL or base64
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) {
    return (
      <img
        src={value}
        alt="Icon"
        className={`object-contain ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  // Try to get Lucide icon
  const iconKey = value.charAt(0).toUpperCase() + value.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[iconKey]
  
  if (IconComponent) {
    return <IconComponent size={size} className={className} />
  }

  return <LinkIcon size={size} className={className} />
}

export function DynamicContacts() {
  const [contacts, setContacts] = useState<LocalContact[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setContacts(getContacts())
  }, [])

  if (!mounted) {
    return (
      <section id="contact" className="py-24 md:py-32 relative">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/50 text-sm font-medium mb-4">
              Connect
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Get In Touch</h2>
          </div>
          <div className="flex justify-center py-16">
            <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-blue-500/[0.04] via-transparent to-transparent blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-cyan-500/[0.03] via-transparent to-transparent blur-3xl" />
      </div>

      <div className="container mx-auto px-6 md:px-8 max-w-5xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/50 text-sm font-medium mb-4"
          >
            Connect
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Get In Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-lg max-w-2xl mx-auto"
          >
            Connect with me through any of these platforms
          </motion.p>
        </div>

        {contacts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
              <Users size={32} className="text-white/20" />
            </div>
            <p className="text-white/30 text-lg">Contact links coming soon...</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((contact, index) => (
              <motion.a
                key={contact.id}
                href={contact.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06] hover:border-white/[0.15] transition-all duration-500 overflow-hidden">
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] to-purple-500/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative flex items-center gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 group-hover:text-white group-hover:bg-white/[0.1] transition-all duration-300">
                      <RenderIcon value={contact.icon} size={26} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-white group-hover:text-white transition-colors">
                        {contact.name}
                      </h3>
                      <p className="text-sm text-white/40 flex items-center gap-1">
                        Click to connect
                        <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                      </p>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}


      </div>
    </section>
  )
}
