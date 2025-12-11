import { prisma } from '../prisma/client';
import { QuestionType } from '@prisma/client';
import { getJobById } from './jobs.service';

export interface QuestionInput {
  label: string;
  fieldKey: string;
  type: QuestionType;
  isRequired: boolean;
  options: string[] | null;
  order: number;
}

export async function getQuestionsForJob(userId: number, jobId: number) {
  await getJobById(userId, jobId);
  return prisma.jobQuestion.findMany({
    where: { jobId },
    orderBy: { order: 'asc' },
  });
}

export async function replaceQuestionsForJob(userId: number, jobId: number, questions: QuestionInput[]) {
  await getJobById(userId, jobId);

  // Delete existing questions then recreate (simpler for MVP)
  await prisma.jobQuestion.deleteMany({
    where: { jobId },
  });

  if (!questions || questions.length === 0) {
    return [];
  }

  const created = await prisma.$transaction(
    questions.map((q) =>
      prisma.jobQuestion.create({
        data: {
          jobId,
          label: q.label,
          fieldKey: q.fieldKey,
          type: q.type,
          isRequired: q.isRequired,
          options: q.options ? q.options : undefined,
          order: q.order,
        },
      })
    )
  );

  return created;
}
