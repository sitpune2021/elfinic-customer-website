/**
 * Simple Payment Test Page
 * Minimal test for payment gateway functionality
 */

import React, { useState } from 'react';
import useElfinicPayment from '../../hooks/useElfinicPayment';

const PaymentTest = () => {
    const { quickPayment, loading, error, clearError } = useElfinicPayment();
    const [testResult, setTestResult] = useState('');

    const testPayment = async () => {
        try {
            clearError();
            setTestResult('🚀 Starting payment test...');

            console.log('🔍 Testing payment gateway...');

            const result = await quickPayment(100, 'Test Payment', {
                name: 'Test User',
                email: 'test@example.com',
                phone: '9876543210'
            });

            console.log('✅ Payment test successful:', result);
            setTestResult('✅ Payment Gateway Working! Check console for details.');

        } catch (error) {
            console.error('❌ Payment test failed:', error);
            setTestResult(`❌ Payment failed: ${error.message}`);
        }
    };

    return (
        <div style={{
            padding: '40px',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <h1>🔧 Payment Gateway Test</h1>
            <p>This is a simple test to verify the Razorpay integration is working.</p>

            <div style={{
                padding: '20px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                margin: '20px 0'
            }}>
                <h3>Test Payment (₹1.00)</h3>
                <p>Click the button below to test the payment gateway:</p>

                <button
                    onClick={testPayment}
                    disabled={loading}
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        backgroundColor: loading ? '#ccc' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        margin: '10px 0'
                    }}
                >
                    {loading ? '🔄 Processing...' : '💳 Test Payment'}
                </button>
            </div>

            {testResult && (
                <div style={{
                    padding: '15px',
                    backgroundColor: testResult.includes('✅') ? '#d4edda' : '#f8d7da',
                    color: testResult.includes('✅') ? '#155724' : '#721c24',
                    border: `1px solid ${testResult.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
                    borderRadius: '4px',
                    margin: '10px 0'
                }}>
                    <strong>Result:</strong> {testResult}
                </div>
            )}

            {error && (
                <div style={{
                    padding: '15px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    border: '1px solid #f5c6cb',
                    borderRadius: '4px',
                    margin: '10px 0'
                }}>
                    <strong>Error:</strong> {error.message}
                </div>
            )}

            <div style={{
                marginTop: '30px',
                padding: '15px',
                backgroundColor: '#e9ecef',
                borderRadius: '4px'
            }}>
                <h4>📋 Debug Info:</h4>
                <ul>
                    <li><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</li>
                    <li><strong>Error:</strong> {error ? error.message : 'None'}</li>
                    <li><strong>Razorpay Key:</strong> {import.meta.env.VITE_RAZORPAY_KEY_ID || 'Not configured'}</li>
                </ul>
            </div>
        </div>
    );
};

export default PaymentTest;