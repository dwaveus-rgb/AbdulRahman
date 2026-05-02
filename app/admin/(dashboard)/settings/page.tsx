import { getAllSiteSettings } from "@/lib/data"
import { SettingsManager } from "@/components/admin/settings-manager"

export default async function AdminSettingsPage() {
  const settings = await getAllSiteSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure your portfolio site settings</p>
      </div>
      
      <SettingsManager initialSettings={settings} />
    </div>
  )
}
