import { Router } from 'express';
import { createCategorie, readCategorie } from '../services/categorie.js';

const router = Router();

router.post('/', createCategorie);  //create e post são a mesma coisa 
router.get('/', readCategorie);

export default router;