import express from 'express';
import { getHelpRequests, createHelpRequest, updateHelpStatus } from '../controllers/help.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/',            getHelpRequests);
router.post('/',           createHelpRequest);
router.patch('/:id/status', updateHelpStatus);

export default router;
