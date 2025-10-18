import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const PaymentModal = ({ isOpen, onClose, formData, onPaymentSuccess }) => {
    const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, failed
    const [paymentData, setPaymentData] = useState(null);
    const [error, setError] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);

    const admissionFee = 500; // ₹500

    useEffect(() => {
        if (isOpen && formData) {
            initiatePayment();
        }
    }, [isOpen, formData]);

    const initiatePayment = async () => {
        try {
            setPaymentStatus('processing');
            setError(null);

            // Transform form data to match payment controller expectations
            const paymentFormData = {
                studentName: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phoneNo: formData.phone,
                age: formData.age,
                dateOfBirth: formData.dateOfBirth,
                address: `${formData.address.street}, ${formData.address.city}, ${formData.address.state} - ${formData.address.zipCode}`,
                fatherName: formData.parentName,
                motherName: formData.parentName, // Using parent name for both
                class: formData.applyingForGrade,
                previousSchool: '', // Not in current form
                emergencyContact: {
                    name: formData.emergencyContact.name,
                    phone: formData.emergencyContact.phone,
                    relationship: formData.emergencyContact.relationship
                }
            };

            const response = await axios.post(`http://localhost:5000/api/payments/initiate`, {
                formData: paymentFormData
            });

            if (response.data.success) {
                setPaymentData(response.data.data);
                // Redirect to PhonePe payment page
                window.location.href = response.data.data.redirectUrl;
            } else {
                setError(response.data.message || 'Payment initiation failed');
                setPaymentStatus('failed');
            }
        } catch (error) {
            console.error('Payment initiation error:', error);
            setError(error.response?.data?.message || 'Failed to initiate payment');
            setPaymentStatus('failed');
        }
    };

    const verifyPayment = async (merchantTransactionId) => {
        try {
            setIsVerifying(true);
            const response = await axios.get(
                `http://localhost:5000/api/payments/verify/${merchantTransactionId}`
            );

            if (response.data.success && response.data.data.paymentStatus === 'paid') {
                setPaymentStatus('success');
                onPaymentSuccess(response.data.data);
            } else {
                setError('Payment verification failed');
                setPaymentStatus('failed');
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            setError('Payment verification failed');
            setPaymentStatus('failed');
        } finally {
            setIsVerifying(false);
        }
    };

    // Check for payment callback parameters
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const merchantTransactionId = urlParams.get('merchantTransactionId');
        const status = urlParams.get('status');

        if (merchantTransactionId && status === 'success') {
            verifyPayment(merchantTransactionId);
        } else if (merchantTransactionId && status === 'failed') {
            setError('Payment was cancelled or failed');
            setPaymentStatus('failed');
        }
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Payment Gateway</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {paymentStatus === 'idle' && (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Admission Fee Payment
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Complete your admission by paying the admission fee
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Admission Fee</span>
                                    <span className="text-xl font-bold text-gray-900">₹{admissionFee}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {paymentStatus === 'processing' && (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Initiating Payment
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Please wait while we redirect you to PhonePe...
                            </p>
                        </div>
                    )}

                    {paymentStatus === 'success' && (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Payment Successful!
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Your admission application has been submitted successfully.
                            </p>
                            <div className="bg-green-50 rounded-lg p-4 mb-6">
                                <p className="text-green-800 text-sm">
                                    You will receive a confirmation email shortly. Our team will contact you for further process.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    )}

                    {paymentStatus === 'failed' && (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Payment Failed
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {error || 'Something went wrong with your payment.'}
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={initiatePayment}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {isVerifying && (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Verifying Payment
                            </h3>
                            <p className="text-gray-600">
                                Please wait while we verify your payment...
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Smartphone className="w-4 h-4" />
                        <span>Powered by PhonePe</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
