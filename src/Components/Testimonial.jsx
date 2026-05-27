import React from 'react'
import './TestimonialStyles2.css'
import HeadingExamples from './Home/HeadingExamples'

function Testimonial() {


    return (
        <section className="testimonials pt-20 bg-gradient-dark position-relative">
            {/* Background Elements */}
            <div className="testimonial-bg-elements">
                <div className="floating-shape shape-1"></div>
                <div className="floating-shape shape-2"></div>
                <div className="floating-shape shape-3"></div>
                <div className="gradient-overlay"></div>
            </div>

            <div className="container position-relative">
                {/* Section Header */}
                <div className="row justify-content-center mb-80">
                    <div className="col-lg-8 text-center">
                        <div className="section-header-about">
                            <span className="badge-subtitle">About Us</span>
                            <p className="section-description text-white">
                                Discover our journey and commitment to excellence
                            </p>
                            {/* <HeadingExamples></HeadingExamples> */}
                        </div>
                    </div>
                </div>

                {/* Main About Content */}
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        {/* About Elfinic Content */}
                        <div className="about-content">
                            <div className="about-card  mb-20">
                                <h3 className="about-title text-white mb-4">Welcome to Elfinic</h3>
                                <p className="about-text text-white mb-4">
                                    At Elfinic, we are dedicated to providing exceptional products and services that exceed our customers' expectations. Our journey began with a simple vision: to create innovative solutions that make a difference in people's lives.
                                </p>
                                {/* <p className="about-text text-white mb-4">
                                    With years of experience and a commitment to excellence, we have built a reputation for quality, reliability, and customer satisfaction. Our team of passionate professionals works tirelessly to ensure that every interaction with Elfinic is memorable.
                                </p> */}
                                <p className="about-text text-white mb-4">
                                    We believe in building lasting relationships with our customers, partners, and community. Through continuous innovation and unwavering dedication, we strive to be the preferred choice for all your needs.
                                </p>
                                <div className="about-features">
                                    <div className="feature-item">
                                        <i className="ph-fill ph-check-circle text-warning-600"></i>
                                        <span className="text-white">Quality Guaranteed</span>
                                    </div>
                                    {/* <div className="feature-item">
                                        <i className="ph-fill ph-check-circle text-warning-600"></i>
                                        <span className="text-white">Customer Focused</span>
                                    </div> */}
                                    <div className="feature-item">
                                        <i className="ph-fill ph-check-circle text-warning-600"></i>
                                        <span className="text-white">Innovation Driven</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="row g-3">
                            <div className="col-6">
                                <div className="stat-item">
                                    <div className="stat-number text-elifnic">5,000+</div>
                                    <div className="stat-label text-white">Happy Customers</div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="stat-item">
                                    <div className="stat-number text-elifnic">4.9</div>
                                    <div className="stat-label text-white">Average Rating</div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="stat-item">
                                    <div className="stat-number text-elifnic">99%</div>
                                    <div className="stat-label text-white">Satisfaction Rate</div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="stat-item">
                                    <div className="stat-number text-elifnic">24/7</div>
                                    <div className="stat-label text-white">Support Available</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Testimonial