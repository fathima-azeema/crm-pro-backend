import { Router } from 'express';
import { getDashboardStats, getTaskStats } from '../controllers/reportController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get('/dashboard', getDashboardStats);
router.get('/tasks', getTaskStats);

export default router;