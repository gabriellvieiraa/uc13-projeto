import { Router } from 'express';
import { createCategorie } from '../services/categorie.js';

const router = Router();

router.post('/', createCategorie);  //create e post são a mesma coisa 

export default router;