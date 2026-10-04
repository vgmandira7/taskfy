import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';

const router = Router();

router.get('/', TaskController.index);
router.get('/:id', TaskController.show);
router.post('/', TaskController.create);
router.put('/:id', TaskController.update);
router.patch('/:id', TaskController.update);
router.delete('/:id', TaskController.delete);

export { router as taskRoutes };
