import { Request, Response, NextFunction } from 'express';
import { ApplicationStatus } from '@prisma/client';
import {
  getApplicationById,
  listApplicationsForJob,
  updateApplicationStatus,
} from '../services/applications.service';

export async function listApplicationsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const jobIdParam = req.query.jobId as string | undefined;
    if (!jobIdParam) {
      return res.status(400).json({ message: 'jobId query param is required' });
    }
    const jobId = Number(jobIdParam);

    const statusParam = req.query.status as string | undefined;
    const status = statusParam ? (statusParam as ApplicationStatus) : undefined;

    const fieldKey = req.query.fieldKey as string | undefined;
    const contains = req.query.contains as string | undefined;

    const applications = await listApplicationsForJob(userId, jobId, status, fieldKey, contains);
    res.json(applications);
  } catch (err) {
    next(err);
  }
}

export async function getApplicationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const applicationId = Number(req.params.applicationId);
    const application = await getApplicationById(userId, applicationId);

    const response = {
      id: application.id,
      job: {
        id: application.job.id,
        title: application.job.title,
      },
      candidateName: application.candidateName,
      candidateEmail: application.candidateEmail,
      candidatePhone: application.candidatePhone,
      status: application.status,
      createdAt: application.createdAt,
      answers: application.answers.map((a) => ({
        questionId: a.jobQuestionId,
        label: a.jobQuestion.label,
        fieldKey: a.jobQuestion.fieldKey,
        type: a.jobQuestion.type,
        value: a.value,
      })),
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function updateApplicationStatusHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const applicationId = Number(req.params.applicationId);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'status is required' });
    }

    const updated = await updateApplicationStatus(userId, applicationId, status as ApplicationStatus);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}
