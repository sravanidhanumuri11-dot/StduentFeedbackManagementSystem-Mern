import express from 'express';
import { registerStudent, loginStudent, loginAdmin, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.post('/admin-login', loginAdmin);
router.get('/me', protect, getMe);

export default router;
