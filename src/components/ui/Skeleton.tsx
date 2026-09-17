"use client"

import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular"
  width?: string | number
  height?: string | number
}

export function Skeleton({ className, variant = "text", width, height, ...props }: SkeletonProps) {
  const variants = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  }

  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 dark:bg-gray-700",
        variants[variant],
        className
      )}
      style={{ width, height }}
      {...props}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="space-y-4">
      <Skeleton variant="rectangular" height="200" width="100%" />
      <div className="space-y-3 px-1">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="80%" />
      </div>
      <div className="flex gap-2 px-1">
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="circular" width={24} height={24} />
      </div>
    </div>
  )
}

export function SkeletonSaveCard() {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all hover:shadow-lg">
      <Skeleton variant="rectangular" height="160" width="100%" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
        <div className="flex flex-wrap gap-2">
          <Skeleton variant="text" width="80" height="24" />
          <Skeleton variant="text" width="80" height="24" />
          <Skeleton variant="text" width="80" height="24" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width="100" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonList(count = 5) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonSaveCard key={i} />
      ))}
    </div>
  )
}