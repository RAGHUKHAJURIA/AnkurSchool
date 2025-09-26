import express from 'express';
import {
    submitAdmissionForm,
    checkAdmissionStatus,
    getAllAdmissionRequests,
    getAdmissionRequest
} from '../controller/admissionController.js';

const admissionRouter = express.Router();

// Test route
admissionRouter.get('/test', (req, res) => {
    res.json({ success: true, message: 'Admission routes are working!' });
});

// Student routes (public)
admissionRouter.post('/apply', submitAdmissionForm);
admissionRouter.get('/status/:id', checkAdmissionStatus);

// Admin routes (protected - add authentication middleware as needed)
admissionRouter.get('/requests', getAllAdmissionRequests);
admissionRouter.get('/request/:id', getAdmissionRequest);

export default admissionRouter;
