import { Router } from 'express';
import { getUsers } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);
router.get('/', getUsers);

export default router;