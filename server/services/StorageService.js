import { randomUUID } from 'crypto';
import supabase, { DISCUSSION_IMAGES_BUCKET } from '../config/supabase.js';

/**
 * @description Görsel Depolama Servisi (Supabase Storage)
 */
class StorageService {
    /**
     * @desc    Tartışma kapak görselini Supabase Storage'a yükler
     * @param   {object|null} file - multer memory storage dosyası ({ buffer, mimetype })
     * @param   {string} authorId
     * @returns {Promise<string|null>} Yüklenen görselin public URL'i, dosya yoksa null
     */
    async uploadDiscussionImage(file, authorId) {
        if (!file) return null;

        if (!supabase) {
            throw new Error('Görsel depolama servisi yapılandırılmamış (SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY eksik)');
        }

        const ext = file.mimetype.split('/')[1] || 'bin';
        const path = `discussions/${authorId}/${randomUUID()}.${ext}`;

        const { error } = await supabase
            .from(DISCUSSION_IMAGES_BUCKET)
            .upload(path, file.buffer, { contentType: file.mimetype, upsert: false });

        if (error) {
            console.error('HATA: Supabase görsel yükleme başarısız:', error.message);
            throw new Error('Görsel yüklenirken bir hata oluştu');
        }

        const { data } = supabase.from(DISCUSSION_IMAGES_BUCKET).getPublicUrl(path);
        return data.publicUrl;
    }

    /**
     * @desc    Bir tartışma görselini Supabase Storage'dan siler (public URL'den yolu çıkararak)
     * @param   {string|null} imageUrl
     */
    async deleteDiscussionImage(imageUrl) {
        if (!imageUrl || !supabase) return;

        const marker = `/object/public/${DISCUSSION_IMAGES_BUCKET}/`;
        const markerIndex = imageUrl.indexOf(marker);
        if (markerIndex === -1) return;

        const path = imageUrl.slice(markerIndex + marker.length);
        const { error } = await supabase.from(DISCUSSION_IMAGES_BUCKET).remove([path]);

        if (error) {
            console.error('HATA: Supabase görsel silme başarısız:', error.message);
        }
    }
}

const storageService = new StorageService();
export default storageService;
