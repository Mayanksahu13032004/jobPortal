import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import {
  createOrUpdateEmployerProfile,
  getMyEmployerProfile
} from '../controllers/employerProfile.controller';

const router = Router();

router.post(
  '/',
  auth,
  authorizeRoles('employer'),
  createOrUpdateEmployerProfile
);

router.get(
  '/me',
  auth,
  authorizeRoles('employer'),
  getMyEmployerProfile
);

export default router;
