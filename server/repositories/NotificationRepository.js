import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class NotificationRepository {
    async create(data) {
        return await prisma.notification.create({
            data: {
                userId: data.userId,
                senderId: data.senderId,
                type: data.type,
                message: data.message,
                targetId: data.targetId
            }
        });
    }

    async getByUserId(userId) {
        return await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
    }

    async markAsRead(id, userId) {
        return await prisma.notification.updateMany({
            where: { id, userId },
            data: { isRead: true }
        });
    }

    async markAllAsRead(userId) {
        return await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });
    }

    async delete(id, userId) {
        return await prisma.notification.deleteMany({
            where: { id, userId }
        });
    }
}

export default new NotificationRepository();
