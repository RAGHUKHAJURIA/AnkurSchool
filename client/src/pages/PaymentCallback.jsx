import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

const PaymentCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        const merchantTransactionId = searchParams.get('merchantTransactionId');
        const paymentStatus = searchParams.get('status');

        if (merchantTransactionId) {
            if (paymentStatus === 'success') {
                setStatus('success');
                setMessage('Payment successful! Your admission application has been submitted.');

                // Redirect to admission page after 3 seconds
                setTimeout(() => {
                    navigate('/admission-section');
                }, 3000);
            } else {
                setStatus('failed');
                setMessage('Payment failed or was cancelled. Please try again.');
            }
        } else {
            setStatus('error');
            setMessage('Invalid payment callback. Please contact support.');
        }
    }, [searchParams, navigate]);

    const handleRetry = () => {
        navigate('/admission-section');
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-900">
            <Navbar />

            <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                        {status === 'verifying' && (
                            <>
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                                </div>
                                <h1 className="text-2xl font-bold text-white mb-4">
                                    Verifying Payment
                                </h1>
                                <p className="text-gray-300 mb-8">
                                    {message}
                                </p>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-white mb-4">
                                    Payment Successful!
                                </h1>
                                <p className="text-gray-300 mb-8">
                                    {message}
                                </p>
                                <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 mb-8">
                                    <p className="text-green-300 text-sm">
                                        You will receive a confirmation email shortly. Our admission team will contact you for further process.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <button
                                        onClick={handleGoHome}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        Go to Home
                                    </button>
                                    <p className="text-gray-400 text-sm">
                                        Redirecting to admission page in 3 seconds...
                                    </p>
                                </div>
                            </>
                        )}

                        {status === 'failed' && (
                            <>
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <XCircle className="w-10 h-10 text-red-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-white mb-4">
                                    Payment Failed
                                </h1>
                                <p className="text-gray-300 mb-8">
                                    {message}
                                </p>
                                <div className="space-y-3">
                                    <button
                                        onClick={handleRetry}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        onClick={handleGoHome}
                                        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        Go to Home
                                    </button>
                                </div>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <XCircle className="w-10 h-10 text-red-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-white mb-4">
                                    Error
                                </h1>
                                <p className="text-gray-300 mb-8">
                                    {message}
                                </p>
                                <div className="space-y-3">
                                    <button
                                        onClick={handleGoHome}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        Go to Home
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCallback;
