import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  // Payment Details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },

  // Transaction Information
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'net_banking', 'upi', 'wallet', 'cash', 'cheque'],
    required: true
  },

  // Payment Status
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'approved', 'cancelled'],
    default: 'pending'
  },

  // Payment Gateway Information
  gateway: {
    type: String,
    enum: ['razorpay', 'payu', 'paytm', 'phonepe', 'cashfree', 'manual'],
    default: 'manual'
  },
  gatewayTransactionId: {
    type: String,
    default: ''
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Reference Information
  pendingRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PendingRequest',
    default: null
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null
  },

  // Temporary form data storage
  formData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Payment Details
  description: {
    type: String,
    default: 'School Admission Fee'
  },
  fees: [{
    type: {
      type: String,
      enum: ['admission', 'tuition', 'transport', 'library', 'sports', 'other'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: String
  }],

  // Payment Dates
  paymentDate: {
    type: Date,
    default: null
  },
  dueDate: {
    type: Date,
    required: true
  },

  // Refund Information
  refundAmount: {
    type: Number,
    default: 0
  },
  refundDate: {
    type: Date,
    default: null
  },
  refundReason: {
    type: String,
    default: ''
  },

  // Admin Information
  processedBy: {
    type: String,
    default: ''
  },
  processedAt: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for better query performance
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ pendingRequestId: 1 });
paymentSchema.index({ paymentDate: -1 });

// Virtual for total amount
paymentSchema.virtual('totalAmount').get(function () {
  if (this.fees && this.fees.length > 0) {
    return this.fees.reduce((total, fee) => total + fee.amount, 0);
  }
  return this.amount;
});

// Method to generate transaction ID
paymentSchema.statics.generateTransactionId = function () {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TXN${timestamp}${random}`;
};

// Method to update payment status
paymentSchema.methods.updateStatus = function (newStatus, processedBy = '', notes = '') {
  this.status = newStatus;
  this.processedBy = processedBy;
  this.processedAt = new Date();
  this.notes = notes;

  if (newStatus === 'paid' && !this.paymentDate) {
    this.paymentDate = new Date();
  }

  return this.save();
};

// Pre-save middleware to set due date if not provided
paymentSchema.pre('save', function (next) {
  if (!this.dueDate) {
    // Set due date to 7 days from now
    this.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  if (!this.transactionId) {
    this.transactionId = Payment.generateTransactionId();
  }

  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;