import { Router } from 'express'

import { createCompanie, editCompanie, readCompanie, showCompanie, deleteCompanie } from '../services/companie.js';


const router = Router();

router.post('/', createCompanie); //create e post são a mesma coisa
router.get('/', readCompanie);
router.get('/:id', showCompanie);
router.put('/:id', editCompanie);
router.delete('/:id', deleteCompanie);



export default router;
