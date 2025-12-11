import { Request, Response, NextFunction } from 'express';
import { QuestionType } from '@prisma/client';
import { getQuestionsForJob, replaceQuestionsForJob } from '../services/questions.service';

export async function getQuestionsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const jobId = Number(req.params.jobId);
    const questions = await getQuestionsForJob(userId, jobId);
    res.json(questions);
  } catch (err) {
    next(err);
  }
}

export async function replaceQuestionsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const jobId = Number(req.params.jobId);
    const { questions } = req.body;

    if (!Array.isArray(questions)) {
      return res.status(400).json({ message: 'questions array is required' });
    }

    const normalized = questions.map((q: any, index: number) => ({
      label: q.label,
      fieldKey: q.fieldKey,
      type: q.type as QuestionType,
      isRequired: !!q.isRequired,
      options: q.options ?? null,
      order: q.order ?? index + 1,
    }));

    const result = await replaceQuestionsForJob(userId, jobId, normalized);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
