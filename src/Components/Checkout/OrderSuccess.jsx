import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import './OrderSuccess.css';

function OrderSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector(selectUser);

    // Get order details from navigation state
    const orderData = location.state?.orderData;

    useEffect(() => {
        // If no order data, redirect to home
        if (!orderData) {
            navigate('/');
        }
    }, [orderData, navigate]);

    if (!orderData) {
        return null;
    }

    const {
        orderId,
        orderNumber,
        paymentMethod,
        items,
        address,
        subtotal,
        tax,
        shipping,
        total,
        orderDate
    } = orderData;

    const handlePrintInvoice = () => {
        window.print();
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="order-success-wrapper">
            <section className="order-success-section py-80">
                <div className="container container-lg">
                    {/* Success Message */}
                    <div className="success-header text-center mb-48">
                        <div className="success-icon mb-24">
                            <i className="ph-fill ph-check-circle"></i>
                        </div>
                        <h2 className="mb-16">Thank You for Your Order! 🎉</h2>
                        <p className="text-gray-600 mb-24">
                            Your order has been successfully placed and is being processed.
                        </p>
                       
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons text-center mt-48">
                        <button
                            className="btn btn-main me-16"
                            onClick={() => navigate('/profile/orders')}
                        >
                            <i className="ph ph-list me-2"></i>
                            View My Orders
                        </button>
                        <button
                            className="btn btn-outline-main"
                            onClick={() => navigate('/shop')}
                        >
                            <i className="ph ph-shopping-bag me-2"></i>
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default OrderSuccess;
