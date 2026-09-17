"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { extractMetadata } from "@/lib/metadata"
import { generateSummary, generateTags, extractSmartData, generateEmbedding } from "@/lib/ai"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const saveSchema = z.object({
  url: z.string().url("Geçerli bir URL girin"),
  collectionId: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export async function createSave(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: "Oturum açmanız gerekiyor" }
  }

  const userId = (session.user as any).id
  const url = formData.get("url") as string
  const collectionId = formData.get("collectionId") as string | null
  const tagNames = formData.getAll("tags") as string[]

  const validation = saveSchema.safeParse({ url, collectionId, tags: tagNames })
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message }
  }

  try {
    const existingSave = await prisma.save.findFirst({
      where: { userId, url },
    })

    if (existingSave) {
      return { success: false, error: "Bu URL zaten kaydedilmiş", saveId: existingSave.id }
    }

    const metadata = await extractMetadata(url)
    
    const save = await prisma.save.create({
      data: {
        userId,
        url,
        title: metadata.title,
        description: metadata.description,
        thumbnailUrl: metadata.thumbnailUrl,
        platform: metadata.platform as any,
        platformId: metadata.platformId,
        authorName: metadata.authorName,
        authorUrl: metadata.authorUrl,
        authorAvatar: metadata.authorAvatar,
        duration: metadata.duration,
        viewCount: metadata.viewCount,
        likeCount: metadata.likeCount,
        commentCount: metadata.commentCount,
        publishedAt: metadata.publishedAt,
        contentType: (metadata.contentType as any) || "VIDEO",
        language: metadata.language,
        metadata: metadata.rawMetadata,
        processingStatus: "PROCESSING",
      },
    })

    if (collectionId) {
      await prisma.collectionSave.create({
        data: { collectionId, saveId: save.id },
      })
    } else {
      const defaultCollection = await prisma.collection.findFirst({
        where: { userId, sortOrder: 0 },
      })
      if (defaultCollection) {
        await prisma.collectionSave.create({
          data: { collectionId: defaultCollection.id, saveId: save.id },
        })
      }
    }

    for (const tagName of tagNames) {
      let tag = await prisma.tag.findFirst({ where: { userId, name: tagName } })
      if (!tag) {
        tag = await prisma.tag.create({ data: { userId, name: tagName } })
      }
      await prisma.saveTag.create({ data: { saveId: save.id, tagId: tag.id } })
    }

    processSaveAsync(save.id, url, userId)

    revalidatePath("/dashboard")
    revalidatePath("/library")

    return { success: true, saveId: save.id }
  } catch (error) {
    console.error("Save creation error:", error)
    return { success: false, error: "Kayıt oluşturulurken bir hata oluştu" }
  }
}

async function processSaveAsync(saveId: string, url: string, userId: string) {
  try {
    const save = await prisma.save.findUnique({ where: { id: saveId } })
    if (!save) return

    const contentParts = [
      save.title,
      save.description,
      save.authorName,
    ].filter(Boolean).join(" ")

    const [summaryResult, tagSuggestions, smartExtracts] = await Promise.allSettled([
      generateSummary(contentParts),
      generateTags(contentParts),
      extractSmartData(contentParts, save.platform),
    ])

    const updateData: any = { processingStatus: "COMPLETED", processedAt: new Date() }

    if (summaryResult.status === "fulfilled") {
      const s = summaryResult.value
      await prisma.summary.create({
        data: {
          saveId,
          shortSummary: s.shortSummary,
          detailedSummary: s.detailedSummary,
          keyPoints: s.keyPoints,
          topics: s.topics,
          sentiment: s.sentiment,
          readingTime: s.readingTime,
        },
      })
    }

    if (tagSuggestions.status === "fulfilled") {
      for (const tagName of tagSuggestions.value) {
        let tag = await prisma.tag.findFirst({ where: { userId, name: tagName } })
        if (!tag) {
          tag = await prisma.tag.create({ data: { userId, name: tagName } })
        }
        await prisma.saveTag.create({ 
          data: { saveId, tagId: tag.id },
          // @ts-ignore - ignore unique constraint error
        }).catch(() => {})
      }
    }

    if (smartExtracts.status === "fulfilled") {
      for (const extract of smartExtracts.value) {
        await prisma.smartExtract.create({
          data: {
            saveId,
            type: extract.type as any,
            title: extract.title,
            data: extract.data,
            confidence: extract.confidence,
          },
        })
      }
    }

    await prisma.save.update({ where: { id: saveId }, data: updateData })
  } catch (error) {
    console.error("Async processing error:", error)
    await prisma.save.update({
      where: { id: saveId },
      data: { processingStatus: "FAILED", processingError: String(error) },
    })
  }
}

