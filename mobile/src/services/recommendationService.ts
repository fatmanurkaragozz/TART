import apiClient from './apiClient';

class RecommendationService {
    async getGeneralRecommendations() {
        try {
            const response = await apiClient.get('/recommendations');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async getDiscussionRecommendations(discussionId: string) {
        try {
            const response = await apiClient.get(`/recommendations/discussion/${discussionId}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async createRecommendation(recommendationData: {
        title: string;
        type: string;
        label: string;
        description: string;
        discussionId?: string | null;
    }) {
        try {
            const response = await apiClient.post('/recommendations', recommendationData);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        const message = error.response?.data?.message || 'Bir hata oluştu';
        throw new Error(message);
    }
}

const recommendationService = new RecommendationService();
export default recommendationService;
