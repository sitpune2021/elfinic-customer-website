import { useState } from 'react'
import ShopFeature from './ShopFeature'
import { CONTACT_INFO } from '../data/socialMedia';
import SocialMediaExample from './SocialMediaExample';

import { Link } from "react-router-dom";
import Heading from "./Home/Heading";
import SvgIcon from './SvgIcon/SvgIcon';
import { GoVerified } from "react-icons/go";
import useApi from '../hooks/useApi';


function ContactUs() {
    const { API_BASE_URL } = useApi();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
    const [submitMessage, setSubmitMessage] = useState("");
    const [honeypot, setHoneypot] = useState(""); // Spam protection
    const [lastSubmitTime, setLastSubmitTime] = useState(0);

    const sanitizeInputValue = (fieldName, inputValue) => {
        switch (fieldName) {
            case "name":
                return inputValue
                    .replace(/[^A-Za-z\s.'-]/g, "")
                    .replace(/\s{2,}/g, " ")
                    .slice(0, 100);
            case "email":
                return inputValue.replace(/\s/g, "").toLowerCase().slice(0, 254);
            case "phone":
                return inputValue.replace(/\D/g, "").slice(0, 10);
            case "subject":
                return inputValue.replace(/\s{2,}/g, " ").slice(0, 200);
            case "message":
                return inputValue.slice(0, 1000);
            default:
                return inputValue;
        }
    };

    const validateField = (fieldName, rawValue) => {
        const value = rawValue.trim();

        switch (fieldName) {
            case "name": {
                const nameRegex = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
                if (!value) return "Full name is required";
                if (value.length < 2) return "Name must be at least 2 characters";
                if (value.length > 100) return "Name must not exceed 100 characters";
                if (!nameRegex.test(value)) return "Name can only contain letters, spaces, apostrophes and hyphens";
                return "";
            }

            case "email": {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                if (!value) return "Email address is required";
                if (value.length > 254) return "Email address is too long";
                if (!emailRegex.test(value)) return "Please enter a valid email address";
                return "";
            }

            case "phone": {
                const phoneRegex = /^[0-9]{10}$/;
                if (!value) return "Phone number is required";
                if (!phoneRegex.test(value)) return "Please enter a valid 10-digit phone number";
                return "";
            }

            case "subject": {
                if (!value) return "Subject is required";
                if (value.length < 3) return "Subject must be at least 3 characters";
                if (value.length > 200) return "Subject must not exceed 200 characters";
                if (!/[A-Za-z0-9]/.test(value)) return "Subject must contain meaningful text";
                return "";
            }

            case "message": {
                if (!value) return "Message is required";
                if (value.length < 10) return "Message must be at least 10 characters";
                if (value.length > 1000) return "Message must not exceed 1000 characters";
                if (!/[A-Za-z0-9]/.test(value)) return "Message must contain meaningful text";
                return "";
            }

            default:
                return "";
        }
    };

    const validateForm = () => {
        const newErrors = {};

        Object.entries(formData).forEach(([fieldName, fieldValue]) => {
            const fieldError = validateField(fieldName, fieldValue);
            if (fieldError) {
                newErrors[fieldName] = fieldError;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            const sanitizedValues = {
                name: sanitizeInputValue("name", formData.name),
                email: sanitizeInputValue("email", formData.email),
                phone: sanitizeInputValue("phone", formData.phone),
                subject: sanitizeInputValue("subject", formData.subject),
                message: sanitizeInputValue("message", formData.message),
            };
            setFormData(sanitizedValues);
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = sanitizeInputValue(name, value);

        setFormData((prev) => ({
            ...prev,
            [name]: sanitizedValue,
        }));

        const fieldError = validateField(name, sanitizedValue);
        setErrors((prev) => ({
            ...prev,
            [name]: fieldError,
        }));

        // Clear submit status when user modifies form
        if (submitStatus) {
            setSubmitStatus(null);
            setSubmitMessage("");
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const fieldError = validateField(name, value);
        setErrors((prev) => ({
            ...prev,
            [name]: fieldError,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Honeypot check - if filled, it's likely a bot
        if (honeypot) {
            console.warn("Spam detected via honeypot");
            return;
        }

        // Rate limiting - prevent multiple submissions within 5 seconds
        const now = Date.now();
        if (now - lastSubmitTime < 5000) {
            setSubmitStatus("error");
            setSubmitMessage("Please wait a few seconds before submitting again");
            return;
        }

        // Validate form
        if (!validateForm()) {
            setSubmitStatus("error");
            setSubmitMessage("Please fix the errors in the form");
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);
        setSubmitMessage("");

        try {
            const payload = {
                full_name: formData.name.trim().replace(/\s+/g, " "),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                subject: formData.subject.trim().replace(/\s+/g, " "),
                message: formData.message.trim(),
            };

            const response = await fetch(`${API_BASE_URL}/custom-request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                setSubmitStatus("success");
                setSubmitMessage("Thank you for contacting us! We'll get back to you soon.");

                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                });
                setErrors({});
                setLastSubmitTime(now);

                // Auto-hide success message after 5 seconds
                setTimeout(() => {
                    setSubmitStatus(null);
                    setSubmitMessage("");
                }, 5000);
            } else {
                const errorData = await response.json().catch(() => ({}));
                setSubmitStatus("error");
                setSubmitMessage(
                    errorData.message ||
                    `Failed to submit form. Please try again later. (Error: ${response.status})`
                );
            }
        } catch (error) {
            console.error("Contact form submission error:", error);
            setSubmitStatus("error");
            setSubmitMessage(
                "Unable to submit form. Please check your internet connection and try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>

            <section className="contact py-20">
                <Heading
                    title="Contact Us"
                    subtitle="We'd love to hear from you"
                    showViewAll={false}
                    alignment="center"
                />
                {/* <Heading></Heading> */}
                <div className="container container-lg">
                    <div className="row gy-5">
                        <div className="col-lg-8">
                            <div className="contact-box border border-gray-100 rounded-16 px-24 py-40">
                                <form action="#" onSubmit={handleSubmit}>
                                    <h6 className="mb-32">Make Custom Request</h6>

                                    {/* Honeypot field - hidden from users, but bots will fill it */}
                                    <input
                                        type="text"
                                        name="website"
                                        value={honeypot}
                                        onChange={(e) => setHoneypot(e.target.value)}
                                        style={{ display: 'none' }}
                                        tabIndex={-1}
                                        autoComplete="off"
                                    />

                                    {/* Success/Error Message */}
                                    {submitStatus && (
                                        <div className={`mb-24 p-16 rounded-8 ${submitStatus === 'success'
                                            ? 'bg-success-50 border border-success-600'
                                            : 'bg-danger-50 border border-danger-600'
                                            }`}>
                                            <p className={`mb-0 text-sm ${submitStatus === 'success'
                                                ? 'text-success-600'
                                                : 'text-danger-600'
                                                }`}>
                                                {submitMessage}
                                            </p>
                                        </div>
                                    )}

                                    <div className="row gy-4">
                                        <div className="col-sm-6 col-xs-6">
                                            <label htmlFor="name" className="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">Full Name <span className="text-danger text-xl line-height-1">*</span> </label>
                                            <input
                                                type="text"
                                                className={`common-input px-16 ${errors.name ? 'border-danger-600' : ''}`}
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Full name"
                                                disabled={isSubmitting}
                                                maxLength={100}
                                                minLength={2}
                                                pattern="[A-Za-z]+([ '-][A-Za-z]+)*"
                                                autoComplete="name"
                                            />
                                            {errors.name && (
                                                <span className="text-danger-600 text-sm mt-4">{errors.name}</span>
                                            )}
                                        </div>
                                        <div className="col-sm-6 col-xs-6">
                                            <label htmlFor="email" className="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">Email Address <span className="text-danger text-xl line-height-1">*</span> </label>
                                            <input
                                                type="email"
                                                className={`common-input px-16 ${errors.email ? 'border-danger-600' : ''}`}
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Email address"
                                                disabled={isSubmitting}
                                                maxLength={254}
                                                autoComplete="email"
                                            />
                                            {errors.email && (
                                                <span className="text-danger-600 text-sm mt-4">{errors.email}</span>
                                            )}
                                        </div>
                                        <div className="col-sm-6 col-xs-6">
                                            <label htmlFor="phone" className="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">Phone Number<span className="text-danger text-xl line-height-1">*</span> </label>
                                            <input
                                                type="tel"
                                                className={`common-input px-16 ${errors.phone ? 'border-danger-600' : ''}`}
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Phone Number"
                                                disabled={isSubmitting}
                                                maxLength={10}
                                                minLength={10}
                                                inputMode="numeric"
                                                pattern="[0-9]{10}"
                                                autoComplete="tel"
                                            />
                                            {errors.phone && (
                                                <span className="text-danger-600 text-sm mt-4">{errors.phone}</span>
                                            )}
                                        </div>
                                        <div className="col-sm-6 col-xs-6">
                                            <label htmlFor="subject" className="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">Subject <span className="text-danger text-xl line-height-1">*</span> </label>
                                            <input
                                                type="text"
                                                className={`common-input px-16 ${errors.subject ? 'border-danger-600' : ''}`}
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Subject"
                                                disabled={isSubmitting}
                                                minLength={3}
                                                maxLength={200}
                                            />
                                            {errors.subject && (
                                                <span className="text-danger-600 text-sm mt-4">{errors.subject}</span>
                                            )}
                                        </div>
                                        <div className="col-sm-12">
                                            <label htmlFor="message" className="flex-align gap-4 text-sm font-heading-two text-gray-900 fw-semibold mb-4">Message <span className="text-danger text-xl line-height-1">*</span> </label>
                                            <textarea
                                                className={`common-input px-16 ${errors.message ? 'border-danger-600' : ''}`}
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Type your message"
                                                disabled={isSubmitting}
                                                rows="5"
                                                minLength={10}
                                                maxLength={1000}
                                            ></textarea>
                                            {errors.message && (
                                                <span className="text-danger-600 text-sm mt-4">{errors.message}</span>
                                            )}
                                        </div>
                                        <div className="col-sm-12 mt-32">
                                            <button
                                                type="submit"
                                                className="btn btn-main py-18 px-32 rounded-8"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Sending...' : 'Get a Quote'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="contact-box border border-gray-100 rounded-16 px-24 py-40">
                                <h6 className="mb-48">Get In Touch</h6>
                                <div className="flex-align gap-16 mb-16">
                                    <span className="w-40 h-40 flex-center rounded-circle border border-gray-100 text-main-two-600 text-2xl flex-shrink-0">
                                        <SvgIcon name="customer-service" size={24} />
                                    </span>
                                    <a href={`tel:${CONTACT_INFO?.phone}`} className="text-md text-gray-900 hover-text-main-600">{CONTACT_INFO?.phone}</a>
                                </div>
                                <div className="flex-align gap-16 mb-16">
                                    <span className="w-40 h-40 flex-center rounded-circle border border-gray-100 text-main-two-600 text-2xl flex-shrink-0">
                                        <SvgIcon name="envelope" size={24} />
                                    </span>
                                    <a href={`mailto:${CONTACT_INFO?.email}`} className="text-md text-gray-900 hover-text-main-600">{CONTACT_INFO?.email}</a>
                                </div>
                                <div className="flex-align gap-16 mb-0">
                                    <span className="w-40 h-40 flex-center rounded-circle border border-gray-100 text-main-two-600 text-2xl flex-shrink-0">
                                        <SvgIcon name="store-alt" size={24} />
                                    </span>
                                    <span className="text-md text-gray-900 ">{CONTACT_INFO?.address}</span>
                                </div>
                                <div className="flex-align gap-16 mb-0">
                                    <span className="w-40 h-40 flex-center rounded-circle border border-gray-100 text-main-two-600 text-2xl flex-shrink-0">
                                        <GoVerified size={24} color='black' />
                                    </span>
                                    <span className="text-md text-gray-900 "> Elfinic GST no: {CONTACT_INFO?.gstNumber}</span>
                                </div>
                            </div>
                            <div className="mt-24 flex-align flex-wrap gap-16">
                                <a href={`tel:${CONTACT_INFO?.phone}`} className="bg-neutral-600 hover-bg-main-600 rounded-8 p-10 px-16 flex-between flex-wrap gap-8 flex-grow-1">
                                    <span className="text-white fw-medium">Get Support On Call</span>
                                    <span className="w-36 h-36 bg-main-600 rounded-8 flex-center text-xl text-white">
                                        <SvgIcon name="customer-service" size={20} />
                                    </span>
                                </a>
                                <a href="#" className="bg-neutral-600 hover-bg-main-600 rounded-8 p-10 px-16 flex-between flex-wrap gap-8 flex-grow-1">
                                    <span className="text-white fw-medium">Get Direction</span>
                                    <span className="w-36 h-36 bg-main-600 rounded-8 flex-center text-xl text-white">
                                        <SvgIcon name="store-alt" size={20} />
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* shop features */}
            <ShopFeature />

        </>
    )
}

export default ContactUs;
