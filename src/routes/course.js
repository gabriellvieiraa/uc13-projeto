import {Router} from 'express';
import { createCourse, readCourse , showCourse , editCourse,deleteCourse} from '../services/course.js';
import authMiddleware from '../middlewares/auth.js';

const router= Router();

router.post('/' , authMiddleware, createCourse); 
router.get('/', readCourse)
router.get('/:id', showCourse)
router.put('/:id', authMiddleware, editCourse)
router.delete('/:id', authMiddleware, deleteCourse)


export default router;