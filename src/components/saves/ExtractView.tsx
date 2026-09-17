"use client"

import { MapPin, ShoppingBag, Clock, Tag, Heart, BookOpen, Calendar, Dumbbell, Utensils, Contact, Ticket, List, Plane } from "lucide-react"
import { SmartExtract, ExtractType } from "@/types"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

const extractIcons: Record<ExtractType, React.ReactNode> = {
  RECIPE: <Utensils className="h-5 w-5" />,
  PLACE: <MapPin className="h-5 w-5" />,
  WORKOUT: <Dumbbell className="h-5 w-5" />,
  PRODUCT: <ShoppingBag className="h-5 w-5" />,
  DISCOUNT_CODE: <Tag className="h-5 w-5" />,
  CONTACT_INFO: <Contact className="h-5 w-5" />,
  EVENT: <Ticket className="h-5 w-5" />,
  TUTORIAL_STEPS: <BookOpen className="h-5 w-5" />,
  SHOPPING_LIST: <List className="h-5 w-5" />,
  TRAVEL_ITINERARY: <Plane className="h-5 w-5" />,
}

const extractLabels: Record<ExtractType, string> = {
  RECIPE: "Tarif",
  PLACE: "Yer",
  WORKOUT: "Antrenman",
  PRODUCT: "Ürün",
  DISCOUNT_CODE: "İndirim Kodu",
  CONTACT_INFO: "İletişim",
  EVENT: "Etkinlik",
  TUTORIAL_STEPS: "Eğitim",
  SHOPPING_LIST: "Alışveriş",
  TRAVEL_ITINERARY: "Seyahat",
}

interface ExtractViewProps {
  extracts: SmartExtract[]
}

