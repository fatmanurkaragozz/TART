import express from 'express';
import ContactController from '../controllers/ContactController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', ContactController.sendMessage);

// Admin rotaları
router.use(restrictTo('admin'));

router.get('/', ContactController.getAllMessages);
router.put('/:id/read', ContactController.markAsRead);

export default router;
