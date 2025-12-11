import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    SignInButton,
    SignUpButton,
    UserButton,
    useUser,
} from "@clerk/clerk-react";
import {
    Menu,
    X,
    ChevronDown,
    School,
    User,
    LogIn,
    UserPlus,
    LayoutDashboard,
} from "lucide-react";
import { useAdminAuthSimple } from "../hooks/useAdminAuthSimple";
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "./ui/resizable-navbar";

const ModernNavbar = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const { isSignedIn, user } = useUser();
    const { isAdmin } = useAdminAuthSimple();

    const menuItems = [
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
        { name: "Activities", path: "/activities" },
        { name: "Admission", path: "/admission-section" },
    ];

    const dropdownItems = [
        { name: "Gallery", path: "/gallery" },
        { name: "Notices", path: "/notice" },
        { name: "Articles", path: "/articles" },
    ];

    return (
        <div className="w-full fixed top-0 left-0 z-50">
            <Navbar>
                {/* Desktop Navbar */}
                <NavBody>
                    {/* Logo */}
                    <NavbarLogo>
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300">
                                <School className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white text-lg font-bold group-hover:text-blue-200 transition-colors">
                                    Attainers
                                </span>
                            </div>
                        </Link>
                    </NavbarLogo>

                    {/* Menu Items */}
                    <div className="hidden md:flex items-center space-x-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${location.pathname === item.path
                                    ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-md"
                                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setIsMoreOpen(true)}
                            onMouseLeave={() => {
                                // small delay to prevent flicker
                                setTimeout(() => setIsMoreOpen(false), 150);
                            }}
                        >
                            <button
                                className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${isMoreOpen
                                    ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-md"
                                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                                    }`}
                            >
                                More
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${isMoreOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {/* Dropdown Menu */}
                            {isMoreOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-2xl animate-fade-in scale-95 origin-top transition-all duration-200"
                                    style={{ top: "100%" }}
                                    onMouseEnter={() => setIsMoreOpen(true)} // keep open while hovering menu
                                    onMouseLeave={() => setIsMoreOpen(false)}
                                >
                                    {/* Invisible connector to prevent hover gap */}
                                    <div className="absolute -top-2 left-0 right-0 h-2 bg-transparent"></div>

                                    {dropdownItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            className={`block px-4 py-3 text-sm rounded-xl transition-all duration-300 ${location.pathname === item.path
                                                ? "text-white bg-blue-700/30"
                                                : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                                                }`}
                                            onClick={() => setIsMoreOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>



                        {/* Admin View Button (Desktop) */}
                        {isSignedIn && isAdmin && (
                            <Link
                                to="/admin"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 transition-all duration-300"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span>Admin View</span>
                            </Link>
                        )}

                    </div>

                    {/* Auth Buttons (Desktop) */}
                    <div className="hidden md:flex items-center gap-4">
                        {isSignedIn ? (
                            <div className="flex items-center bg-slate-800/50 rounded-xl px-4 py-2 gap-2">
                                <User className="w-5 h-5 text-blue-400" />
                                <span className="text-white text-sm font-semibold">
                                    {user?.firstName || "User"}
                                </span>
                                <UserButton
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-8 h-8 rounded-xl",
                                        },
                                    }}
                                />
                            </div>
                        ) : (
                            <>
                                <NavbarButton variant="secondary">
                                    <SignInButton mode="modal">
                                        <div className="flex items-center space-x-2">
                                            <LogIn className="w-4 h-4" />
                                            <span>Sign In</span>
                                        </div>
                                    </SignInButton>
                                </NavbarButton>
                                <NavbarButton variant="primary">
                                    <SignUpButton mode="modal">
                                        <div className="flex items-center space-x-2">
                                            <UserPlus className="w-4 h-4" />
                                            <span>Sign Up</span>
                                        </div>
                                    </SignUpButton>
                                </NavbarButton>
                            </>
                        )}
                    </div>
                </NavBody>

                {/* Mobile Navbar */}
                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo>
                            <Link to="/" className="flex items-center space-x-2">
                                <School className="w-6 h-6 text-blue-400" />
                                <span className="text-white font-semibold">Ankur School</span>
                            </Link>
                        </NavbarLogo>
                        <MobileNavToggle
                            isOpen={isMenuOpen}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        />
                    </MobileNavHeader>

                    <MobileNavMenu
                        isOpen={isMenuOpen}
                        onClose={() => setIsMenuOpen(false)}
                    >
                        {[...menuItems, ...dropdownItems].map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${location.pathname === item.path
                                    ? "text-white bg-blue-700/30"
                                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* Admin View Button (Mobile) */}
                        {isSignedIn && isAdmin && (
                            <Link
                                to="/admin"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl text-yellow-500 bg-yellow-500/10 active:bg-yellow-500/20 border border-yellow-500/20 transition-all duration-300"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                <span>Admin View</span>
                            </Link>
                        )}

                        <div className="flex flex-col gap-4 mt-6">
                            {isSignedIn ? (
                                <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2">
                                        <User className="w-5 h-5 text-blue-400" />
                                        <span className="text-white text-sm font-semibold">
                                            {user?.firstName || "User"}
                                        </span>
                                    </div>
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-8 h-8 rounded-xl",
                                            },
                                        }}
                                    />
                                </div>
                            ) : (
                                <>
                                    <NavbarButton variant="secondary">
                                        <SignInButton mode="modal">
                                            <div className="flex items-center justify-center gap-2">
                                                <LogIn className="w-4 h-4" />
                                                <span>Sign In</span>
                                            </div>
                                        </SignInButton>
                                    </NavbarButton>
                                    <NavbarButton variant="primary">
                                        <SignUpButton mode="modal">
                                            <div className="flex items-center justify-center gap-2">
                                                <UserPlus className="w-4 h-4" />
                                                <span>Sign Up</span>
                                            </div>
                                        </SignUpButton>
                                    </NavbarButton>
                                </>
                            )}
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
        </div >
    );
};

export default ModernNavbar;
