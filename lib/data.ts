import { createClient } from "@/lib/supabase/server"
import type { Project, Skill, Experience, SiteSetting } from "@/lib/types"

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error)
    return []
  }

  return data || []
}

export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Error fetching skills:", error)
    return []
  }

  return data || []
}

export async function getExperiences(): Promise<Experience[]> {
  const supabase = await createClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("start_date", { ascending: false })

  if (error) {
    console.error("Error fetching experiences:", error)
    return []
  }

  return data || []
}

export async function getSiteSetting<T>(key: string): Promise<T | null> {
  const supabase = await createClient()
  if (!supabase) return null
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle()

  if (error) {
    console.error(`Error fetching setting ${key}:`, error)
    return null
  }

  return data?.value as T ?? null
}

export async function getAllSiteSettings(): Promise<Record<string, unknown>> {
  const supabase = await createClient()
  if (!supabase) return {}
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value")

  if (error) {
    console.error("Error fetching site settings:", error)
    return {}
  }

  return (data || []).reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {} as Record<string, unknown>)
}
