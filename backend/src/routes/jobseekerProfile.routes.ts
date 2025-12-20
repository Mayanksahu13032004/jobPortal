import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import {
  createOrUpdateJobseekerProfile,
  getMyJobseekerProfile
} from '../controllers/jobseekerProfile.controller';
import { uploadResume } from '../middleware/upload.middleware';

const router = Router();

router.post(
  '/',
  auth,
  authorizeRoles('jobseeker'),
  uploadResume.single('resume'),
  createOrUpdateJobseekerProfile
);

router.get(
  '/me',
  auth,
  authorizeRoles('jobseeker'),
  getMyJobseekerProfile
);

export default router;
