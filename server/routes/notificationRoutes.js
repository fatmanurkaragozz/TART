import express from 'express';
import NotificationController from '../controllers/NotificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tüm rotalar korumalı (auth gerektirir)
router.use(protect);

router.get('/', NotificationController.getMyNotifications);
router.put('/mark-all-read', NotificationController.markAllAsRead);
router.put('/:id/read', NotificationController.markAsRead);
router.delete('/:id', NotificationController.deleteNotification);

export default router;
