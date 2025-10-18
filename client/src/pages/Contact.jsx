import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, User, MessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://ankurschool-v6d0.onrender.com/api/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                alert('Thank you for your message! We will get back to you soon.');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: ''
                });
            } else {
                alert('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gray-900">
                <Navbar />

                {/* Hero Section */}
                <div className="bg-gray-900">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                        <div className="text-center">
                            <div className="space-y-6">
                                {/* Badge */}
                                <div className="inline-flex items-center px-4 py-2 bg-gray-800/80 text-gray-300 rounded-full text-sm font-medium border border-gray-700/50 backdrop-blur-sm">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2 animate-pulse"></span>
                                    Get In Touch
                                </div>

                                {/* Main Heading */}
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                                    Contact Us
                                </h1>

                                {/* Description */}
                                <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                                    We're here to answer your questions and help you start your educational journey with Ankur School
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Information Cards */}
                <div className="py-20 bg-gray-900">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Address Card */}
                            <div className="group p-6 bg-gray-800/40 backdrop-blur-md rounded-2xl border border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <MapPin className="w-6 h-6 text-gray-300" />
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-2">Address</h3>
                                <p className="text-gray-400 text-sm">
                                    Near Gate 10<br />
                                    Ramaiah college<br />
                                    PUN 560054
                                </p>
                            </div>

                            {/* Phone Card */}
                            <div className="group p-6 bg-gray-800/40 backdrop-blur-md rounded-2xl border border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Phone className="w-6 h-6 text-gray-300" />
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-2">Phone</h3>
                                <p className="text-gray-400 text-sm">Main: 600xxxxxx</p>
                            </div>

                            {/* Email Card */}
                            <div className="group p-6 bg-gray-800/40 backdrop-blur-md rounded-2xl border border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Mail className="w-6 h-6 text-gray-300" />
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-2">Email</h3>
                                <p className="text-gray-400 text-sm">info@gmail.com</p>
                            </div>

                            {/* Hours Card */}
                            <div className="group p-6 bg-gray-800/40 backdrop-blur-md rounded-2xl border border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Clock className="w-6 h-6 text-gray-300" />
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-2">School Hours</h3>
                                <p className="text-gray-400 text-sm">
                                    Mon - Sat: 9:00 AM - 1:00 PM<br />Sunday: Closed
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form and Map Section */}
                <div className="py-20 bg-gray-900">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Contact Form */}
                            <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-white mb-2">Send us a Message</h2>
                                    <p className="text-gray-400">Fill out the form below and we'll get back to you as soon as possible.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-700/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-700/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                                    placeholder="Enter your email"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-700/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                                placeholder="Enter your phone number"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                            <textarea
                                                name="message"
                                                rows={6}
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-700/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors resize-none"
                                                placeholder="Tell us how we can help you..."
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group border border-gray-600/50"
                                    >
                                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                                        Send Message
                                    </button>
                                </div>
                            </div>



                            {/* Map and Additional Info */}
                            <div className="space-y-8">
                                <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50">
                                    <h3 className="text-xl font-bold text-white mb-4">Find Us</h3>
                                    <div className="rounded-lg overflow-hidden border border-gray-600/30">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.076782902914!2d77.56241437539246!3d13.030782287290055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17dedd4dcca9%3A0x6075bd8d8aed97ab!2sRamaiah%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1760730021476!5m2!1sen!2sin"
                                            width="100%"
                                            height="350"
                                            style={{ border: 0 }}
                                            allowFullScreen=""
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="School Location"
                                        ></iframe>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-3">📍 Near Ramaiah Gate 10</p>
                                </div>

                                <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50">
                                    <h3 className="text-xl font-bold text-white mb-4">Quick Contact</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Phone className="w-5 h-5 text-gray-300" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">Call us directly</p>
                                                <p className="text-gray-400 text-sm">600xxxxxx</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Mail className="w-5 h-5 text-gray-300" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">Email us</p>
                                                <p className="text-gray-400 text-sm">info@test.com</p>
                                            </div>
                                        </div>

                                        <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                                            <p className="text-gray-300 font-medium text-sm">✨ Schedule a Campus Tour</p>
                                            <p className="text-gray-400 text-sm mt-1">
                                                Visit our campus and see our world-class facilities in person.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <Footer />
        </>
    );
};

export default Contact;