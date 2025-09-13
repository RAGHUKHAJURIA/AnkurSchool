import React, { useState, useEffect } from 'react'

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900">
                <div className="absolute inset-0 bg-black/20"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                            <div className="space-y-4">
                                <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 text-blue-200 rounded-full text-sm font-medium backdrop-blur-sm">
                                    🌟 World Class Learning Center
                                </div>
                                
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                    Quality Education
                                    <span className="block text-blue-300">For Bright Future</span>
                                </h1>
                                
                                <p className="text-lg sm:text-xl text-gray-300 max-w-2xl">
                                    Excellence in education designed to inspire curiosity, creativity, and confidence in every student for a successful tomorrow.
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl sm:text-3xl font-bold text-white">{currentStat.students}+</div>
                                    <div className="text-blue-200 text-sm">Students</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl sm:text-3xl font-bold text-white">{currentStat.courses}+</div>
                                    <div className="text-blue-200 text-sm">Courses</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl sm:text-3xl font-bold text-white">{currentStat.teachers}+</div>
                                    <div className="text-blue-200 text-sm">Teachers</div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                                    <span className="flex items-center justify-center">
                                        Activities
                                        <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </span>
                                </button>
                                
                                <button className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-slate-800 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                                    Contact Us
                                </button>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                            <div className="relative">
                                <div className="w-full h-96 lg:h-[500px] bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl overflow-hidden shadow-2xl">
                                    {/* Placeholder for your school image */}
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                        <div className="text-center text-white p-8">
                                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                            <p className="text-lg font-medium">Your School Image</p>
                                            <p className="text-sm opacity-75">Will be displayed here</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Floating Elements */}
                                <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full animate-bounce opacity-80 flex items-center justify-center">
                                    <span className="text-2xl">🎓</span>
                                </div>
                                
                                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400 rounded-full animate-pulse opacity-80 flex items-center justify-center">
                                    <span className="text-xl">📚</span>
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

            {/* Call to Action */}
            <div className="py-20 bg-gradient-to-r from-slate-800 to-blue-900">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Ready to Start Your Educational Journey?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Join thousands of students who have chosen excellence in education
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                            <span className="flex items-center justify-center">
                                Apply Now
                                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </button>
                        
                        <button className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-slate-800 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                            Contact Us
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
