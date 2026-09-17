"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface TabsProps {
  defaultValue: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
  variant?: "line" | "enclosed" | "soft"
}

export function Tabs({ defaultValue, onValueChange, children, className, variant = "line" }: TabsProps) {
  const [value, setValue] = useState(defaultValue)

  return (
    <div className={cn(className)} data-value={value}>
      {typeof children === "function" ? children({ value, onValueChange: setValue }) : children}
    </div>
  )
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "line" | "enclosed" | "soft"
}

export function TabsList({ children, className, variant = "line", ...props }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex gap-1",
        variant === "line" && "border-b border-gray-200 dark:border-gray-700",
        variant === "enclosed" && "bg-gray-100 dark:bg-gray-800 p-1 rounded-xl",
        variant === "soft" && "bg-transparent",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  disabled?: boolean
}

export function TabsTrigger({ value, children, className, disabled, ...props }: TabsTriggerProps) {
  const parent = (document.querySelector("[data-value]") as HTMLElement | null)?.dataset.value
  const isActive = parent === value

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      id={`tab-${value}`}
      disabled={disabled}
      onClick={() => {
        const tabs = document.querySelector("[data-value]") as HTMLElement
        if (tabs) {
          const event = new CustomEvent("tabs:change", { detail: { value } })
          tabs.dispatchEvent(event)
        }
      }}
      className={cn(
        "relative px-4 py-2.5 text-sm font-medium transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        isActive
          ? "text-primary-600 dark:text-primary-400"
          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export function TabsContent({ value, children, className, ...props }: TabsContentProps) {
  const parent = (document.querySelector("[data-value]") as HTMLElement | null)?.dataset.value
  const isActive = parent === value

  if (!isActive) return null

  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={cn("mt-4 animate-fade-in", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Client-side event listener for tabs
if (typeof window !== "undefined") {
  document.addEventListener("tabs:change", (e: any) => {
    const tabs = document.querySelector("[data-value]") as HTMLElement
    if (tabs) {
      tabs.dataset.value = e.detail.value
    }
  })
}