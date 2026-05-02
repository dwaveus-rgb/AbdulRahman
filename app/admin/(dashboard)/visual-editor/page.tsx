"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Save, 
  RotateCcw, 
  Eye, 
  EyeOff,
  Move,
  Type,
  Palette,
  Layers,
  Settings2,
  ChevronRight,
  ChevronDown,
  Lock,
  Unlock,
  GripVertical,
  Monitor,
  Tablet,
  Smartphone,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Check,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Square,
  MousePointer2
} from "lucide-react"
import { PasswordConfirmDialog } from "@/components/admin/password-confirm-dialog"

// ============ TYPES ============
interface ElementStyle {
  offsetX: number
  offsetY: number
  width: string
  height: string
  padding: string
  margin: string
  zIndex: number
  color: string
  backgroundColor: string
  borderColor: string
  borderWidth: number
  borderRadius: number
  fontSize: number
  fontWeight: number
  textAlign: string
  opacity: number
  blur: number
  shadow: string
  visible: boolean
}

interface EditorElement {
  id: string
  type: "section" | "container" | "text" | "button" | "card" | "divider"
  name: string
  content?: string
  style: Partial<ElementStyle>
  children?: EditorElement[]
  locked?: boolean
}

interface EditorState {
  elements: EditorElement[]
  globalStyles: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    backgroundColor: string
    borderRadius: number
  }
}

