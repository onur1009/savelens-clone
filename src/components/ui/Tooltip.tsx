"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  delay?: number
  className?: string
}

export function Tooltip({ content, children, side = "top", align = "center", delay = 200, className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const triggerRef = useRef<HTMLElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const show = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay)
  }

  const hide = () => {
    clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }

  useEffect(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    trigger.addEventListener("mouseenter", show)
    trigger.addEventListener("focus", show)
    trigger.addEventListener("mouseleave", hide)
    trigger.addEventListener("blur", hide)

    return () => {
      trigger.removeEventListener("mouseenter", show)
      trigger.removeEventListener("focus", show)
      trigger.removeEventListener("mouseleave", hide)
      trigger.removeEventListener("blur", hide)
    }
  }, [delay])

  if (!isVisible) {
    return <div ref={triggerRef}>{children}</div>
  }

  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  const alignClasses = {
    start: side === "top" || side === "bottom" ? "left-0 -translate-x-0" : "top-0 -translate-y-0",
    center: side === "top" || side === "bottom" ? "left-1/2 -translate-x-1/2" : "top-1/2 -translate-y-1/2",
    end: side === "top" || side === "bottom" ? "right-0 -translate-x-0" : "bottom-0 -translate-y-0",
  }

  return (
    <>
      <div ref={triggerRef}>{children}</div>
      <div
        ref={tooltipRef}
        className={cn(
          "fixed z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-lg shadow-lg",
          "animate-fade-in whitespace-nowrap pointer-events-none",
          sideClasses[side],
          alignClasses[align],
          className
        )}
        role="tooltip"
      >
        {content}
        <div
          className={cn(
            "absolute w-0 h-0 border-4 border-transparent",
            side === "top" && "top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-100",
            side === "bottom" && "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-100",
            side === "left" && "left-full top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-100",
            side === "right" && "right-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-100"
          )}
        />
      </div>
    </>
  )
}