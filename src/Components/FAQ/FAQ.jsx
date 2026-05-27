import React, { useState } from 'react'
import './FaqStyles.css'

function Faq() {
    const [activeIndex, setActiveIndex] = useState(null);
    console.log(activeIndex);

    // Demo FAQ data
    const faqData = [
        {
            id: 1,
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and digital wallets like Apple Pay and Google Pay. All transactions are secured with SSL encryption."
        },
        {
            id: 2,
            question: "How long does shipping take?",
            answer: "Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days. International shipping may take 7-14 business days depending on your location. Free shipping is available for orders over $50."
        },
        {
            id: 3,
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy for all unused items in their original packaging. Items must be returned within 30 days of purchase. Refunds will be processed within 5-7 business days after we receive the returned item."
        },
        {
            id: 4,
            question: "Do you offer international shipping?",
            answer: "Yes, we ship to over 100 countries worldwide. Shipping costs and delivery times vary by destination. You can check shipping rates during checkout by entering your postal code."
        },
        {
            id: 5,
            question: "How can I track my order?",
            answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the 'My Orders' section. Tracking information is updated in real-time."
        },
        {
            id: 6,
            question: "Can I modify or cancel my order?",
            answer: "You can modify or cancel your order within 2 hours of placing it. After this time, your order enters our fulfillment process and cannot be changed. Contact our customer service team immediately if you need assistance."
        },
        {
            id: 7,
            question: "Do you offer customer support?",
            answer: "Yes, our customer support team is available 24/7 via live chat, email, and phone. We typically respond to emails within 2-4 hours during business days and within 24 hours on weekends."
        },
        {
            id: 8,
            question: "Are your products covered by warranty?",
            answer: "Most of our products come with a manufacturer's warranty ranging from 1-3 years. Warranty details are listed on each product page. We also offer extended warranty options for select items at checkout."
        }
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="faq-container">
            {/* Header Section */}
            <div className="faq-header bg-elifnic">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 text-center">
                            <h1 className="faq-title text-white mb-3">
                                Frequently Asked Questions
                            </h1>
                            <p className="faq-subtitle text-skyblue mb-4">
                                Find answers to common questions about our products and services
                            </p>
                            <div className="faq-search-box">
                                <input
                                    type="text"
                                    className="form-control faq-search-input"
                                    placeholder="Search for answers..."
                                />
                                <button className="btn btn-organge faq-search-btn">
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Content Section */}
            <div className="faq-content py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            {/* Quick Stats */}
                            <div className="faq-stats mb-5">
                                <div className="row text-center">
                                    <div className="col-md-3 col-6 mb-3">
                                        <div className="stat-card bg-skyblue">
                                            <h3 className="btn-elifnic">24/7</h3>
                                            <p className="stat-label btn-elifnic">Support</p>
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-6 mb-3">
                                        <div className="stat-card bg-skyblue">
                                            <h3 className=" ">100+</h3>
                                            <p className="stat-label btn-elifnic">Countries</p>
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-6 mb-3">
                                        <div className="stat-card bg-skyblue">
                                            <h3 className=" ">30 Days</h3>
                                            <p className="stat-label btn-elifnic">Returns</p>
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-6 mb-3">
                                        <div className="stat-card bg-skyblue">
                                            <h3 className="">98%</h3>
                                            <p className="stat-label btn-elifnic">Satisfaction</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Accordion */}
                            <div className="faq-accordion">
                                <h2 className="text-center text-elifnic mb-4">Common Questions</h2>
                                {faqData.map((faq, index) => (
                                    <div key={faq.id} className="faq-item mb-3">
                                        <div
                                            className={`faq-question ${activeIndex === index ? 'active' : ''}`}
                                            onClick={() => toggleAccordion(index)}
                                        >
                                            <h5 className="mb-0">
                                                <span className="question-text">{faq.question}</span>
                                                <i className={`fas fa-chevron-${activeIndex === index ? 'up' : 'down'} question-icon`}></i>
                                            </h5>
                                        </div>
                                        <div className={`faq-answer ${activeIndex === index ? 'show' : ''}`}>
                                            <p className="answer-text">{faq.answer}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Contact Section */}
                            <div className="faq-contact mt-5 p-4 bg-light rounded">
                                <div className="row align-items-center">
                                    <div className="col-md-8">
                                        <h4 className="text-elifnic mb-2">Still have questions?</h4>
                                        <p className="text-muted mb-0">
                                            Can't find the answer you're looking for? Our customer support team is here to help.
                                        </p>
                                    </div>
                                    <div className="col-md-4 text-md-end mt-3 mt-md-0">
                                        <button className="btn bg-organge text-white me-2 mb-2">
                                            <i className="fas fa-comment me-2"></i>Live Chat
                                        </button>
                                        <button className="btn btn-outline-primary mb-2">
                                            <i className="fas fa-envelope me-2"></i>Email Us
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Faq