import CommentRepository from '../repositories/CommentRepository.js';
import DiscussionRepository from '../repositories/DiscussionRepository.js';
import NotificationService from './NotificationService.js';
import ModerationService from './ModerationService.js';
import ApiError from '../utils/ApiError.js';

/**
 * @description Yorum İş Mantığı Servisi
 */
class CommentService {
    /**
     * @desc    Yeni yorum ekle
     */
    async addComment(data) {
        const { content, authorId, discussionId, parentId } = data;

        // 1. Doğrulamalar
        if (!content || content.trim().length < 2) {
            throw new ApiError(400, 'Yorum en az 2 karakter olmalıdır');
        }

        // 2. Tartışma var mı kontrol et
        const discussion = await DiscussionRepository.findById(discussionId);
        if (!discussion) {
            throw new ApiError(404, 'Yorum yapılacak tartışma bulunamadı');
        }

        // 3. AI Moderasyon Kontrolü (Hafta 5)
        const moderation = await ModerationService.analyzeText(content);
        if (!moderation.isSafe) {
            throw new ApiError(400, `Yorumunuz topluluk kurallarını ihlal ediyor olabilir (Risk: ${Math.round(moderation.riskScore * 100)}%)`);
        }

        // 4. Kaydet
        const comment = await CommentRepository.create({
            content: content.trim(),
            authorId,
            discussionId,
            parentId
        });

        // 4. Bildirim Gönder (Tartışma sahibine)
        try {
            await NotificationService.createNotification({
                userId: discussion.authorId,
                senderId: authorId,
                type: 'COMMENT',
                message: `"${discussion.title}" konulu tartışmanıza yeni bir yorum yapıldı.`,
                targetId: discussionId
            });
        } catch (err) {
            console.error('Bildirim gönderilemedi:', err.message);
        }

        return comment;
    }

    /**
     * @desc    Yorum güncelle
     */
    async updateComment(id, content, userId, userRole) {
        const comment = await CommentRepository.findById(id);
        
        if (!comment) {
            throw new ApiError(404, 'Yorum bulunamadı');
        }

        // Sadece sahibi güncelleyebilir (Admin genelde içeriği düzenlemez, siler)
        if (comment.authorId !== userId) {
            throw new ApiError(403, 'Bu yorumu düzenleme yetkiniz yok');
        }

        if (!content || content.trim().length < 2) {
            throw new ApiError(400, 'Yorum en az 2 karakter olmalıdır');
        }

        // AI Moderasyon Kontrolü
        const moderation = await ModerationService.analyzeText(content);
        if (!moderation.isSafe) {
            throw new ApiError(400, 'Düzenlenen yorum topluluk kurallarını ihlal ediyor olabilir.');
        }

        return await CommentRepository.update(id, content.trim());
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

    /**
     * @desc    Yorum oyla
     */
    async voteComment(commentId, userId, value) {
        const comment = await CommentRepository.findById(commentId);
        if (!comment) {
            throw new ApiError(404, 'Oylanacak yorum bulunamadı');
        }

        const vote = await CommentRepository.vote(commentId, userId, value);

        // Bildirim Gönder (Yorum sahibine, eğer upvote ise)
        if (value === 1 && vote.id) { // vote.id varsa yeni oluşturulmuştur veya güncellenmiştir
            try {
                await NotificationService.createNotification({
                    userId: comment.authorId,
                    senderId: userId,
                    type: 'VOTE',
                    message: `Bir yorumunuz beğenildi.`,
                    targetId: comment.discussionId
                });
            } catch (err) {
                console.error('Bildirim gönderilemedi:', err.message);
            }
        }

        return vote;
    }
}

const commentService = new CommentService();
export default commentService;
