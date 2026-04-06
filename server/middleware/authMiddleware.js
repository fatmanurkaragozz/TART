import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import UserRepository from '../repositories/UserRepository.js';

/**
 * @description Kimlik Doğrulama Middleware (JWT Kontrolü)
 */
export const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Authorization header'ından token'ı al
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new ApiError(401, 'Bu işlem için giriş yapmanız gerekmektedir'));
        }

        // 2. Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tart_super_secret');
        console.log('DEBUG: Decoded token:', decoded);

        // 3. Kullanıcıyı bul ve req objesine ekle
        const user = await UserRepository.findById(decoded.id);
        console.log('DEBUG: User from DB:', user);
        
        if (!user) {
            return next(new ApiError(401, 'Token geçersiz veya kullanıcı artık mevcut değil'));
        }

        req.user = user;
        next();

    } catch (error) {
        return next(new ApiError(401, 'Yetkisiz erişim'));
    }
};

/**
 * @description Role dayalı yetkilendirme (Admin kontrolü vb.)
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ApiError(403, `Bu işlem için '${req.user.role}' rolü yetkili değil`));
        }
        next();
    };
};
