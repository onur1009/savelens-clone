"use client"

import { useState } from "react"
import { formatRelativeTime, getPlatformIcon, getPlatformColor } from "@/lib/utils"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs"
import { Modal } from "@/components/ui/Modal"
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown"
import { Avatar } from "@/components/ui/Avatar"
import { 
  MoreVertical, Heart, Archive, Copy, ExternalLink, Share2, 
  Clock, User, MapPin, ShoppingBag, Tag, ChevronDown,
  MessageSquare, Download, Edit, Trash2
} from "lucide-react"
import { SaveWithRelations, ExtractType } from "@/types"
import { cn } from "@/lib/utils"
import { ExtractView } from "./ExtractView"
import { TranscriptView } from "./TranscriptView"
import { ChatView } from "@/components/chat/ChatView"

const extractTypeIcons: Record<ExtractType, React.ReactNode> = {
  RECIPE: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
  PLACE: <MapPin className="h-4 w-4" />,
  WORKOUT: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  PRODUCT: <ShoppingBag className="h-4 w-4" />,
  DISCOUNT_CODE: <Tag className="h-4 w-4" />,
  CONTACT_INFO: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  EVENT: <Clock className="h-4 w-4" />,
  TUTORIAL_STEPS: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  SHOPPING_LIST: <ShoppingBag className="h-4 w-4" />,
  TRAVEL_ITINERARY: <MapPin className="h-4 w-4" />,
}

const extractTypeLabels: Record<ExtractType, string> = {
  RECIPE: "Tarif",
  PLACE: "Yer",
  WORKOUT: "Antrenman",
  PRODUCT: "Ürün",
  DISCOUNT_CODE: "İndirim Kodu",
  CONTACT_INFO: "İletişim Bilgisi",
  EVENT: "Etkinlik",
  TUTORIAL_STEPS: "Eğitim Adımları",
  SHOPPING_LIST: "Alışveriş Listesi",
  TRAVEL_ITINERARY: "Seyahat Planı",
}

interface SaveDetailProps {
  save: SaveWithRelations
  onClose: () => void
  onFavorite: (id: string) => void
  onArchive: (id: string) => void
  onDelete: (id: string) => void
  onCopyLink: (url: string) => void
  onOpenOriginal: (url: string) => void
  onUpdateTags: (saveId: string, tags: string[]) => void
  onAddToCollection: (saveId: string, collectionId: string) => void
  onRemoveFromCollection: (saveId: string, collectionId: string) => void
  collections: { id: string; name: string; color: string }[]
}

