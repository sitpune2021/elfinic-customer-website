import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import './loginStyle.css';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';

function SignUp() {
    const dispatch = useDispatch();
    const { API_BASE_URL } = useApi();
    const navigate = useNavigate();

    const NAME_REGEX = /^[A-Za-z\s]+$/;
    const MOBILE_REGEX = /^[6-9]\d{9}$/;
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const sanitizeInputValue = (name, value) => {
        if (name === 'name') {
            return value.replace(/[^A-Za-z\s]/g, '').replace(/\s{2,}/g, ' ');
        }

        if (name === 'mobile') {
            return value.replace(/\D/g, '').slice(0, 10);
        }

        if (name === 'email') {
            return value.replace(/\s/g, '');
        }

        return value;
    };

    const getErrorMessage = (field) => {
        const fieldError = errors[field];
        return Array.isArray(fieldError) ? fieldError[0] : fieldError;
    };

    const validateField = (name, value, currentData) => {
        switch (name) {
            case 'name': {
                const trimmedName = value.trim();
                if (!trimmedName) {
                    return 'Name is required';
                }
                if (trimmedName.length < 2) {
                    return 'Name must be at least 2 characters';
                }
                if (!NAME_REGEX.test(trimmedName)) {
                    return 'Enter a valid full name (characters only)';
                }
                return '';
            }

            case 'mobile': {
                if (!value.trim()) {
                    return 'Mobile number is required';
                }
                if (!MOBILE_REGEX.test(value)) {
                    return 'Please enter a valid 10-digit mobile number';
                }
                return '';
            }

            case 'email': {
                if (!value.trim()) {
                    return 'Email is required';
                }
                if (!EMAIL_REGEX.test(value)) {
                    return 'Please enter a valid email address';
                }
                return '';
            }

            case 'password': {
                if (!value) {
                    return 'Password is required';
                }
                if (value.length < 6) {
                    return 'Password must be at least 6 characters';
                }
                if (!/(?=.*[A-Z])/.test(value)) {
                    return 'Password must contain at least one uppercase letter';
                }
                if (!/(?=.*\d)/.test(value)) {
                    return 'Password must contain at least one number';
                }
                return '';
            }

            case 'password_confirmation': {
                if (!value) {
                    return 'Password confirmation is required';
                }
                if (currentData.password !== value) {
                    return 'Passwords do not match';
                }
                return '';
            }

            default:
                return '';
        }
    };

    const normalizeApiErrors = (apiErrors) => {
        const normalizedErrors = {};

        Object.entries(apiErrors).forEach(([field, message]) => {
            normalizedErrors[field] = Array.isArray(message) ? message[0] : message;
        });

        return normalizedErrors;
    };

    const EyeIcon = ({ isVisible }) => (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            {isVisible ? (
                <>
                    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                </>
            ) : (
                <>
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.7a3 3 0 0 0 4.2 4.2" />
                    <path d="M9.9 4.2A11.4 11.4 0 0 1 12 4c6.5 0 10 8 10 8a17.8 17.8 0 0 1-3.3 4.3" />
                    <path d="M6.5 6.5A17.3 17.3 0 0 0 2 12s3.5 8 10 8c1.6 0 3-.3 4.3-.8" />
                </>
            )}
        </svg>
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = sanitizeInputValue(name, value);
        const updatedData = {
            ...formData,
            [name]: sanitizedValue,
        };

        setFormData(updatedData);

        setErrors((prev) => {
            const nextErrors = { ...prev };

            if (sanitizedValue || nextErrors[name]) {
                const fieldError = validateField(name, sanitizedValue, updatedData);
                if (fieldError) {
                    nextErrors[name] = fieldError;
                } else {
                    delete nextErrors[name];
                }
            }

            if (name === 'password' && updatedData.password_confirmation) {
                const confirmError = validateField('password_confirmation', updatedData.password_confirmation, updatedData);
                if (confirmError) {
                    nextErrors.password_confirmation = confirmError;
                } else {
                    delete nextErrors.password_confirmation;
                }
            }

            return nextErrors;
        });
    };

    const handleFieldBlur = (e) => {
        const { name } = e.target;
        const fieldError = validateField(name, formData[name], formData);

        setErrors((prev) => {
            const nextErrors = { ...prev };
            if (fieldError) {
                nextErrors[name] = fieldError;
            } else {
                delete nextErrors[name];
            }
            return nextErrors;
        });
    };

    const validateForm = () => {
        const newErrors = {};

        ['name', 'mobile', 'email', 'password', 'password_confirmation'].forEach((field) => {
            const fieldError = validateField(field, formData[field], formData);
            if (fieldError) {
                newErrors[field] = fieldError;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/register`, formData);

            // If API gives token + user directly
            if (response.data.token && response.data.user) {
                dispatch(loginSuccess({
                    token: response.data.token,
                    user: response.data.user
                }));
                toast.success('Welcome aboard 🚀');
                navigate('/');
            } else {
                // Fallback if API requires manual login
                toast.success('Registration successful! Please log in.');
                navigate('/login');
            }

        } catch (error) {
            console.error('Registration error:', error);

            // Handle different API error response formats
            if (error.response?.data) {
                const errorData = error.response.data;

                // Priority 1: Handle Laravel validation errors format {errors: {...}}
                if (errorData.errors && typeof errorData.errors === 'object') {
                    const normalizedErrors = normalizeApiErrors(errorData.errors);
                    setErrors(normalizedErrors);
                    // Show first error message in toast
                    const firstErrorArray = Object.values(errorData.errors)[0];
                    if (Array.isArray(firstErrorArray) && firstErrorArray.length > 0) {
                        toast.error(firstErrorArray[0]);
                    } else if (typeof firstErrorArray === 'string') {
                        toast.error(firstErrorArray);
                    } else {
                        toast.error('Validation failed. Please check your input.');
                    }
                }
                // Priority 2: Handle {status: "error", message: "..."} format
                else if (errorData.message) {
                    toast.error(errorData.message);
                }
                // Fallback to generic error message
                else {
                    toast.error('An error occurred during registration. Please try again.');
                }
            } else if (error.message) {
                toast.error(error.message);
            } else {
                toast.error('Network error. Please check your connection and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="login-section">
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
                    <div className="col-lg-6 col-md-8 pt-20">
                        <div className="glass-card bg-white">
                            <div className="card-header d-flex flex-column align-items-center mb-4">
                                {/* <div className="logo-container ">
                                    <img src="/images/logo/elfinice logo.png" className=' ' width={130} alt="Logo" />
                                </div> */}
                                <h5 className=''>Create Account</h5>

                                {/* <h2 className="login-title">Create Account</h2>
                                <p className="login-subtitle"></p> */}
                            </div>

                            <form className="login-form" onSubmit={handleSubmit} noValidate>
                                <div className="form-group">
                                    <label htmlFor="name" className='text-black'>Full Name <span className="text-danger">*</span></label>
                                    <div className="input-group">

                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            placeholder="Enter your full name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            onBlur={handleFieldBlur}
                                            autoComplete="name"
                                            style={{ color: 'black' }}
                                        />
                                        {getErrorMessage('name') && <span className="invalid-feedback d-block">{getErrorMessage('name')}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="mobile" className='text-black'>Mobile Number <span className="text-danger">*</span></label>
                                    <div className="input-group">

                                        <input
                                            type="tel"
                                            id="mobile"
                                            name="mobile"
                                            className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                                            placeholder="Enter your mobile number"
                                            value={formData.mobile}
                                            onChange={handleInputChange}
                                            onBlur={handleFieldBlur}
                                            maxLength={10}
                                            inputMode="numeric"
                                            pattern="[0-9]{10}"
                                            autoComplete="tel"
                                            style={{ color: 'black' }}
                                        />
                                        {getErrorMessage('mobile') && <span className="invalid-feedback d-block">{getErrorMessage('mobile')}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" className='text-black'>Email Address <span className="text-danger">*</span></label>
                                    <div className="input-group">

                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            placeholder="Enter your email address"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            onBlur={handleFieldBlur}
                                            autoComplete="email"
                                            style={{ color: 'black' }}
                                        />
                                        {getErrorMessage('email') && <span className="invalid-feedback d-block">{getErrorMessage('email')}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password" className='text-black'>Create Password <span className="text-danger">*</span></label>
                                    <div className="input-group">

                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            className={`form-control password-input ${errors.password ? 'is-invalid' : ''}`}
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            onBlur={handleFieldBlur}
                                            autoComplete="new-password"
                                            style={{ color: 'black' }}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            <EyeIcon isVisible={showPassword} />
                                        </button>
                                        {getErrorMessage('password') && <span className="invalid-feedback d-block">{getErrorMessage('password')}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password_confirmation" className='text-black'>Confirm Password <span className="text-danger">*</span></label>
                                    <div className="input-group">

                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            className={`form-control password-input ${errors.password_confirmation ? 'is-invalid' : ''}`}
                                            placeholder="Confirm your password"
                                            value={formData.password_confirmation}
                                            onChange={handleInputChange}
                                            onBlur={handleFieldBlur}
                                            autoComplete="new-password"
                                            style={{ color: 'black' }}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                        >
                                            <EyeIcon isVisible={showConfirmPassword} />
                                        </button>
                                        {getErrorMessage('password_confirmation') && <span className="invalid-feedback d-block">{getErrorMessage('password_confirmation')}</span>}
                                    </div>
                                </div>



                                <div className=''>
                                    <button
                                        type="submit"
                                        className="btn bg-organge w-100 d-flex justify-content-center align-items-center"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Creating Account...
                                            </>
                                        ) : (
                                            'Create Account'
                                        )}
                                        <i className="ph ph-user-plus ms-5"></i>
                                    </button>

                                </div>
                                <div className="signup-link">
                                    <p className='text-black'>Already have an account?
                                        <Link to="/login" className="signup-btn">Sign In</Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SignUp;