import express from 'express';
import { createContent, uploadContentFiles } from '../controller/contentController.js';
// import { createContent, uploadContentFiles } from '../controllers/contentController.js';

const contentRouter = express.Router();

// Create new content
contentRouter.post('/', uploadContentFiles, createContent);



export default contentRouter;