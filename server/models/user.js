import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // Basic user information
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    
    // External auth ID (for Clerk integration)
    externalId: {
      type: String,
      required: true,
      unique: true
    },
    
    // Role-based access control
    role: {
      type: String,
      enum: ['student', 'parent', 'teacher', 'admin'],
      default: 'student'
    },
    
    
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^\d{10,15}$/, 'Please provide a valid phone number']
    }, 
    // Last login timestamp
    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt
  }
);


// Set toJSON method to customize the output
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  return userObject;
};


const User = mongoose.model('User', userSchema);

export default User;