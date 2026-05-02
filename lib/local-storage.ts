// Portfolio localStorage management
// localStorage keys
export const STORAGE_KEYS = {
  PROJECTS: "portfolio_projects",
  SKILLS: "portfolio_skills",
  CONTACTS: "portfolio_contacts",
  AUTH: "portfolio_admin_auth",
  THEMES: "portfolio_themes",
  ACTIVE_THEME: "portfolio_active_theme",
  HEADER_SETTINGS: "portfolio_header_settings",
  HERO_SETTINGS: "portfolio_hero_settings",
  INTERFACE_SETTINGS: "portfolio_interface_settings",
  SECURITY_SETTINGS: "portfolio_security_settings",
  FOOTER_SETTINGS: "portfolio_footer_settings",
  ELEMENT_SETTINGS: "portfolio_element_settings",
  SITE_HEADER_SETTINGS: "portfolio_site_header_settings",
  ACCOUNT_SETTINGS: "portfolio_account_settings",
} as const

// Icon type for structured storage
export interface IconData {
  type: "upload" | "url" | "icon"
  value: string
}

// Types
export interface LocalProject {
  id: string
  title: string
  description: string
  image_url: string // Primary/cover image
  images: string[] // Multiple images for gallery
  tags?: string[] // Optional tags
  link?: string // Optional project link
  created_at: string
}

export interface LocalSkill {
  id: string
  name: string
  percentage: number
  icon?: string // Icon URL or lucide icon name
  created_at: string
}

export interface LocalContact {
  id: string
  name: string
  icon: string // Icon name (lucide) or custom icon URL
  iconUrl?: string // Custom icon URL if using upload
  link: string
  created_at: string
}

export interface LocalTheme {
  id: string
  name: string
  css: string
  isDefault?: boolean
  created_at: string
}

export interface HeaderSettings {
  title: string
  headerText: string
  favicon: IconData
}

export interface HeroSettings {
  name: string
  title: string
  headline: string
  subheadline: string
  badge: string
  primaryCta: string
  secondaryCta: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    email?: string
  }
}

export interface FooterSettings {
  logoText: string
  copyright: string
  builtWith: string
}

// Element-level customization for A-Z control
export interface ElementStyle {
  color: string
  backgroundColor: string
  borderColor: string
  borderWidth: number
  borderRadius: number
  fontSize: number
  fontWeight: number
  padding: number
  opacity: number
  offsetX: number
  offsetY: number
  shadow: string
  blur: number
}

export interface ElementSettings {
  // Buttons
  primaryButton: Partial<ElementStyle>
  secondaryButton: Partial<ElementStyle>
  ghostButton: Partial<ElementStyle>
  
  // Cards
  projectCard: Partial<ElementStyle>
  skillCard: Partial<ElementStyle>
  contactCard: Partial<ElementStyle>
  glassCard: Partial<ElementStyle>
  
  // Text
  heading: Partial<ElementStyle>
  subheading: Partial<ElementStyle>
  bodyText: Partial<ElementStyle>
  caption: Partial<ElementStyle>
  badge: Partial<ElementStyle>
  
  // Icons
  iconPrimary: Partial<ElementStyle>
  iconSecondary: Partial<ElementStyle>
  socialIcon: Partial<ElementStyle>
  
  // Layout
  section: Partial<ElementStyle>
  container: Partial<ElementStyle>
  divider: Partial<ElementStyle>
  
  // Header
  siteHeader: Partial<ElementStyle>
  navLink: Partial<ElementStyle>
  logo: Partial<ElementStyle>
}

export interface SiteHeaderSettings {
  showHeader: boolean
  logoType: "text" | "image"
  logoText: string
  logoImage: string
  logoSize: number
  sticky: boolean
  glassEffect: boolean
  showNavLinks: boolean
  navLinks: { label: string; href: string }[]
}

export interface InterfaceSettings {
  // Glass effect
  glassBlur: number // 0-30
  glassOpacity: number // 0-100
  glassBorder: number // 0-100
  
  // Colors
  primaryColor: string
  accentColor: string
  backgroundColor: string
  
  // Border radius
  borderRadius: number // 0-32
  
  // Button styles
  buttonStyle: "solid" | "outline" | "ghost" | "gradient"
  buttonRounded: number // 0-32
  
  // Animations
  enableAnimations: boolean
  animationSpeed: "slow" | "normal" | "fast"
  
