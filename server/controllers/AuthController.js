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
}

const authController = new AuthController();
export default authController;
