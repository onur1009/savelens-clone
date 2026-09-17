"use client"

import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createSave } from "@/actions/saves"
import { getCollections, createCollection } from "@/actions/collections"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Dropdown"
import { Modal } from "@/components/ui/Modal"
import { Card } from "@/components/ui/Card"
import { Plus, Loader2, X, FolderPlus } from "lucide-react"
import { cn } from "@/lib/utils"

const saveSchema = z.object({
  url: z.string().url("Geçerli bir URL girin"),
  collectionId: z.string().optional(),
})

type SaveFormData = z.infer<typeof saveSchema>

interface SaveFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  defaultUrl?: string
}

export function SaveForm({ isOpen, onClose, onSuccess, defaultUrl }: SaveFormProps) {
  const [collections, setCollections] = useState<Array<{ id: string; name: string; color: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showNewCollection, setShowNewCollection] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")
  const [newCollectionColor, setNewCollectionColor] = useState("#0ea5e9")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SaveFormData>({
    resolver: zodResolver(saveSchema),
    defaultValues: { url: defaultUrl || "" },
  })

  const loadCollections = useCallback(async () => {
    try {
      const data = await getCollections()
      setCollections(data)
    } catch (error) {
      console.error("Failed to load collections:", error)
    }
  }, [])

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCollectionName.trim()) return

    try {
      const result = await createCollection(newCollectionName, newCollectionColor)
      if (result.success) {
        setCollections((prev) => [...prev, result.collection!])
        setValue("collectionId", result.collection!.id)
        setShowNewCollection(false)
        setNewCollectionName("")
      }
    } catch (error) {
      console.error("Failed to create collection:", error)
    }
  }

  const onSubmit = async (data: SaveFormData) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("url", data.url)
      if (data.collectionId) formData.append("collectionId", data.collectionId)

      const result = await createSave(formData)
      if (result.success) {
        reset()
        onSuccess?.()
        onClose()
      } else {
        alert(result.error || "Kayıt oluşturulamadı")
      }
    } catch (error) {
      console.error("Save error:", error)
      alert("Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yeni Kayıt Ekle"
      description="Sosyal medya veya web bağlantısını yapıştırın, AI içeriği analiz etsin."
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Input
            label="URL"
            placeholder="https://instagram.com/... veya https://youtube.com/..."
            error={errors.url?.message}
            leftIcon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
            {...register("url")}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Koleksiyon <span className="text-gray-400">(isteğe bağlı)</span>
          </label>
          <div className="flex gap-2">
            <Select
              value={watch("collectionId") || ""}
              onChange={(value) => setValue("collectionId", value || undefined)}
              options={[
                { value: "", label: "Koleksiyon seçin (varsayılan: Tümü)" },
                ...collections.map((c) => ({ value: c.id, label: c.name })),
              ]}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowNewCollection(true)}
              aria-label="Yeni koleksiyon oluştur"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {showNewCollection && (
          <Card variant="outlined" className="space-y-3 animate-slide-down">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Yeni Koleksiyon</h4>
              <Button type="button" variant="ghost" size="icon" onClick={() => setShowNewCollection(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form onSubmit={handleCreateCollection} className="space-y-3">
              <Input
                label="Koleksiyon Adı"
                placeholder="Örn: İlham Verici Videolar"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                required
              />
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-500 dark:text-gray-400 w-16">Renk</label>
                <input
                  type="color"
                  value={newCollectionColor}
                  onChange={(e) => setNewCollectionColor(e.target.value)}
                  className="h-10 w-10 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowNewCollection(false)}>
                  İptal
                </Button>
                <Button type="submit" loading={isLoading}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Oluştur
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading || isSubmitting}>
            İptal
          </Button>
          <Button type="submit" loading={isLoading || isSubmitting}>
            {isLoading || isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                İşleniyor...
              </>
            ) : (
              "Kaydet ve Analiz Et"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}