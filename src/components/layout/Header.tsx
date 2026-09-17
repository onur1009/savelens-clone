"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown"
import { Modal } from "@/components/ui/Modal"
import { Search, Moon, Sun, Bell, Settings, User, LogOut, ChevronDown, Command } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { SaveForm } from "@/components/saves/SaveForm"

export function Header() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const userMenuItems: DropdownItem[] = [
    { label: "Profil", icon: <User className="h-4 w-4" />, onClick: () => { /* router.push("/settings/profile") */ } },
    { label: "Ayarlar", icon: <Settings className="h-4 w-4" />, onClick: () => { /* router.push("/settings") */ } },
    { divider: true },
    { label: "Çıkış Yap", icon: <LogOut className="h-4 w-4" />, onClick: () => signOut({ callbackUrl: "/auth/login" }), danger: true },
  ]

  const notificationItems: DropdownItem[] = [
    { label: "Tüm bildirimleri gör", icon: <Bell className="h-4 w-4" />, onClick: () => { } },
    { divider: true },
    { label: "Bildirim yok", disabled: true },
  ]

  return (
    <header className="fixed top-0 left-16 right-0 z-30 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setShowMobileMenu(true)}
          aria-label="Menüyü aç"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </Button>

        {/* Search */}
        <div className="flex-1 max-w-xl lg:max-w-2xl hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Kayıt, etiket, koleksiyon ara... (⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              aria-label="Ara"
            />
            <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 ml-2 text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 rounded">
              <Command className="h-3 w-3" /> K
            </kbd>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label={theme === "dark" ? "Açık mod" : "Koyu mod"}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          <Dropdown
            trigger={
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">3</span>
              </Button>
            }
            items={notificationItems}
            align="right"
          />

          {/* Save Form Trigger */}
          <Button
            onClick={() => setShowSaveForm(true)}
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            <span>Kaydet</span>
          </Button>

          {/* User Menu */}
          <Dropdown
            trigger={
              <Button variant="ghost" className="flex items-center gap-2 pr-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                <Avatar
                  size="sm"
                  name={session?.user?.name || "User"}
                  src={session?.user?.image || undefined}
                />
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {session?.user?.name || "Kullanıcı"}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
              </Button>
            }
            items={userMenuItems}
            align="right"
          />
        </div>
      </div>

      {/* Mobile Search */}
      <div className="lg:hidden px-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Ara... (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Save Form Modal */}
      <SaveForm
        isOpen={showSaveForm}
        onClose={() => setShowSaveForm(false)}
        onSuccess={() => window.location.reload()}
      />

      {/* Mobile Menu Modal */}
      <Modal
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        title="Menü"
        size="lg"
      >
        <nav className="space-y-1">
          {[
            { name: "Ana Sayfa", href: "/dashboard", icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
            { name: "Kütüphane", href: "/library", icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
            { name: "Akıllı Arama", href: "/search", icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
            { name: "Koleksiyonlar", href: "/collections", icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg> },
            { name: "Harita", href: "/map", icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg> },
            { name: "AI Sohbet", href: "/chat", icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
            >
              {item.icon}
              {item.name}
            </a>
          ))}
        </nav>
      </Modal>
    </header>
  )
}