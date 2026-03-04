import { Router } from 'express'

import { createCompanie, readCompanie } from '../services/companie.js';


const router = Router();

router.post('/', createCompanie); //create e post são a mesma coisa
router.get('/', readCompanie);

export default router;