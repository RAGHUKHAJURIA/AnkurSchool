import PendingRequest from '../models/pendingRequest.js';
import Payment from '../models/payment.js';
import Student from '../models/student.js';
import mongoose from 'mongoose';

// Helper function to handle errors
const handleError = (res, error) => {
    console.error('Error:', error);

    if (error.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: Object.values(error.errors).map(err => err.message)
        });
    }

    if (error.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Invalid ${error.path}: ${error.value}`
        });
    }

    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(409).json({
            success: false,
            message: `Duplicate value for ${field}: ${error.keyValue[field]}`
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Server Error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
};

// GET /admin/requests - Get all pending requests
export const getAllPendingRequests = async (req, res) => {
    try {
        const { status = 'pending', page = 1, limit = 10, sort = '-submittedAt' } = req.query;

        // Build filter
        const filter = { status };

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get requests with pagination (payment system removed)
        const requests = await PendingRequest.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .select('-__v');

        // Get total count
        const total = await PendingRequest.countDocuments(filter);

        // Get statistics
        const stats = await PendingRequest.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            count: requests.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            statistics: stats,
            data: requests
        });

    } catch (error) {
        console.error('Get all pending requests error:', error);
        handleError(res, error);
    }
};

// GET /admin/request/:id - Get specific pending request
export const getPendingRequest = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request ID'
            });
        }

        const request = await PendingRequest.findById(id)
            .select('-__v');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Pending request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: request
        });

    } catch (error) {
        console.error('Get pending request error:', error);
        handleError(res, error);
    }
};

// Simple test endpoint for approval
export const testApprove = async (req, res) => {
    try {
        console.log('=== TEST APPROVE ENDPOINT ===');
        console.log('Request params:', req.params);
        console.log('Request body:', req.body);
        console.log('Request method:', req.method);
        console.log('Request URL:', req.url);

        res.status(200).json({
            success: true,
            message: 'Test approve endpoint is working',
            data: {
                params: req.params,
                body: req.body,
                method: req.method,
                url: req.url
            }
        });
    } catch (error) {
        console.error('Test approve error:', error);
        res.status(500).json({
            success: false,
            message: 'Test approve failed',
            error: error.message
        });
    }
};

// POST /admin/approve/:id - Approve a student request
export const approveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminNotes = '', reviewedBy = 'admin' } = req.body;

        console.log('=== APPROVING REQUEST ===');
        console.log('Request ID:', id);
        console.log('Admin notes:', adminNotes);
        console.log('Reviewed by:', reviewedBy);
        console.log('Request body:', req.body);
        console.log('Request params:', req.params);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log('Invalid ObjectId:', id);
            return res.status(400).json({
                success: false,
                message: 'Invalid request ID'
            });
        }

        // Start a transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Get the pending request
            console.log('Looking for pending request with ID:', id);
            const pendingRequest = await PendingRequest.findById(id).session(session);
            console.log('Found pending request:', pendingRequest ? 'YES' : 'NO');

            if (!pendingRequest) {
                console.log('Pending request not found');
                await session.abortTransaction();
                return res.status(404).json({
                    success: false,
                    message: 'Pending request not found'
                });
            }

            console.log('Pending request data:', JSON.stringify(pendingRequest, null, 2));
            console.log('Pending request status:', pendingRequest.status);

            if (pendingRequest.status !== 'pending') {
                console.log('Request is not pending, status:', pendingRequest.status);
                await session.abortTransaction();
                return res.status(400).json({
                    success: false,
                    message: `Request is already ${pendingRequest.status}`
                });
            }

            // Create student record (payment system removed)
            const studentData = {
                firstName: pendingRequest.firstName,
                lastName: pendingRequest.lastName,
                dateOfBirth: new Date(pendingRequest.dateOfBirth), // Ensure proper date conversion
                age: parseInt(pendingRequest.age) || 0, // Ensure age is a number
                gender: pendingRequest.gender,
                email: pendingRequest.email,
                phone: pendingRequest.phone,
                address: pendingRequest.address,
                currentGrade: pendingRequest.applyingForGrade,
                academicYear: pendingRequest.academicYear,
                parentName: pendingRequest.parentName,
                parentPhone: pendingRequest.parentPhone,
                parentEmail: pendingRequest.parentEmail,
                documents: pendingRequest.documents || [], // Ensure documents array exists
                specialNeeds: pendingRequest.specialNeeds || '',
                medicalConditions: pendingRequest.medicalConditions || '',
                emergencyContact: pendingRequest.emergencyContact || {},
                originalRequestId: pendingRequest._id,
                status: 'active'
            };

            console.log('Creating student with data:', JSON.stringify(studentData, null, 2));

            // Validate the data before saving
            const student = new Student(studentData);

            // Try to validate manually
            try {
                await student.validate();
                console.log('Student validation passed');
            } catch (validationError) {
                console.error('Student validation failed:', validationError.errors);
                console.error('Validation error details:', JSON.stringify(validationError.errors, null, 2));
                throw validationError;
            }

            console.log('About to save student...');
            await student.save({ session });
            console.log('Student saved successfully with ID:', student._id);

            console.log('Student created:', student._id);

            // Update pending request status
            pendingRequest.status = 'approved';
            pendingRequest.reviewedBy = reviewedBy;
            pendingRequest.reviewedAt = new Date();
            pendingRequest.adminNotes = adminNotes;
            await pendingRequest.save({ session });

            // Commit transaction
            await session.commitTransaction();

            console.log('Request approved successfully');

            res.status(200).json({
                success: true,
                message: 'Request approved successfully',
                data: {
                    studentId: student._id,
                    studentId: student.studentId,
                    requestId: pendingRequest._id,
                    status: 'approved'
                }
            });

        } catch (error) {
            await session.abortTransaction();
            console.error('Approval transaction failed:', error);
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                errors: error.errors
            });
            throw error;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error('Approve request error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        if (error.errors) {
            console.error('Error details:', JSON.stringify(error.errors, null, 2));
        }
        handleError(res, error);
    }
};

// POST /admin/reject/:id - Reject a student request
export const rejectRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminNotes = '', reviewedBy = 'admin', refundAmount = 0, refundReason = '' } = req.body;

        console.log('=== REJECTING REQUEST ===');
        console.log('Request ID:', id);
        console.log('Admin notes:', adminNotes);
        console.log('Reviewed by:', reviewedBy);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request ID'
            });
        }

        // Start a transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Get the pending request
            const pendingRequest = await PendingRequest.findById(id).session(session);

            if (!pendingRequest) {
                await session.abortTransaction();
                return res.status(404).json({
                    success: false,
                    message: 'Pending request not found'
                });
            }

            if (pendingRequest.status !== 'pending') {
                await session.abortTransaction();
                return res.status(400).json({
                    success: false,
                    message: `Request is already ${pendingRequest.status}`
                });
            }

            // Update pending request status (payment system removed)
            pendingRequest.status = 'rejected';
            pendingRequest.reviewedBy = reviewedBy;
            pendingRequest.reviewedAt = new Date();
            pendingRequest.adminNotes = adminNotes;
            await pendingRequest.save({ session });

            // Commit transaction
            await session.commitTransaction();

            console.log('Request rejected successfully');

            res.status(200).json({
                success: true,
                message: 'Request rejected successfully',
                data: {
                    requestId: pendingRequest._id,
                    status: 'rejected'
                }
            });

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error('Reject request error:', error);
        handleError(res, error);
    }
};

// POST /admin/add-student - Add student manually
export const addStudent = async (req, res) => {
    try {
        console.log('=== ADDING STUDENT MANUALLY ===');
        console.log('Request body:', JSON.stringify(req.body, null, 2));

        const {
            firstName,
            lastName,
            dateOfBirth,
            age,
            gender,
            email,
            phone,
            address,
            currentGrade,
            academicYear,
            parentName,
            parentPhone,
            parentEmail,
            specialNeeds,
            medicalConditions,
            emergencyContact
        } = req.body;

        // Validate required fields
        const missingFields = [];
        if (!firstName) missingFields.push('firstName');
        if (!lastName) missingFields.push('lastName');
        if (!dateOfBirth) missingFields.push('dateOfBirth');
        if (!gender) missingFields.push('gender');
        if (!email) missingFields.push('email');
        if (!phone) missingFields.push('phone');
        if (!currentGrade) missingFields.push('currentGrade');
        if (!academicYear) missingFields.push('academicYear');
        if (!parentName) missingFields.push('parentName');
        if (!parentPhone) missingFields.push('parentPhone');
        if (!parentEmail) missingFields.push('parentEmail');

        // Validate address fields
        if (!address || !address.street) missingFields.push('address.street');
        if (!address || !address.city) missingFields.push('address.city');
        if (!address || !address.state) missingFields.push('address.state');
        if (!address || !address.zipCode) missingFields.push('address.zipCode');

        if (missingFields.length > 0) {
            console.log('Missing required fields:', missingFields);
            return res.status(400).json({
                success: false,
                message: `Required fields are missing: ${missingFields.join(', ')}`,
                missingFields: missingFields
            });
        }

        // Create student data
        const studentData = {
            firstName,
            lastName,
            dateOfBirth: new Date(dateOfBirth),
            age: parseInt(age) || 0,
            gender,
            email,
            phone,
            address,
            currentGrade,
            academicYear,
            parentName,
            parentPhone,
            parentEmail,
            documents: [],
            specialNeeds: specialNeeds || '',
            medicalConditions: medicalConditions || '',
            emergencyContact: emergencyContact || {},
            status: 'active'
        };

        console.log('Creating student with data:', JSON.stringify(studentData, null, 2));

        // Validate the data before saving
        const student = new Student(studentData);

        // Try to validate manually
        try {
            await student.validate();
            console.log('Student validation passed');
        } catch (validationError) {
            console.error('Student validation failed:', validationError.errors);
            console.error('Validation error details:', JSON.stringify(validationError.errors, null, 2));
            throw validationError;
        }

        await student.save();
        console.log('Student created successfully:', student._id);

        res.status(201).json({
            success: true,
            message: 'Student added successfully',
            data: {
                studentId: student._id,
                studentId: student.studentId,
                fullName: student.fullName
            }
        });

    } catch (error) {
        console.error('Add student error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            errors: error.errors
        });
        handleError(res, error);
    }
};

// PUT /admin/students/:id - Update student
export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        console.log('=== UPDATING STUDENT ===');
        console.log('Student ID:', id);
        console.log('Update data:', JSON.stringify(updateData, null, 2));

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid student ID'
            });
        }

        // Convert dateOfBirth to Date object if provided
        if (updateData.dateOfBirth) {
            updateData.dateOfBirth = new Date(updateData.dateOfBirth);
        }

        // Convert age to number if provided
        if (updateData.age) {
            updateData.age = parseInt(updateData.age) || 0;
        }

        const student = await Student.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        console.log('Student updated successfully:', student._id);

        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: student
        });

    } catch (error) {
        console.error('Update student error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            errors: error.errors
        });
        handleError(res, error);
    }
};

// DELETE /admin/students/:id - Delete student
export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('=== DELETING STUDENT ===');
        console.log('Student ID:', id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid student ID'
            });
        }

        const student = await Student.findByIdAndDelete(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        console.log('Student deleted successfully:', student._id);

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully',
            data: {
                deletedStudentId: student._id,
                studentId: student.studentId,
                fullName: student.fullName
            }
        });

    } catch (error) {
        console.error('Delete student error:', error);
        handleError(res, error);
    }
};

// GET /admin/students/:id - Get single student
export const getStudent = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('=== GETTING STUDENT ===');
        console.log('Student ID:', id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid student ID'
            });
        }

        const student = await Student.findById(id).select('-__v');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        console.log('Student found:', student._id);

        res.status(200).json({
            success: true,
            data: student
        });

    } catch (error) {
        console.error('Get student error:', error);
        handleError(res, error);
    }
};

// GET /admin/students - Get all approved students
// Simple endpoint to create a test student
export const createTestStudent = async (req, res) => {
    try {
        console.log('Creating test student...');

        const testStudentData = {
            firstName: 'Test',
            lastName: 'Student',
            dateOfBirth: new Date('2010-01-01'),
            age: 14,
            gender: 'male',
            email: `test${Date.now()}@example.com`,
            phone: '1234567890',
            address: {
                street: 'Test Street',
                city: 'Test City',
                state: 'Test State',
                zipCode: '12345'
            },
            currentGrade: 'Grade 8',
            academicYear: '2024-25',
            parentName: 'Test Parent',
            parentPhone: '0987654321',
            parentEmail: `parent${Date.now()}@example.com`,
            documents: [],
            status: 'active'
        };

        console.log('Test student data:', JSON.stringify(testStudentData, null, 2));

        const student = new Student(testStudentData);
        await student.save();

        console.log('Test student created successfully:', student._id);

        res.status(200).json({
            success: true,
            message: 'Test student created successfully',
            data: {
                studentId: student._id,
                studentId: student.studentId,
                fullName: student.fullName
            }
        });

    } catch (error) {
        console.error('Test student creation failed:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            errors: error.errors
        });
        res.status(400).json({
            success: false,
            message: 'Test student creation failed',
            error: error.message,
            details: error.errors
        });
    }
};

// Test endpoint to check Student model
export const testStudentModel = async (req, res) => {
    try {
        console.log('Testing Student model...');

        // Test creating a minimal student
        const testStudentData = {
            firstName: 'Test',
            lastName: 'Student',
            dateOfBirth: new Date('2010-01-01'),
            age: 14,
            gender: 'male',
            email: `test${Date.now()}@example.com`, // Unique email
            phone: '1234567890',
            address: {
                street: 'Test Street',
                city: 'Test City',
                state: 'Test State',
                zipCode: '12345'
            },
            currentGrade: 'Grade 8',
            academicYear: '2024-25',
            parentName: 'Test Parent',
            parentPhone: '0987654321',
            parentEmail: `parent${Date.now()}@example.com`, // Unique email
            documents: [],
            status: 'active'
        };

        console.log('Test student data:', JSON.stringify(testStudentData, null, 2));

        const testStudent = new Student(testStudentData);
        await testStudent.validate();

        console.log('Student model validation passed');

        res.status(200).json({
            success: true,
            message: 'Student model is working correctly',
            data: {
                studentId: testStudent.studentId,
                fullName: testStudent.fullName
            }
        });

    } catch (error) {
        console.error('Student model test failed:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            errors: error.errors
        });
        res.status(400).json({
            success: false,
            message: 'Student model test failed',
            error: error.message,
            details: error.errors
        });
    }
};

export const getAllStudents = async (req, res) => {
    try {
        const { status = 'active', page = 1, limit = 10, sort = '-admissionDate' } = req.query;

        // Build filter
        const filter = { status };

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get students with pagination (payment system removed)
        const students = await Student.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .select('-__v');

        // Get total count
        const total = await Student.countDocuments(filter);

        // Get statistics
        const stats = await Student.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            count: students.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            statistics: stats,
            data: students
        });

    } catch (error) {
        console.error('Get all students error:', error);
        handleError(res, error);
    }
};

// GET /admin/dashboard - Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const [
            pendingRequests,
            approvedRequests,
            rejectedRequests,
            totalStudents,
            activeStudents,
            totalPayments,
            paidPayments
        ] = await Promise.all([
            PendingRequest.countDocuments({ status: 'pending' }),
            PendingRequest.countDocuments({ status: 'approved' }),
            PendingRequest.countDocuments({ status: 'rejected' }),
            Student.countDocuments(),
            Student.countDocuments({ status: 'active' }),
            Payment.countDocuments(),
            Payment.countDocuments({ status: 'paid' })
        ]);

        // Get recent requests
        const recentRequests = await PendingRequest.find()
            .populate('paymentId', 'status amount')
            .sort('-submittedAt')
            .limit(5)
            .select('firstName lastName status submittedAt paymentId');

        // Get monthly statistics
        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);

        const monthlyStats = await PendingRequest.aggregate([
            {
                $match: {
                    submittedAt: { $gte: currentMonth }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                requests: {
                    pending: pendingRequests,
                    approved: approvedRequests,
                    rejected: rejectedRequests,
                    total: pendingRequests + approvedRequests + rejectedRequests
                },
                students: {
                    total: totalStudents,
                    active: activeStudents
                },
                payments: {
                    total: totalPayments,
                    paid: paidPayments
                },
                recentRequests,
                monthlyStats
            }
        });

    } catch (error) {
        console.error('Get dashboard stats error:', error);
        handleError(res, error);
    }
};
