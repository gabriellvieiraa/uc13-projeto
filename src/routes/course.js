import {Router} from 'express';
import { createCourse, readCourse , showCourse} from '../services/course.js';

const router= Router();

router.post('/' , createCourse); 
router.get('/', readCourse)
router.get('/:id', showCourse)


export default router;