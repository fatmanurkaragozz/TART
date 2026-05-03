import NotificationService from '../services/NotificationService.js';

class NotificationController {
    async getMyNotifications(req, res, next) {
        try {
            const userId = req.user.id;
            const notifications = await NotificationService.getUserNotifications(userId);
            
            res.json({
                success: true,
                data: notifications
            });
        } catch (error) {
            next(error);
        }
    }

    async markAsRead(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            
            await NotificationService.markRead(id, userId);
            
            res.json({
                success: true,
                message: 'Bildirim okundu olarak işaretlendi'
            });
        } catch (error) {
            next(error);
        }
    }

    async markAllAsRead(req, res, next) {
        try {
            const userId = req.user.id;
            
            await NotificationService.markAllRead(userId);
            
            res.json({
                success: true,
                message: 'Tüm bildirimler okundu olarak işaretlendi'
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteNotification(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            
            await NotificationService.deleteNotification(id, userId);
            
            res.json({
                success: true,
                message: 'Bildirim silindi'
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new NotificationController();
