import React from "react";
import { FaFacebook, FaYoutube, FaLinkedin } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io5";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import { FiSend, FiChevronRight } from "react-icons/fi";
import appStore from "/images/icon/appStore.png";
import playStore from "/images/icon/playStore.png";
import { Link, useLocation } from "react-router-dom";
import { SOCIAL_MEDIA_LINKS, CONTACT_INFO } from "../../data/socialMedia";
import Elfinic from "/images/logo/elfinice logo.png";
import "./Footer.css";


function Footer() {
    const location = useLocation();
    const currentYear = new Date().getFullYear();

    const socialIcons = [
        { icon: IoLogoInstagram, data: SOCIAL_MEDIA_LINKS.instagram, hoverClass: "elf-footer__social-link--instagram" },
        { icon: FaFacebook, data: SOCIAL_MEDIA_LINKS.facebook, hoverClass: "elf-footer__social-link--facebook" },
        { icon: FaSquareXTwitter, data: SOCIAL_MEDIA_LINKS.twitter, hoverClass: "elf-footer__social-link--twitter" },
        { icon: FaLinkedin, data: SOCIAL_MEDIA_LINKS.linkedin, hoverClass: "elf-footer__social-link--linkedin" },
        { icon: FaYoutube, data: SOCIAL_MEDIA_LINKS.youtube, hoverClass: "elf-footer__social-link--youtube" },
    ];

    return (
        <footer className="elf-footer">


            {/* Newsletter Section */}
            {/* <div className="elf-footer__newsletter">
                <div className="elf-footer__container">
                    <div className="elf-footer__newsletter-inner">
                        <div className="elf-footer__newsletter-text">
                            <h3 className="elf-footer__newsletter-title">Stay in the Loop</h3>
                            <p className="elf-footer__newsletter-desc">Subscribe for exclusive deals, new arrivals & style tips.</p>
                        </div>
                        <form className="elf-footer__newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="elf-footer__newsletter-input-wrap">
                                <HiOutlineMail className="elf-footer__newsletter-icon" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="elf-footer__newsletter-input"
                                />
                                <button type="submit" className="elf-footer__newsletter-btn">
                                    <FiSend />
                                    <span>Subscribe</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div> */}

            {/* Main Footer Content */}
            <div className="elf-footer__main">
                <div className="elf-footer__container">
                    <div className="elf-footer__grid">

                        {/* Company Info */}
                        <div className="elf-footer__col elf-footer__col--brand">
                            <img src={Elfinic} alt="Elfinic Logo" className="elf-footer__logo" />
                            <p className="elf-footer__brand-desc">
                                Elfinic is a global creative commerce company, blending creativity, culture, and commerce.
                            </p>
                            <div className="elf-footer__contact-list">
                                <a href={`mailto:${CONTACT_INFO.email}`} className="elf-footer__contact-item">
                                    <HiOutlineMail className="elf-footer__contact-icon" />
                                    <span>{CONTACT_INFO.email}</span>
                                </a>
                                <a href={`tel:${CONTACT_INFO.phone}`} className="elf-footer__contact-item">
                                    <HiOutlinePhone className="elf-footer__contact-icon" />
                                    <span>{CONTACT_INFO.phone}</span>
                                </a>
                            </div>

                            {/* Social Icons */}
                            <div className="elf-footer__social">
                                {socialIcons.map(({ icon: Icon, data, hoverClass }) => (
                                    <a
                                        key={data.name}
                                        href={data.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={data.ariaLabel}
                                        className={`elf-footer__social-link ${hoverClass}`}
                                    >
                                        <Icon />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Information Links */}
                        <div className="elf-footer__col elf-footer__col--links">
                            <h4 className="elf-footer__heading">Information</h4>
                            <ul className="elf-footer__link-list">
                                <li>
                                    <Link to="https://business.elfinic.com/" className="elf-footer__link">
                                        <FiChevronRight className="elf-footer__link-arrow" />
                                        Become a Vendor
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/privacypolicy" className={`elf-footer__link ${location.pathname === "/privacypolicy" ? "elf-footer__link--active" : ""}`}>
                                        <FiChevronRight className="elf-footer__link-arrow" />
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/all-brands" className={`elf-footer__link ${location.pathname === "/all-brands" ? "elf-footer__link--active" : ""}`}>
                                        <FiChevronRight className="elf-footer__link-arrow" />
                                        Our Suppliers
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/shippingpolicy" className={`elf-footer__link ${location.pathname === "/shippingpolicy" ? "elf-footer__link--active" : ""}`}>
                                        <FiChevronRight className="elf-footer__link-arrow" />
                                        Community
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Customer Support Links */}
                        <div className="elf-footer__col elf-footer__col--links">
                            <h4 className="elf-footer__heading">Customer Support</h4>
                            <ul className="elf-footer__link-list">
                                <li>
                                    <Link to="/contact" className={`elf-footer__link ${location.pathname === "/contact" ? "elf-footer__link--active" : ""}`}>
                                        <FiChevronRight className="elf-footer__link-arrow" />
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/TaxPolicy" className={`elf-footer__link ${location.pathname === "/TaxPolicy" ? "elf-footer__link--active" : ""}`}>
                                        <FiChevronRight className="elf-footer__link-arrow" />
                                        Tax Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/shippingpolicy" className={`elf-footer__link ${location.pathname === "/shippingpolicy" ? "elf-footer__link--active" : ""}`}>
                                        <FiChevronRight className="elf-footer__link-arrow" />
                                        Shipping Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/returnexchangepolicy" className={`elf-footer__link ${location.pathname === "/returnexchangepolicy" ? "elf-footer__link--active" : ""}`}>
                                        <FiChevronRight className="elf-footer__link-arrow" />
                                        Return & Exchange
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Shop on The Go */}
                        <div className="elf-footer__col elf-footer__col--app">
                            <h4 className="elf-footer__heading">Shop on The Go</h4>
                            <p className="elf-footer__app-desc">Download the Elfinic App for the best shopping experience.</p>
                            <div className="elf-footer__app-badges">
                                <Link
                                    to="https://play.google.com/store/apps/details?id=com.sit.elfinic_commerce_llc&pcampaignid=web_share"
                                    className="elf-footer__app-badge"
                                >
                                    <img src={appStore} alt="Download on App Store" />
                                </Link>
                                <Link
                                    to="https://play.google.com/store/apps/details?id=com.sit.elfinic_commerce_llc&pcampaignid=web_share"
                                    className="elf-footer__app-badge"
                                >
                                    <img src={playStore} alt="Get it on Google Play" />
                                </Link>
                            </div>
                            {/* Payment Trust Badge */}
                            <div className="elf-footer__trust">
                                <p className="elf-footer__trust-title">We Accept</p>
                                <div className="elf-footer__payment-icons">
                                    <span className="elf-footer__payment-chip">Visa</span>
                                    <span className="elf-footer__payment-chip">Mastercard</span>
                                    <span className="elf-footer__payment-chip">UPI</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="elf-footer__bottom">
                <div className="elf-footer__container">
                    <div className="elf-footer__bottom-inner">
                        <p className="elf-footer__copyright">
                            &copy; {currentYear} <strong>Elfinic</strong>. All rights reserved.
                        </p>
                        <div className="elf-footer__bottom-links">
                            <Link to="/privacypolicy" className="elf-footer__bottom-link">Privacy</Link>
                            <span className="elf-footer__bottom-sep">•</span>
                            <Link to="/TaxPolicy" className="elf-footer__bottom-link">Terms</Link>
                            <span className="elf-footer__bottom-sep">•</span>
                            <Link to="/shippingpolicy" className="elf-footer__bottom-link">Sitemap</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
