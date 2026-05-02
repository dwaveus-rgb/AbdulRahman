"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { AdminConfirmModal } from "@/components/admin/admin-confirm-modal"
import { IconInput, RenderIcon } from "@/components/admin/icon-input"
import { Plus, Trash2, Users, ExternalLink, Pencil, X } from "lucide-react"
import { getContacts, addContact, deleteContact, setStorageItem, STORAGE_KEYS, type LocalContact } from "@/lib/local-storage"

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<LocalContact[]>([])
  const [mounted, setMounted] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState<LocalContact | null>(null)
  
  // Form state
  const [name, setName] = useState("")
  const [icon, setIcon] = useState("")
  const [link, setLink] = useState("")
  
  // Confirmation modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  useEffect(() => {
    setMounted(true)
    loadContacts()
  }, [])

  function loadContacts() {
    setContacts(getContacts())
  }

  function handleAddContact(iconValue: string = icon) {
    if (!name.trim() || !link.trim()) return
    
    setPendingAction(() => () => {
      const contactData = {
        name: name.trim(),
        icon: iconValue && iconValue.trim() ? iconValue.trim() : "Link",
        link: link.trim(),
      }
      
      if (editingContact) {
        // Update existing contact
        const updatedContacts = contacts.map(c =>
          c.id === editingContact.id
            ? { ...c, ...contactData }
            : c
        )
        setStorageItem(STORAGE_KEYS.CONTACTS, updatedContacts)
      } else {
        // Add new contact
        addContact(contactData)
      }
      loadContacts()
      resetForm()
    })
    setConfirmModalOpen(true)
  }

  function handleEditContact(contact: LocalContact) {
    setEditingContact(contact)
    setName(contact.name)
    setIcon(contact.icon)
    setLink(contact.link)
    setShowForm(true)
  }

  function handleDeleteContact(id: string) {
    setPendingAction(() => () => {
      deleteContact(id)
      loadContacts()
    })
    setConfirmModalOpen(true)
  }

  function resetForm() {
    setName("")
    setIcon("")
    setLink("")
    setShowForm(false)
    setEditingContact(null)
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
    handleAddContact(iconValue || "Link")
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
          <h1 className="text-3xl font-bold mb-2 text-white">Contacts</h1>
          <p className="text-white/50">Manage your contact links and social profiles</p>
        </div>
        <NeonButton onClick={() => { resetForm(); setShowForm(!showForm) }}>
          <Plus size={20} className="mr-2" />
          Add Contact
        </NeonButton>
      </div>

      {/* Add/Edit Contact Form */}
      {showForm && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {editingContact ? "Edit Contact" : "Add New Contact"}
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
                placeholder="e.g. GitHub, LinkedIn, Email"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
              />
            </div>
            
            <IconInput
              name="icon"
              label="Icon"
              defaultValue={editingContact?.icon || ""}
              placeholder="e.g. Github, Linkedin, Mail"
            />
            
            <div className="space-y-2">
              <label htmlFor="link" className="block text-sm font-medium text-white/80">Redirect Link</label>
              <input
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <NeonButton type="submit" disabled={!name.trim() || !link.trim()}>
                {editingContact ? "Update Contact" : "Add Contact"}
              </NeonButton>
              <NeonButton type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </NeonButton>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Contacts List */}
      <div className="grid gap-4">
        {contacts.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Users className="mx-auto text-white/20 mb-4" size={48} />
            <h3 className="text-lg font-medium mb-2 text-white">No contacts yet</h3>
            <p className="text-white/40 mb-4">Add your first contact link to get started</p>
            <NeonButton onClick={() => setShowForm(true)}>
              <Plus size={20} className="mr-2" />
              Add Contact
            </NeonButton>
          </GlassCard>
        ) : (
          contacts.map((contact) => (
            <GlassCard key={contact.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/[0.08] text-white/60">
                  <RenderIcon value={contact.icon} size={24} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate text-white">{contact.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <span className="truncate">{contact.link}</span>
                    <a
                      href={contact.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                <button
                  className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
                  onClick={() => handleEditContact(contact)}
                  aria-label="Edit contact"
                >
                  <Pencil size={18} />
                </button>
                
                <button
                  className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  onClick={() => handleDeleteContact(contact.id)}
                  aria-label="Delete contact"
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
