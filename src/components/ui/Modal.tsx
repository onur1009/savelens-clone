"use client"

import { Fragment, type ReactNode } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  showClose?: boolean
  closeOnOverlayClick?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showClose = true,
  closeOnOverlayClick = true,
}: ModalProps) {
  if (!isOpen) return null

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-4xl",
  }

  return (
    <Fragment>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={closeOnOverlayClick ? onClose : undefined}
        role="presentation"
      />
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center p-4 animate-slide-up",
          "pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
      >
        <div
          className={cn(
            "w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl pointer-events-auto",
            "max-h-[90vh] overflow-hidden flex flex-col",
            sizes[size]
          )}
        >
          {(title || showClose) && (
            <div className="flex items-start justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <div>
                {title && (
                  <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id="modal-description" className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {description}
                  </p>
                )}
              </div>
              {showClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Kapat"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </div>
    </Fragment>
  )
}

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "danger" | "primary"
  loading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Onayla",
  cancelText = "İptal",
  variant = "primary",
  loading,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant={variant === "danger" ? "destructive" : "primary"}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}