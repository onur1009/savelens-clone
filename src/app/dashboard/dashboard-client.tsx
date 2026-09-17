"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { SaveCard } from "@/components/saves/SaveCard"
import { SaveForm } from "@/components/saves/SaveForm"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Skeleton, SkeletonSaveCard } from "@/components/ui/Skeleton"
import { 
  Plus, FolderKanban, Tag, Brain, Zap, Clock, CheckCircle, 
  AlertCircle, Loader2, Search, Filter, Grid, List, ChevronDown
} from "lucide-react"
import { cn, formatRelativeTime, getPlatformIcon, getPlatformColor } from "@/lib/utils"
import { SaveWithRelations } from "@/types"
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown"

interface DashboardClientProps {
  initialStats: {
    totalSaves: number
    processedSaves: number
    pendingSaves: number
    failedSaves: number
    totalCollections: number
    totalTags: number
  }
  initialSaves: SaveWithRelations[]
  initialCollections: Array<{ id: string; name: string; color: string; _count: { saves: number } }>
  initialTags: Array<{ id: string; name: string; color: string; _count: { saves: number } }>
  user: any
}

export function DashboardClient({
  initialStats,
  initialSaves,
  initialCollections,
  initialTags,
  user,
}: DashboardClientProps) {
  const [saves, setSaves] = useState(initialSaves)
  const [collections] = useState(initialCollections)
  const [tags] = useState(initialTags)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    query: "",
    platform: [] as string[],
    tags: [] as string[],
    collections: [] as string[],
  })

  const filteredSaves = saves.filter((save) => {
    if (filters.query && !save.title?.toLowerCase().includes(filters.query.toLowerCase()) &&
        !save.description?.toLowerCase().includes(filters.query.toLowerCase())) {
      return false
    }
    if (filters.platform.length && !filters.platform.includes(save.platform)) return false
    if (filters.tags.length && !save.tags.some((t) => filters.tags.includes(t.tag.name))) return false
    if (filters.collections.length && !save.collections.some((c) => filters.collections.includes(c.collectionId))) return false
    return true
  })

  const handleFavorite = async (id: string) => {
    const save = saves.find((s) => s.id === id)
    if (!save) return
    setSaves((prev) => prev.map((s) => s.id === id ? { ...s, isFavorite: !s.isFavorite } : s))
  }

  const handleArchive = async (id: string) => {
    setSaves((prev) => prev.map((s) => s.id === id ? { ...s, isArchived: !s.isArchived } : s))
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kaydı silmek istediğinizden emin misiniz?")) return
    setSaves((prev) => prev.filter((s) => s.id !== id))
  }

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  const handleOpenOriginal = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleAddToCollection = async (saveId: string, collectionId: string) => {
    // Implementation would call server action
  }

  const platformItems: DropdownItem[] = [
    { label: "Tümü", onClick: () => setFilters((f) => ({ ...f, platform: [] })) },
    { divider: true },
    ...["INSTAGRAM", "TIKTOK", "YOUTUBE", "LINKEDIN", "X", "WEB"].map((p) => ({
      label: p,
      onClick: () => setFilters((f) => ({ ...f, platform: f.platform.includes(p) ? f.platform.filter((x) => x !== p) : [...f.platform, p] })),
    })),
  ]

  const tagItems: DropdownItem[] = [
    { label: "Tümü", onClick: () => setFilters((f) => ({ ...f, tags: [] })) },
    { divider: true },
    ...tags.slice(0, 10).map((t) => ({
      label: t.name,
      onClick: () => setFilters((f) => ({ ...f, tags: f.tags.includes(t.name) ? f.tags.filter((x) => x !== t.name) : [...f.tags, t.name] })),
    })),
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <Header />

      <main className="lg:ml-16 pt-16 min-h-screen">
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Kütüphane</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {initialStats.totalSaves} kayıt · {initialStats.totalCollections} koleksiyon · {initialStats.totalTags} etiket
              </p>
            </div>
            <Button onClick={() => setShowSaveForm(true)} className="gap-2">
              <Plus className="h-5 w-5" />
              Yeni Kayıt
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Toplam Kayıt" value={initialStats.totalSaves} icon={Zap} color="primary" />
            <StatCard title="İşlenmiş" value={initialStats.processedSaves} icon={CheckCircle} color="success" />
            {initialStats.pendingSaves > 0 && (
              <StatCard title="İşleniyor" value={initialStats.pendingSaves} icon={Loader2} color="warning" animate />
            )}
            {initialStats.failedSaves > 0 && (
              <StatCard title="Hatalı" value={initialStats.failedSaves} icon={AlertCircle} color="danger" />
            )}
            <StatCard title="Koleksiyon" value={initialStats.totalCollections} icon={FolderKanban} color="secondary" />
            <StatCard title="Etiket" value={initialStats.totalTags} icon={Tag} color="accent" />
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Başlık, açıklama, URL ara..."
                  value={filters.query}
                  onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Dropdown
                  trigger={
                    <Button variant="outline" className="gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                      Platform {filters.platform.length > 0 && <Badge variant="primary" size="sm">{filters.platform.length}</Badge>}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  }
                  items={platformItems}
                />

                <Dropdown
                  trigger={
                    <Button variant="outline" className="gap-2">
                      <Tag className="h-4 w-4" />
                      Etiketler {filters.tags.length > 0 && <Badge variant="primary" size="sm">{filters.tags.length}</Badge>}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  }
                  items={tagItems}
                />

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "primary" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid görünümü"
                  >
                    <Grid className="h-5 w-5" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "primary" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    aria-label="Liste görünümü"
                  >
                    <List className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Saves Grid/List */}
          <div className={cn(
            viewMode === "grid" 
              ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "space-y-3"
          )}>
            {isLoading ? (
              Array.from({ length: viewMode === "grid" ? 8 : 5 }).map((_, i) => (
                <SkeletonSaveCard key={i} />
              ))
            ) : filteredSaves.length === 0 ? (
              <EmptyState onAddClick={() => setShowSaveForm(true)} />
            ) : (
              filteredSaves.map((save) => (
                <SaveCard
                  key={save.id}
                  save={save}
                  viewMode={viewMode}
                  onFavorite={handleFavorite}
                  onArchive={handleArchive}
                  onDelete={handleDelete}
                  onCopyLink={handleCopyLink}
                  onOpenOriginal={handleOpenOriginal}
                  onAddToCollection={handleAddToCollection}
                  collections={collections}
                />
              ))
            )}
          </div>

          {filteredSaves.length > 0 && filteredSaves.length === saves.length && (
            <div className="text-center py-8">
              <Button variant="outline" onClick={() => {}}>Daha fazla yükle</Button>
            </div>
          )}
        </div>
      </main>

      <SaveForm
        isOpen={showSaveForm}
        onClose={() => setShowSaveForm(false)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color, animate }: { title: string; value: number; icon: React.ComponentType<{ className?: string }>; color: string; animate?: boolean }) {
  const colors = {
    primary: "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400",
    success: "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    warning: "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    danger: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    secondary: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    accent: "bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
  }

  return (
    <Card className="relative overflow-hidden" padding="md">
      {animate && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 animate-pulse" />
      )}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value.toLocaleString()}</p>
        </div>
        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", colors[color as keyof typeof colors])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  )
}

function EmptyState({ onAddClick }: { onAddClick: () => void }) {
  return (
    <div className="col-span-full text-center py-16">
      <div className="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
        <Zap className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Henüz kayıt yok</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
        İlk içeriğinizi kaydedin ve AI'ın gücünü keşfedin. URL yapıştırın, gerisini biz halledelim.
      </p>
      <Button onClick={onAddClick} className="gap-2">
        <Plus className="h-5 w-5" />
        İlk Kayıt Ekle
      </Button>
    </div>
  )
}