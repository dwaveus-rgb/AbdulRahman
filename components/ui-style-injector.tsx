"use client"

import { useEffect, useState } from "react"
import { getElementSettings, type ElementSettings, type ElementStyle } from "@/lib/local-storage"

function generateCSSFromStyle(prefix: string, style: Partial<ElementStyle>): string {
  const vars: string[] = []
  
  if (style.color) vars.push(`--${prefix}-color: ${style.color};`)
  if (style.backgroundColor) vars.push(`--${prefix}-bg: ${style.backgroundColor};`)
  if (style.borderColor) vars.push(`--${prefix}-border-color: ${style.borderColor};`)
  if (style.borderWidth !== undefined) vars.push(`--${prefix}-border-width: ${style.borderWidth}px;`)
  if (style.borderRadius !== undefined) vars.push(`--${prefix}-radius: ${style.borderRadius}px;`)
  if (style.fontSize !== undefined) vars.push(`--${prefix}-font-size: ${style.fontSize}px;`)
  if (style.fontWeight !== undefined) vars.push(`--${prefix}-font-weight: ${style.fontWeight};`)
  if (style.padding !== undefined) vars.push(`--${prefix}-padding: ${style.padding}px;`)
  if (style.opacity !== undefined) vars.push(`--${prefix}-opacity: ${style.opacity / 100};`)
  if (style.offsetX !== undefined) vars.push(`--${prefix}-offset-x: ${style.offsetX}px;`)
  if (style.offsetY !== undefined) vars.push(`--${prefix}-offset-y: ${style.offsetY}px;`)
  if (style.shadow) vars.push(`--${prefix}-shadow: ${style.shadow};`)
  if (style.blur !== undefined) vars.push(`--${prefix}-blur: ${style.blur}px;`)
  
  return vars.join("\n  ")
}

