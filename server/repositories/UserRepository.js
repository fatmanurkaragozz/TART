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
                        comments: true
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
}


const userRepository = new UserRepository();
export default userRepository;
