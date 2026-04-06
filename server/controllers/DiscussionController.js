import DiscussionService from '../services/DiscussionService.js';

class DiscussionController {
    async createDiscussion(req, res, next) {
        try {
            // Debug: Gelen kullanıcıyı kontrol et
            if (!req.user) {
                console.error('HATA: DiscussionController - req.user tanımsız!');
                return next(new ApiError(401, 'Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.'));
            }

            const { title, content, tags } = req.body;
            
            // Prisma bazen id, bazen _id dönebilir (yapılandırmaya bağlı)
            const authorId = req.user.id || req.user._id;

            if (!authorId) {
                console.error('HATA: DiscussionController - req.user nesnesinde ID alanı bulunamadı! Mevcut alanlar:', Object.keys(req.user));
                return next(new ApiError(400, 'Kullanıcı kimliği doğrulanamadı.'));
            }

            console.log(`BİLGİ: ${authorId} id'li kullanıcı için tartışma oluşturuluyor...`);

            const discussion = await DiscussionService.createNewDiscussion({
                title,
                content,
                authorId,
                tags
            });
            
            res.status(201).json({
                success: true,
                data: discussion
            });
        } catch (error) {
            console.error('HATA: createDiscussion servisi hata döndü:', error.message);
            next(error);
        }
    }


    async getDiscussions(req, res, next) {
        try {
            const discussions = await DiscussionService.getAllDiscussions();
            res.json({
                success: true,
                count: discussions.length,
                data: discussions
            });
        } catch (error) {
            next(error);
        }
    }

    async getDiscussionById(req, res, next) {
        try {
            const { id } = req.params;
            const discussion = await DiscussionService.getDiscussionDetails(id);
            
            res.json({
                success: true,
                data: discussion
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteDiscussion(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;

            await DiscussionService.deleteDiscussion(id, userId, userRole);

            res.json({
                success: true,
                message: 'Tartışma başarıyla silindi'
            });
        } catch (error) {
            next(error);
        }
    }

    async voteDiscussion(req, res, next) {
        try {
            const { id } = req.params;
            const { value } = req.body;
            const userId = req.user.id;

            await DiscussionService.voteDiscussion(id, userId, value);

            res.json({
                success: true,
                message: 'Oy başarıyla kaydedildi'
            });
        } catch (error) {
            next(error);
        }
    }
}



const discussionController = new DiscussionController();
export default discussionController;
