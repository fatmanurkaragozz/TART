import 'dotenv/config';
import app from './app.js';
import prisma from './config/prisma.js';

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
