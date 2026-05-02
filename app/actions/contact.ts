"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function submitContactForm(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string || null,
      message: formData.get("message") as string,
    }

    // Validate
    const validated = contactSchema.safeParse(rawData)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || "Invalid form data",
      }
    }

    const supabase = await createClient()
    if (!supabase) {
      return {
        success: false,
        error: "Database not configured. Please try again later.",
      }
    }

    const { error } = await supabase.from("contact_messages").insert({
      name: validated.data.name,
      email: validated.data.email,
      subject: validated.data.subject,
      message: validated.data.message,
    })

    if (error) {
      console.error("Supabase error:", error)
      return {
        success: false,
        error: "Failed to send message. Please try again.",
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Contact form error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}
