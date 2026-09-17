"use client"

import { useState, useRef, useEffect, Fragment } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"

interface DropdownItem {
  label: string
  onClick: () => void
  icon?: React.ReactNode
  disabled?: boolean
  danger?: boolean
  divider?: boolean
}

interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: "left" | "right"
  className?: string
}

export function Dropdown({ trigger, items, align = "right", className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={cn("relative inline-block", className)} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <Fragment>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className={cn(
              "fixed z-50 mt-2 w-56 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 py-1 animate-scale-in",
              align === "right" ? "right-0" : "left-0"
            )}
            role="menu"
          >
            {items.map((item, index) => (
              item.divider ? (
                <div key={`divider-${index}`} className="h-px bg-gray-100 dark:bg-gray-700 my-1" role="separator" />
              ) : (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick()
                    setIsOpen(false)
                  }}
                  disabled={item.disabled}
                  role="menuitem"
                  className={cn(
                    "w-full px-4 py-2.5 text-sm flex items-center gap-3 transition-colors",
                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                    "focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700",
                    item.disabled && "opacity-50 cursor-not-allowed",
                    item.danger && "text-red-600 dark:text-red-400"
                  )}
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  {item.label}
                </button>
              )
            ))}
          </div>
        </Fragment>
      )}
    </div>
  )
}

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  label?: string
  error?: string
  className?: string
  disabled?: boolean
}

export function Select({ value, onChange, options, placeholder, label, error, className, disabled }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={cn("relative w-full", className)} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800",
          "text-left font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error ? "border-red-500" : "border-gray-200 dark:border-gray-700",
          "hover:border-gray-300 dark:hover:border-gray-600"
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={cn("flex-1", value ? "text-gray-900 dark:text-gray-100" : "text-gray-400")}>
          {value ? options.find((o) => o.value === value)?.label : placeholder}
        </span>
        <svg className={cn("h-5 w-5 text-gray-400 transition-transform", isOpen && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="fixed z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 py-1 animate-slide-down">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              disabled={option.disabled}
              role="option"
              aria-selected={value === option.value}
              className={cn(
                "w-full px-4 py-2.5 text-sm transition-colors",
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                "focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700",
                option.disabled && "opacity-50 cursor-not-allowed",
                value === option.value && "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      {error && <p className="mt-1.5 text-sm text-red-500" role="alert">{error}</p>}
    </div>
  )
}