export function UIStyleInjector() {
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState<ElementSettings | null>(null)

  useEffect(() => {
    setMounted(true)
    setSettings(getElementSettings())
    
    // Listen for storage changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "portfolio_element_settings") {
        setSettings(getElementSettings())
      }
    }
    
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  useEffect(() => {
    // Also listen for custom events from admin panel
    const handleUpdate = () => {
      setSettings(getElementSettings())
    }
    
    window.addEventListener("elementSettingsUpdated", handleUpdate)
    return () => window.removeEventListener("elementSettingsUpdated", handleUpdate)
  }, [])

  if (!mounted || !settings) return null

  const css = `
:root {
  /* Primary Button */
  ${generateCSSFromStyle("btn-primary", settings.primaryButton)}
  
  /* Secondary Button */
  ${generateCSSFromStyle("btn-secondary", settings.secondaryButton)}
  
  /* Ghost Button */
  ${generateCSSFromStyle("btn-ghost", settings.ghostButton)}
  
  /* Project Card */
  ${generateCSSFromStyle("card-project", settings.projectCard)}
  
  /* Skill Card */
  ${generateCSSFromStyle("card-skill", settings.skillCard)}
  
  /* Contact Card */
  ${generateCSSFromStyle("card-contact", settings.contactCard)}
  
  /* Glass Card */
  ${generateCSSFromStyle("card-glass", settings.glassCard)}
  
  /* Heading */
  ${generateCSSFromStyle("heading", settings.heading)}
  
  /* Subheading */
  ${generateCSSFromStyle("subheading", settings.subheading)}
  
  /* Body Text */
  ${generateCSSFromStyle("body", settings.bodyText)}
  
  /* Caption */
  ${generateCSSFromStyle("caption", settings.caption)}
  
  /* Badge */
  ${generateCSSFromStyle("badge", settings.badge)}
  
  /* Icon Primary */
  ${generateCSSFromStyle("icon-primary", settings.iconPrimary)}
  
  /* Icon Secondary */
  ${generateCSSFromStyle("icon-secondary", settings.iconSecondary)}
  
  /* Social Icon */
  ${generateCSSFromStyle("icon-social", settings.socialIcon)}
  
  /* Section */
  ${generateCSSFromStyle("section", settings.section)}
  
  /* Container */
  ${generateCSSFromStyle("container", settings.container)}
  
  /* Divider */
  ${generateCSSFromStyle("divider", settings.divider)}
  
  /* Site Header */
  ${generateCSSFromStyle("site-header", settings.siteHeader)}
  
  /* Nav Link */
  ${generateCSSFromStyle("nav-link", settings.navLink)}
  
  /* Logo */
  ${generateCSSFromStyle("logo", settings.logo)}
}

/* Apply element styles */
.el-btn-primary {
  background: var(--btn-primary-bg, #fafafa) !important;
  color: var(--btn-primary-color, #0a0a0a) !important;
  border-radius: var(--btn-primary-radius, 16px) !important;
  font-weight: var(--btn-primary-font-weight, 600) !important;
  transform: translate(var(--btn-primary-offset-x, 0), var(--btn-primary-offset-y, 0));
  opacity: var(--btn-primary-opacity, 1);
}

.el-btn-secondary {
  background: var(--btn-secondary-bg, rgba(255,255,255,0.05)) !important;
  color: var(--btn-secondary-color, #fafafa) !important;
  border-radius: var(--btn-secondary-radius, 16px) !important;
  border: var(--btn-secondary-border-width, 1px) solid var(--btn-secondary-border-color, rgba(255,255,255,0.15)) !important;
  transform: translate(var(--btn-secondary-offset-x, 0), var(--btn-secondary-offset-y, 0));
  opacity: var(--btn-secondary-opacity, 1);
}

.el-card-project {
  background: var(--card-project-bg, rgba(255,255,255,0.04)) !important;
  border-radius: var(--card-project-radius, 16px) !important;
  border: var(--card-project-border-width, 1px) solid var(--card-project-border-color, rgba(255,255,255,0.06)) !important;
  transform: translate(var(--card-project-offset-x, 0), var(--card-project-offset-y, 0));
  opacity: var(--card-project-opacity, 1);
}

.el-card-skill {
  background: var(--card-skill-bg, rgba(255,255,255,0.04)) !important;
  border-radius: var(--card-skill-radius, 16px) !important;
  border: var(--card-skill-border-width, 1px) solid var(--card-skill-border-color, rgba(255,255,255,0.06)) !important;
  transform: translate(var(--card-skill-offset-x, 0), var(--card-skill-offset-y, 0));
  opacity: var(--card-skill-opacity, 1);
}

.el-card-glass {
  background: var(--card-glass-bg, rgba(255,255,255,0.08)) !important;
  border-radius: var(--card-glass-radius, 24px) !important;
  border: var(--card-glass-border-width, 1px) solid var(--card-glass-border-color, rgba(255,255,255,0.12)) !important;
  backdrop-filter: blur(var(--card-glass-blur, 20px)) !important;
  -webkit-backdrop-filter: blur(var(--card-glass-blur, 20px)) !important;
}

.el-heading {
  color: var(--heading-color, #fafafa) !important;
  font-size: var(--heading-font-size, 48px) !important;
  font-weight: var(--heading-font-weight, 700) !important;
}

.el-subheading {
  color: var(--subheading-color, rgba(255,255,255,0.6)) !important;
  font-size: var(--subheading-font-size, 20px) !important;
  font-weight: var(--subheading-font-weight, 500) !important;
}

.el-body {
  color: var(--body-color, rgba(255,255,255,0.5)) !important;
  font-size: var(--body-font-size, 16px) !important;
}

.el-badge {
  background: var(--badge-bg, rgba(255,255,255,0.05)) !important;
  color: var(--badge-color, rgba(255,255,255,0.7)) !important;
  border-radius: var(--badge-radius, 9999px) !important;
  padding: var(--badge-padding, 8px) !important;
}

.el-site-header {
  background: var(--site-header-bg, rgba(10,10,10,0.8)) !important;
  backdrop-filter: blur(var(--site-header-blur, 20px)) !important;
  -webkit-backdrop-filter: blur(var(--site-header-blur, 20px)) !important;
  border-bottom: 1px solid var(--site-header-border-color, rgba(255,255,255,0.1)) !important;
}

.el-icon-social {
  color: var(--icon-social-color, rgba(255,255,255,0.5)) !important;
  background: var(--icon-social-bg, rgba(255,255,255,0.05)) !important;
  border-radius: var(--icon-social-radius, 12px) !important;
  padding: var(--icon-social-padding, 12px) !important;
}

.el-logo {
  color: var(--logo-color, #fafafa) !important;
  font-size: var(--logo-font-size, 20px) !important;
  font-weight: var(--logo-font-weight, 700) !important;
}

.el-nav-link {
  color: var(--nav-link-color, rgba(255,255,255,0.6)) !important;
  font-size: var(--nav-link-font-size, 14px) !important;
  font-weight: var(--nav-link-font-weight, 500) !important;
}
`

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
