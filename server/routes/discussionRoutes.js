import express from 'express';
import DiscussionController from '../controllers/DiscussionController.js';

const router = express.Router();

router.route('/')
    .get(DiscussionController.getDiscussions)
    .post(DiscussionController.createDiscussion);

export default router;
