import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import './loginStyle.css'
import { loginSuccess } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { API_BASE_URL } = useApi();

    // State for traditional login
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    // State for OTP login
    const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'otp'
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isOtpLoading, setIsOtpLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateEmailForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePhoneForm = () => {
        const newErrors = {};
        if (!phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
            newErrors.phoneNumber = 'Please enter a valid 10-digit mobile number';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateOtpField = () => {
        const newErrors = {};
        if (!otp.trim()) {
            newErrors.otp = 'OTP is required';
        } else if (!/^\d{4,6}$/.test(otp)) {
            newErrors.otp = 'Please enter a valid OTP (4–6 digits)';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Send OTP to phone number
    const handleSendOtp = async (e) => {
        e.preventDefault();

        if (!validatePhoneForm()) return;

        setIsOtpLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/customer/login/send-otp`, {
                mobile: phoneNumber
            });

            console.log('OTP sent successfully:', response.data);
            toast.success('OTP sent to your phone number! 📱');
            setOtpSent(true);
        } catch (error) {
            console.error('Error sending OTP:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsOtpLoading(false);
        }
    };

    // Verify OTP and login
    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        if (!validateOtpField()) return;

        setIsOtpLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/customer/login/verify-otp`, {
                mobile: phoneNumber,
                otp: parseInt(otp)
            });

            console.log('OTP verified successfully:', response.data);

            // Save to Redux + localStorage
            dispatch(loginSuccess({
                token: response.data.token,
                user: response.data.user || { phone: phoneNumber }
            }));

            toast.success('Login Successful 🚀');

            // Reset form
            setPhoneNumber('');
            setOtp('');
            setOtpSent(false);

            navigate('/'); // redirect after login
        } catch (error) {
            console.error('Error verifying OTP:', error.response?.data || error.message);

            if (error.response?.status === 401) {
                toast.error('Invalid OTP ❌');
            } else {
                toast.error(error.response?.data?.message || 'OTP verification failed!');
            }
        } finally {
            setIsOtpLoading(false);
        }
    };

    // Traditional email/password login
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmailForm()) return;
        try {
            console.log('Login form submitted with data:', formData);

            // Call API
            const response = await axios.post(`${API_BASE_URL}/login`, formData);

            console.log('Login successful:', response.data);

            // Save to Redux + localStorage
            dispatch(loginSuccess({
                token: response.data.token,
                user: response.data.user
            }));

            toast.success('Login Successful 🚀');
            setFormData({
                email: '',
                password: '',
            });
            navigate('/'); // redirect after login
        } catch (error) {
            console.error('Error during login:', error.response?.data || error.message);

            if (error.response?.status === 401) {
                toast.error('Invalid email or password ❌');
            } else {
                toast.error('Login Failed! Please try again.');
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleSuccess = (response) => {
        const token = response.credential;

        const userData = jwtDecode(token);
        console.log("✅ Google User:", userData);
        // You can send the token to your backend for further processing
        sendTokenToBackend(token);
    };

    const sendTokenToBackend = (token) => {
        // Send the token to your backend for verification and user creation
        axios.post(`${API_BASE_URL}/auth/google`, { idToken: token })
            .then(response => {
                console.log('Backend response:', response.data);
                // Handle successful response (e.g., save user data, navigate)
                dispatch(loginSuccess({
                    token: response.data.token,
                    user: response.data.user
                }));
                toast.success('Login Successful 🚀');
            })
            .catch(error => {
                console.error('Error sending token to backend:', error);
            });
    }

    const handleError = () => {
        console.log('Google login failed');
    }

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
                        {/* Glass Login Card */}
                        <div className="glass-card bg-white text-black">
                            <div className="card-header text-center d-flex flex-column align-items-center">
                                {/* <div className="logo-container">
                                    <img src="/images/logo/elfinice logo.png" className=' img-thumbnail' width={200} alt="Logo" />
                                </div> */}
                                <h4 className=''>Welcome Back</h4>
                                <p className="login-subtitle text-muted">Sign in to continue</p>

                                {/* Login Method Toggle */}
                                <div className="login-method-toggle my-3">
                                    <button
                                        type="button"
                                        className={`toggle-btn ${loginMethod === 'email' ? 'active' : ''}`}
                                        onClick={() => setLoginMethod('email')}
                                    >
                                        <i className="ph ph-envelope"></i> Email
                                    </button>
                                    <button
                                        type="button"
                                        className={`toggle-btn ${loginMethod === 'otp' ? 'active' : ''}`}
                                        onClick={() => {
                                            setLoginMethod('otp');
                                            setOtpSent(false);
                                            setOtp('');
                                        }}
                                    >
                                        <i className="ph ph-device-mobile"></i> OTP
                                    </button>
                                </div>

                                {/* <h2 className="login-title">Create Account</h2>
                                <p className="login-subtitle"></p> */}
                            </div>

                            {/* Email/Password Login Form */}
                            {loginMethod === 'email' && (
                                <form onSubmit={handleSubmit} className="login-form">
                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">
                                            <i className="ph ph-envelope"></i>
                                            Email Address <span className='text-danger'>*</span>
                                        </label>
                                        <div className="input-wrapper">
                                            <input
                                                type="email"
                                                className={`glass-input ${errors.email ? 'is-invalid' : ''}`}
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                        {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="password" className="form-label">
                                            <i className="ph ph-lock"></i>
                                            Password <span className='text-danger'>*</span>
                                        </label>
                                        <div className="input-wrapper password-wrapper">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className={`glass-input ${errors.password ? 'is-invalid' : ''}`}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Enter your password"
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={togglePasswordVisibility}
                                            >
                                                <i className={`ph ${showPassword ? 'ph-eye-slash' : 'ph-eye'}`}></i>
                                            </button>
                                        </div>
                                        {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                                    </div>

                                    <div className="form-options">
                                        <Link to="/forgot-password" className="forgot-password">
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    <button type="submit" className="glass-btn btn-sm login-btn">
                                        <span className="btn-text">Sign In</span>
                                        <i className="ph ph-arrow-right btn-icon"></i>
                                    </button>

                                    <div className="divider">
                                        <span className='text-white'>or continue with</span>
                                    </div>

                                    <div className="social-login d-flex justify-content-center">
                                        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
                                    </div>

                                    <div className="signup-link">
                                        <p>Don't have an account?
                                            <Link to="/register" className="signup-btn">Create Account</Link>
                                        </p>
                                    </div>
                                </form>
                            )}

                            {/* OTP Login Form */}
                            {loginMethod === 'otp' && (
                                <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="login-form">
                                    <div className="form-group">
                                        <label htmlFor="phoneNumber" className="form-label">
                                            <i className="ph ph-device-mobile"></i>
                                            Phone Number <span className='text-danger'>*</span>
                                        </label>
                                        <div className="input-wrapper">
                                            <input
                                                type="tel"
                                                className={`glass-input ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                value={phoneNumber}
                                                onChange={(e) => {
                                                    setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                                                    if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: '' }));
                                                }}
                                                placeholder="Enter 10-digit phone number"
                                                maxLength="10"
                                                disabled={otpSent}
                                            />
                                        </div>
                                        {errors.phoneNumber && <div className="invalid-feedback d-block">{errors.phoneNumber}</div>}
                                        {otpSent && (
                                            <small className="text-success d-block mt-2">
                                                <i className="ph ph-check-circle"></i> OTP sent successfully
                                            </small>
                                        )}
                                    </div>

                                    {otpSent && (
                                        <div className="form-group">
                                            <label htmlFor="otp" className="form-label">
                                                <i className="ph ph-password"></i>
                                                Enter OTP <span className='text-danger'>*</span>
                                            </label>
                                            <div className="input-wrapper">
                                                <input
                                                    type="text"
                                                    className={`glass-input ${errors.otp ? 'is-invalid' : ''}`}
                                                    id="otp"
                                                    name="otp"
                                                    value={otp}
                                                    onChange={(e) => {
                                                        setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                                                        if (errors.otp) setErrors(prev => ({ ...prev, otp: '' }));
                                                    }}
                                                    placeholder="Enter OTP"
                                                    maxLength="6"
                                                />
                                            </div>
                                            {errors.otp && <div className="invalid-feedback d-block">{errors.otp}</div>}
                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-link p-0 text-decoration-none"
                                                    onClick={() => {
                                                        setOtpSent(false);
                                                        setOtp('');
                                                    }}
                                                >
                                                    <i className="ph ph-arrow-left"></i> Change Number
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-link p-0 text-decoration-none"
                                                    onClick={handleSendOtp}
                                                    disabled={isOtpLoading}
                                                >
                                                    <i className="ph ph-arrow-clockwise"></i> Resend OTP
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="glass-btn btn-sm login-btn"
                                        disabled={isOtpLoading}
                                    >
                                        <span className="btn-text">
                                            {isOtpLoading ? 'Please wait...' : otpSent ? 'Verify OTP' : 'Send OTP'}
                                        </span>
                                        <i className={`ph ${isOtpLoading ? 'ph-spinner' : 'ph-arrow-right'} btn-icon ${isOtpLoading ? 'spin' : ''}`}></i>
                                    </button>

                                    <div className="divider">
                                        <span className='text-white'>or continue with</span>
                                    </div>

                                    <div className="social-login d-flex justify-content-center">
                                        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
                                    </div>

                                    <div className="signup-link">
                                        <p>Don't have an account?
                                            <Link to="/register" className="signup-btn">Create Account</Link>
                                        </p>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login