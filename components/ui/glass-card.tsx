"use client"

import { cn } from "@/lib/utils"
import { motion, type HTMLMotionProps } from "framer-motion"
import { forwardRef } from "react"

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  glow?: boolean
  hover?: boolean
  animated?: boolean
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow = false, hover = true, animated = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl",
          // Apple-style glass
          "bg-[rgba(255,255,255,0.1)]",
          "backdrop-blur-[20px] backdrop-saturate-[140%]",
          "border border-[rgba(255,255,255,0.18)]",
          // Subtle inner highlight at top
          "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[rgba(255,255,255,0.25)] before:to-transparent",
          // Soft shadow
          "shadow-[0_8px_32px_rgba(0,0,0,0.25)]",
          hover && "transition-all duration-300 hover:bg-[rgba(255,255,255,0.14)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]",
          className
        )}
        initial={animated ? { opacity: 0, y: 20 } : undefined}
        animate={animated ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

GlassCard.displayName = "GlassCard"
