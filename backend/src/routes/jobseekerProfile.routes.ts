import { Router } from 'express';
import multer from 'multer';
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
  (req, res, next) => {
    uploadResume.single('resume')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      }
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  createOrUpdateJobseekerProfile
);

router.get(
  '/me',
  auth,
  authorizeRoles('jobseeker'),
  getMyJobseekerProfile
);

export default router;
