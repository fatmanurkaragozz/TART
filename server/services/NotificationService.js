import NotificationRepository from '../repositories/NotificationRepository.js';
import UserRepository from '../repositories/UserRepository.js';
import EmailService from './EmailService.js';

class NotificationService {
    async createNotification(data) {
        // Kendi kendine bildirim gitmesini engelle
        if (data.userId === data.senderId) return null;

        let message = data.message;
        if (data.senderId && message.includes('{{senderName}}')) {
            const sender = await UserRepository.findById(data.senderId);
            const senderName = sender ? sender.username : 'Bir kullanıcı';
            message = message.replace('{{senderName}}', senderName);
        }

        const notification = await NotificationRepository.create({ ...data, message });

        const recipient = await UserRepository.findById(data.userId);
        if (recipient) {
            EmailService.sendNotificationEmail(recipient.email, recipient.username, message)
                .catch(err => console.error('Bildirim e-postası gönderilemedi:', err.message));
        }

        return notification;
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
