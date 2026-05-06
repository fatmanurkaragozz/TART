import express from 'express';
import AdminController from '../controllers/AdminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', AdminController.getStats);
router.get('/users', AdminController.getAllUsers);
router.delete('/users/:id', AdminController.deleteUser);

export default router;
