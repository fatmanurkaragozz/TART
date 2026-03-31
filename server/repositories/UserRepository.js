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
     * @desc    ID'ye göre kullanıcı bul
     * @param   {string} id
     */
    async findById(id) {
        return await prisma.user.findUnique({
            where: { id }
        });
    }
}

const userRepository = new UserRepository();
export default userRepository;
