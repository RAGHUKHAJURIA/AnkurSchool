import React, { useState } from 'react';
import { Calendar, Trophy, Star, Users, Music, BookOpen, Palette, Camera, Award, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Activities = () => {
    const [expandedActivity, setExpandedActivity] = useState(null);

    const activities = [
        {
            id: 1,
            title: "15 August Celebration",
            category: "National Events",
            icon: <Star className="w-6 h-6" />,
            date: "August 15, 2024",
            image: "https://images.unsplash.com/photo-1600093112291-7b553e3fcb82?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470",
            smallImage: "🇮🇳",
            shortDescription: "Celebrating India's Independence Day with patriotic fervor",
            fullDescription: "Join us for a grand celebration of India's Independence Day. The event includes flag hoisting ceremony, cultural performances, patriotic songs, dance performances by students, and inspiring speeches. Students showcase their talents through various patriotic themed activities including essay competitions, poster making, and dramatic presentations about freedom fighters.",
            highlights: [
                "Flag Hoisting Ceremony at 8:00 AM",
                "Cultural performances by students",
                "Patriotic song competitions",
                "Essay writing on freedom fighters",
                "Traditional dance performances",
                "Awards and recognition ceremony"
            ],
            color: "bg-orange-600"
        },
        {
            id: 2,
            title: "Sports Activities",
            category: "Physical Education",
            icon: <Trophy className="w-6 h-6" />,
            date: "Ongoing",
            image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1607",
            smallImage: "🏆",
            shortDescription: "Comprehensive sports program for physical and mental development",
            fullDescription: "Our comprehensive sports program is designed to promote physical fitness, teamwork, and healthy competition among students. We offer a wide range of indoor and outdoor sports activities that cater to different interests and skill levels. Students participate in inter-house competitions, district level tournaments, and state championships.",
            highlights: [
                "Cricket, Football, Basketball tournaments",
                "Track and field events",
                "Swimming competitions",
                "Indoor games like Chess, Carrom, Table Tennis",
                "Yoga and fitness training",
                "Inter-school sports competitions"
            ],
            color: "bg-green-600"
        },
        {
            id: 3,
            title: "Basant Panchami",
            category: "Cultural Events",
            icon: <Palette className="w-6 h-6" />,
            date: "February 14, 2024",
            image: "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=600&h=400&fit=crop",
            smallImage: "🌻",
            shortDescription: "Welcoming spring with traditional celebrations and cultural programs",
            fullDescription: "Basant Panchami marks the arrival of spring and is dedicated to Goddess Saraswati, the deity of knowledge and arts. Our school celebrates this auspicious day with great enthusiasm through cultural programs, traditional decorations, and educational activities. Students wear yellow attire symbolizing the vibrant colors of spring.",
            highlights: [
                "Saraswati Puja ceremony",
                "Students wear traditional yellow attire",
                "Classical dance and music performances",
                "Kite flying competition",
                "Poetry recitation in various languages",
                "Art and craft exhibitions"
            ],
            color: "bg-yellow-600"
        },
        {
            id: 4,
            title: "Science Exhibition",
            category: "Academic Events",
            icon: <BookOpen className="w-6 h-6" />,
            date: "March 10, 2024",
            image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop",
            smallImage: "🔬",
            shortDescription: "Showcasing innovative projects and scientific discoveries",
            fullDescription: "Our annual Science Exhibition provides a platform for students to showcase their innovative projects, experiments, and scientific discoveries. Students from all grades participate by creating working models, conducting live experiments, and presenting their research findings. The event encourages scientific thinking and creativity.",
            highlights: [
                "Working models and innovative projects",
                "Live science experiments and demonstrations",
                "Research presentations by students",
                "Robotics and technology showcases",
                "Environmental science projects",
                "Awards for best innovations"
            ],
            color: "bg-blue-600"
        },
        {
            id: 5,
            title: "Cultural Fest",
            category: "Cultural Events",
            icon: <Music className="w-6 h-6" />,
            date: "December 15, 2024",
            image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=400&fit=crop",
            smallImage: "🎭",
            shortDescription: "Grand celebration of arts, music, and cultural diversity",
            fullDescription: "Our annual Cultural Fest is a vibrant celebration of arts, music, dance, and cultural diversity. Students participate in various competitions including singing, dancing, drama, fashion shows, and cultural performances representing different states and countries. The event promotes cultural awareness and artistic expression.",
            highlights: [
                "Inter-house cultural competitions",
                "Traditional and modern dance performances",
                "Music concerts and singing competitions",
                "Drama and theatrical presentations",
                "Fashion shows with cultural themes",
                "Food festival representing various cultures"
            ],
            color: "bg-purple-600"
        },
        {
            id: 6,
            title: "Photography Club",
            category: "Clubs & Societies",
            icon: <Camera className="w-6 h-6" />,
            date: "Weekly Sessions",
            image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop",
            smallImage: "📸",
            shortDescription: "Capturing memories and developing photography skills",
            fullDescription: "The Photography Club is dedicated to nurturing the creative vision of students interested in photography. Members learn various photography techniques, participate in photo walks, organize exhibitions, and document school events. The club provides hands-on experience with professional equipment and editing software.",
            highlights: [
                "Weekly photography workshops",
                "Photo walks and outdoor sessions",
                "Digital editing and post-processing training",
                "Annual photography exhibition",
                "School event documentation",
                "Nature and portrait photography sessions"
            ],
            color: "bg-indigo-600"
        }
    ];

    const toggleActivity = (activityId) => {
        setExpandedActivity(expandedActivity === activityId ? null : activityId);
    };

    return (
        <>
            <div className="min-h-screen bg-gray-900">
                <Navbar />
                
                {/* Hero Section */}
                <div className="bg-gray-900">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                        <div className="text-center">
                            <div className="space-y-6">
                                {/* Badge */}
                                <div className="inline-flex items-center px-4 py-2 bg-gray-800/80 text-gray-300 rounded-full text-sm font-medium border border-gray-700/50 backdrop-blur-sm">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2 animate-pulse"></span>
                                    Student Life
                                </div>

                                {/* Main Heading */}
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                                    School Activities
                                </h1>

                                {/* Description */}
                                <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                                    Discover our vibrant school community through various activities, events, and programs designed to enhance your educational experience
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="py-20 bg-gray-800/40 backdrop-blur-sm">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="group p-6 bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
                                <div className="text-3xl font-bold text-white mb-2">50+</div>
                                <div className="text-gray-400 text-sm">Annual Events</div>
                            </div>
                            <div className="group p-6 bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
                                <div className="text-3xl font-bold text-white mb-2">15+</div>
                                <div className="text-gray-400 text-sm">Sports Activities</div>
                            </div>
                            <div className="group p-6 bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
                                <div className="text-3xl font-bold text-white mb-2">20+</div>
                                <div className="text-gray-400 text-sm">Clubs & Societies</div>
                            </div>
                            <div className="group p-6 bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
                                <div className="text-3xl font-bold text-white mb-2">100%</div>
                                <div className="text-gray-400 text-sm">Participation</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activities Section */}
                <div className="py-20 bg-gray-900">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Our Activities</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                Click on any activity to learn more about what we offer and how you can participate
                            </p>
                        </div>

                        <div className="space-y-6">
                            {activities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="bg-gray-800/40 backdrop-blur-md rounded-2xl border border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-2xl"
                                >
                                    {/* Activity Header - Always Visible */}
                                    <div
                                        className="p-6 cursor-pointer"
                                        onClick={() => toggleActivity(activity.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 ${activity.color} rounded-lg flex items-center justify-center text-white`}>
                                                    {activity.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="text-xl font-bold text-white">{activity.title}</h3>
                                                        <span className="text-4xl mr-4">{activity.smallImage}</span>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300">
                                                            {activity.category}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-gray-400 text-sm">
                                                            <Calendar className="w-4 h-4" />
                                                            {activity.date}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-400 mt-2">{activity.shortDescription}</p>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                {expandedActivity === activity.id ? (
                                                    <ChevronUp className="w-6 h-6 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="w-6 h-6 text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {expandedActivity === activity.id && (
                                        <div className="border-t border-gray-700/50 bg-gray-800/30">
                                            <div className="p-6">
                                                <div className="grid md:grid-cols-2 gap-8">
                                                    {/* Left Column - Image and Description */}
                                                    <div>
                                                        <div className="mb-6 rounded-lg overflow-hidden border border-gray-600/30">
                                                            <img
                                                                src={activity.image}
                                                                alt={activity.title}
                                                                className="w-full h-48 object-cover"
                                                            />
                                                        </div>
                                                        <h4 className="text-lg font-semibold text-white mb-3">About This Activity</h4>
                                                        <p className="text-gray-300 leading-relaxed mb-6">
                                                            {activity.fullDescription}
                                                        </p>

                                                        <div className="flex gap-4">
                                                            <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 border border-gray-600/50">
                                                                Join Activity
                                                            </button>
                                                            <button className="border border-gray-600/50 hover:border-gray-500/50 text-white px-6 py-2 rounded-lg transition-colors duration-200">
                                                                Learn More
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Right Column - Highlights and Additional Info */}
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-white mb-3">Key Highlights</h4>
                                                        <div className="space-y-3">
                                                            {activity.highlights.map((highlight, index) => (
                                                                <div key={index} className="flex items-start gap-3">
                                                                    <div className={`w-2 h-2 ${activity.color} rounded-full mt-2 flex-shrink-0`}></div>
                                                                    <p className="text-gray-300 text-sm">{highlight}</p>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Achievement Badge */}
                                                        <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Award className="w-5 h-5 text-yellow-400" />
                                                                <span className="text-yellow-400 font-medium">Achievement Opportunities</span>
                                                            </div>
                                                            <p className="text-gray-300 text-sm">
                                                                Participate and earn certificates, badges, and recognition for your achievements in this activity.
                                                            </p>
                                                        </div>

                                                        {/* Additional Info */}
                                                        <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Users className="w-5 h-5 text-blue-400" />
                                                                <span className="text-blue-400 font-medium">Participation Details</span>
                                                            </div>
                                                            <p className="text-gray-300 text-sm">
                                                                Open to all students. No prior experience required. Contact your class teacher to register.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <Footer />
        </>
    );
};

export default Activities;