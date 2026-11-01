import ApiError from '../utils/ApiError.js';

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    if (process.env.NODE_ENV === 'production' && !err.isOperational) {
        statusCode = 500;
        message = 'Sunucu tarafında bir hata oluştu';
    }

    res.locals.errorMessage = err.message;

    const response = {
        success: false,
        code: statusCode || 500,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };

    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    } else if (!err.isOperational) {
        // Production'da istemciye genel mesaj dönüyoruz; gerçek sebep yalnızca sunucu loglarında görünür.
        console.error(`[${req.method} ${req.originalUrl}] ${err.name}: ${err.message}`);
    }

    res.status(response.code).send(response);
};

export default errorHandler;
