import CommentRepository from '../repositories/CommentRepository.js';
import DiscussionRepository from '../repositories/DiscussionRepository.js';
import ApiError from '../utils/ApiError.js';

/**
 * @description Yorum İş Mantığı Servisi
 */
class CommentService {
    /**
     * @desc    Yeni yorum ekle
     */
    async addComment(data) {
        const { content, authorId, discussionId } = data;

        // 1. Doğrulamalar
        if (!content || content.trim().length < 2) {
            throw new ApiError(400, 'Yorum en az 2 karakter olmalıdır');
        }

        // 2. Tartışma var mı kontrol et
        const discussion = await DiscussionRepository.findById(discussionId);
        if (!discussion) {
            throw new ApiError(404, 'Yorum yapılacak tartışma bulunamadı');
        }

        // 3. Kaydet
        return await CommentRepository.create({
            content: content.trim(),
            authorId,
            discussionId
        });
    }

    /**
     * @desc    Yorum sil
     */
    async deleteComment(id, userId, userRole) {
        const comment = await CommentRepository.findById(id);
        
        if (!comment) {
            throw new ApiError(404, 'Yorum bulunamadı');
        }

        // Sadece sahibi veya admin silebilir
        if (comment.authorId !== userId && userRole !== 'admin') {
            throw new ApiError(403, 'Bu yorumu silme yetkiniz yok');
        }

        return await CommentRepository.delete(id);
    }
}

const commentService = new CommentService();
export default commentService;
