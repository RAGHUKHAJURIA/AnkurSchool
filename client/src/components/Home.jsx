import React, { useState, useEffect } from 'react'
import Footer from './Footer'

const Home = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [currentStat, setCurrentStat] = useState({ students: 0, courses: 0, teachers: 0 })

    useEffect(() => {
        setIsVisible(true)

        let interval // declare here so cleanup can access it
        const timer = setTimeout(() => {
            interval = setInterval(() => {
                setCurrentStat(prev => ({
                    students: prev.students < 1650 ? prev.students + 25 : 1650,
                    courses: prev.courses < 50 ? prev.courses + 1 : 50,
                    teachers: prev.teachers < 120 ? prev.teachers + 2 : 120
                }))
            }, 50)

            // stop counting after 2 seconds
            setTimeout(() => clearInterval(interval), 2000)
        }, 1000)

        // cleanup on unmount
        return () => {
            clearTimeout(timer)
            clearInterval(interval)
        }
    }, [])

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
                                        Excellence in Education
                                    </div>

                                    {/* Main Heading */}
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                                        Quality Education
                                        <span className="block text-blue-600 mt-1">For Bright Future</span>
                                    </h1>

                                    {/* Description */}
                                    <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                                        Excellence in education designed to inspire curiosity, creativity, and confidence in every student for a successful tomorrow.
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                                    <div className="text-center">
                                        <div className="text-2xl sm:text-3xl font-bold text-slate-900">{currentStat.students}+</div>
                                        <div className="text-slate-600 text-sm font-medium">Students</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl sm:text-3xl font-bold text-slate-900">{currentStat.courses}+</div>
                                        <div className="text-slate-600 text-sm font-medium">Courses</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl sm:text-3xl font-bold text-slate-900">{currentStat.teachers}+</div>
                                        <div className="text-slate-600 text-sm font-medium">Teachers</div>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center">
                                        <span>Explore Activities</span>
                                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button>

                                    <button className="px-6 py-3 border-2 border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center">
                                        <span>Contact Us</span>
                                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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
                                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>

                                            <h3 className="text-xl font-bold text-slate-900 mb-2">Ankur School</h3>
                                            <p className="text-slate-600 mb-4">Excellence in Education</p>
                                            <p className="text-sm text-slate-500 max-w-xs">Your school image will be displayed here</p>
                                        </div>
                                    </div>

                                    {/* Simple Decorative Elements */}
                                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center shadow-md">
                                        <span className="text-lg">🎓</span>
                                    </div>

                                    <div className="absolute -bottom-3 -left-3 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shadow-md">
                                        <span className="text-sm">📚</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
                                Why Choose Bright Future School?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                We provide comprehensive education with modern facilities and experienced faculty
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: "🎓", title: "Expert Faculty", desc: "Learn from qualified and experienced teachers" },
                                { icon: "💻", title: "Modern Facilities", desc: "State-of-the-art classrooms and technology" },
                                { icon: "🌟", title: "Excellence", desc: "Proven track record of academic success" },
                                { icon: "🤝", title: "Community", desc: "Strong school community and support system" }
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className={`group p-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                    style={{ transitionDelay: `${index * 200}ms` }}
                                >
                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <Footer />
        </>
    )
}

export default Home
