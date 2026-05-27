import React, { useState, useEffect } from "react";
import "./BusinessStyle.css";
import PricePlane from "./PricePlane";
import { Link } from "react-router-dom";
import { MdOutlinePolicy } from "react-icons/md";

function Business() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  const handleScroll = () => {
    const section = document.getElementById("plans");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={`business-page ${isVisible ? "fade-in" : ""}`}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="floating-elements">
            <div className="floating-circle circle-1"></div>
            <div className="floating-circle circle-2"></div>
            <div className="floating-circle circle-3"></div>
          </div>
        </div>
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6 col-md-12">
              <div className="hero-content">
                <h2 className=" text-white">
                  Empowering <span className="text-gradient">Sellers</span>,
                  <br />
                  Enriching <span className="text-gradient">Businesses</span>
                </h2>
                <span className="hero-badge">
                  ✨ Trusted by 10,000+ Sellers
                </span>

                <p className="hero-subtitle">
                  Join thousands of sellers who trust Elfinic to grow their
                  business with our comprehensive e-commerce platform designed
                  for success.
                </p>

                <div className="hero-buttons ">
                  <button
                    className="btn btn-warning-custom"
                    onClick={handleScroll}
                  >
                    <i className="ph ph-rocket-launch"></i>
                    Get Started
                  </button>
                  <button className="btn btn-elfinic-custom ">
                    <i className="ph ph-play-circle"></i>
                    Watch Demo
                  </button>
                </div>
                <div className="hero-stats gap-5">
                  <div className="stat-item">
                    <span className="stat-number">50K+</span>
                    <span className="stat-label text-white">
                      Active Sellers
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">$2M+</span>
                    <span className="stat-label text-white">
                      Revenue Generated
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">99.9%</span>
                    <span className="stat-label text-white">Uptime</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="hero-image-wrapper">
                <div className="hero-image-card">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Business Success"
                    className="hero-image"
                  />
                  <div className="image-overlay"></div>
                </div>
                <div className="floating-card card-1">
                  <i className="ph ph-trending-up"></i>
                  <span>Sales Up 180%</span>
                </div>
                <div className="floating-card card-2">
                  <i className="ph ph-users-three"></i>
                  <span>1M+ Customers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="cta-content">
                  <h2 className="cta-title">
                    Ready to <span className="text-gradient">Grow</span> Your
                    Business?
                  </h2>
                  <p className="cta-subtitle">
                    Join thousands of successful sellers on Elfinic today
                  </p>
                  <button className="btn btn-warning-custom btn-lg">
                    <i className="ph ph-storefront"></i>
                    Start Selling Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <h2 className="">
                Why Choose <span className="text-gradient">Elfinic</span> Plans?
              </h2>
              <p className="section-subtitle">
                Everything you need to succeed in e-commerce, all in one
                platform
              </p>
            </div>
          </div>

          <div className="features-grid mt-30">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="ph ph-shield-check"></i>
              </div>
              <h5 className="feature-title">No Hidden Charges</h5>
              <p className="feature-description">
                Transparent pricing with no surprise fees
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="ph ph-credit-card"></i>
              </div>
              <h5 className="feature-title">Faster Payouts</h5>
              <p className="feature-description">
                Quick and reliable payment processing
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="ph ph-users"></i>
              </div>
              <h5 className="feature-title">Largest Buyer Pool</h5>
              <p className="feature-description">
                Access to millions of potential customers
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="ph ph-globe"></i>
              </div>
              <h5 className="feature-title">Worldwide Reach</h5>
              <p className="feature-description">
                Global marketplace for your products
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="ph ph-headset"></i>
              </div>
              <h5 className="feature-title">24/7 Support</h5>
              <p className="feature-description">
                Dedicated merchant support team
              </p>
            </div>

            <div className="feature-card feature-cta">
              <div className="feature-icon">
                <i className="ph ph-chart-line"></i>
              </div>
              <h5 className="feature-title">Advanced Analytics</h5>
              <p className="feature-description">
                Real-time insights and performance tracking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-overview-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="testimonial-overview-card py-20">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="testimonial-content">
                      <h3 className="">
                        Why Sell on{" "}
                        <span className="text-gradient">Elfinic</span>?
                      </h3>
                      <p className="testimonial-text text-black">
                        Elfinic allows you to create a standalone online store
                        to complement your main business. Get access to a
                        web-optimized shopping platform to reach and convert
                        customers across all devices.
                      </p>
                      <div className="testimonial-stats">
                        <div className="stat shadow-sm text-center p-5 rounded">
                          <span className="stat-number fs-3">98%</span>
                          <small className="stat-label">Success Rate</small>
                        </div>
                        <div className="stat shadow-sm text-center p-5 rounded">
                          <span className="stat-number fs-3">24/7</span>
                          <small className="stat-label">Support</small>
                        </div>
                      </div>
                      <button
                        className="btn btn-warning-custom btn-lg"
                        onClick={handleScroll}
                      >
                        <i className="ph ph-rocket-launch"></i>
                        Start Your Journey
                      </button>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="testimonial-image-wrapper">
                      <img
                        src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Success Story"
                        className="testimonial-image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Quote */}
      {/* <section className="quote-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="quote-card">
                                <div className="quote-icon">
                                    <i className="ph ph-quotes"></i>
                                </div>
                                <blockquote className="quote-text">
                                    "I've been selling online for a few years, so Elfinic's performance shows me it can compete
                                    with my main listing on any other marketplace. The user interface is flawless, the tools
                                    make running my business much easier, and the customer support is fantastic."
                                </blockquote>
                                <div className="quote-author">
                                    <div className="author-avatar">
                                        <img src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Regina Martin" />
                                    </div>
                                    <div className="author-info">
                                        <cite className="author-name">Regina Martin</cite>
                                        <span className="author-title">CEO & Founder</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

      {/* Pricing Section */}
      <PricePlane />

      <section></section>


      {/* Setup Section */}
      <section className="setup-section">
        <div className="container px-10">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <h3 className="">
                <span className="text-gradient">ELFINIC</span> MERCHANT SETUP
              </h3>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="setup-content-card">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="setup-image-wrapper">
                      <img
                        src="/images/logo/elfinice logo.png"
                        alt="Setup Process"
                        className="setup-image p-20"
                        width={350}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="setup-content">
                      <p className="setup-text text-black">
                        Elfinic offers a seamless merchant onboarding service
                        for individuals and businesses wanting to quickly launch
                        comprehensive marketplaces for selling and purchasing
                        goods on a commission basis.
                      </p>

                      <div className="setup-features text-black">
                        <div className="setup-feature">
                          <i className="ph ph-check-circle"></i>
                          <span>
                            User-friendly interface perfect for businesses
                          </span>
                        </div>
                        <div className="setup-feature">
                          <i className="ph ph-check-circle"></i>
                          <span>Robust inventory management system</span>
                        </div>
                        <div className="setup-feature">
                          <i className="ph ph-check-circle"></i>
                          <span>Comprehensive sales analytics dashboard</span>
                        </div>
                        <div className="setup-feature">
                          <i className="ph ph-check-circle"></i>
                          <span>24/7 responsive customer support</span>
                        </div>
                      </div>
                      <button
                        className="btn btn-warning-custom btn-lg"
                        onClick={handleScroll}
                      >
                        <i className="ph ph-rocket-launch"></i>
                        Get Started Today
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Business;
