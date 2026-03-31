import express from 'express';
import { getUsers, getUserById } from '../controllers/user.controller.js';
// verifyToken and checkRole would be used here in a real app
// For now, following the pattern of providing the route

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);

export default router;
