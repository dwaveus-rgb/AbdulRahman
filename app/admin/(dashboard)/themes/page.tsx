"use client"

import { useState, useEffect, useRef } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { AdminConfirmModal } from "@/components/admin/admin-confirm-modal"
import { triggerThemeChange } from "@/components/theme-injector"
import { 
  Plus, 
  Trash2, 
  Palette, 
  Check, 
  X, 
  Pencil,
  Eye,
  Code,
  Star,
  Copy,
  Download,
  FileCode,
  Maximize2,
  Minimize2
} from "lucide-react"
import { 
  getThemes, 
  addTheme, 
  updateTheme,
  deleteTheme, 
  getActiveThemeId,
  setActiveThemeId,
  DEFAULT_THEME_CSS,
  type LocalTheme 
} from "@/lib/local-storage"

// Full CSS template with all customizable variables
const FULL_CSS_TEMPLATE = `/* ============================================
   PORTFOLIO THEME TEMPLATE
   Full customization options for your portfolio
   ============================================ */

:root {
  /* -------- Core Colors -------- */
  --background: #0a0a0a;
  --foreground: #fafafa;
  
  /* -------- Card & Container -------- */
  --card: rgba(255, 255, 255, 0.08);
  --card-foreground: #fafafa;
  
  /* -------- Primary Brand Color -------- */
  --primary: #fafafa;
  --primary-foreground: #0a0a0a;
  
  /* -------- Secondary Color -------- */
  --secondary: rgba(255, 255, 255, 0.1);
  --secondary-foreground: #fafafa;
  
  /* -------- Muted Elements -------- */
  --muted: rgba(255, 255, 255, 0.06);
  --muted-foreground: #a1a1aa;
  
  /* -------- Accent Color -------- */
  --accent: rgba(255, 255, 255, 0.12);
  --accent-foreground: #fafafa;
  
  /* -------- Borders -------- */
  --border: rgba(255, 255, 255, 0.12);
  --input: rgba(255, 255, 255, 0.12);
  --ring: rgba(255, 255, 255, 0.25);
  
  /* -------- Glass Effect -------- */
  --glass: rgba(255, 255, 255, 0.08);
  --glass-border: rgba(255, 255, 255, 0.12);
  --glass-blur: 20px;
  
  /* -------- Gradients -------- */
  --gradient-start: rgba(255, 255, 255, 0.1);
  --gradient-end: rgba(255, 255, 255, 0.02);
  
  /* -------- Shadows -------- */
  --shadow-color: rgba(0, 0, 0, 0.3);
  --glow-color: rgba(255, 255, 255, 0.1);
  
  /* -------- Status Colors -------- */
  --destructive: #ef4444;
  --destructive-foreground: #fafafa;
  --success: #22c55e;
  --warning: #eab308;
  
  /* -------- Border Radius -------- */
  --radius: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
}

/* -------- Custom Background Pattern -------- */
body {
  background: var(--background);
  /* Uncomment below for gradient background */
  /* background: linear-gradient(135deg, var(--background) 0%, #1a1a2e 100%); */
}

/* -------- Glass Card Styling -------- */
.glass-card {
  background: var(--glass);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(var(--glass-blur));
}

/* -------- Button Customization -------- */
.neon-button {
  /* Add custom button styles here */
}

/* -------- Skill Bar Styling -------- */
.skill-bar {
  /* Customize skill progress bars */
}

/* -------- Animation Overrides -------- */
@keyframes custom-glow {
  0%, 100% { box-shadow: 0 0 20px var(--glow-color); }
  50% { box-shadow: 0 0 40px var(--glow-color); }
}
`

