"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { forwardRef, type ReactNode } from "react"

interface GlassButtonProps {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  children: ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
  type?: "button" | "submit" | "reset"
}

export const NeonButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, onClick, type = "button" }, ref) => {
    const variants = {
      primary: cn(
        "bg-white text-black",
        "hover:bg-white/90"
      ),
      secondary: cn(
        "bg-[rgba(255,255,255,0.1)] text-white",
        "backdrop-blur-[20px] backdrop-saturate-[140%]",
        "border border-[rgba(255,255,255,0.18)]",
        "hover:bg-[rgba(255,255,255,0.15)]"
      ),
      ghost: cn(
        "bg-transparent text-white/80",
        "hover:bg-[rgba(255,255,255,0.08)] hover:text-white"
      ),
    }

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2",
          "font-medium rounded-xl",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        whileHover={!disabled ? { scale: 1.02 } : undefined}
        whileTap={!disabled ? { scale: 0.98 } : undefined}
        disabled={disabled}
        onClick={onClick}
        type={type}
      >
        {children}
      </motion.button>
    )
  }
)

NeonButton.displayName = "NeonButton"

// Alias for backwards compatibility
export const GlassButton = NeonButton
