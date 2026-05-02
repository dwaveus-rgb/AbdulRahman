"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Project schemas
const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  long_description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  technologies: z.array(z.string()).default([]),
  live_url: z.string().url().optional().or(z.literal("")),
  github_url: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  sort_order: z.number().default(0),
})

export async function createProject(formData: FormData) {
  await requireAuth()
  
  const data = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    long_description: formData.get("long_description") as string || undefined,
    image_url: formData.get("image_url") as string || undefined,
    technologies: (formData.get("technologies") as string)?.split(",").map(t => t.trim()).filter(Boolean) || [],
    live_url: formData.get("live_url") as string || undefined,
    github_url: formData.get("github_url") as string || undefined,
    featured: formData.get("featured") === "true",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  }

  const validated = projectSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0]?.message }
  }

  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }
  const { error } = await supabase.from("projects").insert({
    ...validated.data,
    image_url: validated.data.image_url || null,
    live_url: validated.data.live_url || null,
    github_url: validated.data.github_url || null,
    long_description: validated.data.long_description || null,
  })

  if (error) {
    console.error("Error creating project:", error)
    return { success: false, error: "Failed to create project" }
  }

  revalidatePath("/admin/projects")
  revalidatePath("/")
  return { success: true }
}

export async function updateProject(id: string, formData: FormData) {
  await requireAuth()
  
  const data = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    long_description: formData.get("long_description") as string || undefined,
    image_url: formData.get("image_url") as string || undefined,
    technologies: (formData.get("technologies") as string)?.split(",").map(t => t.trim()).filter(Boolean) || [],
    live_url: formData.get("live_url") as string || undefined,
    github_url: formData.get("github_url") as string || undefined,
    featured: formData.get("featured") === "true",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  }

  const validated = projectSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0]?.message }
  }

  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }
  const { error } = await supabase.from("projects").update({
    ...validated.data,
    image_url: validated.data.image_url || null,
    live_url: validated.data.live_url || null,
    github_url: validated.data.github_url || null,
    long_description: validated.data.long_description || null,
    updated_at: new Date().toISOString(),
  }).eq("id", id)

  if (error) {
    console.error("Error updating project:", error)
    return { success: false, error: "Failed to update project" }
  }

  revalidatePath("/admin/projects")
  revalidatePath("/")
  return { success: true }
}

export async function deleteProject(id: string) {
  await requireAuth()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }
  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) {
    console.error("Error deleting project:", error)
    return { success: false, error: "Failed to delete project" }
  }

  revalidatePath("/admin/projects")
  revalidatePath("/")
  return { success: true }
}

// Skill actions
const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  proficiency: z.number().min(0).max(100).default(80),
  icon: z.string().optional(),
  sort_order: z.number().default(0),
})

export async function createSkill(formData: FormData) {
  await requireAuth()
  
  const data = {
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    proficiency: parseInt(formData.get("proficiency") as string) || 80,
    icon: formData.get("icon") as string || undefined,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  }

  const validated = skillSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0]?.message }
  }

  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }
  const { error } = await supabase.from("skills").insert({
    ...validated.data,
    icon: validated.data.icon || null,
  })

  if (error) {
    console.error("Error creating skill:", error)
    return { success: false, error: "Failed to create skill" }
  }

  revalidatePath("/admin/skills")
  revalidatePath("/")
  return { success: true }
}

export async function updateSkill(id: string, formData: FormData) {
  await requireAuth()
  
  const data = {
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    proficiency: parseInt(formData.get("proficiency") as string) || 80,
    icon: formData.get("icon") as string || undefined,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  }

  const validated = skillSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0]?.message }
  }

  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }
  const { error } = await supabase.from("skills").update({
    ...validated.data,
    icon: validated.data.icon || null,
  }).eq("id", id)

  if (error) {
    console.error("Error updating skill:", error)
    return { success: false, error: "Failed to update skill" }
  }

  revalidatePath("/admin/skills")
  revalidatePath("/")
  return { success: true }
}

export async function deleteSkill(id: string) {
  await requireAuth()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }
  const { error } = await supabase.from("skills").delete().eq("id", id)

  if (error) {
    console.error("Error deleting skill:", error)
    return { success: false, error: "Failed to delete skill" }
  }

  revalidatePath("/admin/skills")
  revalidatePath("/")
  return { success: true }
}

// Experience actions
const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  description: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  is_current: z.boolean().default(false),
  technologies: z.array(z.string()).default([]),
  sort_order: z.number().default(0),
})

export async function createExperience(formData: FormData) {
  await requireAuth()
  
  const data = {
    company: formData.get("company") as string,
    position: formData.get("position") as string,
    description: formData.get("description") as string || undefined,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string || undefined,
    is_current: formData.get("is_current") === "true",
    technologies: (formData.get("technologies") as string)?.split(",").map(t => t.trim()).filter(Boolean) || [],
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  }

  const validated = experienceSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0]?.message }
  }

  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }
  const { error } = await supabase.from("experiences").insert({
    ...validated.data,
    description: validated.data.description || null,
    end_date: validated.data.end_date || null,
  })

  if (error) {
    console.error("Error creating experience:", error)
    return { success: false, error: "Failed to create experience" }
  }

  revalidatePath("/admin/experience")
  revalidatePath("/")
  return { success: true }
}

export async function updateExperience(id: string, formData: FormData) {
  await requireAuth()
  
  const data = {
    company: formData.get("company") as string,
    position: formData.get("position") as string,
    description: formData.get("description") as string || undefined,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string || undefined,
    is_current: formData.get("is_current") === "true",
    technologies: (formData.get("technologies") as string)?.split(",").map(t => t.trim()).filter(Boolean) || [],
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  }

  const validated = experienceSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0]?.message }
  }

  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }
  const { error } = await supabase.from("experiences").update({
    ...validated.data,
    description: validated.data.description || null,
    end_date: validated.data.end_date || null,
  }).eq("id", id)

  if (error) {
    console.error("Error updating experience:", error)
    return { success: false, error: "Failed to update experience" }
  }

  revalidatePath("/admin/experience")
  revalidatePath("/")
  return { success: true }
}

export async function deleteExperience(id: string) {
  await requireAuth()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }
  const { error } = await supabase.from("experiences").delete().eq("id", id)

  if (error) {
    console.error("Error deleting experience:", error)
    return { success: false, error: "Failed to delete experience" }
  }

  revalidatePath("/admin/experience")
  revalidatePath("/")
  return { success: true }
}

// Messages actions
export async function markMessageAsRead(id: string) {
  await requireAuth()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }
  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("id", id)

  if (error) {
    console.error("Error marking message as read:", error)
    return { success: false, error: "Failed to update message" }
  }

  revalidatePath("/admin/messages")
  revalidatePath("/admin")
  return { success: true }
}

export async function deleteMessage(id: string) {
  await requireAuth()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }
  const { error } = await supabase.from("contact_messages").delete().eq("id", id)

  if (error) {
    console.error("Error deleting message:", error)
    return { success: false, error: "Failed to delete message" }
  }

  revalidatePath("/admin/messages")
  revalidatePath("/admin")
  return { success: true }
}

// Settings actions
export async function updateSiteSetting(key: string, value: Record<string, unknown>) {
  await requireAuth()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }
  
  // Upsert the setting
  const { error } = await supabase
    .from("site_settings")
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    )

  if (error) {
    console.error("Error updating setting:", error)
    return { success: false, error: "Failed to update setting" }
  }

  revalidatePath("/admin/settings")
  revalidatePath("/")
  return { success: true }
}
