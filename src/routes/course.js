import {Router} from 'express';
import { createCourse, readCourse , showCourse , editCourse} from '../services/course.js';

const router= Router();

router.post('/' , createCourse); 
router.get('/', readCourse)
router.get('/:id', showCourse)
router.put('/:id', editCourse)


export default router;