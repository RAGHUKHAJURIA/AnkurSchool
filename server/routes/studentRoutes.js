import express from 'express';
import { addStudentData } from '../controller/studentController.js';

const studentRouter = express.Router();

studentRouter.post('/register', addStudentData);

export default studentRouter;