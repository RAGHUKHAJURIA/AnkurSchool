import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const About = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [activeStep, setActiveStep] = useState(1)

    useEffect(() => {
        setIsVisible(true)

        // Auto-rotate through process steps
        const interval = setInterval(() => {
            setActiveStep(prev => (prev >= 3 ? 1 : prev + 1))
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    const teamMembers = [
        { name: "Sarah Johnson", role: "Principal", image: "👩‍🏫" },
        { name: "Michael Chen", role: "Vice Principal", image: "👨‍🏫" },
        { name: "Emily Davis", role: "Head of Academics", image: "👩‍💼" }
    ]

    const processes = [
        {
            step: "01",
            title: "Enrollment",
            description: "Simple and streamlined admission process with guidance at every step for new students and parents."
        },
        {
            step: "02",
            title: "Learning",
            description: "Comprehensive curriculum delivered through innovative teaching methods and personalized attention."
        },
        {
            step: "03",
            title: "Growth",
            description: "Continuous assessment and development to ensure each student reaches their full potential."
        }
    ]

    const services = [
        {
            icon: "🎓",
            title: "Academic Excellence",
            description: "Comprehensive curriculum designed to challenge and inspire students at every level."
        },
        {
            icon: "🏃‍♂️",
            title: "Sports & Activities",
            description: "Wide range of extracurricular activities to develop well-rounded personalities."
        },
        {
            icon: "🔬",
            title: "Modern Facilities",
            description: "State-of-the-art laboratories, library, and technology-enhanced classrooms."
        },
        {
            icon: "👥",
            title: "Counseling Support",
            description: "Professional guidance and counseling services for academic and personal development."
        }
    ]

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <Navbar />
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                            {/* Left Content */}
                            <div className={`space-y-6 transform transition-all duration-700 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'}`}>
                                <div className="space-y-4">
                                    {/* Badge */}
                                    <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                        About Our School
                                    </div>

                                    {/* Main Heading */}
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                                        About Us
                                    </h1>

                                    {/* Description */}
                                    <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                                        Bright Future School provides premier educational services focused on academic excellence,
                                        character development, and preparing students for a successful future. Our experienced
                                        faculty and modern facilities create an environment where every student can thrive.
                                    </p>
                                </div>

                                {/* Button */}
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
                                        <span>Learn More</span>
                                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Right Visual */}
                            <div className={`relative transform transition-all duration-700 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-5 opacity-0'}`}>
                                <div className="relative">
                                    {/* Main Card */}
                                    <div className="w-full h-80 lg:h-96 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                                        {/* Content */}
                                        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                                            {/* School Icon */}
                                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                                <span className="text-2xl">🏫</span>
                                            </div>

                                            <h3 className="text-xl font-bold text-slate-900 mb-2">Bright Future School</h3>
                                            <p className="text-slate-600 mb-4">Excellence in Education</p>
                                            <p className="text-sm text-slate-500 max-w-xs">Your school image will be displayed here</p>
                                        </div>
                                    </div>

                                    {/* Simple Decorative Elements */}
                                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center shadow-md">
                                        <span className="text-lg">📖</span>
                                    </div>

                                    <div className="absolute -bottom-3 -left-3 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shadow-md">
                                        <span className="text-sm">🎯</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
                                We Provide Best Educational Services
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Comprehensive educational programs designed to nurture young minds and build character
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {services.map((service, index) => (
                                <div
                                    key={index}
                                    className={`group p-6 bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                    style={{ transitionDelay: `${index * 200}ms` }}
                                >
                                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-2xl">{service.icon}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3">{service.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
                                Our Leadership Team
                            </h2>
                            <p className="text-xl text-gray-600">
                                Dedicated professionals committed to educational excellence
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {teamMembers.map((member, index) => (
                                <div
                                    key={index}
                                    className={`group text-center transform transition-all duration-700 hover:-translate-y-2 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                    style={{ transitionDelay: `${index * 200}ms` }}
                                >
                                    <div className="relative mb-6">
                                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-5xl group-hover:shadow-xl transition-all duration-300">
                                            {member.image}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{member.name}</h3>
                                    <p className="text-blue-600 font-medium">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Process Section */}
                <div className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
                                Our Process
                            </h2>
                            <p className="text-xl text-gray-600">
                                Simple steps to join our educational community
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 relative">
                            {/* Connecting Lines */}
                            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"></div>

                            {processes.map((process, index) => (
                                <div
                                    key={index}
                                    className={`relative text-center group cursor-pointer transition-all duration-500 ${activeStep === index + 1 ? 'scale-105' : ''}`}
                                    onClick={() => setActiveStep(index + 1)}
                                >
                                    <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 ${activeStep === index + 1
                                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-600 hover:bg-blue-100'
                                        }`}>
                                        {process.step}
                                    </div>

                                    <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${activeStep === index + 1 ? 'text-blue-600' : 'text-slate-800'
                                        }`}>
                                        {process.title}
                                    </h3>

                                    <p className="text-gray-600 leading-relaxed">
                                        {process.description}
                                    </p>

                                    {activeStep === index + 1 && (
                                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Case Study Section */}
                <div className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
                                Success Stories
                            </h2>
                            <p className="text-xl text-gray-600">
                                Real achievements from our educational programs
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">
                                        Academic Excellence Program
                                    </h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        Our comprehensive academic program has helped over 95% of our students achieve their
                                        educational goals and gain admission to their preferred higher education institutions.
                                        Through personalized learning approaches and dedicated faculty support, we ensure
                                        every student reaches their full potential.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                            95% Success Rate
                                        </div>
                                        <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                            1000+ Graduates
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
                                        <div className="text-center">
                                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                                <span className="text-3xl">🏆</span>
                                            </div>
                                            <h4 className="text-xl font-bold mb-2">Excellence Award</h4>
                                            <p className="text-blue-100">Outstanding Educational Institution 2024</p>
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
    )
}

export default About