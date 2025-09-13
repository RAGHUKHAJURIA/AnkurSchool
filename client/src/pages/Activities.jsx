import React, { useState } from 'react';
import { Calendar, Trophy, Star, Users, Music, BookOpen, Palette, Camera, Award, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../components/Navbar';

const Activities = () => {
    const [expandedActivity, setExpandedActivity] = useState(null);

    const activities = [
        {
            id: 1,
            title: "15 August Celebration",
            category: "National Events",
            icon: <Star className="w-6 h-6" />,
            date: "August 15, 2024",
            image: "https://images.unsplash.com/photo-1626680710480-8c80fbfc2f1d?w=400&h=300&fit=crop",
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
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
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
            image: "https://images.unsplash.com/photo-1649859394614-dc4f7290b7f2?w=400&h=300&fit=crop",
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
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
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
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
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
            image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop",
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            <Navbar />
            {/* Header Section */}
            <div className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-600/20 rounded-full text-blue-300 text-sm font-medium mb-6">
                        🎯 Student Life
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        School
                        <span className="text-blue-400"> Activities</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Discover our vibrant school community through various activities, events, and programs designed to enhance your educational experience
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="px-4 sm:px-6 lg:px-8 mb-16">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
                            <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
                            <div className="text-gray-300 text-sm">Annual Events</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
                            <div className="text-3xl font-bold text-green-400 mb-2">15+</div>
                            <div className="text-gray-300 text-sm">Sports Activities</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
                            <div className="text-3xl font-bold text-purple-400 mb-2">20+</div>
                            <div className="text-gray-300 text-sm">Clubs & Societies</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
                            <div className="text-3xl font-bold text-yellow-400 mb-2">100%</div>
                            <div className="text-gray-300 text-sm">Participation</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activities Section */}
            <div className="px-4 sm:px-6 lg:px-8 pb-20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Our Activities</h2>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            Click on any activity to learn more about what we offer and how you can participate
                        </p>
                    </div>

                    <div className="space-y-6">
                        {activities.map((activity) => (
                            <div
                                key={activity.id}
                                className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden transition-all duration-300 hover:bg-white/15"
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
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-300">
                                                        {activity.category}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-gray-300 text-sm">
                                                        <Calendar className="w-4 h-4" />
                                                        {activity.date}
                                                    </span>
                                                </div>
                                                <p className="text-gray-300 mt-2">{activity.shortDescription}</p>
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
                                    <div className="border-t border-white/20 bg-white/5">
                                        <div className="p-6">
                                            <div className="grid md:grid-cols-2 gap-8">
                                                {/* Left Column - Image and Description */}
                                                <div>
                                                    <div className="mb-6 rounded-lg overflow-hidden">
                                                        <img
                                                            src={activity.image}
                                                            alt={activity.title}
                                                            className="w-full h-48 object-cover rounded-lg"
                                                        />
                                                    </div>
                                                    <h4 className="text-lg font-semibold text-white mb-3">About This Activity</h4>
                                                    <p className="text-gray-300 leading-relaxed mb-6">
                                                        {activity.fullDescription}
                                                    </p>

                                                    <div className="flex gap-4">
                                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
                                                            Join Activity
                                                        </button>
                                                        <button className="border border-white/30 hover:border-white/50 text-white px-6 py-2 rounded-lg transition-colors duration-200">
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
                                                    <div className="mt-6 p-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg border border-yellow-500/30">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Award className="w-5 h-5 text-yellow-400" />
                                                            <span className="text-yellow-400 font-medium">Achievement Opportunities</span>
                                                        </div>
                                                        <p className="text-gray-300 text-sm">
                                                            Participate and earn certificates, badges, and recognition for your achievements in this activity.
                                                        </p>
                                                    </div>

                                                    {/* Additional Info */}
                                                    <div className="mt-6 p-4 bg-blue-600/10 rounded-lg border border-blue-500/30">
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

            {/* Join Activities CTA */}
            <div className="bg-white/5 border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Join Our Activities?
                    </h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Become part of our vibrant school community and discover your talents through various activities and programs
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                            <Users className="w-5 h-5" />
                            Join Activities
                        </button>
                        <button className="bg-transparent border border-white/30 hover:border-white/50 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200">
                            View Calendar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Activities;