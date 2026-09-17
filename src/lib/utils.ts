import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = new Date(date)
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  })
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Az önce"
  if (diffMins < 60) return `${diffMins} dk önce`
  if (diffHours < 24) return `${diffHours} sa önce`
  if (diffDays < 7) return `${diffDays} gün önce`
  return formatDate(d)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).trim() + "..."
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    INSTAGRAM: "📷",
    TIKTOK: "🎵",
    YOUTUBE: "▶️",
    LINKEDIN: "💼",
    X: "🐦",
    REDDIT: "🤖",
    PINTEREST: "📌",
    WEB: "🌐",
    OTHER: "📄",
  }
  return icons[platform] || "📄"
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    INSTAGRAM: "bg-gradient-to-r from-purple-500 to-pink-500",
    TIKTOK: "bg-gradient-to-r from-pink-500 to-orange-500",
    YOUTUBE: "bg-red-500",
    LINKEDIN: "bg-blue-600",
    X: "bg-gray-800",
    REDDIT: "bg-orange-500",
    PINTEREST: "bg-red-600",
    WEB: "bg-gray-500",
    OTHER: "bg-gray-400",
  }
  return colors[platform] || "bg-gray-400"
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), ms)
  }
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "")
  } catch {
    return url
  }
}