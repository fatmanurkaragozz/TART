import api from '../lib/axios';

/**
 * Kimlik Doğrulama Servisi
 * Kayıt, giriş ve çıkış işlemlerinin frontend tarafındaki mantığını yönetir.
 */
class AuthService {
    /**
     * @desc    Kullanıcı Kaydı
     */
    async register(userData: any) {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    /**
     * @desc    Kullanıcı Girişi
     */
    async login(credentials: any) {
        try {
            const response = await api.post('/auth/login', credentials);
            const { token, user } = response.data.data;

            // Token'ı localStorage'a kaydet
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    /**
     * @desc    Çıkış Yapma
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    /**
     * @desc    Şifre Sıfırlama İsteği
     */
    async forgotPassword(email: string) {
        try {
            const response = await api.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    /**
     * @desc    Yeni Şifre Belirleme
     */
    async resetPassword(resetToken: string, data: any) {
        try {
            const response = await api.post(`/auth/reset-password/${resetToken}`, data);
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

const authService = new AuthService();
export default authService;
