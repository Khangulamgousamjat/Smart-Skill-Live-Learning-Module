import express from 'express';
import {
  generateSkillGapAnalysis,
  generateLecturePrep,
  generateProjectFeedback,
  generateGenericResponse
} from '../controllers/ai.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/skill-gap/:internId', generateSkillGapAnalysis);
router.post('/lecture-prep', generateLecturePrep);
router.post('/review-project', generateProjectFeedback);
router.post('/ask', generateGenericResponse);

export default router;
