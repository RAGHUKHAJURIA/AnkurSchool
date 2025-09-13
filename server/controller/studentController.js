import Student from '../models/student.js';

// Controller to add a new student
export const addStudentData = async (req, res) => {
    try {
        // Extract student data from request body
        const {
            name,
            fatherName,
            motherName,
            phoneNo,
            address,
            email,
            dob
        } = req.body;

        // Validate required fields
        if (!name || !fatherName || !motherName || !phoneNo || !address || !email || !dob) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }
        
        // Validate phone number (should be a valid number)
        if (isNaN(phoneNo) || phoneNo.toString().length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format'
            });
        }

        // Create new student document
        const newStudent = new Student({
            name,
            fatherName,
            motherName,
            phoneNo,
            address,
            email,
            dob: new Date(dob)
        });

        // Save student to database
        const savedStudent = await newStudent.save();

        // Return success response
        return res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            data: savedStudent
        });

    } catch (error) {
        console.error('Error in addStudentData:', error.message);
        
        // Handle validation errors from Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        
        // Handle duplicate key errors (e.g., if email needs to be unique)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Duplicate entry found',
                field: Object.keys(error.keyPattern)[0]
            });
        }

        // Generic server error
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
}

// Controller to get all students
export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        console.error('Error in getAllStudents:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
}

// Controller to get a single student by ID
export const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const student = await Student.findById(id);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        return res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error in getStudentById:', error.message);
        
        // Handle invalid ID format
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid student ID format'
            });
        }
        
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
}

