import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    motherName: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true,
    },
    address:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
    },
    dob:{
        type: Date,
        required: true
    }
    
}, { timestamps: true })

const Student = mongoose.model('Student', studentSchema);

export default Student;
