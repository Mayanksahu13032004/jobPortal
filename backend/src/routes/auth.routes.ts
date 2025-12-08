import { Router } from 'express';
import {
  jobseekerSignup,
  employerSignup,
  jobseekerLogin,
  employerLogin,
  getMe
} from '../controllers/auth.controller';
import { auth } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();

// Jobseeker auth
router.post('/jobseeker/signup', jobseekerSignup);
router.post('/jobseeker/login', jobseekerLogin);

// Employer auth
router.post('/employer/signup', employerSignup);
router.post('/employer/login', employerLogin);

// Current user
router.get('/me', auth, getMe);

// Example role-protected routes
router.get('/jobseeker/only', auth, authorizeRoles('jobseeker'), (req, res) => {
  res.json({ message: 'Hello Jobseeker, this is a protected route.' });
});

router.get('/employer/only', auth, authorizeRoles('employer'), (req, res) => {
  res.json({ message: 'Hello Employer, this is a protected route.' });
});

export default router;
