import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import discussionRoutes from './routes/discussionRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import ApiError from './utils/ApiError.js';

const app = express();

// 1. Güvenlik Başlıkları (Helmet)
app.use(helmet());

// 2. HTTP İstek Loglama (Morgan)
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// 3. CORS Yapılandırması
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// 4. JSON Body Parser
app.use(express.json({ limit: '10kb' })); 

// 5. Rotalar
app.use('/api/v1/discussions', discussionRoutes);

// 6. 404
app.use((req, res, next) => {
    next(new ApiError(404, `Sayfa bulunamadı: ${req.originalUrl}`));
});

app.use(errorHandler);

export default app;
