"use server"

import { createSession, destroySession } from "@/lib/auth"
import { z } from "zod"
import { redirect } from "next/navigation"

// Hardcoded admin credentials
const ADMIN_EMAIL = "admin@ar.com"
const ADMIN_PASSWORD = "BloodyA70@1"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export async function login(formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const validated = loginSchema.safeParse(rawData)
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.errors[0]?.message || "Invalid credentials",
    }
  }

  // Check against hardcoded credentials
  if (
    validated.data.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() ||
    validated.data.password !== ADMIN_PASSWORD
  ) {
    return {
      success: false,
      error: "Invalid email or password",
    }
  }

  // Create session with hardcoded admin info
  await createSession({
    id: "admin-1",
    email: ADMIN_EMAIL,
    name: "Admin",
  })

  return { success: true }
}

export async function logout() {
  await destroySession()
  redirect("/admin/login")
}
