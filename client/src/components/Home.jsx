import React, { useState, useEffect } from 'react'
import { CardBody, CardContainer, CardItem } from './ui/3d-card';
import Footer from './Footer';

// Background Ripple Effect Component - COVERS ENTIRE PAGE
// Improved Background Ripple Effect Component
const BackgroundRippleEffect = () => {
    const [clickedCell, setClickedCell] = useState(null);
    const [rippleKey, setRippleKey] = useState(0);

    // Calculate grid dimensions based on viewport
    const cellSize = 70;
    const [dimensions, setDimensions] = useState({
        cols: Math.ceil(document.documentElement.scrollWidth / cellSize) + 2,
        rows: Math.ceil(document.documentElement.scrollHeight / cellSize) + 2
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                cols: Math.ceil(document.documentElement.scrollWidth / cellSize) + 2,
                rows: Math.ceil(document.documentElement.scrollHeight / cellSize) + 2
            });
        };

        const handleScroll = () => {
            setClickedCell(null);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);
        
        setTimeout(handleResize, 100);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const cells = Array.from({ length: dimensions.rows * dimensions.cols }, (_, idx) => idx);

    return (
        <div
            className="fixed inset-0 w-full h-full overflow-hidden cursor-pointer"
            style={{
                width: '100%',
                height: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 0
            }}
            onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const col = Math.floor(x / cellSize);
                const row = Math.floor(y / cellSize);
                setClickedCell({ row, col });
                setRippleKey((k) => k + 1);
            }}
        >
            {/* Classic Dark Elegant Background */}
            <div 
                className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
                style={{
                    width: `${dimensions.cols * cellSize}px`,
                    height: `${dimensions.rows * cellSize}px`,
                    minWidth: '100vw',
                    minHeight: '100vh'
                }}
            >
                <div
                    className="absolute top-0 left-0"
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${dimensions.cols}, ${cellSize}px)`,
                        gridTemplateRows: `repeat(${dimensions.rows}, ${cellSize}px)`,
                        width: `${dimensions.cols * cellSize}px`,
                        height: `${dimensions.rows * cellSize}px`,
                    }}
                >
                    {cells.map((idx) => {
                        const rowIdx = Math.floor(idx / dimensions.cols);
                        const colIdx = idx % dimensions.cols;
                        const distance = clickedCell
                            ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
                            : 0;
                        const delay = clickedCell ? Math.max(0, distance * 25) : 0;
                        const duration = 100 + distance * 30;

                        return (
                            <div
                                key={`${idx}-${rippleKey}`}
                                className="border border-gray-700/40 bg-gray-800/20 transition-all duration-400 hover:bg-gray-700/30"
                                style={{
                                    animation: clickedCell
                                        ? `cellRipple ${duration}ms ease-out ${delay}ms forwards`
                                        : undefined,
                                }}
                            />
                        );
                    })}
                </div>
                
                {/* Subtle Texture Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.03)_0%,_transparent_70%)]"></div>
            </div>
            <style>{`
                @keyframes cellRipple {
                    0% {
                        background-color: rgba(31, 41, 55, 0.2);
                        transform: scale(1);
                        border-color: rgba(55, 65, 81, 0.4);
                    }
                    50% {
                        background-color: rgba(55, 65, 81, 0.4);
                        transform: scale(1.02);
                        border-color: rgba(75, 85, 99, 0.6);
                    }
                    100% {
                        background-color: rgba(31, 41, 55, 0.2);
                        transform: scale(1);
                        border-color: rgba(55, 65, 81, 0.4);
                    }
                }
            `}</style>
        </div>
    );
};

const Home = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [currentStat, setCurrentStat] = useState({ students: 0, courses: 0, teachers: 0 })
    const [activeStep, setActiveStep] = useState(1)

    useEffect(() => {
        setIsVisible(true)

        let interval
        const timer = setTimeout(() => {
            interval = setInterval(() => {
                setCurrentStat(prev => ({
                    students: prev.students < 1000 ? prev.students + 25 : 1000,
                    courses: prev.courses < 40 ? prev.courses + 1 : 40,
                    teachers: prev.teachers < 80 ? prev.teachers + 2 : 80
                }))
            }, 50)

            setTimeout(() => clearInterval(interval), 2000)
        }, 1000)

        // Auto-rotate through process steps
        const processInterval = setInterval(() => {
            setActiveStep(prev => (prev >= 3 ? 1 : prev + 1))
        }, 3000)

        return () => {
            clearTimeout(timer)
            clearInterval(interval)
            clearInterval(processInterval)
        }
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
        <div className="relative min-h-screen bg-black">
            {/* Full Screen Background Ripple Effect - COVERS ENTIRE PAGE */}
            <BackgroundRippleEffect />

            {/* Main Content - Higher z-index */}
            <div className="relative z-10 min-h-screen pointer-events-none">
                <div className="pointer-events-auto">
                    {/* Hero Section */}
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                            {/* Left Content */}
                            <div className={`space-y-6 transform transition-all duration-700 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'}`}>
                                <div className="space-y-4">
                                    {/* Badge */}
                                    <div className="inline-flex items-center px-4 py-2 bg-slate-800/80 text-slate-300 rounded-full text-sm font-medium border border-slate-700/50 backdrop-blur-sm">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full mr-2 animate-pulse"></span>
                                        Excellence in Education
                                    </div>

                                    {/* Main Heading */}
                                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
                                        Quality Education
                                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-400 mt-2">For Bright Future</span>
                                    </h1>

                                    {/* Description */}
                                    <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
                                        Excellence in education designed to inspire curiosity, creativity, and confidence in every student for a successful tomorrow.
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center backdrop-blur-md bg-black/40 rounded-xl p-4 sm:p-6 border border-slate-800/50 shadow-2xl hover:border-slate-700/70 transition-all duration-300 hover:scale-105">
                                        <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{currentStat.students}+</div>
                                        <div className="text-slate-400 text-xs sm:text-sm font-medium uppercase tracking-wide">Students</div>
                                    </div>
                                    <div className="text-center backdrop-blur-md bg-black/40 rounded-xl p-4 sm:p-6 border border-slate-800/50 shadow-2xl hover:border-slate-700/70 transition-all duration-300 hover:scale-105">
                                        <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{currentStat.courses}+</div>
                                        <div className="text-slate-400 text-xs sm:text-sm font-medium uppercase tracking-wide">Courses</div>
                                    </div>
                                    <div className="text-center backdrop-blur-md bg-black/40 rounded-xl p-4 sm:p-6 border border-slate-800/50 shadow-2xl hover:border-slate-700/70 transition-all duration-300 hover:scale-105">
                                        <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{currentStat.teachers}+</div>
                                        <div className="text-slate-400 text-xs sm:text-sm font-medium uppercase tracking-wide">Teachers</div>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className="group px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center backdrop-blur-sm shadow-2xl hover:shadow-slate-700/30 hover:scale-105 border border-slate-700/50">
                                        <span className="text-lg">Explore Activities</span>
                                        <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button>

                                    <button className="group px-8 py-4 border-2 border-slate-700/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800/30 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center backdrop-blur-sm shadow-2xl hover:shadow-slate-700/30 hover:scale-105">
                                        <span className="text-lg">Contact Us</span>
                                        <svg className="ml-3 w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Right Visual */}
                            <CardContainer className="inter-var">
                                <div
                                    className={`relative transform transition-all duration-700 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-5 opacity-0'
                                        }`}
                                >
                                    <div className="relative">
                                        <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] rounded-xl p-0 border overflow-hidden">

                                            {/* Background Image Section */}
                                            <div className="relative w-full h-96 lg:h-[500px] rounded-xl overflow-hidden">
                                                <img
                                                    src="https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?_gl=1*1de4ikx*_ga*MTc3Mjk0MDM3LjE3NjA3MjIwNTY.*_ga_8JE65Q40S6*czE3NjA3MjIwNTYkbzEkZzEkdTE3NjA3MjIyOTgkajQ1JGwwJGgw"
                                                    alt="Ankur School Campus"
                                                    className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                                />

                                                {/* Overlay Text */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end pb-10 text-center transition-all duration-500">
                                                    <h3 className="text-3xl font-bold text-white mb-2">Ankur School</h3>
                                                    <p className="text-slate-300 text-lg">Excellence in Education</p>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </div>
                                </div>
                            </CardContainer>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="py-24 bg-black/40 backdrop-blur-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                                    Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-400">Ankur School</span>?
                                </h2>
                                <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                                    We provide comprehensive education with modern facilities and experienced faculty to shape tomorrow's leaders.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[
                                    { icon: "🎓", title: "Expert Faculty", desc: "Learn from qualified and experienced teachers dedicated to student success.", color: "from-slate-800/50 to-slate-900/50" },
                                    { icon: "💻", title: "Modern Facilities", desc: "State-of-the-art classrooms, labs, and technology infrastructure.", color: "from-slate-800/50 to-slate-900/50" },
                                    { icon: "🌟", title: "Academic Excellence", desc: "Proven track record of outstanding academic achievements and results.", color: "from-slate-800/50 to-slate-900/50" },
                                    { icon: "🤝", title: "Strong Community", desc: "Supportive school community fostering growth and collaboration.", color: "from-slate-800/50 to-slate-900/50" }
                                ].map((feature, index) => (
                                    <div
                                        key={index}
                                        className={`group p-8 bg-black/40 backdrop-blur-md rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-slate-800/50 hover:border-slate-700/70 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                        style={{ transitionDelay: `${index * 50}ms` }}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                        <div className="relative">
                                            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                                                {feature.icon}
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-4 text-center">{feature.title}</h3>
                                            <p className="text-slate-400 text-center leading-relaxed">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Services Section */}
                    <div className="py-24 bg-black/40 backdrop-blur-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                                    We Provide <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-400">Best Educational</span> Services
                                </h2>
                                <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                                    Comprehensive educational programs designed to nurture young minds and build character
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {services.map((service, index) => (
                                    <div
                                        key={index}
                                        className={`group p-8 bg-black/40 backdrop-blur-md rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-slate-800/50 hover:border-slate-700/70 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                        style={{ transitionDelay: `${index * 50}ms` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="relative">
                                            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                                                {service.icon}
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-4 text-center">{service.title}</h3>
                                            <p className="text-slate-400 text-center leading-relaxed">{service.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="py-24 bg-black">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-20">
                                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-400">Leadership</span> Team
                                </h2>
                                <p className="text-xl text-slate-400">
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
                                            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center text-5xl group-hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-slate-700/50">
                                                {member.image}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                                        <p className="text-slate-400 font-medium">{member.role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Process Section */}
                    <div className="py-24 bg-black/40 backdrop-blur-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-20">
                                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-400">Process</span>
                                </h2>
                                <p className="text-xl text-slate-400">
                                    Simple steps to join our educational community
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 relative">
                                {/* Connecting Lines */}
                                <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700"></div>

                                {processes.map((process, index) => (
                                    <div
                                        key={index}
                                        className={`relative text-center group cursor-pointer transition-all duration-500 ${activeStep === index + 1 ? 'scale-105' : ''}`}
                                        onClick={() => setActiveStep(index + 1)}
                                    >
                                        <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 backdrop-blur-sm border ${activeStep === index + 1
                                            ? 'bg-gradient-to-br from-slate-700 to-slate-800 text-white shadow-lg border-slate-600'
                                            : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800/50 border-slate-700/50'
                                            }`}>
                                            {process.step}
                                        </div>

                                        <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${activeStep === index + 1 ? 'text-white' : 'text-slate-300'
                                            }`}>
                                            {process.title}
                                        </h3>

                                        <p className="text-slate-400 leading-relaxed">
                                            {process.description}
                                        </p>

                                        {activeStep === index + 1 && (
                                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Case Study Section */}
                    <div className="py-24 bg-black">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-20">
                                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                                    Success <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-400">Stories</span>
                                </h2>
                                <p className="text-xl text-slate-400">
                                    Real achievements from our educational programs
                                </p>
                            </div>

                            <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-slate-800/50">
                                <div className="grid lg:grid-cols-2 gap-12 items-center">
                                    <div>
                                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                                            Academic Excellence Program
                                        </h3>
                                        <p className="text-slate-400 mb-6 leading-relaxed">
                                            Our comprehensive academic program has helped over 95% of our students achieve their
                                            educational goals and gain admission to their preferred higher education institutions.
                                            Through personalized learning approaches and dedicated faculty support, we ensure
                                            every student reaches their full potential.
                                        </p>
                                        <div className="flex flex-wrap gap-4">
                                            <div className="px-4 py-2 bg-slate-800/80 text-slate-300 rounded-full text-sm font-medium backdrop-blur-sm border border-slate-700/50">
                                                95% Success Rate
                                            </div>
                                            <div className="px-4 py-2 bg-slate-800/80 text-slate-300 rounded-full text-sm font-medium backdrop-blur-sm border border-slate-700/50">
                                                1000+ Graduates
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-xl border border-slate-700/50">
                                            <div className="text-center">
                                                <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                                    <span className="text-3xl">🏆</span>
                                                </div>
                                                <h4 className="text-xl font-bold mb-2">Excellence Award</h4>
                                                <p className="text-slate-400">Outstanding Educational Institution 2024</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    )
}

export default Home