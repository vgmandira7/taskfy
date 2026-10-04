import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';

const router = Router();

router.get('/', CategoryController.index);
router.get('/:id', CategoryController.show);
router.post('/', CategoryController.create);
router.put('/:id', CategoryController.update);
router.patch('/:id', CategoryController.update);
router.delete('/:id', CategoryController.delete);

export { router as categoryRoutes };
