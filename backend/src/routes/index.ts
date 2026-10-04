import { Router } from 'express';
import { taskRoutes } from './taskRoutes';
import { categoryRoutes } from './categoryRoutes';

const router = Router();

router.use('/tasks', taskRoutes);
router.use('/categories', categoryRoutes);

export { router as appRoutes };
