"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { createExperience, updateExperience, deleteExperience } from "@/app/actions/admin"
import { Plus, Pencil, Trash2, X, Briefcase } from "lucide-react"
import type { Experience } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"

interface ExperienceManagerProps {
  initialExperiences: Experience[]
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

export function ExperienceManager({ initialExperiences }: ExperienceManagerProps) {
  const router = useRouter()
  const [experiences, setExperiences] = useState(initialExperiences)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  function openNewModal() {
    setEditingExperience(null)
    setError("")
    setIsModalOpen(true)
  }

  function openEditModal(experience: Experience) {
    setEditingExperience(experience)
    setError("")
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingExperience(null)
    setError("")
  }

  async function handleSubmit(formData: FormData) {
    setError("")
    startTransition(async () => {
      const result = editingExperience
        ? await updateExperience(editingExperience.id, formData)
        : await createExperience(formData)
      
      if (result.success) {
        closeModal()
        router.refresh()
      } else {
        setError(result.error || "Something went wrong")
      }
    })
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this experience?")) return
    
    startTransition(async () => {
      const result = await deleteExperience(id)
      if (result.success) {
        setExperiences(experiences.filter(e => e.id !== id))
        router.refresh()
      }
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <NeonButton onClick={openNewModal}>
          <Plus size={20} />
          Add Experience
        </NeonButton>
      </div>

      {/* Experience List */}
      {experiences.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Briefcase className="mx-auto text-muted-foreground/50 mb-4" size={48} />
          <p className="text-muted-foreground mb-4">No experience added yet</p>
          <NeonButton variant="secondary" onClick={openNewModal}>
            <Plus size={20} />
            Add Your First Experience
          </NeonButton>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <GlassCard key={exp.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{exp.position}</h3>
                    {exp.is_current && (
                      <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">Current</span>
                    )}
                  </div>
                  <p className="text-primary font-medium">{exp.company}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(exp.start_date)} - {exp.is_current ? "Present" : exp.end_date ? formatDate(exp.end_date) : ""}
                  </p>
                  {exp.description && (
                    <p className="text-muted-foreground mt-3">{exp.description}</p>
                  )}
                  {exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {exp.technologies.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEditModal(exp)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(exp.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

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
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <GlassCard className="p-6" glow>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingExperience ? "Edit Experience" : "Add Experience"}
                  </h2>
                  <button onClick={closeModal} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form action={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Position</label>
                    <input
                      name="position"
                      defaultValue={editingExperience?.position}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                      placeholder="Senior Developer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <input
                      name="company"
                      defaultValue={editingExperience?.company}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                      placeholder="Company Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      defaultValue={editingExperience?.description || ""}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none resize-none"
                      placeholder="What did you do?"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Start Date</label>
                      <input
                        name="start_date"
                        type="date"
                        defaultValue={editingExperience?.start_date}
                        required
                        className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">End Date</label>
                      <input
                        name="end_date"
                        type="date"
                        defaultValue={editingExperience?.end_date || ""}
                        className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="is_current"
                      name="is_current"
                      value="true"
                      defaultChecked={editingExperience?.is_current}
                      className="w-5 h-5 rounded border-glass-border bg-input accent-primary"
                    />
                    <label htmlFor="is_current" className="font-medium">Currently working here</label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
                    <input
                      name="technologies"
                      defaultValue={editingExperience?.technologies.join(", ")}
                      className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                      placeholder="React, Node.js, AWS"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Sort Order</label>
                    <input
                      name="sort_order"
                      type="number"
                      defaultValue={editingExperience?.sort_order || 0}
                      className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                    />
                  </div>

                  {error && <p className="text-destructive text-sm">{error}</p>}

                  <div className="flex justify-end gap-4 pt-4">
                    <NeonButton type="button" variant="ghost" onClick={closeModal}>
                      Cancel
                    </NeonButton>
                    <NeonButton type="submit" disabled={isPending}>
                      {isPending ? "Saving..." : editingExperience ? "Update" : "Create"}
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
