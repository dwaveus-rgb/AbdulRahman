"use client"

import { motion } from "framer-motion"
import { Section } from "@/components/ui/section"
import { GlassCard } from "@/components/ui/glass-card"
import type { Experience } from "@/lib/types"
import { Briefcase } from "lucide-react"

interface ExperienceProps {
  experiences: Experience[]
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

export function ExperienceSection({ experiences }: ExperienceProps) {
  return (
    <Section
      id="experience"
      title="Work Experience"
      subtitle="My professional journey and career milestones"
      className="relative"
    >
      <div className="max-w-3xl mx-auto relative">
        {/* Timeline line */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent md:-translate-x-px" />

        {experiences.map((experience, index) => (
          <motion.div
            key={experience.id}
            className={`relative pl-8 md:pl-0 pb-12 last:pb-0 ${
              index % 2 === 0 ? "md:pr-[calc(50%+2rem)]" : "md:pl-[calc(50%+2rem)]"
            }`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* Timeline dot */}
            <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 rounded-full bg-primary border-4 border-background md:-translate-x-1/2 shadow-[0_0_20px_rgba(0,217,255,0.5)]" />

            <GlassCard className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Briefcase size={20} />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold">{experience.position}</h3>
                  <p className="text-primary font-medium">{experience.company}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(experience.start_date)} -{" "}
                    {experience.is_current
                      ? "Present"
                      : experience.end_date
                      ? formatDate(experience.end_date)
                      : ""}
                  </p>
                </div>
              </div>

              {experience.description && (
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {experience.description}
                </p>
              )}

              {experience.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs font-mono bg-primary/10 text-primary rounded border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {experiences.length === 0 && (
        <div className="text-center py-16">
          <Briefcase size={64} className="mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Experience coming soon...</p>
        </div>
      )}
    </Section>
  )
}
