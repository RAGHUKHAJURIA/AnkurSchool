import express from 'express';
import { createContent, uploadContentFiles, getContentByType, getAllContent } from '../controller/contentController.js';

const contentRouter = express.Router();

// Create new content
contentRouter.post('/', uploadContentFiles, createContent);

// Get all content with filtering
contentRouter.get('/', getAllContent);

// Get content by type
contentRouter.get('/type/:type', getContentByType);

export default contentRouter;