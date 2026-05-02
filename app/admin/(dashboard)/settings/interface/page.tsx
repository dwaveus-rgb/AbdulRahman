"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { AdminConfirmModal } from "@/components/admin/admin-confirm-modal"
import { 
  Check, 
  RefreshCw, 
  Palette, 
  Square, 
  Circle, 
  Sparkles,
  Layout,
  Sliders,
  Eye,
  Zap
} from "lucide-react"
import { 
  getInterfaceSettings, 
  setInterfaceSettings, 
  type InterfaceSettings 
} from "@/lib/local-storage"

export default function InterfaceSettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState<InterfaceSettings>({
    glassBlur: 20,
    glassOpacity: 8,
    glassBorder: 12,
    primaryColor: "#fafafa",
    accentColor: "#3b82f6",
    backgroundColor: "#0a0a0a",
    borderRadius: 12,
    buttonStyle: "solid",
    buttonRounded: 12,
    enableAnimations: true,
    animationSpeed: "normal",
    sidebarPosition: "left",
    contentMaxWidth: 1200,
    spacing: "normal"
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  // Confirmation modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  useEffect(() => {
    setMounted(true)
    const loaded = getInterfaceSettings()
    setSettings(loaded)
  }, [])

  // Apply live preview
  useEffect(() => {
    if (!mounted) return
    applyInterfaceStyles(settings)
  }, [settings, mounted])

  function applyInterfaceStyles(s: InterfaceSettings) {
    const root = document.documentElement
    
    // Glass effect
    root.style.setProperty("--glass-blur", `${s.glassBlur}px`)
    root.style.setProperty("--glass", `rgba(255, 255, 255, ${s.glassOpacity / 100})`)
    root.style.setProperty("--glass-border", `rgba(255, 255, 255, ${s.glassBorder / 100})`)
    
    // Colors
    root.style.setProperty("--primary", s.primaryColor)
    root.style.setProperty("--accent-color", s.accentColor)
    root.style.setProperty("--background", s.backgroundColor)
    
    // Border radius
    root.style.setProperty("--radius", `${s.borderRadius}px`)
    root.style.setProperty("--radius-lg", `${s.borderRadius + 4}px`)
    root.style.setProperty("--radius-xl", `${s.borderRadius + 8}px`)
  }

  function handleSave() {
    setPendingAction(() => () => {
      setIsSaving(true)
      setInterfaceSettings(settings)
      
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
    const defaultSettings: InterfaceSettings = {
      glassBlur: 20,
      glassOpacity: 8,
      glassBorder: 12,
      primaryColor: "#fafafa",
      accentColor: "#3b82f6",
      backgroundColor: "#0a0a0a",
      borderRadius: 12,
      buttonStyle: "solid",
      buttonRounded: 12,
      enableAnimations: true,
      animationSpeed: "normal",
      sidebarPosition: "left",
      contentMaxWidth: 1200,
      spacing: "normal"
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
          <h1 className="text-3xl font-bold mb-2 text-white">Interface Manager</h1>
          <p className="text-white/50">Customize buttons, colors, blur, transparency, and more</p>
        </div>
      </div>

      {/* Live Preview */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye size={20} className="text-white/60" />
          <h2 className="text-lg font-semibold text-white">Live Preview</h2>
        </div>
        
        <div className="p-6 rounded-xl border border-white/[0.1]" style={{
          background: settings.backgroundColor,
        }}>
          <div 
            className="p-4 mb-4"
            style={{
              background: `rgba(255, 255, 255, ${settings.glassOpacity / 100})`,
              backdropFilter: `blur(${settings.glassBlur}px)`,
              border: `1px solid rgba(255, 255, 255, ${settings.glassBorder / 100})`,
              borderRadius: `${settings.borderRadius}px`,
            }}
          >
            <h3 className="text-white font-semibold mb-2">Sample Card</h3>
            <p className="text-white/60 text-sm mb-4">This is how your cards will look with current settings.</p>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 text-sm font-medium transition-all"
                style={{
                  backgroundColor: settings.buttonStyle === "solid" ? settings.primaryColor : "transparent",
                  color: settings.buttonStyle === "solid" ? settings.backgroundColor : settings.primaryColor,
                  border: settings.buttonStyle === "outline" ? `2px solid ${settings.primaryColor}` : "none",
                  borderRadius: `${settings.buttonRounded}px`,
                  background: settings.buttonStyle === "gradient" 
                    ? `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})`
                    : settings.buttonStyle === "solid" ? settings.primaryColor : "transparent",
                }}
              >
                Primary Button
              </button>
              <button
                className="px-4 py-2 text-sm font-medium transition-all"
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: settings.primaryColor,
                  borderRadius: `${settings.buttonRounded}px`,
                }}
              >
                Secondary
              </button>
            </div>
          </div>
          
          {/* Skill bar preview */}
          <div 
            className="p-4"
            style={{
              background: `rgba(255, 255, 255, ${settings.glassOpacity / 100})`,
              backdropFilter: `blur(${settings.glassBlur}px)`,
              border: `1px solid rgba(255, 255, 255, ${settings.glassBorder / 100})`,
              borderRadius: `${settings.borderRadius}px`,
            }}
          >
            <div className="flex justify-between mb-2">
              <span className="text-white text-sm">Sample Skill</span>
              <span className="text-white/60 text-sm">75%</span>
            </div>
            <div 
              className="h-2 bg-white/10 overflow-hidden"
              style={{ borderRadius: `${settings.borderRadius / 2}px` }}
            >
              <div 
                className="h-full transition-all"
                style={{ 
                  width: "75%",
                  background: `linear-gradient(90deg, ${settings.primaryColor}, ${settings.accentColor})`,
                  borderRadius: `${settings.borderRadius / 2}px`,
                }}
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Glass Effect Settings */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={20} className="text-white/60" />
          <h2 className="text-lg font-semibold text-white">Glass Effect</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-white/80">Blur Amount</label>
              <span className="text-xs text-white/40">{settings.glassBlur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={settings.glassBlur}
              onChange={(e) => setSettings(s => ({ ...s, glassBlur: Number(e.target.value) }))}
              className="w-full accent-white"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-white/80">Opacity</label>
              <span className="text-xs text-white/40">{settings.glassOpacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.glassOpacity}
              onChange={(e) => setSettings(s => ({ ...s, glassOpacity: Number(e.target.value) }))}
              className="w-full accent-white"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-white/80">Border Opacity</label>
              <span className="text-xs text-white/40">{settings.glassBorder}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.glassBorder}
              onChange={(e) => setSettings(s => ({ ...s, glassBorder: Number(e.target.value) }))}
              className="w-full accent-white"
            />
          </div>
        </div>
      </GlassCard>

      {/* Color Settings */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Palette size={20} className="text-white/60" />
          <h2 className="text-lg font-semibold text-white">Colors</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <label className="text-sm text-white/80">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings(s => ({ ...s, primaryColor: e.target.value }))}
                className="w-12 h-12 rounded-xl border border-white/[0.12] cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => setSettings(s => ({ ...s, primaryColor: e.target.value }))}
                className="flex-1 px-4 py-2 rounded-xl bg-white/[0.08] border border-white/[0.12] text-white text-sm font-mono"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm text-white/80">Accent Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => setSettings(s => ({ ...s, accentColor: e.target.value }))}
                className="w-12 h-12 rounded-xl border border-white/[0.12] cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={settings.accentColor}
                onChange={(e) => setSettings(s => ({ ...s, accentColor: e.target.value }))}
                className="flex-1 px-4 py-2 rounded-xl bg-white/[0.08] border border-white/[0.12] text-white text-sm font-mono"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm text-white/80">Background Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => setSettings(s => ({ ...s, backgroundColor: e.target.value }))}
                className="w-12 h-12 rounded-xl border border-white/[0.12] cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={settings.backgroundColor}
                onChange={(e) => setSettings(s => ({ ...s, backgroundColor: e.target.value }))}
                className="flex-1 px-4 py-2 rounded-xl bg-white/[0.08] border border-white/[0.12] text-white text-sm font-mono"
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Border & Corners */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Square size={20} className="text-white/60" />
          <h2 className="text-lg font-semibold text-white">Borders & Corners</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-white/80">Border Radius</label>
              <span className="text-xs text-white/40">{settings.borderRadius}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="32"
              value={settings.borderRadius}
              onChange={(e) => setSettings(s => ({ ...s, borderRadius: Number(e.target.value) }))}
              className="w-full accent-white"
            />
            <div className="flex justify-between text-xs text-white/30">
              <span>Sharp</span>
              <span>Rounded</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-white/80">Button Radius</label>
              <span className="text-xs text-white/40">{settings.buttonRounded}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="32"
              value={settings.buttonRounded}
              onChange={(e) => setSettings(s => ({ ...s, buttonRounded: Number(e.target.value) }))}
              className="w-full accent-white"
            />
            <div className="flex justify-between text-xs text-white/30">
              <span>Square</span>
              <span>Pill</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Button Styles */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Circle size={20} className="text-white/60" />
          <h2 className="text-lg font-semibold text-white">Button Style</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(["solid", "outline", "ghost", "gradient"] as const).map((style) => (
            <button
              key={style}
              onClick={() => setSettings(s => ({ ...s, buttonStyle: style }))}
              className={`p-4 rounded-xl border transition-all text-center ${
                settings.buttonStyle === style
                  ? "border-white/30 bg-white/[0.1]"
                  : "border-white/[0.1] hover:border-white/20"
              }`}
            >
              <div 
                className="w-full py-2 mb-2 text-sm font-medium"
                style={{
                  backgroundColor: style === "solid" ? settings.primaryColor : "transparent",
                  color: style === "solid" ? settings.backgroundColor : settings.primaryColor,
                  border: style === "outline" ? `2px solid ${settings.primaryColor}` : "none",
                  borderRadius: `${settings.buttonRounded}px`,
                  background: style === "gradient" 
                    ? `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})`
                    : style === "solid" ? settings.primaryColor 
                    : style === "ghost" ? "rgba(255,255,255,0.1)" : "transparent",
                }}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </div>
              <span className="text-xs text-white/40 capitalize">{style}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Animation Settings */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Zap size={20} className="text-white/60" />
          <h2 className="text-lg font-semibold text-white">Animations</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm text-white/80">Enable Animations</label>
            <button
              onClick={() => setSettings(s => ({ ...s, enableAnimations: !s.enableAnimations }))}
              className={`w-14 h-8 rounded-full transition-all ${
                settings.enableAnimations ? "bg-green-500" : "bg-white/20"
              }`}
            >
              <div 
                className={`w-6 h-6 rounded-full bg-white shadow-lg transition-transform ${
                  settings.enableAnimations ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm text-white/80">Animation Speed</label>
            <div className="flex gap-2">
              {(["slow", "normal", "fast"] as const).map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSettings(s => ({ ...s, animationSpeed: speed }))}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm transition-all ${
                    settings.animationSpeed === speed
                      ? "bg-white/[0.15] border border-white/30 text-white"
                      : "bg-white/[0.05] border border-white/[0.1] text-white/50"
                  }`}
                >
                  {speed.charAt(0).toUpperCase() + speed.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Layout Settings */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Layout size={20} className="text-white/60" />
          <h2 className="text-lg font-semibold text-white">Layout</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <label className="text-sm text-white/80">Sidebar Position</label>
            <div className="flex gap-2">
              {(["left", "right"] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setSettings(s => ({ ...s, sidebarPosition: pos }))}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm transition-all ${
                    settings.sidebarPosition === pos
                      ? "bg-white/[0.15] border border-white/30 text-white"
                      : "bg-white/[0.05] border border-white/[0.1] text-white/50"
                  }`}
                >
                  {pos.charAt(0).toUpperCase() + pos.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-white/80">Content Max Width</label>
              <span className="text-xs text-white/40">{settings.contentMaxWidth}px</span>
            </div>
            <input
              type="range"
              min="800"
              max="1600"
              step="50"
              value={settings.contentMaxWidth}
              onChange={(e) => setSettings(s => ({ ...s, contentMaxWidth: Number(e.target.value) }))}
              className="w-full accent-white"
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-sm text-white/80">Spacing</label>
            <div className="flex gap-2">
              {(["compact", "normal", "relaxed"] as const).map((space) => (
                <button
                  key={space}
                  onClick={() => setSettings(s => ({ ...s, spacing: space }))}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs transition-all ${
                    settings.spacing === space
                      ? "bg-white/[0.15] border border-white/30 text-white"
                      : "bg-white/[0.05] border border-white/[0.1] text-white/50"
                  }`}
                >
                  {space.charAt(0).toUpperCase() + space.slice(1)}
                </button>
              ))}
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
                <Sliders size={18} className="mr-2" />
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
