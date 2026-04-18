import { Router } from 'express'

import { createCompanie, editCompanie, readCompanie, showCompanie, deleteCompanie } from '../services/companie.js';

import authMiddleware from '../middlewares/auth.js';

const router = Router();

router.post('/', authMiddleware, createCompanie); //create e post são a mesma coisa
router.put('/:id', authMiddleware, editCompanie);
router.delete('/:id', authMiddleware, deleteCompanie);

router.get('/', readCompanie);
router.get('/:id', showCompanie);

export default router;
