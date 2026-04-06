import api from '../lib/axios';

/**
 * Tartışma (Topic) Servisi
 * Backend ile tartışma verileri arasındaki iletişimi yönetir.
 */
class DiscussionService {
    /**
     * @desc    Tüm tartışmaları getir
     */
    async getAllDiscussions() {
        try {
            const response = await api.get('/discussions');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    /**
     * @desc    ID'ye göre tek bir tartışma detayı getir
     */
    async getDiscussionById(id: string) {
        try {
            const response = await api.get(`/discussions/${id}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    /**
     * @desc    Yeni tartışma oluştur
     */
    async createDiscussion(discussionData: { title: string; content: string; tags: string[] }) {
        try {
            const response = await api.post('/discussions', discussionData);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    /**
     * @desc    Tartışmayı sil
     */
    async deleteDiscussion(id: string) {
        try {
            const response = await api.delete(`/discussions/${id}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    /**
     * @desc    Tartışmaya oy ver
     */
    async voteDiscussion(id: string, value: number) {
        try {
            const response = await api.post(`/discussions/${id}/vote`, { value });
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

const discussionService = new DiscussionService();
export default discussionService;
