import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

const notificationService = {
    getMyNotifications: async () => {
        const response = await axios.get(`${API_URL}/notifications`, getAuthHeader());
        return response.data;
    },

    markAsRead: async (id: string) => {
        const response = await axios.put(`${API_URL}/notifications/${id}/read`, {}, getAuthHeader());
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await axios.put(`${API_URL}/notifications/mark-all-read`, {}, getAuthHeader());
        return response.data;
    },

    deleteNotification: async (id: string) => {
        const response = await axios.delete(`${API_URL}/notifications/${id}`, getAuthHeader());
        return response.data;
    }
};

export default notificationService;
