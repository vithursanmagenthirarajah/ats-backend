import { Router } from 'express';
import {
  getPublicJobHandler,
  submitPublicApplicationHandler,
} from '../controllers/public.controller';

const router = Router();

router.get('/jobs/:jobId', getPublicJobHandler);
router.post('/jobs/:jobId/applications', submitPublicApplicationHandler);

export default router;
