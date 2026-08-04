import { StorageClient } from '@supabase/storage-js';

/**
 * Supabase Storage Client Singleton
 * Görsel yüklemeleri için service_role anahtarıyla (RLS bypass) oluşturulur.
 * Tam @supabase/supabase-js yerine sadece @supabase/storage-js kullanılıyor —
 * bu sayede yalnızca Storage'a ihtiyacımız varken Realtime istemcisinin
 * Node 20'de native WebSocket olmadan çökmesi engellenmiş oluyor.
 */

let supabase = null;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('UYARI: SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY tanımlı değil. Görsel yükleme devre dışı kalacak.');
} else {
    supabase = new StorageClient(`${process.env.SUPABASE_URL}/storage/v1`, {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
    });
}

export const DISCUSSION_IMAGES_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'discussion-images';

export default supabase;
