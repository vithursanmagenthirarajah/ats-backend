import { Router } from 'express';
import {
  getQuestionsHandler,
  replaceQuestionsHandler,
} from '../controllers/questions.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/:jobId/questions', getQuestionsHandler);
router.put('/:jobId/questions', replaceQuestionsHandler);

export default router;
