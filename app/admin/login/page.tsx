"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react"
import { setAdminLoggedIn, verifyAdminCredentials, clearAuthOnUnload } from "@/lib/local-storage"

export default function AdminLoginPage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
    
    // STRICT SECURITY: Clear any existing auth state on page load
    // This forces re-login every time the user visits /admin/login
    clearAuthOnUnload()
    
    // Also clear fields on mount to prevent autofill
    if (emailRef.current) emailRef.current.value = ""
    if (passwordRef.current) passwordRef.current.value = ""
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Simulate a slight delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check credentials
    if (verifyAdminCredentials(email, password)) {
      setAdminLoggedIn(true)
      router.push("/admin")
    } else {
      // STRICT SECURITY: On wrong password, redirect to home
      setError("Invalid credentials")
      setIsPending(false)
      
      // Redirect to home after showing error briefly
      setTimeout(() => {
        router.push("/")
      }, 1500)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a]">
      {/* Subtle background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/[0.02] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-3xl" />
      </div>
      
      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2 text-white">Admin Login</h1>
          <p className="text-white/50">Sign in to manage your portfolio</p>
        </div>

        <GlassCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <div>
              <label htmlFor="admin-email-field" className="block text-sm font-medium mb-2 text-white/80">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input
                  ref={emailRef}
                  type="email"
                  id="admin-email-field"
                  name="email"
                  required
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-form-type="other"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password-field" className="block text-sm font-medium mb-2 text-white/80">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  id="admin-password-field"
                  name="password"
                  required
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-form-type="other"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                className="flex items-center gap-2 text-red-400 bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle size={20} />
                <span>{error} - Redirecting...</span>
              </motion.div>
            )}

            <NeonButton type="submit" size="lg" className="w-full" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign In"}
            </NeonButton>
          </form>
        </GlassCard>

        <p className="text-center mt-6 text-sm text-white/40">
          <Link href="/" className="hover:text-white/60 transition-colors">
            &larr; Back to website
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
