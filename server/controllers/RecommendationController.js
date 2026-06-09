import RecommendationService from '../services/RecommendationService.js';

/**
 * @description Öneri (Recommendation) İşlem Kontrolörü (HTTP Arayüzü)
 */
class RecommendationController {
    /**
     * @desc    Genel/Ana sayfa önerilerini getir
     */
    async getGeneralRecommendations(req, res, next) {
        try {
            const recommendations = await RecommendationService.getGeneralRecommendations();
            res.status(200).json({
                success: true,
                data: recommendations
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Tartışmaya özel önerileri getir
     */
    async getDiscussionRecommendations(req, res, next) {
        try {
            const { discussionId } = req.params;
            const recommendations = await RecommendationService.getDiscussionRecommendations(discussionId);
            res.status(200).json({
                success: true,
                data: recommendations
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Yeni öneri ekle
     */
    async createRecommendation(req, res, next) {
        try {
            const { title, type, label, description, discussionId } = req.body;
            const authorId = req.user.id; // Auth middleware'den gelen user id

            const recommendation = await RecommendationService.createRecommendation({
                title,
                type,
                label,
                description,
                authorId,
                discussionId
            });

            res.status(201).json({
                success: true,
                message: 'Öneri başarıyla eklendi',
                data: recommendation
            });
        } catch (error) {
            next(error);
        }
    }
}

const recommendationController = new RecommendationController();
export default recommendationController;
