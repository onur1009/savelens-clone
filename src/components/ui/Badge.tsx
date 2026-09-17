"use client"

import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "outline"
  size?: "sm" | "md" | "lg"
  dot?: boolean
}

export function Badge({ className, variant = "default", size = "md", dot, children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    primary: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
    secondary: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    outline: "border-2 border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300",
  }

  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full", variant === "outline" ? "bg-current" : "bg-current/70")} />}
      {children}
    </span>
  )
}