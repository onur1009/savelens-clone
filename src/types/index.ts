import { Save, Tag, Collection, SmartShelf, Transcript, Summary, SmartExtract, ChatMessage, User } from "@prisma/client"

export type Platform = 
  | "INSTAGRAM" 
  | "TIKTOK" 
  | "YOUTUBE" 
  | "LINKEDIN" 
  | "X" 
  | "REDDIT" 
  | "PINTEREST" 
  | "WEB" 
  | "OTHER"

export type ProcessingStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"
export type ContentType = "VIDEO" | "IMAGE" | "ARTICLE" | "AUDIO" | "POST" | "OTHER"
export type ExtractType = 
  | "RECIPE" 
  | "PLACE" 
  | "WORKOUT" 
  | "PRODUCT" 
  | "DISCOUNT_CODE" 
  | "CONTACT_INFO" 
  | "EVENT" 
  | "TUTORIAL_STEPS" 
  | "SHOPPING_LIST" 
  | "TRAVEL_ITINERARY"

export interface SaveWithRelations extends Save {
  tags: (SaveTag & { tag: Tag })[]
  collections: (CollectionSave & { collection: Collection })[]
  transcript?: Transcript | null
  summary?: Summary | null
  smartExtracts: SmartExtract[]
}

export interface SaveTag {
  id: string
  saveId: string
  tagId: string
  createdAt: Date
  tag: Tag
}

export interface CollectionSave {
  id: string
  collectionId: string
  saveId: string
  addedAt: Date
  collection: Collection
}

export interface UserWithSettings extends User {
  settings: UserSettings | null
}

export interface UserSettings {
  id: string
  userId: string
  theme: "LIGHT" | "DARK" | "SYSTEM"
  language: string
  emailNotifications: boolean
  weeklyDigest: boolean
  autoTagging: boolean
  autoTranscription: boolean
  defaultCollectionId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface SearchFilters {
  query?: string
  platform?: Platform[]
  tags?: string[]
  collections?: string[]
  contentType?: ContentType[]
  dateFrom?: Date
  dateTo?: Date
  isFavorite?: boolean
  isArchived?: boolean
  hasTranscript?: boolean
  sortBy?: "savedAt" | "publishedAt" | "title" | "relevance"
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

export interface SearchResult {
  saves: SaveWithRelations[]
  total: number
  page: number
  totalPages: number
  facets: {
    platforms: { platform: Platform; count: number }[]
    tags: { tag: string; count: number }[]
    contentTypes: { type: ContentType; count: number }[]
  }
}

export interface SmartExtractData {
  RECIPE: {
    title: string
    ingredients: string[]
    steps: string[]
    prepTime?: number
    cookTime?: number
    servings?: number
    cuisine?: string
    dietTags?: string[]
  }
  PLACE: {
    name: string
    address?: string
    latitude?: number
    longitude?: number
    placeType?: string
    rating?: number
    priceLevel?: number
    phone?: string
    website?: string
    hours?: Record<string, string>
  }
  WORKOUT: {
    name: string
    exercises: Array<{
      name: string
      sets?: number
      reps?: number
      weight?: string
      duration?: number
      rest?: number
      notes?: string
    }>
    totalDuration?: number
    difficulty?: string
    targetMuscles?: string[]
  }
  PRODUCT: {
    name: string
    brand?: string
    price?: number
    currency?: string
    url?: string
    imageUrl?: string
    rating?: number
    description?: string
    category?: string
  }
  DISCOUNT_CODE: {
    code: string
    discount?: string
    validUntil?: string
    terms?: string
    brand?: string
    url?: string
  }
  CONTACT_INFO: {
    name?: string
    phone?: string
    email?: string
    website?: string
    address?: string
    socialLinks?: Record<string, string>
  }
  EVENT: {
    name: string
    startDate: string
    endDate?: string
    location?: string
    description?: string
    url?: string
    organizer?: string
  }
  TUTORIAL_STEPS: {
    title: string
    steps: Array<{
      step: number
      title: string
      description: string
      duration?: number
      imageUrl?: string
    }>
    estimatedTime?: number
    difficulty?: string
    tools?: string[]
  }
  SHOPPING_LIST: {
    title: string
    items: Array<{
      name: string
      quantity?: string
      category?: string
      checked?: boolean
      notes?: string
    }>
    store?: string
  }
  TRAVEL_ITINERARY: {
    title: string
    destination: string
    startDate: string
    endDate: string
    days: Array<{
      day: number
      date: string
      activities: Array<{
        time?: string
        title: string
        location?: string
        description?: string
        type?: string
      }>
    }>
  }
}

export interface ChatContext {
  saves: Array<{
    id: string
    title: string
    platform: Platform
    summary?: string
    tags: string[]
    smartExtracts: SmartExtract[]
  }>
  totalSaves: number
  dateRange: { from: Date; to: Date }
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}