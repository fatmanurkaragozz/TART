import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const contactService = {
    sendMessage: async (data: any) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/contact`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    
    getMessages: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/contact`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    markAsRead: async (id: string) => {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/contact/${id}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default contactService;
