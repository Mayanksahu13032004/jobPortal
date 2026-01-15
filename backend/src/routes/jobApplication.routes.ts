import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import {
  applyForJob,

  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus
} from '../controllers/jobApplication.controller';

const router = Router();

// Jobseeker applies to job
router.post(
  '/apply/:jobId',
  auth,
  authorizeRoles('jobseeker'),
  applyForJob
);

// Jobseeker views own applications
router.get(
  '/my-applications',
  auth,
  authorizeRoles('jobseeker'),
  getMyApplications
);

// Employer views applicants for a job
router.get(
  '/applicants/:jobId',
  auth,
  authorizeRoles('employer'),
  getApplicantsForJob
);

// In jobApplication.routes.ts
router.patch(
  '/:applicationId/status',
  auth,
  authorizeRoles('employer'),
  updateApplicationStatus
);

export default router;
