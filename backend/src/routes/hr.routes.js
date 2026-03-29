import express from 'express';
import {
  getAllInterns,
  getAttendanceLogs,
  getOnboardingStatus
} from '../controllers/hr.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

router.use(verifyToken);
router.use(checkRole(['hr_admin', 'super_admin']));

router.get('/interns',            getAllInterns);
router.get('/attendance',         getAttendanceLogs);
router.get('/onboarding-status',  getOnboardingStatus);

export default router;
