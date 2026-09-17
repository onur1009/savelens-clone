import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardClient } from "./dashboard-client"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/auth/login")

  const userId = (session.user as any).id

  const [stats, recentSaves, collections, tags] = await Promise.all([
    prisma.save.groupBy({
      by: ["processingStatus"],
      where: { userId, isArchived: false },
      _count: true,
    }),
    prisma.save.findMany({
      where: { userId, isArchived: false },
      include: {
        tags: { include: { tag: true } },
        collections: { include: { collection: true } },
        summary: true,
        smartExtracts: true,
      },
      orderBy: { savedAt: "desc" },
      take: 8,
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
      take: 20,
    }),
  ])

  const totalSaves = stats.reduce((sum, s) => sum + s._count, 0)
  const processedSaves = stats.find((s) => s.processingStatus === "COMPLETED")?._count || 0
  const pendingSaves = stats.find((s) => s.processingStatus === "PROCESSING")?._count || 0
  const failedSaves = stats.find((s) => s.processingStatus === "FAILED")?._count || 0

  return (
    <DashboardClient
      initialStats={{
        totalSaves,
        processedSaves,
        pendingSaves,
        failedSaves,
        totalCollections: collections.length,
        totalTags: tags.length,
      }}
      initialSaves={recentSaves}
      initialCollections={collections}
      initialTags={tags}
      user={session.user}
    />
  )
}