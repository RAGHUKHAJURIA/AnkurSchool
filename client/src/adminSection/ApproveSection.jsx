import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Clock, User, Mail, Phone, MapPin, BookOpen, FileText, AlertCircle } from 'lucide-react';
import { useAdminAuthSimple } from '../hooks/useAdminAuthSimple.jsx';

const ApproveSection = () => {
  const { makeAdminRequest } = useAdminAuthSimple();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await makeAdminRequest('GET', '/api/admin/requests?status=pending');

      if (response.data.success) {
        setRequests(response.data.data);
        setError(null);
      } else {
        setError('Failed to fetch pending requests');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch pending requests');
    } finally {
      setLoading(false);
    }
  };

  const testStudentModel = async () => {
    try {
      const response = await makeAdminRequest('GET', '/api/admin/test-student-model');

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Student model test passed!' });
      } else {
        setMessage({ type: 'error', text: 'Student model test failed: ' + response.data.message });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Student model test error: ' + (error.response?.data?.message || error.message)
      });
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setActionLoading(true);
      setMessage({ type: '', text: '' });

      const response = await makeAdminRequest('POST', `/api/admin/approve/${requestId}`, {
        data: {
          adminNotes: 'Request approved by admin',
          reviewedBy: 'admin'
        }
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Request approved successfully!' });
        setShowModal(false);
        setSelectedRequest(null);
        fetchPendingRequests();
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to approve request' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to approve request' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setActionLoading(true);
      setMessage({ type: '', text: '' });

      const response = await makeAdminRequest('POST', `/api/admin/reject/${requestId}`, {
        data: {
          adminNotes: 'Request rejected by admin',
          reviewedBy: 'admin',
          refundAmount: 0,
          refundReason: 'Request rejected'
        }
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Request rejected successfully!' });
        setShowModal(false);
        setSelectedRequest(null);
        fetchPendingRequests();
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to reject request' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to reject request' });
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
    setMessage({ type: '', text: '' });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setMessage({ type: '', text: '' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-page min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="admin-page min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">Admission Requests</h1>
            <p className="text-xl text-slate-600">Review and approve pending admission requests</p>
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
            <p>{error}</p>
            <button
              onClick={fetchPendingRequests}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        )}


        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="card p-12 text-center animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">No Pending Requests</h3>
            <p className="text-lg text-slate-600">There are no pending admission requests at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {requests.map((request) => (
              <div key={request._id} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {request.firstName} {request.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Applied for {request.applyingForGrade} • {formatDate(request.submittedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      Pending
                    </span>
                    <button
                      onClick={() => openModal(request)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{request.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{request.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Age: {request.age}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>{request.previousSchool}</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => openModal(request)}
                    className="btn-secondary flex items-center gap-2 text-sm"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button
                    onClick={() => handleApprove(request._id)}
                    disabled={actionLoading}
                    className="btn-success flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? (
                      <>
                        <div className="spinner w-4 h-4"></div>
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" /> Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleReject(request._id)}
                    disabled={actionLoading}
                    className="btn-danger flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? (
                      <>
                        <div className="spinner w-4 h-4"></div>
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" /> Reject
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveSection;