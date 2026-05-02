"use client"

import { useState, useEffect, useRef } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { AdminConfirmModal } from "@/components/admin/admin-confirm-modal"
import { Plus, Trash2, Image as ImageIcon, Folder, Pencil, X, Upload, Link as LinkIcon, ExternalLink } from "lucide-react"
import { getProjects, addProject, deleteProject, setStorageItem, STORAGE_KEYS, type LocalProject } from "@/lib/local-storage"

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<LocalProject[]>([])
  const [mounted, setMounted] = useState(false)
  const [showForm, setShowForm] = useState(false)
  
  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [tags, setTags] = useState("")
  const [projectLink, setProjectLink] = useState("")
  
  // Image upload mode
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload")
  const [imageUrl, setImageUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  
  // Edit mode
  const [editingProject, setEditingProject] = useState<LocalProject | null>(null)
  
  // Confirmation modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  useEffect(() => {
    setMounted(true)
    loadProjects()
  }, [])

  function loadProjects() {
    setProjects(getProjects())
  }

  function handleFileUpload(file: File, isCover: boolean = true) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      if (isCover) {
        setCoverImage(base64)
      } else {
        setGalleryImages(prev => [...prev, base64])
      }
    }
    reader.readAsDataURL(file)
  }

  function handleCoverFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      handleFileUpload(file, true)
    }
  }

  function handleGalleryFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith("image/")) {
          handleFileUpload(file, false)
        }
      })
    }
  }

  function addImageUrl() {
    if (imageUrl.trim()) {
      if (!coverImage) {
        setCoverImage(imageUrl.trim())
      } else {
        setGalleryImages(prev => [...prev, imageUrl.trim()])
      }
      setImageUrl("")
    }
  }

  function removeGalleryImage(index: number) {
    setGalleryImages(prev => prev.filter((_, i) => i !== index))
  }

  function handleSubmit() {
    if (!title.trim()) return
    
    setPendingAction(() => () => {
      const projectData = {
        title: title.trim(),
        description: description.trim(),
        image_url: coverImage,
        images: galleryImages,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        link: projectLink.trim() || undefined,
      }
      
      if (editingProject) {
        const updatedProjects = projects.map(p =>
          p.id === editingProject.id
            ? { ...p, ...projectData }
            : p
        )
        setStorageItem(STORAGE_KEYS.PROJECTS, updatedProjects)
      } else {
        addProject(projectData)
      }
      loadProjects()
      resetForm()
    })
    setConfirmModalOpen(true)
  }

  function handleDeleteProject(id: string) {
    setPendingAction(() => () => {
      deleteProject(id)
      loadProjects()
    })
    setConfirmModalOpen(true)
  }

  function handleEditProject(project: LocalProject) {
    setEditingProject(project)
    setTitle(project.title)
    setDescription(project.description)
    setCoverImage(project.image_url)
    setGalleryImages(project.images || [])
    setTags((project.tags || []).join(", "))
    setProjectLink(project.link || "")
    setShowForm(true)
  }

  function resetForm() {
    setTitle("")
    setDescription("")
    setCoverImage("")
    setGalleryImages([])
    setTags("")
    setProjectLink("")
    setImageUrl("")
    setShowForm(false)
    setEditingProject(null)
  }

  function handleConfirm() {
    if (pendingAction) {
      pendingAction()
      setPendingAction(null)
    }
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
          <h1 className="text-3xl font-bold mb-2 text-white">Projects</h1>
          <p className="text-white/50">Manage your portfolio projects with multiple images</p>
        </div>
        <NeonButton onClick={() => setShowForm(!showForm)}>
          <Plus size={20} className="mr-2" />
          Add Project
        </NeonButton>
      </div>

      {/* Add/Edit Project Form */}
      {showForm && (
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold mb-6 text-white">
            {editingProject ? "Edit Project" : "Add New Project"}
          </h2>
          
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-white/80">
                Project Title *
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
              />
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-white/80">
                Full Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed project description (shown in detail view)"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30 min-h-[120px] resize-none"
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-white/80">
                Cover Image (Thumbnail)
              </label>
              
              {/* Mode Toggle */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setImageMode("upload")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    imageMode === "upload"
                      ? "bg-white/[0.15] text-white"
                      : "bg-white/[0.05] text-white/50 hover:text-white/70"
                  }`}
                >
                  <Upload size={16} className="inline mr-2" />
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode("url")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    imageMode === "url"
                      ? "bg-white/[0.15] text-white"
                      : "bg-white/[0.05] text-white/50 hover:text-white/70"
                  }`}
                >
                  <LinkIcon size={16} className="inline mr-2" />
                  URL
                </button>
              </div>

              {imageMode === "upload" ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/[0.15] rounded-xl p-6 text-center cursor-pointer hover:border-white/[0.25] transition-colors"
                >
                  {coverImage ? (
                    <div className="relative inline-block">
                      <img
                        src={coverImage}
                        alt="Cover preview"
                        className="max-h-40 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setCoverImage("")
                        }}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto text-white/30 mb-2" size={32} />
                      <p className="text-white/50 text-sm">Click to upload cover image</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
                  />
                  <NeonButton type="button" onClick={addImageUrl} disabled={!imageUrl.trim()}>
                    Add
                  </NeonButton>
                </div>
              )}
            </div>

            {/* Gallery Images */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-white/80">
                Gallery Images (Multiple)
              </label>
              
              <div
                onClick={() => galleryInputRef.current?.click()}
                className="border-2 border-dashed border-white/[0.15] rounded-xl p-4 text-center cursor-pointer hover:border-white/[0.25] transition-colors"
              >
                <Upload className="mx-auto text-white/30 mb-2" size={24} />
                <p className="text-white/50 text-sm">Click to add more images to gallery</p>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryFilesChange}
                  className="hidden"
                />
              </div>

              {/* Gallery Preview */}
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {galleryImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Gallery ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label htmlFor="tags" className="block text-sm font-medium text-white/80">
                Tags (comma separated)
              </label>
              <input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="React, TypeScript, Tailwind"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
              />
            </div>

            {/* Project Link */}
            <div className="space-y-2">
              <label htmlFor="link" className="block text-sm font-medium text-white/80">
                Project Link (optional)
              </label>
              <input
                id="link"
                value={projectLink}
                onChange={(e) => setProjectLink(e.target.value)}
                placeholder="https://myproject.com"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
              />
            </div>
            
            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <NeonButton onClick={handleSubmit} disabled={!title.trim()}>
                {editingProject ? "Update Project" : "Add Project"}
              </NeonButton>
              <NeonButton variant="secondary" onClick={resetForm}>
                Cancel
              </NeonButton>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Projects List */}
      <div className="grid gap-4">
        {projects.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Folder className="mx-auto text-white/20 mb-4" size={48} />
            <h3 className="text-lg font-medium mb-2 text-white">No projects yet</h3>
            <p className="text-white/40 mb-4">Add your first project with multiple images</p>
            <NeonButton onClick={() => setShowForm(true)}>
              <Plus size={20} className="mr-2" />
              Add Project
            </NeonButton>
          </GlassCard>
        ) : (
          projects.map((project) => (
            <GlassCard key={project.id} className="p-4">
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-24 h-24 object-cover rounded-xl border border-white/[0.1]"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl border border-white/[0.1] bg-white/[0.05] flex items-center justify-center">
                    <ImageIcon className="text-white/30" size={28} />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-white">{project.title}</h3>
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.tags.slice(0, 4).map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.08] text-white/50 text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl text-white/40 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                          aria-label="Open project link"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                      <button
                        className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
                        onClick={() => handleEditProject(project)}
                        aria-label="Edit project"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        onClick={() => handleDeleteProject(project.id)}
                        aria-label="Delete project"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-white/40 text-sm line-clamp-2 mt-2">{project.description}</p>
                  
                  <div className="flex items-center gap-4 mt-3 text-xs text-white/30">
                    <span>{project.images?.length || 0} gallery images</span>
                    <span>Added {new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
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
