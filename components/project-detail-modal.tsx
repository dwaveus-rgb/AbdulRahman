"use client"

import { useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink } from "lucide-react"
import { type LocalProject } from "@/lib/local-storage"

interface ProjectDetailModalProps {
  project: LocalProject | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  // Get all images (primary + gallery)
  const allImages = project ? [
    ...(project.image_url ? [project.image_url] : []),
    ...(project.images || [])
  ].filter(Boolean) : []
  
  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-xl"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Close Button - Fixed position */}
          <button
            onClick={onClose}
            className="fixed top-6 right-6 z-[60] p-3 rounded-full bg-white/[0.1] border border-white/[0.15] text-white/70 hover:text-white hover:bg-white/[0.15] transition-all backdrop-blur-xl"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
          
          {/* Modal Content - Behance Style Vertical Scroll */}
          <motion.div
            className="relative z-10 w-full max-w-5xl mx-4 my-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Project Header */}
            <div className="mb-8 text-center">
              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-white/[0.08] border border-white/[0.1] text-white/60 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Title */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                {project.title}
              </h2>
              
              {/* Description */}
              <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8 whitespace-pre-wrap">
                {project.description}
              </p>
              
              {/* Project Link */}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-semibold hover:bg-white/90 transition-colors shadow-lg shadow-white/10"
                >
                  View Live Project
                  <ExternalLink size={20} />
                </a>
              )}
            </div>
            
            {/* Vertical Image Gallery - Behance Style */}
            {allImages.length > 0 && (
              <div className="flex flex-col gap-6">
                {allImages.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="w-full rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.06]"
                  >
                    {/* Auto-sizing canvas - image determines container height */}
                    <div className="relative w-full">
                      <img
                        src={img}
                        alt={`${project.title} - Image ${index + 1}`}
                        className="w-full h-auto object-contain"
                        style={{ 
                          maxHeight: "90vh",
                          backgroundColor: "rgba(0,0,0,0.3)"
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Bottom padding for scroll */}
            <div className="h-20" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
