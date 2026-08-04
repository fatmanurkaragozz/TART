import express from 'express';
import authController from '../controllers/AuthController.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * @description Kimlik Doğrulama Rotaları
 */
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password/:resetToken', authLimiter, authController.resetPassword);
router.get('/ping', (req, res) => res.json({ message: 'pong' }));

export default router;
