-- 1. Güvenlik: RLS'yi Etkinleştir (Security: Enable RLS)
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "discussions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "comments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "votes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contact_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_UserFollows" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- 2. Hassas Verileri Gizle (Hide Sensitive Data - Column Level Security)
-- PostgREST (Supabase API) rollerinden şifre sütununu gizle
REVOKE SELECT ON "users" FROM anon, authenticated;
REVOKE ALL ON "_prisma_migrations" FROM anon, authenticated;
GRANT SELECT (id, username, "fullName", email, role, created_at) ON "users" TO anon, authenticated;

-- 3. RLS Politikaları (RLS Policies)

-- USERS
CREATE POLICY "Kullanıcı profilleri herkes tarafından görülebilir" ON "users"
    FOR SELECT USING (true);

CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir" ON "users"
    FOR UPDATE USING (auth.uid() = id);

-- DISCUSSIONS
CREATE POLICY "Tartışmalar herkes tarafından okunabilir" ON "discussions"
    FOR SELECT USING (true);

CREATE POLICY "Giriş yapmış kullanıcılar tartışma oluşturabilir" ON "discussions"
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Yazarlar kendi tartışmalarını güncelleyebilir" ON "discussions"
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Yazarlar kendi tartışmalarını silebilir" ON "discussions"
    FOR DELETE USING (auth.uid() = author_id);

-- COMMENTS
CREATE POLICY "Yorumlar herkes tarafından okunabilir" ON "comments"
    FOR SELECT USING (true);

CREATE POLICY "Giriş yapmış kullanıcılar yorum yapabilir" ON "comments"
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Yazarlar kendi yorumlarını güncelleyebilir" ON "comments"
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Yazarlar kendi yorumlarını silebilir" ON "comments"
    FOR DELETE USING (auth.uid() = author_id);

-- VOTES
CREATE POLICY "Oylar herkes tarafından görülebilir" ON "votes"
    FOR SELECT USING (true);

CREATE POLICY "Giriş yapmış kullanıcılar oy verebilir" ON "votes"
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Kullanıcılar kendi oylarını değiştirebilir" ON "votes"
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi oylarını silebilir" ON "votes"
    FOR DELETE USING (auth.uid() = user_id);

-- NOTIFICATIONS
CREATE POLICY "Kullanıcılar sadece kendi bildirimlerini görebilir" ON "notifications"
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi bildirimlerini güncelleyebilir (okundu bilgisi)" ON "notifications"
    FOR UPDATE USING (auth.uid() = user_id);

-- CONTACT MESSAGES
CREATE POLICY "Sadece üyeler doğrulama ile mesaj gönderebilir" ON "contact_messages"
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND
        length(name) >= 2 AND
        length(email) >= 5 AND
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
        length(message) >= 10
    );

CREATE POLICY "Sadece adminler mesajları okuyabilir" ON "contact_messages"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- _prisma_migrations (Kılavuz hatalarını gidermek için açık politika)
CREATE POLICY "Sadece servis rolü erişebilir" ON "public"."_prisma_migrations" 
    AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- _UserFollows (Takip Sistemi)
CREATE POLICY "Takip verileri herkes tarafından görülebilir" ON "_UserFollows"
    FOR SELECT USING (true);

CREATE POLICY "Kullanıcılar başkalarını takip edebilir" ON "_UserFollows"
    FOR INSERT WITH CHECK (auth.uid() = "A");

CREATE POLICY "Kullanıcılar takibi bırakabilir" ON "_UserFollows"
    FOR DELETE USING (auth.uid() = "A");

-- 4. Performans İyileştirmeleri (Performance Optimizations)

-- Eksik İndeksler (Missing Indexes)
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON "notifications"("user_id");
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON "votes"("user_id");
CREATE INDEX IF NOT EXISTS idx_discussions_author_id ON "discussions"("author_id");
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON "comments"("author_id");

-- _UserFollows için Birincil Anahtar (Primary Key for _UserFollows)
-- Eğer prisma otomatik oluşturmadıysa veya PK olarak işaretlenmediyse:
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name='_UserFollows' AND constraint_type='PRIMARY KEY') THEN
        ALTER TABLE "_UserFollows" ADD PRIMARY KEY ("A", "B");
    END IF;
END $$;

-- 5. Migrasyon Tablosu Hatası Çözümü (Fix Migration Table Error)
CREATE SCHEMA IF NOT EXISTS supabase_migrations;
CREATE TABLE IF NOT EXISTS supabase_migrations.schema_migrations (
    version bigint NOT NULL PRIMARY KEY,
    inserted_at timestamp with time zone DEFAULT now()
);
