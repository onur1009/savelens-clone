# SaveLens Clone - AI Destekli İçerik Kütüphanesi

Modern, AI destekli kişisel içerik arşivleme platformu. Sosyal medya ve web içeriklerini kaydedin, AI ile özetleyin, etiketleyin ve anında bulun.

## 🚀 Özellikler

### Temel Özellikler
- **Çoklu Platform Desteği**: Instagram, TikTok, YouTube, LinkedIn, X (Twitter), Reddit, Pinterest, Web
- **AI Otomatik İşleme**: İçerik özetleme, etiketleme, kategori sınıflandırma
- **Ses Deşifreleme**: Video/ses içeriklerinin metne dönüştürülmesi
- **Akıllı Veri Çıkarımı**: Tarifler, mekanlar, antrenmanlar, ürünler, indirim kodları, eğitimler
- **Kalıcı Arşiv**: Orijinal silinse bile medya yedekleri güvende
- **Akıllı Arama**: Transkript, özet, etiket, notlarda tam metin + semantik arama
- **Koleksiyonlar**: Kayıtları tematik koleksiyonlarda organize etme
- **Akıllı Raflar (Smart Shelves)**: Kaydedilmiş sorgular ile otomatik güncellenen listeler
- **Harita Görünümü**: Mekan kayıtlarını interaktif haritada görüntüleme
- **AI Sohbet Asistanı**: Kütüphanenizle doğal dilde sohbet etme (MCP entegrasyonu hazır)
- **Dışa Aktarma**: Notion, CSV, Markdown, JSON formatlarında

### Teknik Özellikler
- **Next.js 14 App Router** - Modern React framework
- **TypeScript** - Tip güvenliği
- **Prisma ORM** - SQLite/PostgreSQL veritabanı
- **NextAuth.js** - Kimlik doğrulama (Credentials, Google, GitHub)
- **Tailwind CSS** - Utility-first styling
- **OpenAI GPT-4o** - AI işleme motoru
- **Radix UI Primitives** - Erişilebilir bileşenler

## 📦 Kurulum

### Gereksinimler
- Node.js 18.17+
- npm/yarn/pnpm
- OpenAI API anahtarı
- (Opsiyonel) Google/GitHub OAuth credentials
- (Opsiyonel) YouTube Data API v3 anahtarı

### Hızlı Başlangıç

```bash
# Repository'yi klonlayın
git clone <repo-url>
cd savelens-clone

# Bağımlılıkları yükleyin
npm install

# Environment dosyasını oluşturun
cp .env.example .env
# .env dosyasını düzenleyin (en az OPENAI_API_KEY ve NEXTAUTH_SECRET gerekli)

# Veritabanını hazırlayın
npm run db:generate
npm run db:push

# (Opsiyonel) Demo verileri ekleyin
npm run db:seed

# Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

### Environment Değişkenleri

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="openssl rand -base64 32 ile üretilen gizli anahtar"

# OAuth (Opsiyonel)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# AI
OPENAI_API_KEY="sk-..."

# YouTube Metadata (Opsiyonel)
YOUTUBE_API_KEY=""
```

## 🗂️ Proje Yapısı

```
src/
├── app/                    # Next.js App Router sayfaları
│   ├── api/               # API route'ları
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── saves/         # Kayıt CRUD işlemleri
│   │   ├── collections/   # Koleksiyon yönetimi
│   │   └── chat/          # AI sohbet
│   ├── auth/              # Giriş/Kayıt sayfaları
│   ├── dashboard/         # Ana panel
│   ├── library/           # Kütüphane görünümü
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # Temel UI bileşenleri
│   ├── layout/            # Sidebar, Header
│   ├── saves/             # SaveCard, SaveDetail, SaveForm
│   └── chat/              # ChatView
├── lib/
│   ├── auth.ts            # NextAuth konfigürasyonu
│   ├── prisma.ts          # Prisma client
│   ├── ai.ts              # OpenAI fonksiyonları
│   ├── metadata.ts        # Meta veri çıkarma
│   └── utils.ts           # Yardımcı fonksiyonlar
├── actions/               # Server Actions
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript tipleri
```

## 🔧 Geliştirme

### Veritabanı İşlemleri
```bash
# Şema değişikliklerini uygula
npm run db:push

# Prisma Studio (veritabanı GUI)
npm run db:studio

# Migration oluştur (production için)
npx prisma migrate dev --name migration_name
```

### Kod Kalitesi
```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

### Test Kullanıcısı
`npm run db:seed` çalıştırıldığında:
- Email: `demo@savelens.app`
- Şifre: `demo123456`

## 🚀 Production Deploy

### Vercel (Önerilen)
1. Vercel'e projeyi import edin
2. Environment değişkenlerini ayarlayın
3. `DATABASE_URL` için PostgreSQL (Vercel Postgres, Neon, Supabase) kullanın
4. Deploy edin

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Veritabanı Migrasyonu (Production)
```bash
npx prisma migrate deploy
```

## 📝 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 İletişim

- GitHub Issues: Bug raporları ve feature request'ler için
- Discussions: Genel sorular ve topluluk desteği için

---

**SaveLens Clone** - Kendi AI destekli içerik kütüphanenizi oluşturun 🚀