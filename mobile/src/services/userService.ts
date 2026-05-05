import apiClient from './apiClient';

/**
 * Kullanıcı (User/Profile) Servisi
 * Profil bilgilerini getirme ve güncelleme işlemlerini yönetir.
 */
class UserService {
    /**
     * @desc    Giriş yapmış kullanıcının profilini getir
     */
    async getMyProfile() {
        try {
            const response = await apiClient.get('/users/me');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    /**
     * @desc    Kullanıcı profilini güncelle
     */
    async updateProfile(data: { fullName: string }) {
        try {
            const response = await apiClient.patch('/users/me', data);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    /**
     * @desc    Kullanıcıyı takip et
     */
    async followUser(userId: string) {
        try {
            const response = await apiClient.post(`/users/${userId}/follow`);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    /**
     * @desc    Önerilen kullanıcıları getir
     */
    async getSuggestedUsers() {
        try {
            const response = await apiClient.get('/users/suggested');
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    /**
     * @desc    Merkezi Hata Yönetimi
     */
    private handleError(error: any) {
        const message = error.response?.data?.message || 'Profil işlemi sırasında bir hata oluştu';
        throw new Error(message);
    }
}

const userService = new UserService();
export default userService;
