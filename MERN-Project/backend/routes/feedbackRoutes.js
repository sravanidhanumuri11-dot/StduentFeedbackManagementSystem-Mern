import express from 'express';
import { createFeedback, getMyFeedbacks, deleteMyFeedback } from '../controllers/feedbackController.js';
import { protect, studentOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, studentOnly, createFeedback);
router.get('/my', protect, studentOnly, getMyFeedbacks);
router.delete('/:id', protect, studentOnly, deleteMyFeedback);

export default router;
