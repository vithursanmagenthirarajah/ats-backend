import { Router } from 'express';
import {
  createJobHandler,
  getJobHandler,
  listJobsHandler,
  updateJobHandler,
} from '../controllers/jobs.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', listJobsHandler);
router.get('/:jobId', getJobHandler);
router.post('/', createJobHandler);
router.put('/:jobId', updateJobHandler);

export default router;
