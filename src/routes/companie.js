import { Router } from 'express'

import { createCompanie, editCompanie, readCompanie, showCompanie} from '../services/companie.js';


const router = Router();

router.post('/', createCompanie); //create e post são a mesma coisa
router.get('/', readCompanie);
router.get('/:id', showCompanie);
router.get('/:id', editCompanie);

export default router;
