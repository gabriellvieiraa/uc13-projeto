import { Router } from 'express';
import { createCategorie, readCategorie, showCategorie } from '../services/categorie.js';

const router = Router();

router.post('/', createCategorie);  //create e post são a mesma coisa 
router.get('/', readCategorie);
router.get('/:id', showCategorie);

export default router;