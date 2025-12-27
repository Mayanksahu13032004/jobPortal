import { Request, Response } from 'express';
import Job from '../models/Job';
import { AuthRequest } from '../middleware/auth.middleware';

// CREATE JOB (Employer only)
export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      title,
      description,
      qualifications,
      responsibilities,
      location,
      salaryMin,
      salaryMax
    } = req.body;

    const job = await Job.create({
      employer: req.user._id,
      title,
      description,
      qualifications,
      responsibilities,
      location,
      salaryMin,
      salaryMax
    });

    res.status(201).json({ message: 'Job created', job });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create job' });
  }
};

// GET ALL JOBS (Public)
export const getAllJobs = async (_req: Request, res: Response) => {
  const jobs = await Job.find().populate('employer', 'name email');
  res.json(jobs);
};

// GET SINGLE JOB
export const getJobById = async (req: Request, res: Response) => {
  const job = await Job.findById(req.params.id).populate(
    'employer',
    'name email'
  );

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  res.json(job);
};

// UPDATE JOB (Employer only)
export const updateJob = async (req: AuthRequest, res: Response) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  if (job.employer.toString() !== req.user?._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  Object.assign(job, req.body);
  await job.save();

  res.json({ message: 'Job updated', job });
};

// DELETE JOB (Employer only)
export const deleteJob = async (req: AuthRequest, res: Response) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  if (job.employer.toString() !== req.user?._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  await job.deleteOne();
  res.json({ message: 'Job deleted' });
};

// SEARCH JOBS (Task 4)
export const searchJobs = async (req: Request, res: Response) => {
  try {
    const { keyword, location, minSalary, maxSalary } = req.query;

    const query: any = {};

    // Keyword search (title + description)
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Salary filter
    if (minSalary || maxSalary) {
      query.salaryMin = {};
      if (minSalary) query.salaryMin.$gte = Number(minSalary);
      if (maxSalary) query.salaryMin.$lte = Number(maxSalary);
    }

    const jobs = await Job.find(query).populate(
      'employer',
      'name email'
    );

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Job search failed' });
  }
};
