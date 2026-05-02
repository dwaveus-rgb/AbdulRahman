import { SidebarNav } from "@/components/sidebar-nav"
import { Hero } from "@/components/sections/hero"
import { DynamicProjects } from "@/components/sections/dynamic-projects"
import { DynamicSkills } from "@/components/sections/dynamic-skills"
import { DynamicContacts } from "@/components/sections/dynamic-contacts"
import { Footer } from "@/components/footer"

function SectionDivider() {
  return (
    <div className="relative w-full max-w-6xl mx-auto px-6">
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen pt-16">
      <SidebarNav />
      
      <section id="hero">
        <Hero />
      </section>

      <SectionDivider />

      <DynamicProjects />
      
      <SectionDivider />
      
      <DynamicSkills />
      
      <SectionDivider />
      
      <DynamicContacts />
      
      <SectionDivider />
      
      <Footer />
    </main>
  )
}
