import express from 'express';
import authController from '../controllers/AuthController.js';

const router = express.Router();

/**
 * @description Kimlik Doğrulama Rotaları
 */
router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;
