/**
 * Payment Debug Component
 * Debug payment configuration and environment variables
 */

import React from 'react';
import paymentService from '../../services/paymentService';

const PaymentDebug = () => {
    const config = paymentService.getConfiguration();

    return (
        <div style={{
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            margin: '20px',
            backgroundColor: '#f9f9f9',
            fontFamily: 'monospace'
        }}>
            <h3>🔧 Payment Configuration Debug</h3>

            <div style={{ marginBottom: '15px' }}>
                <h4>Environment Variables:</h4>
                <ul>
                    <li><strong>VITE_RAZORPAY_KEY_ID:</strong> {import.meta.env.VITE_RAZORPAY_KEY_ID || '❌ Not set'}</li>
                    <li><strong>VITE_RAZORPAY_SECRET:</strong> {import.meta.env.VITE_RAZORPAY_SECRET ? '✅ Set' : '❌ Not set'}</li>
                    <li><strong>VITE_APP_NAME:</strong> {import.meta.env.VITE_APP_NAME || '❌ Not set'}</li>
                    <li><strong>VITE_API_BASE_URL:</strong> {import.meta.env.VITE_API_BASE_URL || '❌ Not set'}</li>
                </ul>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <h4>Payment Service Configuration:</h4>
                <ul>
                    <li><strong>Key ID:</strong> {config.keyId ? config.keyId.substring(0, 8) + '***' : '❌ Not configured'}</li>
                    <li><strong>Company Name:</strong> {config.companyInfo.name}</li>
                    <li><strong>Script Loaded:</strong> {config.scriptLoaded ? '✅ Yes' : '❌ No'}</li>
                    <li><strong>Supported Methods:</strong> {config.supportedMethods.join(', ')}</li>
                </ul>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <h4>Browser Environment:</h4>
                <ul>
                    <li><strong>Razorpay Available:</strong> {typeof window.Razorpay !== 'undefined' ? '✅ Yes' : '❌ No'}</li>
                    <li><strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...</li>
                    <li><strong>Current URL:</strong> {window.location.href}</li>
                </ul>
            </div>

            <div style={{
                padding: '10px',
                backgroundColor: config.keyId && config.keyId.startsWith('rzp_') ? '#d4edda' : '#f8d7da',
                border: `1px solid ${config.keyId && config.keyId.startsWith('rzp_') ? '#c3e6cb' : '#f1b0b7'}`,
                borderRadius: '4px'
            }}>
                <strong>Status:</strong> {config.keyId && config.keyId.startsWith('rzp_')
                    ? '✅ Payment configuration looks good!'
                    : '❌ Payment configuration has issues!'}
            </div>

            <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
                <strong>Note:</strong> This debug component should only be used in development.
                Remove or restrict access in production environment.
            </div>
        </div>
    );
};

export default PaymentDebug;