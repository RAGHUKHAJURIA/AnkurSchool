import React, { useState } from 'react';
import { User, Calendar, MapPin, Phone, Mail, BookOpen, Send, FileText, AlertCircle, CheckCircle, GraduationCap, Users, Home, School, ChevronRight, CreditCard } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FileUpload from '../components/FileUpload';
import PaymentModal from '../components/PaymentModal';
import axios from 'axios';

const Admission = () => {
    const [formData, setFormData] = useState({
        // Personal Information
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        age: '',
        gender: '',

        // Contact Information
        email: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'India'
        },

        // Academic Information
        applyingForGrade: '',
        academicYear: new Date().getFullYear().toString(),

        // Parent Information
        parentName: '',
        parentPhone: '',
        parentEmail: '',

        // Additional Information
        specialNeeds: '',
        medicalConditions: '',
        emergencyContact: {
            name: '',
            phone: '',
            relationship: ''
        }
    });

    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [submittedData, setSubmittedData] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentData, setPaymentData] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return '';

        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age.toString();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle nested address fields
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        }
        // Handle nested emergency contact fields
        else if (name.startsWith('emergencyContact.')) {
            const contactField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                emergencyContact: {
                    ...prev.emergencyContact,
                    [contactField]: value
                }
            }));
        }
        // Handle regular fields
        else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));

            // Auto-calculate age when date of birth changes
            if (name === 'dateOfBirth') {
                const calculatedAge = calculateAge(value);
                setFormData(prev => ({
                    ...prev,
                    age: calculatedAge
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Validate form data
        const requiredFields = [
            'firstName', 'lastName', 'dateOfBirth', 'gender', 'email', 'phone',
            'address.street', 'address.city', 'address.state', 'address.zipCode',
            'applyingForGrade', 'academicYear',
            'parentName', 'parentPhone', 'parentEmail'
        ];

        const missingFields = requiredFields.filter(field => {
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                return !formData[parent] || !formData[parent][child];
            }
            return !formData[field];
        });

        if (missingFields.length > 0) {
            setMessage({ type: 'error', text: `Please fill in all required fields: ${missingFields.join(', ')}` });
            return;
        }

        // Show payment modal instead of direct submission
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = (paymentResult) => {
        console.log('Payment successful:', paymentResult);
        setPaymentData(paymentResult);
        setMessage({
            type: 'success',
            text: 'Payment completed successfully! Your admission application has been submitted and is under review.'
        });
        setIsFormSubmitted(true);
        setShowPaymentModal(false);
    };

    const handlePaymentModalClose = () => {
        setShowPaymentModal(false);
    };

    const handleDocumentUpload = (uploadedFile) => {
        setUploadedDocuments(prev => [...prev, uploadedFile]);
    };

    const classes = [
        'Nursery', 'LKG', 'UKG',
        'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
        'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
        'Class 11', 'Class 12'
    ];

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <Navbar />

                {/* Hero Section */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                        <div className="text-center">
                            <div className="space-y-6">
                                {/* Badge */}
                                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    Admissions Open 2024-25
                                </div>

                                {/* Main Heading */}
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                                    Student Admission
                                </h1>

                                {/* Description */}
                                <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                                    Begin your educational journey with Ankur School. Join our community of excellence and unlock your potential.
                                </p>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                            <div className="group p-6 bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Users className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">500+</h3>
                                <p className="text-slate-600">Happy Students</p>
                            </div>
                            <div className="group p-6 bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <School className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">15+</h3>
                                <p className="text-slate-600">Years Experience</p>
                            </div>
                            <div className="group p-6 bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <BookOpen className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">100%</h3>
                                <p className="text-slate-600">Success Rate</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admission Form Section */}
                <div className="px-4 sm:px-6 lg:px-8 pb-20">
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-2xl p-8 md:p-12">
                            <div className="mb-10 text-center">
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Admission Application Form</h2>
                                <p className="text-slate-700 text-lg">Please fill out all the required information accurately. Fields marked with <span className="text-red-500 font-semibold">*</span> are mandatory.</p>
                            </div>

                            {/* Message Display */}
                            {message.text && (
                                <div className={`mb-8 p-6 rounded-2xl flex items-center gap-4 ${message.type === 'success'
                                    ? 'bg-green-50 border border-green-200 text-green-800'
                                    : 'bg-red-50 border border-red-200 text-red-800'
                                    }`}>
                                    {message.type === 'success' ? (
                                        <CheckCircle className="w-6 h-6 flex-shrink-0 text-green-600" />
                                    ) : (
                                        <AlertCircle className="w-6 h-6 flex-shrink-0 text-red-600" />
                                    )}
                                    <span className="font-semibold">{message.text}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-10">
                                {/* Student Information */}
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        Student Information
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-2">First Name <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                                    placeholder="Enter first name"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-2">Last Name <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                                    placeholder="Enter last name"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6 mt-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-2">Date of Birth <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="date"
                                                    name="dateOfBirth"
                                                    value={formData.dateOfBirth}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-2">Age (Auto-calculated)</label>
                                            <input
                                                type="number"
                                                name="age"
                                                value={formData.age}
                                                readOnly
                                                required
                                                min="3"
                                                max="18"
                                                className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-300 rounded-xl text-slate-900 cursor-not-allowed shadow-sm"
                                                placeholder="Age will be calculated from date of birth"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">Age is automatically calculated from your date of birth</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-2">Gender <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm appearance-none"
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Academic Information */}
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <BookOpen className="w-5 h-5 text-white" />
                                        </div>
                                        Academic Information
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-2">Applying For Grade <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <select
                                                    name="applyingForGrade"
                                                    value={formData.applyingForGrade}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm appearance-none"
                                                >
                                                    <option value="">Select Grade</option>
                                                    {classes.map((cls) => (
                                                        <option key={cls} value={cls}>{cls}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-2">Academic Year <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    name="academicYear"
                                                    value={formData.academicYear}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                                    placeholder="e.g., 2024-2025"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Parent Information */}
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <Users className="w-5 h-5 text-white" />
                                        </div>
                                        Parent/Guardian Information
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-2">Parent/Guardian Name <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                name="parentName"
                                                value={formData.parentName}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                                placeholder="Enter parent/guardian name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-2">Parent Phone <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="tel"
                                                    name="parentPhone"
                                                    value={formData.parentPhone}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                                    placeholder="Enter parent phone number"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-800 mb-2">Parent Email <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="email"
                                                name="parentEmail"
                                                value={formData.parentEmail}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                                placeholder="Enter parent email"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <Phone className="w-5 h-5 text-white" />
                                        </div>
                                        Contact Information
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-2">Student Phone Number <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                                    placeholder="Enter student phone number"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-2">Student Email Address <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                                    placeholder="Enter student email address"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-slate-800">Emergency Contact</h4>
                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-800 mb-2">Name</label>
                                                <input
                                                    type="text"
                                                    name="emergencyContact.name"
                                                    value={formData.emergencyContact.name}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                                    placeholder="Emergency contact name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-800 mb-2">Phone</label>
                                                <input
                                                    type="tel"
                                                    name="emergencyContact.phone"
                                                    value={formData.emergencyContact.phone}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                                    placeholder="Emergency contact phone"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-800 mb-2">Relationship</label>
                                                <input
                                                    type="text"
                                                    name="emergencyContact.relationship"
                                                    value={formData.emergencyContact.relationship}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                                    placeholder="e.g., Uncle, Aunt"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information */}
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                        Address Information
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-2">Street Address <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    name="address.street"
                                                    value={formData.address.street}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                                    placeholder="Enter street address"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-2">City <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                name="address.city"
                                                value={formData.address.city}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                                placeholder="Enter city"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-2">State <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                name="address.state"
                                                value={formData.address.state}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                                placeholder="Enter state"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-2">ZIP Code <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                name="address.zipCode"
                                                value={formData.address.zipCode}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                                placeholder="Enter ZIP code"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Document Upload Section */}
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <FileText className="w-5 h-5 text-white" />
                                        </div>
                                        Required Documents
                                    </h3>
                                    <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-6">
                                        <p className="text-slate-700 text-sm mb-4">
                                            Upload the following documents (PDF, JPG, PNG):
                                        </p>
                                        <ul className="text-slate-700 text-sm space-y-1 mb-4">
                                            <li>• Birth Certificate</li>
                                            <li>• Previous School Records</li>
                                            <li>• Parent's ID Proof</li>
                                            <li>• Address Proof</li>
                                            <li>• Passport Size Photos</li>
                                        </ul>

                                        <FileUpload
                                            onFileUploaded={handleDocumentUpload}
                                            multiple={true}
                                            accept="image/*,.pdf"
                                            maxFiles={10}
                                            category="admission_documents"
                                            description="Student admission documents"
                                        />

                                        {uploadedDocuments.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="text-sm font-semibold text-slate-800 mb-2">Uploaded Documents:</h4>
                                                <div className="space-y-2">
                                                    {uploadedDocuments.map((doc, index) => (
                                                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                                            <span className="text-green-700 text-sm">{doc.originalName}</span>
                                                            <span className="text-green-600 text-xs font-medium">✓ Uploaded</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            Proceed to Payment (₹500)
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Additional Information Section */}
                <div className="px-4 sm:px-6 lg:px-8 pb-20">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Required Documents */}
                            <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-lg">
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Required Documents</h3>
                                <ul className="space-y-2 text-slate-700">
                                    <li className="flex items-center gap-2">
                                        <ChevronRight className="w-4 h-4 text-blue-600" />
                                        Birth Certificate
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ChevronRight className="w-4 h-4 text-blue-600" />
                                        Previous School Records
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ChevronRight className="w-4 h-4 text-blue-600" />
                                        Parent's ID Proof
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ChevronRight className="w-4 h-4 text-blue-600" />
                                        Address Proof
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ChevronRight className="w-4 h-4 text-blue-600" />
                                        Passport Size Photos
                                    </li>
                                </ul>
                            </div>

                            {/* Admission Process */}
                            <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-lg">
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Admission Process</h3>
                                <div className="space-y-3 text-slate-700">
                                    <div className="flex items-start gap-2">
                                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white mt-1 flex-shrink-0">1</div>
                                        <p>Submit the online application form</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white mt-1 flex-shrink-0">2</div>
                                        <p>School will contact you for verification</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white mt-1 flex-shrink-0">3</div>
                                        <p>Submit required documents</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white mt-1 flex-shrink-0">4</div>
                                        <p>Complete the admission formalities</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-lg">
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Need Help?</h3>
                                <div className="space-y-3 text-slate-700">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-5 h-5 text-blue-600" />
                                        <span>9389426606</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                        <span>cedcobglr@bsf.nic.in</span>
                                    </div>
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-blue-700 text-sm">
                                            Our admission office is open from Monday to Saturday, 9:00 AM to 4:00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Payment Modal */}
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={handlePaymentModalClose}
                    formData={formData}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            </div>

            {/* Footer */}
            <Footer />
        </>
    );
};

export default Admission;