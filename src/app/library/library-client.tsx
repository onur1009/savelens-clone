"use client"

import { useState, useCallback } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { SaveCard } from "@/components/saves/SaveCard"
import { SaveDetail } from "@/components/saves/SaveDetail"
import { SaveForm } from "@/components/saves/SaveForm"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Skeleton, SkeletonSaveCard } from "@/components/ui/Skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs"
import { Modal } from "@/components/ui/Modal"
import { 
  Plus, FolderKanban, Tag, Search, Filter, Grid, List, 
  ChevronDown, MapPin, Brain, Zap, Settings, Save, 
  Archive, Trash2, Copy, ExternalLink, Share2
} from "lucide-react"
import { cn, formatRelativeTime, getPlatformIcon, getPlatformColor } from "@/lib/utils"
import { SaveWithRelations } from "@/types"
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown"

interface LibraryClientProps {
  initialSaves: SaveWithRelations[]
  initialCollections: Array<{ id: string; name: string; color: string; _count: { saves: number } }>
  initialTags: Array<{ id: string; name: string; color: string; _count: { saves: number } }>
  initialSmartShelves: Array<{ id: string; name: string; query: string; color: string; icon: string; collection: { id: string; name: string } | null }>
  user: any
}

export function LibraryClient({
  initialSaves,
  initialCollections,
  initialTags,
  initialSmartShelves,
  user,
}: LibraryClientProps) {
  const [saves, setSaves] = useState(initialSaves)
  const [collections] = useState(initialCollections)
  const [tags] = useState(initialTags)
  const [smartShelves] = useState(initialSmartShelves)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [selectedSave, setSelectedSave] = useState<SaveWithRelations | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "favorites" | "archived">("all")
  const [filters, setFilters] = useState({
    query: "",
    platform: [] as string[],
    tags: [] as string[],
    collections: [] as string[],
    contentType: [] as string[],
  })
  const [isLoading, setIsLoading] = useState(false)

  const filteredSaves = saves.filter((save) => {
    if (activeTab === "favorites" && !save.isFavorite) return false
    if (activeTab === "archived" && !save.isArchived) return false
    if (activeTab === "all" && save.isArchived) return false
    if (filters.query && !save.title?.toLowerCase().includes(filters.query.toLowerCase()) &&
        !save.description?.toLowerCase().includes(filters.query.toLowerCase())) {
      return false
    }
    if (filters.platform.length && !filters.platform.includes(save.platform)) return false
    if (filters.tags.length && !save.tags.some((t) => filters.tags.includes(t.tag.name))) return false
    if (filters.collections.length && !save.collections.some((c) => filters.collections.includes(c.collectionId))) return false
    if (filters.contentType.length && !filters.contentType.includes(save.contentType)) return false
    return true
  })

  const handleFavorite = useCallback(async (id: string) => {
    setSaves((prev) => prev.map((s) => s.id === id ? { ...s, isFavorite: !s.isFavorite } : s))
  }, [])

  const handleArchive = useCallback(async (id: string) => {
    setSaves((prev) => prev.map((s) => s.id === id ? { ...s, isArchived: !s.isArchived } : s))
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Bu kaydı kalıcı olarak silmek istediğinizden emin misiniz?")) return
    setSaves((prev) => prev.filter((s) => s.id !== id))
    if (selectedSave?.id === id) setSelectedSave(null)
  }, [selectedSave])

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  const handleOpenOriginal = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleAddToCollection = async (saveId: string, collectionId: string) => {
    // Would call server action
  }

  const handleRemoveFromCollection = async (saveId: string, collectionId: string) => {
    // Would call server action
  }

  const handleUpdateTags = async (saveId: string, tagNames: string[]) => {
    // Would call server action
  }

  const openSaveDetail = (save: SaveWithRelations) => {
    setSelectedSave(save)
  }

  const platformItems: DropdownItem[] = [
    { label: "Tümü", onClick: () => setFilters((f) => ({ ...f, platform: [] })) },
    { divider: true },
    ...["INSTAGRAM", "TIKTOK", "YOUTUBE", "LINKEDIN", "X", "WEB"].map((p) => ({
      label: p,
      onClick: () => setFilters((f) => ({ ...f, platform: f.platform.includes(p) ? f.platform.filter((x) => x !== p) : [...f.platform, p] })),
    })),
  ]

  const contentTypeItems: DropdownItem[] = [
    { label: "Tümü", onClick: () => setFilters((f) => ({ ...f, contentType: [] })) },
    { divider: true },
    ...["VIDEO", "IMAGE", "ARTICLE", "AUDIO", "POST"].map((c) => ({
      label: c,
      onClick: () => setFilters((f) => ({ ...f, contentType: f.contentType.includes(c) ? f.contentType.filter((x) => x !== c) : [...f.contentType, c] })),
    })),
  ]

  const smartShelfItems: DropdownItem[] = [
    { label: "Akıllı Raf yok", disabled: true },
    { divider: true },
    ...smartShelves.map((shelf) => ({
      label: shelf.name,
      onClick: () => {
        setFilters((f) => ({ ...f, query: shelf.query }))
        setActiveTab("all")
      },
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
                {filteredSaves.length} / {saves.length} kayıt
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => {}} className="gap-2">
                <Save className="h-4 w-4" />
                Dışa Aktar
              </Button>
              <Button onClick={() => setShowSaveForm(true)} className="gap-2">
                <Plus className="h-5 w-5" />
                Yeni Kayıt
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all">Tümü</TabsTrigger>
              <TabsTrigger value="favorites">Favoriler <Badge variant="secondary" size="sm" className="ml-1">{saves.filter(s => s.isFavorite).length}</Badge></TabsTrigger>
              <TabsTrigger value="archived">Arşiv <Badge variant="secondary" size="sm" className="ml-1">{saves.filter(s => s.isArchived).length}</Badge></TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Başlık, açıklama, URL, etiket ara..."
                  value={filters.query}
                  onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Dropdown
                  trigger={
                    <Button variant="outline" className={cn("gap-2", filters.platform.length > 0 && "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-800")}>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                      Platform
                      {filters.platform.length > 0 && <Badge variant="primary" size="sm">{filters.platform.length}</Badge>}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  }
                  items={platformItems}
                />

                <Dropdown
                  trigger={
                    <Button variant="outline" className={cn("gap-2", filters.contentType.length > 0 && "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-800")}>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Tür
                      {filters.contentType.length > 0 && <Badge variant="primary" size="sm">{filters.contentType.length}</Badge>}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  }
                  items={contentTypeItems}
                />

                <Dropdown
                  trigger={
                    <Button variant="outline" className="gap-2">
                      <Brain className="h-4 w-4" />
                      Akıllı Raflar
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  }
                  items={smartShelfItems}
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
          </Card>

          {/* Active Filters */}
          {(filters.platform.length > 0 || filters.tags.length > 0 || filters.collections.length > 0 || filters.contentType.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {filters.platform.map((p) => (
                <Badge key={p} variant="outline" onDelete={() => setFilters((f) => ({ ...f, platform: f.platform.filter((x) => x !== p) }))}>
                  {p}
                </Badge>
              ))}
              {filters.contentType.map((c) => (
                <Badge key={c} variant="outline" onDelete={() => setFilters((f) => ({ ...f, contentType: f.contentType.filter((x) => x !== c) }))}>
                  {c}
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={() => setFilters({ query: "", platform: [], tags: [], collections: [], contentType: [] })}>
                Temizle
              </Button>
            </div>
          )}

          {/* Saves */}
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
                  onClick={() => openSaveDetail(save)}
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

          {filteredSaves.length > 0 && filteredSaves.length === saves.filter(s => !s.isArchived).length && (
            <div className="text-center py-8">
              <Button variant="outline" onClick={() => {}}>Daha fazla yükle</Button>
            </div>
          )}
        </div>
      </main>

      {/* Save Detail Modal */}
      {selectedSave && (
        <SaveDetail
          save={selectedSave}
          onClose={() => setSelectedSave(null)}
          onFavorite={handleFavorite}
          onArchive={handleArchive}
          onDelete={handleDelete}
          onCopyLink={handleCopyLink}
          onOpenOriginal={handleOpenOriginal}
          onUpdateTags={handleUpdateTags}
          onAddToCollection={handleAddToCollection}
          onRemoveFromCollection={handleRemoveFromCollection}
          collections={collections}
        />
      )}

      <SaveForm
        isOpen={showSaveForm}
        onClose={() => setShowSaveForm(false)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  )
}

function EmptyState({ onAddClick }: { onAddClick: () => void }) {
  return (
    <div className="col-span-full text-center py-16">
      <div className="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
        <Zap className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Kayıt bulunamadı</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
        Filtrelerinizi genişletin veya yeni bir kayıt ekleyin.
      </p>
      <Button onClick={onAddClick} className="gap-2">
        <Plus className="h-5 w-5" />
        Kayıt Ekle
      </Button>
    </div>
  )
}