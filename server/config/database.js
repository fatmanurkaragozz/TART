import pg from 'pg';
const { Pool } = pg;

// 1. PostgreSQL Bağlantı Havuzu (Pool) Yapılandırması
const pool = new Pool({
    user: process.env.PGUSER || 'postgres',
    host: process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'tart_db',
    password: process.env.PGPASSWORD || 'password',
    port: process.env.PGPORT || 5432,
    max: 20, // Maksimum eş zamanlı bağlantı
    idleTimeoutMillis: 30000, // Bağlantı boşta kalma süresi
    connectionTimeoutMillis: 2000, // Bağlantı zaman aşımı
});

// 2. Bağlantı Olaylarını Dinleme
pool.on('connect', () => {
    console.log('✅ PostgreSQL Veritabanına Başarıyla Bağlanıldı');
});

pool.on('error', (err) => {
    console.error('❌ Beklenmedik PostgreSQL Hatası!', err);
    process.exit(-1);
});

/**
 * @description Merkezi Sorgu Fonksiyonu
 * @param {string} text - SQL Sorgusu
 * @param {Array} params - Sorgu Parametreleri
 */
export const query = (text, params) => pool.query(text, params);

export default pool;
