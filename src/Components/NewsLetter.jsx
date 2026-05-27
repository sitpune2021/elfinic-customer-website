import React, { useState } from 'react'

function NewsLetter() {
    const [email, setEmail] = useState('');

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Newsletter subscription submitted with email:', email);
        alert('Newsletter subscription submitted - Check console for data');
        setEmail(''); // Clear the form after submission
    };

    return (
        <div className="newsletter-two bg-neutral-600 py-32 overflow-hidden">
            <div className="container container-lg">
                <div className="flex-between gap-20 flex-wrap">
                    <div className="flex-align gap-22">
                        <span className="d-flex"><img src="assets/images/icon/envelop.png" alt="" /></span>
                        <div>
                            <h5 className="text-white mb-12 fw-medium">Join Our Newsletter, Get 10% Off</h5>
                            <p className="text-white fw-light">Get all latest information on events, sales and offer</p>
                        </div>
                    </div>
                    <form action="#" className="newsletter-two__form w-50" onSubmit={handleSubmit}>
                        <div className="flex-align gap-16">
                            <input
                                type="email"
                                className="common-input style-two rounded-8 flex-grow-1 py-14"
                                value={email}
                                onChange={handleChange}
                                placeholder="Enter your email address"
                            />
                            <button type="submit" className="btn btn-main-two flex-shrink-0 rounded-8 py-16"> Subscribe</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default NewsLetter