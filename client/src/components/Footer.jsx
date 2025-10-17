import React from 'react';
import { Link } from 'react-router-dom';
import { School, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900/95 backdrop-blur-md text-white border-t border-gray-700/50">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* School Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center shadow-lg border border-gray-600/50">
                                <School className="w-6 h-6 text-gray-300" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Attainers</h3>
                                <p className="text-gray-400 text-sm">Est. 1985</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Excellence in Education - Nurturing young minds for a brighter future through quality education and holistic development.
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex space-x-3 pt-2">
                            <a href="#" className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center border border-gray-700/50 hover:bg-gray-700/50 transition-all duration-300">
                                <Facebook className="w-4 h-4 text-gray-400" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center border border-gray-700/50 hover:bg-gray-700/50 transition-all duration-300">
                                <Twitter className="w-4 h-4 text-gray-400" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center border border-gray-700/50 hover:bg-gray-700/50 transition-all duration-300">
                                <Instagram className="w-4 h-4 text-gray-400" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center border border-gray-700/50 hover:bg-gray-700/50 transition-all duration-300">
                                <Youtube className="w-4 h-4 text-gray-400" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white border-l-4 border-gray-600 pl-3">Quick Links</h4>
                        <div className="space-y-2">
                            <Link to="/" className="block text-gray-400 hover:text-white text-sm transition-all duration-300 hover:translate-x-1">Home</Link>
                            <Link to="/activities" className="block text-gray-400 hover:text-white text-sm transition-all duration-300 hover:translate-x-1">Activities</Link>
                            <Link to="/gallery" className="block text-gray-400 hover:text-white text-sm transition-all duration-300 hover:translate-x-1">Gallery</Link>
                            <Link to="/contact" className="block text-gray-400 hover:text-white text-sm transition-all duration-300 hover:translate-x-1">Contact</Link>
                        </div>
                    </div>

                    {/* Academics */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white border-l-4 border-gray-600 pl-3">Academics</h4>
                        <div className="space-y-2">
                            <Link to="/#" className="block text-gray-400 hover:text-white text-sm transition-all duration-300 hover:translate-x-1">Curriculum</Link>
                            <Link to="/#" className="block text-gray-400 hover:text-white text-sm transition-all duration-300 hover:translate-x-1">Our Faculty</Link>
                            <Link to="/#" className="block text-gray-400 hover:text-white text-sm transition-all duration-300 hover:translate-x-1">Results</Link>
                            <Link to="/#" className="block text-gray-400 hover:text-white text-sm transition-all duration-300 hover:translate-x-1">Events</Link>
                            <Link to="/#" className="block text-gray-400 hover:text-white text-sm transition-all duration-300 hover:translate-x-1">Facilities</Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white border-l-4 border-gray-600 pl-3">Contact Info</h4>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-400 text-sm leading-relaxed">
                                    123 Education Street,<br />
                                    Knowledge City, KC 12345
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">+91 98765 43210</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">info@ankurschool.edu</span>
                            </div>
                            
                            {/* Timing */}
                            <div className="pt-2">
                                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Office Hours</p>
                                <p className="text-gray-400 text-sm">Mon - Fri: 8:00 AM - 4:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700/50 mt-8 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                        <p className="text-gray-500 text-sm">
                            © {currentYear} Attainers. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-6 text-sm">
                            <Link to="/#" className="text-gray-500 hover:text-white transition-colors duration-300 text-xs">Privacy Policy</Link>
                            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                            <Link to="/#" className="text-gray-500 hover:text-white transition-colors duration-300 text-xs">Terms of Service</Link>
                            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                            <Link to="/#" className="text-gray-500 hover:text-white transition-colors duration-300 text-xs">Sitemap</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;