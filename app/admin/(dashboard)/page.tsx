"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Folder, Zap, Users, Plus } from "lucide-react"
import Link from "next/link"
import { getProjects, getSkills, getContacts } from "@/lib/local-storage"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    contacts: 0,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load stats from localStorage
    const projects = getProjects()
    const skills = getSkills()
    const contacts = getContacts()
    
    setStats({
      projects: projects.length,
      skills: skills.length,
      contacts: contacts.length,
    })
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full" />
      </div>
    )
  }

  const statCards = [
    { label: "Projects", value: stats.projects, icon: Folder, href: "/admin/projects" },
    { label: "Skills", value: stats.skills, icon: Zap, href: "/admin/skills" },
    { label: "Contacts", value: stats.contacts, icon: Users, href: "/admin/contacts" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">Dashboard</h1>
        <p className="text-white/50">Welcome to your portfolio admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <GlassCard className="p-6 cursor-pointer group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/50 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.08] text-white/60 group-hover:bg-white/[0.12] group-hover:text-white transition-all">
                  <stat.icon size={24} />
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-white">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/projects">
            <GlassCard className="p-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/[0.08] text-white/60">
                  <Plus size={20} />
                </div>
                <span className="font-medium text-white">Add New Project</span>
              </div>
            </GlassCard>
          </Link>
          <Link href="/admin/skills">
            <GlassCard className="p-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/[0.08] text-white/60">
                  <Plus size={20} />
                </div>
                <span className="font-medium text-white">Add New Skill</span>
              </div>
            </GlassCard>
          </Link>
          <Link href="/admin/contacts">
            <GlassCard className="p-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/[0.08] text-white/60">
                  <Plus size={20} />
                </div>
                <span className="font-medium text-white">Add New Contact</span>
              </div>
            </GlassCard>
          </Link>
        </div>
      </div>
    </div>
  )
}
