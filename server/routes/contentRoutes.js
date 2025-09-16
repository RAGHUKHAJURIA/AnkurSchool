import express from 'express';
import { createContent, uploadContentFiles, getContentByType, getAllContent, getContentById, updateContent, deleteContent, downloadFile } from '../controller/contentController.js';
import axios from 'axios'

const contentRouter = express.Router();

// Create new content
contentRouter.post('/', uploadContentFiles, createContent);

// Get all content with filtering
contentRouter.get('/', getAllContent);

contentRouter.get('/download', downloadFile);

// Get content by type
contentRouter.get('/type/:type', getContentByType);

contentRouter.get('/id/:id', getContentById);

contentRouter.put('/:id', updateContent);

contentRouter.delete('/:id', deleteContent);




export default contentRouter;