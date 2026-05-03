import AuthService from '../services/AuthService.js';
import ApiError from '../utils/ApiError.js';

/**
 * @description Kimlik Doğrulama Kontrolörü (HTTP Arayüzü)
 */
class AuthController {
    /**
     * @route   POST /api/v1/auth/register
     * @desc    Kullanıcı Kaydı
     */
    async register(req, res, next) {
        try {
            const { username, email, password } = req.body;

            // Basit Doğrulama
            if (!username || !email || !password) {
                return next(new ApiError(400, 'Lütfen tüm alanları doldurun'));
            }

            const user = await AuthService.register({ username, email, password });

            res.status(201).json({
                success: true,
                message: 'Kullanıcı başarıyla kaydedildi',
                data: user
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * @route   POST /api/v1/auth/login
     * @desc    Kullanıcı Girişi
     */
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return next(new ApiError(400, 'E-posta ve şifre gereklidir'));
            }

            const { user, token } = await AuthService.login(email, password);

            res.status(200).json({
                success: true,
                message: 'Giriş başarılı',
                data: {
                    user,
                    token
                }
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * @route   POST /api/v1/auth/forgot-password
     * @desc    Şifre Sıfırlama İsteği
     */
    async forgotPassword(req, res, next) {
        try {
            console.log('Forgot password request received:', req.body);
            const { email } = req.body;

            if (!email) {
                return next(new ApiError(400, 'E-posta adresi gereklidir'));
            }

            await AuthService.forgotPassword(email);

            res.status(200).json({
                success: true,
                message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi'
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * @route   POST /api/v1/auth/reset-password/:resetToken
     * @desc    Yeni Şifre Belirleme
     */
    async resetPassword(req, res, next) {
        try {
            const { password } = req.body;
            const { resetToken } = req.params;

            if (!password) {
                return next(new ApiError(400, 'Yeni şifre gereklidir'));
            }

            const { user, token } = await AuthService.resetPassword(resetToken, password);

            res.status(200).json({
                success: true,
                message: 'Şifreniz başarıyla güncellendi',
                data: {
                    user,
                    token
                }
            });
        } catch (err) {
            next(err);
        }
    }
}

const authController = new AuthController();
export default authController;
