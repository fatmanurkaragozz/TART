import api from '../lib/axios';

/**
 * Tartışma (Topic) Servisi
 * Backend ile tartışma verileri arasındaki iletişimi yönetir.
 */
class DiscussionService {
    /**
     * @desc    Tüm tartışmaları getir (Arama ve filtreleme ile)
     */
    async getAllDiscussions(filters?: { search?: string; tag?: string }) {
        try {
            const response = await api.get('/discussions', { params: filters });
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
     * @desc    Tartışmayı güncelle
     */
    async updateDiscussion(id: string, discussionData: { title?: string; content?: string; tags?: string[] }) {
        try {
            const response = await api.put(`/discussions/${id}`, discussionData);
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
     * @desc    Trend tartışmaları getir
     */
    async getTrending() {
        try {
            const response = await api.get('/discussions/trending/list');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    /**
     * @desc    Takip edilen kişilerin akışını getir
     */
    async getFollowingFeed() {
        try {
            const response = await api.get('/discussions/feed/following');
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
