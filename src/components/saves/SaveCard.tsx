"use client"

import { formatRelativeTime, getPlatformIcon, getPlatformColor } from "@/lib/utils"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown"
import { MoreVertical, Heart, Archive, Copy, ExternalLink, Tag, MapPin, ShoppingBag, Clock, ChevronDown } from "lucide-react"
import { SaveWithRelations, ExtractType } from "@/types"
import { cn } from "@/lib/utils"

interface SaveCardProps {
  save: SaveWithRelations
  viewMode?: "grid" | "list"
  onClick?: () => void
  onFavorite?: (id: string) => void
  onArchive?: (id: string) => void
  onDelete?: (id: string) => void
  onCopyLink?: (url: string) => void
  onOpenOriginal?: (url: string) => void
  onAddToCollection?: (saveId: string) => void
  collections?: { id: string; name: string; color: string }[]
}

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
  DISCOUNT_CODE: "İndirim",
  CONTACT_INFO: "İletişim",
  EVENT: "Etkinlik",
  TUTORIAL_STEPS: "Eğitim",
  SHOPPING_LIST: "Alışveriş",
  TRAVEL_ITINERARY: "Seyahat",
}

export function SaveCard({
  save,
  viewMode = "grid",
  onClick,
  onFavorite,
  onArchive,
  onDelete,
  onCopyLink,
  onOpenOriginal,
  onAddToCollection,
  collections = [],
}: SaveCardProps) {
  const platformColor = getPlatformColor(save.platform)
  const platformIcon = getPlatformIcon(save.platform)
  const hasExtracts = save.smartExtracts.length > 0
  const primaryExtract = save.smartExtracts[0]

  const dropdownItems: DropdownItem[] = [
    {
      label: save.isFavorite ? "Favorilerden çıkar" : "Favorilere ekle",
      icon: save.isFavorite ? <Heart className="h-4 w-4 fill-current" /> : <Heart className="h-4 w-4" />,
      onClick: () => onFavorite?.(save.id),
    },
    {
      label: save.isArchived ? "Arşivden çıkar" : "Arşivle",
      icon: save.isArchived ? <Archive className="h-4 w-4" /> : <Archive className="h-4 w-4" />,
      onClick: () => onArchive?.(save.id),
    },
    { divider: true },
    {
      label: "Bağlantıyı kopyala",
      icon: <Copy className="h-4 w-4" />,
      onClick: () => onCopyLink?.(save.url),
    },
    {
      label: "Orijinali aç",
      icon: <ExternalLink className="h-4 w-4" />,
      onClick: () => onOpenOriginal?.(save.url),
    },
    { divider: true },
    collections.length > 0 && {
      label: "Koleksiyona ekle",
      icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
      onClick: () => {},
      // We'll handle this with a submenu or separate action
    },
    { divider: true },
    {
      label: "Sil",
      icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
      onClick: () => onDelete?.(save.id),
      danger: true,
    },
  ].filter(Boolean) as DropdownItem[]

  if (viewMode === "list") {
    return (
      <div
        className={cn(
          "group flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800",
          "hover:border-primary-200 dark:hover:border-primary-800 transition-colors",
          save.isArchived && "opacity-60",
          onClick && "cursor-pointer"
        )}
        onClick={onClick}
      >
        {save.thumbnailUrl && (
          <div className="relative h-20 w-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              src={save.thumbnailUrl}
              alt={save.title || ""}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white bg-black/60 backdrop-blur-sm">
              <span className={cn(platformColor, "px-1.5 py-0.5 rounded-full")}>{platformIcon}</span>
              <span>{save.platform}</span>
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">{save.title || "Başlıksız"}</h3>
            <Dropdown
              trigger={
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              }
              items={dropdownItems}
            />
          </div>

          {save.description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{save.description}</p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {save.tags.slice(0, 3).map(({ tag }) => (
              <Badge key={tag.id} variant="outline" size="sm">
                {tag.name}
              </Badge>
            ))}
            {save.tags.length > 3 && (
              <Badge variant="outline" size="sm">+{save.tags.length - 3}</Badge>
            )}

            {hasExtracts && primaryExtract && (
              <Badge variant="primary" size="sm" className="gap-1">
                {extractTypeIcons[primaryExtract.type as ExtractType]}
                {extractTypeLabels[primaryExtract.type as ExtractType]}
              </Badge>
            )}

            {save.summary && (
              <Badge variant="secondary" size="sm">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Özet
              </Badge>
            )}
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatRelativeTime(save.savedAt)}
            </span>
            {save.authorName && (
              <span className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                {save.authorName}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <article
      className={cn(
        "group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden",
        "hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
        save.isArchived && "opacity-60",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
        {save.thumbnailUrl ? (
          <img
            src={save.thumbnailUrl}
            alt={save.title || ""}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <span className="text-6xl">{platformIcon}</span>
          </div>
        )}

        <div className="absolute top-3 left-3 right-3 flex justify-between">
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className={cn("backdrop-blur-sm bg-white/80 dark:bg-gray-800/80", platformColor)}
            >
              {platformIcon} {save.platform}
            </Badge>
            {save.contentType !== "VIDEO" && (
              <Badge variant="outline" className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                {save.contentType}
              </Badge>
            )}
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn("bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm", save.isFavorite ? "text-red-500" : "text-gray-400")}
              onClick={(e) => { e.stopPropagation(); onFavorite?.(save.id) }}
              aria-label={save.isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
            >
              <Heart className={cn("h-5 w-5", save.isFavorite ? "fill-current" : "")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-400"
              onClick={(e) => { e.stopPropagation(); onArchive?.(save.id) }}
              aria-label={save.isArchived ? "Arşivden çıkar" : "Arşivle"}
            >
              <Archive className={cn("h-5 w-5", save.isArchived ? "fill-current" : "")} />
            </Button>
          </div>
        </div>

        {hasExtracts && primaryExtract && (
          <div className="absolute bottom-3 left-3 right-3">
            <Badge variant="primary" className="gap-1.5">
              {extractTypeIcons[primaryExtract.type as ExtractType]}
              {extractTypeLabels[primaryExtract.type as ExtractType]}
            </Badge>
          </div>
        )}

        {save.processingStatus === "PROCESSING" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
          </div>
        )}

        {save.processingStatus === "FAILED" && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="danger" size="sm">İşleme hatası</Badge>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {save.title || "Başlıksız"}
        </h3>

        {save.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{save.description}</p>
        )}

        <div className="flex flex-wrap gap-2">
          {save.tags.slice(0, 4).map(({ tag }) => (
            <Badge key={tag.id} variant="outline" size="sm" style={{ borderColor: tag.color, color: tag.color }}>
              {tag.name}
            </Badge>
          ))}
          {save.tags.length > 4 && (
            <Badge variant="outline" size="sm">+{save.tags.length - 4}</Badge>
          )}
        </div>

        {hasExtracts && (
          <div className="flex flex-wrap gap-1.5">
            {save.smartExtracts.slice(0, 3).map((extract) => (
              <Badge key={extract.id} variant="outline" size="sm" className="gap-1">
                {extractTypeIcons[extract.type as ExtractType]}
                {extractTypeLabels[extract.type as ExtractType]}
              </Badge>
            ))}
            {save.smartExtracts.length > 3 && (
              <Badge variant="outline" size="sm">+{save.smartExtracts.length - 3}</Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              {formatRelativeTime(save.savedAt)}
            </span>
            {save.authorName && (
              <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                {save.authorName}
              </span>
            )}
          </div>

          <Dropdown
            trigger={
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <MoreVertical className="h-5 w-5" />
              </Button>
            }
            items={dropdownItems}
          />
        </div>
      </div>
    </article>
  )
}