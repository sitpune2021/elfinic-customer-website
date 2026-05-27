import React, { useState } from 'react'
import './TrackOrder.css'

function TrackOrder() {
    const [searchType, setSearchType] = useState('orderID');
    const [searchValue, setSearchValue] = useState('');
    const [trackingData, setTrackingData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchValue.trim()) {
            setError('Please enter a valid tracking number');
            return;
        }

        setIsLoading(true);
        setError('');

        // Simulate API call - replace with actual API endpoint
        setTimeout(() => {
            // Mock tracking data
            const mockData = {
                trackingNumber: searchValue,
                status: 'In Transit',
                estimatedDelivery: '2025-09-28',
                currentLocation: 'Distribution Center, New York',
                trackingHistory: [
                    {
                        date: '2025-09-25',
                        time: '10:30 AM',
                        status: 'Package Picked Up',
                        location: 'Origin Facility',
                        description: 'Your package has been collected and is ready for shipment',
                        isCompleted: true
                    },
                    {
                        date: '2025-09-25',
                        time: '2:45 PM',
                        status: 'In Transit',
                        location: 'Sorting Facility',
                        description: 'Package is being processed at our sorting facility',
                        isCompleted: true
                    },
                    {
                        date: '2025-09-26',
                        time: '8:20 AM',
                        status: 'Arrived at Distribution Center',
                        location: 'Distribution Center, New York',
                        description: 'Package has arrived at the local distribution center',
                        isCompleted: true
                    },
                    {
                        date: '2025-09-27',
                        time: 'Expected',
                        status: 'Out for Delivery',
                        location: 'Local Delivery Hub',
                        description: 'Package will be loaded for final delivery',
                        isCompleted: false
                    }
                ]
            };
            setTrackingData(mockData);
            setIsLoading(false);
        }, 2000);
    };

    const resetSearch = () => {
        setTrackingData(null);
        setSearchValue('');
        setError('');
    };

    return (
        <div className="track-order-container">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10 col-xl-8">
                        {/* Header Section */}
                        <div className="text-center mb-5">
                            <div className="header-icon-container d-inline-block p-4 rounded-circle bg-white mb-4 shadow-lg">
                                <i className="fas fa-shipping-fast text-elifnic" style={{ fontSize: '3rem' }}></i>
                            </div>
                            <h5 className="display-5 fw-bold text-white mb-3">Track Your Package</h5>
                            <p className="lead text-white opacity-75">Real-time tracking for your orders and shipments worldwide</p>
                        </div>

                        {!trackingData ? (
                            /* Search Form */
                            <div className="modern-card mb-5" style={{ borderRadius: '24px' }}>
                                <div className="card-body p-5">
                                    <form onSubmit={handleSearch}>
                                        {/* Modern Checkbox Selection */}
                                        <div className="mb-5">
                                            <h6 className="fw-bold text-elifnic mb-4 text-center">
                                                <i className="fas fa-search me-2"></i>
                                                Choose Your Tracking Method
                                            </h6>
                                            <div className="row g-4">
                                                <div className="col-md-6">
                                                    <div className="custom-checkbox-container">
                                                        <input
                                                            type="radio"
                                                            className="custom-checkbox"
                                                            name="searchType"
                                                            id="orderID"
                                                            value="orderID"
                                                            checked={searchType === 'orderID'}
                                                            onChange={(e) => setSearchType(e.target.value)}
                                                        />
                                                        <label className="checkbox-card" htmlFor="orderID">
                                                            <div className="checkbox-icon">
                                                                <i className="fas fa-receipt"></i>
                                                            </div>
                                                            <div className="checkbox-content">
                                                                <div className="checkbox-title">Order ID</div>
                                                                <div className="checkbox-subtitle">Track using your order number</div>
                                                            </div>
                                                            <div className="checkmark"></div>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="custom-checkbox-container">
                                                        <input
                                                            type="radio"
                                                            className="custom-checkbox"
                                                            name="searchType"
                                                            id="awb"
                                                            value="awb"
                                                            checked={searchType === 'awb'}
                                                            onChange={(e) => setSearchType(e.target.value)}
                                                        />
                                                        <label className="checkbox-card" htmlFor="awb">
                                                            <div className="checkbox-icon">
                                                                <i className="fas fa-barcode"></i>
                                                            </div>
                                                            <div className="checkbox-content">
                                                                <div className="checkbox-title">AWB Number</div>
                                                                <div className="checkbox-subtitle">Track using AWB code</div>
                                                            </div>
                                                            <div className="checkmark"></div>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Modern Search Input */}
                                        <div className="mb-5">
                                            <h5 className="fw-bold text-elifnic mb-3 text-center">
                                                Enter Your {searchType === 'orderID' ? 'Order ID' : 'AWB Number'}
                                            </h5>
                                            <div className="modern-input-container">
                                                <div className="input-icon">
                                                    <i className={`fas ${searchType === 'orderID' ? 'fa-hashtag' : 'fa-qrcode'}`}></i>
                                                </div>
                                                <input
                                                    type="text"
                                                    className={`modern-input ${error ? 'is-invalid' : ''}`}
                                                    placeholder={searchType === 'orderID' ? 'e.g., ORD-2025-123456' : 'e.g., AWB987654321'}
                                                    value={searchValue}
                                                    onChange={(e) => setSearchValue(e.target.value)}
                                                />
                                            </div>
                                            {error && (
                                                <div className="error-message">
                                                    <i className="fas fa-exclamation-triangle"></i>
                                                    {error}
                                                </div>
                                            )}
                                        </div>

                                        {/* Modern Search Button */}
                                        <div className="text-center">
                                            <button
                                                type="submit"
                                                className={`bg-elifnic btn btn-sm ${isLoading ? 'loading-pulse' : ''}`}
                                                disabled={isLoading}

                                            >
                                                {isLoading ? (
                                                    <>
                                                        <div className="spinner-border spinner-border-sm me-3" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                        <span>Tracking Your Package...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-search me-3" ></i>
                                                        <span>Track My Package</span>
                                                    </>
                                                )}
                                            </button>
                                            <div className="mt-3">
                                                <small className="text-muted">
                                                    <i className="fas fa-shield-alt me-2 text-success"></i>
                                                    Secure and reliable tracking service
                                                </small>
                                            </div>
                                        </div>
                                    </form>

                                    {/* Demo Illustration */}
                                    <div className="text-center mt-5 pt-4 border-top">
                                        <div className="row align-items-center">
                                            <div className="col-md-6">
                                                <img
                                                    src="/images/tracking-demo.svg"
                                                    alt="Package Tracking Demo"
                                                    className="img-fluid"
                                                    style={{ maxWidth: '300px' }}
                                                />
                                            </div>
                                            <div className="col-md-6 text-start">
                                                <h6 className="text-elifnic fw-bold mb-3">Real-time Package Tracking</h6>
                                                <ul className="list-unstyled">
                                                    <li className="mb-2">
                                                        <i className="fas fa-check-circle text-success me-2"></i>
                                                        <small>Live location updates</small>
                                                    </li>
                                                    <li className="mb-2">
                                                        <i className="fas fa-check-circle text-success me-2"></i>
                                                        <small>Delivery time estimation</small>
                                                    </li>
                                                    <li className="mb-2">
                                                        <i className="fas fa-check-circle text-success me-2"></i>
                                                        <small>SMS & Email notifications</small>
                                                    </li>
                                                    <li>
                                                        <i className="fas fa-check-circle text-success me-2"></i>
                                                        <small>24/7 customer support</small>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Tracking Results */
                            <div className="row g-4">
                                {/* Status Card */}
                                <div className="col-12">
                                    <div className="card border-0 shadow-lg mb-4" style={{ borderRadius: '20px' }}>
                                        <div className="card-header border-0 d-flex justify-content-between align-items-center p-10"
                                            style={{ borderRadius: '20px 20px 0 0' }}>
                                            <div className='text-black'>
                                                <h6 className=" mb-1 fw-bold">Package Tracking</h6>
                                                <p className=" mb-0">Tracking ID: {trackingData.trackingNumber}</p>
                                            </div>
                                            <button
                                                onClick={resetSearch}
                                                className="btn btn-sm text-black bg-black"
                                                style={{ borderRadius: '10px' }}
                                            >
                                                <i className="fas fa-arrow-left me-2"></i>
                                                New Search
                                            </button>
                                        </div>

                                        {/* Status Overview */}
                                        <div className="card-body p-4">
                                            <div className="row g-4">
                                                <div className="col-md-3">
                                                    <div className="text-center p-4 rounded-3" style={{ background: 'rgba(5, 0, 64, 0.05)' }}>
                                                        <i className="fas fa-shipping-fast text-white mb-2" style={{ fontSize: '2rem' }}></i>
                                                        <h6 className="text-elifnic fw-bold mb-1">Status</h6>
                                                        <p className="btn-elifnic mb-0 fw-semibold">{trackingData.status}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="text-center p-4 rounded-3 " style={{ background: 'rgba(5, 0, 64, 0.05)' }}>
                                                        <i className="fas fa-calendar-alt text-elifnic mb-2" style={{ fontSize: '2rem', }}></i>
                                                        <h6 className="text-elifnic fw-bold mb-1">Est. Delivery</h6>
                                                        <p className="btn-elifnic mb-0 fw-semibold">{trackingData.estimatedDelivery}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="text-center p-4 rounded-3" style={{ background: 'rgba(5, 0, 64, 0.05)' }}>
                                                        <i className="fas fa-map-marker-alt text-elifnic mb-2" style={{ fontSize: '2rem' }}></i>
                                                        <h6 className="text-elifnic fw-bold mb-1">Current Location</h6>
                                                        <p className="btn-elifnic mb-0 fw-semibold">{trackingData.currentLocation}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tracking Timeline */}
                                <div className="col-12">
                                    <div className="card border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                                        <div className="card-body">
                                            <div className="d-flex align-items-center mb-4">
                                                <div className="bg-elifnic p-3 rounded-circle me-3">
                                                    <i className="fas fa-route text-white" style={{ fontSize: '1.2rem' }}></i>
                                                </div>
                                                <div>
                                                    <h6 className="text-elifnic mb-1 fw-bold">Shipment Journey</h6>
                                                    <p className="text-muted mb-0">Track your package's complete journey</p>
                                                </div>
                                            </div>

                                            <div className="position-relative">
                                                {trackingData.trackingHistory.map((item, index) => (
                                                    <div key={index} className="row align-items-center mb-4 position-relative p-4">
                                                        <div className="col-auto">
                                                            <div className="position-relative">
                                                                <div
                                                                    className={`rounded-circle d-flex align-items-center justify-content-center ${item.isCompleted
                                                                        ? 'bg-organge text-white shadow'
                                                                        : 'bg-light border border-2 border-secondary text-secondary'
                                                                        }`}
                                                                    style={{
                                                                        width: '32px',
                                                                        height: '30px',
                                                                        zIndex: 2,
                                                                        position: 'relative'
                                                                    }}
                                                                >
                                                                    <i className={`fas ${item.isCompleted ? 'fa-check' : 'fa-clock'} fw-bold`}></i>
                                                                </div>
                                                                {index < trackingData.trackingHistory.length - 1 && (
                                                                    <div
                                                                        className={`position-absolute ${item.isCompleted ? 'bg-organge' : 'bg-secondary'
                                                                            } opacity-50`}
                                                                        style={{
                                                                            left: '50%',
                                                                            top: '28px',
                                                                            width: '3px',
                                                                            height: '70px',
                                                                            transform: 'translateX(-50%)',
                                                                            zIndex: 1
                                                                        }}
                                                                    ></div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <div className={`p-4 rounded-3 ${item.isCompleted
                                                                ? 'bg-white shadow-sm border border-success border-opacity-25'
                                                                : 'bg-light'
                                                                }`}>
                                                                <div className="row">
                                                                    <div className="col-md-8">
                                                                        <p className={`mb-2 fw-bold ${item.isCompleted ? 'text-elifnic' : 'text-secondary'
                                                                            }`}>
                                                                            {item.status}
                                                                        </p>
                                                                        <small className="text-muted mb-2">
                                                                            <i className="fas fa-map-marker-alt me-2 text-elifnic"></i>
                                                                            {item.location}
                                                                        </small>
                                                                        <small className={`mb-0 small ${item.isCompleted ? 'text-secondary' : 'text-muted'
                                                                            }`}>
                                                                            {item.description}
                                                                        </small>
                                                                    </div>
                                                                    <div className="col-md-4 text-md-end">
                                                                        <div className={`badge px-3 py-2 ${item.isCompleted ? 'bg-success' : 'bg-secondary'
                                                                            }`}>
                                                                            <i className="fas fa-calendar-alt me-2"></i>
                                                                            {item.date}
                                                                        </div>
                                                                        <div className="mt-1">
                                                                            <small className={`fw-semibold ${item.isCompleted ? 'text-elifnic' : 'text-muted'
                                                                                }`}>
                                                                                <i className="fas fa-clock me-1"></i>
                                                                                {item.time}
                                                                            </small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Info Alert */}
                                            <div className="alert border-0 mt-4" style={{
                                                background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                                                borderRadius: '15px'
                                            }}>
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-elifnic p-2 rounded-circle me-3">
                                                        <i className="fas fa-info text-white"></i>
                                                    </div>
                                                    <div>
                                                        <h6 className="text-elifnic mb-1 fw-bold">Tracking Updates</h6>
                                                        <p className="text-muted mb-0 small">
                                                            Tracking information is updated every 2-4 hours. For urgent inquiries,
                                                            please contact our customer support.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TrackOrder