export function SaveDetail({
  save,
  onClose,
  onFavorite,
  onArchive,
  onDelete,
  onCopyLink,
  onOpenOriginal,
  onUpdateTags,
  onAddToCollection,
  onRemoveFromCollection,
  collections,
}: SaveDetailProps) {
  const [activeTab, setActiveTab] = useState("content")
  const [showTagEditor, setShowTagEditor] = useState(false)
  const [editingTags, setEditingTags] = useState(save.tags.map((t) => t.tag.name))

  const platformColor = getPlatformColor(save.platform)
  const platformIcon = getPlatformIcon(save.platform)

  const dropdownItems: DropdownItem[] = [
    {
      label: save.isFavorite ? "Favorilerden çıkar" : "Favorilere ekle",
      icon: save.isFavorite ? <Heart className="h-4 w-4 fill-current" /> : <Heart className="h-4 w-4" />,
      onClick: () => onFavorite(save.id),
    },
    {
      label: save.isArchived ? "Arşivden çıkar" : "Arşivle",
      icon: save.isArchived ? <Archive className="h-4 w-4" /> : <Archive className="h-4 w-4" />,
      onClick: () => onArchive(save.id),
    },
    { divider: true },
    {
      label: "Bağlantıyı kopyala",
      icon: <Copy className="h-4 w-4" />,
      onClick: () => onCopyLink(save.url),
    },
    {
      label: "Orijinali aç",
      icon: <ExternalLink className="h-4 w-4" />,
      onClick: () => onOpenOriginal(save.url),
    },
    {
      label: "Paylaş",
      icon: <Share2 className="h-4 w-4" />,
      onClick: () => navigator.share({ url: save.url, title: save.title }),
    },
    { divider: true },
    {
      label: "Etiketleri düzenle",
      icon: <Edit className="h-4 w-4" />,
      onClick: () => setShowTagEditor(true),
    },
    { divider: true },
    {
      label: "Sil",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => onDelete(save.id),
      danger: true,
    },
  ]

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="full"
      showClose={false}
      closeOnOverlayClick={false}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </Button>
            <div>
              <Badge
                variant="outline"
                className={cn(platformColor, "text-xs")}
              >
                {platformIcon} {save.platform}
              </Badge>
              {save.contentType !== "VIDEO" && (
                <Badge variant="outline" size="sm" className="ml-1">
                  {save.contentType}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => onCopyLink(save.url)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Copy className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onOpenOriginal(save.url)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <ExternalLink className="h-5 w-5" />
            </Button>
            <Dropdown trigger={<Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><MoreVertical className="h-5 w-5" /></Button>} items={dropdownItems} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Media */}
                {save.thumbnailUrl && (
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img src={save.thumbnailUrl} alt={save.title || ""} className="h-full w-full object-cover" />
                    {save.duration && (
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-sm rounded-full">
                        {Math.floor(save.duration / 60)}:{String(save.duration % 60).padStart(2, "0")}
                      </div>
                    )}
                  </div>
                )}

                {/* Title & Meta */}
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{save.title || "Başlıksız"}</h1>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Kaydedildi: {formatRelativeTime(save.savedAt)}
                    </span>
                    {save.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Yayınlandı: {formatRelativeTime(save.publishedAt)}
                      </span>
                    )}
                    {save.authorName && (
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {save.authorName}
                      </span>
                    )}
                    {save.viewCount && (
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        {save.viewCount.toLocaleString()}
                      </span>
                    )}
                    {save.likeCount && (
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4 fill-current text-red-500" />
                        {save.likeCount.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {save.description && (
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{save.description}</p>
                  )}

                  {/* Tags & Extracts */}
                  <div className="flex flex-wrap gap-2">
                    {save.tags.map(({ tag }) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        size="sm"
                        style={{ borderColor: tag.color, color: tag.color }}
                        onClick={() => {
                          const newTags = editingTags.includes(tag.name)
                            ? editingTags.filter((t) => t !== tag.name)
                            : [...editingTags, tag.name]
                          setEditingTags(newTags)
                        }}
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                    {save.tags.length === 0 && (
                      <Badge variant="outline" size="sm" className="text-gray-400">
                        Etiket yok
                      </Badge>
                    )}
                  </div>

                  {save.smartExtracts.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {save.smartExtracts.map((extract) => (
                        <Badge key={extract.id} variant="primary" size="sm" className="gap-1">
                          {extractTypeIcons[extract.type as ExtractType]}
                          {extractTypeLabels[extract.type as ExtractType]}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tabs */}
                <Tabs defaultValue="content" onValueChange={setActiveTab}>
                  <TabsList className="border-b border-gray-200 dark:border-gray-700">
                    <TabsTrigger value="content">İçerik</TabsTrigger>
                    {save.transcript && <TabsTrigger value="transcript">Deşifre</TabsTrigger>}
                    {save.smartExtracts.length > 0 && <TabsTrigger value="extracts">Çıkarımlar</TabsTrigger>}
                    {save.summary && <TabsTrigger value="summary">Özet</TabsTrigger>}
                    <TabsTrigger value="chat">AI Sohbet</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4">
                    {save.url && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Orijinal URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={save.url}
                            readOnly
                            className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono text-gray-900 dark:text-gray-100"
                          />
                          <Button variant="outline" size="sm" onClick={() => onCopyLink(save.url)}>
                            <Copy className="h-4 w-4 mr-1" />
                            Kopyala
                          </Button>
                        </div>
                      </div>
                    )}

                    {save.metadata && (
                      <details className="group">
                        <summary className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180 text-gray-400" />
                          Ham Veri
                        </summary>
                        <pre className="mt-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs overflow-x-auto text-gray-600 dark:text-gray-300">
                          {JSON.stringify(save.metadata, null, 2)}
                        </pre>
                      </details>
                    )}
                  </TabsContent>

                  <TabsContent value="transcript">
                    {save.transcript ? <TranscriptView transcript={save.transcript} /> : <p className="text-gray-500 dark:text-gray-400">Deşifre bulunamadı.</p>}
                  </TabsContent>

                  <TabsContent value="extracts">
                    {save.smartExtracts.length > 0 ? (
                      <ExtractView extracts={save.smartExtracts} />
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">Yapılandırılmış veri çıkarılamadı.</p>
                    )}
                  </TabsContent>

                  <TabsContent value="summary">
                    {save.summary ? (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Kısa Özet</h4>
                          <p className="text-gray-600 dark:text-gray-300">{save.summary.shortSummary}</p>
                        </div>
                        {save.summary.detailedSummary && (
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Detaylı Özet</h4>
                            <p className="text-gray-600 dark:text-gray-300">{save.summary.detailedSummary}</p>
                          </div>
                        )}
                        {save.summary.keyPoints?.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Anahtar Noktalar</h4>
                            <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-300">
                              {save.summary.keyPoints.map((point, i) => (
                                <li key={i}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {save.summary.topics?.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Konular</h4>
                            <div className="flex flex-wrap gap-2">
                              {save.summary.topics.map((topic, i) => (
                                <Badge key={i} variant="outline" size="sm">{topic}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>Duygu: {save.summary.sentiment}</span>
                          <span>Okuma süresi: ~{save.summary.readingTime} dk</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">Özet bulunamadı.</p>
                    )}
                  </TabsContent>

                  <TabsContent value="chat">
                    <ChatView saveId={save.id} />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Collections */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Koleksiyonlar
                      <Button variant="ghost" size="sm" onClick={() => {}}>
                        <Plus className="h-4 w-4 mr-1" />
                        Yeni
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {collections.length > 0 ? (
                      collections.map((collection) => {
                        const isInCollection = save.collections.some((c) => c.collectionId === collection.id)
                        return (
                          <div key={collection.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: collection.color }}>
                                <FolderPlus className="h-5 w-5 text-white" />
                              </div>
                              <span className="font-medium text-gray-900 dark:text-gray-100">{collection.name}</span>
                            </div>
                            <Button
                              variant={isInCollection ? "secondary" : "outline"}
                              size="sm"
                              onClick={() => isInCollection
                                ? onRemoveFromCollection(save.id, collection.id)
                                : onAddToCollection(save.id, collection.id)
                              }
                            >
                              {isInCollection ? "Çıkar" : "Ekle"}
                            </Button>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Henüz koleksiyon yok</p>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Hızlı İşlemler</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start gap-2" onClick={() => onCopyLink(save.url)}>
                      <Copy className="h-4 w-4" />
                      Bağlantıyı Kopyala
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2" onClick={() => onOpenOriginal(save.url)}>
                      <ExternalLink className="h-4 w-4" />
                      Orijinali Aç
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigator.share({ url: save.url, title: save.title })}>
                      <Share2 className="h-4 w-4" />
                      Paylaş
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2" onClick={() => {}}>
                      <Download className="h-4 w-4" />
                      Dışa Aktar (JSON)
                    </Button>
                  </CardContent>
                </Card>

                {/* Stats */}
                {save.viewCount || save.likeCount || save.commentCount ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>İstatistikler</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 gap-4 text-center">
                      {save.viewCount && (
                        <div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{save.viewCount.toLocaleString()}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Görüntülenme</div>
                        </div>
                      )}
                      {save.likeCount && (
                        <div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{save.likeCount.toLocaleString()}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Beğeni</div>
                        </div>
                      )}
                      {save.commentCount && (
                        <div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{save.commentCount.toLocaleString()}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Yorum</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tag Editor Modal */}
      <Modal isOpen={showTagEditor} onClose={() => setShowTagEditor(false)} title="Etiketleri Düzenle" size="md">
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Virgülle ayırarak etiketleri ekleyin veya silin.</p>
          <textarea
            value={editingTags.join(", ")}
            onChange={(e) => setEditingTags(e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[100px] resize-y"
            placeholder="etiket1, etiket2, etiket3"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowTagEditor(false)}>İptal</Button>
            <Button onClick={() => { onUpdateTags(save.id, editingTags); setShowTagEditor(false) }}>Kaydet</Button>
          </div>
        </div>
      </Modal>
    </Modal>
  )
}