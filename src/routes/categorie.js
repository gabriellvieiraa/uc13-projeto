import { Router } from 'express';
import { createCategorie } from '../services/categorie';

const router = Router();

router.post('/', createCategorie);  //create e post são a mesma coisa 