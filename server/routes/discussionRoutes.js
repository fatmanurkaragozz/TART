import express from 'express';
import DiscussionController from '../controllers/DiscussionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Statik/Spesifik Rotalar (Parametreli rotalardan önce gelmeli)
router.get('/trending/list', DiscussionController.getTrending);
router.get('/feed/following', protect, DiscussionController.getFollowingFeed);

// 2. Kök Rota
router.get('/', DiscussionController.getDiscussions);
router.post('/', protect, DiscussionController.createDiscussion);

// 3. Parametreli Rotalar
router.get('/:id', DiscussionController.getDiscussionById);
router.delete('/:id', protect, DiscussionController.deleteDiscussion);
router.post('/:id/vote', protect, DiscussionController.voteDiscussion);

export default router;

