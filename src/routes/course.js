import {Router} from 'express';
import { createCourse, readCourse , showCourse , editCourse,deleteCourse} from '../services/course.js';

const router= Router();

router.post('/' , createCourse); 
router.get('/', readCourse)
router.get('/:id', showCourse)
router.put('/:id', editCourse)
router.delete('/:id', deleteCourse)


export default router;