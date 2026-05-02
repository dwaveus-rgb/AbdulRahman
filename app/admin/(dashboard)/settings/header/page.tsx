"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { AdminConfirmModal } from "@/components/admin/admin-confirm-modal"
import { Check, Globe, Type, Image as ImageIcon, Eye, RefreshCw, Upload, Link, Sparkles } from "lucide-react"
import { getHeaderSettings, setHeaderSettings, type HeaderSettings, type IconData } from "@/lib/local-storage"
import * as LucideIcons from "lucide-react"

// Popular icons for quick selection
const POPULAR_ICONS = [
  "Code", "Globe", "Zap", "Star", "Heart", "Sparkles", "Rocket", "Terminal",
  "Palette", "Layers", "Box", "Coffee", "Sun", "Moon", "Cloud", "Compass"
]

// Render icon helper
function RenderFavicon({ data, size = 16, className = "" }: { data: IconData; size?: number; className?: string }) {
  if (data.type === "upload" || data.type === "url") {
    if (data.value && data.value.length > 0) {
      return <img src={data.value} alt="Favicon" className={`object-cover rounded ${className}`} style={{ width: size, height: size }} />
    }
  }
  
  // Lucide icon
  const iconName = data.value || "Code"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[iconName]
  if (Icon) {
    return <Icon size={size} className={className} />
  }
  return <LucideIcons.Code size={size} className={className} />
}

