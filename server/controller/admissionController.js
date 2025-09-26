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

// Calculate age from date of birth
const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

// POST /admission/apply - Student submits admission form
export const submitAdmissionForm = async (req, res) => {
    try {
        console.log('=== ADMISSION FORM SUBMISSION ===');
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        console.log('Request headers:', req.headers);

        const {
            // Personal Information
            firstName,
            lastName,
            dateOfBirth,
            gender,

            // Contact Information
            email,
            phone,
            address,

            // Academic Information
            applyingForGrade,
            academicYear,

            // Parent Information
            parentName,
            parentPhone,
            parentEmail,

            // Documents
            documents,

            // Additional Information
            specialNeeds,
            medicalConditions,
            emergencyContact,

            // Payment Information
            paymentAmount,
            paymentMethod,
            fees
        } = req.body;

        // Validate required fields
        const missingFields = [];
        if (!firstName) missingFields.push('firstName');
        if (!lastName) missingFields.push('lastName');
        if (!dateOfBirth) missingFields.push('dateOfBirth');
        if (!email) missingFields.push('email');
        if (!phone) missingFields.push('phone');
        if (!applyingForGrade) missingFields.push('applyingForGrade');
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

        // Calculate age
        const age = calculateAge(dateOfBirth);

        // Payment system removed for testing
        console.log('Skipping payment creation for testing');

        // Create pending request
        const pendingRequestData = {
            firstName,
            lastName,
            dateOfBirth,
            age,
            gender,
            email,
            phone,
            address,
            applyingForGrade,
            academicYear,
            parentName,
            parentPhone,
            parentEmail,
            documents: documents || [],
            specialNeeds: specialNeeds || '',
            medicalConditions: medicalConditions || '',
            emergencyContact: emergencyContact || {},
            status: 'pending'
        };

        console.log('Creating pending request with data:', JSON.stringify(pendingRequestData, null, 2));

        // Validate the data before saving
        const pendingRequest = new PendingRequest(pendingRequestData);

        // Try to validate manually
        try {
            await pendingRequest.validate();
            console.log('Validation passed');
        } catch (validationError) {
            console.error('Validation failed:', validationError.errors);
            throw validationError;
        }

        await pendingRequest.save();

        console.log('Pending request created successfully:', pendingRequest._id);

        res.status(201).json({
            success: true,
            message: 'Admission form submitted successfully',
            data: {
                requestId: pendingRequest._id,
                status: 'pending'
            }
        });

    } catch (error) {
        console.error('Admission form submission error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            errors: error.errors
        });
        handleError(res, error);
    }
};

// GET /admission/status/:id - Check admission status
export const checkAdmissionStatus = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request ID'
            });
        }

        const pendingRequest = await PendingRequest.findById(id)
            .populate('paymentId', 'status amount transactionId paymentDate')
            .select('-__v');

        if (!pendingRequest) {
            return res.status(404).json({
                success: false,
                message: 'Admission request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                requestId: pendingRequest._id,
                status: pendingRequest.status,
                submittedAt: pendingRequest.submittedAt,
                reviewedAt: pendingRequest.reviewedAt,
                reviewedBy: pendingRequest.reviewedBy,
                adminNotes: pendingRequest.adminNotes,
                payment: pendingRequest.paymentId
            }
        });

    } catch (error) {
        console.error('Check admission status error:', error);
        handleError(res, error);
    }
};

// GET /admission/requests - Get all admission requests (for admin)
export const getAllAdmissionRequests = async (req, res) => {
    try {
        const { status, page = 1, limit = 10, sort = '-submittedAt' } = req.query;

        // Build filter
        const filter = {};
        if (status) filter.status = status;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get requests with pagination
        const requests = await PendingRequest.find(filter)
            .populate('paymentId', 'status amount transactionId paymentDate')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .select('-__v');

        // Get total count
        const total = await PendingRequest.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: requests.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            data: requests
        });

    } catch (error) {
        console.error('Get all admission requests error:', error);
        handleError(res, error);
    }
};

// GET /admission/request/:id - Get specific admission request
export const getAdmissionRequest = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request ID'
            });
        }

        const request = await PendingRequest.findById(id)
            .populate('paymentId')
            .select('-__v');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Admission request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: request
        });

    } catch (error) {
        console.error('Get admission request error:', error);
        handleError(res, error);
    }
};
