import React from 'react'
import { Link } from 'react-router-dom'
import { pricingPlans } from '../data/pricingPlans'

function PricePlane() {

    return (
        <section className="pricing-section" id='plans'>
            <div className="container">
                <div className="row justify-content-center text-center mb-5">
                    <div className="col-lg-8">
                        <h2 className="">
                            <span className="text-gradient">Elfinic</span> Merchant Plans
                        </h2>
                        <p className="section-subtitle">
                            Choose the perfect plan to grow your business with Elfinic
                        </p>
                    </div>
                </div>

                <div className="pricing-grid mt-40">
                    {pricingPlans.map(plan => (
                        <div key={plan.id} className={plan.cardClass}>
                            {plan.isFeatured && plan.popularBadge && (
                                <div className="popular-badge">{plan.popularBadge}</div>
                            )}
                            <div className="pricing-header">
                                <div className="plan-image">
                                    <img
                                        src={plan.image}
                                        alt={`${plan.name} Plan`}
                                    />
                                </div>
                                <h4 className={plan.nameClass}>{plan.name}</h4>
                                <div className="plan-price">
                                    <span className="price-symbol">{plan.currency}</span>
                                    <span className="price-amount">{plan.price.toLocaleString()}</span>
                                </div>
                                {plan.registrationCharges > 0 && (
                                    <p className="registration-charges">
                                        +₹{plan.registrationCharges} Registration Charges
                                    </p>
                                )}
                                <p className="plan-description">{plan.description}</p>
                                <p className="plan-validity">{plan.validityText}</p>
                            </div>

                            <ul className="plan-features" style={plan.featuresStyle || {}}>
                                {plan.features.map((feature, index) => (
                                    <li key={index}>
                                        <i className={plan.iconClass}></i> {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to={`/vendorRegistration?plan=${plan.id}&planName=${encodeURIComponent(plan.name)}&price=${plan.price}`}
                                className={plan.buttonClass}
                            >
                                {plan.buttonText}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default PricePlane