/**
 * Simple Payment Component
 * Fallback for when advanced payment integration fails
 */

import React, { useState } from 'react';
import './PaymentComponents.css';

const SimplePayment = ({
    amount,
    description,
    onSuccess,
    onError,
    onCancel,
    customerInfo = {}
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleSimplePayment = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔄 Starting simple payment process...');

            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error('Payment gateway failed to load');
            }

            // Wait for Razorpay to be available
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (typeof window.Razorpay === 'undefined') {
                throw new Error('Razorpay not available');
            }

            // Simple Razorpay options without order_id
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
                amount: Math.round(amount * 100), // Convert to paisa
                currency: 'INR',
                name: 'Elfinic',
                description: description || 'Payment',
                image: '/images/logo/logo.png',
                handler: function (response) {
                    console.log('✅ Payment successful:', response);
                    setLoading(false);
                    if (onSuccess) {
                        onSuccess({
                            success: true,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            ...response
                        });
                    }
                },
                prefill: {
                    name: customerInfo.name || '',
                    email: customerInfo.email || '',
                    contact: customerInfo.phone || ''
                },
                theme: {
                    color: '#3399cc'
                },
                modal: {
                    ondismiss: function () {
                        console.log('❌ Payment cancelled');
                        setLoading(false);
                        if (onCancel) onCancel();
                    }
                }
            };

            console.log('🔓 Opening simple Razorpay checkout...');
            const paymentObject = new window.Razorpay(options);

            paymentObject.on('payment.failed', function (response) {
                console.error('❌ Payment failed:', response.error);
                setLoading(false);
                setError(response.error.description || 'Payment failed');
                if (onError) {
                    onError(new Error(response.error.description || 'Payment failed'));
                }
            });

            paymentObject.open();

        } catch (err) {
            console.error('❌ Simple payment error:', err);
            setLoading(false);
            setError(err.message);
            if (onError) onError(err);
        }
    };

    return (
        <div className="simple-payment">
            {error && (
                <div className="payment-error" style={{
                    background: '#f8d7da',
                    color: '#721c24',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '15px'
                }}>
                    <strong>Error:</strong> {error}
                    <button
                        onClick={() => setError(null)}
                        style={{
                            float: 'right',
                            background: 'none',
                            border: 'none',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="payment-summary" style={{
                background: '#f8f9fa',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '15px'
            }}>
                <h4>Payment Details</h4>
                <p><strong>Description:</strong> {description}</p>
                <p><strong>Amount:</strong> ₹{amount.toLocaleString()}</p>
            </div>

            <button
                onClick={handleSimplePayment}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '12px 20px',
                    backgroundColor: loading ? '#6c757d' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}
            >
                {loading ? (
                    <>
                        <span style={{
                            animation: 'spin 1s linear infinite',
                            display: 'inline-block'
                        }}>⏳</span>
                        Processing...
                    </>
                ) : (
                    <>
                        💳 Pay ₹{amount.toLocaleString()}
                    </>
                )}
            </button>

            <div style={{
                marginTop: '15px',
                fontSize: '12px',
                color: '#6c757d',
                textAlign: 'center'
            }}>
                <p>🔒 Secured by Razorpay • Test Mode</p>
                <p>This is a fallback payment method</p>
            </div>

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default SimplePayment;