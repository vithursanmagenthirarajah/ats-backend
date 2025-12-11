import { Request, Response, NextFunction } from 'express';
import { EmploymentType } from '@prisma/client';
import { createJob, getJobById, listJobs, updateJob } from '../services/jobs.service';

export async function listJobsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const activeOnly = req.query.activeOnly === 'true';
    const jobs = await listJobs(userId, activeOnly);
    res.json(jobs);
  } catch (err) {
    next(err);
  }
}

export async function getJobHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const jobId = Number(req.params.jobId);
    const job = await getJobById(userId, jobId);
    res.json(job);
  } catch (err) {
    next(err);
  }
}

export async function createJobHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { title, description, location, employmentType, isActive } = req.body;

    if (!title || !description || !employmentType) {
      return res.status(400).json({ message: 'title, description, employmentType are required' });
    }

    const job = await createJob(userId, {
      title,
      description,
      location,
      employmentType: employmentType as EmploymentType,
      isActive: isActive ?? true,
    });

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
}

export async function updateJobHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const jobId = Number(req.params.jobId);
    const { title, description, location, employmentType, isActive } = req.body;

    if (!title || !description || !employmentType) {
      return res.status(400).json({ message: 'title, description, employmentType are required' });
    }

    const job = await updateJob(userId, jobId, {
      title,
      description,
      location,
      employmentType: employmentType as EmploymentType,
      isActive: isActive ?? true,
    });

    res.json(job);
  } catch (err) {
    next(err);
  }
}
