import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('--- _prisma_migrations RLS Politikası Uygulanıyor ---');
    try {
        await prisma.$executeRaw`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_policies 
                    WHERE tablename = '_prisma_migrations' AND policyname = 'Sadece servis rolü erişebilir'
                ) THEN
                    CREATE POLICY "Sadece servis rolü erişebilir" ON "public"."_prisma_migrations" 
                    AS PERMISSIVE FOR ALL 
                    TO service_role 
                    USING (true)
                    WITH CHECK (true);
                END IF;
            END $$;
        `;
        console.log('✅ _prisma_migrations için "service_role" politikası başarıyla eklendi.');
    } catch (error) {
        console.error('❌ Hata:', error.message);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
