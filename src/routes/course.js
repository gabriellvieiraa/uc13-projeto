import {Router} from 'express';
import { createCourse, readCourse} from '../services/course.js';

const router= Router();

router.post('/' , createCourse); 
router.get('/', readCourse)


export default router;