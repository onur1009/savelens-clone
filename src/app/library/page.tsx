import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { LibraryClient } from "./library-client"

export default async function LibraryPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/auth/login")

  const userId = (session.user as any).id

  const [saves, collections, tags, smartShelves] = await Promise.all([
    prisma.save.findMany({
      where: { userId, isArchived: false },
      include: {
        tags: { include: { tag: true } },
        collections: { include: { collection: true } },
        summary: true,
        smartExtracts: true,
        transcript: true,
      },
      orderBy: { savedAt: "desc" },
    }),
    prisma.collection.findMany({
      where: { userId },
      include: { _count: { select: { saves: true } } },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.tag.findMany({
      where: { userId },
      include: { _count: { select: { saves: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.smartShelf.findMany({
      where: { userId, isActive: true },
      include: { collection: true },
      orderBy: { createdAt: "desc" },
    }),
  ])

  return (
    <LibraryClient
      initialSaves={saves}
      initialCollections={collections}
      initialTags={tags}
      initialSmartShelves={smartShelves}
      user={session.user}
    />
  )
}