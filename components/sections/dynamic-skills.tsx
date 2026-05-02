"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Zap, Code, Database, Wrench } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { getSkills, type LocalSkill } from "@/lib/local-storage"

// Helper to render icon from stored value
function RenderIcon({ 
  value, 
  size = 24, 
  className = "" 
}: { 
  value?: string
  size?: number
  className?: string 
}) {
  if (!value) {
    return <Zap size={size} className={className} />
  }

  // Check if it's a URL or base64
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) {
    return (
      <img
        src={value}
        alt="Icon"
        className={`object-contain ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  // Try to get Lucide icon
  const iconKey = value.charAt(0).toUpperCase() + value.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[iconKey]
  
  if (IconComponent) {
    return <IconComponent size={size} className={className} />
  }

  return <Zap size={size} className={className} />
}

// Categorize skills by common patterns
function categorizeSkills(skills: LocalSkill[]) {
  const categories: Record<string, LocalSkill[]> = {
    "Frontend": [],
    "Backend": [],
    "Tools": [],
    "Other": []
  }

  const frontendKeywords = ["react", "vue", "angular", "next", "css", "html", "tailwind", "sass", "javascript", "typescript", "frontend", "ui", "ux"]
  const backendKeywords = ["node", "python", "java", "go", "rust", "php", "ruby", "django", "express", "api", "sql", "database", "backend", "server", "mongo", "postgres"]
  const toolsKeywords = ["git", "docker", "aws", "cloud", "devops", "ci", "cd", "test", "linux", "vim", "vscode", "figma", "webpack", "vite"]

  skills.forEach(skill => {
    const name = skill.name.toLowerCase()
    if (frontendKeywords.some(kw => name.includes(kw))) {
      categories["Frontend"].push(skill)
    } else if (backendKeywords.some(kw => name.includes(kw))) {
      categories["Backend"].push(skill)
    } else if (toolsKeywords.some(kw => name.includes(kw))) {
      categories["Tools"].push(skill)
    } else {
      categories["Other"].push(skill)
    }
  })

  // Remove empty categories
  return Object.fromEntries(
    Object.entries(categories).filter(([, skills]) => skills.length > 0)
  )
}

const categoryIcons: Record<string, React.ReactNode> = {
  "Frontend": <Code size={20} />,
  "Backend": <Database size={20} />,
  "Tools": <Wrench size={20} />,
  "Other": <Zap size={20} />
}

export function DynamicSkills() {
  const [skills, setSkills] = useState<LocalSkill[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSkills(getSkills())
  }, [])

  const categorizedSkills = categorizeSkills(skills)

  if (!mounted) {
    return (
      <section id="skills" className="py-24 md:py-32 relative">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/50 text-sm font-medium mb-4">
              Expertise
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Skills & Technologies</h2>
          </div>
          <div className="flex justify-center py-16">
            <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="skills" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-500/[0.03] via-transparent to-transparent blur-3xl" />
      </div>

      <div className="container mx-auto px-6 md:px-8 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/50 text-sm font-medium mb-4"
          >
            Expertise
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Skills & Technologies
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-lg max-w-2xl mx-auto"
          >
            The tools and technologies I use to bring ideas to life
          </motion.p>
        </div>

        {skills.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
              <Zap size={32} className="text-white/20" />
            </div>
            <p className="text-white/30 text-lg">Skills coming soon...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(categorizedSkills).map(([category, categorySkills], catIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/50">
                    {categoryIcons[category]}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{category}</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/[0.1] to-transparent" />
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {categorySkills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      <div className="el-card-skill relative p-4 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
                        {/* Icon */}
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/[0.05] flex items-center justify-center text-white/60 group-hover:text-white transition-colors">
                          <RenderIcon value={skill.icon} size={24} />
                        </div>
                        
                        {/* Name */}
                        <p className="text-sm font-medium text-white text-center mb-2">
                          {skill.name}
                        </p>
                        
                        {/* Progress */}
                        <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.03 }}
                          />
                        </div>
                        
                        {/* Percentage tooltip on hover */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-white/[0.1] backdrop-blur-sm text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {skill.percentage}%
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
