import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    return (
        <div className="bg-slate-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                    {/* Logo/School Name */}
                    <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                            <div className="w-4 h-4 sm:w-6 sm:h-6 bg-slate-800 rounded-sm"></div>
                        </div>
                        <span className="text-white text-lg sm:text-xl font-semibold">Ankur School</span>
                    </div>

                    {/* Desktop Navigation Links */}
                    <ul className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        {[
                            { name: 'Home', path: '/' },
                            { name: 'About', path: '/about' },
                            { name: 'Contact', path: '/Contact' },
                            { name: 'Activities', path: '/activities' },
                            { name: 'Admission Section', path: '/admission-section' }
                        ].map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    className={`
                                        px-3 lg:px-4 py-2 text-sm font-medium transition-all duration-200
                                        ${location.pathname === item.path
                                            ? 'text-white bg-white/10 rounded-md'
                                            : 'text-gray-300 hover:text-white hover:bg-white/5 rounded-md'}
                                    `}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop CTA Button */}
                    <button className="hidden md:block bg-white text-slate-800 px-4 lg:px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors duration-200">
                        Log in
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden text-white p-2 rounded-md hover:bg-white/5 transition-colors duration-200"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="py-4 border-t border-slate-700">
                        <ul className="space-y-2">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'About', path: '/about' },
                                { name: 'Contact', path: '/contact' },
                                { name: 'Activities', path: '/activities' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsMenuOpen(false)} // close menu on click
                                        className={`
                                            block w-full text-left px-4 py-3 text-base font-medium transition-all duration-200 rounded-md
                                            ${location.pathname === item.path
                                                ? 'text-white bg-white/10'
                                                : 'text-gray-300 hover:text-white hover:bg-white/5'}
                                        `}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Mobile CTA Button */}
                        <div className="mt-4 px-4">
                            <button className="w-full bg-white text-slate-800 py-3 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors duration-200">
                                Log in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
