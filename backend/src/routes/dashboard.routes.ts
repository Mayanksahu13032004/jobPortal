import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import {
  jobseekerDashboard,
  employerDashboard
} from '../controllers/dashboard.controller';

const router = Router();

// Jobseeker dashboard
router.get(
  '/jobseeker',
  auth,
  authorizeRoles('jobseeker'),
  jobseekerDashboard
);

// Employer dashboard
router.get(
  '/employer',
  auth,
  authorizeRoles('employer'),
  employerDashboard
);

export default router;
