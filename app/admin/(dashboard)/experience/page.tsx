import { createClient } from "@/lib/supabase/server"
import { ExperienceManager } from "@/components/admin/experience-manager"

async function getExperiences() {
  const supabase = await createClient()
  if (!supabase) return []
  const { data } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("start_date", { ascending: false })
  
  return data || []
}

export default async function AdminExperiencePage() {
  const experiences = await getExperiences()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Experience</h1>
        <p className="text-muted-foreground">Manage your work history and career milestones</p>
      </div>
      
      <ExperienceManager initialExperiences={experiences} />
    </div>
  )
}
