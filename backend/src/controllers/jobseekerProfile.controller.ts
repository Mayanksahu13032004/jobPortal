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
        // resumeUrl: resumePath
        ...(resumePath && { resumeUrl: resumePath })

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



export const getApplicantProfile = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params; // get userId from route

  try {
    const profile = await JobseekerProfile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: 'Applicant profile not found' });
    }

    // Only return the fields you want
    res.json({
      phone: profile.phone,
      location: profile.location,
      skills: profile.skills,
      experience: profile.experience,
      resumeUrl: profile.resumeUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
