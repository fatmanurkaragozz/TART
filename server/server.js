import 'dotenv/config';
import app from './app.js';
import prisma from './config/prisma.js';

// 0. Zorunlu Ortam Değişkenleri Kontrolü
// Bu değişkenler eksikse sunucu güvenli/tutarlı çalışamaz, bu yüzden dinlemeye
// başlamadan hemen önce durduruyoruz (aksi halde JWT_SECRET gibi eksik bir
// değer koddaki sabit bir yedeğe düşer, veya CLIENT_URL eksikliği CORS'un
// yanlışlıkla herkese açılmasına yol açar).
const REQUIRED_ENV_VARS = ['DATABASE_URL', 'JWT_SECRET', 'CLIENT_URL'];
const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
    console.error(`❌ Eksik zorunlu ortam değişkenleri: ${missingEnvVars.join(', ')}`);
    console.error('Sunucu başlatılamıyor. Lütfen .env dosyanızı kontrol edin.');
    process.exit(1);
}

// 1. Veritabanı Bağlantı Testi (Prisma)
async function testConnection() {
    try {
        await prisma.$connect();
        console.log('✅ Prisma üzerinden Veritabanı Bağlantısı Doğrulandı');
    } catch (err) {
        console.error('❌ Prisma Bağlantı Testi Başarısız!', err);
    }
}

testConnection();

// 2. Sunucuyu Başlat
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`
    🚀 Sunucu hazır!
    📡 Port: ${PORT}
    🌍 Mod: ${process.env.NODE_ENV}
    `);
});

// 3. Beklenmedik Hataları Yakalama (Unhandled Promises)
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Kapatılıyor...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM ALINDI. Sunucu düzgünce kapatılıyor...');
    server.close(() => {
        console.log('💥 Süreç sonlandırıldı!');
        prisma.$disconnect();
    });
});
