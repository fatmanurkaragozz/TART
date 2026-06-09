-- 1. Tüm mevcut tablolar için Row Level Security (RLS) özelliğini etkinleştir
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.recommendations ENABLE ROW LEVEL SECURITY;

-- 2. Varsayılan olarak dışarıdan doğrudan Supabase API'si (anon/authenticated) ile 
-- yapılacak tüm erişimleri engelle (hiçbir policy tanımlanmadığı için RLS doğrudan bloklar).
-- Backend sunucumuz postgres kullanıcısıyla (bypass RLS yetkisiyle) çalıştığı için 
-- backend'in okuma/yazma yetkileri aynen korunacaktır.
