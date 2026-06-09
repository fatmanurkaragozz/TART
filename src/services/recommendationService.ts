import api from '../lib/axios';

/**
 * Öneri (Recommendation) Servisi
 * Backend ile entelektüel öneri verileri arasındaki iletişimi yönetir.
 */
class RecommendationService {
    /**
     * @desc    Genel/Ana sayfa önerilerini getir
     */
    async getGeneralRecommendations() {
        try {
            const response = await api.get('/recommendations');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    /**
     * @desc    Tartışmaya özel önerileri getir
     */
    async getDiscussionRecommendations(discussionId: string) {
        try {
            const response = await api.get(`/recommendations/discussion/${discussionId}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    /**
     * @desc    Yeni öneri paylaş
     */
    async createRecommendation(data: { 
        title: string; 
        type: string; 
        label: string; 
        description: string; 
        discussionId?: string | null 
    }) {
        try {
            const response = await api.post('/recommendations', data);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    /**
     * @desc    Merkezi Hata Yönetimi
     */
    private handleError(error: any) {
        const message = error.response?.data?.message || 'Bir hata oluştu';
        throw new Error(message);
    }
}

const recommendationService = new RecommendationService();
export default recommendationService;
