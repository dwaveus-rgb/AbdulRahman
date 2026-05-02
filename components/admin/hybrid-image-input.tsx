"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, Link, X } from "lucide-react"

type ImageMode = "upload" | "url"

interface HybridImageInputProps {
  name: string
  defaultUrl?: string | null
  label?: string
  /** Compact mode for small icon inputs */
  compact?: boolean
}

export function HybridImageInput({
  name,
  defaultUrl,
  label = "Image",
  compact = false,
}: HybridImageInputProps) {
  const [mode, setMode] = useState<ImageMode>(defaultUrl ? "url" : "upload")
  const [urlValue, setUrlValue] = useState(defaultUrl || "")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(defaultUrl || null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const switchMode = (newMode: ImageMode) => {
    setMode(newMode)
    setFile(null)
    setUrlValue("")
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return
    if (!selectedFile.type.startsWith("image/")) return
    setFile(selectedFile)
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
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

  // Hidden input to carry the URL value into FormData
  const resolvedValue = mode === "url" ? urlValue : ""

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="block text-sm font-medium mb-0">{label}</label>
        )}

        {/* Mode toggle - compact */}
        <div className="flex rounded-lg overflow-hidden border border-glass-border w-fit">
          <button
            type="button"
            onClick={() => switchMode("upload")}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium transition-colors ${
              mode === "upload"
                ? "bg-primary text-primary-foreground"
                : "bg-input text-muted-foreground hover:text-foreground"
            }`}
          >
            <Upload size={12} />
            Upload
          </button>
          <button
            type="button"
            onClick={() => switchMode("url")}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium transition-colors ${
              mode === "url"
                ? "bg-primary text-primary-foreground"
                : "bg-input text-muted-foreground hover:text-foreground"
            }`}
          >
            <Link size={12} />
            URL
          </button>
        </div>

        <div className="flex items-start gap-3">
          {mode === "upload" ? (
            <div
              className={`relative w-14 h-14 shrink-0 rounded-lg border-2 border-dashed transition-colors cursor-pointer flex items-center justify-center overflow-hidden ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-glass-border hover:border-muted-foreground bg-input"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Icon preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      clearImage()
                    }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <X size={10} />
                  </button>
                </>
              ) : (
                <Upload size={16} className="text-muted-foreground" />
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1">
                <input
                  type="url"
                  value={urlValue}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
                  placeholder="https://..."
                />
              </div>
              {preview && (
                <div className="relative w-10 h-10 shrink-0 rounded-md overflow-hidden border border-glass-border">
                  <img
                    src={preview}
                    alt="Icon preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <X size={8} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hidden inputs for form submission */}
        <input type="hidden" name={name} value={resolvedValue} />
        <input type="hidden" name={`${name}_mode`} value={mode} />
      </div>
    )
  }

  // Full-size variant (for project images)
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}

      {/* Mode toggle */}
      <div className="flex rounded-lg overflow-hidden border border-glass-border mb-3 w-fit">
        <button
          type="button"
          onClick={() => switchMode("upload")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            mode === "upload"
              ? "bg-primary text-primary-foreground"
              : "bg-input text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload size={14} />
          Upload Image
        </button>
        <button
          type="button"
          onClick={() => switchMode("url")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            mode === "url"
              ? "bg-primary text-primary-foreground"
              : "bg-input text-muted-foreground hover:text-foreground"
          }`}
        >
          <Link size={14} />
          Image URL
        </button>
      </div>

      {mode === "upload" ? (
        <div
          className={`relative rounded-lg border-2 border-dashed transition-colors cursor-pointer overflow-hidden ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-glass-border hover:border-muted-foreground bg-input"
          } ${preview ? "p-0" : "p-8"}`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Image preview"
                className="w-full h-48 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  clearImage()
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload size={24} />
              <span className="text-sm">Drag & drop or click to upload</span>
              <span className="text-xs opacity-60">
                PNG, JPG, JPEG, WebP
              </span>
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
      ) : (
        <div className="space-y-3">
          <input
            type="url"
            value={urlValue}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-input border border-glass-border focus:border-primary outline-none"
            placeholder="https://..."
          />
          {preview && (
            <div className="relative rounded-lg overflow-hidden border border-glass-border">
              <img
                src={preview}
                alt="Image preview"
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg"
              >
                <X size={14} />
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
