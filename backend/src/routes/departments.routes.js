import express from 'express';
import { getDepartments } from '../controllers/departments.controller.js';

const router = express.Router();

// Public — no auth needed for registration form
router.get('/', getDepartments);

export default router;
