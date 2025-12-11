import { Router } from 'express';
import {
  getApplicationHandler,
  listApplicationsHandler,
  updateApplicationStatusHandler,
} from '../controllers/applications.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', listApplicationsHandler);
router.get('/:applicationId', getApplicationHandler);
router.patch('/:applicationId/status', updateApplicationStatusHandler);

export default router;
