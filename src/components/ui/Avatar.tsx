"use client"

import { cn } from "@/lib/utils"
import { getInitials } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  name?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  status?: "online" | "offline" | "busy" | "away"
}

export function Avatar({ className, src, alt, name, size = "md", status, ...props }: AvatarProps) {
  const sizes = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
  }

  const statusSizes = {
    xs: "h-1.5 w-1.5",
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
    xl: "h-4 w-4",
  }

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    busy: "bg-red-500",
    away: "bg-yellow-500",
  }

  return (
    <div className={cn("relative inline-flex shrink-0", className)} {...props}>
      {src ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className={cn("rounded-full object-cover", sizes[size])}
        />
      ) : (
        <div
          className={cn(
            "rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300",
            "flex items-center justify-center font-medium select-none",
            sizes[size]
          )}
        >
          {name ? getInitials(name) : "?"}
        </div>
      )}
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-800",
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  )
}

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  avatars: Array<{ src?: string; name?: string; alt?: string }>
  max?: number
  size?: "xs" | "sm" | "md" | "lg" | "xl"
}

export function AvatarGroup({ avatars, max = 5, size = "md", className, ...props }: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max)
  const remaining = avatars.length - max

  return (
    <div className={cn("flex -space-x-2", className)} {...props}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar key={index} {...avatar} size={size} className="ring-2 ring-white dark:ring-gray-800" />
      ))}
      {remaining > 0 && (
        <Avatar
          name={`${remaining}+`}
          size={size}
          className="ring-2 ring-white dark:ring-gray-800 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
        />
      )}
    </div>
  )
}