"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { 
  Home, Library, Search, FolderKanban, MapPin, MessageSquare, 
  Settings, LogOut, User, Bell, Moon, Sun, Menu, X, ChevronLeft,
  Plus, Brain, Zap
} from "lucide-react"
import { useSession, signOut } from "next-auth/react"

const navigation = [
  { name: "Ana Sayfa", href: "/dashboard", icon: Home },
  { name: "Kütüphane", href: "/library", icon: Library },
  { name: "Akıllı Arama", href: "/search", icon: Search },
  { name: "Koleksiyonlar", href: "/collections", icon: FolderKanban },
  { name: "Harita", href: "/map", icon: MapPin },
  { name: "AI Sohbet", href: "/chat", icon: MessageSquare },
]

const bottomNavigation = [
  { name: "Ayarlar", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className={cn("flex items-center justify-between h-16 px-4 border-b border-gray-100 dark:border-gray-800", collapsed && "justify-center")}>
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-gray-100">SaveLens</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label={collapsed ? "Genişlet" : "Daralt"}
        >
          {collapsed ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" role="navigation" aria-label="Ana navigasyon">
        <div className={cn("px-3 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider", collapsed && "hidden")}>
          ANA MENÜ
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                "group relative overflow-hidden",
                isActive
                  ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.name : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary-600 dark:text-primary-400")} aria-hidden="true" />
              {!collapsed && <span>{item.name}</span>}
              {isActive && !collapsed && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-0.5 bg-primary-500 rounded-l-full" />
              )}
            </Link>
          )
        })}

        <div className="my-4 border-t border-gray-100 dark:border-gray-800" />

        <div className={cn("px-3 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider", collapsed && "hidden")}>
          ARACLAR
        </div>
        <Link
          href="/save"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
            "bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600 shadow-lg",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Yeni Kayıt" : undefined}
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          {!collapsed && <span>Yeni Kayıt Ekle</span>}
        </Link>
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3">
            <Avatar
              size="sm"
              name={session?.user?.name || "User"}
              src={session?.user?.image || undefined}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {session?.user?.name || "Kullanıcı"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {session?.user?.email || ""}
              </p>
            </div>
          </div>
        )}

        <div className={cn("space-y-1 mt-3", collapsed && "hidden")}>
          {bottomNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                <span>{item.name}</span>
              </Link>
            )
          })}

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
          >
            <LogOut className="h-5 w-5" />
            <span>Çıkış Yap</span>
          </Button>
        </div>

        {collapsed && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/auth/login" })} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <LogOut className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" href="/settings" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}