import { Router } from 'express';
import { getNotes, createNote, deleteNote } from '../controllers/noteController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router({ mergeParams: true }); // to access :customerId from parent route

router.use(authenticate);
router.get('/', getNotes);
router.post('/', createNote);
router.delete('/:id', deleteNote);

export default router;