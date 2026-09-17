import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "SaveLens - AI Destekli İçerik Kütüphanesi",
  description: "Sosyal medya ve web içeriklerini kaydedin, AI ile özetleyin, etiketleyin ve anında bulun. Kalıcı bulut yedekleme ve Notion/CSV dışa aktarma.",
  keywords: ["içerik yönetimi", "sosyal medya arşiv", "AI özet", "kaydet", "kütüphane"],
  authors: [{ name: "SaveLens" }],
  creator: "SaveLens",
  openGraph: {
    title: "SaveLens - AI Destekli İçerik Kütüphanesi",
    description: "Her şeyi kaydet. Hiçbir şeyi kaybetme.",
    type: "website",
    locale: "tr_TR",
    siteName: "SaveLens",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaveLens",
    description: "AI destekli kişisel içerik arşivleme platformu",
  },
  robots: "index, follow",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}