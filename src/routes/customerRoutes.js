import { Router } from 'express';
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customerController.js';
import { authenticate } from '../middleware/auth.js';
import noteRoutes from './noteRoutes.js';
import followupRoutes from './followupRoutes.js';

const router = Router();
router.use(authenticate);

router.get('/', getCustomers);
router.get('/:id', getCustomer);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

// Nested routes for notes and follow‑ups
router.use('/:customerId/notes', noteRoutes);
router.use('/:customerId/followups', followupRoutes);

export default router;