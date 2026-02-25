import { Router } from 'express'

import { createCompanie } from '../services/companie.js';


const router = Router();

router.post('/',createCompanie); //create e post são a mesma coisa

export default router;