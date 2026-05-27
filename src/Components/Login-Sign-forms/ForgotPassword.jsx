import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { toast } from 'react-toastify';
import './loginStyle.css';

function ForgotPassword() {
    const navigate = useNavigate();
    const { API_BASE_URL } = useApi();

    const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Send OTP to phone number
    const handleSendOtp = async (e) => {
        e.preventDefault();

        if (!phoneNumber || phoneNumber.length !== 10) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/forgot-password/send-otp`, {
                mobile: phoneNumber
            });

            console.log('OTP sent successfully:', response.data);
            toast.success('OTP sent to your phone number! 📱');
            setStep(2); // Move to reset password step
        } catch (error) {
            console.error('Error sending OTP:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Reset password with OTP
    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Validation
        if (!otp || otp.length < 3) {
            toast.error('Please enter a valid OTP');
            return;
        }

        if (!password || password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/forgot-password/reset`, {
                mobile: phoneNumber,
                otp: otp,
                password: password
            });

            console.log('Password reset successful:', response.data);
            toast.success('Password reset successful! 🎉');

            // Reset form and redirect to login
            setPhoneNumber('');
            setOtp('');
            setPassword('');
            setConfirmPassword('');
            setStep(1);

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('Error resetting password:', error.response?.data || error.message);

            if (error.response?.status === 401 || error.response?.status === 400) {
                toast.error('Invalid OTP or request. Please try again ❌');
            } else {
                toast.error(error.response?.data?.message || 'Password reset failed!');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <section className="login-section">
            {/* Background with overlay */}
            <div className="login-background">
                <div className="background-overlay"></div>
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                </div>
            </div>

            <div className="container">
                <div className="row justify-content-center align-items-center py-5">
                    <div className="col-lg-5 col-md-7 pt-20">
                        {/* Glass Card */}
                        <div className="glass-card bg-white text-black">
                            <div className="card-header text-center d-flex flex-column align-items-center">
                                <h4 className=''>Forgot Password</h4>
                                <p className="login-subtitle text-muted">
                                    {step === 1
                                        ? 'Enter your phone number to receive OTP'
                                        : 'Enter OTP and set new password'}
                                </p>

                                {/* Step Indicator */}
                                <div className="step-indicator my-3">
                                    <div className={`step ${step === 1 ? 'active' : 'completed'}`}>
                                        <div className="step-circle">
                                            {step === 1 ? '1' : <i className="ph ph-check"></i>}
                                        </div>
                                        <span className="step-label">Send OTP</span>
                                    </div>
                                    <div className="step-line"></div>
                                    <div className={`step ${step === 2 ? 'active' : ''}`}>
                                        <div className="step-circle">2</div>
                                        <span className="step-label">Reset Password</span>
                                    </div>
                                </div>
                            </div>

                            {/* Step 1: Send OTP Form */}
                            {step === 1 && (
                                <form onSubmit={handleSendOtp} className="login-form">
                                    <div className="form-group">
                                        <label htmlFor="phoneNumber" className="form-label">
                                            <i className="ph ph-device-mobile"></i>
                                            Phone Number <span className='text-danger'>*</span>
                                        </label>
                                        <div className="input-wrapper">
                                            <input
                                                type="tel"
                                                className="glass-input"
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                placeholder="Enter 10-digit phone number"
                                                maxLength="10"
                                                required
                                            />
                                        </div>
                                        <small className="text-muted d-block mt-2">
                                            <i className="ph ph-info"></i> We'll send an OTP to this number
                                        </small>
                                    </div>

                                    <button
                                        type="submit"
                                        className="glass-btn btn-sm login-btn"
                                        disabled={isLoading}
                                    >
                                        <span className="btn-text">
                                            {isLoading ? 'Sending OTP...' : 'Send OTP'}
                                        </span>
                                        <i className={`ph ${isLoading ? 'ph-spinner' : 'ph-paper-plane-tilt'} btn-icon ${isLoading ? 'spin' : ''}`}></i>
                                    </button>

                                    <div className="signup-link mt-4">
                                        <p>Remember your password?
                                            <Link to="/login" className="signup-btn">Back to Login</Link>
                                        </p>
                                    </div>
                                </form>
                            )}

                            {/* Step 2: Reset Password Form */}
                            {step === 2 && (
                                <form onSubmit={handleResetPassword} className="login-form">
                                    <div className="form-group">
                                        <label htmlFor="phoneNumber" className="form-label">
                                            <i className="ph ph-device-mobile"></i>
                                            Phone Number
                                        </label>
                                        <div className="input-wrapper">
                                            <input
                                                type="tel"
                                                className="glass-input"
                                                id="phoneNumber"
                                                value={phoneNumber}
                                                disabled
                                                style={{ backgroundColor: 'rgba(200, 200, 200, 0.3)' }}
                                            />
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                            <small className="text-success">
                                                <i className="ph ph-check-circle"></i> OTP sent successfully
                                            </small>
                                            <button
                                                type="button"
                                                className="btn btn-link p-0 text-decoration-none"
                                                onClick={() => {
                                                    setStep(1);
                                                    setOtp('');
                                                    setPassword('');
                                                    setConfirmPassword('');
                                                }}
                                            >
                                                <i className="ph ph-arrow-left"></i> Change Number
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="otp" className="form-label">
                                            <i className="ph ph-password"></i>
                                            Enter OTP <span className='text-danger'>*</span>
                                        </label>
                                        <div className="input-wrapper">
                                            <input
                                                type="text"
                                                className="glass-input"
                                                id="otp"
                                                name="otp"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                placeholder="Enter 6-digit OTP"
                                                maxLength="6"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-link p-0 text-decoration-none mt-2"
                                            onClick={handleSendOtp}
                                            disabled={isLoading}
                                        >
                                            <i className="ph ph-arrow-clockwise"></i> Resend OTP
                                        </button>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="password" className="form-label">
                                            <i className="ph ph-lock"></i>
                                            New Password <span className='text-danger'>*</span>
                                        </label>
                                        <div className="input-wrapper password-wrapper">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="glass-input"
                                                id="password"
                                                name="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter new password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={togglePasswordVisibility}
                                            >
                                                <i className={`ph ${showPassword ? 'ph-eye-slash' : 'ph-eye'}`}></i>
                                            </button>
                                        </div>
                                        <small className="text-muted d-block mt-1">
                                            Must be at least 6 characters
                                        </small>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="confirmPassword" className="form-label">
                                            <i className="ph ph-lock"></i>
                                            Confirm Password <span className='text-danger'>*</span>
                                        </label>
                                        <div className="input-wrapper password-wrapper">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className="glass-input"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirm new password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={toggleConfirmPasswordVisibility}
                                            >
                                                <i className={`ph ${showConfirmPassword ? 'ph-eye-slash' : 'ph-eye'}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="glass-btn btn-sm login-btn"
                                        disabled={isLoading}
                                    >
                                        <span className="btn-text">
                                            {isLoading ? 'Resetting Password...' : 'Reset Password'}
                                        </span>
                                        <i className={`ph ${isLoading ? 'ph-spinner' : 'ph-check-circle'} btn-icon ${isLoading ? 'spin' : ''}`}></i>
                                    </button>

                                    <div className="signup-link mt-4">
                                        <p>Remember your password?
                                            <Link to="/login" className="signup-btn">Back to Login</Link>
                                        </p>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ForgotPassword;
