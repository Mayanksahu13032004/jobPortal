import { Router } from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob
} from '../controllers/job.controller';
import { auth } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import { searchJobs } from '../controllers/job.controller';

const router = Router();

// Public
router.get('/search', searchJobs);
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Employer only
router.post('/', auth, authorizeRoles('employer'), createJob);
router.put('/:id', auth, authorizeRoles('employer'), updateJob);
router.delete('/:id', auth, authorizeRoles('employer'), deleteJob);

export default router;
