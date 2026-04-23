import { Router } from 'express';
import { createCategorie, editCategorie, readCategorie, showCategorie, deleteCategorie } from '../services/categorie.js';
import authMiddleware from '../middlewares/auth.js';

const router = Router();

router.post('/', authMiddleware, createCategorie);
router.put('/:id', authMiddleware, editCategorie);
router.delete('/:id', authMiddleware, deleteCategorie);

router.get('/', readCategorie);
router.get('/:id', showCategorie); // Corrigido de '/id' para '/:id'

export default router;