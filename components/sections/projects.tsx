"use client"

import { motion } from "framer-motion"
import { Section } from "@/components/ui/section"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { ExternalLink, Github, Folder } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Project } from "@/lib/types"

interface ProjectsProps {
  projects: Project[]
}

export function Projects({ projects }: ProjectsProps) {
  const featuredProjects = projects.filter((p) => p.featured)
  const otherProjects = projects.filter((p) => !p.featured)

  return (
    <Section
      id="projects"
      title="Featured Projects"
      subtitle="A selection of my recent work showcasing my skills and expertise"
    >
      {/* Featured Projects Grid */}
      <div className="grid gap-8 mb-16">
        {featuredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <GlassCard className="overflow-hidden" glow>
              <div className={`grid md:grid-cols-2 gap-6 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                {/* Project Image */}
                <div className={`relative aspect-video md:aspect-auto overflow-hidden ${index % 2 === 1 ? "md:order-2" : ""}`}>
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center">
                      <Folder size={64} className="text-primary/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent md:hidden" />
                </div>

                {/* Project Info */}
                <div className={`p-6 md:p-8 flex flex-col justify-center ${index % 2 === 1 ? "md:order-1" : ""}`}>
                  <span className="text-primary text-sm font-medium mb-2">Featured Project</span>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{project.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {project.long_description || project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-mono bg-primary/10 text-primary rounded-full border border-primary/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-4">
                    {project.github_url && (
                      <Link
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="View source code"
                      >
                        <Github size={22} />
                      </Link>
                    )}
                    {project.live_url && (
                      <Link
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="View live site"
                      >
                        <ExternalLink size={22} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <>
          <motion.h3
            className="text-2xl font-bold text-center mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Other Noteworthy Projects
          </motion.h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <GlassCard className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <Folder size={40} className="text-primary" />
                    <div className="flex items-center gap-3">
                      {project.github_url && (
                        <Link
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                          aria-label="View source code"
                        >
                          <Github size={20} />
                        </Link>
                      )}
                      {project.live_url && (
                        <Link
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                          aria-label="View live site"
                        >
                          <ExternalLink size={20} />
                        </Link>
                      )}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-2">{project.title}</h4>
                  <p className="text-muted-foreground text-sm mb-4 flex-grow">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-16">
          <Folder size={64} className="mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Projects coming soon...</p>
        </div>
      )}
    </Section>
  )
}