export async function getSaves(filters: {
  query?: string
  platform?: string[]
  tags?: string[]
  collections?: string[]
  contentType?: string[]
  isFavorite?: boolean
  isArchived?: boolean
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
} = {}) {
  const session = await auth()
  if (!session?.user) return { saves: [], total: 0 }

  const userId = (session.user as any).id
  const page = filters.page || 1
  const limit = filters.limit || 20
  const skip = (page - 1) * limit

  const where: any = { userId, isArchived: filters.isArchived ?? false }

  if (filters.isFavorite) where.isFavorite = true
  if (filters.platform?.length) where.platform = { in: filters.platform }
  if (filters.contentType?.length) where.contentType = { in: filters.contentType }
  if (filters.tags?.length) {
    where.tags = { some: { tag: { name: { in: filters.tags } } } }
  }
  if (filters.collections?.length) {
    where.collections = { some: { collectionId: { in: filters.collections } } }
  }
  if (filters.query) {
    where.OR = [
      { title: { contains: filters.query, mode: "insensitive" } },
      { description: { contains: filters.query, mode: "insensitive" } },
      { url: { contains: filters.query, mode: "insensitive" } },
    ]
  }

  const [saves, total] = await Promise.all([
    prisma.save.findMany({
      where,
      include: {
        tags: { include: { tag: true } },
        collections: { include: { collection: true } },
        transcript: true,
        summary: true,
        smartExtracts: true,
      },
      orderBy: { [filters.sortBy || "savedAt"]: filters.sortOrder || "desc" },
      skip,
      take: limit,
    }),
    prisma.save.count({ where }),
  ])

  return { saves, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getSaveById(id: string) {
  const session = await auth()
  if (!session?.user) return null

  const userId = (session.user as any).id
  return prisma.save.findFirst({
    where: { id, userId },
    include: {
      tags: { include: { tag: true } },
      collections: { include: { collection: true } },
      transcript: true,
      summary: true,
      smartExtracts: true,
    },
  })
}

export async function toggleFavorite(saveId: string) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Oturum açmanız gerekiyor" }

  const userId = (session.user as any).id
  const save = await prisma.save.findFirst({ where: { id: saveId, userId } })
  if (!save) return { success: false, error: "Kayıt bulunamadı" }

  const updated = await prisma.save.update({
    where: { id: saveId },
    data: { isFavorite: !save.isFavorite },
  })

  revalidatePath("/dashboard")
  revalidatePath("/library")
  revalidatePath(`/save/${saveId}`)

  return { success: true, isFavorite: updated.isFavorite }
}

export async function toggleArchive(saveId: string) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Oturum açmanız gerekiyor" }

  const userId = (session.user as any).id
  const save = await prisma.save.findFirst({ where: { id: saveId, userId } })
  if (!save) return { success: false, error: "Kayıt bulunamadı" }

  const updated = await prisma.save.update({
    where: { id: saveId },
    data: { isArchived: !save.isArchived },
  })

  revalidatePath("/dashboard")
  revalidatePath("/library")

  return { success: true, isArchived: updated.isArchived }
}

export async function deleteSave(saveId: string) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Oturum açmanız gerekiyor" }

  const userId = (session.user as any).id
  const save = await prisma.save.findFirst({ where: { id: saveId, userId } })
  if (!save) return { success: false, error: "Kayıt bulunamadı" }

  await prisma.save.delete({ where: { id: saveId } })

  revalidatePath("/dashboard")
  revalidatePath("/library")

  return { success: true }
}

export async function updateSaveTags(saveId: string, tagNames: string[]) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Oturum açmanız gerekiyor" }

  const userId = (session.user as any).id
  const save = await prisma.save.findFirst({ where: { id: saveId, userId } })
  if (!save) return { success: false, error: "Kayıt bulunamadı" }

  await prisma.saveTag.deleteMany({ where: { saveId } })

  for (const tagName of tagNames) {
    let tag = await prisma.tag.findFirst({ where: { userId, name: tagName } })
    if (!tag) {
      tag = await prisma.tag.create({ data: { userId, name: tagName } })
    }
    await prisma.saveTag.create({ data: { saveId, tagId: tag.id } })
  }

  revalidatePath("/dashboard")
  revalidatePath("/library")
  revalidatePath(`/save/${saveId}`)

  return { success: true }
}

export async function addToCollection(saveId: string, collectionId: string) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Oturum açmanız gerekiyor" }

  const userId = (session.user as any).id
  const save = await prisma.save.findFirst({ where: { id: saveId, userId } })
  const collection = await prisma.collection.findFirst({ where: { id: collectionId, userId } })
  
  if (!save || !collection) return { success: false, error: "Kayıt veya koleksiyon bulunamadı" }

  await prisma.collectionSave.create({
    data: { saveId, collectionId },
  }).catch(() => {})

  revalidatePath("/dashboard")
  revalidatePath("/library")
  revalidatePath(`/save/${saveId}`)

  return { success: true }
}

export async function removeFromCollection(saveId: string, collectionId: string) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Oturum açmanız gerekiyor" }

  await prisma.collectionSave.deleteMany({
    where: { saveId, collectionId },
  })

  revalidatePath("/dashboard")
  revalidatePath("/library")
  revalidatePath(`/save/${saveId}`)

  return { success: true }
}