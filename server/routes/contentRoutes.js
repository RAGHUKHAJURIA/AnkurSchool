import express from 'express';
import { createContent, uploadContentFiles, getContentByType, getAllContent, getContentById, updateContent, deleteContent, serveFile, downloadFile } from '../controller/contentController.js';
import axios from 'axios'

const contentRouter = express.Router();

// Create new content (GridFS file IDs are sent in request body)
contentRouter.post('/', createContent);

// Get all content with filtering
contentRouter.get('/', getAllContent);

// File serving routes
contentRouter.get('/files/:filename', serveFile);
contentRouter.get('/download/:filename', downloadFile);

// Get content by type
contentRouter.get('/type/:type', getContentByType);

contentRouter.get('/id/:id', getContentById);

contentRouter.put('/:id', updateContent);

contentRouter.delete('/:id', deleteContent);




export default contentRouter;