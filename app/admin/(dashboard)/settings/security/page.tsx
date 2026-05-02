"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { AdminConfirmModal } from "@/components/admin/admin-confirm-modal"
import { 
  Check, 
  RefreshCw, 
  Shield, 
  ShieldCheck,
  ShieldOff,
  Eye,
  EyeOff,
  Camera,
  MousePointer,
  Copy,
  Monitor,
  Lock,
  AlertTriangle,
  Type
} from "lucide-react"
import { 
  getSecuritySettings, 
  setSecuritySettings, 
  verifyAdminPassword,
  type SecuritySettings 
} from "@/lib/local-storage"

export default function SecuritySettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState<SecuritySettings>({
    preventScreenshot: false,
    preventInspect: false,
    preventCopy: false,
    hideOnBlur: false,
    protectionMessage: "Content Protected - Return to view",
    securityEnabled: false
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  // Password verification
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [pendingToggle, setPendingToggle] = useState<boolean | null>(null)
  
  // Confirmation modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  useEffect(() => {
    setMounted(true)
    const loaded = getSecuritySettings()
    setSettings(loaded)
  }, [])

  function handleToggleSecurity(newValue: boolean) {
    // Always require password to change security settings
    setPendingToggle(newValue)
    setPassword("")
    setPasswordError("")
    setShowPasswordModal(true)
  }

  function handlePasswordSubmit() {
    if (!verifyAdminPassword(password)) {
      setPasswordError("Incorrect password")
      return
    }
    
    setShowPasswordModal(false)
    if (pendingToggle !== null) {
      setSettings(s => ({ ...s, securityEnabled: pendingToggle }))
      setPendingToggle(null)
    }
    setPassword("")
    setPasswordError("")
  }

  function handleSave() {
    setPendingAction(() => () => {
      setIsSaving(true)
      setSecuritySettings(settings)
      
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
    const defaultSettings: SecuritySettings = {
      preventScreenshot: false,
      preventInspect: false,
      preventCopy: false,
      hideOnBlur: false,
      protectionMessage: "Content Protected - Return to view",
      securityEnabled: false
    }
    setSettings(defaultSettings)
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
          <h1 className="text-3xl font-bold mb-2 text-white">Security Settings</h1>
          <p className="text-white/50">Protect your content from stealing and unauthorized access</p>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <GlassCard className="w-full max-w-md m-4 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-yellow-500/10">
                <Lock size={24} className="text-yellow-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Admin Verification</h2>
                <p className="text-sm text-white/50">Enter password to change security settings</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-white/80">Admin Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError("")
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handlePasswordSubmit()
                  }}
                  placeholder="Enter your admin password"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-sm text-red-400 flex items-center gap-2">
                    <AlertTriangle size={14} />
                    {passwordError}
                  </p>
                )}
              </div>
              
              <div className="flex gap-3">
                <NeonButton onClick={handlePasswordSubmit}>
                  Verify
                </NeonButton>
                <NeonButton 
                  variant="secondary" 
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPendingToggle(null)
                    setPassword("")
                    setPasswordError("")
                  }}
                >
                  Cancel
                </NeonButton>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Main Toggle */}
      <GlassCard className={`p-6 ${settings.securityEnabled ? "border-green-500/30 bg-green-500/5" : ""}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl ${settings.securityEnabled ? "bg-green-500/20" : "bg-white/[0.08]"}`}>
              {settings.securityEnabled ? (
                <ShieldCheck size={32} className="text-green-400" />
              ) : (
                <ShieldOff size={32} className="text-white/40" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Stealing Prevention</h2>
              <p className="text-white/50">
                {settings.securityEnabled 
                  ? "Protection is currently active" 
                  : "Protection is currently disabled"
                }
              </p>
            </div>
          </div>
          
          <button
            onClick={() => handleToggleSecurity(!settings.securityEnabled)}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              settings.securityEnabled
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-white/[0.1] text-white hover:bg-white/[0.15]"
            }`}
          >
            {settings.securityEnabled ? "Enabled" : "Disabled"}
          </button>
        </div>
      </GlassCard>

      {/* Warning if disabled */}
      {!settings.securityEnabled && (
        <GlassCard className="p-4 border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-yellow-400" />
            <p className="text-white/70 text-sm">
              Security features are disabled. Enable protection to prevent content stealing.
            </p>
          </div>
        </GlassCard>
      )}

      {/* Protection Options */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield size={20} className="text-white/60" />
          <h2 className="text-lg font-semibold text-white">Protection Options</h2>
        </div>
        
        <div className="space-y-4">
          {/* Prevent Screenshot */}
          <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
            settings.preventScreenshot && settings.securityEnabled
              ? "border-white/20 bg-white/[0.05]"
              : "border-white/[0.08]"
          }`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${
                settings.preventScreenshot && settings.securityEnabled
                  ? "bg-white/[0.1]"
                  : "bg-white/[0.05]"
              }`}>
                <Camera size={20} className={settings.preventScreenshot && settings.securityEnabled ? "text-white" : "text-white/40"} />
              </div>
              <div>
                <h3 className="font-medium text-white">Prevent Screenshots</h3>
                <p className="text-sm text-white/40">Clears clipboard when PrintScreen is pressed</p>
              </div>
            </div>
            <button
              onClick={() => setSettings(s => ({ ...s, preventScreenshot: !s.preventScreenshot }))}
              disabled={!settings.securityEnabled}
              className={`w-12 h-7 rounded-full transition-all ${
                settings.preventScreenshot && settings.securityEnabled ? "bg-white" : "bg-white/20"
              } ${!settings.securityEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div 
                className={`w-5 h-5 rounded-full transition-transform ${
                  settings.preventScreenshot && settings.securityEnabled 
                    ? "translate-x-6 bg-black" 
                    : "translate-x-1 bg-white/60"
                }`}
              />
            </button>
          </div>

          {/* Prevent Inspect */}
          <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
            settings.preventInspect && settings.securityEnabled
              ? "border-white/20 bg-white/[0.05]"
              : "border-white/[0.08]"
          }`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${
                settings.preventInspect && settings.securityEnabled
                  ? "bg-white/[0.1]"
                  : "bg-white/[0.05]"
              }`}>
                <MousePointer size={20} className={settings.preventInspect && settings.securityEnabled ? "text-white" : "text-white/40"} />
              </div>
              <div>
                <h3 className="font-medium text-white">Block Developer Tools</h3>
                <p className="text-sm text-white/40">Blocks F12, right-click, and inspect shortcuts</p>
              </div>
            </div>
            <button
              onClick={() => setSettings(s => ({ ...s, preventInspect: !s.preventInspect }))}
              disabled={!settings.securityEnabled}
              className={`w-12 h-7 rounded-full transition-all ${
                settings.preventInspect && settings.securityEnabled ? "bg-white" : "bg-white/20"
              } ${!settings.securityEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div 
                className={`w-5 h-5 rounded-full transition-transform ${
                  settings.preventInspect && settings.securityEnabled 
                    ? "translate-x-6 bg-black" 
                    : "translate-x-1 bg-white/60"
                }`}
              />
            </button>
          </div>

          {/* Prevent Copy */}
          <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
            settings.preventCopy && settings.securityEnabled
              ? "border-white/20 bg-white/[0.05]"
              : "border-white/[0.08]"
          }`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${
                settings.preventCopy && settings.securityEnabled
                  ? "bg-white/[0.1]"
                  : "bg-white/[0.05]"
              }`}>
                <Copy size={20} className={settings.preventCopy && settings.securityEnabled ? "text-white" : "text-white/40"} />
              </div>
              <div>
                <h3 className="font-medium text-white">Prevent Text Copy</h3>
                <p className="text-sm text-white/40">Disables text selection and copy functionality</p>
              </div>
            </div>
            <button
              onClick={() => setSettings(s => ({ ...s, preventCopy: !s.preventCopy }))}
              disabled={!settings.securityEnabled}
              className={`w-12 h-7 rounded-full transition-all ${
                settings.preventCopy && settings.securityEnabled ? "bg-white" : "bg-white/20"
              } ${!settings.securityEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div 
                className={`w-5 h-5 rounded-full transition-transform ${
                  settings.preventCopy && settings.securityEnabled 
                    ? "translate-x-6 bg-black" 
                    : "translate-x-1 bg-white/60"
                }`}
              />
            </button>
          </div>

          {/* Hide on Blur */}
          <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
            settings.hideOnBlur && settings.securityEnabled
              ? "border-white/20 bg-white/[0.05]"
              : "border-white/[0.08]"
          }`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${
                settings.hideOnBlur && settings.securityEnabled
                  ? "bg-white/[0.1]"
                  : "bg-white/[0.05]"
              }`}>
                <Monitor size={20} className={settings.hideOnBlur && settings.securityEnabled ? "text-white" : "text-white/40"} />
              </div>
              <div>
                <h3 className="font-medium text-white">Hide When Unfocused</h3>
                <p className="text-sm text-white/40">Hides content when tab loses focus or window is minimized</p>
              </div>
            </div>
            <button
              onClick={() => setSettings(s => ({ ...s, hideOnBlur: !s.hideOnBlur }))}
              disabled={!settings.securityEnabled}
              className={`w-12 h-7 rounded-full transition-all ${
                settings.hideOnBlur && settings.securityEnabled ? "bg-white" : "bg-white/20"
              } ${!settings.securityEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div 
                className={`w-5 h-5 rounded-full transition-transform ${
                  settings.hideOnBlur && settings.securityEnabled 
                    ? "translate-x-6 bg-black" 
                    : "translate-x-1 bg-white/60"
                }`}
              />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Custom Message */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Type size={20} className="text-white/60" />
          <h2 className="text-lg font-semibold text-white">Protection Message</h2>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-white/80">Custom message shown when content is hidden</label>
            <input
              type="text"
              value={settings.protectionMessage}
              onChange={(e) => setSettings(s => ({ ...s, protectionMessage: e.target.value }))}
              placeholder="Content Protected - Return to view"
              disabled={!settings.securityEnabled}
              className={`w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30 ${
                !settings.securityEnabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>
          
          {/* Preview */}
          <div className="p-6 rounded-xl bg-black border border-white/[0.1]">
            <p className="text-xs text-white/40 mb-3">Preview</p>
            <div className="flex items-center justify-center gap-3">
              <Shield size={24} className="text-white/30" />
              <span className="text-white/70">{settings.protectionMessage || "Content Protected"}</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Action Buttons */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3">
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
              <>
                <Shield size={18} className="mr-2" />
                Save Settings
              </>
            )}
          </NeonButton>
          
          <NeonButton variant="secondary" type="button" onClick={handleReset}>
            <RefreshCw size={16} className="mr-2" />
            Reset to Default
          </NeonButton>
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
