"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { type ReactNode } from "react"

interface SectionProps {
  id?: string
  className?: string
  children: ReactNode
  title?: string
  subtitle?: string
}

export function Section({ id, className, children, title, subtitle }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative py-20 md:py-32", className)}
    >
      <div className="container mx-auto px-4 md:px-6">
        {(title || subtitle) && (
          <motion.div
            className="mb-12 md:mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto text-balance">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  )
}
