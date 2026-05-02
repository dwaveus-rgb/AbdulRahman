"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { updateSiteSetting } from "@/app/actions/admin"
import { User, Globe, Sparkles, CheckCircle } from "lucide-react"
import type { AboutSettings, SocialLinks, HeroSettings } from "@/lib/types"
import { motion } from "framer-motion"

interface SettingsManagerProps {
  initialSettings: Record<string, unknown>
}

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState<string | null>(null)
  
  const about = (initialSettings.about as AboutSettings) || {}
  const socialLinks = (initialSettings.social_links as SocialLinks) || {}
  const hero = (initialSettings.hero as HeroSettings) || {}

  async function handleSaveAbout(formData: FormData) {
    const data = {
      name: formData.get("name") as string,
      title: formData.get("title") as string,
      bio: formData.get("bio") as string,
      avatar_url: formData.get("avatar_url") as string || null,
      resume_url: formData.get("resume_url") as string || null,
    }

    startTransition(async () => {
      const result = await updateSiteSetting("about", data)
      if (result.success) {
        setSaved("about")
        setTimeout(() => setSaved(null), 2000)
        router.refresh()
      }
    })
  }

  async function handleSaveSocial(formData: FormData) {
    const data = {
      github: formData.get("github") as string || null,
      linkedin: formData.get("linkedin") as string || null,
      twitter: formData.get("twitter") as string || null,
      email: formData.get("email") as string || null,
    }

    startTransition(async () => {
      const result = await updateSiteSetting("social_links", data)
      if (result.success) {
        setSaved("social")
        setTimeout(() => setSaved(null), 2000)
        router.refresh()
      }
    })
  }

  async function handleSaveHero(formData: FormData) {
    const data = {
      headline: formData.get("headline") as string,
      subheadline: formData.get("subheadline") as string,
      cta_text: formData.get("cta_text") as string,
      cta_link: formData.get("cta_link") as string,
    }

    startTransition(async () => {
      const result = await updateSiteSetting("hero", data)
      if (result.success) {
        setSaved("hero")
        setTimeout(() => setSaved(null), 2000)
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* About Settings */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <User size={20} />
          </div>
          <h2 className="text-xl font-bold">About You</h2>
        </div>

        <form action={handleSaveAbout} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                name="name"
                defaultValue={about.name || ""}
                className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                name="title"
                defaultValue={about.title || ""}
                className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                placeholder="Full-Stack Developer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              name="bio"
              defaultValue={about.bio || ""}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none resize-none"
              placeholder="Tell visitors about yourself..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Avatar URL</label>
              <input
                name="avatar_url"
                type="url"
                defaultValue={about.avatar_url || ""}
                className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Resume URL</label>
              <input
                name="resume_url"
                type="url"
                defaultValue={about.resume_url || ""}
                className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            {saved === "about" && (
              <motion.span
                className="flex items-center gap-1 text-green-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CheckCircle size={16} /> Saved
              </motion.span>
            )}
            <NeonButton type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save About"}
            </NeonButton>
          </div>
        </form>
      </GlassCard>

      {/* Hero Settings */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Sparkles size={20} />
          </div>
          <h2 className="text-xl font-bold">Hero Section</h2>
        </div>

        <form action={handleSaveHero} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Headline</label>
            <input
              name="headline"
              defaultValue={hero.headline || ""}
              className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
              placeholder="Crafting Digital Experiences"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subheadline</label>
            <textarea
              name="subheadline"
              defaultValue={hero.subheadline || ""}
              rows={2}
              className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none resize-none"
              placeholder="I build modern, performant..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">CTA Text</label>
              <input
                name="cta_text"
                defaultValue={hero.cta_text || ""}
                className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                placeholder="View My Work"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CTA Link</label>
              <input
                name="cta_link"
                defaultValue={hero.cta_link || ""}
                className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                placeholder="#projects"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            {saved === "hero" && (
              <motion.span
                className="flex items-center gap-1 text-green-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CheckCircle size={16} /> Saved
              </motion.span>
            )}
            <NeonButton type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Hero"}
            </NeonButton>
          </div>
        </form>
      </GlassCard>

      {/* Social Links */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Globe size={20} />
          </div>
          <h2 className="text-xl font-bold">Social Links</h2>
        </div>

        <form action={handleSaveSocial} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">GitHub</label>
              <input
                name="github"
                type="url"
                defaultValue={socialLinks.github || ""}
                className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn</label>
              <input
                name="linkedin"
                type="url"
                defaultValue={socialLinks.linkedin || ""}
                className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Twitter/X</label>
              <input
                name="twitter"
                type="url"
                defaultValue={socialLinks.twitter || ""}
                className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                name="email"
                type="email"
                defaultValue={socialLinks.email || ""}
                className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            {saved === "social" && (
              <motion.span
                className="flex items-center gap-1 text-green-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CheckCircle size={16} /> Saved
              </motion.span>
            )}
            <NeonButton type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Social"}
            </NeonButton>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}
