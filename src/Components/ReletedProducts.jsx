import React from 'react'

function ReletedProducts() {
    return (
        <section className="new-arrival pb-80">
            <div className="container container-lg">
                <div className="section-heading">
                    <div className="flex-between flex-wrap gap-8">
                        <h5 className="mb-0">You Might Also Like</h5>
                        <div className="flex-align gap-16">
                            <a href="shop.html"
                                className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline">All
                                Products</a>
                            <div className="flex-align gap-8">
                                <button type="button" id="new-arrival-prev"
                                    className="slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1">
                                    <i className="ph ph-caret-left"></i>
                                </button>
                                <button type="button" id="new-arrival-next"
                                    className="slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1">
                                    <i className="ph ph-caret-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="new-arrival__slider arrow-style-two">
                    <div>
                        <div
                            className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                            <a href="product-details.html" className="product-card__thumb flex-center overflow-hidden">
                                <img src="/images/thumbs/product-img7.png" alt="" />
                            </a>
                            <div className="product-card__content p-sm-2 w-100">
                                <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                    <a href="product-details.html" className="link text-line-2">C-500 Antioxidant Protect
                                        Dietary Supplement</a>
                                </h6>
                                <div className="flex-align gap-4">
                                    <span className="text-main-600 text-md d-flex"><i className="ph-fill ph-storefront"></i></span>
                                    <span className="text-gray-500 text-xs">By Lucky Supermarket</span>
                                </div>

                                <div className="product-card__content mt-12">
                                    <div className="product-card__price mb-8">
                                        <span className="text-heading text-md fw-semibold ">$14.99 <span
                                            className="text-gray-500 fw-normal">/Qty</span> </span>
                                        <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                            $28.99</span>
                                    </div>
                                    <div className="flex-align gap-6">
                                        <span className="text-xs fw-bold text-gray-600">4.8</span>
                                        <span className="text-15 fw-bold text-warning-600 d-flex"><i
                                            className="ph-fill ph-star"></i></span>
                                        <span className="text-xs fw-bold text-gray-600">(17k)</span>
                                    </div>
                                    <a href="cart.html"
                                        className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center">
                                        Add To Cart <i className="ph ph-shopping-cart"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div
                            className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                            <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">Sale 50% </span>
                            <a href="product-details.html" className="product-card__thumb flex-center overflow-hidden">
                                <img src="/images/thumbs/product-img8.png" alt="" />
                            </a>
                            <div className="product-card__content p-sm-2 w-100">
                                <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                    <a href="product-details.html" className="link text-line-2">Marcel's Modern Pantry Almond
                                        Unsweetened</a>
                                </h6>
                                <div className="flex-align gap-4">
                                    <span className="text-main-600 text-md d-flex"><i className="ph-fill ph-storefront"></i></span>
                                    <span className="text-gray-500 text-xs">By Lucky Supermarket</span>
                                </div>

                                <div className="product-card__content mt-12">
                                    <div className="product-card__price mb-8">
                                        <span className="text-heading text-md fw-semibold ">$14.99 <span
                                            className="text-gray-500 fw-normal">/Qty</span> </span>
                                        <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                            $28.99</span>
                                    </div>
                                    <div className="flex-align gap-6">
                                        <span className="text-xs fw-bold text-gray-600">4.8</span>
                                        <span className="text-15 fw-bold text-warning-600 d-flex"><i
                                            className="ph-fill ph-star"></i></span>
                                        <span className="text-xs fw-bold text-gray-600">(17k)</span>
                                    </div>
                                    <a href="cart.html"
                                        className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center">
                                        Add To Cart <i className="ph ph-shopping-cart"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div
                            className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                            <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">Sale 50% </span>
                            <a href="product-details.html" className="product-card__thumb flex-center overflow-hidden">
                                <img src="/images/thumbs/product-img9.png" alt="" />
                            </a>
                            <div className="product-card__content p-sm-2 w-100">
                                <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                    <a href="product-details.html" className="link text-line-2">O Organics Milk, Whole, Vitamin
                                        D</a>
                                </h6>
                                <div className="flex-align gap-4">
                                    <span className="text-main-600 text-md d-flex"><i className="ph-fill ph-storefront"></i></span>
                                    <span className="text-gray-500 text-xs">By Lucky Supermarket</span>
                                </div>

                                <div className="product-card__content mt-12">
                                    <div className="product-card__price mb-8">
                                        <span className="text-heading text-md fw-semibold ">$14.99 <span
                                            className="text-gray-500 fw-normal">/Qty</span> </span>
                                        <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                            $28.99</span>
                                    </div>
                                    <div className="flex-align gap-6">
                                        <span className="text-xs fw-bold text-gray-600">4.8</span>
                                        <span className="text-15 fw-bold text-warning-600 d-flex"><i
                                            className="ph-fill ph-star"></i></span>
                                        <span className="text-xs fw-bold text-gray-600">(17k)</span>
                                    </div>
                                    <a href="cart.html"
                                        className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center">
                                        Add To Cart <i className="ph ph-shopping-cart"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div
                            className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                            <span className="product-card__badge bg-info-600 px-8 py-4 text-sm text-white">Best Sale </span>
                            <a href="product-details.html" className="product-card__thumb flex-center overflow-hidden">
                                <img src="/images/thumbs/product-img10.png" alt="" />
                            </a>
                            <div className="product-card__content p-sm-2 w-100">
                                <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                    <a href="product-details.html" className="link text-line-2">Whole Grains and Seeds Organic
                                        Bread</a>
                                </h6>
                                <div className="flex-align gap-4">
                                    <span className="text-main-600 text-md d-flex"><i className="ph-fill ph-storefront"></i></span>
                                    <span className="text-gray-500 text-xs">By Lucky Supermarket</span>
                                </div>

                                <div className="product-card__content mt-12">
                                    <div className="product-card__price mb-8">
                                        <span className="text-heading text-md fw-semibold ">$14.99 <span
                                            className="text-gray-500 fw-normal">/Qty</span> </span>
                                        <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                            $28.99</span>
                                    </div>
                                    <div className="flex-align gap-6">
                                        <span className="text-xs fw-bold text-gray-600">4.8</span>
                                        <span className="text-15 fw-bold text-warning-600 d-flex"><i
                                            className="ph-fill ph-star"></i></span>
                                        <span className="text-xs fw-bold text-gray-600">(17k)</span>
                                    </div>
                                    <a href="cart.html"
                                        className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center">
                                        Add To Cart <i className="ph ph-shopping-cart"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div
                            className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                            <a href="product-details.html" className="product-card__thumb flex-center overflow-hidden">
                                <img src="/images/thumbs/product-img11.png" alt="" />
                            </a>
                            <div className="product-card__content p-sm-2 w-100">
                                <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                    <a href="product-details.html" className="link text-line-2">Lucerne Yogurt, Lowfat,
                                        Strawberry</a>
                                </h6>
                                <div className="flex-align gap-4">
                                    <span className="text-main-600 text-md d-flex"><i className="ph-fill ph-storefront"></i></span>
                                    <span className="text-gray-500 text-xs">By Lucky Supermarket</span>
                                </div>

                                <div className="product-card__content mt-12">
                                    <div className="product-card__price mb-8">
                                        <span className="text-heading text-md fw-semibold ">$14.99 <span
                                            className="text-gray-500 fw-normal">/Qty</span> </span>
                                        <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                            $28.99</span>
                                    </div>
                                    <div className="flex-align gap-6">
                                        <span className="text-xs fw-bold text-gray-600">4.8</span>
                                        <span className="text-15 fw-bold text-warning-600 d-flex"><i
                                            className="ph-fill ph-star"></i></span>
                                        <span className="text-xs fw-bold text-gray-600">(17k)</span>
                                    </div>
                                    <a href="cart.html"
                                        className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center">
                                        Add To Cart <i className="ph ph-shopping-cart"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div
                            className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                            <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">Sale 50% </span>
                            <a href="product-details.html" className="product-card__thumb flex-center overflow-hidden">
                                <img src="/images/thumbs/product-img12.png" alt="" />
                            </a>
                            <div className="product-card__content p-sm-2 w-100">
                                <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                    <a href="product-details.html" className="link text-line-2">Nature Valley Whole Grain Oats
                                        and Honey Protein</a>
                                </h6>
                                <div className="flex-align gap-4">
                                    <span className="text-main-600 text-md d-flex"><i className="ph-fill ph-storefront"></i></span>
                                    <span className="text-gray-500 text-xs">By Lucky Supermarket</span>
                                </div>

                                <div className="product-card__content mt-12">
                                    <div className="product-card__price mb-8">
                                        <span className="text-heading text-md fw-semibold ">$14.99 <span
                                            className="text-gray-500 fw-normal">/Qty</span> </span>
                                        <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                            $28.99</span>
                                    </div>
                                    <div className="flex-align gap-6">
                                        <span className="text-xs fw-bold text-gray-600">4.8</span>
                                        <span className="text-15 fw-bold text-warning-600 d-flex"><i
                                            className="ph-fill ph-star"></i></span>
                                        <span className="text-xs fw-bold text-gray-600">(17k)</span>
                                    </div>
                                    <a href="cart.html"
                                        className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center">
                                        Add To Cart <i className="ph ph-shopping-cart"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div
                            className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                            <span className="product-card__badge bg-info-600 px-8 py-4 text-sm text-white">Best Sale </span>
                            <a href="product-details.html" className="product-card__thumb flex-center overflow-hidden">
                                <img src="/images/thumbs/product-img10.png" alt="" />
                            </a>
                            <div className="product-card__content p-sm-2 w-100">
                                <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                    <a href="product-details.html" className="link text-line-2">Whole Grains and Seeds Organic
                                        Bread</a>
                                </h6>
                                <div className="flex-align gap-4">
                                    <span className="text-main-600 text-md d-flex"><i className="ph-fill ph-storefront"></i></span>
                                    <span className="text-gray-500 text-xs">By Lucky Supermarket</span>
                                </div>

                                <div className="product-card__content mt-12">
                                    <div className="product-card__price mb-8">
                                        <span className="text-heading text-md fw-semibold ">$14.99 <span
                                            className="text-gray-500 fw-normal">/Qty</span> </span>
                                        <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                            $28.99</span>
                                    </div>
                                    <div className="flex-align gap-6">
                                        <span className="text-xs fw-bold text-gray-600">4.8</span>
                                        <span className="text-15 fw-bold text-warning-600 d-flex"><i
                                            className="ph-fill ph-star"></i></span>
                                        <span className="text-xs fw-bold text-gray-600">(17k)</span>
                                    </div>
                                    <a href="cart.html"
                                        className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center">
                                        Add To Cart <i className="ph ph-shopping-cart"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ReletedProducts