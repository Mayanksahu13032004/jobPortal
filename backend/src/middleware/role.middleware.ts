import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { UserRole } from '../models/User';

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: 'Access denied: insufficient permissions' });
      return;
    }

    next();
  };
};