  // Layout
  sidebarPosition: "left" | "right"
  contentMaxWidth: number // 800-1600
  spacing: "compact" | "normal" | "relaxed"
}

export interface SecuritySettings {
  // Stealing prevention
  preventScreenshot: boolean
  preventInspect: boolean
  preventCopy: boolean
  hideOnBlur: boolean
  
  // Custom message
  protectionMessage: string
  
  // Admin password for security toggle
  securityEnabled: boolean
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Generic storage helpers
export function getStorageItem<T>(key: string): T[] {
  if (typeof window === "undefined") return []
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : []
  } catch {
    return []
  }
}

export function setStorageItem<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

// Projects
export function getProjects(): LocalProject[] {
  return getStorageItem<LocalProject>(STORAGE_KEYS.PROJECTS)
}

export function addProject(project: Omit<LocalProject, "id" | "created_at">): LocalProject {
  const projects = getProjects()
  const newProject: LocalProject = {
    ...project,
    id: generateId(),
    created_at: new Date().toISOString(),
  }
  projects.push(newProject)
  setStorageItem(STORAGE_KEYS.PROJECTS, projects)
  return newProject
}

export function deleteProject(id: string): boolean {
  const projects = getProjects()
  const filtered = projects.filter((p) => p.id !== id)
  setStorageItem(STORAGE_KEYS.PROJECTS, filtered)
  return filtered.length < projects.length
}

// Skills
export function getSkills(): LocalSkill[] {
  return getStorageItem<LocalSkill>(STORAGE_KEYS.SKILLS)
}

export function addSkill(skill: Omit<LocalSkill, "id" | "created_at">): LocalSkill {
  const skills = getSkills()
  const newSkill: LocalSkill = {
    ...skill,
    id: generateId(),
    created_at: new Date().toISOString(),
  }
  skills.push(newSkill)
  setStorageItem(STORAGE_KEYS.SKILLS, skills)
  return newSkill
}

export function deleteSkill(id: string): boolean {
  const skills = getSkills()
  const filtered = skills.filter((s) => s.id !== id)
  setStorageItem(STORAGE_KEYS.SKILLS, filtered)
  return filtered.length < skills.length
}

// Contacts
export function getContacts(): LocalContact[] {
  return getStorageItem<LocalContact>(STORAGE_KEYS.CONTACTS)
}

export function addContact(contact: Omit<LocalContact, "id" | "created_at">): LocalContact {
  const contacts = getContacts()
  const newContact: LocalContact = {
    ...contact,
    id: generateId(),
    created_at: new Date().toISOString(),
  }
  contacts.push(newContact)
  setStorageItem(STORAGE_KEYS.CONTACTS, contacts)
  return newContact
}

export function deleteContact(id: string): boolean {
  const contacts = getContacts()
  const filtered = contacts.filter((c) => c.id !== id)
  setStorageItem(STORAGE_KEYS.CONTACTS, filtered)
  return filtered.length < contacts.length
}

// Auth helpers - Use sessionStorage for temporary session only (not persistent)
// Auth state is cleared on page reload/close for maximum security
export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false
  // Use sessionStorage - auth does NOT persist across browser sessions
  return sessionStorage.getItem(STORAGE_KEYS.AUTH) === "true"
}

export function setAdminLoggedIn(value: boolean): void {
  if (typeof window === "undefined") return
  if (value) {
    // Use sessionStorage - auth is temporary and cleared on close
    sessionStorage.setItem(STORAGE_KEYS.AUTH, "true")
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH)
  }
}

// Clear auth on page unload for strict security
export function clearAuthOnUnload(): void {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(STORAGE_KEYS.AUTH)
}

// Admin password verification
export const ADMIN_EMAIL = "admin@ar.com"
export const ADMIN_PASSWORD = "BloodyA70@1"

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD
}

// Default theme CSS
export const DEFAULT_THEME_CSS = `/* Default Dark Theme - Professional & Minimal */
:root {
  --background: #0a0a0a;
  --foreground: #fafafa;
  --card: rgba(255, 255, 255, 0.08);
  --primary: #fafafa;
  --primary-foreground: #0a0a0a;
  --muted: rgba(255, 255, 255, 0.06);
  --muted-foreground: #a1a1aa;
  --accent: rgba(255, 255, 255, 0.12);
  --border: rgba(255, 255, 255, 0.12);
  --glass: rgba(255, 255, 255, 0.12);
  --glass-border: rgba(255, 255, 255, 0.18);
}`

