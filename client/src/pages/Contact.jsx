import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, User, MessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({
            name: '',
            email: '',
            phone: '',
            message: ''
        });
    };

    return (
        <div className="min-h-screen bg-slate-900">
            <Navbar />

            {/* Header Section */}
            <div className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-600/20 rounded-full text-blue-300 text-sm font-medium mb-6">
                        📞 Get In Touch
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Contact <span className="text-blue-400">Us</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        We're here to answer your questions and help you start your educational journey with Bright Future School
                    </p>
                </div>
            </div>

            {/* Contact Information Cards */}
            <div className="px-4 sm:px-6 lg:px-8 mb-16">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Address Card */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">Address</h3>
                            <p className="text-gray-300 text-sm">
                                CEDCO BSF BENGALURU<br />
                                NEAR REVA CIRCLE<br />
                                PUN 560063
                            </p>
                        </div>

                        {/* Phone Card */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                                <Phone className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">Phone</h3>
                            <p className="text-gray-300 text-sm">Main: 9389426606</p>
                        </div>

                        {/* Email Card */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                                <Mail className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">Email</h3>
                            <p className="text-gray-300 text-sm">cedcobglr@bsf.nic.in</p>
                        </div>

                        {/* Hours Card */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">School Hours</h3>
                            <p className="text-gray-300 text-sm">
                                Mon - Sat: 9:00 AM - 1:00 PM<br />Sunday: Closed
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Form and Map Section */}
            <div className="px-4 sm:px-6 lg:px-8 pb-20">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2">Send us a Message</h2>
                                <p className="text-gray-300">Fill out the form below and we'll get back to you as soon as possible.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter your full name"
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
                                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <textarea
                                            name="message"
                                            rows={6}
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                            placeholder="Tell us how we can help you..."
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                                >
                                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                                    Send Message
                                </button>
                            </div>
                        </div>

                        {/* Map and Additional Info */}
                        <div className="space-y-8">
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                                <h3 className="text-xl font-bold text-white mb-4">Find Us</h3>
                                <div className="rounded-lg overflow-hidden border border-blue-500/30">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3885.5403913460937!2d77.62478897507911!3d13.128276887201684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDA3JzQxLjgiTiA3N8KwMzcnMzguNSJF!5e0!3m2!1sen!2sin!4v1757599763798!5m2!1sen!2sin"
                                        width="100%"
                                        height="350"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="School Location"
                                    ></iframe>
                                </div>
                                <p className="text-gray-300 text-sm mt-3">📍 123 Education Street, Bright City</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                                <h3 className="text-xl font-bold text-white mb-4">Quick Contact</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">Call us directly</p>
                                            <p className="text-gray-300 text-sm">9389426606</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">Email us</p>
                                            <p className="text-gray-300 text-sm">cedcobglr@bsf.nic.in</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-4 bg-blue-600/20 rounded-lg border border-blue-500/30">
                                        <p className="text-blue-300 font-medium text-sm">✨ Schedule a Campus Tour</p>
                                        <p className="text-gray-300 text-sm mt-1">
                                            Visit our campus and see our world-class facilities in person.
                                        </p>
                                    </div>
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
                        Ready to Start Your Educational Journey?
                    </h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of students who have chosen excellence in education at Bright Future School
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                            Schedule Visit →
                        </button>
                        <button className="bg-transparent border border-white/30 hover:border-white/50 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200">
                            Download Brochure
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;