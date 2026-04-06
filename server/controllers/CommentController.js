import CommentService from '../services/CommentService.js';

/**
 * @description Yorum İşlem Kontrolörü (HTTP Arayüzü)
 */
class CommentController {
    /**
     * @desc    Yeni Yorum Ekle
     */
    async addComment(req, res, next) {
        try {
            const { content, discussionId } = req.body;
            const authorId = req.user.id;

            const comment = await CommentService.addComment({ content, authorId, discussionId });

            res.status(201).json({
                success: true,
                message: 'Yorum başarıyla eklendi',
                data: comment
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Yorum Sil
     */
    async deleteComment(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;

            await CommentService.deleteComment(id, userId, userRole);

            res.status(200).json({
                success: true,
                message: 'Yorum başarıyla silindi'
            });
        } catch (error) {
            next(error);
        }
    }
}

const commentController = new CommentController();
export default commentController;