// Themes
export function getThemes(): LocalTheme[] {
  const themes = getStorageItem<LocalTheme>(STORAGE_KEYS.THEMES)
  // Always ensure default theme exists
  const hasDefault = themes.some((t) => t.isDefault)
  if (!hasDefault && themes.length === 0) {
    const defaultTheme: LocalTheme = {
      id: "default",
      name: "Default",
      css: DEFAULT_THEME_CSS,
      isDefault: true,
      created_at: new Date().toISOString(),
    }
    setStorageItem(STORAGE_KEYS.THEMES, [defaultTheme])
    return [defaultTheme]
  }
  return themes
}

export function addTheme(theme: Omit<LocalTheme, "id" | "created_at">): LocalTheme {
  const themes = getThemes()
  const newTheme: LocalTheme = {
    ...theme,
    id: generateId(),
    created_at: new Date().toISOString(),
  }
  themes.push(newTheme)
  setStorageItem(STORAGE_KEYS.THEMES, themes)
  return newTheme
}

export function updateTheme(id: string, updates: Partial<LocalTheme>): boolean {
  const themes = getThemes()
  const index = themes.findIndex((t) => t.id === id)
  if (index === -1) return false
  themes[index] = { ...themes[index], ...updates }
  setStorageItem(STORAGE_KEYS.THEMES, themes)
  return true
}

export function deleteTheme(id: string): boolean {
  const themes = getThemes()
  const theme = themes.find((t) => t.id === id)
  // Don't allow deleting the default theme
  if (theme?.isDefault) return false
  const filtered = themes.filter((t) => t.id !== id)
  setStorageItem(STORAGE_KEYS.THEMES, filtered)
  // If deleted theme was active, switch to default
  if (getActiveThemeId() === id) {
    const defaultTheme = filtered.find((t) => t.isDefault)
    if (defaultTheme) setActiveThemeId(defaultTheme.id)
  }
  return filtered.length < themes.length
}

export function getActiveThemeId(): string {
  if (typeof window === "undefined") return "default"
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_THEME) || "default"
}

export function setActiveThemeId(id: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.ACTIVE_THEME, id)
}

export function getActiveTheme(): LocalTheme | null {
  const themes = getThemes()
  const activeId = getActiveThemeId()
  return themes.find((t) => t.id === activeId) || themes.find((t) => t.isDefault) || null
}

// Header Settings
const DEFAULT_HEADER_SETTINGS: HeaderSettings = {
  title: "Portfolio | Full-Stack Developer",
  headerText: "Developer Portfolio",
  favicon: { type: "icon", value: "Code" }
}

export function getHeaderSettings(): HeaderSettings {
  if (typeof window === "undefined") return DEFAULT_HEADER_SETTINGS
  try {
    const item = localStorage.getItem(STORAGE_KEYS.HEADER_SETTINGS)
    if (!item) return DEFAULT_HEADER_SETTINGS
    return { ...DEFAULT_HEADER_SETTINGS, ...JSON.parse(item) }
  } catch {
    return DEFAULT_HEADER_SETTINGS
  }
}

export function setHeaderSettings(settings: Partial<HeaderSettings>): void {
  if (typeof window === "undefined") return
  try {
    const current = getHeaderSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(STORAGE_KEYS.HEADER_SETTINGS, JSON.stringify(updated))
  } catch (error) {
    console.error("Error saving header settings:", error)
  }
}

// Interface Settings
const DEFAULT_INTERFACE_SETTINGS: InterfaceSettings = {
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

export function getInterfaceSettings(): InterfaceSettings {
  if (typeof window === "undefined") return DEFAULT_INTERFACE_SETTINGS
  try {
    const item = localStorage.getItem(STORAGE_KEYS.INTERFACE_SETTINGS)
    if (!item) return DEFAULT_INTERFACE_SETTINGS
    return { ...DEFAULT_INTERFACE_SETTINGS, ...JSON.parse(item) }
  } catch {
    return DEFAULT_INTERFACE_SETTINGS
  }
}

export function setInterfaceSettings(settings: Partial<InterfaceSettings>): void {
  if (typeof window === "undefined") return
  try {
    const current = getInterfaceSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(STORAGE_KEYS.INTERFACE_SETTINGS, JSON.stringify(updated))
  } catch (error) {
    console.error("Error saving interface settings:", error)
  }
}

// Security Settings
const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  preventScreenshot: false,
  preventInspect: false,
  preventCopy: false,
  hideOnBlur: false,
  protectionMessage: "Content Protected - Return to view",
  securityEnabled: false
}

