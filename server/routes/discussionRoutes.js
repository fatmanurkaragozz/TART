import express from 'express';
import DiscussionController from '../controllers/DiscussionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(DiscussionController.getDiscussions)
    .post(protect, DiscussionController.createDiscussion);

router.route('/:id')
    .get(DiscussionController.getDiscussionById)
    .delete(protect, DiscussionController.deleteDiscussion);

router.route('/:id/vote')
    .post(protect, DiscussionController.voteDiscussion);

export default router;

