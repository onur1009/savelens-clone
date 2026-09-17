import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateSummary(content: string, language = "tr"): Promise<{
  shortSummary: string
  detailedSummary: string
  keyPoints: string[]
  topics: string[]
  sentiment: string
  readingTime: number
}> {
  const prompt = `
Aşağıdaki içeriği analiz et ve şu JSON formatında yanıt ver:
{
  "shortSummary": "2-3 cümlelik kısa özet",
  "detailedSummary": "Detaylı özet (paragraf)",
  "keyPoints": ["anahtar nokta 1", "anahtar nokta 2", "anahtar nokta 3"],
  "topics": ["konu 1", "konu 2", "konu 3"],
  "sentiment": "positive/negative/neutral",
  "readingTime": 5
}

İçerik: ${content.slice(0, 8000)}
Dil: ${language}
`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Sen bir içerik analisti ve özetleme uzmanısın. Her zaman geçerli JSON döndür." },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  })

  const result = JSON.parse(response.choices[0].message.content || "{}")
  return result
}

export async function generateTags(content: string, existingTags: string[] = []): Promise<string[]> {
  const prompt = `
İçeriğe dayanarak en fazla 8 ilgili etiket öner. Mevcut etiketler: ${existingTags.join(", ")}
Yalnızca etiket adlarını içeren bir JSON dizi döndür: ["etiket1", "etiket2", ...]

İçerik: ${content.slice(0, 4000)}
`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Sen bir etiketleme uzmanısın. Kısa, spesifik etiketler öner." },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  })

  const result = JSON.parse(response.choices[0].message.content || "[]")
  return Array.isArray(result) ? result : (result.tags || [])
}

export async function extractSmartData(content: string, platform: string): Promise<Array<{
  type: string
  title: string
  data: any
  confidence: number
}>> {
  const prompt = `
İçerikten yapılandırılmış veri çıkar. Şu türleri ara:
- RECIPE (tarif: malzemeler, adımlar, süreler)
- PLACE (yer: isim, adres, koordinatlar, tür)
- WORKOUT (antreman: egzersizler, setler, tekrarlar)
- PRODUCT (ürün: isim, fiyat, marka, link)
- DISCOUNT_CODE (indirim kodu: kod, geçerlilik, detaylar)
- CONTACT_INFO (iletişim: telefon, email, web, adres)
- EVENT (etkinlik: isim, tarih, yer, detaylar)
- TUTORIAL_STEPS (eğitim adımları)
- SHOPPING_LIST (alışveriş listesi)
- TRAVEL_ITINERARY (seyahat planı)

JSON formatında döndür:
[
  {"type": "RECIPE", "title": "Köfte Tarifi", "data": {...}, "confidence": 0.95}
]

İçerik: ${content.slice(0, 6000)}
Platform: ${platform}
`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Sen yapılandırılmış veri çıkarma uzmanısın. Yüksek güvenilirlikte JSON döndür." },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
    response_format: { type: "json_object" },
  })

  const result = JSON.parse(response.choices[0].message.content || "[]")
  return Array.isArray(result) ? result : (result.extracts || [])
}

export async function chatWithLibrary(
  userMessage: string,
  context: string,
  history: Array<{ role: string; content: string }> = []
): Promise<string> {
  const messages = [
    {
      role: "system",
      content: `Sen kullanıcının kişisel içerik kütüphanesine erişimi olan bir AI asistanısın. 
Kullanıcının kaydettiği içerikler hakkında soruları yanıla, bağlantılar kur, özetle ve içgörüler sun.
Kullanıcının kütüphane bağlamı:
${context}

Kurallar:
- Sadece sağlanan bağlamı kullan
- Cevaplayamazsan "Bu konuda kaydettiğiniz içerikte bilgi bulamadım" de
- Türkçe yanıt ver
- Kaynak belirt (hangi kayıttan geldiği)
- Pratik, eyleme geçirilebilir cevaplar ver`,
    },
    ...history.slice(-10).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user", content: userMessage },
  ]

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    temperature: 0.4,
    max_tokens: 2000,
  })

  return response.choices[0].message.content || "Üzgünüm, bir hata oluştu."
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 8000),
  })
  return response.data[0].embedding
}

export async function transcribeAudio(audioUrl: string): Promise<{
  text: string
  segments: Array<{ start: number; end: number; text: string }>
  language: string
}> {
  // This would use Whisper API or similar
  // For now, return mock structure
  return {
    text: "",
    segments: [],
    language: "tr",
  }
}