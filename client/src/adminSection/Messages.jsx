import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Trash2, Eye, CheckCircle, Clock, MessageSquare, Filter, Search } from 'lucide-react';
import { useAdminAuthSimple } from '../hooks/useAdminAuthSimple';

const Messages = () => {
    const { makeAdminRequest } = useAdminAuthSimple();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        search: ''
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalMessages: 0
    });

    const fetchMessages = async (page = 1, status = 'all', search = '') => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10'
            });

            if (status !== 'all') {
                params.append('status', status);
            }

            const response = await makeAdminRequest('GET', `/api/admin/messages/all?${params}`);

            if (response.data.success) {
                setMessages(response.data.data.messages);
                setPagination(response.data.data.pagination);
            } else {
                setError('Failed to fetch messages');
            }
        } catch (err) {
            setError('Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages(1, filters.status, filters.search);
    }, [filters]);

    const handleStatusChange = (e) => {
        setFilters(prev => ({ ...prev, status: e.target.value }));
    };

    const handleSearchChange = (e) => {
        setFilters(prev => ({ ...prev, search: e.target.value }));
    };

    const handlePageChange = (page) => {
        fetchMessages(page, filters.status, filters.search);
    };

    const handleViewMessage = async (message) => {
        setSelectedMessage(message);
        setShowModal(true);

        // Mark as read if unread
        if (message.status === 'unread') {
            try {
                await makeAdminRequest('PATCH', `/api/admin/messages/${message._id}/read`);
                // Update local state
                setMessages(prev => prev.map(msg =>
                    msg._id === message._id
                        ? { ...msg, status: 'read', isRead: true, readAt: new Date() }
                        : msg
                ));
            } catch (err) {
                // Silently handle error
            }
        }
    };

    const handleDeleteMessage = async (messageId) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await makeAdminRequest('DELETE', `/api/admin/messages/${messageId}`);
                setMessages(prev => prev.filter(msg => msg._id !== messageId));
                setShowModal(false);
                setSelectedMessage(null);
            } catch (err) {
                alert('Failed to delete message');
            }
        }
    };

    const handleMarkAsReplied = async (messageId) => {
        try {
            await makeAdminRequest('PATCH', `/api/admin/messages/${messageId}/replied`, {
                data: {
                    adminNotes: 'Message marked as replied by admin'
                }
            });
            setMessages(prev => prev.map(msg =>
                msg._id === messageId
                    ? { ...msg, status: 'replied', repliedAt: new Date() }
                    : msg
            ));
            if (selectedMessage && selectedMessage._id === messageId) {
                setSelectedMessage(prev => ({ ...prev, status: 'replied', repliedAt: new Date() }));
            }
        } catch (err) {
            alert('Failed to mark message as replied');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'unread': return 'bg-red-100 text-red-800';
            case 'read': return 'bg-blue-100 text-blue-800';
            case 'replied': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'unread': return <Clock className="w-4 h-4" />;
            case 'read': return <Eye className="w-4 h-4" />;
            case 'replied': return <CheckCircle className="w-4 h-4" />;
            default: return <MessageSquare className="w-4 h-4" />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="admin-page min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="admin-page">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Messages</h1>
                    <p className="text-slate-600">Manage and respond to contact form messages</p>
                </div>

                {/* Filters and Search */}
                <div className="admin-card card p-6 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search messages..."
                                    value={filters.search}
                                    onChange={handleSearchChange}
                                    className="form-input pl-10"
                                />
                            </div>
                        </div>
                        <div className="sm:w-48">
                            <select
                                value={filters.status}
                                onChange={handleStatusChange}
                                className="form-select"
                            >
                                <option value="all">All Messages</option>
                                <option value="unread">Unread</option>
                                <option value="read">Read</option>
                                <option value="replied">Replied</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Messages List */}
                <div className="admin-card card overflow-hidden">
                    {messages.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No messages found</h3>
                            <p className="text-slate-600">No messages match your current filters.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table-modern">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Message</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.map((message) => (
                                        <tr key={message._id} className="admin-table-row">
                                            <td className="font-medium text-slate-900">{message.name}</td>
                                            <td className="text-slate-600">{message.email}</td>
                                            <td className="text-slate-600">{message.phone || 'N/A'}</td>
                                            <td className="text-slate-600 max-w-xs truncate">{message.message}</td>
                                            <td>
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                                                    {getStatusIcon(message.status)}
                                                    {message.status}
                                                </span>
                                            </td>
                                            <td className="text-slate-600">{formatDate(message.createdAt)}</td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleViewMessage(message)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Message"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteMessage(message._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Message"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={!pagination.hasPrevPage}
                                className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            <span className="px-3 py-2 text-sm text-slate-600">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>

                            <button
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={!pagination.hasNextPage}
                                className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Message Detail Modal */}
            {showModal && selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900">Message Details</h2>
                                <button
                                    onClick={() => setShowModal(false)}
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

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMessage.status)}`}>
                                    {getStatusIcon(selectedMessage.status)}
                                    {selectedMessage.status}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                            {selectedMessage.status !== 'replied' && (
                                <button
                                    onClick={() => handleMarkAsReplied(selectedMessage._id)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Mark as Replied
                                </button>
                            )}
                            <button
                                onClick={() => handleDeleteMessage(selectedMessage._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Delete Message
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;
