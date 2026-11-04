import express from 'express';
import {
  getStats,
  getAllFeedbacks,
  deleteFeedback,
  getAllStudents,
  exportFeedbacks
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/feedbacks', getAllFeedbacks);
router.delete('/feedbacks/:id', deleteFeedback);
router.get('/students', getAllStudents);
router.get('/export', exportFeedbacks);

export default router;
