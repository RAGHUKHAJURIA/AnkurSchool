import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react'
import { Menu, X, ChevronDown, School, User, LogIn, UserPlus } from 'lucide-react'

const Navbar = () => {
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isMoreOpen, setIsMoreOpen] = useState(false)
    const { isSignedIn, user } = useUser()

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
    const toggleMore = () => setIsMoreOpen(!isMoreOpen)

    // Menu items structure
    const menuItems = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/Contact' },
        { name: 'Activities', path: '/activities' },
        { name: 'Admission', path: '/admission-section' }
    ]

    // Dropdown items
    const dropdownItems = [
        { name: 'Gallery', path: '/gallery' },
        { name: 'Notices', path: '/notice' },
        { name: 'Articles', path: '/articles' }
    ]

    return (
        <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                <div className="flex items-center justify-between py-3 sm:py-4">
                    {/* Logo/School Name */}
                    <Link to="/" className="flex items-center group">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                            <School className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-base sm:text-lg lg:text-xl font-bold group-hover:text-blue-200 transition-colors duration-300">Ankur School</span>
                            <span className="text-slate-300 text-xs sm:text-sm font-medium hidden sm:block">Excellence in Education</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <ul className="hidden md:flex items-center space-x-2 lg:space-x-4">
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    className={`
                                        px-4 lg:px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ease-out
                                        ${location.pathname === item.path
                                            ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md transform hover:-translate-y-0.5'}
                                    `}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}

                        {/* More dropdown - Fixed with a container that maintains hover state */}
                        <li className="relative">
                            <div
                                className="h-full"
                                onMouseEnter={() => setIsMoreOpen(true)}
                                onMouseLeave={() => setIsMoreOpen(false)}
                            >
                                <button
                                    onClick={toggleMore}
                                    className={`
                                        px-4 lg:px-5 py-2.5 text-sm font-semibold transition-all duration-300 ease-out flex items-center rounded-xl
                                        ${isMoreOpen || dropdownItems.some(item => location.pathname === item.path)
                                            ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md transform hover:-translate-y-0.5'}
                                    `}
                                >
                                    More
                                    <ChevronDown
                                        className={`ml-1 h-4 w-4 transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Dropdown menu with a connecting element to prevent gap issues */}
                                {isMoreOpen && (
                                    <div
                                        className="absolute z-10 mt-2 w-48 rounded-2xl shadow-2xl bg-slate-800/95 backdrop-blur-md border border-slate-700/50 animate-slide-down"
                                        style={{ top: '100%' }}
                                    >
                                        {/* Connector element to prevent hover gap */}
                                        <div className="absolute top-0 left-0 right-0 h-2 -mt-2"></div>
                                        <div className="py-2">
                                            {dropdownItems.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    to={item.path}
                                                    className={`
                                                        block px-4 py-3 text-sm font-medium transition-all duration-300 ease-out
                                                        ${location.pathname === item.path
                                                            ? 'text-white bg-gradient-to-r from-blue-600/20 to-blue-700/20 border-l-4 border-blue-500'
                                                            : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:translate-x-1'}
                                                    `}
                                                    onClick={() => setIsMoreOpen(false)}
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </li>
                    </ul>

                    {/* Desktop Authentication Section */}
                    <div className="hidden md:flex items-center space-x-3">
                        {isSignedIn ? (
                            // Signed in: Show user info and UserButton
                            <div className="flex items-center space-x-3 bg-slate-700/50 rounded-xl px-4 py-2 backdrop-blur-sm">
                                <User className="w-5 h-5 text-blue-400" />
                                <span className="text-white text-sm font-semibold">
                                    {user?.firstName || user?.username || 'User'}
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
                        ) : (
                            // Not signed in: Show Sign In and Sign Up buttons
                            <div className="flex items-center space-x-3">
                                <SignInButton mode="modal">
                                    <button className="flex items-center space-x-2 text-slate-300 hover:text-white px-4 py-2.5 text-sm font-semibold transition-all duration-300 ease-out hover:bg-slate-700/50 rounded-xl">
                                        <LogIn className="w-4 h-4" />
                                        <span>Sign In</span>
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ease-out">
                                        <UserPlus className="w-4 h-4" />
                                        <span>Sign Up</span>
                                    </button>
                                </SignUpButton>
                            </div>
                        )}
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
                    <div className="py-4 border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-md">
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`
                                            block w-full text-left px-4 py-3 text-sm font-semibold transition-all duration-300 ease-out rounded-xl
                                            ${location.pathname === item.path
                                                ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg'
                                                : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:translate-x-2'}
                                        `}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}

                            {/* Mobile dropdown items */}
                            {dropdownItems.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`
                                            block w-full text-left px-6 py-4 text-base font-semibold transition-all duration-300 ease-out rounded-xl
                                            ${location.pathname === item.path
                                                ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg'
                                                : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:translate-x-2'}
                                        `}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Mobile Authentication Section */}
                        <div className="mt-6 px-6">
                            {isSignedIn ? (
                                // Mobile: Signed in user
                                <div className="flex items-center justify-between bg-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
                                    <div className="flex items-center space-x-3">
                                        <User className="w-5 h-5 text-blue-400" />
                                        <span className="text-white text-sm font-semibold">
                                            {user?.firstName || user?.username || 'User'}
                                        </span>
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
                            ) : (
                                // Mobile: Not signed in
                                <div className="space-y-3">
                                    <SignInButton mode="modal">
                                        <button
                                            className="w-full flex items-center justify-center space-x-2 text-slate-300 hover:text-white py-4 text-sm font-semibold transition-all duration-300 ease-out border border-slate-600 rounded-xl hover:border-slate-500 hover:bg-slate-700/50"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <LogIn className="w-4 h-4" />
                                            <span>Sign In</span>
                                        </button>
                                    </SignInButton>
                                    <SignUpButton mode="modal">
                                        <button
                                            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ease-out"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            <span>Sign Up</span>
                                        </button>
                                    </SignUpButton>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar