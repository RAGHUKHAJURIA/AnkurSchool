import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Search, Filter, Eye, Edit, Trash2, Plus, Download } from 'lucide-react';
import { useAdminAuthSimple } from '../hooks/useAdminAuthSimple.jsx';
import AddStudent from './AddStudent';
import EditStudent from './EditStudent';
import DeleteConfirmation from './DeleteConfirmation';

const StudentData = () => {
    const { makeAdminRequest } = useAdminAuthSimple();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGrade, setFilterGrade] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddStudent, setShowAddStudent] = useState(false);
    const [showEditStudent, setShowEditStudent] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const classes = [
        'Nursery', 'LKG', 'UKG',
        'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
        'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
        'Class 11', 'Class 12'
    ];

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await makeAdminRequest('GET', '/api/admin/students?status=active');

            if (response.data.success) {
                setStudents(response.data.data);
                setError(null);
            } else {
                setError('Failed to fetch students');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (student) => {
        setSelectedStudent(student);
        setShowModal(true);
    };

    const handleEditStudent = (student) => {
        setSelectedStudent(student);
        setShowEditStudent(true);
    };

    const handleDeleteStudent = (student) => {
        setStudentToDelete(student);
        setShowDeleteConfirmation(true);
    };

    const confirmDeleteStudent = async () => {
        if (!studentToDelete) return;

        try {
            setActionLoading(true);
            setMessage({ type: '', text: '' });

            const response = await makeAdminRequest('DELETE', `/api/admin/students/${studentToDelete._id}`);

            if (response.data.success) {
                setMessage({
                    type: 'success',
                    text: `Student ${studentToDelete.studentId} deleted successfully!`
                });

                // Refresh the student list
                fetchStudents();

                // Close the confirmation dialog
                setShowDeleteConfirmation(false);
                setStudentToDelete(null);

                // Clear message after 3 seconds
                setTimeout(() => {
                    setMessage({ type: '', text: '' });
                }, 3000);
            } else {
                setMessage({ type: 'error', text: response.data.message || 'Failed to delete student' });
            }

        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to delete student. Please try again.'
            });
        } finally {
            setActionLoading(false);
        }
    };

    const cancelDeleteStudent = () => {
        setShowDeleteConfirmation(false);
        setStudentToDelete(null);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedStudent(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Filter students based on search term and grade
    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesGrade = filterGrade === '' || student.currentGrade === filterGrade;

        return matchesSearch && matchesGrade;
    });

    if (loading) {
        return (
            <div className="admin-page min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-600 text-lg font-medium">Loading student data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="animate-slide-up">
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">Student Management</h1>
                            <p className="text-xl text-slate-600">Manage all approved students and their information</p>
                        </div>
                        <div className="flex items-center gap-4 animate-slide-up delay-200">
                            <button className="btn-secondary flex items-center gap-2">
                                <Download className="w-5 h-5" />
                                Export Data
                            </button>
                            <button
                                onClick={() => setShowAddStudent(true)}
                                className="btn-success flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Add Student
                            </button>
                        </div>
                    </div>
                </div>

                {/* Message Display */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                        {message.type === 'success' ? (
                            <div className="w-5 h-5 flex-shrink-0">✅</div>
                        ) : (
                            <div className="w-5 h-5 flex-shrink-0">❌</div>
                        )}
                        <span>{message.text}</span>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                        <p>{error}</p>
                        <button
                            onClick={fetchStudents}
                            className="mt-2 text-red-600 hover:text-red-800 underline"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={filterGrade}
                                onChange={(e) => setFilterGrade(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                            >
                                <option value="">All Grades</option>
                                {classes.map((cls) => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Students List */}
                {filteredStudents.length === 0 ? (
                    <div className="card p-12 text-center animate-fade-in">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <User className="w-10 h-10 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">No Students Found</h3>
                        <p className="text-lg text-slate-600 mb-6">
                            {students.length === 0
                                ? "No students have been approved yet."
                                : "No students match your search criteria."
                            }
                        </p>
                        <button
                            onClick={() => setShowAddStudent(true)}
                            className="btn-primary"
                        >
                            Add First Student
                        </button>
                    </div>
                ) : (
                    <div className="table-modern animate-fade-in">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Student
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Student ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Grade
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Admission Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredStudents.map((student) => (
                                        <tr key={student._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <User className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {student.firstName} {student.lastName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Age: {student.age}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{student.studentId}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{student.currentGrade}</div>
                                                <div className="text-sm text-gray-500">{student.academicYear}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{student.email}</div>
                                                <div className="text-sm text-gray-500">{student.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatDate(student.admissionDate)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${student.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openModal(student)}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditStudent(student)}
                                                        className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                                                        title="Edit Student"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteStudent(student)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                                                        title="Delete Student"
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
                    </div>
                )}

                {/* Student Details Modal */}
                {showModal && selectedStudent && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Student Details
                                    </h2>
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Personal Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Full Name</label>
                                                <p className="text-gray-900">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Student ID</label>
                                                <p className="text-gray-900">{selectedStudent.studentId}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                                                <p className="text-gray-900">{formatDate(selectedStudent.dateOfBirth)}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Age</label>
                                                <p className="text-gray-900">{selectedStudent.age} years</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Gender</label>
                                                <p className="text-gray-900 capitalize">{selectedStudent.gender}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Email</label>
                                                <p className="text-gray-900">{selectedStudent.email}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Phone</label>
                                                <p className="text-gray-900">{selectedStudent.phone}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Address</label>
                                                <p className="text-gray-900">
                                                    {selectedStudent.address.street}, {selectedStudent.address.city},
                                                    {selectedStudent.address.state} {selectedStudent.address.zipCode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Academic Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Current Grade</label>
                                                <p className="text-gray-900">{selectedStudent.currentGrade}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Academic Year</label>
                                                <p className="text-gray-900">{selectedStudent.academicYear}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Admission Date</label>
                                                <p className="text-gray-900">{formatDate(selectedStudent.admissionDate)}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Status</label>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${selectedStudent.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {selectedStudent.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Parent Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Parent Information</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Parent Name</label>
                                                <p className="text-gray-900">{selectedStudent.parentName}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Parent Phone</label>
                                                <p className="text-gray-900">{selectedStudent.parentPhone}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Parent Email</label>
                                                <p className="text-gray-900">{selectedStudent.parentEmail}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 flex gap-4 justify-end">
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Edit Student
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Student Modal */}
            {showAddStudent && (
                <AddStudent
                    onClose={() => setShowAddStudent(false)}
                    onStudentAdded={() => {
                        fetchStudents(); // Refresh the student list
                        setShowAddStudent(false);
                    }}
                />
            )}

            {/* Edit Student Modal */}
            {showEditStudent && selectedStudent && (
                <EditStudent
                    student={selectedStudent}
                    onClose={() => {
                        setShowEditStudent(false);
                        setSelectedStudent(null);
                    }}
                    onStudentUpdated={() => {
                        fetchStudents(); // Refresh the student list
                        setShowEditStudent(false);
                        setSelectedStudent(null);
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && studentToDelete && (
                <DeleteConfirmation
                    student={studentToDelete}
                    onConfirm={confirmDeleteStudent}
                    onCancel={cancelDeleteStudent}
                    loading={actionLoading}
                />
            )}
        </div>
    );
};

export default StudentData;
