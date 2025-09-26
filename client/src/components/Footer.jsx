import React from 'react';
import { Link } from 'react-router-dom';
import { School, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-white border-t border-slate-700">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* School Info */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <School className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold">Ankur School</h3>
                        </div>
                        <p className="text-gray-300 text-sm">
                            Excellence in Education - Nurturing young minds for a brighter future.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-blue-300">Quick Links</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <Link to="/" className="text-gray-300 hover:text-white text-sm transition-colors">Home</Link>
                            <Link to="/about" className="text-gray-300 hover:text-white text-sm transition-colors">About</Link>
                            <Link to="/admission" className="text-gray-300 hover:text-white text-sm transition-colors">Admission</Link>
                            <Link to="/activities" className="text-gray-300 hover:text-white text-sm transition-colors">Activities</Link>
                            <Link to="/gallery" className="text-gray-300 hover:text-white text-sm transition-colors">Gallery</Link>
                            <Link to="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">Contact</Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-blue-300">Contact</h4>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-300">
                                <Phone className="w-4 h-4 text-blue-400" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-300">
                                <Mail className="w-4 h-4 text-blue-400" />
                                <span>info@ankurschool.edu</span>
                            </div>
                            <div className="flex items-start space-x-2 text-sm text-gray-300">
                                <MapPin className="w-4 h-4 text-blue-400 mt-0.5" />
                                <span>Education District, City</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-700 mt-6 pt-4">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                        <p className="text-gray-400 text-sm">
                            © {currentYear} Ankur School. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                            <span>•</span>
                            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
