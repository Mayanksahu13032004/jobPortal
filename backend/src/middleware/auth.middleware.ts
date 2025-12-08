import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({ message: 'User no longer exists' });
      return;
    }

    req.user = user;

    next();
  } catch (err) {
    console.error('Auth middleware error:', (err as Error).message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
