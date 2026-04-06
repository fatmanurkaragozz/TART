import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import CommentController from '../controllers/CommentController.js';

const router = express.Router();

/**
 * @route   POST /api/v1/comments
 * @desc    Yeni Yorum Ekle
 * @access  Private
 */
router.post('/', protect, CommentController.addComment);

/**
 * @route   DELETE /api/v1/comments/:id
 * @desc    Yorum Sil
 * @access  Private (Sahibi veya Admin)
 */
router.delete('/:id', protect, CommentController.deleteComment);

export default router;
