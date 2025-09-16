import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { UserButton, useUser } from '@clerk/clerk-react'

const AdminNavbar = () => {
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user } = useUser()

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
                        <span className="text-white text-lg sm:text-xl font-semibold">Ankur School Admin</span>
                    </div>

                    {/* Desktop Navigation Links */}
                    <ul className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        {[
                            { name: 'Dashboard', path: '/admin' },
                            { name: 'Add Activity', path: '/admin/add-activity' },
                            { name: 'Approve Requests', path: '/admin/approve-requests' },
                            { name: 'Payment Section', path: '/admin/payment-section' },
                            { name: 'Student Details', path: '/admin/student-details' }
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

                    {/* Desktop User Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <span className="text-white text-sm font-medium">
                                Hello, {user?.firstName || user?.username || 'Admin'}
                            </span>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-8 h-8",
                                        userButtonPopoverCard: "bg-white",
                                        userButtonPopoverText: "text-slate-800"
                                    }
                                }}
                            />
                        </div>
                    </div>

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
                                { name: 'Dashboard', path: '/admin' },
                                { name: 'Add Activity', path: '/admin/add-activity' },
                                { name: 'Approve Requests', path: '/admin/approve-requests' },
                                { name: 'Payment Section', path: '/admin/payment-section' },
                                { name: 'Student Details', path: '/admin/student-details' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsMenuOpen(false)}
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

                        {/* Mobile User Section */}
                        <div className="mt-4 px-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-8 h-8",
                                                userButtonPopoverCard: "bg-white",
                                                userButtonPopoverText: "text-slate-800"
                                            }
                                        }}
                                    />
                                    <span className="text-white text-sm font-medium">
                                        {user?.firstName || user?.username || 'Admin'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminNavbar