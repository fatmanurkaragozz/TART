import express from 'express';
import UserController from '../controllers/UserController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/v1/users/me
 * @desc    Giriş yapmış kullanıcının profilini ve tartışmalarını getir
 * @access  Private
 */
router.get('/me', protect, UserController.getMe);
router.get('/suggested', protect, UserController.getSuggestedUsers);
router.get('/:id', protect, UserController.getUserProfile);

/**
 * @route   PATCH /api/v1/users/me
 * @desc    Kullanıcı profilini güncelle
 * @access  Private
 */
router.patch('/me', protect, UserController.updateMe);

// Takip Sistemi
router.post('/:id/follow', protect, UserController.followUser);
router.delete('/:id/follow', protect, UserController.unfollowUser);

export default router;
