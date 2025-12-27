import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Job from '../models/Job';
import JobApplication from '../models/JobApplication';
import JobseekerProfile from '../models/JobseekerProfile';
import EmployerProfile from '../models/EmployerProfile';

/* ===========================
   JOBSEEKER DASHBOARD
=========================== */
export const jobseekerDashboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id;

    const profile = await JobseekerProfile.findOne({ user: userId });

    const applications = await JobApplication.find({
      applicant: userId
    })
      .populate('job', 'title location')
      .sort({ createdAt: -1 });

    res.json({
      profile,
      totalApplications: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load dashboard' });
  }
};

/* ===========================
   EMPLOYER DASHBOARD
=========================== */
export const employerDashboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id;

    const profile = await EmployerProfile.findOne({ user: userId });

    const jobs = await Job.find({ employer: userId });

    const jobIds = jobs.map(job => job._id);

    const applications = await JobApplication.find({
      job: { $in: jobIds }
    });

    res.json({
      profile,
      totalJobs: jobs.length,
      totalApplications: applications.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load dashboard' });
  }
};
