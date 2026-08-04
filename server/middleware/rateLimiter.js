import rateLimit from 'express-rate-limit';

/**
 * @description Kimlik doğrulama uç noktaları için hız sınırlama
 * Brute-force / kimlik bilgisi denemesi ve hesap numaralandırma saldırılarını sınırlar.
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Çok fazla deneme yaptınız. Lütfen 15 dakika sonra tekrar deneyin.'
    }
});
