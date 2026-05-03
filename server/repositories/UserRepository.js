import prisma from '../config/prisma.js';

/**
 * @description Kullanıcı Veri Erişim Katmanı (Prisma ORM)
 */
class UserRepository {
    /**
     * @desc    E-posta adresine göre kullanıcı bul
     * @param   {string} email
     */
    async findByEmail(email) {
        return await prisma.user.findUnique({
            where: { email }
        });
    }

    /**
     * @desc    Kullanıcı adına göre kullanıcı bul
     * @param   {string} username
     */
    async findByUsername(username) {
        return await prisma.user.findUnique({
            where: { username }
        });
    }

    /**
     * @desc    Yeni kullanıcı oluştur
     * @param   {object} userData
     */
    async create(userData) {
        return await prisma.user.create({
            data: userData
        });
    }

    /**
     * @desc    ID'ye göre kullanıcı bul (İlişkilerle birlikte)
     * @param   {string} id
     */
    async findById(id) {
        return await prisma.user.findUnique({
            where: { id },
            include: {
                discussions: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        _count: {
                            select: { comments: true }
                        }
                    }
                }
            }
        });
    }

    /**
     * @desc    Profil bilgilerini getir
     */
    async findProfile(id) {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                fullName: true,
                email: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        discussions: true,
                        comments: true,
                        followedBy: true,
                        following: true
                    }
                },
                discussions: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        _count: {
                            select: { comments: true }
                        }
                    }
                }
            }
        });
    }
    /**
     * @desc    Reset token'ına göre kullanıcı bul
     * @param   {string} resetPasswordToken
     */
    async findByResetToken(resetPasswordToken) {
        return await prisma.user.findFirst({
            where: {
                resetPasswordToken,
                resetPasswordExpire: {
                    gt: new Date()
                }
            }
        });
    }

    /**
     * @desc    Kullanıcı bilgilerini güncelle
     * @param   {string} id
     * @param   {object} data
     */
    async update(id, data) {
        return await prisma.user.update({
            where: { id },
            data: data,
            select: {
                id: true,
                username: true,
                fullName: true,
                email: true,
                role: true
            }
        });
    }

    /**
     * @desc    Kullanıcıyı takip et
     */
    async followUser(followerId, followingId) {
        return await prisma.user.update({
            where: { id: followerId },
            data: {
                following: {
                    connect: { id: followingId }
                }
            }
        });
    }

    /**
     * @desc    Takibi bırak
     */
    async unfollowUser(followerId, followingId) {
        return await prisma.user.update({
            where: { id: followerId },
            data: {
                following: {
                    disconnect: { id: followingId }
                }
            }
        });
    }

    /**
     * @desc    Önerilen kullanıcıları getir (En çok takipçisi olanlar)
     */
    async findSuggestedUsers(excludeUserId) {
        return await prisma.user.findMany({
            take: 5,
            where: {
                id: { not: excludeUserId }
            },
            select: {
                id: true,
                username: true,
                _count: {
                    select: { followedBy: true }
                }
            },
            orderBy: {
                followedBy: { _count: 'desc' }
            }
        });
    }
}


const userRepository = new UserRepository();
export default userRepository;
