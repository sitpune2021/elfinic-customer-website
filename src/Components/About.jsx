import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css'; // We'll create this CSS file separately

const About = () => {
    const observerRef = useRef(null);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach((el) => observerRef.current.observe(el));

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);


    return (
        <div className="about-us">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background"></div>
                <div className="container">
                    <div className="hero-content animate-on-scroll">
                        <div className="hero-badge">EST. 2025</div>
                        <h2 className="hero-title text-white">
                            About <span className="gradient-text">Elfinic</span>
                        </h2>
                        <p className="hero-subtitle">
                            Where Creativity Meets Commerce
                        </p>
                        <div className="hero-stats text-white">
                            <div className="stat-item">
                                <span className="stat-number">2</span>
                                <span className="stat-label text-white">Countries</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">3+</span>
                                <span className="stat-label text-white">Years</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">∞</span>
                                <span className="stat-label text-white">Possibilities</span>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

            {/* Who We Are Section */}
            <section className="section who-we-are">
                <div className="container">
                    <div className="section-headerasdf animate-on-scroll">
                        <span className="section-badgge">Our Story</span>
                        <div>
                        <h3 className="text-black">Who We Are</h3>
                        <p className="section-subtitle">
                            A global creative powerhouse with roots in India and wings across the world
                        </p>
                        </div>
                    </div>
                    <div className="section-content">
                        <div className="company-showcase">
                            <div className="company-grid">
                                <div className="company-card animate-on-scroll" data-delay="100">
                                    <div className="card-icon">🇮🇳</div>
                                    <div className="card-content">
                                        <h3 className="card-title">Elfinic Commerce Pvt. Ltd.</h3>
                                        <p className="card-location">Mumbai, India</p>
                                        <p className="card-year">Established 2025</p>
                                        <div className="card-description">
                                            Our creative headquarters where innovation meets tradition
                                        </div>
                                    </div>
                                </div>
                                <div className="company-card animate-on-scroll" data-delay="200">
                                    <div className="card-icon">🇺🇸</div>
                                    <div className="card-content">
                                        <h3 className="card-title">Elfinic Commerce LLC</h3>
                                        <p className="card-location">United States</p>
                                        <p className="card-year">Established 2025</p>
                                        <div className="card-description">
                                            Expanding horizons and connecting global markets
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="company-description animate-on-scroll" data-delay="300">
                                <p>
                                    Headquartered in Mumbai, India, with a strong international presence in the United States,
                                    Elfinic blends creativity, culture, and commerce to deliver world-class experiences in music,
                                    design, and lifestyle innovation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="section mission-vision">
                <div className="container">
                    <div className="mv-grid">
                        <div className="mv-item animate-on-scroll " data-delay="100">
                            <div className="mv-card value-item">
                                <div className="mv-icon-wrapper">
                                    <div className="mv-icon"> <i className="ph ph-target"></i> </div>
                                </div>
                                <h3 className="mv-title">Our Mission</h3>
                                <p className="mv-text">
                                    To inspire and empower through creativity — merging art, innovation, and commerce to create
                                    meaningful music, iconic brands, and lifestyle products that connect with people everywhere.
                                </p>
                            </div>
                        </div>
                        <div className="mv-item animate-on-scroll" data-delay="200">
                            <div className="mv-card value-item">
                                <div className="mv-icon-wrapper">
                                    <div className="mv-icon"> <i className="ph ph-eye"></i> </div>
                                </div>
                                <h3 className="mv-title">Our Vision</h3>
                                <p className="mv-text">
                                    To be a global leader in music, media, and modern commerce — where ideas are transformed
                                    into experiences that redefine entertainment and lifestyle.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Journey Section */}
            <section className="section journey" id='journey'>
                <div className="container">
                    <div className="section-headerasdf animate-on-scroll">
                        <span className="section-badge">Timeline</span>
                        <h3 className="text-black">Our Journey</h3>
                        <p className="section-subtitle">
                            From a vision in India to a global reality
                        </p>
                    </div>
                    <div className="journey-content">
                        <div className="timeline">
                            <div className="timeline-item animate-on-scroll" data-delay="100">
                                <div className="timeline-marker">
                                    <div className="timeline-dot"></div>
                                </div>
                                <div className="timeline-card">
                                    <div className="timeline-year">2022</div>
                                    <div className="timeline-content">
                                        <h4>Foundation in India</h4>
                                        <p>
                                            Founded in India with a vision to unite artistic creativity and commercial excellence.
                                            Our journey began with a dream to transform how creativity meets commerce.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="timeline-item animate-on-scroll" data-delay="200">
                                <div className="timeline-marker">
                                    <div className="timeline-dot"></div>
                                </div>
                                <div className="timeline-card">
                                    <div className="timeline-year">2025</div>
                                    <div className="timeline-content">
                                        <h4>International Expansion</h4>
                                        <p>
                                            Registration of Elfinic Commerce LLC in the USA, marking our expansion into international markets
                                            and establishing our global footprint.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="timeline-item animate-on-scroll" data-delay="300">
                                <div className="timeline-marker">
                                    <div className="timeline-dot active"></div>
                                </div>
                                <div className="timeline-card">
                                    <div className="timeline-year">Today</div>
                                    <div className="timeline-content">
                                        <h4>Global Presence</h4>
                                        <p>
                                            Elfinic stands as a cross-border creative powerhouse, connecting cultures and delivering
                                            impactful work across continents while staying true to our roots.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="section values">
                <div className="container">
                    <div className="section-headerasdf animate-on-scroll">
                        <span className="section-badge">Core Values</span>
                        <h3 className="text-black">What Drives Us</h3>
                    </div>
                    <div className="values-grid">
                        <div className="value-item animate-on-scroll" data-delay="100">
                            <div className="value-icon"><i className="ph ph-lightbulb"></i></div>
                            <h3 className="value-title">Creativity</h3>
                            <p className="value-text">Pushing boundaries and thinking outside the box</p>
                        </div>
                        <div className="value-item animate-on-scroll" data-delay="200">
                            <div className="value-icon"><i className="ph ph-handshake"></i></div>
                            <h3 className="value-title">Collaboration</h3>
                            <p className="value-text">Building bridges between cultures and communities</p>
                        </div>
                        {/* <div className="value-item animate-on-scroll" data-delay="300">
                            <div className="value-icon"><i className="ph ph-lightning"></i></div>
                            <h3 className="value-title">Innovation</h3>
                            <p className="value-text">Embracing technology to transform experiences</p>
                        </div> */}
                        <div className="value-item animate-on-scroll" data-delay="400">
                            <div className="value-icon"><i className="ph ph-globe"></i></div>
                            <h3 className="value-title">Global Impact</h3>
                            <p className="value-text">Creating positive change across continents</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section className="section community">
                <div className="community-background"></div>
                <div className="container">
                    <div className="community-content animate-on-scroll">
                        <div className="community-badge">Join Us</div>
                        <h2 className="community-title text-white">
                            Become Part of the <span className="gradient-text">Elfinic</span> Story
                        </h2>
                        <p className="community-text">
                            Elfinic is more than an online store, it's a community of individuals who share a passion for
                            style and technology. We invite you to explore our collections and embark on a shopping journey
                            that combines practicality with enchantment.
                        </p>
                        <p className="community-thankyou">
                            Thank you for visiting Elfinic, and we look forward to being a part of your fashion and tech adventures.
                        </p>
                        <div className="community-actions">
                           <Link to="/shop">
                            <button className="btn-primary community-btn">
                                Explore Collections
                                <span className="btn-arrow">→</span>
                            </button>
                            </Link>
                            <Link to="/contact">
                            <button className="btn-secondary">
                                Get in Touch
                            </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About; 