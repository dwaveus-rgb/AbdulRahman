import { createClient } from "@/lib/supabase/server"
import { MessagesManager } from "@/components/admin/messages-manager"

async function getMessages() {
  const supabase = await createClient()
  if (!supabase) return []
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
  
  return data || []
}

export default async function AdminMessagesPage() {
  const messages = await getMessages()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">Contact form submissions from your portfolio</p>
      </div>
      
      <MessagesManager initialMessages={messages} />
    </div>
  )
}
