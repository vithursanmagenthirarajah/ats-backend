import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/client';
import { createPublicApplication } from '../services/applications.service';

export async function getPublicJobHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const jobId = Number(req.params.jobId);
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({
      job: {
        id: job.id,
        title: job.title,
        description: job.description,
        location: job.location,
        employmentType: job.employmentType,
      },
      questions: job.questions.map((q) => ({
        id: q.id,
        label: q.label,
        fieldKey: q.fieldKey,
        type: q.type,
        isRequired: q.isRequired,
        options: q.options,
        order: q.order,
      })),
    });
  } catch (err) {
    next(err);
  }
}

export async function submitPublicApplicationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const jobId = Number(req.params.jobId);
    const { candidateName, candidateEmail, candidatePhone, answers } = req.body;

    if (!candidateName || !candidateEmail) {
      return res.status(400).json({ message: 'candidateName and candidateEmail are required' });
    }

    const application = await createPublicApplication(jobId, {
      candidateName,
      candidateEmail,
      candidatePhone,
      answers: Array.isArray(answers) ? answers : [],
    });

    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
}
