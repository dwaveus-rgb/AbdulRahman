"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { 
  User,
  Image as ImageIcon,
  Type,
  Mail,
  Save,
  RotateCcw,
  Upload,
  Check,
  Trash2
} from "lucide-react"
import { 
  getAccountSettings, 
  setAccountSettings, 
  type AccountSettings 
} from "@/lib/local-storage"
import { PasswordConfirmDialog } from "@/components/admin/password-confirm-dialog"

export default function AccountSettingsPage() {
  const [settings, setSettings] = useState<AccountSettings | null>(null)
  const [mounted, setMounted] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<"save" | "reset" | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
    setSettings(getAccountSettings())
  }, [])

  const updateSettings = (updates: Partial<AccountSettings>) => {
    if (!settings) return
    setSettings({ ...settings, ...updates })
    setHasChanges(true)
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
      setAccountSettings(settings)
      setHasChanges(false)
      window.dispatchEvent(new Event("accountSettingsUpdated"))
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } else if (pendingAction === "reset") {
      localStorage.removeItem("portfolio_account_settings")
      setSettings(getAccountSettings())
      setHasChanges(false)
    }
    setPendingAction(null)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      updateSettings({ 
        adminLogo: reader.result as string,
        adminLogoType: "image"
      })
    }
    reader.readAsDataURL(file)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      updateSettings({ avatar: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  if (!mounted || !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-white/50">Manage your admin profile and branding</p>
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

      {/* Profile Section */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <User size={18} className="text-white/50" />
          Profile
        </h2>

        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="relative">
            {settings.avatar ? (
              <img
                src={settings.avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-2xl object-cover border border-white/[0.1]"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center">
                <User size={32} className="text-white/30" />
              </div>
            )}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <div className="space-y-2">
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white/70 hover:text-white hover:bg-white/[0.1] transition-colors flex items-center gap-2 text-sm"
            >
              <Upload size={14} />
              Upload Avatar
            </button>
            {settings.avatar && (
              <button
                onClick={() => updateSettings({ avatar: "" })}
                className="px-4 py-2 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 text-sm"
              >
                <Trash2 size={14} />
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Display Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60">Display Name</label>
          <input
            type="text"
            value={settings.displayName}
            onChange={(e) => updateSettings({ displayName: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-white/30 focus:border-white/[0.2] outline-none transition-colors"
            placeholder="Your display name"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60 flex items-center gap-2">
            <Mail size={14} />
            Email (optional)
          </label>
          <input
            type="email"
            value={settings.email}
            onChange={(e) => updateSettings({ email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-white/30 focus:border-white/[0.2] outline-none transition-colors"
            placeholder="admin@example.com"
          />
        </div>
      </div>

      {/* Admin Branding Section */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <ImageIcon size={18} className="text-white/50" />
          Admin Panel Branding
        </h2>

        {/* Logo Type Toggle */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60">Logo Type</label>
          <div className="flex gap-2">
            <button
              onClick={() => updateSettings({ adminLogoType: "text" })}
              className={`flex-1 px-4 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                settings.adminLogoType === "text"
                  ? "bg-white/[0.1] border-white/[0.2] text-white"
                  : "bg-white/[0.02] border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <Type size={18} />
              Text Logo
            </button>
            <button
              onClick={() => updateSettings({ adminLogoType: "image" })}
              className={`flex-1 px-4 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                settings.adminLogoType === "image"
                  ? "bg-white/[0.1] border-white/[0.2] text-white"
                  : "bg-white/[0.02] border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <ImageIcon size={18} />
              Image Logo
            </button>
          </div>
        </div>

        {settings.adminLogoType === "text" ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Logo Text</label>
            <input
              type="text"
              value={settings.adminLogo}
              onChange={(e) => updateSettings({ adminLogo: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-white/30 focus:border-white/[0.2] outline-none transition-colors"
              placeholder="Admin Panel"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <label className="text-sm font-medium text-white/60">Logo Image</label>
            
            {/* Logo Preview */}
            <div className="flex items-center gap-4">
              {settings.adminLogo && settings.adminLogoType === "image" ? (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                  <img
                    src={settings.adminLogo}
                    alt="Admin Logo"
                    className="h-10 w-auto object-contain"
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] border-dashed">
                  <div className="h-10 w-24 flex items-center justify-center">
                    <ImageIcon size={24} className="text-white/20" />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white/70 hover:text-white hover:bg-white/[0.1] transition-colors flex items-center gap-2 text-sm"
                >
                  <Upload size={14} />
                  Upload Logo
                </button>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* Preview */}
        <div className="pt-4 border-t border-white/[0.08]">
          <label className="text-sm font-medium text-white/60 mb-3 block">Preview</label>
          <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/[0.1]">
            <div className="flex items-center gap-3">
              {settings.adminLogoType === "image" && settings.adminLogo ? (
                <img
                  src={settings.adminLogo}
                  alt="Logo Preview"
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <span className="text-xl font-bold text-white">
                  {settings.adminLogo || "Admin"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

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
            ? "Enter your admin password to save account settings."
            : "This will reset all account settings to defaults. Enter your password to confirm."
        }
        actionLabel={pendingAction === "save" ? "Save Changes" : "Reset All"}
        actionType={pendingAction === "reset" ? "reset" : "save"}
      />
    </div>
  )
}
