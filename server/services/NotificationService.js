import NotificationRepository from '../repositories/NotificationRepository.js';

class NotificationService {
    async createNotification(data) {
        // Kendi kendine bildirim gitmesini engelle
        if (data.userId === data.senderId) return null;
        
        return await NotificationRepository.create(data);
    }

    async getUserNotifications(userId) {
        return await NotificationRepository.getByUserId(userId);
    }

    async markRead(id, userId) {
        return await NotificationRepository.markAsRead(id, userId);
    }

    async markAllRead(userId) {
        return await NotificationRepository.markAllAsRead(userId);
    }

    async deleteNotification(id, userId) {
        return await NotificationRepository.delete(id, userId);
    }
}

export default new NotificationService();
