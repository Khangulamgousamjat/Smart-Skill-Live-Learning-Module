import express from 'express';
import {
  registerStudent,
  registerStaff,
  verifyEmail,
  login,
  logout,
  refreshToken
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register/student', registerStudent);
router.post('/register/staff', registerStaff);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

// Placeholders for OTP retry and PW reset
router.post('/resend-otp', (req, res) => res.status(200).json({ success: true, message: 'OTP Resent' }));
router.post('/forgot-password', (req, res) => res.status(200).json({ success: true, message: 'Forgot processed' }));
router.post('/reset-password', (req, res) => res.status(200).json({ success: true, message: 'Reset processed' }));

export default router;
