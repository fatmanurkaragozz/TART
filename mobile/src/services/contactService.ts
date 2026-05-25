import apiClient from './apiClient';

/**
 * İletişim Servisi
 */
class ContactService {
    /**
     * @desc    İletişim mesajı gönder
     */
    async sendMessage(data: { name: string; email: string; subject: string; message: string }) {
        try {
            const response = await apiClient.post('/contact', data);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    /**
     * @desc    Merkezi Hata Yönetimi
     */
    private handleError(error: any) {
        const message = error.response?.data?.message || 'İletişim mesajı gönderilirken bir hata oluştu';
        throw new Error(message);
    }
}

const contactService = new ContactService();
export default contactService;
