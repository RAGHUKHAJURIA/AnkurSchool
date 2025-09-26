import React, { useState, useEffect } from 'react';
import {
    Users,
    CreditCard,
    FileText,
    CheckCircle,
    Clock,
    TrendingUp,
    School,
    DollarSign,
    ArrowRight,
    BarChart3,
    Settings,
    Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthSimple } from '../hooks/useAdminAuthSimple.jsx';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { makeAdminRequest } = useAdminAuthSimple();
    const [stats, setStats] = useState({
        totalStudents: 0,
        pendingRequests: 0,
        totalPayments: 0,
        approvedStudents: 0,
        unreadMessages: 0,
        totalMessages: 0
    });
    const [recentMessages, setRecentMessages] = useState([]);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch students
            const studentsResponse = await makeAdminRequest('GET', '/api/admin/students');
            const totalStudents = studentsResponse.data.count || 0;

            // Fetch pending requests
            const requestsResponse = await makeAdminRequest('GET', '/api/admin/requests');
            const pendingRequests = requestsResponse.data.data?.filter(req => req.status === 'pending').length || 0;

            // Calculate approved students
            const approvedStudents = studentsResponse.data.data?.filter(student => student.status === 'active').length || 0;

            // Fetch message stats
            const messageStatsResponse = await makeAdminRequest('GET', '/api/admin/messages/stats');
            const unreadMessages = messageStatsResponse.data.data?.unreadMessages || 0;
            const totalMessages = messageStatsResponse.data.data?.totalMessages || 0;

            // Fetch recent unread messages
            const recentMessagesResponse = await makeAdminRequest('GET', '/api/admin/messages/recent-unread?limit=5');
            const recentMessagesData = recentMessagesResponse.data.data?.messages || [];

            setStats({
                totalStudents,
                pendingRequests,
                totalPayments: 0, // Will be updated when payment system is integrated
                approvedStudents,
                unreadMessages,
                totalMessages
            });
            setRecentMessages(recentMessagesData);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const dashboardCards = [
        {
            title: 'Student Data',
            description: 'Manage all student information, view records, and update details',
            icon: Users,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            route: '/admin/students',
            stats: stats.totalStudents,
            statsLabel: 'Total Students'
        },
        {
            title: 'Payment',
            description: 'Handle payment processing, view transactions, and manage fees',
            icon: CreditCard,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            route: '/admin/payments',
            stats: stats.totalPayments,
            statsLabel: 'Total Payments'
        },
        {
            title: 'Admission Requests',
            description: 'Review and approve pending admission applications',
            icon: FileText,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            route: '/admin/approve',
            stats: stats.pendingRequests,
            statsLabel: 'Pending Requests'
        },
        {
            title: 'Activities',
            description: 'Manage school activities, events, and announcements',
            icon: School,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
            route: '/admin/activities',
            stats: 0,
            statsLabel: 'Activities'
        },
        {
            title: 'Messages',
            description: 'View and manage contact form messages from visitors',
            icon: Bell,
            color: 'from-indigo-500 to-indigo-600',
            bgColor: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
            route: '/admin/messages',
            stats: stats.unreadMessages,
            statsLabel: 'Unread Messages',
            badge: stats.unreadMessages > 0 ? stats.unreadMessages : null,
            showBadge: true
        }
    ];

    const quickStats = [
        {
            title: 'Total Students',
            value: stats.totalStudents,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            title: 'Pending Requests',
            value: stats.pendingRequests,
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
        },
        {
            title: 'Approved Students',
            value: stats.approvedStudents,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            title: 'Total Revenue',
            value: '₹0',
            icon: DollarSign,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-100'
        }
    ];

    const handleCardClick = (route) => {
        navigate(route);
    };

    const handleViewMessage = async (message) => {
        setSelectedMessage(message);
        setShowMessageModal(true);

        // Mark as read if unread
        if (message.status === 'unread') {
            try {
                await makeAdminRequest('PATCH', `/api/admin/messages/${message._id}/read`);
                // Update local state
                setRecentMessages(prev => prev.map(msg =>
                    msg._id === message._id
                        ? { ...msg, status: 'read', isRead: true, readAt: new Date() }
                        : msg
                ));
                // Update stats
                setStats(prev => ({ ...prev, unreadMessages: Math.max(0, prev.unreadMessages - 1) }));
            } catch (err) {
                console.error('Error marking message as read:', err);
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="admin-page min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="admin-loading text-center">
                    <div className="admin-loading-spinner mx-auto"></div>
                    <p className="admin-loading-text">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-3 sm:p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 sm:mb-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="animate-slide-up">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3">Admin Dashboard</h1>
                            <p className="text-base sm:text-lg md:text-xl text-slate-600">Manage your school administration efficiently</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 animate-slide-up delay-200 w-full sm:w-auto">
                            <button className="btn-secondary flex items-center justify-center gap-2 text-sm sm:text-base">
                                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="hidden sm:inline">Notifications</span>
                            </button>
                            <button className="btn-secondary flex items-center justify-center gap-2 text-sm sm:text-base">
                                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="hidden sm:inline">Settings</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10 animate-slide-up delay-300">
                    {quickStats.map((stat, index) => (
                        <div key={index} className="admin-card card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up delay-400">
                    {dashboardCards.map((card, index) => (
                        <div
                            key={index}
                            onClick={() => handleCardClick(card.route)}
                            className="admin-card card p-8 cursor-pointer group hover:scale-105 transition-all duration-300 ease-out clickable"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-16 h-16 ${card.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative`}>
                                    <card.icon className={`w-8 h-8 ${card.iconColor}`} />
                                    {card.showBadge && card.badge && card.badge > 0 && (
                                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                                            {card.badge > 99 ? '99+' : card.badge}
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-slate-900">{card.stats}</p>
                                    <p className="text-sm text-slate-600">{card.statsLabel}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                    {card.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {card.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-300">
                                    <span>Manage</span>
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                                <div className={`w-8 h-8 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <ArrowRight className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity Section */}
                <div className="mt-12 animate-slide-up delay-500">
                    <div className="card p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Recent Activity</h2>
                            <button className="btn-secondary flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                View All
                            </button>
                        </div>

                        <div className="space-y-4">
                            {stats.pendingRequests > 0 ? (
                                <div className="flex items-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                    <Clock className="w-6 h-6 text-yellow-600 mr-4" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900">{stats.pendingRequests} pending admission requests</p>
                                        <p className="text-sm text-slate-600">Review and approve new applications</p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/admin/approve')}
                                        className="btn-warning text-sm"
                                    >
                                        Review
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-200">
                                    <CheckCircle className="w-6 h-6 text-green-600 mr-4" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900">All caught up!</p>
                                        <p className="text-sm text-slate-600">No pending requests at the moment</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <Users className="w-6 h-6 text-blue-600 mr-4" />
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-900">{stats.totalStudents} total students registered</p>
                                    <p className="text-sm text-slate-600">Manage student information and records</p>
                                </div>
                                <button
                                    onClick={() => navigate('/admin/students')}
                                    className="btn-primary text-sm"
                                >
                                    Manage
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Messages Section */}
                {recentMessages.length > 0 && (
                    <div className="mt-8 animate-slide-up delay-600">
                        <div className="card p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">Recent Messages</h2>
                                <button
                                    onClick={() => navigate('/admin/messages')}
                                    className="btn-secondary flex items-center gap-2"
                                >
                                    <Bell className="w-5 h-5" />
                                    View All Messages
                                </button>
                            </div>

                            <div className="space-y-4">
                                {recentMessages.map((message) => (
                                    <div
                                        key={message._id}
                                        onClick={() => handleViewMessage(message)}
                                        className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                                            <Bell className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900">{message.name}</p>
                                            <p className="text-sm text-slate-600 truncate max-w-md">{message.message}</p>
                                            <p className="text-xs text-slate-500 mt-1">{formatDate(message.createdAt)}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                New
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Message Detail Modal */}
            {showMessageModal && selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900">Message Details</h2>
                                <button
                                    onClick={() => setShowMessageModal(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Message Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                    <p className="text-slate-900 font-medium">{selectedMessage.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <p className="text-slate-900">{selectedMessage.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                    <p className="text-slate-900">{selectedMessage.phone || 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                    <p className="text-slate-900">{formatDate(selectedMessage.createdAt)}</p>
                                </div>
                            </div>

                            {/* Message Content */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <p className="text-slate-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                            <button
                                onClick={() => navigate('/admin/messages')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                View All Messages
                            </button>
                            <button
                                onClick={() => setShowMessageModal(false)}
                                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
