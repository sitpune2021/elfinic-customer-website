import React from 'react'
import { Link } from 'react-router-dom'

function BestSellProducts() {
    return (
        <div className="d-flex align-items-center flex-sm-nowrap flex-wrap gap-16">
            <Link to="/product-details"
                className="w-100 h-100 rounded-4 overflow-hidden w-76 h-76 flex-shrink-0 bg-color-three flex-center">
                <img src="/images/thumbs/best-selling-img1.png" alt="" className="" />
            </Link>
            <div className="flex-grow-1">
                <h6 className="text-lg mb-8 fw-medium">
                    <Link to="/product-details" className="text-line-3">Man Fashion Shoe</Link>
                </h6>
                <div className="flex-align gap-6">
                    <div className="flex-align gap-4">
                        <span className="text-xs fw-medium text-warning-600 d-flex"><i
                            className="ph-fill ph-star"></i></span>
                        <span className="text-xs fw-medium text-warning-600 d-flex"><i
                            className="ph-fill ph-star"></i></span>
                        <span className="text-xs fw-medium text-warning-600 d-flex"><i
                            className="ph-fill ph-star"></i></span>
                        <span className="text-xs fw-medium text-warning-600 d-flex"><i
                            className="ph-fill ph-star"></i></span>
                        <span className="text-xs fw-medium text-warning-600 d-flex"><i
                            className="ph-fill ph-star"></i></span>
                    </div>
                    <span className="text-xs fw-medium text-neutral-500">4.8</span>
                    <span className="text-xs fw-medium text-neutral-500">(12K)</span>
                </div>
                <h6 className="text-md mb-0 mt-4">&#8377;25</h6>
            </div>
        </div>
    )
}

export default BestSellProducts