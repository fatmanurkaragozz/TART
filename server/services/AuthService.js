import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import UserRepository from '../repositories/UserRepository.js';
import ApiError from '../utils/ApiError.js';
import EmailService from './EmailService.js';

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

        // 4. Hoş geldin maili gönder (Async olarak, ana işlemi engellemesin)
        EmailService.sendWelcomeEmail(newUser.email, newUser.username).catch(err => console.error('Welcome email failed:', err));

        // 5. Şifreyi response'tan çıkar
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
     * @desc    Şifre sıfırlama token'ı oluştur ve e-posta gönder
     * @param   {string} email 
     */
    async forgotPassword(email) {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new ApiError(404, 'Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı');
        }

        // 1. Sıfırlama token'ı üret (Random string)
        const resetToken = crypto.randomBytes(20).toString('hex');

        // 2. Token'ı hashle ve veritabanına kaydet (10 dakika geçerli)
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 dakika

        await UserRepository.update(user.id, {
            resetPasswordToken,
            resetPasswordExpire
        });

        // 3. Sıfırlama URL'sini oluştur
        // Mobil uygulama için custom scheme veya universal link kullanılabilir
        // Şimdilik web/mobil genel bir URL yapısı kuralım
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

        // 4. E-posta gönder
        try {
            await EmailService.sendPasswordResetEmail(user.email, resetUrl);
        } catch (error) {
            // Hata durumunda token'ları temizle
            await UserRepository.update(user.id, {
                resetPasswordToken: null,
                resetPasswordExpire: null
            });
            throw new ApiError(500, 'E-posta gönderilemedi');
        }
    }

    /**
     * @desc    Token ile şifreyi sıfırla
     * @param   {string} resetToken 
     * @param   {string} newPassword 
     */
    async resetPassword(resetToken, newPassword) {
        // 1. Token'ı hashle (DB'deki ile karşılaştırmak için)
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // 2. Token ve süresi geçerli olan kullanıcıyı bul
        const user = await UserRepository.findByResetToken(resetPasswordToken);

        if (!user) {
            throw new ApiError(400, 'Geçersiz veya süresi dolmuş token');
        }

        // 3. Yeni şifreyi hashle
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 4. Şifreyi güncelle ve token'ları temizle
        await UserRepository.update(user.id, {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpire: null
        });

        // 5. Yeni token üret (Opsiyonel: Otomatik giriş yaptırmak için)
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
