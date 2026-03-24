import { Router } from 'express';
import { createCategorie, editCategorie, readCategorie, showCategorie, deleteCategorie } from '../services/categorie.js';

const router = Router();

router.post('/', createCategorie);  //create e post são a mesma coisa 
router.get('/', readCategorie);
router.get('/id', showCategorie);
router.put('/:id', editCategorie);
router.delete('/:id', deleteCategorie);

export default router;