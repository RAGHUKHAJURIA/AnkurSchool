import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
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
    required: false // Made optional - will be calculated in pre-save middleware
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
    // unique: true // Temporarily removed for testing
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: { type: String, required: false }, // Made optional for testing
    city: { type: String, required: false }, // Made optional for testing
    state: { type: String, required: false }, // Made optional for testing
    zipCode: { type: String, required: false }, // Made optional for testing
    country: { type: String, default: 'India' }
  },

  // Academic Information
  studentId: {
    type: String,
    // unique: true, // Temporarily removed for testing
    required: false // Made optional - will be generated in pre-save middleware
  },
  currentGrade: {
    type: String,
    required: false // Made optional for testing
  },
  academicYear: {
    type: String,
    required: false // Made optional for testing
  },
  admissionDate: {
    type: Date,
    default: Date.now
  },

  // Parent/Guardian Information
  parentName: {
    type: String,
    required: false // Made optional for testing
  },
  parentPhone: {
    type: String,
    required: false // Made optional for testing
  },
  parentEmail: {
    type: String,
    required: false // Made optional for testing
  },

  // Documents
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

  // Student Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated', 'transferred'],
    default: 'active'
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
    name: String,
    phone: String,
    relationship: String
  },

  // Academic Records
  academicRecords: [{
    academicYear: String,
    grade: String,
    subjects: [{
      name: String,
      marks: Number,
      grade: String
    }],
    overallGrade: String,
    attendance: Number
  }],

  // Reference to original pending request
  originalRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PendingRequest'
  }
}, {
  timestamps: true
});

// Index for better query performance
studentSchema.index({ studentId: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ status: 1 });
studentSchema.index({ currentGrade: 1 });

// Virtual for full name
studentSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Method to generate student ID
studentSchema.statics.generateStudentId = function () {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `STU${year}${random}`;
};

// Method to calculate age
studentSchema.methods.calculateAge = function () {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

// Pre-save middleware to calculate age and generate student ID
studentSchema.pre('save', function (next) {
  if (this.dateOfBirth) {
    this.age = this.calculateAge();
  }

  if (!this.studentId) {
    // Generate student ID directly without referencing the model
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.studentId = `STU${year}${random}`;
  }

  next();
});

const Student = mongoose.model('Student', studentSchema);

export default Student;