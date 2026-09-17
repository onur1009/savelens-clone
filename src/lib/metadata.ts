export interface ExtractedMetadata {
  title?: string
  description?: string
  thumbnailUrl?: string
  authorName?: string
  authorUrl?: string
  authorAvatar?: string
  duration?: number
  viewCount?: number
  likeCount?: number
  commentCount?: number
  publishedAt?: Date
  platform?: string
  platformId?: string
  contentType?: string
  language?: string
  rawMetadata?: Record<string, any>
}

export async function extractMetadata(url: string): Promise<ExtractedMetadata> {
  const platform = detectPlatform(url)
  
  try {
    switch (platform) {
      case "INSTAGRAM":
        return await extractInstagramMetadata(url)
      case "TIKTOK":
        return await extractTikTokMetadata(url)
      case "YOUTUBE":
        return await extractYouTubeMetadata(url)
      case "LINKEDIN":
        return await extractLinkedInMetadata(url)
      case "X":
        return await extractXMetadata(url)
      default:
        return await extractGenericMetadata(url)
    }
  } catch (error) {
    console.error("Metadata extraction failed:", error)
    return { platform }
  }
}

function detectPlatform(url: string): string {
  const hostname = new URL(url).hostname.toLowerCase()
  if (hostname.includes("instagram.com")) return "INSTAGRAM"
  if (hostname.includes("tiktok.com")) return "TIKTOK"
  if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) return "YOUTUBE"
  if (hostname.includes("linkedin.com")) return "LINKEDIN"
  if (hostname.includes("x.com") || hostname.includes("twitter.com")) return "X"
  if (hostname.includes("reddit.com")) return "REDDIT"
  if (hostname.includes("pinterest.com")) return "PINTEREST"
  return "WEB"
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(id)
  }
}

async function extractGenericMetadata(url: string): Promise<ExtractedMetadata> {
  try {
    const response = await fetchWithTimeout(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SaveLens/1.0; +https://savelens.app/bot)",
      },
    })
    const html = await response.text()
    
    const title = extractMetaTag(html, "og:title") || 
                  extractMetaTag(html, "twitter:title") || 
                  extractTitleTag(html)
    const description = extractMetaTag(html, "og:description") || 
                        extractMetaTag(html, "twitter:description") || 
                        extractMetaTag(html, "description")
    const thumbnailUrl = extractMetaTag(html, "og:image") || 
                         extractMetaTag(html, "twitter:image")
    const authorName = extractMetaTag(html, "author") || 
                       extractMetaTag(html, "og:site_name")
    
    return {
      title,
      description,
      thumbnailUrl,
      authorName,
      platform: "WEB",
      contentType: "ARTICLE",
    }
  } catch {
    return { platform: "WEB" }
  }
}

async function extractYouTubeMetadata(url: string): Promise<ExtractedMetadata> {
  const videoId = extractYouTubeId(url)
  if (!videoId) return { platform: "YOUTUBE" }
  
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return await extractGenericMetadata(url)
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics,contentDetails&key=${apiKey}`
    )
    const data = await response.json()
    const video = data.items?.[0]
    
    if (!video) return { platform: "YOUTUBE", platformId: videoId }
    
    return {
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnailUrl: video.snippet.thumbnails?.maxres?.url || 
                    video.snippet.thumbnails?.high?.url ||
                    video.snippet.thumbnails?.medium?.url,
      authorName: video.snippet.channelTitle,
      authorUrl: `https://youtube.com/channel/${video.snippet.channelId}`,
      duration: parseISO8601Duration(video.contentDetails.duration),
      viewCount: parseInt(video.statistics.viewCount),
      likeCount: parseInt(video.statistics.likeCount),
      commentCount: parseInt(video.statistics.commentCount),
      publishedAt: new Date(video.snippet.publishedAt),
      platform: "YOUTUBE",
      platformId: videoId,
      contentType: "VIDEO",
    }
  } catch {
    return await extractGenericMetadata(url)
  }
}

async function extractInstagramMetadata(url: string): Promise<ExtractedMetadata> {
  return await extractGenericMetadata(url)
}

async function extractTikTokMetadata(url: string): Promise<ExtractedMetadata> {
  return await extractGenericMetadata(url)
}

async function extractLinkedInMetadata(url: string): Promise<ExtractedMetadata> {
  return await extractGenericMetadata(url)
}

async function extractXMetadata(url: string): Promise<ExtractedMetadata> {
  return await extractGenericMetadata(url)
}

function extractMetaTag(html: string, property: string): string | undefined {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
  ]
  
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) return match[1]
  }
  return undefined
}

function extractTitleTag(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return match?.[1]
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

function parseISO8601Duration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const hours = parseInt(match[1] || "0")
  const minutes = parseInt(match[2] || "0")
  const seconds = parseInt(match[3] || "0")
  return hours * 3600 + minutes * 60 + seconds
}