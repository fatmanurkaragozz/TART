<div align="center">
  <br />
  <img src="https://img.shields.io/badge/TART-Eleştiri%20Platformu-2C2C28?style=for-the-badge" alt="TART" />
  <br /><br />

  <p><strong>Fikirlerin dengeli biçimde tartışıldığı, eleştirinin gelişime dönüştüğü modern bir topluluk platformu.</strong></p>

  <br />

  ![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)
  ![Express](https://img.shields.io/badge/Express-404D59?style=flat-square&logo=express)
  ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat-square&logo=Prisma&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E)

  <br /><br />

  [Özellikler](#-özellikler) • [Kurulum](#-kurulum) • [Mimari](#-mimari) • [API](#-api-uçları) • [Yol Haritası](#-yol-haritası)

  <br />

</div>

---

## ✨ Özellikler

- 🔐 **Güvenli Auth Sistemi** — JWT + Bcrypt ile kayıt, girin ve oturum yönetimi
- 💬 **Tartışma Platformu** — Konu oluşturma, yorum yapma ve fikir paylaşma
- 📱 **Tam Responsive** — Tüm cihazlarda kusursuz deneyim
- 🛡️ **Güvenli Altyapı** — Helmet, CORS ve merkezi hata yönetimi
- ⚡ **Modern Stack** — Prisma ORM ile tip güvenli veritabanı sorguları
- 🎨 **Özgün Tasarım** — Defter estetiğinden ilham alan, minimalist ve şık UI

---

## 🚀 Kurulum

### Gereksinimler

- Node.js `v20+`
- Bir PostgreSQL veritabanı (Supabase önerilir)

### Adımlar

```bash
# 1. Repoyu klonla
git clone https://github.com/fatmanurkaragozz/TART.git
cd TART-project

# 2. Bağımlılıkları yükle
npm install

# 3. Ortam değişkenlerini yapılandır
cp .env.example .env
# .env dosyasını kendi bilgilerinle düzenle

# 4. Veritabanı şemasını oluştur
npx prisma migrate dev

# 5. Geliştirme sunucularını başlat
npm run server   # Backend → http://localhost:5000
npm run dev      # Frontend → http://localhost:5173
```

### Ortam Değişkenleri (`.env`)

```env
# Supabase — Transaction Pooler (Uygulama için)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true"

# Supabase — Direct Connection (Migration için)
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"

# Uygulama
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:5000/api/v1

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=30d
```

> [!NOTE]
> Supabase bağlantı bilgilerine Supabase Dashboard → Settings → Database → Connection String bölümünden ulaşabilirsiniz.

---

## 🏗️ Mimari

TART backend'i profesyonel **Katmanlı Mimari (Layered Architecture)** desenini uygular:

```
TART-project/
│
├── 📁 prisma/
│   ├── schema.prisma          # User & Discussion modelleri
│   └── migrations/            # Otomatik migration'lar
│
├── 📁 server/                 # Backend
│   ├── routes/                # HTTP rota tanımları
│   ├── controllers/           # İstek/cevap yönetimi
│   ├── services/              # İş mantığı (AuthService vb.)
│   ├── repositories/          # Veritabanı katmanı (Prisma)
│   ├── middleware/            # Auth guard, hata yönetimi
│   ├── config/                # Prisma Client singleton
│   └── utils/                 # Yardımcılar (ApiError vb.)
│
└── 📁 src/                    # Frontend — React + TypeScript
    ├── app/
    │   ├── pages/             # Login, Register, Home, Profile…
    │   └── components/        # Paylaşılan UI bileşenleri
    ├── services/              # API servis katmanı (authService)
    └── lib/                   # Axios instance (JWT interceptor)
```

**Veri akışı:** `Route → Controller → Service → Repository → Prisma → PostgreSQL`

---

## 📡 API Uçları

| Method | Endpoint | Açıklama | Auth |
|:---:|---|---|:---:|
| `POST` | `/api/v1/auth/register` | Yeni kullanıcı kaydı | ❌ |
| `POST` | `/api/v1/auth/login` | Giriş yap, JWT döner | ❌ |
| `GET` | `/api/v1/discussions` | Tüm tartışmaları listele | ❌ |
| `POST` | `/api/v1/discussions` | Yeni tartışma oluştur | ✅ |
| `GET` | `/api/v1/discussions/:id` | Tartışma detayını getir | ❌ |

---

## 🗺️ Yol Haritası

```
✅ Hafta 1  — UI/UX Tasarımı ve tüm sayfaların oluşturulması
✅ Hafta 2  — Backend kurulumu ve Katmanlı Mimari
✅ Hafta 3  — Prisma ORM geçişi + JWT kimlik doğrulama
⬜ Hafta 4  — Tartışma ve yorum yönetimi (Core özellikler)
⬜ Hafta 5  — Arama ve filtreleme sistemi
⬜ Hafta 6  — Bildirim sistemi
⬜ Hafta 7  — Profil ve ayarlar geliştirmeleri
⬜ Hafta 8  — Performans optimizasyonu
⬜ Hafta 9  — Güvenlik sertleştirme
⬜ Hafta 10 — Test yazımı (unit & integration)
⬜ Hafta 11 — Deployment ve CI/CD
⬜ Hafta 12 — Final ve dokümantasyon
```

---

## 🧱 Kullanılan Teknolojiler

| Katman | Teknoloji |
|---|---|
| **UI** | React 18, TypeScript, Tailwind CSS v4, Framer Motion |
| **Routing** | React Router v7 |
| **HTTP** | Axios (JWT interceptor ile) |
| **Bildirimler** | Sonner (Toast) |
| **Backend** | Node.js, Express v5 |
| **ORM** | Prisma (type-safe PostgreSQL sorguları) |
| **Veritabanı** | PostgreSQL (Supabase hosted) |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **Güvenlik** | Helmet, CORS, Morgan |
| **Build** | Vite 6 |

---

<div align="center">
  <sub>Made with ☕ and genuine criticism · <strong>TART © 2026</strong></sub>
</div>