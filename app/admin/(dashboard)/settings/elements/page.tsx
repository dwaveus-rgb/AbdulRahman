"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Redirect to the new Visual Editor
export default function ElementsSettingsPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace("/admin/visual-editor")
  }, [router])
  
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto" />
        <p className="text-white/50">Redirecting to Visual Editor...</p>
      </div>
    </div>
  )
}
