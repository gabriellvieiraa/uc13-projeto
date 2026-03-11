import { Router } from 'express';
import { createCategorie, readCategorie, showCategorie, editCategorie } from '../services/categorie.js';

const router = Router();

router.post('/', createCategorie);  //create e post são a mesma coisa 
router.get('/', readCategorie);     // lê os dados de uma fonte de entrada
router.get('/:id', showCategorie);  // exibe o componente html q esta oculto
router.put('/:id', editCategorie);

export default router;