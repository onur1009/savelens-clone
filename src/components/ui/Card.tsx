"use client"

import { forwardRef, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated"
  padding?: "none" | "sm" | "md" | "lg"
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", padding = "md", hover, children, ...props }, ref) => {
    const variants = {
      default: "bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-800",
      outlined: "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700",
      elevated: "bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-800",
    }

    const paddings = {
      none: "",
      sm: "p-3",
      md: "p-5",
      lg: "p-6",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl transition-all duration-200",
          variants[variant],
          paddings[padding],
          hover && "hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("mb-4", className)} {...props}>{children}</div>
  )
)
CardHeader.displayName = "CardHeader"

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-lg font-semibold text-gray-900 dark:text-gray-100", className)} {...props}>
      {children}
    </h3>
  )
)
CardTitle.displayName = "CardTitle"

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-gray-500 dark:text-gray-400 mt-1", className)} {...props}>
      {children}
    </p>
  )
)
CardDescription.displayName = "CardDescription"

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(className)} {...props}>{children}</div>
  )
)
CardContent.displayName = "CardContent"

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  )
)
CardFooter.displayName = "CardFooter"

export { Card }