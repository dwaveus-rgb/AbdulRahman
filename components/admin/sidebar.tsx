"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { setAdminLoggedIn, getAccountSettings, type AccountSettings } from "@/lib/local-storage"
import {
  LayoutDashboard,
  Folder,
  Zap,
  Users,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Palette,
  Settings,
  Sliders,
  Shield,
  Sparkles,
  FileText,
  PanelTop,
  Wand2,
  UserCog,
} from "lucide-react"
import { useState, useEffect } from "react"

interface AdminSidebarProps {
  user: {
    id: string
    email: string
    name: string | null
  }
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: Folder },
  { href: "/admin/skills", label: "Skills", icon: Zap },
  { href: "/admin/contacts", label: "Contacts", icon: Users },
  { href: "/admin/themes", label: "Themes", icon: Palette },
  { href: "/admin/visual-editor", label: "Visual Editor", icon: Wand2 },
  { href: "/admin/settings/hero", label: "Hero", icon: Sparkles },
  { href: "/admin/settings/footer", label: "Footer", icon: FileText },
  { href: "/admin/settings/header", label: "Header", icon: Settings },
  { href: "/admin/settings/site-header", label: "Site Header", icon: PanelTop },
  { href: "/admin/settings/account", label: "Account", icon: UserCog },
  { href: "/admin/settings/interface", label: "Interface", icon: Sliders },
  { href: "/admin/settings/security", label: "Security", icon: Shield },
]

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [accountSettings, setAccountSettings] = useState<AccountSettings | null>(null)

  useEffect(() => {
    setAccountSettings(getAccountSettings())
    
    const handleUpdate = () => {
      setAccountSettings(getAccountSettings())
    }
    
    window.addEventListener("accountSettingsUpdated", handleUpdate)
    return () => window.removeEventListener("accountSettingsUpdated", handleUpdate)
  }, [])

  function handleLogout() {
    setAdminLoggedIn(false)
    router.push("/admin/login")
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-white/[0.08] border border-white/[0.12] backdrop-blur-xl md:hidden text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Apple Glass Style */}
      <motion.aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-40 h-screen w-64 flex flex-col",
          "bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] backdrop-saturate-[140%]",
          "border-r border-white/[0.1]",
          "transition-transform md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        initial={false}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/[0.1]">
          <Link href="/admin" className="flex items-center gap-3">
            {accountSettings?.adminLogoType === "image" && accountSettings.adminLogo ? (
              <img
                src={accountSettings.adminLogo}
                alt="Admin Logo"
                className="h-10 w-auto object-contain"
              />
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-white/[0.1] border border-white/[0.15] flex items-center justify-center">
                  <span className="text-white font-bold">
                    {(accountSettings?.adminLogo || "A").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-lg text-white">
                    {accountSettings?.adminLogo || "Admin"}
                  </span>
                  <p className="text-xs text-white/50">Portfolio Manager</p>
                </div>
              </>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/admin" && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  isActive
                    ? "bg-white/[0.12] text-white"
                    : "text-white/50 hover:text-white hover:bg-white/[0.06]"
                )}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                    layoutId="activeIndicator"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User & Actions */}
        <div className="p-4 border-t border-white/[0.1] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <ExternalLink size={20} />
            <span>View Site</span>
          </Link>
          
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>

          <div className="flex items-center gap-3 px-4 py-3">
            {accountSettings?.avatar && (
              <img
                src={accountSettings.avatar}
                alt="Avatar"
                className="w-8 h-8 rounded-lg object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">
                {accountSettings?.displayName || user.name || "Admin"}
              </p>
              <p className="text-xs text-white/40 truncate">
                {accountSettings?.email || user.email}
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
