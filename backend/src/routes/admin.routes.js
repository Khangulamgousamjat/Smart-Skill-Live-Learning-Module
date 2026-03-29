import express from 'express';
import {
  getPendingRoleRequests,
  approveRoleRequest,
  rejectRoleRequest,
  getAllUsers,
  toggleUserStatus,
  getAdminAnalytics,
  getDepartments,
  createDepartment,
  deleteDepartment,
  getPlatformSettings,
  updatePlatformSettings,
} from '../controllers/admin.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

// All admin routes require authentication + super_admin role
router.use(verifyToken);
router.use(checkRole(['super_admin']));

// Role Request Management
router.get('/role-requests',               getPendingRoleRequests);
router.patch('/role-requests/:id/approve', approveRoleRequest);
router.patch('/role-requests/:id/reject',  rejectRoleRequest);

// User Management
router.get('/users',                       getAllUsers);
router.patch('/users/:id/toggle-status',   toggleUserStatus);

// Analytics
router.get('/analytics',                   getAdminAnalytics);

// Departments
router.get('/departments',                 getDepartments);
router.post('/departments',                createDepartment);
router.delete('/departments/:id',           deleteDepartment);

// Settings
router.get('/settings',                    getPlatformSettings);
router.patch('/settings',                  updatePlatformSettings);

export default router;
