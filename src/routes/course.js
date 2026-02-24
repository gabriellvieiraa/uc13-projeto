import {Router} from 'express';
import { createCourse } from '../services/course';

const router= Router();

router.post('/' , createCourse); 