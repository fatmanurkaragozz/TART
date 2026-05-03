import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

// Geliştirme aşamasında bilgisayarın IP adresini otomatik bulmak için
const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost?.split(':').shift() || 'localhost';

// Backend portu 5000 olarak varsayıyoruz
const API_URL = `http://${localhost}:5000/api/v1`;

console.log('Mobile API URL:', API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Her isteğe token ekle
apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error('Token fetch error:', e);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
