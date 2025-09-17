import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react'

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
        { name: 'Admission Section', path: '/admission-section' }
    ]

    // Dropdown items
    const dropdownItems = [
        { name: 'Gallery', path: '/gallery' },
        { name: 'Notices', path: '/notice' },
        { name: 'Articles', path: '/articles' }
    ]

    return (
        <div className="bg-slate-800 shadow-lg relative">
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
                    <ul className="hidden md:flex items-center space-x-4 lg:space-x-6">
                        {menuItems.map((item) => (
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
                                        px-3 lg:px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center
                                        ${isMoreOpen || dropdownItems.some(item => location.pathname === item.path)
                                            ? 'text-white bg-white/10 rounded-md'
                                            : 'text-gray-300 hover:text-white hover:bg-white/5 rounded-md'}
                                    `}
                                >
                                    More
                                    <svg 
                                        className={`ml-1 h-4 w-4 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                {/* Dropdown menu with a connecting element to prevent gap issues */}
                                {isMoreOpen && (
                                    <div 
                                        className="absolute z-10 mt-0 w-48 rounded-md shadow-lg bg-slate-800 border border-slate-700"
                                        style={{ top: '100%' }}
                                    >
                                        {/* Connector element to prevent hover gap */}
                                        <div className="absolute top-0 left-0 right-0 h-2 -mt-2"></div>
                                        <div className="py-1">
                                            {dropdownItems.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    to={item.path}
                                                    className={`
                                                        block px-4 py-2 text-sm transition-colors duration-200
                                                        ${location.pathname === item.path
                                                            ? 'text-white bg-white/10'
                                                            : 'text-gray-300 hover:text-white hover:bg-white/5'}
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
                    <div className="hidden md:flex items-center space-x-4">
                        {isSignedIn ? (
                            // Signed in: Show user info and UserButton
                            <div className="flex items-center space-x-3">
                                <span className="text-white text-sm font-medium">
                                    Hello, {user?.firstName || user?.username || 'User'}
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
                        ) : (
                            // Not signed in: Show Sign In and Sign Up buttons
                            <>
                                <SignInButton mode="modal">
                                    <button className="text-gray-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors duration-200">
                                        Sign In
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="bg-white text-slate-800 px-4 lg:px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors duration-200">
                                        Sign Up
                                    </button>
                                </SignUpButton>
                            </>
                        )}
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
                <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="py-4 border-t border-slate-700">
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
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
                            
                            {/* Mobile dropdown items */}
                            {dropdownItems.map((item) => (
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

                        {/* Mobile Authentication Section */}
                        <div className="mt-4 px-4">
                            {isSignedIn ? (
                                // Mobile: Signed in user
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
                                            {user?.firstName || user?.username || 'User'}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                // Mobile: Not signed in
                                <div className="space-y-2">
                                    <SignInButton mode="modal">
                                        <button 
                                            className="w-full text-gray-300 hover:text-white py-3 text-sm font-medium transition-colors duration-200 border border-gray-600 rounded-full hover:border-gray-500"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Sign In
                                        </button>
                                    </SignInButton>
                                    <SignUpButton mode="modal">
                                        <button 
                                            className="w-full bg-white text-slate-800 py-3 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors duration-200"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Sign Up
                                        </button>
                                    </SignUpButton>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar