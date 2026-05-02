"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Folder, Image as ImageIcon } from "lucide-react"
import { getProjects, type LocalProject } from "@/lib/local-storage"
import { ProjectDetailModal } from "@/components/project-detail-modal"

export function DynamicProjects() {
  const [projects, setProjects] = useState<LocalProject[]>([])
  const [mounted, setMounted] = useState(false)
  const [selectedProject, setSelectedProject] = useState<LocalProject | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    setProjects(getProjects())
  }, [])

  function handleProjectClick(project: LocalProject) {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  function handleCloseModal() {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }

  if (!mounted) {
    return (
      <section id="projects" className="py-24 md:py-32 relative">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/50 text-sm font-medium mb-4">
              Portfolio
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Featured Projects</h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">A selection of my recent work</p>
          </div>
          <div className="flex justify-center py-16">
            <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="projects" className="py-24 md:py-32 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-gradient-radial from-blue-500/[0.03] via-transparent to-transparent blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-gradient-radial from-purple-500/[0.03] via-transparent to-transparent blur-3xl" />
        </div>

        <div className="container mx-auto px-6 md:px-8 max-w-7xl relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/50 text-sm font-medium mb-4"
            >
              Portfolio
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Featured Projects
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/40 text-lg max-w-2xl mx-auto"
            >
              A selection of my recent work showcasing my skills and expertise
            </motion.p>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                <Folder size={32} className="text-white/20" />
              </div>
              <p className="text-white/30 text-lg">Projects coming soon...</p>
            </div>
          ) : (
            /* Behance-style Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <button
                    onClick={() => handleProjectClick(project)}
                    className="el-card-project group relative w-full text-left overflow-hidden rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06] hover:border-white/[0.15] transition-all duration-500"
                  >
                    {/* Image Container - Auto Canvas */}
                    <div className="relative w-full overflow-hidden bg-black/30">
                      {project.image_url ? (
                        <div className="relative p-3">
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-auto object-contain rounded-xl transition-transform duration-700 group-hover:scale-[1.02]"
                            style={{ 
                              maxHeight: "280px",
                              margin: "0 auto",
                              display: "block"
                            }}
                          />
                        </div>
                      ) : (
                        <div className="aspect-[4/3] bg-gradient-to-br from-white/[0.08] to-white/[0.02] flex items-center justify-center">
                          <ImageIcon size={48} className="text-white/15" />
                        </div>
                      )}
                      
                      {/* Subtle overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      {/* Multi-image indicator */}
                      {project.images && project.images.length > 0 && (
                        <div className="absolute top-5 right-5 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm border border-white/[0.1] text-white/80 text-xs font-medium">
                          +{project.images.length} images
                        </div>
                      )}
                    </div>
                    
                    {/* Title and Tags - Below Image */}
                    <div className="p-5 border-t border-white/[0.06]">
                      <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors mb-2">
                        {project.title}
                      </h3>
                      
                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-white/[0.08] text-white/50 text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* View indicator on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <span className="px-6 py-3 rounded-xl bg-white/[0.15] backdrop-blur-sm border border-white/[0.2] text-white font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                        View Project
                      </span>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}
