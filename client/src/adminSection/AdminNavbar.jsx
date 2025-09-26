import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { UserButton, useUser } from '@clerk/clerk-react'
import { Menu, X, School, User, LogOut, Shield, Bell } from 'lucide-react'
import { useAdminAuthSimple } from '../hooks/useAdminAuthSimple.jsx'

const AdminNavbar = () => {
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const { user } = useUser()
    const { adminUser, isAdmin, makeAdminRequest } = useAdminAuthSimple()

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    // Fetch unread message count
    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (isAdmin && makeAdminRequest) {
                try {
                    const response = await makeAdminRequest('GET', '/api/admin/messages/unread-count');
                    if (response.data.success) {
                        setUnreadCount(response.data.data.unreadCount || 0);
                    }
                } catch (error) {
                    // Silently handle error - notification badge will not show
                }
            }
        };

        fetchUnreadCount();
        // Refresh every 2 minutes to avoid rate limiting
        const interval = setInterval(fetchUnreadCount, 120000);
        return () => clearInterval(interval);
    }, [isAdmin, makeAdminRequest]);

    return (
        <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                <div className="flex items-center justify-between py-3 sm:py-4">
                    {/* Logo/School Name */}
                    <Link to="/admin" className="flex items-center group">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                            <School className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-base sm:text-lg lg:text-xl font-bold group-hover:text-blue-200 transition-colors duration-300">Ankur School</span>
                            <span className="text-slate-300 text-xs sm:text-sm font-medium hidden sm:block">Admin Panel</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <ul className="hidden md:flex items-center space-x-2 lg:space-x-4">
                        {[
                            { name: 'Dashboard', path: '/admin' },
                            { name: 'Students', path: '/admin/students' },
                            { name: 'Payments', path: '/admin/payments' },
                            { name: 'Requests', path: '/admin/approve' },
                            { name: 'Activities', path: '/admin/activities' },
                            { name: 'Messages', path: '/admin/messages', showBadge: true }
                        ].map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    className={`
                                        admin-nav-link px-4 lg:px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ease-out relative
                                        ${location.pathname === item.path
                                            ? 'nav-active text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md transform hover:-translate-y-0.5'}
                                    `}
                                >
                                    {item.name}
                                    {item.showBadge && unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop User Section */}
                    <div className="hidden md:flex items-center space-x-3">
                        <div className="flex items-center space-x-3 bg-slate-700/50 rounded-xl px-4 py-2 backdrop-blur-sm">
                            <Shield className="w-5 h-5 text-green-400" />
                            <span className="text-white text-sm font-semibold">
                                {adminUser?.name || user?.firstName || user?.username || 'Admin'}
                            </span>
                            <span className="text-green-400 text-xs font-medium bg-green-900/30 px-2 py-1 rounded-full">
                                ADMIN
                            </span>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-8 h-8 rounded-xl",
                                        userButtonPopoverCard: "bg-white rounded-2xl shadow-2xl",
                                        userButtonPopoverText: "text-slate-800"
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden text-white p-3 rounded-xl hover:bg-slate-700/50 transition-all duration-300 ease-out"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="py-6 border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-md">
                        <ul className="space-y-3">
                            {[
                                { name: 'Dashboard', path: '/admin' },
                                { name: 'Students', path: '/admin/students' },
                                { name: 'Payments', path: '/admin/payments' },
                                { name: 'Requests', path: '/admin/approve' },
                                { name: 'Activities', path: '/admin/activities' },
                                { name: 'Messages', path: '/admin/messages', showBadge: true }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`
                                            block w-full text-left px-6 py-4 text-base font-semibold transition-all duration-300 ease-out rounded-xl relative
                                            ${location.pathname === item.path
                                                ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg'
                                                : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:translate-x-2'}
                                        `}
                                    >
                                        {item.name}
                                        {item.showBadge && unreadCount > 0 && (
                                            <span className="absolute top-2 right-6 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Mobile User Section */}
                        <div className="mt-6 px-6">
                            <div className="flex items-center justify-between bg-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
                                <div className="flex items-center space-x-3">
                                    <Shield className="w-5 h-5 text-green-400" />
                                    <div className="flex flex-col">
                                        <span className="text-white text-sm font-semibold">
                                            {adminUser?.name || user?.firstName || user?.username || 'Admin'}
                                        </span>
                                        <span className="text-green-400 text-xs font-medium">
                                            ADMIN
                                        </span>
                                    </div>
                                </div>
                                <UserButton
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-8 h-8 rounded-xl",
                                            userButtonPopoverCard: "bg-white rounded-2xl shadow-2xl",
                                            userButtonPopoverText: "text-slate-800"
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default AdminNavbar