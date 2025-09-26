import express from 'express';
import {
    getAllPendingRequests,
    getPendingRequest,
    approveRequest,
    rejectRequest,
    getAllStudents,
    getStudent,
    updateStudent,
    deleteStudent,
    getDashboardStats,
    testStudentModel,
    createTestStudent,
    addStudent,
    testApprove
} from '../controller/adminController.js';

const adminRouter = express.Router();

// Admin routes (protected by strict admin authentication middleware)
// All routes require admin role and are rate-limited and logged

// Pending Requests Management
adminRouter.get('/requests', getAllPendingRequests);
adminRouter.get('/request/:id', getPendingRequest);
adminRouter.post('/approve/:id', approveRequest);
adminRouter.post('/test-approve/:id', testApprove);
adminRouter.post('/reject/:id', rejectRequest);

// Student Management
adminRouter.get('/students', getAllStudents);
adminRouter.get('/students/:id', getStudent);
adminRouter.put('/students/:id', updateStudent);
adminRouter.delete('/students/:id', deleteStudent);
adminRouter.post('/add-student', addStudent);

// Dashboard and Analytics
adminRouter.get('/dashboard', getDashboardStats);

// Testing endpoints (remove in production)
adminRouter.get('/test-student-model', testStudentModel);
adminRouter.post('/create-test-student', createTestStudent);

export default adminRouter;