export function getSecuritySettings(): SecuritySettings {
  if (typeof window === "undefined") return DEFAULT_SECURITY_SETTINGS
  try {
    const item = localStorage.getItem(STORAGE_KEYS.SECURITY_SETTINGS)
    if (!item) return DEFAULT_SECURITY_SETTINGS
    return { ...DEFAULT_SECURITY_SETTINGS, ...JSON.parse(item) }
  } catch {
    return DEFAULT_SECURITY_SETTINGS
  }
}

export function setSecuritySettings(settings: Partial<SecuritySettings>): void {
  if (typeof window === "undefined") return
  try {
    const current = getSecuritySettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(STORAGE_KEYS.SECURITY_SETTINGS, JSON.stringify(updated))
  } catch (error) {
    console.error("Error saving security settings:", error)
  }
}

// Hero Settings
const DEFAULT_HERO_SETTINGS: HeroSettings = {
  name: "Developer",
  title: "Full-Stack Developer",
  headline: "Crafting Digital Experiences",
  subheadline: "I build modern, performant, and beautiful web applications using cutting-edge technologies.",
  badge: "Available for hire",
  primaryCta: "View My Work",
  secondaryCta: "Get In Touch",
  socialLinks: {}
}

export function getHeroSettings(): HeroSettings {
  if (typeof window === "undefined") return DEFAULT_HERO_SETTINGS
  try {
    const item = localStorage.getItem(STORAGE_KEYS.HERO_SETTINGS)
    if (!item) return DEFAULT_HERO_SETTINGS
    return { ...DEFAULT_HERO_SETTINGS, ...JSON.parse(item) }
  } catch {
    return DEFAULT_HERO_SETTINGS
  }
}

export function setHeroSettings(settings: Partial<HeroSettings>): void {
  if (typeof window === "undefined") return
  try {
    const current = getHeroSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(STORAGE_KEYS.HERO_SETTINGS, JSON.stringify(updated))
  } catch (error) {
    console.error("Error saving hero settings:", error)
  }
}

// Footer Settings
const DEFAULT_FOOTER_SETTINGS: FooterSettings = {
  logoText: "Portfolio",
  copyright: "All rights reserved.",
  builtWith: "Built with Next.js"
}

export function getFooterSettings(): FooterSettings {
  if (typeof window === "undefined") return DEFAULT_FOOTER_SETTINGS
  try {
    const item = localStorage.getItem(STORAGE_KEYS.FOOTER_SETTINGS)
    if (!item) return DEFAULT_FOOTER_SETTINGS
    return { ...DEFAULT_FOOTER_SETTINGS, ...JSON.parse(item) }
  } catch {
    return DEFAULT_FOOTER_SETTINGS
  }
}

export function setFooterSettings(settings: Partial<FooterSettings>): void {
  if (typeof window === "undefined") return
  try {
    const current = getFooterSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(STORAGE_KEYS.FOOTER_SETTINGS, JSON.stringify(updated))
  } catch (error) {
    console.error("Error saving footer settings:", error)
  }
}

// Default Element Style
const DEFAULT_ELEMENT_STYLE: ElementStyle = {
  color: "",
  backgroundColor: "",
  borderColor: "",
  borderWidth: 1,
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 500,
  padding: 16,
  opacity: 100,
  offsetX: 0,
  offsetY: 0,
  shadow: "none",
  blur: 0
}