// ============ DEFAULT STATE ============
const DEFAULT_STATE: EditorState = {
  elements: [
    {
      id: "header",
      type: "section",
      name: "Header",
      style: { backgroundColor: "rgba(10,10,10,0.9)", padding: "16px 24px", blur: 20 },
      children: [
        { id: "logo", type: "text", name: "Logo", content: "Portfolio", style: { fontSize: 22, fontWeight: 700, color: "#ffffff" } },
        { id: "nav", type: "container", name: "Navigation", style: {}, children: [
          { id: "nav-1", type: "button", name: "Nav: Projects", content: "Projects", style: { color: "rgba(255,255,255,0.6)", fontSize: 14, padding: "8px 16px" } },
          { id: "nav-2", type: "button", name: "Nav: Skills", content: "Skills", style: { color: "rgba(255,255,255,0.6)", fontSize: 14, padding: "8px 16px" } },
          { id: "nav-3", type: "button", name: "Nav: Contact", content: "Contact", style: { color: "rgba(255,255,255,0.6)", fontSize: 14, padding: "8px 16px" } },
        ]}
      ]
    },
    {
      id: "hero",
      type: "section",
      name: "Hero Section",
      style: { padding: "120px 48px", backgroundColor: "transparent" },
      children: [
        { id: "hero-badge", type: "button", name: "Hero Badge", content: "Available for work", style: { backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", fontSize: 12, padding: "8px 16px", borderRadius: 9999 } },
        { id: "hero-title", type: "text", name: "Hero Title", content: "Creative Developer", style: { fontSize: 64, fontWeight: 700, color: "#ffffff", textAlign: "center" } },
        { id: "hero-subtitle", type: "text", name: "Hero Subtitle", content: "Building digital experiences with modern technologies", style: { fontSize: 18, color: "rgba(255,255,255,0.5)", textAlign: "center" } },
        { id: "hero-cta", type: "button", name: "CTA Button", content: "View Projects", style: { backgroundColor: "#ffffff", color: "#000000", padding: "16px 32px", borderRadius: 16, fontWeight: 600, fontSize: 16 } },
      ]
    },
    {
      id: "divider-1",
      type: "divider",
      name: "Section Divider",
      style: { backgroundColor: "rgba(255,255,255,0.1)", height: "1px" }
    },
    {
      id: "projects",
      type: "section", 
      name: "Projects Section",
      style: { padding: "96px 48px", backgroundColor: "transparent" },
      children: [
        { id: "projects-title", type: "text", name: "Section Title", content: "Featured Projects", style: { fontSize: 42, fontWeight: 700, color: "#ffffff" } },
        { id: "projects-desc", type: "text", name: "Section Description", content: "A selection of my recent work", style: { fontSize: 16, color: "rgba(255,255,255,0.5)" } },
        { id: "project-card-1", type: "card", name: "Project Card 1", content: "Project Alpha", style: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", padding: "24px" } },
        { id: "project-card-2", type: "card", name: "Project Card 2", content: "Project Beta", style: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", padding: "24px" } },
      ]
    },
    {
      id: "divider-2",
      type: "divider",
      name: "Section Divider",
      style: { backgroundColor: "rgba(255,255,255,0.1)", height: "1px" }
    },
    {
      id: "skills",
      type: "section",
      name: "Skills Section", 
      style: { padding: "96px 48px", backgroundColor: "transparent" },
      children: [
        { id: "skills-title", type: "text", name: "Section Title", content: "Skills & Expertise", style: { fontSize: 42, fontWeight: 700, color: "#ffffff" } },
        { id: "skill-card-1", type: "card", name: "Skill Card", content: "React / Next.js", style: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "20px", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" } },
        { id: "skill-card-2", type: "card", name: "Skill Card", content: "TypeScript", style: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "20px", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" } },
      ]
    },
    {
      id: "footer",
      type: "section",
      name: "Footer",
      style: { padding: "48px", backgroundColor: "rgba(255,255,255,0.02)", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
      children: [
        { id: "footer-text", type: "text", name: "Copyright", content: "© 2024 Portfolio. All rights reserved.", style: { fontSize: 14, color: "rgba(255,255,255,0.4)", textAlign: "center" } },
      ]
    }
  ],
  globalStyles: {
    primaryColor: "#ffffff",
    secondaryColor: "rgba(255,255,255,0.6)",
    accentColor: "#3b82f6",
    backgroundColor: "#0a0a0a",
    borderRadius: 16
  }
}

const STORAGE_KEY = "portfolio_visual_editor_state"

// ============ MAIN COMPONENT ============
export default function VisualEditorPage() {
  const [state, setState] = useState<EditorState>(DEFAULT_STATE)
  const [selected, setSelected] = useState<EditorElement | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [editingText, setEditingText] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, offsetX: 0, offsetY: 0 })
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [zoom, setZoom] = useState(80)
  const [showLayers, setShowLayers] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["header", "hero", "projects", "skills", "footer"]))
  const [history, setHistory] = useState<EditorState[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [hasChanges, setHasChanges] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<"save" | "reset" | null>(null)
  const [saved, setSaved] = useState(false)
  
  const previewRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load from localStorage
  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) setState(JSON.parse(data))
    } catch (e) {
      console.error("Failed to load:", e)
    }
  }, [])

  // Focus input when editing text
  useEffect(() => {
    if (editingText && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingText])

  // Save to history
  const pushHistory = useCallback((s: EditorState) => {
    setHistory(h => [...h.slice(0, historyIdx + 1), s])
    setHistoryIdx(i => i + 1)
    setHasChanges(true)
  }, [historyIdx])

  const undo = () => {
    if (historyIdx > 0) {
      setHistoryIdx(i => i - 1)
      setState(history[historyIdx - 1])
    }
  }

  const redo = () => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(i => i + 1)
      setState(history[historyIdx + 1])
    }
  }

  // Find element recursively
  const findEl = useCallback((els: EditorElement[], id: string): EditorElement | null => {
    for (const el of els) {
      if (el.id === id) return el
      if (el.children) {
        const found = findEl(el.children, id)
        if (found) return found
      }
    }
    return null
  }, [])

  // Update element
  const updateEl = useCallback((id: string, updates: Partial<EditorElement>) => {
    const update = (els: EditorElement[]): EditorElement[] =>
      els.map(el => {
        if (el.id === id) return { ...el, ...updates, style: { ...el.style, ...updates.style } }
        if (el.children) return { ...el, children: update(el.children) }
        return el
      })
    
    const newState = { ...state, elements: update(state.elements) }
    setState(newState)
    pushHistory(newState)
    
    if (selected?.id === id) {
      setSelected({ ...selected, ...updates, style: { ...selected.style, ...updates.style } })
    }
  }, [state, selected, pushHistory])

  // Update style only
  const updateStyle = useCallback((id: string, style: Partial<ElementStyle>) => {
    updateEl(id, { style })
  }, [updateEl])

  // Update content
  const updateContent = useCallback((id: string, content: string) => {
    const update = (els: EditorElement[]): EditorElement[] =>
      els.map(el => {
        if (el.id === id) return { ...el, content }
        if (el.children) return { ...el, children: update(el.children) }
        return el
      })
    
    setState(s => ({ ...s, elements: update(s.elements) }))
    setHasChanges(true)
  }, [])

  // Toggle visibility
  const toggleVisible = (id: string) => {
    const el = findEl(state.elements, id)
    if (el) updateStyle(id, { visible: el.style.visible === false ? true : false })
  }

  // Toggle lock
  const toggleLock = (id: string) => {
    const update = (els: EditorElement[]): EditorElement[] =>
      els.map(el => {
        if (el.id === id) return { ...el, locked: !el.locked }
        if (el.children) return { ...el, children: update(el.children) }
        return el
      })
    setState(s => ({ ...s, elements: update(s.elements) }))
  }

  // Drag handlers
  const onDragStart = (e: React.MouseEvent, el: EditorElement) => {
    if (el.locked) return
    e.stopPropagation()
    setIsDragging(true)
    setSelected(el)
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      offsetX: el.style.offsetX || 0,
      offsetY: el.style.offsetY || 0
    })
  }

  const onDragMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selected) return
    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y
    updateStyle(selected.id, {
      offsetX: Math.round(dragStart.offsetX + dx / (zoom / 100)),
      offsetY: Math.round(dragStart.offsetY + dy / (zoom / 100))
    })
  }, [isDragging, selected, dragStart, zoom, updateStyle])

  const onDragEnd = () => setIsDragging(false)

  // Save / Reset
  const onSave = () => { setPendingAction("save"); setPasswordOpen(true) }
  const onReset = () => { setPendingAction("reset"); setPasswordOpen(true) }

  const executeAction = () => {
    if (pendingAction === "save") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      applyToUI()
      setHasChanges(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } else if (pendingAction === "reset") {
      localStorage.removeItem(STORAGE_KEY)
      setState(DEFAULT_STATE)
      setSelected(null)
      setHasChanges(false)
    }
    setPendingAction(null)
  }

  // Apply to actual UI
  const applyToUI = () => {
    const settings: Record<string, object> = {}
    const extract = (els: EditorElement[]) => {
      els.forEach(el => {
        if (el.name.includes("CTA")) settings.primaryButton = el.style
        if (el.name.includes("Project Card")) settings.projectCard = el.style
        if (el.name.includes("Skill Card")) settings.skillCard = el.style
        if (el.name.includes("Hero Title")) settings.heading = el.style
        if (el.name.includes("Hero Subtitle")) settings.subheading = el.style
        if (el.children) extract(el.children)
      })
    }
    extract(state.elements)
    localStorage.setItem("portfolio_element_settings", JSON.stringify(settings))
    window.dispatchEvent(new Event("elementSettingsUpdated"))
  }

  // Build inline style
  const buildStyle = (s: Partial<ElementStyle>): React.CSSProperties => ({
    position: (s.offsetX || s.offsetY) ? "relative" : undefined,
    left: s.offsetX,
    top: s.offsetY,
    width: s.width,
    height: s.height,
    padding: s.padding,
    margin: s.margin,
    zIndex: s.zIndex,
    color: s.color,
    backgroundColor: s.backgroundColor,
    borderColor: s.borderColor,
    borderWidth: s.borderWidth,
    borderRadius: s.borderRadius,
    borderStyle: s.borderWidth ? "solid" : undefined,
    fontSize: s.fontSize,
    fontWeight: s.fontWeight,
    textAlign: s.textAlign as React.CSSProperties["textAlign"],
    opacity: s.opacity !== undefined ? s.opacity / 100 : undefined,
    backdropFilter: s.blur ? `blur(${s.blur}px)` : undefined,
    boxShadow: s.shadow !== "none" ? s.shadow : undefined,
  })

  // Render element in preview
  const renderEl = (el: EditorElement): React.ReactNode => {
    const isSel = selected?.id === el.id
    const isHov = hovered === el.id
    const isVis = el.style.visible !== false

    if (!isVis && !isSel) return null

    const style: React.CSSProperties = {
      ...buildStyle(el.style),
      cursor: el.locked ? "not-allowed" : isDragging && isSel ? "grabbing" : "pointer",
      outline: isSel ? "2px solid #3b82f6" : isHov ? "1px dashed rgba(59,130,246,0.5)" : "none",
      outlineOffset: 2,
      transition: isDragging ? "none" : "outline 0.1s",
      opacity: !isVis ? 0.3 : (el.style.opacity !== undefined ? el.style.opacity / 100 : 1),
    }

    const handlers = {
      onClick: (e: React.MouseEvent) => { e.stopPropagation(); setSelected(el) },
      onDoubleClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        if ((el.type === "text" || el.type === "button") && !el.locked) {
          setEditingText(el.id)
        }
      },
      onMouseEnter: () => !isDragging && setHovered(el.id),
      onMouseLeave: () => setHovered(null),
      onMouseDown: (e: React.MouseEvent) => onDragStart(e, el),
    }

    const renderContent = () => {
      if (editingText === el.id) {
        return (
          <input
            ref={inputRef}
            type="text"
            value={el.content || ""}
            onChange={(e) => updateContent(el.id, e.target.value)}
            onBlur={() => setEditingText(null)}
            onKeyDown={(e) => e.key === "Enter" && setEditingText(null)}
            onClick={(e) => e.stopPropagation()}
            className="bg-transparent border-none outline-none w-full min-w-[100px]"
            style={{ fontSize: el.style.fontSize, fontWeight: el.style.fontWeight, color: el.style.color, textAlign: el.style.textAlign as React.CSSProperties["textAlign"] }}
          />
        )
      }
      return el.content
    }

    switch (el.type) {
      case "section":
        return (
          <div key={el.id} style={style} {...handlers} className="relative w-full">
            {el.children?.map(renderEl)}
            {isSel && <Handles />}
          </div>
        )
      case "container":
        return (
          <div key={el.id} style={{ ...style, display: "flex", alignItems: "center", gap: 8 }} {...handlers} className="relative">
            {el.children?.map(renderEl)}
            {isSel && <Handles />}
          </div>
        )
      case "text":
        return (
          <div key={el.id} style={style} {...handlers} className="relative">
            {renderContent()}
            {isSel && <Handles />}
          </div>
        )
      case "button":
        return (
          <div key={el.id} style={{ ...style, display: "inline-flex", alignItems: "center", justifyContent: "center" }} {...handlers} className="relative">
            {renderContent()}
            {isSel && <Handles />}
          </div>
        )
      case "card":
        return (
          <div key={el.id} style={style} {...handlers} className="relative">
            <span className="text-white/60">{el.content}</span>
            {isSel && <Handles />}
          </div>
        )
      case "divider":
        return (
          <div key={el.id} style={{ ...style, width: "100%", maxWidth: 600, margin: "0 auto" }} {...handlers} className="relative">
            {isSel && <Handles />}
          </div>
        )
      default:
        return null
    }
  }

  // Layer tree item
  const renderLayer = (el: EditorElement, depth = 0): React.ReactNode => {
    const isExp = expanded.has(el.id)
    const hasKids = el.children && el.children.length > 0
    const isSel = selected?.id === el.id
    const isVis = el.style.visible !== false

    return (
      <div key={el.id}>
        <div
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
            isSel ? "bg-blue-500/20 text-white" : "hover:bg-white/[0.05] text-white/70"
          }`}
          style={{ paddingLeft: depth * 12 + 8 }}
          onClick={() => setSelected(el)}
        >
          {hasKids ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setExpanded(s => {
                  const n = new Set(s)
                  n.has(el.id) ? n.delete(el.id) : n.add(el.id)
                  return n
                })
              }}
              className="p-0.5 hover:bg-white/10 rounded"
            >
              {isExp ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>
          ) : <span className="w-4" />}
          
          <GripVertical size={10} className="text-white/20" />
          <span className="flex-1 text-xs truncate">{el.name}</span>
          
          <button onClick={(e) => { e.stopPropagation(); toggleVisible(el.id) }} className="p-1 hover:bg-white/10 rounded opacity-50 hover:opacity-100">
            {isVis ? <Eye size={10} /> : <EyeOff size={10} />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); toggleLock(el.id) }} className="p-1 hover:bg-white/10 rounded opacity-50 hover:opacity-100">
            {el.locked ? <Lock size={10} /> : <Unlock size={10} />}
          </button>
        </div>
        {hasKids && isExp && el.children!.map(c => renderLayer(c, depth + 1))}
      </div>
    )
  }

  const vpWidth = viewport === "desktop" ? "100%" : viewport === "tablet" ? "768px" : "375px"

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden -m-6">
      {/* Toolbar */}
      <div className="h-12 border-b border-white/[0.08] flex items-center justify-between px-4 bg-[#0c0c0d] shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-white">Visual Editor</h1>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">WYSIWYG</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex items-center gap-0.5 mr-2">
            <button onClick={undo} disabled={historyIdx <= 0} className="p-1.5 rounded hover:bg-white/[0.05] text-white/50 disabled:opacity-30">
              <Undo size={14} />
            </button>
            <button onClick={redo} disabled={historyIdx >= history.length - 1} className="p-1.5 rounded hover:bg-white/[0.05] text-white/50 disabled:opacity-30">
              <Redo size={14} />
            </button>
          </div>
          
          {/* Viewport */}
          <div className="flex items-center gap-0.5 px-1.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08]">
            {[
              { v: "desktop" as const, icon: Monitor },
              { v: "tablet" as const, icon: Tablet },
              { v: "mobile" as const, icon: Smartphone }
            ].map(({ v, icon: Icon }) => (
              <button key={v} onClick={() => setViewport(v)} className={`p-1 rounded ${viewport === v ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}>
                <Icon size={14} />
              </button>
            ))}
          </div>
          
          {/* Zoom */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08]">
            <button onClick={() => setZoom(z => Math.max(25, z - 10))} className="p-0.5 text-white/40 hover:text-white"><ZoomOut size={12} /></button>
            <span className="text-[10px] text-white/60 w-8 text-center">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="p-0.5 text-white/40 hover:text-white"><ZoomIn size={12} /></button>
          </div>
          
          {/* Actions */}
          <button onClick={onReset} className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white text-xs flex items-center gap-1.5">
            <RotateCcw size={12} /> Reset
          </button>
          <button onClick={onSave} disabled={!hasChanges} className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 ${hasChanges ? "bg-white text-black" : "bg-white/[0.05] text-white/30"}`}>
            {saved ? <><Check size={12} /> Saved</> : <><Save size={12} /> Save</>}
          </button>
        </div>
      </div>
      
      {/* Main */}
      <div className="flex-1 flex overflow-hidden">
        {/* Layers */}
        <AnimatePresence>
          {showLayers && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 220 }}
              exit={{ width: 0 }}
              className="border-r border-white/[0.08] bg-[#0c0c0d] overflow-hidden flex flex-col shrink-0"
            >
              <div className="p-2.5 border-b border-white/[0.08] flex items-center gap-2">
                <Layers size={12} className="text-white/50" />
                <span className="text-xs font-medium text-white/70">Layers</span>
              </div>
              <div className="flex-1 overflow-y-auto p-1.5 text-xs">
                {state.elements.map(el => renderLayer(el))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Preview */}
        <div 
          className="flex-1 overflow-auto bg-[#111] p-6"
          onMouseMove={onDragMove}
          onMouseUp={onDragEnd}
          onMouseLeave={onDragEnd}
        >
          <div
            ref={previewRef}
            className="mx-auto rounded-xl overflow-hidden shadow-2xl bg-[#0a0a0a] border border-white/[0.06]"
            style={{ width: vpWidth, transform: `scale(${zoom / 100})`, transformOrigin: "top center", minHeight: 600 }}
            onClick={() => setSelected(null)}
          >
            {/* Gradient BG */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
            </div>
            
            {state.elements.map(renderEl)}
          </div>
        </div>
        
        {/* Properties */}
        <div className="w-64 border-l border-white/[0.08] bg-[#0c0c0d] overflow-y-auto shrink-0">
          {selected ? (
            <div className="p-3 space-y-4">
              <div className="pb-3 border-b border-white/[0.08]">
                <h3 className="text-xs font-medium text-white">{selected.name}</h3>
                <p className="text-[10px] text-white/40 capitalize">{selected.type}</p>
              </div>
              
              {/* Position */}
              <PropSection title="Position" icon={Move}>
                <div className="grid grid-cols-2 gap-2">
                  <PropInput label="Offset X" value={selected.style.offsetX || 0} onChange={v => updateStyle(selected.id, { offsetX: Number(v) })} />
                  <PropInput label="Offset Y" value={selected.style.offsetY || 0} onChange={v => updateStyle(selected.id, { offsetY: Number(v) })} />
                </div>
                <PropInput label="Z-Index" value={selected.style.zIndex || 0} onChange={v => updateStyle(selected.id, { zIndex: Number(v) })} />
                <PropInput label="Padding" value={selected.style.padding || ""} onChange={v => updateStyle(selected.id, { padding: v })} placeholder="16px" />
              </PropSection>
              
              {/* Colors */}
              <PropSection title="Colors" icon={Palette}>
                <PropColor label="Text" value={selected.style.color || ""} onChange={v => updateStyle(selected.id, { color: v })} />
                <PropColor label="Background" value={selected.style.backgroundColor || ""} onChange={v => updateStyle(selected.id, { backgroundColor: v })} />
                <PropColor label="Border" value={selected.style.borderColor || ""} onChange={v => updateStyle(selected.id, { borderColor: v })} />
              </PropSection>
              
              {/* Typography */}
              {(selected.type === "text" || selected.type === "button") && (
                <PropSection title="Typography" icon={Type}>
                  <div className="grid grid-cols-2 gap-2">
                    <PropInput label="Size" value={selected.style.fontSize || 16} onChange={v => updateStyle(selected.id, { fontSize: Number(v) })} />
                    <PropSelect
                      label="Weight"
                      value={selected.style.fontWeight || 400}
                      options={[
                        { value: 300, label: "Light" },
                        { value: 400, label: "Normal" },
                        { value: 500, label: "Medium" },
                        { value: 600, label: "Semi" },
                        { value: 700, label: "Bold" }
                      ]}
                      onChange={v => updateStyle(selected.id, { fontWeight: Number(v) })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 mb-1 block">Align</label>
                    <div className="flex gap-1">
                      {["left", "center", "right"].map(a => (
                        <button
                          key={a}
                          onClick={() => updateStyle(selected.id, { textAlign: a })}
                          className={`flex-1 p-1.5 rounded ${selected.style.textAlign === a ? "bg-white/10 text-white" : "bg-white/[0.03] text-white/40"}`}
                        >
                          {a === "left" && <AlignLeft size={12} className="mx-auto" />}
                          {a === "center" && <AlignCenter size={12} className="mx-auto" />}
                          {a === "right" && <AlignRight size={12} className="mx-auto" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </PropSection>
              )}
              
              {/* Border */}
              <PropSection title="Border" icon={Square}>
                <div className="grid grid-cols-2 gap-2">
                  <PropInput label="Width" value={selected.style.borderWidth || 0} onChange={v => updateStyle(selected.id, { borderWidth: Number(v) })} />
                  <PropInput label="Radius" value={selected.style.borderRadius || 0} onChange={v => updateStyle(selected.id, { borderRadius: Number(v) })} />
                </div>
              </PropSection>
              
              {/* Effects */}
              <PropSection title="Effects" icon={Settings2}>
                <div>
                  <label className="text-[10px] text-white/40 mb-1 block">Opacity ({selected.style.opacity ?? 100}%)</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={selected.style.opacity ?? 100}
                    onChange={e => updateStyle(selected.id, { opacity: Number(e.target.value) })}
                    className="w-full h-1 rounded bg-white/10 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  />
                </div>
                <PropInput label="Blur" value={selected.style.blur || 0} onChange={v => updateStyle(selected.id, { blur: Number(v) })} />
                <PropSelect
                  label="Shadow"
                  value={selected.style.shadow || "none"}
                  options={[
                    { value: "none", label: "None" },
                    { value: "0 2px 8px rgba(0,0,0,0.3)", label: "Small" },
                    { value: "0 4px 16px rgba(0,0,0,0.4)", label: "Medium" },
                    { value: "0 8px 32px rgba(0,0,0,0.5)", label: "Large" }
                  ]}
                  onChange={v => updateStyle(selected.id, { shadow: v })}
                />
              </PropSection>
            </div>
          ) : (
            <div className="p-4 text-center text-white/30 text-xs">
              <MousePointer2 size={24} className="mx-auto mb-2 opacity-50" />
              Click an element to edit
            </div>
          )}
        </div>
      </div>
      
      {/* Layers Toggle */}
      <button
        onClick={() => setShowLayers(!showLayers)}
        className="fixed left-2 bottom-2 p-2 rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/15 z-50"
      >
        <Layers size={16} />
      </button>
      
      {/* Password Dialog */}
      <PasswordConfirmDialog
        isOpen={passwordOpen}
        onClose={() => { setPasswordOpen(false); setPendingAction(null) }}
        onConfirm={executeAction}
        title={pendingAction === "save" ? "Save Changes" : "Reset All"}
        description={pendingAction === "save" ? "Enter password to save changes." : "Reset all to defaults?"}
        actionLabel={pendingAction === "save" ? "Save" : "Reset"}
        actionType={pendingAction === "reset" ? "reset" : "save"}
      />
    </div>
  )
}

// ============ SUB-COMPONENTS ============

function Handles() {
  return (
    <>
      {["nw", "ne", "sw", "se"].map(c => (
        <div key={c} className={`absolute w-2 h-2 bg-blue-500 rounded-sm ${c.includes("n") ? "-top-1" : "-bottom-1"} ${c.includes("w") ? "-left-1" : "-right-1"}`} />
      ))}
    </>
  )
}

function PropSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-[10px] font-medium text-white/50 uppercase tracking-wider flex items-center gap-1.5">
        <Icon size={10} /> {title}
      </h4>
      {children}
    </div>
  )
}

function PropInput({ label, value, onChange, placeholder }: { label: string; value: string | number; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-[10px] text-white/40 mb-0.5 block">{label}</label>
      <input
        type={typeof value === "number" ? "number" : "text"}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2 py-1 rounded bg-white/[0.05] border border-white/[0.08] text-white text-xs focus:border-white/20 outline-none"
      />
    </div>
  )
}

function PropColor({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[10px] text-white/40 mb-0.5 block">{label}</label>
      <div className="flex gap-1.5">
        <input type="color" value={value.startsWith("#") ? value : "#ffffff"} onChange={e => onChange(e.target.value)} className="w-6 h-6 rounded border border-white/10 bg-transparent cursor-pointer" />
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="rgba(...)" className="flex-1 px-2 py-1 rounded bg-white/[0.05] border border-white/[0.08] text-white text-xs" />
      </div>
    </div>
  )
}

function PropSelect({ label, value, options, onChange }: { label: string; value: string | number; options: { value: string | number; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[10px] text-white/40 mb-0.5 block">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-2 py-1 rounded bg-white/[0.05] border border-white/[0.08] text-white text-xs">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}
