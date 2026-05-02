"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AlertCircle, Lock } from "lucide-react"
import { verifyAdminPassword, setAdminLoggedIn } from "@/lib/local-storage"

interface AdminConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title?: string
  description?: string
}

export function AdminConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  title = "Prove You Are Admin",
  description = "Enter the admin password to confirm this action.",
}: AdminConfirmModalProps) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Clear password field when modal opens and disable autofill
  useEffect(() => {
    if (open) {
      setPassword("")
      setError("")
      // Slight delay to clear after any browser autofill
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.value = ""
        }
      }, 50)
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate a slight delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300))

    if (verifyAdminPassword(password)) {
      setPassword("")
      setIsLoading(false)
      onOpenChange(false)
      onConfirm()
    } else {
      // Wrong password - redirect to home
      setAdminLoggedIn(false)
      router.push("/")
    }
  }

  function handleCancel() {
    setPassword("")
    setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[rgba(20,20,20,0.95)] backdrop-blur-[20px] backdrop-saturate-[140%] border-white/[0.15]">
        <form onSubmit={handleSubmit} autoComplete="off">
          <DialogHeader>
            <div className="mx-auto mb-4 p-3 rounded-full bg-white/[0.08] text-white/70">
              <Lock size={24} />
            </div>
            <DialogTitle className="text-center text-xl text-white">{title}</DialogTitle>
            <DialogDescription className="text-center text-white/50">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-confirm-password" className="text-white/80">Admin Password</Label>
              <input
                ref={inputRef}
                id="admin-confirm-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-form-type="other"
                data-lpignore="true"
                data-1p-ignore="true"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
                autoFocus
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto bg-transparent border-white/[0.15] text-white/70 hover:bg-white/[0.08] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !password}
              className="w-full sm:w-auto bg-white text-black hover:bg-white/90"
            >
              {isLoading ? "Verifying..." : "Confirm Action"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
