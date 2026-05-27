import React from 'react'
import { Link } from 'react-router-dom'

function VendorCard({ vendor }) {
    // Get country flag code (convert IN to lowercase for flag API)
    const countryCode = vendor?.country?.toLowerCase() || 'in';

    // Build location string
    const locationParts = [
        vendor?.country || '',
        vendor?.state || '',
        vendor?.city || ''
    ].filter(Boolean);
    const locationString = locationParts.join('-') || 'Location not available';

    return (

        <div
            className="vendors-two-item rounded-12 overflow-hidden bg-color-three border border-neutral-50 hover-border-main-two-600 transition-2">
            <div className="vendors-two-item__top bg-overlay style-two position-relative">
                <div className="vendors-two-item__thumbs h-210">
                    <img src="/images/thumbs/vendors-two-img1.png" alt="" className="cover-img" />
                </div>
                <div
                    className="position-absolute top-0 inset-inline-start-0 w-100 h-100 p-24 z-1 d-flex flex-column justify-content-between">
                    <div className="d-flex align-items-center justify-content-between">
                        <span className="w-80 h-80 flex-center bg-white rounded-circle flex-shrink-0 overflow-hidden">
                            {vendor?.company_logo ? (
                                <img
                                    src={vendor.company_logo}
                                    alt={vendor?.company_name || 'Vendor'}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/images/thumbs/vendors-two-icon1.png';
                                    }}
                                />
                            ) : (
                                <img src="/images/thumbs/vendors-two-icon1.png" alt="" />
                            )}
                        </span>

                    </div>
                    <div className="mt-16">
                        <h6 className="text-white fw-semibold mb-12">
                            <Link to={`/vendor-details/${vendor?.vendor_id}`} className="">
                                {vendor?.company_name || 'Vendor Shop'}
                            </Link>
                        </h6>

                    </div>
                </div>
            </div>
            <div className="vendors-two-item__content p-24 flex-grow-1">
                <div className="d-flex flex-column gap-14">
                    <div className="flex-align gap-8">
                        <span className="flex-center text-main-two-600 text-2xl flex-shrink-0">
                            {vendor?.country && (
                                <img
                                    src={`https://flagcdn.com/16x12/${countryCode}.png`}
                                    srcSet={`https://flagcdn.com/32x24/${countryCode}.png 2x, https://flagcdn.com/48x36/${countryCode}.png 3x`}
                                    width="20"
                                    height="15"
                                    alt={vendor?.country || 'Country'}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            )}
                            {!vendor?.country && <i className="ph ph-map-pin-line"></i>}
                        </span>
                        <p className="text-md text-gray-900">{locationString}</p>
                    </div>


                </div>
                <Link to={`/vendor-details/${vendor?.vendor_id}`}
                    className="btn bg-neutral-600 hover-bg-neutral-700 text-white py-12 px-24 rounded-8 flex-center gap-8 fw-medium mt-24">
                    View Store
                </Link>
            </div>
        </div >
    )
}

export default VendorCard