export function ExtractView({ extracts }: ExtractViewProps) {
  return (
    <div className="space-y-4">
      {extracts.map((extract) => {
        const Icon = extractIcons[extract.type as ExtractType]
        const label = extractLabels[extract.type as ExtractType]
        const data = extract.data as any

        return (
          <Card key={extract.id} variant="outlined" className="overflow-hidden">
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0", "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400")}>
                  {Icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" size="sm">{label}</Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Güven: %{Math.round(extract.confidence * 100)}</span>
                  </div>
                  <h4 className="mt-1 font-medium text-gray-900 dark:text-gray-100">{extract.title}</h4>
                </div>
              </div>

              <div className="mt-4">{renderExtractData(extract.type as ExtractType, data)}</div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function renderExtractData(type: ExtractType, data: any) {
  if (!data) return null

  switch (type) {
    case "RECIPE":
      return (
        <div className="space-y-3">
          {data.ingredients?.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" /> Malzemeler
              </h5>
              <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-300">
                {data.ingredients.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {data.steps?.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Adımlar
              </h5>
              <ol className="space-y-2 list-decimal list-inside text-gray-600 dark:text-gray-300">
                {data.steps.map((step: string, i: number) => (
                  <li key={i} className="whitespace-pre-wrap">{step}</li>
                ))}
              </ol>
            </div>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            {data.prepTime && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Hazırlık: {data.prepTime} dk</span>}
            {data.cookTime && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Pişirme: {data.cookTime} dk</span>}
            {data.servings && <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {data.servings} kişilik</span>}
            {data.cuisine && <span className="flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> {data.cuisine}</span>}
            {data.dietTags?.length > 0 && <span className="flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> {data.dietTags.join(", ")}</span>}
          </div>
        </div>
      )

    case "PLACE":
      return (
        <div className="space-y-2">
          {data.address && (
            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{data.address}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <a href={`tel:${data.phone}`} className="hover:text-primary-600 dark:hover:text-primary-400">{data.phone}</a>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              <a href={data.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400 truncate max-w-[200px] block">{data.website}</a>
            </div>
          )}
          {data.rating && (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                {data.rating}
              </span>
              {data.priceLevel && (
                <span className="text-yellow-500">{"$".repeat(data.priceLevel)}</span>
              )}
            </div>
          )}
          {data.hours && (
            <details className="mt-2">
              <summary className="font-medium text-gray-900 dark:text-gray-100 cursor-pointer">Çalışma Saatleri</summary>
              <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                {Object.entries(data.hours).map(([day, hours]) => (
                  <li key={day}><strong>{day}:</strong> {hours as string}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )

    case "WORKOUT":
      return (
        <div className="space-y-3">
          {data.exercises?.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Egzersizler</h5>
              <div className="space-y-2">
                {data.exercises.map((ex: any, i: number) => (
                  <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{ex.name}</div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {ex.sets && <span><strong>Set:</strong> {ex.sets}</span>}
                      {ex.reps && <span><strong>Tekrar:</strong> {ex.reps}</span>}
                      {ex.weight && <span><strong>Ağırlık:</strong> {ex.weight}</span>}
                      {ex.duration && <span><strong>Süre:</strong> {ex.duration} sn</span>}
                      {ex.rest && <span><strong>Dinlenme:</strong> {ex.rest} sn</span>}
                    </div>
                    {ex.notes && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{ex.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            {data.totalDuration && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Toplam: {data.totalDuration} dk</span>}
            {data.difficulty && <span><strong>Zorluk:</strong> {data.difficulty}</span>}
            {data.targetMuscles?.length > 0 && <span><strong>Kas Grubu:</strong> {data.targetMuscles.join(", ")}</span>}
          </div>
        </div>
      )

    case "PRODUCT":
      return (
        <div className="space-y-2">
          {data.brand && <div className="text-sm text-gray-500 dark:text-gray-400">Marka: <span className="font-medium text-gray-900 dark:text-gray-100">{data.brand}</span></div>}
          {data.price && (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data.price} {data.currency || "₺"}</span>
              {data.rating && (
                <span className="flex items-center gap-1">
                  <svg className="h-5 w-5 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  {data.rating}
                </span>
              )}
            </div>
          )}
          {data.description && <p className="text-gray-600 dark:text-gray-300">{data.description}</p>}
          {data.url && (
            <Button variant="primary" size="sm" asChild>
              <a href={data.url} target="_blank" rel="noopener noreferrer">Ürünü Görüntüle</a>
            </Button>
          )}
        </div>
      )

    case "DISCOUNT_CODE":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <code className="text-xl font-mono font-bold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 px-3 py-1 rounded">{data.code}</code>
            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(data.code)}>Kopyala</Button>
          </div>
          {data.discount && <p><strong>İndirim:</strong> {data.discount}</p>}
          {data.validUntil && <p className="text-sm text-gray-500 dark:text-gray-400"><strong>Geçerlilik:</strong> {data.validUntil}</p>}
          {data.terms && <p className="text-sm text-gray-600 dark:text-gray-300">{data.terms}</p>}
          {data.brand && <p className="text-sm text-gray-500 dark:text-gray-400"><strong>Marka:</strong> {data.brand}</p>}
          {data.url && (
            <Button variant="primary" size="sm" asChild>
              <a href={data.url} target="_blank" rel="noopener noreferrer">Kullan</a>
            </Button>
          )}
        </div>
      )

    case "CONTACT_INFO":
      return (
        <div className="space-y-2">
          {data.name && <p><strong>İsim:</strong> {data.name}</p>}
          {data.phone && <p className="flex items-center gap-2"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> <a href={`tel:${data.phone}`}>{data.phone}</a></p>}
          {data.email && <p className="flex items-center gap-2"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> <a href={`mailto:${data.email}`}>{data.email}</a></p>}
          {data.website && <p className="flex items-center gap-2"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg> <a href={data.website} target="_blank" rel="noopener noreferrer">{data.website}</a></p>}
          {data.address && <p className="flex items-start gap-2"><MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" /> {data.address}</p>}
          {data.socialLinks && (
            <div className="flex gap-2 mt-2">
              {Object.entries(data.socialLinks).map(([platform, url]) => (
                <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-600 dark:hover:text-primary-400">
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </a>
              ))}
            </div>
          )}
        </div>
      )

    case "EVENT":
      return (
        <div className="space-y-2">
          {data.startDate && <p><strong>Başlangıç:</strong> {new Date(data.startDate).toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>}
          {data.endDate && <p><strong>Bitiş:</strong> {new Date(data.endDate).toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>}
          {data.location && <p className="flex items-start gap-2"><MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" /> {data.location}</p>}
          {data.description && <p className="text-gray-600 dark:text-gray-300">{data.description}</p>}
          {data.organizer && <p className="text-sm text-gray-500 dark:text-gray-400"><strong>Organizatör:</strong> {data.organizer}</p>}
          {data.url && (
            <Button variant="primary" size="sm" asChild>
              <a href={data.url} target="_blank" rel="noopener noreferrer">Etkinlik Sayfası</a>
            </Button>
          )}
        </div>
      )

    case "TUTORIAL_STEPS":
      return (
        <div className="space-y-3">
          {data.steps?.length > 0 && (
            <ol className="space-y-3">
              {data.steps.map((step: any, i: number) => (
                <li key={i} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-primary-500">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
                    <div>
                      <h6 className="font-medium text-gray-900 dark:text-gray-100">{step.title || `Adım ${i + 1}`}</h6>
                      {step.description && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{step.description}</p>}
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {step.duration && <span><Clock className="h-3 w-3 inline" /> {step.duration} dk</span>}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            {data.estimatedTime && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Toplam: {data.estimatedTime} dk</span>}
            {data.difficulty && <span><strong>Zorluk:</strong> {data.difficulty}</span>}
            {data.tools?.length > 0 && <span><strong>Araçlar:</strong> {data.tools.join(", ")}</span>}
          </div>
        </div>
      )

    case "SHOPPING_LIST":
      return (
        <div className="space-y-2">
          {data.items?.length > 0 && (
            <ul className="space-y-2">
              {data.items.map((item: any, i: number) => (
                <li key={i} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <input type="checkbox" defaultChecked={item.checked} className="h-4 w-4 text-primary-600" />
                  <span className={cn("flex-1", item.checked && "line-through text-gray-400")}>{item.name}</span>
                  {item.quantity && <span className="text-sm text-gray-500 dark:text-gray-400 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">{item.quantity}</span>}
                  {item.category && <Badge variant="outline" size="sm">{item.category}</Badge>}
                </li>
              ))}
            </ul>
          )}
          {data.store && <p className="text-sm text-gray-500 dark:text-gray-400"><strong>Mağaza:</strong> {data.store}</p>}
        </div>
      )

    case "TRAVEL_ITINERARY":
      return (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span><strong>{data.destination}</strong></span>
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {data.startDate} - {data.endDate}</span>
          </div>
          {data.days?.length > 0 && (
            <div className="space-y-4">
              {data.days.map((day: any, dayIndex: number) => (
                <details key={dayIndex} className="group">
                  <summary className="font-medium text-gray-900 dark:text-gray-100 cursor-pointer flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-bold">{dayIndex + 1}</span>
                    {day.date && <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(day.date).toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}</span>}
                  </summary>
                  <div className="mt-3 ml-10 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                    {day.activities?.map((activity: any, actIndex: number) => (
                      <div key={actIndex} className="pb-3 last:pb-0 relative">
                        <div className="absolute left-[-6px] top-1 w-2 h-2 rounded-full bg-primary-500" />
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {activity.time && <span className="font-medium text-gray-900 dark:text-gray-100">{activity.time} - </span>}
                          <strong>{activity.title}</strong>
                          {activity.location && <span className="text-gray-500 dark:text-gray-400 ml-2">@ {activity.location}</span>}
                        </div>
                        {activity.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.description}</p>}
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      )

    default:
      return (
        <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )
  }
}