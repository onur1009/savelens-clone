"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const collectionSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().optional(),
})

export async function createCollection(formData: FormData) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Oturum açmanız gerekiyor" }

  const userId = (session.user as any).id
  const name = formData.get("name") as string
  const description = formData.get("description") as string | null
  const color = formData.get("color") as string | null
  const icon = formData.get("icon") as string | null

  const validation = collectionSchema.safeParse({ name, description: description || undefined, color: color || undefined, icon: icon || undefined })
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message }
  }

  const maxOrder = await prisma.collection.aggregate({
    where: { userId },
    _max: { sortOrder: true },
  })

  const collection = await prisma.collection.create({
    data: {
      userId,
      name,
      description: description || null,
      color: color || "#0ea5e9",
      icon: icon || "folder",
      sortOrder: (maxOrder._max.sortOrder || 0) + 1,
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/library")
  revalidatePath("/collections")

  return { success: true, collection }
}

export async function getCollections() {
  const session = await auth()
  if (!session?.user) return []

  const userId = (session.user as any).id
  return prisma.collection.findMany({
    where: { userId },
    include: {
      _count: { select: { saves: true } },
    },
    orderBy: { sortOrder: "asc" },
  })
}

export async function getCollectionById(id: string) {
  const session = await auth()
  if (!session?.user) return null

  const userId = (session.user as any).id
  return prisma.collection.findFirst({
    where: { id, userId },
    include: {
      saves: {
        include: { save: { include: { tags: { include: { tag: true } }, summary: true } } },
        orderBy: { addedAt: "desc" },
      },
    },
  })
}

export async function updateCollection(id: string, data: { name?: string; description?: string; color?: string; icon?: string }) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Oturum açmanız gerekiyor" }

  const userId = (session.user as any).id
  const collection = await prisma.collection.findFirst({ where: { id, userId } })
  if (!collection) return { success: false, error: "Koleksiyon bulunamadı" }

  const updated = await prisma.collection.update({
    where: { id },
    data,
  })

  revalidatePath("/dashboard")
  revalidatePath("/library")
  revalidatePath("/collections")

  return { success: true, collection: updated }
}

export async function deleteCollection(id: string) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Oturum açmanız gerekiyor" }

  const userId = (session.user as any).id
  const collection = await prisma.collection.findFirst({ where: { id, userId } })
  if (!collection) return { success: false, error: "Koleksiyon bulunamadı" }
  if (collection.sortOrder === 0) return { success: false, error: "Varsayılan koleksiyon silinemez" }

  await prisma.collection.delete({ where: { id } })

  revalidatePath("/dashboard")
  revalidatePath("/library")
  revalidatePath("/collections")

  return { success: true }
}

export async function reorderCollections(collectionIds: string[]) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Oturum açmanız gerekiyor" }

  const userId = (session.user as any).id
  await Promise.all(
    collectionIds.map((id, index) =>
      prisma.collection.update({
        where: { id, userId },
        data: { sortOrder: index },
      })
    )
  )

  revalidatePath("/dashboard")
  revalidatePath("/library")
  revalidatePath("/collections")

  return { success: true }
}

export async function createTag(name: string) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Oturum açmanız gerekiyor" }

  const userId = (session.user as any).id
  const existing = await prisma.tag.findFirst({ where: { userId, name } })
  if (existing) return { success: true, tag: existing }

  const tag = await prisma.tag.create({ data: { userId, name } })
  return { success: true, tag }
}

export async function getTags() {
  const session = await auth()
  if (!session?.user) return []

  const userId = (session.user as any).id
  return prisma.tag.findMany({
    where: { userId },
    include: { _count: { select: { saves: true } } },
    orderBy: { name: "asc" },
  })
}

export async function deleteTag(id: string) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Oturum açmanız gerekiyor" }

  const userId = (session.user as any).id
  await prisma.tag.deleteMany({ where: { id, userId } })
  return { success: true }
}

export async function mergeTags(tagIds: string[], newName: string) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Oturum açmanız gerekiyor" }

  const userId = (session.user as any).id
  const tags = await prisma.tag.findMany({ where: { id: { in: tagIds }, userId } })
  if (tags.length !== tagIds.length) return { success: false, error: "Bazı etiketler bulunamadı" }

  let newTag = await prisma.tag.findFirst({ where: { userId, name: newName } })
  if (!newTag) {
    newTag = await prisma.tag.create({ data: { userId, name: newName } })
  }

  await prisma.saveTag.updateMany({
    where: { tagId: { in: tagIds } },
    data: { tagId: newTag.id },
  })

  await prisma.tag.deleteMany({ where: { id: { in: tagIds } } })

  revalidatePath("/dashboard")
  revalidatePath("/library")
  revalidatePath("/tags")

  return { success: true }
}