export default function AdminThemesPage() {
  const [themes, setThemes] = useState<LocalTheme[]>([])
  const [activeThemeId, setActiveTheme] = useState<string>("default")
  const [mounted, setMounted] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingTheme, setEditingTheme] = useState<LocalTheme | null>(null)
  const [previewingTheme, setPreviewingTheme] = useState<LocalTheme | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // Form state
  const [name, setName] = useState("")
  const [css, setCss] = useState("")
  
  // Refs
  const editorRef = useRef<HTMLTextAreaElement>(null)
  
  // Confirmation modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  useEffect(() => {
    setMounted(true)
    loadThemes()
    setActiveTheme(getActiveThemeId())
  }, [])

  function loadThemes() {
    setThemes(getThemes())
  }

  function handleAddTheme() {
    if (!name.trim() || !css.trim()) return
    
    setPendingAction(() => () => {
      if (editingTheme) {
        updateTheme(editingTheme.id, {
          name: name.trim(),
          css: css.trim(),
        })
      } else {
        addTheme({
          name: name.trim(),
          css: css.trim(),
        })
      }
      loadThemes()
      resetForm()
      triggerThemeChange()
    })
    setConfirmModalOpen(true)
  }

  function handleEditTheme(theme: LocalTheme) {
    setEditingTheme(theme)
    setName(theme.name)
    setCss(theme.css)
    setShowForm(true)
  }

  function handleDeleteTheme(id: string) {
    const theme = themes.find(t => t.id === id)
    if (theme?.isDefault) return
    
    setPendingAction(() => () => {
      deleteTheme(id)
      loadThemes()
      setActiveTheme(getActiveThemeId())
      triggerThemeChange()
    })
    setConfirmModalOpen(true)
  }

  function handleActivateTheme(id: string) {
    setActiveThemeId(id)
    setActiveTheme(id)
    triggerThemeChange()
  }

  function handlePreviewTheme(theme: LocalTheme) {
    setPreviewingTheme(theme)
    // Temporarily inject preview CSS
    const existingPreview = document.getElementById("preview-theme-styles")
    if (existingPreview) existingPreview.remove()
    
    const style = document.createElement("style")
    style.id = "preview-theme-styles"
    style.textContent = theme.css
    document.head.appendChild(style)
  }

  function stopPreview() {
    const existingPreview = document.getElementById("preview-theme-styles")
    if (existingPreview) existingPreview.remove()
    setPreviewingTheme(null)
  }

  function resetForm() {
    setName("")
    setCss("")
    setShowForm(false)
    setEditingTheme(null)
    setIsFullscreen(false)
  }

  function handleConfirm() {
    if (pendingAction) {
      pendingAction()
      setPendingAction(null)
    }
  }

  // Template functions
  function handleCopyTemplate() {
    navigator.clipboard.writeText(FULL_CSS_TEMPLATE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownloadTemplate() {
    const blob = new Blob([FULL_CSS_TEMPLATE], { type: "text/css" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "theme-template.css"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handleLoadTemplate() {
    setCss(FULL_CSS_TEMPLATE)
    setShowTemplateModal(false)
  }

  // Get current theme CSS for export
  function handleExportCurrentTheme() {
    const activeTheme = themes.find(t => t.id === activeThemeId)
    if (!activeTheme) return
    
    const blob = new Blob([activeTheme.css], { type: "text/css" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${activeTheme.name.toLowerCase().replace(/\s+/g, "-")}-theme.css`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
          <h1 className="text-3xl font-bold mb-2 text-white">Themes</h1>
          <p className="text-white/50">Customize the look and feel of your portfolio</p>
        </div>
        <div className="flex gap-2">
          <NeonButton variant="secondary" onClick={() => setShowTemplateModal(true)}>
            <FileCode size={20} className="mr-2" />
            Get Template
          </NeonButton>
          <NeonButton onClick={() => { resetForm(); setShowForm(!showForm) }}>
            <Plus size={20} className="mr-2" />
            Add Theme
          </NeonButton>
        </div>
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <GlassCard className="w-full max-w-4xl max-h-[90vh] overflow-hidden m-4">
            <div className="flex items-center justify-between p-4 border-b border-white/[0.1]">
              <h2 className="text-xl font-bold text-white">CSS Theme Template</h2>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <pre className="p-4 rounded-xl bg-black/40 border border-white/[0.08] text-sm text-white/80 overflow-x-auto font-mono whitespace-pre-wrap">
                {FULL_CSS_TEMPLATE}
              </pre>
            </div>
            <div className="flex items-center justify-between p-4 border-t border-white/[0.1]">
              <p className="text-sm text-white/40">Use this template as a starting point for your custom theme</p>
              <div className="flex gap-2">
                <NeonButton variant="secondary" onClick={handleCopyTemplate}>
                  {copied ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
                  {copied ? "Copied!" : "Copy"}
                </NeonButton>
                <NeonButton variant="secondary" onClick={handleDownloadTemplate}>
                  <Download size={16} className="mr-2" />
                  Download
                </NeonButton>
                <NeonButton onClick={handleLoadTemplate}>
                  <Code size={16} className="mr-2" />
                  Load in Editor
                </NeonButton>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Preview Banner */}
      {previewingTheme && (
        <GlassCard className="p-4 border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye size={20} className="text-yellow-400" />
              <span className="text-white">
                Previewing: <strong>{previewingTheme.name}</strong>
              </span>
            </div>
            <div className="flex gap-2">
              <NeonButton 
                variant="secondary" 
                onClick={() => {
                  handleActivateTheme(previewingTheme.id)
                  stopPreview()
                }}
              >
                <Check size={16} className="mr-1" />
                Apply
              </NeonButton>
              <NeonButton variant="ghost" onClick={stopPreview}>
                <X size={16} className="mr-1" />
                Cancel
              </NeonButton>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Add/Edit Theme Form */}
      {showForm && (
        <GlassCard className={`p-6 ${isFullscreen ? "fixed inset-4 z-50 overflow-auto" : ""}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {editingTheme ? "Edit Theme" : "Add New Theme"}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen editor"}
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button
                onClick={resetForm}
                className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-white/80">Theme Name</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ocean Blue, Midnight Purple"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="css" className="block text-sm font-medium text-white/80">Custom CSS</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCss(DEFAULT_THEME_CSS)}
                    className="text-xs text-white/40 hover:text-white/70 transition-colors px-2 py-1 rounded bg-white/[0.05]"
                  >
                    Load default
                  </button>
                  <button
                    type="button"
                    onClick={() => setCss(FULL_CSS_TEMPLATE)}
                    className="text-xs text-white/40 hover:text-white/70 transition-colors px-2 py-1 rounded bg-white/[0.05]"
                  >
                    Load full template
                  </button>
                </div>
              </div>
              <textarea
                ref={editorRef}
                id="css"
                value={css}
                onChange={(e) => setCss(e.target.value)}
                placeholder={`/* Paste your custom CSS here */
:root {
  --background: #0a0a0a;
  --foreground: #fafafa;
  --primary: #3b82f6;
  /* ... more variables */
}`}
                rows={isFullscreen ? 30 : 16}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.12] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30 font-mono text-sm resize-none"
                spellCheck={false}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/40">
                  Override CSS variables like --background, --foreground, --primary, --glass, etc.
                </p>
                <p className="text-xs text-white/40">
                  {css.length} characters
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <NeonButton onClick={handleAddTheme} disabled={!name.trim() || !css.trim()}>
                {editingTheme ? "Update Theme" : "Add Theme"}
              </NeonButton>
              <NeonButton variant="secondary" onClick={resetForm}>
                Cancel
              </NeonButton>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Themes List */}
      <div className="grid gap-4">
        {themes.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Palette className="mx-auto text-white/20 mb-4" size={48} />
            <h3 className="text-lg font-medium mb-2 text-white">No themes yet</h3>
            <p className="text-white/40 mb-4">Add your first custom theme</p>
            <NeonButton onClick={() => setShowForm(true)}>
              <Plus size={20} className="mr-2" />
              Add Theme
            </NeonButton>
          </GlassCard>
        ) : (
          themes.map((theme) => (
            <GlassCard 
              key={theme.id} 
              className={`p-5 transition-all ${
                activeThemeId === theme.id 
                  ? "ring-2 ring-white/30 bg-white/[0.08]" 
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  theme.isDefault 
                    ? "bg-gradient-to-br from-white/20 to-white/5" 
                    : "bg-white/[0.08]"
                } text-white/70`}>
                  {theme.isDefault ? <Star size={24} /> : <Palette size={24} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold truncate text-white">{theme.name}</h3>
                    {theme.isDefault && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-white/60">
                        Default
                      </span>
                    )}
                    {activeThemeId === theme.id && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/40 mt-1">
                    {theme.css.length} characters of CSS
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {activeThemeId !== theme.id && (
                    <NeonButton
                      variant="secondary"
                      onClick={() => handleActivateTheme(theme.id)}
                      className="text-sm"
                    >
                      <Check size={16} className="mr-1" />
                      Activate
                    </NeonButton>
                  )}

                  <button
                    className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
                    onClick={() => handlePreviewTheme(theme)}
                    aria-label="Preview theme"
                    title="Preview"
                  >
                    <Eye size={18} />
                  </button>

                  {!theme.isDefault && (
                    <>
                      <button
                        className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
                        onClick={() => handleEditTheme(theme)}
                        aria-label="Edit theme"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      
                      <button
                        className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        onClick={() => handleDeleteTheme(theme.id)}
                        aria-label="Delete theme"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* CSS Preview */}
              <details className="mt-4">
                <summary className="flex items-center gap-2 text-sm text-white/50 cursor-pointer hover:text-white/70 transition-colors">
                  <Code size={14} />
                  View CSS
                </summary>
                <div className="mt-3 relative">
                  <pre className="p-4 rounded-xl bg-black/30 border border-white/[0.08] text-xs text-white/60 overflow-x-auto font-mono max-h-48">
                    {theme.css}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(theme.css)
                    }}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-white/[0.1] hover:bg-white/[0.2] text-white/60 hover:text-white transition-all"
                    title="Copy CSS"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </details>
            </GlassCard>
          ))
        )}
      </div>

      {/* Export Current Theme */}
      {themes.length > 0 && (
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-white">Export Active Theme</h3>
              <p className="text-sm text-white/40">Download the currently active theme as a CSS file</p>
            </div>
            <NeonButton variant="secondary" onClick={handleExportCurrentTheme}>
              <Download size={16} className="mr-2" />
              Export CSS
            </NeonButton>
          </div>
        </GlassCard>
      )}

      <AdminConfirmModal
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
