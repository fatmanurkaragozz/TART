import express from 'express';
import authController from '../controllers/AuthController.js';

const router = express.Router();

/**
 * @description Kimlik Doğrulama Rotaları
 */
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:resetToken', authController.resetPassword);
router.get('/ping', (req, res) => res.json({ message: 'pong' }));

export default router;
