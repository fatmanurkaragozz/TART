import api from './apiClient';

const notificationService = {
    getMyNotifications: async () => {
        const response = await api.get('/notifications');
        return response.data;
    },

    markAsRead: async (id: string) => {
        const response = await api.put(`/notifications/${id}/read`);
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await api.put('/notifications/mark-all-read');
        return response.data;
    },

    deleteNotification: async (id: string) => {
        const response = await api.delete(`/notifications/${id}`);
        return response.data;
    }
};

export default notificationService;
