import express from 'express';
import {
  getEmployees,
  getEmployeeById,
  verifyEmployee,
  createEmployee,
  updateEmployee,
  updateEmployeeStatus
} from '../controllers/employeeController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public route for QR verification
router.get('/verify/:employeeId', verifyEmployee);

// Protected Admin routes
router.route('/')
  .get(protect, adminOnly, getEmployees)
  .post(protect, adminOnly, createEmployee);

router.route('/:id')
  .get(protect, adminOnly, getEmployeeById)
  .put(protect, adminOnly, updateEmployee);

router.patch('/:id/status', protect, adminOnly, updateEmployeeStatus);

export default router;
