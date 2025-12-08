import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser, UserRole } from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';

const createToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

const signup = async (
  req: Request,
  res: Response,
  role: UserRole
): Promise<void> => {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!name || !email || !password) {
      res
        .status(400)
        .json({ message: 'Name, email and password are required' });
      return;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(409).json({ message: 'Email already in use' });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    const token = createToken(user);

    res.status(201).json({
      message: `${role} registered successfully`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

const login = async (
  req: Request,
  res: Response,
  role: UserRole
): Promise<void> => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email, role });

    if (!user) {
      res.status(400).json({ message: `Invalid credentials for ${role}` });
      return;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const token = createToken(user);

    res.status(200).json({
      message: `${role} logged in successfully`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const jobseekerSignup = (req: Request, res: Response): Promise<void> =>
  signup(req, res, 'jobseeker');

export const employerSignup = (req: Request, res: Response): Promise<void> =>
  signup(req, res, 'employer');

export const jobseekerLogin = (req: Request, res: Response): Promise<void> =>
  login(req, res, 'jobseeker');

export const employerLogin = (req: Request, res: Response): Promise<void> =>
  login(req, res, 'employer');

export const getMe = (req: Request, res: Response): void => {
  const authReq = req as AuthRequest;

  if (!authReq.user) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  res.status(200).json({
    user: authReq.user
  });
};
