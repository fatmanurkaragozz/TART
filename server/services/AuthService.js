import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository.js';
import ApiError from '../utils/ApiError.js';

/**
 * @description Kimlik Doğrulama Servis Katmanı
 */
class AuthService {
    /**
     * @desc    Yeni kullanıcı kaydı oluştur
     * @param   {object} userData
     */
    async register(userData) {
        const { username, fullName, email, password } = userData;

        // 1. E-posta veya Kullanıcı adı kontrolü
        const existingEmail = await UserRepository.findByEmail(email);
        if (existingEmail) {
            throw new ApiError(400, 'Bu e-posta adresi zaten kullanımda');
        }

        const existingUser = await UserRepository.findByUsername(username);
        if (existingUser) {
            throw new ApiError(400, 'Bu kullanıcı adı zaten alınmış');
        }

        // 2. Şifreyi Hashle (Bcrypt)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Kullanıcıyı Kaydet
        const newUser = await UserRepository.create({
            username,
            fullName, // Yeni alan eklendi
            email,
            password: hashedPassword,
        });

        // 4. Şifreyi response'tan çıkar
        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }


    /**
     * @desc    Kullanıcı girişi (Login)
     * @param   {string} email
     * @param   {string} password
     */
    async login(email, password) {
        // 1. Kullanıcıyı bul
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new ApiError(401, 'Geçersiz e-posta veya şifre');
        }

        // 2. Şifreyi doğrula
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new ApiError(401, 'Geçersiz e-posta veya şifre');
        }

        // 3. JWT Token üret
        const token = this.generateToken(user.id);

        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }

    /**
     * @desc    JWT Token Oluşturucu
     * @param   {string} id
     */
    generateToken(id) {
        return jwt.sign(
            { id },
            process.env.JWT_SECRET || 'tart_super_secret',
            { expiresIn: process.env.JWT_EXPIRE || '30d' }
        );
    }
}

const authService = new AuthService();
export default authService;
