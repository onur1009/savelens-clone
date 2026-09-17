import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { 
  Zap, Shield, Brain, Search, Globe, Clock, 
  ArrowRight, CheckCircle, Sparkles, Layers, 
  Download, MessageSquare, MapPin, ShoppingBag
} from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: Zap,
    title: "Sıfır Sürtünmeli Kaydetme",
    description: "Instagram, TikTok, LinkedIn, YouTube veya herhangi bir web sayfasını tek tıkla kaydedin. Tarayıcı eklentisi ve mobil paylaşım menüsü ile anında erişim.",
  },
  {
    icon: Brain,
    title: "AI Özeti & Etiketler",
    description: "Yapay zeka her içeriği otomatik özetler, konu etiketleri oluşturur ve renge göre sınıflandırır. Manuel organize etmeye gerek kalmaz.",
  },
  {
    icon: Search,
    title: "Akıllı Arama",
    description: "Konu, trend, stil veya konuşulan herhangi bir kelimeye göre arama yapın. Transkript, özet, etiket ve notlarınız içinde anında bulun.",
  },
  {
    icon: Layers,
    title: "Akıllı Çıkarımlar",
    description: "Tarif adımlarını, harita linklerini, indirim kodlarını, antrenman programlarını ve ürün linklerini otomatik çıkarıp yapılandırılmış kartlar halinde sunar.",
  },
  {
    icon: MessageSquare,
    title: "Kütüphane AI Sohbeti",
    description: "Tüm kütüphanenizi bilen bir asistan. 'Geçen ay kaydettiğim İtalya mekanları?' sorusu için anında cevap, bağlantılar ve öneriler.",
  },
  {
    icon: Shield,
    title: "Anti-Kayıp Arşiv",
    description: "Orijinal gönderi silinse bile medyanız güvende. Kalıcı bulut yedekleme ile kayıplar tarihe karışır. Notion/CSV dışa aktarma.",
  },
]

const extractTypes = [
  { icon: MessageSquare, label: "Tarifler", desc: "Malzemeler, adımlar, süreler" },
  { icon: MapPin, label: "Mekanlar", desc: "Adres, koordinatlar, çalışma saatleri" },
  { icon: Clock, label: "Antrenmanlar", desc: "Egzersizler, setler, tekrarlar" },
  { icon: ShoppingBag, label: "Ürünler", desc: "Fiyat, marka, satın alma linki" },
  { icon: Sparkles, label: "İndirim Kodları", desc: "Kod, geçerlilik, şartlar" },
  { icon: Download, label: "Eğitimler", desc: "Adım adım öğretici içerikler" },
]

const stats = [
  { value: "50K+", label: "Kaydedilen İçerik" },
  { value: "99.9%", label: "İşleme Başarısı" },
  { value: "< 3s", label: "Ortalama İşleme Süresi" },
  { value: "100+", label: "Desteklenen Dil" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">SaveLens</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">Özellikler</Link>
              <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">Nasıl Çalışır</Link>
              <Link href="#extracts" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">Çıkarımlar</Link>
              <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">Fiyatlandırma</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">Giriş Yap</Link>
              <Link href="/auth/signup">
                <Button className="hidden sm:block">Ücretsiz Başla</Button>
              </Link>
              <Button variant="outline" className="md:hidden" onClick={() => {}}>Menü</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>V2.0 Yayında — AI Sohbet, Harita Görünümü, Akıllı Raflar</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-6">
              Her şeyi kaydet.<br />
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Hiçbir şeyi kaybetme.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Instagram, TikTok, LinkedIn, YouTube ve web içerikleri — yapay zeka özetler, etiketler ve anında bulmanı sağlar. 
              Kalıcı bulut medya yedekleme ve Notion/CSV dışa aktarma.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-lg px-8">
                  <Zap className="h-5 w-5" />
                  Ücretsiz Başla
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-lg px-8">
                  Özellikleri Keşfet
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</span>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-400 dark:text-gray-500">
            <span className="text-sm font-medium">Desteklenen platformlar:</span>
            {["Instagram", "TikTok", "YouTube", "LinkedIn", "X (Twitter)", "Reddit", "Pinterest", "Web"].map((platform) => (
              <span key={platform} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium">
                {platform}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Güçlü Özellikler
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Modern içerik tüketicileri ve yaratıcılar için tasarlanmış, AI destekli araçlar
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-shadow" padding="none">
                <div className="h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              3 Adımda Başlayın
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Karmaşık ayarlar yok, sadece kaydedin ve AI gerisini halletsin
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "01", title: "Kaydedin", description: "Tarayıcı eklentimiz, mobil uygulamamız veya web arayüzümüzden herhangi bir bağlantıyı tek tıkla kaydedin.", icon: Globe },
              { step: "02", title: "AI İşlesin", description: "İçeriğiniz otomatik transkribe edilir, özetlenir, etiketlenir ve yapılandırılmış veriler çıkarılır.", icon: Brain },
              { step: "03", title: "Bulun ve Kullanın", description: "Akıllı arama, filtreler, harita görünümü ve AI sohbeti ile kaydettiğiniz her şeye anında erişin.", icon: Search },
            ].map((item, index) => (
              <Card key={index} className="p-6 relative" padding="none">
                <span className="text-sm font-bold text-primary-600 dark:text-primary-400 mb-2 block">{item.step}</span>
                <div className="h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                {index < 2 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary-500 border-l-0 border-b-0 rotate-45" />
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Extracts */}
      <section id="extracts" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Akıllı Veri Çıkarımları
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              AI, kaydettiğiniz videolardan ve sayfalardan yapılandırılmış, kullanılabilir veriler çıkarır
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {extractTypes.map((item, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow" padding="none">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{item.label}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 p-8 sm:p-12 lg:p-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Kütüphanenizi Bugün Oluşturmaya Başlayın
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
              Binlerce içerik yaratıcısı, araştırmacı ve meraklı SaveLens ile zamandan kazanıyor. 
              Ücretsiz deneyin, farkı hissedin.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2 text-lg px-8 bg-white text-primary-700 hover:bg-primary-50">
                  <Zap className="h-5 w-5" />
                  Ücretsiz Hesap Aç
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-lg px-8 border-white text-white hover:bg-white/10">
                  Daha Fazla Özellik
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-primary-200">
              Kredi kartı gerekmez · İstediğiniz zaman iptal · Verileriniz size aittir
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-4 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">SaveLens</span>
              </Link>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                AI destekli kişisel içerik arşivleme platformu. Her şeyi kaydedin, hiçbir şeyi kaybetmeyin.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Ürün</h4>
              <ul className="space-y-2 text-gray-500 dark:text-gray-400 text-sm">
                <li><Link href="#features" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Özellikler</Link></li>
                <li><Link href="/pricing" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Fiyatlandırma</Link></li>
                <li><Link href="/docs" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Dokümantasyon</Link></li>
                <li><Link href="/changelog" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Değişiklik Günlüğü</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Şirket</h4>
              <ul className="space-y-2 text-gray-500 dark:text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Hakkımızda</Link></li>
                <li><Link href="/blog" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Kariyer</Link></li>
                <li><Link href="/contact" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">İletişim</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 SaveLens. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">Gizlilik</Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">Şartlar</Link>
              <Link href="/cookies" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">Çerezler</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}