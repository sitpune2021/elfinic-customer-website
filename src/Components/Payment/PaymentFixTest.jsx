/**
 * Payment Fix Test Component
 * Test all payment methods to verify fixes
 */

import React, { useState } from 'react';
import SimplePayment from './SimplePayment';
import useElfinicPayment from '../../hooks/useElfinicPayment';
import paymentService from '../../services/paymentService';

const PaymentFixTest = () => {
    const [activeTest, setActiveTest] = useState('simple');
    const [results, setResults] = useState([]);
    const [customerInfo, setCustomerInfo] = useState({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210'
    });

    const { quickPayment, loading, error, clearError } = useElfinicPayment();

    const addResult = (test, status, message, data = null) => {
        const result = {
            id: Date.now(),
            test,
            status,
            message,
            data,
            timestamp: new Date().toLocaleTimeString()
        };
        setResults(prev => [result, ...prev]);
    };

    const testSimplePayment = () => {
        setActiveTest('simple');
        addResult('Simple Payment', 'info', 'Starting simple payment test...');
    };

    const testAdvancedPayment = async () => {
        try {
            setActiveTest('advanced');
            addResult('Advanced Payment', 'info', 'Starting advanced payment test...');
            clearError();

            await quickPayment(1000, 'Test Advanced Payment', customerInfo, {
                onSuccess: (result) => {
                    addResult('Advanced Payment', 'success', 'Payment successful!', result);
                },
                onError: (error) => {
                    addResult('Advanced Payment', 'error', `Payment failed: ${error.message}`);
                },
                onCancel: () => {
                    addResult('Advanced Payment', 'warning', 'Payment cancelled by user');
                }
            });
        } catch (err) {
            addResult('Advanced Payment', 'error', `Test failed: ${err.message}`);
        }
    };

    const testConfiguration = async () => {
        try {
            addResult('Configuration', 'info', 'Testing payment configuration...');

            const config = paymentService.getConfiguration();
            const envVars = {
                keyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
                appName: import.meta.env.VITE_APP_NAME,
                apiUrl: import.meta.env.VITE_API_BASE_URL
            };

            addResult('Configuration', 'success', 'Configuration loaded', { config, envVars });

            // Test script loading
            const scriptLoaded = await paymentService.loadRazorpayScript();
            addResult('Script Loading', scriptLoaded ? 'success' : 'error',
                scriptLoaded ? 'Razorpay script loaded successfully' : 'Failed to load Razorpay script');

        } catch (err) {
            addResult('Configuration', 'error', `Configuration test failed: ${err.message}`);
        }
    };

    const clearResults = () => {
        setResults([]);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>🔧 Payment Gateway Fix Test</h1>
            <p>Test all payment methods to verify the fixes are working correctly.</p>

            {/* Test Controls */}
            <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px',
                flexWrap: 'wrap'
            }}>
                <button
                    onClick={testSimplePayment}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    🧪 Test Simple Payment
                </button>

                <button
                    onClick={testAdvancedPayment}
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: loading ? '#6c757d' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    🚀 Test Advanced Payment
                </button>

                <button
                    onClick={testConfiguration}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    ⚙️ Test Configuration
                </button>

                <button
                    onClick={clearResults}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    🗑️ Clear Results
                </button>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                {/* Payment Component */}
                <div style={{ flex: '1', minWidth: '400px' }}>
                    <h3>Payment Component</h3>

                    {/* Customer Info Form */}
                    <div style={{
                        background: '#f8f9fa',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px'
                    }}>
                        <h4>Customer Information</h4>
                        <input
                            type="text"
                            placeholder="Name"
                            value={customerInfo.name}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginBottom: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={customerInfo.email}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginBottom: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        />
                        <input
                            type="tel"
                            placeholder="Phone"
                            value={customerInfo.phone}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        />
                    </div>

                    {/* Payment Component */}
                    {activeTest === 'simple' && (
                        <SimplePayment
                            amount={1000}
                            description="Simple Payment Test - ₹1000"
                            customerInfo={customerInfo}
                            onSuccess={(result) => {
                                addResult('Simple Payment', 'success', 'Payment successful!', result);
                            }}
                            onError={(error) => {
                                addResult('Simple Payment', 'error', `Payment failed: ${error.message}`);
                            }}
                            onCancel={() => {
                                addResult('Simple Payment', 'warning', 'Payment cancelled by user');
                            }}
                        />
                    )}

                    {activeTest === 'advanced' && (
                        <div style={{
                            background: '#e9ecef',
                            padding: '20px',
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <h4>Advanced Payment</h4>
                            <p>Click "Test Advanced Payment" button to trigger the advanced payment flow.</p>
                            {loading && <p>⏳ Processing payment...</p>}
                            {error && <p style={{ color: 'red' }}>❌ Error: {error}</p>}
                        </div>
                    )}
                </div>

                {/* Results Panel */}
                <div style={{ flex: '1', minWidth: '400px' }}>
                    <h3>Test Results</h3>
                    <div style={{
                        background: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '8px',
                        height: '600px',
                        overflow: 'auto'
                    }}>
                        {results.length === 0 ? (
                            <div style={{
                                padding: '20px',
                                textAlign: 'center',
                                color: '#6c757d'
                            }}>
                                No test results yet. Run a test to see results here.
                            </div>
                        ) : (
                            results.map(result => (
                                <div key={result.id} style={{
                                    padding: '10px 15px',
                                    borderBottom: '1px solid #dee2e6',
                                    backgroundColor: result.status === 'success' ? '#d4edda' :
                                        result.status === 'error' ? '#f8d7da' :
                                            result.status === 'warning' ? '#fff3cd' : '#d1ecf1'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '5px'
                                    }}>
                                        <strong>[{result.test}]</strong>
                                        <small>{result.timestamp}</small>
                                    </div>
                                    <div>{result.message}</div>
                                    {result.data && (
                                        <details style={{ marginTop: '5px' }}>
                                            <summary style={{ cursor: 'pointer', fontSize: '12px' }}>
                                                View Data
                                            </summary>
                                            <pre style={{
                                                fontSize: '10px',
                                                background: '#ffffff',
                                                padding: '5px',
                                                borderRadius: '3px',
                                                overflow: 'auto',
                                                maxHeight: '100px'
                                            }}>
                                                {JSON.stringify(result.data, null, 2)}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Help Section */}
            <div style={{
                marginTop: '30px',
                background: '#e7f3ff',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #b8daff'
            }}>
                <h4>🆘 Troubleshooting Guide</h4>
                <ul>
                    <li><strong>400 Bad Request:</strong> Usually means invalid Razorpay key or configuration issue</li>
                    <li><strong>Script Loading Failed:</strong> Check internet connection and firewall settings</li>
                    <li><strong>Payment Cancelled:</strong> User closed the payment dialog</li>
                    <li><strong>Configuration Issues:</strong> Check environment variables in the browser console</li>
                </ul>

                <h5>Expected Behavior:</h5>
                <ul>
                    <li>✅ Simple Payment should work without server-side order creation</li>
                    <li>✅ Configuration test should show proper environment loading</li>
                    <li>✅ No 400 Bad Request errors in browser console</li>
                    <li>✅ Razorpay checkout should open smoothly</li>
                </ul>
            </div>
        </div>
    );
};

export default PaymentFixTest;