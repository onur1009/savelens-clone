"use client"

import { useState } from "react"
import { formatRelativeTime, cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Copy, Search, Play, Pause } from "lucide-react"
import { Transcript } from "@/types"

interface TranscriptViewProps {
  transcript: Transcript
}

export function TranscriptView({ transcript }: TranscriptViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedSegment, setCopiedSegment] = useState<string | null>(null)

  const segments = transcript.segments as Array<{ start: number; end: number; text: string }> || []
  const filteredSegments = segments.filter((seg) =>
    seg.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const copySegment = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSegment(text)
    setTimeout(() => setCopiedSegment(null), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            {segments.length} segment
          </Badge>
          {transcript.language && (
            <Badge variant="secondary" size="sm">{transcript.language.toUpperCase()}</Badge>
          )}
          {transcript.duration && (
            <Badge variant="outline" size="sm" className="gap-1">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {Math.floor(transcript.duration / 60)}:{String(Math.floor(transcript.duration % 60)).padStart(2, "0")}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Deşifre içinde ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => copySegment(transcript.fullText)}>
            <Copy className="h-4 w-4 mr-1" />
            Tümünü Kopyala
          </Button>
        </div>
      </div>

      {/* Transcript */}
      <div className="max-h-[600px] overflow-y-auto space-y-2">
        {filteredSegments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            <Search className="h-12 w-12 mb-3 opacity-30" />
            <p>{searchQuery ? "Eşleşen segment bulunamadı" : "Deşifre segmenti yok"}</p>
          </div>
        ) : (
          filteredSegments.map((segment, index) => (
            <div
              key={index}
              className={cn(
                "group p-3 rounded-xl border border-gray-100 dark:border-gray-800",
                "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                "relative"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-20 text-right text-xs text-gray-400 font-mono pt-0.5">
                  {formatTime(segment.start)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{segment.text}</p>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => copySegment(segment.text)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    {copiedSegment === segment.text ? (
                      <span className="h-4 w-4 text-green-500">✓</span>
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Full Text Toggle */}
      <details className="group">
        <summary className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl cursor-pointer">
          <span className="font-medium text-gray-900 dark:text-gray-100">Tam Metni Göster</span>
          <svg className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </summary>
        <div className="p-3 border-t border-gray-100 dark:border-gray-800">
          <pre className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300 font-mono max-h-96 overflow-y-auto">
            {transcript.fullText}
          </pre>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => copySegment(transcript.fullText)}>
            <Copy className="h-4 w-4 mr-1" />
            Tam Metni Kopyala
          </Button>
        </div>
      </details>
    </div>
  )
}