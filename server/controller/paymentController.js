import crypto from 'crypto-js';
import Payment from '../models/payment.js';
import Student from '../models/student.js';
import PendingRequest from '../models/pendingRequest.js';

// PhonePe Configuration
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY;
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || 1;
const PHONEPE_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://api.phonepe.com/apis/hermes'
    : 'https://api-preprod.phonepe.com/apis/hermes';

// Generate SHA256 hash for PhonePe
const generateSHA256 = (payload) => {
    return crypto.SHA256(payload).toString();
};

// Generate X-VERIFY header for PhonePe
const generateXVerify = (payload, saltKey) => {
    const hash = generateSHA256(payload + saltKey);
    return hash + '###' + PHONEPE_SALT_INDEX;
};

// Generate merchant transaction ID
const generateMerchantTransactionId = () => {
    return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Initiate Payment
export const initiatePayment = async (req, res) => {
    try {
        const { formData } = req.body;

        // Check if PhonePe credentials are configured
        if (!PHONEPE_MERCHANT_ID || !PHONEPE_SALT_KEY) {
            return res.status(400).json({
                success: false,
                message: 'PhonePe credentials not configured. Please set PHONEPE_MERCHANT_ID and PHONEPE_SALT_KEY in environment variables.',
                error: 'Missing PhonePe configuration'
            });
        }

        // Validate form data
        if (!formData || !formData.studentName || !formData.email || !formData.phoneNo) {
            return res.status(400).json({
                success: false,
                message: 'Required form data is missing',
                error: 'Missing required fields: studentName, email, phoneNo'
            });
        }

        // Check if student already exists with this email
        const existingStudent = await Student.findOne({ email: formData.email });
        if (existingStudent) {
            return res.status(409).json({
                success: false,
                message: 'A student with this email already exists',
                error: 'Duplicate email address'
            });
        }

        // Generate unique transaction ID
        const merchantTransactionId = generateMerchantTransactionId();

        // Payment amount in paise (₹5.00 = 50000 paise)
        const amount = 50000; // ₹500 in paise

        // Create payment record
        const payment = new Payment({
            amount,
            currency: 'INR',
            transactionId: merchantTransactionId,
            paymentMethod: 'upi', // PhonePe uses UPI
            status: 'pending',
            gateway: 'phonepe',
            gatewayTransactionId: merchantTransactionId,
            gatewayResponse: {},
            description: 'School Admission Fee',
            fees: [{
                type: 'admission',
                amount: amount / 100, // Convert paise to rupees
                description: 'Admission Fee'
            }],
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            formData // Store form data for later use
        });

        await payment.save();

        // Prepare PhonePe payload
        const payload = {
            merchantId: PHONEPE_MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: formData.email,
            amount: amount,
            redirectUrl: `${process.env.CLIENT_URL}/admission-section/payment-callback`,
            redirectMode: 'POST',
            callbackUrl: `${process.env.SERVER_URL}/api/payments/phonepe-callback`,
            mobileNumber: formData.phoneNo,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };

        // Convert payload to base64
        const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');

        // Generate X-VERIFY header
        const xVerify = generateXVerify(payloadBase64, PHONEPE_SALT_KEY);

        // Make request to PhonePe
        const response = await fetch(`${PHONEPE_BASE_URL}/pg/v1/pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': xVerify,
                'accept': 'application/json'
            },
            body: JSON.stringify({
                request: payloadBase64
            })
        });

        const responseData = await response.json();

        if (responseData.success) {
            // Update payment record with PhonePe response
            payment.gatewayResponse = responseData;
            await payment.save();

            return res.status(200).json({
                success: true,
                message: 'Payment initiated successfully',
                data: {
                    paymentId: payment._id,
                    merchantTransactionId: merchantTransactionId,
                    redirectUrl: responseData.data.instrumentResponse.redirectInfo.url
                }
            });
        } else {
            // Update payment status to failed
            payment.status = 'failed';
            payment.gatewayResponse = responseData;
            await payment.save();

            return res.status(400).json({
                success: false,
                message: 'Payment initiation failed',
                error: responseData.message || 'Unknown PhonePe error',
                details: responseData
            });
        }

    } catch (error) {
        console.error('Error in initiatePayment:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Verify Payment Status
export const verifyPayment = async (req, res) => {
    try {
        const { merchantTransactionId } = req.params;

        if (!merchantTransactionId) {
            return res.status(400).json({
                success: false,
                message: 'Merchant transaction ID is required'
            });
        }

        // Find payment record
        const payment = await Payment.findOne({ transactionId: merchantTransactionId });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment record not found'
            });
        }

        // Prepare verification payload
        const payload = {
            merchantId: PHONEPE_MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: payment.formData.email,
            transactionId: payment.transactionId || '',
            amount: payment.amount
        };

        // Convert payload to base64
        const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');

        // Generate X-VERIFY header
        const xVerify = generateXVerify(payloadBase64, PHONEPE_SALT_KEY);

        // Make request to PhonePe for verification
        const response = await fetch(`${PHONEPE_BASE_URL}/pg/v1/status/${PHONEPE_MERCHANT_ID}/${merchantTransactionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': xVerify,
                'X-MERCHANT-ID': PHONEPE_MERCHANT_ID,
                'accept': 'application/json'
            }
        });

        const responseData = await response.json();

        if (responseData.success && responseData.data) {
            const paymentData = responseData.data;

            // Update payment record
            payment.status = paymentData.state === 'COMPLETED' ? 'paid' : 'failed';
            payment.gatewayTransactionId = paymentData.transactionId;
            payment.gatewayResponse = responseData;
            payment.paymentDate = new Date();

            await payment.save();

            // If payment is successful, create pending request for admin approval
            if (payment.status === 'paid') {
                // Parse the student name to get first and last name
                const nameParts = payment.formData.studentName.split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';

                // Create pending request for admin approval
                const pendingRequest = new PendingRequest({
                    firstName,
                    lastName,
                    dateOfBirth: payment.formData.dateOfBirth,
                    age: payment.formData.age,
                    gender: '', // Not provided in payment form
                    email: payment.formData.email,
                    phone: payment.formData.phoneNo,
                    address: {
                        street: payment.formData.address,
                        city: '',
                        state: '',
                        zipCode: '',
                        country: 'India'
                    },
                    applyingForGrade: payment.formData.class,
                    academicYear: new Date().getFullYear().toString(),
                    parentName: payment.formData.fatherName,
                    parentPhone: payment.formData.phoneNo,
                    parentEmail: payment.formData.email,
                    documents: [],
                    specialNeeds: '',
                    medicalConditions: '',
                    emergencyContact: payment.formData.emergencyContact || {},
                    status: 'pending',
                    paymentId: payment._id,
                    paymentStatus: 'COMPLETED',
                    admissionFee: payment.amount / 100 // Convert paise to rupees
                });

                const savedRequest = await pendingRequest.save();

                // Update payment record with pending request ID
                payment.pendingRequestId = savedRequest._id;
                await payment.save();

                return res.status(200).json({
                    success: true,
                    message: 'Payment verified successfully. Your admission request is pending admin approval.',
                    data: {
                        paymentStatus: payment.status,
                        requestId: savedRequest._id,
                        transactionId: payment.gatewayTransactionId
                    }
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Payment failed or pending',
                    data: {
                        paymentStatus: payment.status
                    }
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed',
                error: responseData.message
            });
        }

    } catch (error) {
        console.error('Error in verifyPayment:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// PhonePe Webhook Callback
export const phonepeCallback = async (req, res) => {
    try {
        const { response } = req.body;

        if (!response) {
            return res.status(400).json({
                success: false,
                message: 'Invalid callback data'
            });
        }

        // Decode the response
        const decodedResponse = JSON.parse(Buffer.from(response, 'base64').toString());
        const { merchantTransactionId, transactionId, state } = decodedResponse;

        // Find payment record
        const payment = await Payment.findOne({ transactionId: merchantTransactionId });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment record not found'
            });
        }

        // Update payment status
        payment.status = state === 'COMPLETED' ? 'paid' : 'failed';
        payment.gatewayTransactionId = transactionId;
        payment.gatewayResponse = decodedResponse;
        payment.paymentDate = new Date();

        await payment.save();

        // If payment is successful, create pending request for admin approval
        if (payment.status === 'paid' && !payment.pendingRequestId) {
            // Parse the student name to get first and last name
            const nameParts = payment.formData.studentName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            // Create pending request for admin approval
            const pendingRequest = new PendingRequest({
                firstName,
                lastName,
                dateOfBirth: payment.formData.dateOfBirth,
                age: payment.formData.age,
                gender: '', // Not provided in payment form
                email: payment.formData.email,
                phone: payment.formData.phoneNo,
                address: {
                    street: payment.formData.address,
                    city: '',
                    state: '',
                    zipCode: '',
                    country: 'India'
                },
                applyingForGrade: payment.formData.class,
                academicYear: new Date().getFullYear().toString(),
                parentName: payment.formData.fatherName,
                parentPhone: payment.formData.phoneNo,
                parentEmail: payment.formData.email,
                documents: [],
                specialNeeds: '',
                medicalConditions: '',
                emergencyContact: payment.formData.emergencyContact || {},
                status: 'pending',
                paymentId: payment._id,
                paymentStatus: 'COMPLETED',
                admissionFee: payment.amount / 100 // Convert paise to rupees
            });

            const savedRequest = await pendingRequest.save();

            // Update payment record with pending request ID
            payment.pendingRequestId = savedRequest._id;
            await payment.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Callback processed successfully'
        });

    } catch (error) {
        console.error('Error in phonepeCallback:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get Payment Status
export const getPaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment record not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                paymentId: payment._id,
                transactionId: payment.transactionId,
                status: payment.status,
                amount: payment.amount,
                pendingRequestId: payment.pendingRequestId,
                paymentDate: payment.paymentDate,
                createdAt: payment.createdAt
            }
        });

    } catch (error) {
        console.error('Error in getPaymentStatus:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get All Payments (Admin)
export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('pendingRequestId', 'firstName lastName email phone applyingForGrade status')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });

    } catch (error) {
        console.error('Error in getAllPayments:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
