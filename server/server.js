import 'dotenv/config';
import app from './app.js';
import pool from './config/database.js';

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Veritabanı Bağlantı Testi Başarısız!', err);
    } else {
        console.log('✅ Veritabanı Bağlantısı Doğrulandı:', res.rows[0].now);
    }
});

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
    });
});
