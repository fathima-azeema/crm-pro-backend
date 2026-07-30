import { Router } from 'express';
import { getFollowups, createFollowup, updateFollowup, deleteFollowup } from '../controllers/followupController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router({ mergeParams: true });

router.use(authenticate);
router.get('/', getFollowups);
router.post('/', createFollowup);
router.put('/:id', updateFollowup);
router.delete('/:id', deleteFollowup);

export default router;