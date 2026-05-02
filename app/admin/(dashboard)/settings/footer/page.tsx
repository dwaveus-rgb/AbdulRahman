"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { AdminConfirmModal } from "@/components/admin/admin-confirm-modal"
import { Save } from "lucide-react"
import { getFooterSettings, setFooterSettings, type FooterSettings } from "@/lib/local-storage"

export default function FooterSettingsPage() {
  const [settings, setSettings] = useState<FooterSettings | null>(null)
  const [mounted, setMounted] = useState(false)
  
  // Form state
  const [logoText, setLogoText] = useState("")
  const [copyright, setCopyright] = useState("")
  const [builtWith, setBuiltWith] = useState("")
  
  // Confirmation modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  useEffect(() => {
    setMounted(true)
    loadSettings()
  }, [])

  function loadSettings() {
    const s = getFooterSettings()
    setSettings(s)
    setLogoText(s.logoText)
    setCopyright(s.copyright)
    setBuiltWith(s.builtWith)
  }

  function handleSave() {
    setPendingAction(() => () => {
      setFooterSettings({
        logoText,
        copyright,
        builtWith
      })
      loadSettings()
    })
    setConfirmModalOpen(true)
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
          <h1 className="text-3xl font-bold mb-2 text-white">Footer Settings</h1>
          <p className="text-white/50">Customize your footer content</p>
        </div>
      </div>

      <GlassCard className="p-6">
        <div className="space-y-6">
          {/* Logo Text */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Logo Text</label>
            <input
              value={logoText}
              onChange={(e) => setLogoText(e.target.value)}
              placeholder="Portfolio"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
            />
          </div>

          {/* Copyright */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Copyright Text</label>
            <input
              value={copyright}
              onChange={(e) => setCopyright(e.target.value)}
              placeholder="All rights reserved."
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
            />
            <p className="text-xs text-white/40">Year will be added automatically</p>
          </div>

          {/* Built With */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Built With Text</label>
            <input
              value={builtWith}
              onChange={(e) => setBuiltWith(e.target.value)}
              placeholder="Built with Next.js"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
            />
            <p className="text-xs text-white/40">Include &quot;love&quot; or &quot;heart&quot; for a heart icon</p>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <NeonButton onClick={handleSave}>
              <Save size={18} className="mr-2" />
              Save Changes
            </NeonButton>
          </div>
        </div>
      </GlassCard>

      {/* Preview */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
        <div className="border border-white/[0.08] rounded-xl p-6 bg-black/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white">{logoText || "Portfolio"}</p>
              <p className="text-sm text-white/30">&copy; {new Date().getFullYear()} {copyright || "All rights reserved."}</p>
            </div>
            <p className="text-sm text-white/30">{builtWith || "Built with Next.js"}</p>
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
