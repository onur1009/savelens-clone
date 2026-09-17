"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { chatWithLibrary } from "@/lib/ai"
import { revalidatePath } from "next/cache"

export async function sendChatMessage(message: string) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Oturum açmanız gerekiyor" }

  const userId = (session.user as any).id

  const userMessage = await prisma.chatMessage.create({
    data: { userId, role: "USER", content: message },
  })

  const recentMessages = await prisma.chatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  const saves = await prisma.save.findMany({
    where: { userId, isArchived: false },
    include: {
      tags: { include: { tag: true } },
      summary: true,
      smartExtracts: true,
    },
    orderBy: { savedAt: "desc" },
    take: 50,
  })

  const context = JSON.stringify({
    saves: saves.map((s) => ({
      id: s.id,
      title: s.title,
      platform: s.platform,
      summary: s.summary?.shortSummary,
      tags: s.tags.map((t) => t.tag.name),
      smartExtracts: s.smartExtracts.map((e) => ({ type: e.type, title: e.title, data: e.data })),
    })),
    totalSaves: saves.length,
    dateRange: {
      from: saves[saves.length - 1]?.savedAt || new Date(),
      to: saves[0]?.savedAt || new Date(),
    },
  })

  const history = recentMessages.reverse().map((m) => ({ role: m.role.toLowerCase(), content: m.content }))

  try {
    const response = await chatWithLibrary(message, context, history)

    const assistantMessage = await prisma.chatMessage.create({
      data: { userId, role: "ASSISTANT", content: response },
    })

    return { success: true, message: assistantMessage }
  } catch (error) {
    console.error("Chat error:", error)
    await prisma.chatMessage.create({
      data: { userId, role: "ASSISTANT", content: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin." },
    })
    return { success: false, error: "Yanıt oluşturulurken hata oluştu" }
  }
}

export async function getChatHistory() {
  const session = await auth()
  if (!session?.user) return []

  const userId = (session.user as any).id
  return prisma.chatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    take: 100,
  })
}

export async function clearChatHistory() {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Oturum açmanız gerekiyor" }

  const userId = (session.user as any).id
  await prisma.chatMessage.deleteMany({ where: { userId } })
  return { success: true }
}

export async function createSmartShelf(formData: FormData) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Oturum açmanız gerekiyor" }

  const userId = (session.user as any).id
  const name = formData.get("name") as string
  const query = formData.get("query") as string
  const description = formData.get("description") as string | null
  const color = formData.get("color") as string | null
  const icon = formData.get("icon") as string | null
  const collectionId = formData.get("collectionId") as string | null

  if (!name || !query) return { success: false, error: "İsim ve sorgu gereklidir" }

  const shelf = await prisma.smartShelf.create({
    data: {
      userId,
      name,
      query,
      description: description || null,
      color: color || "#d946ef",
      icon: icon || "search",
      collectionId: collectionId || null,
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/library")

  return { success: true, shelf }
}

export async function getSmartShelves() {
  const session = await auth()
  if (!session?.user) return []

  const userId = (session.user as any).id
  return prisma.smartShelf.findMany({
    where: { userId, isActive: true },
    include: { collection: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function getSmartShelfResults(shelfId: string) {
  const session = await auth()
  if (!session?.user) return { saves: [], total: 0 }

  const userId = (session.user as any).id
  const shelf = await prisma.smartShelf.findFirst({ where: { id: shelfId, userId } })
  if (!shelf) return { saves: [], total: 0 }

  const query = shelf.query.toLowerCase()
  const saves = await prisma.save.findMany({
    where: {
      userId,
      isArchived: false,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { some: { tag: { name: { contains: query, mode: "insensitive" } } } } },
        { summary: { shortSummary: { contains: query, mode: "insensitive" } } },
        { summary: { detailedSummary: { contains: query, mode: "insensitive" } } },
      ],
    },
    include: {
      tags: { include: { tag: true } },
      collections: { include: { collection: true } },
      summary: true,
      smartExtracts: true,
    },
    orderBy: { savedAt: "desc" },
  })

  return { saves, total: saves.length }
}

export async function deleteSmartShelf(id: string) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Oturum açmanız gerekiyor" }

  const userId = (session.user as any).id
  await prisma.smartShelf.deleteMany({ where: { id, userId } })
  
  revalidatePath("/dashboard")
  revalidatePath("/library")

  return { success: true }
}