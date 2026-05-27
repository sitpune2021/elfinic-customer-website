/**
 * Payment Components Library for Elfinic
 * Reusable payment UI components
 */

import React, { useState } from 'react';
import useElfinicPayment from '../../hooks/useElfinicPayment';
import './PaymentComponents.css';

// Basic Payment Button
export const PaymentButton = ({
    amount,
    description,
    customerInfo = {},
    onSuccess,
    onError,
    onCancel,
    className = '',
    children,
    disabled = false,
    variant = 'primary'
}) => {
    const { quickPayment, loading, error, clearError } = useElfinicPayment();

    const handlePayment = async () => {
        try {
            clearError();
            const result = await quickPayment(amount, description, customerInfo, {
                onSuccess,
                onError,
                onCancel
            });
            return result;
        } catch (err) {
            console.error('Payment failed:', err);
        }
    };

    return (
        <button
            className={`payment-btn payment-btn-${variant} ${className} ${loading ? 'loading' : ''}`}
            onClick={handlePayment}
            disabled={disabled || loading}
        >
            {loading ? (
                <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Processing...
                </>
            ) : (
                children || (
                    <>
                        <i className="fas fa-credit-card"></i>
                        Pay ₹{amount.toLocaleString()}
                    </>
                )
            )}
        </button>
    );
};

// Advanced Payment Form
export const PaymentForm = ({
    orderData,
    onSuccess,
    onError,
    onCancel,
    showCustomerForm = true,
    className = ''
}) => {
    const { processPayment, loading, error, clearError, formatAmount } = useElfinicPayment();
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            clearError();
            const paymentData = {
                ...orderData,
                customerName: customerInfo.name,
                customerEmail: customerInfo.email,
                customerPhone: customerInfo.phone
            };

            const result = await processPayment(paymentData, {
                onSuccess,
                onError,
                onCancel
            });
            return result;
        } catch (err) {
            console.error('Payment failed:', err);
        }
    };

    return (
        <div className={`payment-form-container ${className}`}>
            <div className="payment-summary">
                <h3>Payment Summary</h3>
                <div className="payment-details">
                    <div className="payment-item">
                        <span>Description:</span>
                        <span>{orderData.description}</span>
                    </div>
                    <div className="payment-item">
                        <span>Amount:</span>
                        <span className="amount">{formatAmount(orderData.amount)}</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="payment-error">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>{error}</span>
                    <button onClick={clearError} className="close-btn">×</button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="payment-form">
                {showCustomerForm && (
                    <div className="customer-info-section">
                        <h4>Customer Information</h4>
                        <div className="form-group">
                            <label htmlFor="name">Full Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={customerInfo.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={customerInfo.email}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone *</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={customerInfo.phone}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="payment-submit-btn"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <i className="fas fa-spinner fa-spin"></i>
                            Processing Payment...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-lock"></i>
                            Pay Securely {formatAmount(orderData.amount)}
                        </>
                    )}
                </button>
            </form>

            <div className="payment-security">
                <div className="security-badges">
                    <span className="security-badge">
                        <i className="fas fa-shield-alt"></i>
                        Secured by Razorpay
                    </span>
                    <span className="security-badge">
                        <i className="fas fa-lock"></i>
                        256-bit SSL
                    </span>
                </div>
            </div>
        </div>
    );
};

// Payment Status Indicator
export const PaymentStatus = ({ className = '' }) => {
    const { status, paymentData, error, loading, paymentStates } = useElfinicPayment();

    const getStatusIcon = () => {
        switch (status) {
            case paymentStates.SUCCESS:
                return <i className="fas fa-check-circle text-success"></i>;
            case paymentStates.FAILED:
                return <i className="fas fa-times-circle text-error"></i>;
            case paymentStates.CANCELLED:
                return <i className="fas fa-ban text-warning"></i>;
            case paymentStates.LOADING:
            case paymentStates.PROCESSING:
                return <i className="fas fa-spinner fa-spin text-info"></i>;
            default:
                return <i className="fas fa-credit-card text-gray"></i>;
        }
    };

    const getStatusMessage = () => {
        switch (status) {
            case paymentStates.SUCCESS:
                return `Payment successful! ID: ${paymentData?.paymentId}`;
            case paymentStates.FAILED:
                return `Payment failed: ${error}`;
            case paymentStates.CANCELLED:
                return 'Payment was cancelled';
            case paymentStates.LOADING:
                return 'Initializing payment...';
            case paymentStates.PROCESSING:
                return 'Processing payment...';
            default:
                return 'Ready for payment';
        }
    };

    return (
        <div className={`payment-status payment-status-${status} ${className}`}>
            <div className="status-icon">
                {getStatusIcon()}
            </div>
            <div className="status-message">
                {getStatusMessage()}
            </div>
        </div>
    );
};

// Payment History Component
export const PaymentHistory = ({ className = '', limit = 5 }) => {
    const { getPaymentHistory, formatAmount } = useElfinicPayment();
    const history = getPaymentHistory().slice(0, limit);

    if (history.length === 0) {
        return (
            <div className={`payment-history empty ${className}`}>
                <p>No payment history available</p>
            </div>
        );
    }

    return (
        <div className={`payment-history ${className}`}>
            <h4>Payment History</h4>
            <div className="history-list">
                {history.map((payment, index) => (
                    <div key={payment.paymentId || index} className="history-item">
                        <div className="payment-info">
                            <div className="payment-description">
                                {payment.orderDetails?.description || 'Payment'}
                            </div>
                            <div className="payment-id">
                                ID: {payment.paymentId}
                            </div>
                            <div className="payment-date">
                                {new Date(payment.completedAt).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="payment-amount">
                            {formatAmount(payment.amount)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Quick Pay Modal
export const QuickPayModal = ({
    isOpen,
    onClose,
    amount,
    description,
    onSuccess,
    onError
}) => {
    const { quickPayment, loading, error, clearError } = useElfinicPayment();
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePayment = async () => {
        try {
            clearError();
            const result = await quickPayment(amount, description, customerInfo, {
                onSuccess: (result) => {
                    onSuccess?.(result);
                    onClose();
                },
                onError: onError,
                onCancel: onClose
            });
        } catch (err) {
            console.error('Payment failed:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="payment-modal-overlay" onClick={onClose}>
            <div className="payment-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Quick Payment</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="payment-summary">
                        <p>{description}</p>
                        <div className="amount">₹{amount.toLocaleString()}</div>
                    </div>

                    {error && (
                        <div className="payment-error">
                            <i className="fas fa-exclamation-triangle"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="customer-form">
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={customerInfo.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={customerInfo.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={customerInfo.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn-pay"
                        onClick={handlePayment}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Processing...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-credit-card"></i>
                                Pay Now
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default {
    PaymentButton,
    PaymentForm,
    PaymentStatus,
    PaymentHistory,
    QuickPayModal
};