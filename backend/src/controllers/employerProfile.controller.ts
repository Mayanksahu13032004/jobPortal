import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import EmployerProfile from '../models/EmployerProfile';

export const createOrUpdateEmployerProfile = async (
  req: AuthRequest,
  res: Response
) => {
  const {
    companyName,
    website,
    industry,
    contactEmail,
    contactPhone
  } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const profile = await EmployerProfile.findOneAndUpdate(
    { user: req.user._id },
    {
      companyName,
      website,
      industry,
      contactEmail,
      contactPhone
    },
    { upsert: true, new: true }
  );

  res.status(200).json({ message: 'Profile saved', profile });
};

export const getMyEmployerProfile = async (
  req: AuthRequest,
  res: Response
) => {
  const profile = await EmployerProfile.findOne({
    user: req.user?._id
  });

  res.json(profile);
};
