import multer from 'multer';
import ApiError from '../utils/ApiError.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return cb(new ApiError(400, 'Sadece JPEG, PNG, WEBP veya GIF formatında görsel yükleyebilirsiniz'));
        }
        cb(null, true);
    }
});

/**
 * @desc    Tartışma kapak görseli yükleme middleware'i (tek dosya, 'image' alanı)
 */
export const uploadDiscussionImage = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return next(new ApiError(400, 'Görsel en fazla 5MB olabilir'));
            }
            return next(new ApiError(400, err.message || 'Görsel yüklenemedi'));
        }
        if (err) {
            return next(err);
        }
        next();
    });
};
