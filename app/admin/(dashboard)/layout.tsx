"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { isAdminLoggedIn, clearAuthOnUnload } from "@/lib/local-storage"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = useCallback(() => {
    // STRICT SECURITY: Check auth on EVERY navigation/mount
    if (!isAdminLoggedIn()) {
      router.replace("/admin/login")
      return false
    }
    return true
  }, [router])

  useEffect(() => {
    // Check auth on initial mount
    const authorized = checkAuth()
    setIsAuthorized(authorized)
    setIsLoading(false)

    // Clear auth on page unload (browser close/refresh)
    const handleBeforeUnload = () => {
      clearAuthOnUnload()
    }
    
    window.addEventListener("beforeunload", handleBeforeUnload)
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [checkAuth])

  // Re-check auth on pathname change (navigation within admin)
  useEffect(() => {
    if (!isLoading) {
      const authorized = checkAuth()
      setIsAuthorized(authorized)
    }
  }, [pathname, isLoading, checkAuth])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full" />
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      <AdminSidebar user={{ id: "admin-1", email: "admin@ar.com", name: "Admin" }} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
