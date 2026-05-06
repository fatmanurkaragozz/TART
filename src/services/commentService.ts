import api from '../lib/axios';

/**
 * Yorum (Comment) Servisi
 * Backend ile yorum verileri arasındaki iletişimi yönetir.
 */
class CommentService {
    /**
     * @desc    Yeni yorum ekle
     */
    async addComment(commentData: { content: string; discussionId: string; parentId?: string }) {
        try {
            const response = await api.post('/comments', commentData);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    /**
     * @desc    Yorum güncelle
     */
    async updateComment(id: string, content: string) {
        try {
            const response = await api.put(`/comments/${id}`, { content });
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    /**
     * @desc    Yorum sil
     */
    async deleteComment(id: string) {
        try {
            const response = await api.delete(`/comments/${id}`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    /**
     * @desc    Yorum oyla
     */
    async voteComment(id: string, value: number) {
        try {
            const response = await api.post(`/comments/${id}/vote`, { value });
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

const commentService = new CommentService();
export default commentService;