// Default Element Settings
const DEFAULT_ELEMENT_SETTINGS: ElementSettings = {
  primaryButton: { backgroundColor: "#fafafa", color: "#0a0a0a", borderRadius: 16, fontWeight: 600 },
  secondaryButton: { backgroundColor: "rgba(255,255,255,0.05)", color: "#fafafa", borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" },
  ghostButton: { backgroundColor: "transparent", color: "#fafafa", borderRadius: 12 },
  projectCard: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  skillCard: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  contactCard: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  glassCard: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 24, blur: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  heading: { color: "#fafafa", fontSize: 48, fontWeight: 700 },
  subheading: { color: "rgba(255,255,255,0.6)", fontSize: 20, fontWeight: 500 },
  bodyText: { color: "rgba(255,255,255,0.5)", fontSize: 16, fontWeight: 400 },
  caption: { color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 400 },
  badge: { backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", borderRadius: 9999, fontSize: 14, padding: 8 },
  iconPrimary: { color: "#fafafa", fontSize: 24 },
  iconSecondary: { color: "rgba(255,255,255,0.5)", fontSize: 20 },
  socialIcon: { color: "rgba(255,255,255,0.5)", fontSize: 20, padding: 12, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12 },
  section: { padding: 96 },
  container: { padding: 24 },
  divider: { backgroundColor: "rgba(255,255,255,0.1)" },
  siteHeader: { backgroundColor: "rgba(10,10,10,0.8)", blur: 20, padding: 16, borderColor: "rgba(255,255,255,0.1)" },
  navLink: { color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 500 },
  logo: { fontSize: 20, fontWeight: 700, color: "#fafafa" }
}

export function getElementSettings(): ElementSettings {
  if (typeof window === "undefined") return DEFAULT_ELEMENT_SETTINGS
  try {
    const item = localStorage.getItem(STORAGE_KEYS.ELEMENT_SETTINGS)
    if (!item) return DEFAULT_ELEMENT_SETTINGS
    return { ...DEFAULT_ELEMENT_SETTINGS, ...JSON.parse(item) }
  } catch {
    return DEFAULT_ELEMENT_SETTINGS
  }
}

export function setElementSettings(settings: Partial<ElementSettings>): void {
  if (typeof window === "undefined") return
  try {
    const current = getElementSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(STORAGE_KEYS.ELEMENT_SETTINGS, JSON.stringify(updated))
  } catch (error) {
    console.error("Error saving element settings:", error)
  }
}

export function getDefaultElementStyle(): ElementStyle {
  return { ...DEFAULT_ELEMENT_STYLE }
}

// Site Header Settings
const DEFAULT_SITE_HEADER_SETTINGS: SiteHeaderSettings = {
  showHeader: true,
  logoType: "text",
  logoText: "Portfolio",
  logoImage: "",
  logoSize: 32,
  sticky: true,
  glassEffect: true,
  showNavLinks: true,
  navLinks: [
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" }
  ]
}

export function getSiteHeaderSettings(): SiteHeaderSettings {
  if (typeof window === "undefined") return DEFAULT_SITE_HEADER_SETTINGS
  try {
    const item = localStorage.getItem(STORAGE_KEYS.SITE_HEADER_SETTINGS)
    if (!item) return DEFAULT_SITE_HEADER_SETTINGS
    return { ...DEFAULT_SITE_HEADER_SETTINGS, ...JSON.parse(item) }
  } catch {
    return DEFAULT_SITE_HEADER_SETTINGS
  }
}

export function setSiteHeaderSettings(settings: Partial<SiteHeaderSettings>): void {
  if (typeof window === "undefined") return
  try {
    const current = getSiteHeaderSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(STORAGE_KEYS.SITE_HEADER_SETTINGS, JSON.stringify(updated))
  } catch (error) {
    console.error("Error saving site header settings:", error)
  }
}

// Account Settings
export interface AccountSettings {
  displayName: string
  adminLogo: string
  adminLogoType: "text" | "image"
  email: string
  avatar: string
}

const DEFAULT_ACCOUNT_SETTINGS: AccountSettings = {
  displayName: "Admin",
  adminLogo: "Finale AR",
  adminLogoType: "text",
  email: "",
  avatar: ""
}

export function getAccountSettings(): AccountSettings {
  if (typeof window === "undefined") return DEFAULT_ACCOUNT_SETTINGS
  try {
    const item = localStorage.getItem(STORAGE_KEYS.ACCOUNT_SETTINGS)
    if (!item) return DEFAULT_ACCOUNT_SETTINGS
    return { ...DEFAULT_ACCOUNT_SETTINGS, ...JSON.parse(item) }
  } catch {
    return DEFAULT_ACCOUNT_SETTINGS
  }
}

export function setAccountSettings(settings: Partial<AccountSettings>): void {
  if (typeof window === "undefined") return
  try {
    const current = getAccountSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(STORAGE_KEYS.ACCOUNT_SETTINGS, JSON.stringify(updated))
  } catch (error) {
    console.error("Error saving account settings:", error)
  }
}
