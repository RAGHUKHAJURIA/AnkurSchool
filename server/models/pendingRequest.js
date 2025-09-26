import mongoose from 'mongoose';

const pendingRequestSchema = new mongoose.Schema({
    // Personal Information
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },

    // Contact Information
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, default: 'India' }
    },

    // Academic Information
    applyingForGrade: {
        type: String,
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },

    // Parent/Guardian Information
    parentName: {
        type: String,
        required: true
    },
    parentPhone: {
        type: String,
        required: true
    },
    parentEmail: {
        type: String,
        required: true
    },

    // Documents (optional for testing)
    documents: [{
        type: {
            type: String,
            enum: ['birthCertificate', 'previousMarksheet', 'transferCertificate', 'photo', 'aadharCard', 'other'],
            required: false // Made optional for testing
        },
        fileName: String,
        fileId: String, // GridFS file ID
        uploadedAt: { type: Date, default: Date.now }
    }],

    // Application Status
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

    // Payment Information (removed for testing)
    // paymentId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Payment',
    //   required: true
    // },

    // Additional Information
    specialNeeds: {
        type: String,
        default: ''
    },
    medicalConditions: {
        type: String,
        default: ''
    },
    emergencyContact: {
        name: { type: String, default: '' },
        phone: { type: String, default: '' },
        relationship: { type: String, default: '' }
    },

    // Admin Notes
    adminNotes: {
        type: String,
        default: ''
    },
    reviewedBy: {
        type: String,
        default: ''
    },
    reviewedAt: {
        type: Date,
        default: null
    },

    // Timestamps
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for better query performance
pendingRequestSchema.index({ status: 1, submittedAt: -1 });
pendingRequestSchema.index({ email: 1 });
pendingRequestSchema.index({ phone: 1 });

// Virtual for full name
pendingRequestSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Method to calculate age
pendingRequestSchema.methods.calculateAge = function () {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

// Pre-save middleware to calculate age
pendingRequestSchema.pre('save', function (next) {
    if (this.dateOfBirth) {
        this.age = this.calculateAge();
    }
    next();
});

const PendingRequest = mongoose.model('PendingRequest', pendingRequestSchema);

export default PendingRequest;
