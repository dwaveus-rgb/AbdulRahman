"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { createSkill, updateSkill, deleteSkill } from "@/app/actions/admin"
import { HybridImageInput } from "@/components/admin/hybrid-image-input"
import { Plus, Pencil, Trash2, X, Zap } from "lucide-react"
import type { Skill } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"

interface SkillsManagerProps {
  initialSkills: Skill[]
}

const CATEGORIES = ["Frontend", "Backend", "Database", "DevOps", "Tools", "Languages", "Other"]

export function SkillsManager({ initialSkills }: SkillsManagerProps) {
  const router = useRouter()
  const [skills, setSkills] = useState(initialSkills)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  // Group by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  function openNewModal() {
    setEditingSkill(null)
    setError("")
    setIsModalOpen(true)
  }

  function openEditModal(skill: Skill) {
    setEditingSkill(skill)
    setError("")
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingSkill(null)
    setError("")
  }

  async function handleSubmit(formData: FormData) {
    setError("")
    startTransition(async () => {
      const result = editingSkill
        ? await updateSkill(editingSkill.id, formData)
        : await createSkill(formData)
      
      if (result.success) {
        closeModal()
        router.refresh()
      } else {
        setError(result.error || "Something went wrong")
      }
    })
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this skill?")) return
    
    startTransition(async () => {
      const result = await deleteSkill(id)
      if (result.success) {
        setSkills(skills.filter(s => s.id !== id))
        router.refresh()
      }
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <NeonButton onClick={openNewModal}>
          <Plus size={20} />
          Add Skill
        </NeonButton>
      </div>

      {/* Skills by Category */}
      {Object.keys(groupedSkills).length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Zap className="mx-auto text-muted-foreground/50 mb-4" size={48} />
          <p className="text-muted-foreground mb-4">No skills yet</p>
          <NeonButton variant="secondary" onClick={openNewModal}>
            <Plus size={20} />
            Add Your First Skill
          </NeonButton>
        </GlassCard>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <GlassCard key={category} className="p-6">
              <h3 className="text-lg font-bold text-primary mb-4">{category}</h3>
              <div className="space-y-3">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-4 p-3 rounded-lg bg-surface/50">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.proficiency}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-[#00FFB2] rounded-full transition-all"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditModal(skill)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(skill.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
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
              className="relative w-full max-w-md"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <GlassCard className="p-6" glow>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingSkill ? "Edit Skill" : "Add Skill"}
                  </h2>
                  <button onClick={closeModal} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form action={handleSubmit} className="space-y-4">
                  <div className="flex items-start gap-4">
                    <HybridImageInput
                      name="icon"
                      label="Icon"
                      defaultUrl={editingSkill?.icon}
                      compact
                    />
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input
                        name="name"
                        defaultValue={editingSkill?.name}
                        required
                        className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                        placeholder="Skill name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      name="category"
                      defaultValue={editingSkill?.category || "Frontend"}
                      className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Proficiency ({editingSkill?.proficiency || 80}%)</label>
                    <input
                      name="proficiency"
                      type="range"
                      min="0"
                      max="100"
                      defaultValue={editingSkill?.proficiency || 80}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Sort Order</label>
                    <input
                      name="sort_order"
                      type="number"
                      defaultValue={editingSkill?.sort_order || 0}
                      className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                    />
                  </div>

                  {error && <p className="text-destructive text-sm">{error}</p>}

                  <div className="flex justify-end gap-4 pt-4">
                    <NeonButton type="button" variant="ghost" onClick={closeModal}>
                      Cancel
                    </NeonButton>
                    <NeonButton type="submit" disabled={isPending}>
                      {isPending ? "Saving..." : editingSkill ? "Update" : "Create"}
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
