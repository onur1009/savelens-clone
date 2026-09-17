import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

async function main() {
  console.log("🌱 Seeding database...")

  // Create demo user
  const demoEmail = "demo@savelens.app"
  const demoPassword = await hashPassword("demo123456")

  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      email: demoEmail,
      name: "Demo Kullanıcı",
      password: demoPassword,
      role: "USER",
    },
  })

  console.log("✅ Demo user created:", demoUser.email)

  // Create default collection
  const defaultCollection = await prisma.collection.upsert({
    where: {
      id: "default-collection",
    },
    update: {},
    create: {
      id: "default-collection",
      userId: demoUser.id,
      name: "Tümü",
      description: "Tüm kayıtlarınız",
      color: "#0ea5e9",
      icon: "grid",
      sortOrder: 0,
    },
  })

  // Create sample collections
  const collections = await Promise.all([
    prisma.collection.upsert({
      where: { id: "collection-inspiration" },
      update: {},
      create: {
        id: "collection-inspiration",
        userId: demoUser.id,
        name: "İlham Verici",
        description: "Yaratıcı içerikler ve referanslar",
        color: "#d946ef",
        icon: "sparkles",
        sortOrder: 1,
      },
    }),
    prisma.collection.upsert({
      where: { id: "collection-recipes" },
      update: {},
      create: {
        id: "collection-recipes",
        userId: demoUser.id,
        name: "Tarifler",
        description: "Yemek tarifleri ve mutfak notları",
        color: "#22c55e",
        icon: "utensils",
        sortOrder: 2,
      },
    }),
    prisma.collection.upsert({
      where: { id: "collection-places" },
      update: {},
      create: {
        id: "collection-places",
        userId: demoUser.id,
        name: "Mekanlar",
        description: "Ziyaret etmek istediğim yerler",
        color: "#f59e0b",
        icon: "map-pin",
        sortOrder: 3,
      },
    }),
    prisma.collection.upsert({
      where: { id: "collection-learning" },
      update: {},
      create: {
        id: "collection-learning",
        userId: demoUser.id,
        name: "Öğrenme",
        description: "Eğitim videoları ve kurslar",
        color: "#3b82f6",
        icon: "book-open",
        sortOrder: 4,
      },
    }),
  ])

  console.log("✅ Collections created")

  // Create sample tags
  const sampleTags = [
    { name: "ilham", color: "#d946ef" },
    { name: "tarif", color: "#22c55e" },
    { name: "seyahat", color: "#f59e0b" },
    { name: "kodlama", color: "#3b82f6" },
    { name: "tasarim", color: "#ec4899" },
    { name: "verimlilik", color: "#14b8a6" },
    { name: "egitim", color: "#6366f1" },
    { name: "eglence", color: "#f97316" },
  ]

  for (const tag of sampleTags) {
    await prisma.tag.upsert({
      where: {
        userId_name: {
          userId: demoUser.id,
          name: tag.name,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        name: tag.name,
        color: tag.color,
      },
    })
  }

  console.log("✅ Tags created")

  // Create sample smart shelves
  await prisma.smartShelf.upsert({
    where: { id: "shelf-recipes" },
    update: {},
    create: {
      id: "shelf-recipes",
      userId: demoUser.id,
      name: "Tüm Tarifler",
      query: "tarif",
      description: "Kayıtlı tüm yemek tarifleri",
      color: "#22c55e",
      icon: "utensils",
    },
  })

  await prisma.smartShelf.upsert({
    where: { id: "shelf-places" },
    update: {},
    create: {
      id: "shelf-places",
      userId: demoUser.id,
      name: "İstanbul Mekanları",
      query: "İstanbul",
      description: "İstanbul ile ilgili kayıtlar",
      color: "#f59e0b",
      icon: "map-pin",
    },
  })

  await prisma.smartShelf.upsert({
    where: { id: "shelf-coding" },
    update: {},
    create: {
      id: "shelf-coding",
      userId: demoUser.id,
      name: "Kodlama Eğitimleri",
      query: "kodlama OR programlama OR tutorial",
      description: "Programlama ve yazılım geliştirme içerikleri",
      color: "#3b82f6",
      icon: "code",
    },
  })

  console.log("✅ Smart shelves created")

  // Create sample saves
  const sampleSaves = [
    {
      url: "https://www.instagram.com/reel/example1/",
      title: "Mükemmel Kroasan Tarifi",
      description: "Fransız usulü kroasan yapımı - adım adım",
      thumbnailUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400",
      platform: "INSTAGRAM",
      platformId: "example1",
      authorName: "Le Cordon Bleu",
      authorUrl: "https://instagram.com/lecordonbleu",
      contentType: "VIDEO",
      processingStatus: "COMPLETED",
      tags: ["tarif", "ilham"],
      collections: ["collection-recipes", "collection-inspiration"],
      summary: {
        shortSummary: "Fransız usulü kroasan yapımının püf noktaları ve adım adım tarif.",
        detailedSummary: "Bu videoda Le Cordon Bleu şefi, klasik Fransız kroasanı yapmanın tüm püf noktalarını anlatıyor. Hamurun dinlenme süreleri, tereyağı katlama tekniği ve fırınlama sıcaklıkları detaylıca açıklanıyor.",
        keyPoints: JSON.stringify(["Soğuk malzemeler kullanın", "Tereyağı katlaması 3 tur olmalı", "Hamur her katlamadan sonra 30 dk dinlenmeli", "Fırın 200°C olmalı"]),
        topics: JSON.stringify(["Fransız mutfağı", "Hamur işleri", "Kahvaltı"]),
        sentiment: "positive",
        readingTime: 3,
      },
      smartExtracts: [
        {
          type: "RECIPE",
          title: "Kroasan Tarifi",
          data: JSON.stringify({
            title: "Klasik Fransız Kroasanı",
            ingredients: [
              "500g un (T55)",
              "250ml su",
              "10g tuz",
              "50g şeker",
              "10g maya",
              "280g tereyağı (katlama için)",
              "1 yumurta (üzerine sürmek için)",
            ],
            steps: [
              "Tüm hamur malzemelerini karıştırıp 10 dk yoğurun",
              "Hamuru 1 saat buzdolabında dinlendirin",
              "Tereyağını kare şeklinde düzeltip soğutun",
              "Hamuru açıp tereyağını ortasına koyun ve kapatın",
              "3 kere katlayın, her seferinde 30 dk buzdolabında dinlendirin",
              "Hamuru 3-4mm kalınlığında açıp üçgenler kesin",
              "Üçgenleri rulo edip tepsiye yerleştirin",
              "1.5-2 saat mayalanmaya bırakın",
              "Yumurta ile sürün, 200°C fırında 15-18 dk pişirin",
            ],
            prepTime: 30,
            cookTime: 20,
            servings: 12,
            cuisine: "Fransız",
            dietTags: ["vejetaryen"],
          }),
          confidence: 0.95,
        },
      ],
    },
    {
      url: "https://www.tiktok.com/@traveler/video/example2",
      title: "İstanbul'un Gizli Bahçesi: Yıldız Parkı",
      description: "Bosporus manzaralı, az bilinen harika bir park",
      thumbnailUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
      platform: "TIKTOK",
      platformId: "example2",
      authorName: "İstanbul Gezgini",
      authorUrl: "https://tiktok.com/@istanbulgezgini",
      contentType: "VIDEO",
      processingStatus: "COMPLETED",
      tags: ["seyahat", "istanbul", "ilham"],
      collections: ["collection-places", "collection-inspiration"],
      summary: {
        shortSummary: "İstanbul'un Beşiktaş ilçesinde bulunan Yıldız Parkı'nın güzellikleri ve erişim bilgileri.",
        detailedSummary: "Yıldız Parkı, Bosporus'un eşsiz manzarasına sahip, tarihî çınar ağaçları ve yürüyüş yollarıyla İstanbul'un en güzel parklarından biridir. Çırağan Sarayı'nın hemen arkasında yer alır.",
        keyPoints: JSON.stringify(["Bosporus manzarası", "Tarihî çınar ağaçları", "Yürüyüş/piknik alanları", "Ücretsiz giriş"]),
        topics: JSON.stringify(["İstanbul", "Park", "Doğa", "Seyahat"]),
        sentiment: "positive",
        readingTime: 2,
      },
      smartExtracts: [
        {
          type: "PLACE",
          title: "Yıldız Parkı",
          data: JSON.stringify({
            name: "Yıldız Parkı",
            address: "Yıldız Mahallesi, Çırağan Cd. No:57, 34349 Beşiktaş/İstanbul",
            latitude: 41.0515,
            longitude: 29.0142,
            placeType: "park",
            rating: 4.7,
            priceLevel: 0,
            phone: "+90 212 227 39 49",
            website: "https://www.ibb.istanbul/yildiz-parki",
            hours: {
              "Pazartesi": "07:00 - 22:00",
              "Salı": "07:00 - 22:00",
              "Çarşamba": "07:00 - 22:00",
              "Perşembe": "07:00 - 22:00",
              "Cuma": "07:00 - 22:00",
              "Cumartesi": "07:00 - 22:00",
              "Pazar": "07:00 - 22:00",
            },
          }),
          confidence: 0.92,
        },
      ],
    },
    {
      url: "https://www.youtube.com/watch?v=example3",
      title: "React 18 ve Server Components Derinlemesine",
      description: "Next.js 14 ile modern React patterns",
      thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
      platform: "YOUTUBE",
      platformId: "example3",
      authorName: "Web Dev Simplified",
      authorUrl: "https://youtube.com/@webdevsimplified",
      duration: 1847,
      viewCount: 125000,
      likeCount: 4500,
      commentCount: 320,
      publishedAt: new Date("2024-01-15").toISOString(),
      contentType: "VIDEO",
      processingStatus: "COMPLETED",
      tags: ["kodlama", "react", "egitim"],
      collections: ["collection-learning"],
      summary: {
        shortSummary: "React 18'in yeni özellikleri, Server Components ve Next.js 14 App Router kullanımı.",
        detailedSummary: "Bu kapsamlı eğitimde React 18 ile gelen concurrent features, useTransition, useDeferredValue ve Server Components mimarisi detaylıca anlatılıyor. Next.js 14 App Router ile routing, layouts ve data fetching patternleri gösteriliyor.",
        keyPoints: JSON.stringify(["Server Components varsayılan", "use client directive ile client component", "Streaming SSR ile hızlı yüklenme", "Suspense boundaries ile loading states"]),
        topics: JSON.stringify(["React", "Next.js", "Frontend", "Web Development"]),
        sentiment: "positive",
        readingTime: 8,
      },
      smartExtracts: [
        {
          type: "TUTORIAL_STEPS",
          title: "Next.js 14 App Router Kurulumu",
          data: JSON.stringify({
            title: "Next.js 14 ile Modern React Uygulaması",
            steps: [
              { step: 1, title: "Proje Oluşturma", description: "npx create-next-app@latest ile yeni proje", duration: 5 },
              { step: 2, title: "App Router Yapısı", description: "app/ klasörü ve layout/page dosyaları", duration: 10 },
              { step: 3, title: "Server Components", description: "Varsayılan server component kullanımı", duration: 15 },
              { step: 4, title: "Client Components", description: "'use client' ile interaktif bileşenler", duration: 12 },
              { step: 5, title: "Data Fetching", description: "async/await ile server-side veri çekme", duration: 8 },
              { step: 6, title: "Streaming & Suspense", description: "Yavaş yüklenen kısımlar için streaming", duration: 10 },
            ],
            estimatedTime: 60,
            difficulty: "Orta",
            tools: ["Node.js 18+", "Next.js 14", "TypeScript", "Tailwind CSS"],
          }),
          confidence: 0.88,
        },
      ],
    },
    {
      url: "https://www.linkedin.com/posts/example4",
      title: "Verimlilik İçin 5 Kural",
      description: "Derin çalışma ve odaklanma teknikleri",
      thumbnailUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400",
      platform: "LINKEDIN",
      platformId: "example4",
      authorName: "Ali Yılmaz",
      authorUrl: "https://linkedin.com/in/aliyilmaz",
      contentType: "POST",
      processingStatus: "COMPLETED",
      tags: ["verimlilik", "ilham", "egitim"],
      collections: ["collection-inspiration", "collection-learning"],
      summary: {
        shortSummary: "Derin çalışma prensipleri ve günlük verimliliği artırmak için 5 uygulanabilir kural.",
        detailedSummary: "Bu LinkedIn gönderisinde, bilgisayar bilimleri profesörü Cal Newport'un 'Deep Work' kitabından esinlenerek, dikkat dağınıklığı çağında odaklanmayı sürdürmek için 5 somut strateji paylaşıldı.",
        keyPoints: JSON.stringify(["Zaman bloklama (time-blocking)", "Tek görev odaklılığı", "Dijital minimalizm", "Dinlenme ritüelleri", "Ortam tasarımı"]),
        topics: JSON.stringify(["Verimlilik", "Kişisel Gelişim", "Odaklanma", "Zaman Yönetimi"]),
        sentiment: "positive",
        readingTime: 4,
      },
      smartExtracts: [
        {
          type: "TUTORIAL_STEPS",
          title: "Derin Çalışma Rutini",
          data: JSON.stringify({
            title: "Günlük Verimlilik Sistemi",
            steps: [
              { step: 1, title: "Akşam Öncesi Planlama", description: "Yarın için en önemli 3 görevı belirle", duration: 10 },
              { step: 2, title: "Sabah Derin Çalışma Blok", description: "İlk 3-4 saati en zor görev için ayır", duration: 180 },
              { step: 3, title: "Dijital Detoks", description: "Bildirimleri kapat, telefonu başka odada bırak", duration: 5 },
              { step: 4, title: "Pomodoro Tekniği", description: "25 dk çalışma / 5 dk mola döngüsü", duration: 120 },
              { step: 5, title: "Gün Sonu Değerlendirme", description: "Ne yapıldı, ne ertelenedi, yarın için not al", duration: 10 },
            ],
            estimatedTime: 325,
            difficulty: "Başlangıç",
            tools: ["Takvim uygulaması", "Pomodoro zamanlayıcı", "Not defteri"],
          }),
          confidence: 0.9,
        },
      ],
    },
  ]

  for (const saveData of sampleSaves) {
    const { tags: tagNames, collections: collectionIds, summary, smartExtracts, ...saveFields } = saveData

    const existingSave = await prisma.save.findFirst({
      where: { userId: demoUser.id, url: saveFields.url },
    })

    if (existingSave) continue

    const save = await prisma.save.create({
      data: {
        ...saveFields,
        userId: demoUser.id,
        publishedAt: saveFields.publishedAt ? new Date(saveFields.publishedAt) : new Date(),
        processedAt: new Date(),
        metadata: "{}",
      },
    })

    // Add tags
    for (const tagName of tagNames) {
      const tag = await prisma.tag.findFirst({ where: { userId: demoUser.id, name: tagName } })
      if (tag) {
        await prisma.saveTag.create({ data: { saveId: save.id, tagId: tag.id } }).catch(() => {})
      }
    }

    // Add to collections
    for (const collectionId of collectionIds) {
      await prisma.collectionSave.create({ data: { saveId: save.id, collectionId } }).catch(() => {})
    }

    // Add summary
    if (summary) {
      await prisma.summary.create({ data: { saveId: save.id, ...summary } })
    }

    // Add smart extracts
    for (const extract of smartExtracts) {
      await prisma.smartExtract.create({ data: { saveId: save.id, ...extract } })
    }
  }

  console.log("✅ Sample saves created")

  // Create user settings
  await prisma.userSettings.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      theme: "SYSTEM",
      language: "tr",
      emailNotifications: true,
      weeklyDigest: false,
      autoTagging: true,
      autoTranscription: true,
      defaultCollectionId: defaultCollection.id,
    },
  })

  console.log("✅ User settings created")

  console.log("🎉 Seeding completed!")
  console.log("")
  console.log("Demo hesabı:")
  console.log("  Email: demo@savelens.app")
  console.log("  Şifre: demo123456")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })