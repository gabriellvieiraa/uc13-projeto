import { Router } from 'express';
<<<<<<< HEAD
import { createCategorie, readCategorie } from '../services/categorie.js';
=======
import { createCategorie, readCategorie, showCategorie, editCategorie } from '../services/categorie.js';
>>>>>>> 604e07573747338726f3283ddaf0292407dcbed7

const router = Router();

router.post('/', createCategorie);  //create e post são a mesma coisa 
<<<<<<< HEAD
router.get('/', readCategorie);
=======
router.get('/', readCategorie);     // lê os dados de uma fonte de entrada
router.get('/:id', showCategorie);  // exibe o componente html q esta oculto
router.put('/:id', editCategorie);
>>>>>>> 604e07573747338726f3283ddaf0292407dcbed7

export default router;