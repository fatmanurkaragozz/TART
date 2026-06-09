import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import RecommendationController from '../controllers/RecommendationController.js';

const router = express.Router();

/**
 * @route   GET /api/v1/recommendations
 * @desc    Genel önerileri getir (Ana sayfa)
 * @access  Private
 */
router.get('/', protect, RecommendationController.getGeneralRecommendations);

/**
 * @route   GET /api/v1/recommendations/discussion/:discussionId
 * @desc    Tartışmaya özel önerileri getir
 * @access  Private
 */
router.get('/discussion/:discussionId', protect, RecommendationController.getDiscussionRecommendations);

/**
 * @route   POST /api/v1/recommendations
 * @desc    Yeni öneri ekle (kullanıcı tarafından)
 * @access  Private
 */
router.post('/', protect, RecommendationController.createRecommendation);

export default router;
