import apiClient from './apiClient';
import * as SecureStore from 'expo-secure-store';

class AuthService {
    async register(userData: any) {
        try {
            const response = await apiClient.post('/auth/register', userData);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async login(credentials: any) {
        try {
            const response = await apiClient.post('/auth/login', credentials);
            const { token, user } = response.data.data;

            // Token ve kullanıcı bilgisini güvenli depolama alanına kaydet
            await SecureStore.setItemAsync('token', token);
            await SecureStore.setItemAsync('user', JSON.stringify(user));

            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async logout() {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');
    }

    async forgotPassword(email: string) {
        try {
            const response = await apiClient.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async resetPassword(resetToken: string, data: any) {
        try {
            const response = await apiClient.post(`/auth/reset-password/${resetToken}`, data);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async getToken() {
        return await SecureStore.getItemAsync('token');
    }

    async getUser() {
        const user = await SecureStore.getItemAsync('user');
        return user ? JSON.parse(user) : null;
    }

    private handleError(error: any) {
        const message = error.response?.data?.message || 'Bir hata oluştu';
        throw new Error(message);
    }
}

const authService = new AuthService();
export default authService;
