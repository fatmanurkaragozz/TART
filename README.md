<div align="center">
  <br />
  <img src="https://img.shields.io/badge/TART-Ele%C5%9Ftiri%20Toplulu%C4%9Fu-2C2C28?style=for-the-badge&logo=react&logoColor=61DAFB" alt="TART" />
  <br /><br />

  <p><strong>Fikirlerin dengeli biçimde tartışıldığı, eleştirinin gelişime dönüştüğü modern, çapraz platformlu (Web + Mobil) bir topluluk platformu.</strong></p>

  <br />

  ![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
  ![React Native / Expo](https://img.shields.io/badge/React_Native-Expo_54-000000?style=flat-square&logo=expo&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)
  ![Express](https://img.shields.io/badge/Express-404D59?style=flat-square&logo=express&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat-square&logo=Prisma&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)
  ![Supabase Security](https://img.shields.io/badge/Supabase_RLS-Active-3ECF8E?style=flat-square&logo=supabase&logoColor=white)

  <br /><br />

  [Ana Özellikler](#-ana-özellikler) • [Güvenlik & RLS](#-güvenlik--rls-katmanı) • [Kurulum Kılavuzu](#-kurulum-kılavuzu) • [Mimari Yapı](#-mimari-yapı) • [API Uçları](#-api-uçları) • [Geliştirme Yol Haritası](#-geliştirme-yol-haritası)

  <br />
</div>

---

## ✨ Ana Özellikler

TART, modern bir topluluk platformunun sahip olması gereken tüm özellikleri hem web hem de mobil (çapraz platform) cihazlarda en üst düzey performansla sunar:

*   🔐 **Güvenli Kimlik Doğrulama:** JWT (JSON Web Token) ve Bcryptjs tabanlı güvenli kayıt/giriş mekanizması. Şifre sıfırlama (Forgot/Reset Password) ve e-posta entegrasyonu.
*   💬 **Dinamik Yorum ve Tartışmalar:** Konu açma, yorum yapma, yorumlara alt yanıtlar (nested replies) ekleme ve etkileşimi artırıcı oylama (Upvote/Downvote) sistemi.
*   👥 **Sosyal Ağ Özellikleri:** Gelişmiş kullanıcı takip mekanizması (Follower/Following), kişiselleştirilmiş profil modal ve görünümleri, dinamik "Önerilen Kullanıcılar" algoritması.
*   🔔 **Dinamik Bildirim Sistemi:** Yeni bir yorum yapıldığında veya gönderi oy aldığında anlık tetiklenen kullanıcı içi bildirimler.
*   🎨 **Özgün "Defter" Estetiği:** Hem web hem de mobil uygulamada tutarlı "Paper/Notebook" tasarım dili, minimal renk aksanları ve göz alıcı Framer Motion animasyonları.
*   🛡️ **Sıkılaştırılmış Güvenlik (Hardened Security):** Helmet, CORS, Morgan ve Supabase Row Level Security (RLS) katmanıyla korunan altyapı.

---

## 🛡️ Güvenlik & RLS Katmanı

TART, istemci güvenliğini veritabanı düzeyine taşımaktadır. Supabase PostgreSQL üzerinde **Row Level Security (RLS)** ve **Column-Level Security (CLS)** aktif edilmiştir:

1.  **Sütun Düzeyli Erişim Sınırlama (CLS):** `users` tablosundaki `password`, `reset_password_token` ve `reset_password_expire` alanları dışarıdan doğrudan atılan `SELECT` isteklerine tamamen kapatılmıştır. İstemci yalnızca güvenli genel alanları okuyabilir.
2.  **Satır Düzeyli Kontrol (RLS):**
    *   Yorumlar ve tartışmalar herkes tarafından okunabilir ancak yalnızca giriş yapmış doğrulanmış kullanıcılar tarafından oluşturulabilir.
    *   Bir içeriği (tartışma/yorum) yalnızca o içeriğin sahibi (`author_id`) güncelleyebilir veya silebilir.
    *   Kullanıcı bildirimleri yalnızca bildirimin sahibi olan kullanıcı tarafından görüntülenebilir ve okundu olarak işaretlenebilir.
    *   İletişim mesajlarını (`contact_messages`) sadece `admin` rolüne sahip kullanıcılar sorgulayabilir.

---

## 🚀 Kurulum Kılavuzu

Proje 3 ana katmandan oluşmaktadır: **Sunucu (Backend)**, **Web Arayüzü (Frontend)** ve **Mobil Uygulama (Expo React Native)**.

### Sistem Gereksinimleri
*   Node.js `v20` veya üzeri
*   PostgreSQL Veritabanı (Yerel veya Supabase bulut veritabanı önerilir)

### Adım 1: Depoyu Klonlayın ve Bağımlılıkları Kurun
```bash
# Projeyi bilgisayarınıza indirin
git clone https://github.com/fatmanurkaragozz/TART.git
cd TART-project

# Kök dizindeki ve web arayüzündeki ortak paketleri kurun
npm install
```

### Adım 2: Çevre Değişkenlerini Yapılandırın
Kök dizinde yer alan şablonu kopyalayarak gerçek veritabanı ve e-posta kimlik bilgilerinizi girin:
```bash
cp .env.example .env
```
`.env` dosyasını bir kod editörüyle açın ve veritabanı adreslerinizi (`DATABASE_URL`, `DIRECT_URL`), JWT anahtarınızı (`JWT_SECRET`) ve mail gönderimi için SMTP bilgilerinizi tanımlayın.

### Adım 3: Veritabanı Şemasını ve Tabloları Oluşturun
Prisma ORM kullanarak tabloları oluşturun ve veritabanınızı güncelleyin:
```bash
npx prisma generate
npx prisma migrate dev
```

### Adım 4: Uygulamaları Başlatın

#### A. Sunucu & Web Frontend Çalıştırma (Kök Dizinde)
```bash
# Backend Sunucusunu Başlat (http://localhost:5000)
npm run server

# Web Arayüzünü Başlat (Vite - http://localhost:5173)
npm run dev
```

#### B. Mobil Uygulamayı Çalıştırma (Expo - `mobile` Dizini)
Mobil uygulamayı çalıştırmak için yeni bir terminal penceresinde `mobile` dizinine geçin:
```bash
cd mobile
npm install

# Expo Geliştirme Sunucusunu Başlat
npm run start
```
*   **Android için:** Klavyeden `a` tuşuna basın (Android Emulator veya fiziksel cihaz bağlı olmalıdır).
*   **iOS için:** Klavyeden `i` tuşuna basın (macOS ve Xcode gerektirir).
*   **QR Code ile:** Telefonunuza **Expo Go** uygulamasını yükleyerek ekranda çıkan QR kodu taratarak kendi telefonunuzda anında çalıştırabilirsiniz.

---

## 🏗️ Mimari Yapı

TART Backend'i, endüstri standardı **Katmanlı Mimari (Layered Architecture)** deseniyle geliştirilmiştir:

```
TART-project/
├── 📁 prisma/                 # Prisma Şemaları ve Migrasyonlar
│   └── schema.prisma          # Mükemmel tasarlanmış PostgreSQL modelleri
│
├── 📁 server/                 # Sunucu Katmanı (Node.js & Express)
│   ├── routes/                # Rota / Uç Nokta Tanımları (API Router)
│   ├── controllers/           # HTTP İsteklerini Alan ve Yanıtları Yöneten Katman
│   ├── services/              # Ağır İş Mantığının Yürütüldüğü Servis Katmanı
│   ├── middleware/            # JWT Kimlik Kontrolleri, Morgan Hata Loglayıcılar
│   ├── config/                # Veritabanı Bağlantı Başlatıcıları (Prisma Client)
│   └── utils/                 # Hata Nesneleri (ApiError), Yardımcı Araçlar
│
├── 📁 src/                    # Web Arayüzü (React 19 + Vite 6 + TS)
│   ├── app/
│   │   ├── pages/             # Login, Register, Home, Contact, Profile...
│   │   └── components/        # Yeniden Kullanılabilir Premium UI Öğeleri
│   ├── services/              # Axios Tabanlı İstemci API Servisleri
│   └── lib/                   # Otomatik JWT Ekleme Yapan Interceptor Mekanizması
│
└── 📁 mobile/                 # Mobil Arayüz (React Native + Expo Router + NativeWind)
    ├── app/                   # Expo Router Tabanlı Rotalar ve Sekmeler
    ├── src/
    │   ├── services/          # Mobil-Özel API Servis Katmanı
    │   └── components/        # Mobil Ekran Bileşenleri
    └── assets/                # Medya ve Tasarım Asetleri
```

---

## 📡 API Uçları

| Metot | Endpoint / Uç Nokta | Açıklama | Yetki / Giriş |
|:---:|---|---|:---:|
| `POST` | `/api/v1/auth/register` | Yeni Kullanıcı Kaydı | Herkese Açık |
| `POST` | `/api/v1/auth/login` | Kullanıcı Girişi (JWT Döner) | Herkese Açık |
| `POST` | `/api/v1/auth/forgot-password` | Şifre Sıfırlama E-postası Gönder | Herkese Açık |
| `POST` | `/api/v1/auth/reset-password` | Yeni Şifreyi Kaydet | Herkese Açık |
| `GET` | `/api/v1/discussions` | Tüm Tartışmaları Listele | Herkese Açık |
| `POST` | `/api/v1/discussions` | Yeni Tartışma Oluştur | Giriş Gerekli |
| `GET` | `/api/v1/discussions/:id` | Tartışma Detayı ve Yorumları Getir | Herkese Açık |
| `PUT` | `/api/v1/discussions/:id` | Tartışmayı Güncelle (Yalnızca Yazar/Admin) | Giriş Gerekli |
| `POST` | `/api/v1/comments` | Tartışmaya Yorum Gönder | Giriş Gerekli |
| `POST` | `/api/v1/discussions/:id/vote` | Tartışmayı Oyla (Upvote/Downvote) | Giriş Gerekli |

---

## 🗺️ Geliştirme Yol Haritası

Proje, 12 haftalık planlanan hedeflerinin ötesine geçerek tüm kritik ve ileri düzey özellikleri başarıyla tamamlamıştır:

*   [x] **Aşama 1 (Hafta 1-3):** Mimarinin Kurulması, UI Tasarımı ve JWT Kimlik Doğrulama
*   [x] **Aşama 2 (Hafta 4-5):** Tartışma, Detaylı Yorum, Alt Yorum Yanıtları ve Oylama Sistemleri
*   [x] **Aşama 3 (Hafta 6-7):** Takip Sistemi, Profil Sayfaları, E-posta Entegrasyonu ve Mobil-Web Veri Eşitlemesi
*   [x] **Aşama 4 (Hafta 8-9):** Supabase RLS Güvenlik Sertleştirmesi ve Veritabanı İndeksleme Optimizasyonları (Hız Artırımı)
*   [x] **Aşama 5 (Hafta 10-11):** Mobil UI/UX Uyumlaştırması (Expo Go + NativeWind), Azure CI/CD Pipeline Yapılandırması
*   [x] **Aşama 6 (Hafta 12):** Açık Kaynak Dağıtımı ve Dokümantasyon (.env.example ile Güvenli Dağıtım)

---

<div align="center">
  <sub>Made with ☕, passion and genuine criticism · <strong>TART © 2026</strong></sub>
</div>