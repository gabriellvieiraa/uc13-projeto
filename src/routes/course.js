import {Router} from 'express';
import { createCourse } from '../services/course.js';

const router= Router();

router.post('/' , createCourse); 


export default router;