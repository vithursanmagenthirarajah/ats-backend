import { prisma } from '../prisma/client';
import { ApplicationStatus } from '@prisma/client';
import { getJobById } from './jobs.service';

export interface PublicApplicationInput {
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  answers: { questionId: number; value: string }[];
}

export async function createPublicApplication(jobId: number, input: PublicApplicationInput) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { questions: true },
  });
  if (!job || !job.isActive) {
    throw Object.assign(new Error('Job not found or inactive'), { status: 404 });
  }

  const requiredQuestionIds = job.questions.filter((q) => q.isRequired).map((q) => q.id);
  const providedIds = new Set(input.answers.map((a) => a.questionId));
  for (const reqId of requiredQuestionIds) {
    if (!providedIds.has(reqId)) {
      throw Object.assign(new Error('Missing answer for required question'), { status: 400 });
    }
  }

  const application = await prisma.application.create({
    data: {
      jobId: job.id,
      candidateName: input.candidateName,
      candidateEmail: input.candidateEmail,
      candidatePhone: input.candidatePhone,
      status: ApplicationStatus.NEW,
    },
  });

  if (input.answers && input.answers.length > 0) {
    await prisma.$transaction(
      input.answers.map((a) =>
        prisma.applicationAnswer.create({
          data: {
            applicationId: application.id,
            jobQuestionId: a.questionId,
            value: a.value,
          },
        })
      )
    );
  }

  return application;
}

export async function listApplicationsForJob(
  userId: number,
  jobId: number,
  status?: ApplicationStatus,
  fieldKey?: string,
  contains?: string
) {
  await getJobById(userId, jobId);

  const where: any = {
    jobId,
  };

  if (status) {
    where.status = status;
  }

  if (fieldKey && contains) {
    where.answers = {
      some: {
        jobQuestion: {
          fieldKey,
        },
        value: {
          contains,
          mode: 'insensitive',
        },
      },
    };
  }

  return prisma.application.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      job: {
        select: { id: true, title: true },
      },
    },
  });
}

export async function getApplicationById(userId: number, applicationId: number) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        select: { id: true, title: true, createdById: true },
      },
      answers: {
        include: {
          jobQuestion: true,
        },
      },
    },
  });

  if (!application || application.job.createdById !== userId) {
    throw Object.assign(new Error('Application not found'), { status: 404 });
  }

  return application;
}

export async function updateApplicationStatus(
  userId: number,
  applicationId: number,
  status: ApplicationStatus
) {
  const app = await getApplicationById(userId, applicationId);

  return prisma.application.update({
    where: { id: app.id },
    data: { status },
  });
}
