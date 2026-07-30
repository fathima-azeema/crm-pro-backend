import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,       // NEW
  changePassword,      // NEW
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/update-profile', authenticate, updateProfile);     // NEW
router.put('/change-password', authenticate, changePassword);   // NEW

export default router;