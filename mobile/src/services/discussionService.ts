import apiClient from './apiClient';

class DiscussionService {
    async getAllDiscussions() {
        try {
            const response = await apiClient.get('/discussions');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async getDiscussionById(id: string) {
        try {
            const response = await apiClient.get(`/discussions/${id}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async createDiscussion(discussionData: { title: string; content: string; tags: string[] }) {
        try {
            const response = await apiClient.post('/discussions', discussionData);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async deleteDiscussion(id: string) {
        try {
            const response = await apiClient.delete(`/discussions/${id}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async voteDiscussion(id: string, value: number) {
        try {
            const response = await apiClient.post(`/discussions/${id}/vote`, { value });
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

const discussionService = new DiscussionService();
export default discussionService;
