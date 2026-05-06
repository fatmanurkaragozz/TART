import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const adminService = {
    getStats: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    
    getUsers: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    deleteUser: async (id: string) => {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/admin/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default adminService;
