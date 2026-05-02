"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { AdminConfirmModal } from "@/components/admin/admin-confirm-modal"
import { IconInput, RenderIcon } from "@/components/admin/icon-input"
import { Plus, Trash2, Zap, Pencil, X } from "lucide-react"
import { getSkills, addSkill, deleteSkill, setStorageItem, STORAGE_KEYS, type LocalSkill } from "@/lib/local-storage"

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<LocalSkill[]>([])
  const [mounted, setMounted] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingSkill, setEditingSkill] = useState<LocalSkill | null>(null)
  
  // Form state
  const [name, setName] = useState("")
  const [percentage, setPercentage] = useState(80)
  const [icon, setIcon] = useState("")
  
  // Confirmation modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  useEffect(() => {
    setMounted(true)
    loadSkills()
  }, [])

  function loadSkills() {
    setSkills(getSkills())
  }

  function handleAddSkill(iconValue: string = icon) {
    if (!name.trim()) return
    
    setPendingAction(() => () => {
      const newSkill = {
        name: name.trim(),
        percentage: Math.min(100, Math.max(0, percentage)),
        icon: iconValue && iconValue.trim() ? iconValue.trim() : undefined,
      }
      
      if (editingSkill) {
        // Update existing skill
        const updatedSkills = skills.map(s => 
          s.id === editingSkill.id 
            ? { ...s, ...newSkill }
            : s
        )
        setStorageItem(STORAGE_KEYS.SKILLS, updatedSkills)
      } else {
        // Add new skill
        addSkill(newSkill)
      }
      loadSkills()
      resetForm()
    })
    setConfirmModalOpen(true)
  }

  function handleEditSkill(skill: LocalSkill) {
    setEditingSkill(skill)
    setName(skill.name)
    setPercentage(skill.percentage)
    setIcon(skill.icon || "")
    setShowForm(true)
  }

  function handleDeleteSkill(id: string) {
    setPendingAction(() => () => {
      deleteSkill(id)
      loadSkills()
    })
    setConfirmModalOpen(true)
  }

  function resetForm() {
    setName("")
    setPercentage(80)
    setIcon("")
    setShowForm(false)
    setEditingSkill(null)
  }

  function handleConfirm() {
    if (pendingAction) {
      pendingAction()
      setPendingAction(null)
    }
  }

  // Handle form submission to capture hidden input values
  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const iconValue = formData.get("icon") as string
    handleAddSkill(iconValue || "")
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Skills</h1>
          <p className="text-white/50">Manage your technical skills and expertise</p>
        </div>
        <NeonButton onClick={() => { resetForm(); setShowForm(!showForm) }}>
          <Plus size={20} className="mr-2" />
          Add Skill
        </NeonButton>
      </div>

      {/* Add/Edit Skill Form */}
      {showForm && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {editingSkill ? "Edit Skill" : "Add New Skill"}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-white/80">Name</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. JavaScript, React, Node.js"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
              />
            </div>
            
            <IconInput
              name="icon"
              label="Icon"
              defaultValue={editingSkill?.icon || ""}
              placeholder="e.g. Code, Database, Terminal"
            />
            
            <div className="space-y-2">
              <label htmlFor="percentage" className="block text-sm font-medium text-white/80">Proficiency ({percentage}%)</label>
              <input
                id="percentage"
                type="range"
                min="0"
                max="100"
                value={percentage}
                onChange={(e) => setPercentage(parseInt(e.target.value))}
                className="w-full accent-white"
              />
              <div className="flex justify-between text-xs text-white/40">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <NeonButton type="submit" disabled={!name.trim()}>
                {editingSkill ? "Update Skill" : "Add Skill"}
              </NeonButton>
              <NeonButton type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </NeonButton>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Skills List */}
      <div className="grid gap-4">
        {skills.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Zap className="mx-auto text-white/20 mb-4" size={48} />
            <h3 className="text-lg font-medium mb-2 text-white">No skills yet</h3>
            <p className="text-white/40 mb-4">Add your first skill to get started</p>
            <NeonButton onClick={() => setShowForm(true)}>
              <Plus size={20} className="mr-2" />
              Add Skill
            </NeonButton>
          </GlassCard>
        ) : (
          skills.map((skill) => (
            <GlassCard key={skill.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/[0.08] text-white/60">
                  <RenderIcon value={skill.icon} size={24} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold truncate text-white">{skill.name}</h3>
                    <span className="text-sm text-white/50">{skill.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div
                      className="bg-white/80 h-1.5 rounded-full transition-all"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>

                <button
                  className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
                  onClick={() => handleEditSkill(skill)}
                  aria-label="Edit skill"
                >
                  <Pencil size={18} />
                </button>
                
                <button
                  className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  onClick={() => handleDeleteSkill(skill.id)}
                  aria-label="Delete skill"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      <AdminConfirmModal
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
