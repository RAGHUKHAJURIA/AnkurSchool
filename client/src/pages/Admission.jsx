import React, { useState } from 'react';
import { User, Calendar, MapPin, Phone, Mail, BookOpen, Send, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const Admission = () => {
    const [formData, setFormData] = useState({
        studentName: '',
        age: '',
        dateOfBirth: '',
        address: '',
        phoneNo: '',
        email: '',
        fatherName: '',
        motherName: '',
        class: '',
        previousSchool: '',
        emergencyContact: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Admission form submitted:', formData);
        alert('Thank you for your application! We will contact you soon for further process.');
        setFormData({
            studentName: '',
            age: '',
            dateOfBirth: '',
            address: '',
            phoneNo: '',
            email: '',
            fatherName: '',
            motherName: '',
            class: '',
            previousSchool: '',
            emergencyContact: ''
        });
    };

    const classes = [
        'Nursery', 'LKG', 'UKG',
        'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
        'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
        'Class 11', 'Class 12'
    ];

    return (
        <div className="min-h-screen bg-slate-900">
            <Navbar />

            {/* Header Section */}
            <div className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-600/20 rounded-full text-blue-300 text-sm font-medium mb-6">
                        📝 Admissions Open
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Student <span className="text-blue-400">Admission</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Begin your educational journey with Bright Future School. Fill out the admission form below to get started.
                    </p>
                </div>
            </div>

            {/* Admission Form Section */}
            <div className="px-4 sm:px-6 lg:px-8 pb-20">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Admission Application Form</h2>
                            <p className="text-gray-300">Please fill out all the required information accurately. Fields marked with * are mandatory.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Student Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-400" />
                                    Student Information
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Student Name *</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="studentName"
                                                value={formData.studentName}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter student's full name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Age *</label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            required
                                            min="3"
                                            max="18"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter age"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth *</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Class Applying For *</label>
                                        <div className="relative">
                                            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <select
                                                name="class"
                                                value={formData.class}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                            >
                                                <option value="" className="text-gray-700">Select Class</option>
                                                {classes.map((cls) => (
                                                    <option key={cls} value={cls} className="text-gray-700">{cls}</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Parent Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    👨‍👩‍👧‍👦 Parent/Guardian Information
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Father's Name *</label>
                                        <input
                                            type="text"
                                            name="fatherName"
                                            value={formData.fatherName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter father's name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Mother's Name *</label>
                                        <input
                                            type="text"
                                            name="motherName"
                                            value={formData.motherName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter mother's name"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    📞 Contact Information
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phoneNo"
                                                value={formData.phoneNo}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter phone number"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter email address"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Emergency Contact Number *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="emergencyContact"
                                            value={formData.emergencyContact}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter emergency contact number"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-blue-400" />
                                    Address Information
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Complete Address *</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                                        <textarea
                                            name="address"
                                            rows={3}
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                            placeholder="Enter complete address with postal code"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Previous School Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    🏫 Previous School Information
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Previous School Name</label>
                                    <input
                                        type="text"
                                        name="previousSchool"
                                        value={formData.previousSchool}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter previous school name (if applicable)"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                            >
                                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                                Submit Application
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
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-4">Required Documents</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4 text-blue-400" />
                                    Birth Certificate
                                </li>
                                <li className="flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4 text-blue-400" />
                                    Previous School Records
                                </li>
                                <li className="flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4 text-blue-400" />
                                    Parent's ID Proof
                                </li>
                                <li className="flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4 text-blue-400" />
                                    Address Proof
                                </li>
                                <li className="flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4 text-blue-400" />
                                    Passport Size Photos
                                </li>
                            </ul>
                        </div>

                        {/* Admission Process */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-4">Admission Process</h3>
                            <div className="space-y-3 text-gray-300">
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
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-4">Need Help?</h3>
                            <div className="space-y-3 text-gray-300">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-blue-400" />
                                    <span>9389426606</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-blue-400" />
                                    <span>cedcobglr@bsf.nic.in</span>
                                </div>
                                <div className="mt-4 p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
                                    <p className="text-blue-300 text-sm">
                                        Our admission office is open from Monday to Saturday, 9:00 AM to 4:00 PM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white/5 border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Join Bright Future School?
                    </h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Become part of our educational community and give your child the foundation for a successful future
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                            Download Brochure →
                        </button>
                        <button className="bg-transparent border border-white/30 hover:border-white/50 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200">
                            Schedule Campus Tour
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admission;