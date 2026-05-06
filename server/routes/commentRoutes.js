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
router.put('/:id', protect, CommentController.updateComment);
router.delete('/:id', protect, CommentController.deleteComment);

/**
 * @route   POST /api/v1/comments/:id/vote
 * @desc    Yorum Oyla
 * @access  Private
 */
router.post('/:id/vote', protect, CommentController.voteComment);

export default router;
