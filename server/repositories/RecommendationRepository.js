import prisma from '../config/prisma.js';

/**
 * @description Öneri (Recommendation) Veri Erişim Katmanı
 */
class RecommendationRepository {
    /**
     * @desc    Yeni öneri oluştur
     * @param   {object} data
     */
    async create(data) {
        return await prisma.recommendation.create({
            data,
            include: {
                author: {
                    select: {
                        username: true,
                        fullName: true
                     }
                }
            }
        });
    }

    /**
     * @desc    Genel/Ana sayfa önerilerini getir
     */
    async findGeneral() {
        return await prisma.recommendation.findMany({
            where: { discussionId: null },
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        username: true,
                        fullName: true
                    }
                }
            }
        });
    }

    /**
     * @desc    Belirli bir tartışmaya ait tüm önerileri getir (AI + kullanıcı önerileri)
     * @param   {string} discussionId
     */
    async findByDiscussion(discussionId) {
        return await prisma.recommendation.findMany({
            where: { discussionId },
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        username: true,
                        fullName: true
                    }
                }
            }
        });
    }

    /**
     * @desc    Kullanıcının profilindeki genel önerileri getir
     * @param   {string} authorId
     */
    async findAuthorGeneral(authorId) {
        return await prisma.recommendation.findMany({
            where: { authorId, discussionId: null },
            orderBy: { createdAt: 'desc' }
        });
    }
}

const recommendationRepository = new RecommendationRepository();
export default recommendationRepository;
