import prisma from '../config/prisma.js';

class AdminController {
    /**
     * @desc    Genel istatistikleri getir
     */
    async getStats(req, res, next) {
        try {
            const [userCount, discussionCount, commentCount, messageCount] = await Promise.all([
                prisma.user.count(),
                prisma.discussion.count(),
                prisma.comment.count(),
                prisma.contactMessage.count()
            ]);

            res.status(200).json({
                success: true,
                data: {
                    users: userCount,
                    discussions: discussionCount,
                    comments: commentCount,
                    messages: messageCount
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Tüm kullanıcıları getir
     */
    async getAllUsers(req, res, next) {
        try {
            const users = await prisma.user.findMany({
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    fullName: true,
                    role: true,
                    createdAt: true,
                    _count: {
                        select: { discussions: true, comments: true }
                    }
                }
            });

            res.status(200).json({
                success: true,
                data: users
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Kullanıcı sil
     */
    async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            await prisma.user.delete({ where: { id } });

            res.status(200).json({
                success: true,
                message: 'Kullanıcı başarıyla silindi'
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AdminController();
