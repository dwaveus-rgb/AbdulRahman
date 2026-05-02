"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { AdminConfirmModal } from "@/components/admin/admin-confirm-modal"
import { Sparkles, Save } from "lucide-react"
import { getHeroSettings, setHeroSettings, type HeroSettings } from "@/lib/local-storage"

export default function HeroSettingsPage() {
  const [settings, setSettings] = useState<HeroSettings | null>(null)
  const [mounted, setMounted] = useState(false)
  
  // Form state
  const [name, setName] = useState("")
  const [title, setTitle] = useState("")
  const [headline, setHeadline] = useState("")
  const [subheadline, setSubheadline] = useState("")
  const [badge, setBadge] = useState("")
  const [primaryCta, setPrimaryCta] = useState("")
  const [secondaryCta, setSecondaryCta] = useState("")
  const [github, setGithub] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [twitter, setTwitter] = useState("")
  const [email, setEmail] = useState("")
  
  // Confirmation modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  useEffect(() => {
    setMounted(true)
    loadSettings()
  }, [])

  function loadSettings() {
    const s = getHeroSettings()
    setSettings(s)
    setName(s.name)
    setTitle(s.title)
    setHeadline(s.headline)
    setSubheadline(s.subheadline)
    setBadge(s.badge)
    setPrimaryCta(s.primaryCta)
    setSecondaryCta(s.secondaryCta)
    setGithub(s.socialLinks.github || "")
    setLinkedin(s.socialLinks.linkedin || "")
    setTwitter(s.socialLinks.twitter || "")
    setEmail(s.socialLinks.email || "")
  }

  function handleSave() {
    setPendingAction(() => () => {
      setHeroSettings({
        name,
        title,
        headline,
        subheadline,
        badge,
        primaryCta,
        secondaryCta,
        socialLinks: {
          github: github || undefined,
          linkedin: linkedin || undefined,
          twitter: twitter || undefined,
          email: email || undefined,
        }
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
          <h1 className="text-3xl font-bold mb-2 text-white">Hero Settings</h1>
          <p className="text-white/50">Customize your hero section content</p>
        </div>
      </div>

      <GlassCard className="p-6">
        <div className="space-y-6">
          {/* Badge */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Badge Text</label>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-400" />
              <input
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g., Available for hire"
                className="flex-1 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
              />
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Your Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Professional Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Full-Stack Developer"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
            />
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Main Headline</label>
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Crafting Digital Experiences"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
            />
          </div>

          {/* Subheadline */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Subheadline</label>
            <textarea
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              placeholder="A brief description of what you do..."
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30 min-h-[80px] resize-none"
            />
          </div>

          {/* CTAs */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Primary CTA Text</label>
              <input
                value={primaryCta}
                onChange={(e) => setPrimaryCta(e.target.value)}
                placeholder="View My Work"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Secondary CTA Text</label>
              <input
                value={secondaryCta}
                onChange={(e) => setSecondaryCta(e.target.value)}
                placeholder="Get In Touch"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="pt-4 border-t border-white/[0.08]">
            <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">GitHub URL</label>
                <input
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">LinkedIn URL</label>
                <input
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Twitter URL</label>
                <input
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="https://twitter.com/username"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
                />
              </div>
            </div>
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

      <AdminConfirmModal
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
