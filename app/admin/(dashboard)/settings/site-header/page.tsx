"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { 
  Image as ImageIcon,
  Type,
  Link,
  Plus,
  Trash2,
  Save,
  Eye,
  RotateCcw,
  Upload,
  Check
} from "lucide-react"
import { 
  getSiteHeaderSettings, 
  setSiteHeaderSettings, 
  type SiteHeaderSettings 
} from "@/lib/local-storage"
import { PasswordConfirmDialog } from "@/components/admin/password-confirm-dialog"

export default function SiteHeaderSettingsPage() {
  const [settings, setSettings] = useState<SiteHeaderSettings | null>(null)
  const [mounted, setMounted] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<"save" | "reset" | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSettings(getSiteHeaderSettings())
  }, [])

  const handleChange = <K extends keyof SiteHeaderSettings>(
    key: K, 
    value: SiteHeaderSettings[K]
  ) => {
    if (!settings) return
    setSettings({ ...settings, [key]: value })
    setHasChanges(true)
  }

  const handleNavLinkChange = (index: number, field: "label" | "href", value: string) => {
    if (!settings) return
    const newLinks = [...settings.navLinks]
    newLinks[index] = { ...newLinks[index], [field]: value }
    handleChange("navLinks", newLinks)
  }

  const addNavLink = () => {
    if (!settings) return
    handleChange("navLinks", [...settings.navLinks, { label: "New Link", href: "#" }])
  }

  const removeNavLink = (index: number) => {
    if (!settings) return
    handleChange("navLinks", settings.navLinks.filter((_, i) => i !== index))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      handleChange("logoImage", reader.result as string)
      handleChange("logoType", "image")
    }
    reader.readAsDataURL(file)
  }

  const handleSaveClick = () => {
    setPendingAction("save")
    setPasswordDialogOpen(true)
  }

  const handleResetClick = () => {
    setPendingAction("reset")
    setPasswordDialogOpen(true)
  }

  const executeAction = () => {
    if (pendingAction === "save" && settings) {
      setSiteHeaderSettings(settings)
      setHasChanges(false)
      window.dispatchEvent(new Event("siteHeaderSettingsUpdated"))
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } else if (pendingAction === "reset") {
      localStorage.removeItem("portfolio_site_header_settings")
      setSettings(getSiteHeaderSettings())
      setHasChanges(false)
    }
    setPendingAction(null)
  }

  if (!mounted || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Header</h1>
          <p className="text-white/50 mt-1">Customize your header and logo</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetClick}
            className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white/70 hover:text-white hover:bg-white/[0.1] transition-colors flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            onClick={handleSaveClick}
            disabled={!hasChanges}
            className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all ${
              hasChanges 
                ? "bg-white text-black hover:bg-white/90" 
                : "bg-white/[0.05] text-white/30 cursor-not-allowed"
            }`}
          >
            {saveSuccess ? <Check size={16} /> : <Save size={16} />}
            {saveSuccess ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
        <div className="flex items-center gap-2 mb-4">
          <Eye size={16} className="text-white/50" />
          <span className="text-sm text-white/50">Live Preview</span>
        </div>
        <div 
          className={`rounded-xl overflow-hidden ${settings.glassEffect ? "bg-[#0a0a0a]/80 backdrop-blur-xl" : "bg-[#0a0a0a]"} border border-white/[0.1]`}
        >
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Logo Preview */}
            <div className="flex items-center gap-2">
              {settings.logoType === "image" && settings.logoImage ? (
                <img
                  src={settings.logoImage}
                  alt="Logo"
                  style={{ height: settings.logoSize, width: "auto" }}
                  className="object-contain"
                />
              ) : (
                <span 
                  className="font-bold text-white"
                  style={{ fontSize: settings.logoSize * 0.625 }}
                >
                  {settings.logoText}
                </span>
              )}
            </div>
            
            {/* Nav Links Preview */}
            {settings.showNavLinks && settings.navLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {settings.navLinks.map((link, i) => (
                  <span key={i} className="text-sm text-white/60">
                    {link.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo Settings */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-5">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <ImageIcon size={18} className="text-white/50" />
            Logo Settings
          </h2>

          {/* Logo Type Toggle */}
          <div className="space-y-2">
            <label className="text-sm text-white/50">Logo Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleChange("logoType", "text")}
                className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  settings.logoType === "text"
                    ? "bg-white/[0.1] border border-white/[0.15] text-white"
                    : "bg-white/[0.03] border border-transparent text-white/50 hover:bg-white/[0.05]"
                }`}
              >
                <Type size={18} />
                Text
              </button>
              <button
                onClick={() => handleChange("logoType", "image")}
                className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  settings.logoType === "image"
                    ? "bg-white/[0.1] border border-white/[0.15] text-white"
                    : "bg-white/[0.03] border border-transparent text-white/50 hover:bg-white/[0.05]"
                }`}
              >
                <ImageIcon size={18} />
                Image
              </button>
            </div>
          </div>

          {/* Text Logo Input */}
          {settings.logoType === "text" && (
            <div className="space-y-2">
              <label className="text-sm text-white/50">Logo Text</label>
              <input
                type="text"
                value={settings.logoText}
                onChange={(e) => handleChange("logoText", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:border-white/[0.2] outline-none"
                placeholder="Your Logo"
              />
            </div>
          )}

          {/* Image Logo Upload */}
          {settings.logoType === "image" && (
            <div className="space-y-2">
              <label className="text-sm text-white/50">Logo Image</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-6 rounded-xl bg-white/[0.03] border border-dashed border-white/[0.15] hover:border-white/[0.25] transition-colors cursor-pointer flex flex-col items-center justify-center gap-3"
              >
                {settings.logoImage ? (
                  <img
                    src={settings.logoImage}
                    alt="Logo preview"
                    className="max-h-20 object-contain"
                  />
                ) : (
                  <>
                    <Upload size={24} className="text-white/30" />
                    <span className="text-sm text-white/50">Click to upload logo</span>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          )}

          {/* Logo Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-white/50">Logo Size</label>
              <span className="text-sm text-white/70">{settings.logoSize}px</span>
            </div>
            <input
              type="range"
              value={settings.logoSize}
              min={20}
              max={60}
              onChange={(e) => handleChange("logoSize", Number(e.target.value))}
              className="w-full h-2 rounded-full bg-white/[0.1] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
          </div>
        </div>

        {/* Header Options */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-5">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Link size={18} className="text-white/50" />
            Header Options
          </h2>

          {/* Toggle Options */}
          <div className="space-y-4">
            <ToggleOption
              label="Show Header"
              description="Display the header on your site"
              value={settings.showHeader}
              onChange={(v) => handleChange("showHeader", v)}
            />
            <ToggleOption
              label="Sticky Header"
              description="Header stays at top while scrolling"
              value={settings.sticky}
              onChange={(v) => handleChange("sticky", v)}
            />
            <ToggleOption
              label="Glass Effect"
              description="Transparent blur background"
              value={settings.glassEffect}
              onChange={(v) => handleChange("glassEffect", v)}
            />
            <ToggleOption
              label="Show Navigation"
              description="Display navigation links"
              value={settings.showNavLinks}
              onChange={(v) => handleChange("showNavLinks", v)}
            />
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      {settings.showNavLinks && (
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Link size={18} className="text-white/50" />
              Navigation Links
            </h2>
            <button
              onClick={addNavLink}
              className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white/70 hover:text-white hover:bg-white/[0.1] transition-colors flex items-center gap-2 text-sm"
            >
              <Plus size={14} />
              Add Link
            </button>
          </div>

          <div className="space-y-3">
            {settings.navLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
              >
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => handleNavLinkChange(index, "label", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:border-white/[0.2] outline-none"
                  placeholder="Label"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => handleNavLinkChange(index, "href", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:border-white/[0.2] outline-none"
                  placeholder="#section or /page"
                />
                <button
                  onClick={() => removeNavLink(index)}
                  className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Password Confirmation Dialog */}
      <PasswordConfirmDialog
        isOpen={passwordDialogOpen}
        onClose={() => {
          setPasswordDialogOpen(false)
          setPendingAction(null)
        }}
        onConfirm={executeAction}
        title={pendingAction === "save" ? "Save Changes" : "Reset to Default"}
        description={
          pendingAction === "save" 
            ? "Enter your admin password to save header settings."
            : "This will reset all header settings to defaults. Enter your password to confirm."
        }
        actionLabel={pendingAction === "save" ? "Save Changes" : "Reset All"}
        actionType={pendingAction === "reset" ? "reset" : "save"}
      />
    </div>
  )
}

// Toggle Option Component
function ToggleOption({
  label,
  description,
  value,
  onChange
}: {
  label: string
  description: string
  value: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-white/40">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          value ? "bg-white" : "bg-white/[0.1]"
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
            value ? "left-7 bg-black" : "left-1 bg-white/50"
          }`}
        />
      </button>
    </div>
  )
}
