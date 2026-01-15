import { Request,Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import JobApplication from '../models/JobApplication';
import Job from '../models/Job';

// APPLY FOR JOB (Jobseeker)
export const applyForJob = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const jobId = req.params.jobId;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const application = await JobApplication.create({
      job: jobId,
      applicant: req.user._id
    });

    res.status(201).json({
      message: 'Job applied successfully',
      application
    });
  } 
  catch (error: any) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: 'Already applied for this job' });
    }

    res.status(500).json({ message: 'Job application failed' });
  }
};


// JOBSEEKER: View my applications
export const getMyApplications = async (
  req: AuthRequest,
  res: Response
) => {
  const applications = await JobApplication.find({
    applicant: req.user?._id
  }).populate('job');

  res.json(applications);
};

// EMPLOYER: View applicants for a job
export const getApplicantsForJob = async (
  req: AuthRequest,
  res: Response
) => {
  const jobId = req.params.jobId;

  const applications = await JobApplication.find({ job: jobId })
    .populate('applicant', 'name email')
    .populate('job', 'title location');

  res.json(applications);
};



export const updateApplicationStatus = async (req: Request, res: Response) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  if (!['applied', 'accepted', 'rejected'].includes(status.toLowerCase())) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const application = await JobApplication.findById(applicationId);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = status.toLowerCase();
    await application.save();

    res.json({ message: 'Status updated successfully', application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
