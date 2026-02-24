import { Router } from 'express'

import { createCompanie } from "../services/companie";


const router = Router();

router.post('/',createCompanie); //create e post são a mesma coisa

