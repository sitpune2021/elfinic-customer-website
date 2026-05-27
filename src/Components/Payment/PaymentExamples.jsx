/**
 * Simple Payment Examples Component
 * Demonstrating Elfinic Global Payment Integration
 */

import React, { useState } from 'react';
import useElfinicPayment from '../../hooks/useElfinicPayment';
import { PaymentButton, PaymentStatus } from './PaymentComponents';

const PaymentExamples = () => {
    const {
        quickPayment,
        productPurchasePayment,
        vendorRegistrationPayment,
        loading,
        error,
        clearError,
        formatAmount,
        status,
        paymentStates
    } = useElfinicPayment();

    const [customerInfo] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '9876543210'
    });

    const handleQuickPay = async () => {
        try {
            console.log('🚀 Starting quick payment...');
            clearError(); // Clear any previous errors

            const result = await quickPayment(999, 'Quick Payment Test', customerInfo, {
                onSuccess: (result) => {
                    alert(`✅ Payment successful! Payment ID: ${result.paymentId}`);
                    console.log('Payment result:', result);
                },
                onError: (error) => {
                    console.error('Payment error in callback:', error);
                    alert(`❌ Payment failed: ${error.message}`);
                },
                onCancel: () => {
                    alert('⚠️ Payment cancelled by user');
                }
            });

            console.log('✅ Payment completed successfully:', result);
        } catch (error) {
            console.error('❌ Payment error in try-catch:', error);
            alert(`❌ Payment failed: ${error.message}`);
        }
    };

    const handleProductPurchase = async () => {
        const productData = {
            productId: 'prod_123',
            productName: 'Premium Course',
            totalAmount: 2999,
            quantity: 1
        };

        try {
            await productPurchasePayment(productData, customerInfo, {
                onSuccess: (result) => {
                    alert(`✅ Product purchase successful! Payment ID: ${result.paymentId}`);
                },
                onError: (error) => {
                    alert(`❌ Purchase failed: ${error.message}`);
                }
            });
        } catch (error) {
            console.error('Purchase error:', error);
        }
    };

    const handleVendorPayment = async () => {
        const planData = {
            planId: 'premium',
            planName: 'Premium Vendor Plan',
            totalAmount: 4999
        };

        const vendorInfo = {
            fullName: 'John Doe',
            email: 'john@company.com',
            phone: '9876543210',
            companyName: 'My Company Ltd'
        };

        try {
            await vendorRegistrationPayment(planData, vendorInfo, {
                onSuccess: (result) => {
                    alert(`✅ Vendor registration payment successful! Payment ID: ${result.paymentId}`);
                },
                onError: (error) => {
                    alert(`❌ Vendor payment failed: ${error.message}`);
                }
            });
        } catch (error) {
            console.error('Vendor payment error:', error);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ color: '#333', marginBottom: '1rem' }}>🚀 Elfinic Global Payment System</h1>
                <p style={{ color: '#666', fontSize: '1.1rem' }}>
                    Comprehensive payment integration for your entire application
                </p>
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '8px',
                    margin: '1rem 0'
                }}>
                    <strong>✨ Features:</strong> Quick Pay • Product Purchase • Vendor Registration • Subscriptions • Global State Management
                </div>
            </div>

            {/* Payment Status */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: '#333', marginBottom: '1rem' }}>📊 Current Payment Status</h2>
                <PaymentStatus />
                {error && (
                    <div style={{
                        background: '#fee',
                        color: '#c53030',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginTop: '1rem',
                        border: '1px solid #feb2b2'
                    }}>
                        <strong>Error:</strong> {error}
                        <button
                            onClick={clearError}
                            style={{
                                marginLeft: '1rem',
                                padding: '0.5rem 1rem',
                                background: '#c53030',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Clear Error
                        </button>
                    </div>
                )}
            </div>

            {/* Payment Examples Grid */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ color: '#333', marginBottom: '1rem' }}>💳 Payment Examples</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem',
                    marginTop: '1.5rem'
                }}>
                    {/* Quick Payment Card */}
                    <div style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        border: '1px solid #e2e8f0'
                    }}>
                        <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>⚡ Quick Payment</h3>
                        <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
                            Simple one-click payment for instant transactions
                        </p>
                        <PaymentButton
                            amount={999}
                            description="Quick Payment Demo"
                            customerInfo={customerInfo}
                            onSuccess={(result) => alert(`✅ Success! Payment ID: ${result.paymentId}`)}
                            onError={(error) => alert(`❌ Error: ${error.message}`)}
                            variant="primary"
                        >
                            🚀 Pay ₹999 (Component)
                        </PaymentButton>
                        <button
                            onClick={handleQuickPay}
                            disabled={loading}
                            style={{
                                width: '100%',
                                marginTop: '0.5rem',
                                padding: '0.75rem 1rem',
                                background: loading ? '#a0aec0' : '#4299e1',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600'
                            }}
                        >
                            {loading ? '⏳ Processing...' : '💎 Pay ₹999 (Hook)'}
                        </button>
                    </div>

                    {/* Product Purchase Card */}
                    <div style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        border: '1px solid #e2e8f0'
                    }}>
                        <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>🛒 Product Purchase</h3>
                        <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
                            E-commerce product purchase with order tracking
                        </p>
                        <div style={{
                            background: '#f7fafc',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            fontSize: '0.9rem'
                        }}>
                            <strong>Product:</strong> Premium Course<br />
                            <strong>Price:</strong> {formatAmount(2999)}<br />
                            <strong>ID:</strong> prod_123
                        </div>
                        <button
                            onClick={handleProductPurchase}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                background: loading ? '#a0aec0' : '#48bb78',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600'
                            }}
                        >
                            {loading ? '⏳ Processing...' : `🛍️ Buy Course ${formatAmount(2999)}`}
                        </button>
                    </div>

                    {/* Vendor Registration Card */}
                    <div style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        border: '1px solid #e2e8f0'
                    }}>
                        <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>🏢 Vendor Registration</h3>
                        <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
                            Business registration with plan selection
                        </p>
                        <div style={{
                            background: '#f7fafc',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            fontSize: '0.9rem'
                        }}>
                            <strong>Plan:</strong> Premium Vendor<br />
                            <strong>Price:</strong> {formatAmount(4999)}<br />
                            <strong>Company:</strong> My Company Ltd
                        </div>
                        <button
                            onClick={handleVendorPayment}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                background: loading ? '#a0aec0' : '#ed8936',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600'
                            }}
                        >
                            {loading ? '⏳ Processing...' : `🚀 Register ${formatAmount(4999)}`}
                        </button>
                    </div>
                </div>
            </div>

            {/* Code Example */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: '#333', marginBottom: '1rem' }}>👨‍💻 Integration Code</h2>
                <div style={{
                    background: '#1a202c',
                    color: '#e2e8f0',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    overflow: 'auto',
                    fontSize: '0.9rem',
                    lineHeight: '1.6'
                }}>
                    <pre><code>{`// Import the global payment hook
import useElfinicPayment from '../../hooks/useElfinicPayment';

const MyComponent = () => {
  const { quickPayment, loading } = useElfinicPayment();

  const handlePayment = async () => {
    try {
      const result = await quickPayment(
        1000, // Amount in INR
        'Product Purchase', // Description
        { // Customer info
          name: 'John Doe',
          email: 'john@example.com',
          phone: '9876543210'
        },
        { // Callbacks (optional)
          onSuccess: (result) => console.log('Success:', result),
          onError: (error) => console.error('Error:', error),
          onCancel: () => console.log('Cancelled')
        }
      );
      
      // Payment successful
      console.log('Payment ID:', result.paymentId);
      
    } catch (error) {
      // Handle error
      console.error('Payment failed:', error);
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
};`}</code></pre>
                </div>
            </div>

            {/* Features List */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: '#333', marginBottom: '1rem' }}>🎯 Key Features</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1rem'
                }}>
                    {[
                        { icon: '🔒', title: 'Secure Payments', desc: 'PCI compliant with Razorpay' },
                        { icon: '🌐', title: 'Global State', desc: 'Consistent state across app' },
                        { icon: '📱', title: 'Responsive', desc: 'Works on all devices' },
                        { icon: '🎨', title: 'Customizable', desc: 'Flexible UI components' },
                        { icon: '📊', title: 'Payment History', desc: 'Track all transactions' },
                        { icon: '⚡', title: 'Easy Integration', desc: 'Simple hooks and components' }
                    ].map((feature, index) => (
                        <div key={index} style={{
                            background: 'white',
                            padding: '1rem',
                            borderRadius: '8px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                            border: '1px solid #e2e8f0',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{feature.icon}</div>
                            <h4 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>{feature.title}</h4>
                            <p style={{ color: '#718096', fontSize: '0.9rem' }}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Test Information */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '12px',
                textAlign: 'center'
            }}>
                <h2 style={{ marginBottom: '1rem' }}>🧪 Test Payment Details</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                        <h4>💳 Test Card</h4>
                        <p>4111 1111 1111 1111<br />Any future date<br />Any CVV</p>
                    </div>
                    <div>
                        <h4>📱 Test UPI</h4>
                        <p>success@razorpay<br />failure@razorpay</p>
                    </div>
                    <div>
                        <h4>🏛️ Test Banking</h4>
                        <p>Select any bank<br />Use test credentials</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentExamples;