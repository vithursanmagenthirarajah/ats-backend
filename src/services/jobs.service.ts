import { prisma } from '../prisma/client';
import { EmploymentType } from '@prisma/client';

interface JobInput {
  title: string;
  description: string;
  location?: string;
  employmentType: EmploymentType;
  isActive: boolean;
}

export async function listJobs(userId: number, activeOnly?: boolean) {
  return prisma.job.findMany({
    where: {
      createdById: userId,
      ...(activeOnly ? { isActive: true } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getJobById(userId: number, jobId: number) {
  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      createdById: userId,
    },
  });
  if (!job) {
    throw Object.assign(new Error('Job not found'), { status: 404 });
  }
  return job;
}

export async function createJob(userId: number, data: JobInput) {
  return prisma.job.create({
    data: {
      ...data,
      createdById: userId,
    },
  });
}

export async function updateJob(userId: number, jobId: number, data: JobInput) {
  await getJobById(userId, jobId);
  return prisma.job.update({
    where: { id: jobId },
    data,
  });
}
