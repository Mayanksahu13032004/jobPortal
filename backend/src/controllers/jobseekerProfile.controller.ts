import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import JobseekerProfile from '../models/JobseekerProfile';

export const createOrUpdateJobseekerProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { phone, location, skills, experience } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const resumePath = req.file ? req.file.path : undefined;

    const profile = await JobseekerProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        phone,
        location,
        skills: skills ? skills.split(',') : [],
        experience,
        resumeUrl: resumePath
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Profile saved', profile });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyJobseekerProfile = async (
  req: AuthRequest,
  res: Response
) => {
  const profile = await JobseekerProfile.findOne({
    user: req.user?._id
  });

  res.json(profile);
};