export default function HeaderSettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState<HeaderSettings>({
    title: "Portfolio | Full-Stack Developer",
    headerText: "Developer Portfolio",
    favicon: { type: "icon", value: "Code" }
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  // Icon input state
  const [iconMode, setIconMode] = useState<"upload" | "url" | "icon">("icon")
  const [iconName, setIconName] = useState("Code")
  const [iconUrl, setIconUrl] = useState("")
  const [iconPreview, setIconPreview] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Confirmation modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  useEffect(() => {
    setMounted(true)
    const loaded = getHeaderSettings()
    setSettings(loaded)
    
    // Initialize icon input state from loaded settings
    if (loaded.favicon) {
      setIconMode(loaded.favicon.type)
      if (loaded.favicon.type === "icon") {
        setIconName(loaded.favicon.value || "Code")
      } else {
        setIconUrl(loaded.favicon.value || "")
        setIconPreview(loaded.favicon.value || "")
      }
    }
  }, [])

  // Build current favicon data from state
  const getCurrentFavicon = useCallback((): IconData => {
    if (iconMode === "icon") {
      return { type: "icon", value: iconName }
    } else if (iconMode === "upload") {
      return { type: "upload", value: iconPreview || iconUrl }
    } else {
      return { type: "url", value: iconUrl }
    }
  }, [iconMode, iconName, iconUrl, iconPreview])

  // Generate SVG favicon from icon name
  function generateSvgFavicon(iconNameValue: string): string {
    const letter = iconNameValue.charAt(0).toUpperCase()
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0a0a0a"/><text x="16" y="22" text-anchor="middle" fill="#fafafa" font-family="system-ui" font-size="18" font-weight="600">${letter}</text></svg>`
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }

  // Update document title in real-time for preview
  const updatePreviewTitle = useCallback((title: string) => {
    document.title = title || "Portfolio"
  }, [])

  // Update favicon dynamically
  const updateFavicon = useCallback((faviconData: IconData) => {
    const existingFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    let href: string
    
    if (faviconData.type === "url" || faviconData.type === "upload") {
      href = faviconData.value || generateSvgFavicon("P")
    } else {
      href = generateSvgFavicon(faviconData.value || "P")
    }
    
    if (existingFavicon) {
      existingFavicon.href = href
    } else {
      const link = document.createElement("link")
      link.rel = "icon"
      link.href = href
      document.head.appendChild(link)
    }
  }, [])

  // Handle file upload
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setIconPreview(base64)
      setIconUrl(base64)
      // Update preview immediately
      updateFavicon({ type: "upload", value: base64 })
    }
    reader.readAsDataURL(file)
  }

  // Handle URL change
  function handleUrlChange(url: string) {
    setIconUrl(url)
    if (url) {
      updateFavicon({ type: "url", value: url })
    }
  }

  // Handle icon selection
  function handleIconSelect(name: string) {
    setIconName(name)
    updateFavicon({ type: "icon", value: name })
  }

  function handleSave() {
    const faviconData = getCurrentFavicon()
    const updatedSettings = {
      ...settings,
      favicon: faviconData
    }
    
    setPendingAction(() => () => {
      setIsSaving(true)
      setHeaderSettings(updatedSettings)
      setSettings(updatedSettings)
      
      // Apply changes immediately
      updatePreviewTitle(updatedSettings.title)
      updateFavicon(updatedSettings.favicon)
      
      // Trigger storage event for other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'portfolio_header_settings',
        newValue: JSON.stringify(updatedSettings)
      }))
      
      setTimeout(() => {
        setIsSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }, 500)
    })
    setConfirmModalOpen(true)
  }

  function handleConfirm() {
    if (pendingAction) {
      pendingAction()
      setPendingAction(null)
    }
  }

  function handleReset() {
    const defaultSettings: HeaderSettings = {
      title: "Portfolio | Full-Stack Developer",
      headerText: "Developer Portfolio",
      favicon: { type: "icon", value: "Code" }
    }
    setSettings(defaultSettings)
    setIconMode("icon")
    setIconName("Code")
    setIconUrl("")
    setIconPreview("")
    updatePreviewTitle(defaultSettings.title)
    updateFavicon(defaultSettings.favicon)
  }

  // Get current preview favicon
  const previewFavicon = getCurrentFavicon()

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
          <h1 className="text-3xl font-bold mb-2 text-white">Header Settings</h1>
          <p className="text-white/50">Customize your website title, header, and favicon</p>
        </div>
      </div>

      {/* Live Preview Card */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye size={20} className="text-white/60" />
          <h2 className="text-lg font-semibold text-white">Live Preview</h2>
        </div>
        
        {/* Browser Tab Preview */}
        <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.08]">
          <p className="text-xs text-white/40 mb-3">Browser Tab Preview</p>
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
            {/* Tab bar */}
            <div className="flex items-center bg-[#2a2a2a] px-2 py-1">
              <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-t-lg px-3 py-1.5 max-w-[200px]">
                <div className="flex-shrink-0">
                  <RenderFavicon data={previewFavicon} size={14} className="text-white/70" />
                </div>
                <span className="text-xs text-white/80 truncate">{settings.title || "Untitled"}</span>
              </div>
            </div>
            {/* Address bar */}
            <div className="px-3 py-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2 bg-white/[0.05] rounded-lg px-3 py-1.5">
                <Globe size={12} className="text-white/40" />
                <span className="text-xs text-white/50">yoursite.com</span>
              </div>
            </div>
            {/* Content preview */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <RenderFavicon data={previewFavicon} size={24} className="text-white/70" />
                <span className="font-semibold text-white">{settings.headerText || "Header"}</span>
              </div>
              <div className="h-2 bg-white/[0.1] rounded w-3/4 mb-2" />
              <div className="h-2 bg-white/[0.06] rounded w-1/2" />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Settings Form */}
      <GlassCard className="p-6">
        <div className="space-y-6">
          {/* Website Title */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-white/80">
              <Type size={16} />
              Website Title (Browser Tab)
            </label>
            <input
              type="text"
              value={settings.title}
              onChange={(e) => {
                setSettings(prev => ({ ...prev, title: e.target.value }))
                updatePreviewTitle(e.target.value)
              }}
              placeholder="Portfolio | Full-Stack Developer"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
            />
            <p className="text-xs text-white/40">This appears in the browser tab and search results</p>
          </div>

          {/* Header Text */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-white/80">
              <Type size={16} />
              Header Text (Visible in UI)
            </label>
            <input
              type="text"
              value={settings.headerText}
              onChange={(e) => setSettings(prev => ({ ...prev, headerText: e.target.value }))}
              placeholder="Developer Portfolio"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
            />
            <p className="text-xs text-white/40">This text appears in the header/navigation area</p>
          </div>

          {/* Favicon / Header Icon - 3 Mode Input */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium text-white/80">
              <ImageIcon size={16} />
              Favicon / Header Icon
            </label>
            
            {/* Mode Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIconMode("upload")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  iconMode === "upload"
                    ? "bg-white/[0.15] border-white/30 text-white"
                    : "bg-white/[0.05] border-white/[0.1] text-white/50 hover:text-white/70"
                }`}
              >
                <Upload size={16} />
                Upload
              </button>
              <button
                type="button"
                onClick={() => setIconMode("url")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  iconMode === "url"
                    ? "bg-white/[0.15] border-white/30 text-white"
                    : "bg-white/[0.05] border-white/[0.1] text-white/50 hover:text-white/70"
                }`}
              >
                <Link size={16} />
                URL
              </button>
              <button
                type="button"
                onClick={() => setIconMode("icon")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  iconMode === "icon"
                    ? "bg-white/[0.15] border-white/30 text-white"
                    : "bg-white/[0.05] border-white/[0.1] text-white/50 hover:text-white/70"
                }`}
              >
                <Sparkles size={16} />
                Icon
              </button>
            </div>

            {/* Upload Mode */}
            {iconMode === "upload" && (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-3 px-4 py-6 rounded-xl border-2 border-dashed border-white/[0.15] hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.05] transition-all text-white/60 hover:text-white/80"
                >
                  <Upload size={24} />
                  <span>Click to upload image</span>
                </button>
                {iconPreview && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.05] border border-white/[0.1]">
                    <img src={iconPreview} alt="Preview" className="w-10 h-10 rounded-lg object-cover" />
                    <span className="text-sm text-white/60">Image uploaded successfully</span>
                  </div>
                )}
              </div>
            )}

            {/* URL Mode */}
            {iconMode === "url" && (
              <div className="space-y-3">
                <input
                  type="url"
                  value={iconUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://example.com/favicon.png"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
                />
                {iconUrl && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.05] border border-white/[0.1]">
                    <img src={iconUrl} alt="Preview" className="w-10 h-10 rounded-lg object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                    <span className="text-sm text-white/60 truncate">{iconUrl}</span>
                  </div>
                )}
              </div>
            )}

            {/* Icon Mode */}
            {iconMode === "icon" && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={iconName}
                  onChange={(e) => handleIconSelect(e.target.value)}
                  placeholder="e.g. Code, Globe, Zap"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
                />
                <div className="grid grid-cols-8 gap-2">
                  {POPULAR_ICONS.map((name) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const Icon = (LucideIcons as any)[name]
                    if (!Icon) return null
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => handleIconSelect(name)}
                        className={`p-3 rounded-xl border transition-all ${
                          iconName === name
                            ? "bg-white/[0.15] border-white/30 text-white"
                            : "bg-white/[0.05] border-white/[0.1] text-white/50 hover:text-white hover:bg-white/[0.1]"
                        }`}
                        title={name}
                      >
                        <Icon size={20} />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <p className="text-xs text-white/40">Used as browser favicon and header icon. Upload, paste URL, or choose from icon library.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/[0.08]">
            <NeonButton onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check size={18} className="mr-2" />
                  Saved!
                </>
              ) : (
                "Save Settings"
              )}
            </NeonButton>
            
            <NeonButton variant="secondary" type="button" onClick={handleReset}>
              <RefreshCw size={16} className="mr-2" />
              Reset to Default
            </NeonButton>
          </div>
        </div>
      </GlassCard>

      <AdminConfirmModal
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
