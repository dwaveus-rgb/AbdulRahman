"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { createProject, updateProject, deleteProject } from "@/app/actions/admin"
import { HybridImageInput } from "@/components/admin/hybrid-image-input"
import { Plus, Pencil, Trash2, X, Star, ExternalLink, Github, GripVertical } from "lucide-react"
import type { Project } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"

interface ProjectsManagerProps {
  initialProjects: Project[]
}

export function ProjectsManager({ initialProjects }: ProjectsManagerProps) {
  const router = useRouter()
  const [projects, setProjects] = useState(initialProjects)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  function openNewModal() {
    setEditingProject(null)
    setError("")
    setIsModalOpen(true)
  }

  function openEditModal(project: Project) {
    setEditingProject(project)
    setError("")
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingProject(null)
    setError("")
  }

  async function handleSubmit(formData: FormData) {
    setError("")
    startTransition(async () => {
      const result = editingProject
        ? await updateProject(editingProject.id, formData)
        : await createProject(formData)
      
      if (result.success) {
        closeModal()
        router.refresh()
      } else {
        setError(result.error || "Something went wrong")
      }
    })
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return
    
    startTransition(async () => {
      const result = await deleteProject(id)
      if (result.success) {
        setProjects(projects.filter(p => p.id !== id))
        router.refresh()
      }
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <NeonButton onClick={openNewModal}>
          <Plus size={20} />
          Add Project
        </NeonButton>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <NeonButton variant="secondary" onClick={openNewModal}>
              <Plus size={20} />
              Add Your First Project
            </NeonButton>
          </GlassCard>
        ) : (
          projects.map((project) => (
            <GlassCard key={project.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 text-muted-foreground cursor-grab">
                  <GripVertical size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold truncate">{project.title}</h3>
                    {project.featured && (
                      <Star size={16} className="text-yellow-400 fill-yellow-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <span key={tech} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink size={18} />
                    </a>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-primary transition-colors">
                      <Github size={18} />
                    </a>
                  )}
                  <button onClick={() => openEditModal(project)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={closeModal} />
            
            <motion.div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <GlassCard className="p-6" glow>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingProject ? "Edit Project" : "Add Project"}
                  </h2>
                  <button onClick={closeModal} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form action={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        name="title"
                        defaultValue={editingProject?.title}
                        required
                        className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                        placeholder="Project title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Slug</label>
                      <input
                        name="slug"
                        defaultValue={editingProject?.slug}
                        required
                        className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                        placeholder="project-slug"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Short Description</label>
                    <input
                      name="description"
                      defaultValue={editingProject?.description}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                      placeholder="Brief description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Long Description</label>
                    <textarea
                      name="long_description"
                      defaultValue={editingProject?.long_description || ""}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none resize-none"
                      placeholder="Detailed description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
                    <input
                      name="technologies"
                      defaultValue={editingProject?.technologies.join(", ")}
                      className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                      placeholder="React, TypeScript, Next.js"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Live URL</label>
                      <input
                        name="live_url"
                        type="url"
                        defaultValue={editingProject?.live_url || ""}
                        className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">GitHub URL</label>
                      <input
                        name="github_url"
                        type="url"
                        defaultValue={editingProject?.github_url || ""}
                        className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>

                  <HybridImageInput
                    name="image_url"
                    label="Project Image"
                    defaultUrl={editingProject?.image_url}
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Sort Order</label>
                      <input
                        name="sort_order"
                        type="number"
                        defaultValue={editingProject?.sort_order || 0}
                        className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-8">
                      <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        value="true"
                        defaultChecked={editingProject?.featured}
                        className="w-5 h-5 rounded border-glass-border bg-input accent-primary"
                      />
                      <label htmlFor="featured" className="font-medium">Featured Project</label>
                    </div>
                  </div>

                  {error && (
                    <p className="text-destructive text-sm">{error}</p>
                  )}

                  <div className="flex justify-end gap-4 pt-4">
                    <NeonButton type="button" variant="ghost" onClick={closeModal}>
                      Cancel
                    </NeonButton>
                    <NeonButton type="submit" disabled={isPending}>
                      {isPending ? "Saving..." : editingProject ? "Update" : "Create"}
                    </NeonButton>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
