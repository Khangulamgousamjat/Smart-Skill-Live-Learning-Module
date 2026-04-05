import express from 'express';
import { 
  getUsers, 
  getUserById, 
  updateProfile, 
  getPublicProfile, 
  getLeaderboard,
  getEducation,
  addEducation,
  deleteEducation} from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Publicly available within app
router.get('/leaderboard', verifyToken, getLeaderboard);
router.get('/public/:id',  verifyToken, getPublicProfile);

// Profile management
// Profile management
router.put('/me',          verifyToken, updateProfile);
router.put('/profile',     verifyToken, updateProfile); // Keep for compatibility

// Education management
router.get('/me/education',      verifyToken, getEducation);
router.post('/me/education',     verifyToken, addEducation);
router.delete('/me/education/:id', verifyToken, deleteEducation);

// Admin / General User views
router.get('/',            getUsers);
router.get('/:id',         getUserById);

export default router;
