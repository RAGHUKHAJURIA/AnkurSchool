import React from 'react';
import { useAdminAuthSimple } from './useAdminAuthSimple.jsx';

/**
 * Higher-Order Component for Admin Authentication
 * Wraps components that require admin access
 */
export const withAdminAuthSimple = (WrappedComponent) => {
    return function AdminProtectedComponent(props) {
        const { isAdmin, isLoading, error } = useAdminAuthSimple();

        if (isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-900">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-white text-lg">Loading...</p>
                    </div>
                </div>
            );
        }

        if (!isAdmin) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-900">
                    <div className="text-center max-w-md mx-auto p-8">
                        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
                        <p className="text-gray-300 mb-6">
                            {error || 'You do not have admin privileges to access this page.'}
                        </p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
};


