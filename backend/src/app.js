import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.routes.js';
// other routes placeholders
import adminRoutes from './routes/admin.routes.js';
import hrRoutes from './routes/hr.routes.js';
import managerRoutes from './routes/manager.routes.js';
import expertRoutes from './routes/expert.routes.js';
import studentRoutes from './routes/student.routes.js';
import skillsRoutes from './routes/skills.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import certificateRoutes from './routes/certificate.routes.js';
import evaluationRoutes from './routes/evaluation.routes.js';
import aiRoutes from './routes/ai.routes.js';

const app = express();

// CORS — MUST come before routes
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/expert', expertRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

export default app;
