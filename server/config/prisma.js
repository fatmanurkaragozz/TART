import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * Uygulama genelinde tek bir veritabanı bağlantı havuzu kullanılmasını sağlar.
 */
const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
