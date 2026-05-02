export interface Project {
  id: string
  title: string
  slug: string
  description: string
  long_description: string | null
  image_url: string | null
  technologies: string[]
  live_url: string | null
  github_url: string | null
  featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  icon: string | null
  sort_order: number
  created_at: string
}

export interface Experience {
  id: string
  company: string
  position: string
  description: string | null
  start_date: string
  end_date: string | null
  is_current: boolean
  technologies: string[]
  sort_order: number
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  is_read: boolean
  created_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: Record<string, unknown>
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  name: string | null
  created_at: string
  updated_at: string
}

// Site settings value types
export interface AboutSettings {
  name: string
  title: string
  bio: string
  avatar_url: string | null
  resume_url: string | null
}

export interface SocialLinks {
  github: string | null
  linkedin: string | null
  twitter: string | null
  email: string | null
}

export interface HeroSettings {
  headline: string
  subheadline: string
  cta_text: string
  cta_link: string
}
