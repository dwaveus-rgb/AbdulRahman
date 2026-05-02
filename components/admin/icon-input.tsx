"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, Link, X, Image as ImageIcon } from "lucide-react"
import * as LucideIcons from "lucide-react"

type IconMode = "lucide" | "upload" | "url"

// Popular icon names for suggestions
const POPULAR_ICONS = [
  "Code", "Database", "Server", "Globe", "Terminal", "Cpu",
  "Palette", "Layers", "Box", "Cloud", "Lock", "Zap",
  "Github", "Linkedin", "Twitter", "Mail", "Instagram", "Youtube",
  "Facebook", "MessageSquare", "Phone", "MapPin", "Calendar", "User"
]

interface IconInputProps {
  name: string
  label?: string
  defaultValue?: string
  defaultUrl?: string
  placeholder?: string
  showPreview?: boolean
}

export function IconInput({
  name,
  label = "Icon",
  defaultValue = "",
  defaultUrl = "",
  placeholder = "e.g. Code, Database, Github",
  showPreview = true,
}: IconInputProps) {
  const [mode, setMode] = useState<IconMode>(
    defaultUrl ? "url" : defaultValue && !POPULAR_ICONS.includes(defaultValue) && defaultValue.startsWith("http") ? "url" : "lucide"
  )
  const [iconName, setIconName] = useState(defaultValue || "")
  const [urlValue, setUrlValue] = useState(defaultUrl || "")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(defaultUrl || null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const switchMode = (newMode: IconMode) => {
    setMode(newMode)
    setFile(null)
    setUrlValue("")
    setIconName("")
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return
    if (!selectedFile.type.startsWith("image/")) return
    setFile(selectedFile)
    
    // Convert file to base64 for persistent storage
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64String = e.target?.result as string
      setPreview(base64String)
      setUrlValue(base64String) // Store base64 in urlValue for persistence
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) handleFileChange(droppedFile)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleUrlChange = (value: string) => {
    setUrlValue(value)
    if (value && isValidUrl(value)) {
      setPreview(value)
    } else {
      setPreview(null)
    }
  }

  const clearImage = () => {
    setFile(null)
    setUrlValue("")
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const isValidUrl = (str: string) => {
    try {
      new URL(str)
      return true
    } catch {
      return false
    }
  }

  // Get Lucide icon component
  const getLucideIcon = (name: string) => {
    const iconKey = name.charAt(0).toUpperCase() + name.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (LucideIcons as any)[iconKey]
    return IconComponent || null
  }

  const IconPreview = getLucideIcon(iconName)

  // Resolved value for form submission
  const resolvedValue = mode === "lucide" ? iconName : (mode === "url" || mode === "upload") ? urlValue : ""

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-white/80">{label}</label>
      )}

      {/* Mode toggle */}
      <div className="flex rounded-xl overflow-hidden border border-white/[0.12] w-fit">
        <button
          type="button"
          onClick={() => switchMode("lucide")}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
            mode === "lucide"
              ? "bg-white/[0.15] text-white"
              : "bg-white/[0.05] text-white/50 hover:text-white/80"
          }`}
        >
          <Zap size={12} />
          Lucide
        </button>
        <button
          type="button"
          onClick={() => switchMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
            mode === "upload"
              ? "bg-white/[0.15] text-white"
              : "bg-white/[0.05] text-white/50 hover:text-white/80"
          }`}
        >
          <Upload size={12} />
          Upload
        </button>
        <button
          type="button"
          onClick={() => switchMode("url")}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
            mode === "url"
              ? "bg-white/[0.15] text-white"
              : "bg-white/[0.05] text-white/50 hover:text-white/80"
          }`}
        >
          <Link size={12} />
          URL
        </button>
      </div>

      {/* Input based on mode */}
      {mode === "lucide" && (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={iconName}
              onChange={(e) => setIconName(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
              placeholder={placeholder}
            />
            {showPreview && iconName && IconPreview && (
              <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.12]">
                <IconPreview size={24} className="text-white/70" />
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_ICONS.slice(0, 12).map((icon) => {
              const Icon = getLucideIcon(icon)
              return (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setIconName(icon)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-colors ${
                    iconName === icon
                      ? "bg-white/[0.15] text-white"
                      : "bg-white/[0.05] text-white/50 hover:text-white/80 hover:bg-white/[0.08]"
                  }`}
                >
                  {Icon && <Icon size={12} />}
                  {icon}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {mode === "upload" && (
        <div
          className={`relative rounded-xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden ${
            isDragging
              ? "border-white/40 bg-white/[0.08]"
              : "border-white/[0.12] hover:border-white/25 bg-white/[0.04]"
          } ${preview ? "p-0" : "p-6"}`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {preview ? (
            <div className="relative p-4 flex items-center gap-4">
              <img
                src={preview}
                alt="Icon preview"
                className="w-12 h-12 object-cover rounded-lg"
              />
              <span className="text-sm text-white/60 truncate flex-1">
                {file?.name || "Uploaded image"}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  clearImage()
                }}
                className="p-2 rounded-lg bg-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.12] transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-white/40">
              <ImageIcon size={24} />
              <span className="text-sm">Drag & drop or click to upload</span>
              <span className="text-xs opacity-60">PNG, JPG, WebP</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          />
        </div>
      )}

      {mode === "url" && (
        <div className="space-y-3">
          <input
            type="url"
            value={urlValue}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors outline-none text-white placeholder:text-white/30"
            placeholder="https://example.com/icon.png"
          />
          {preview && (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <img
                src={preview}
                alt="Icon preview"
                className="w-12 h-12 object-cover rounded-lg"
              />
              <span className="text-sm text-white/60 truncate flex-1">Preview</span>
              <button
                type="button"
                onClick={clearImage}
                className="p-2 rounded-lg bg-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.12] transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hidden inputs for form submission */}
      <input type="hidden" name={name} value={resolvedValue} />
      <input type="hidden" name={`${name}_mode`} value={mode} />
    </div>
  )
}

// Helper to render icon from stored value
const Zap = LucideIcons.Zap
export function RenderIcon({ 
  value, 
  size = 24, 
  className = "" 
}: { 
  value?: string
  size?: number
  className?: string 
}) {
  if (!value) {
    return <Zap size={size} className={className} />
  }

  // Check if it's a URL
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) {
    return (
      <img
        src={value}
        alt="Icon"
        className={`object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  // Try to get Lucide icon
  const iconKey = value.charAt(0).toUpperCase() + value.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[iconKey]
  
  if (IconComponent) {
    return <IconComponent size={size} className={className} />
  }

  // Fallback to Zap
  return <Zap size={size} className={className} />
}
