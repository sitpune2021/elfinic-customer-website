import React from 'react'
import { MdLocalOffer } from "react-icons/md";


function Offers() {
    const [open, setOpen] = React.useState(false);
    const offers = [
        "Free delivery on orders over ₹500",
        "Special PriceGet extra 8% offT&C",
        "Bank Offer10% instant discount on SBI Credit Card EMI Transactions, up to ₹1,500 on orders of ₹5,000 and above",
        "No Cost EMI on select cards for orders above ₹3,000T&C",
        "Partner OfferSign up for Amazon Pay ICICI Credit Card and get ₹750 Amazon.in Gift CardT&C",
        "Additional Offer 15% off on first order",
        "Seasonal Sale Extra 20% off on selected items",
        "Buy 1 Get 1 Free on premium products"
    ];

    // Show only first 3 offers when not open, all when open
    const displayedOffers = open ? offers : offers.slice(0, 3);

    return (
        <div className="offers-container">
            <ul className="mb-4">
                {displayedOffers.map((offer, index) => (
                    <li key={index} className="text-gray-600 mb-2 offer_text">
                        {/* <i className="ph ph-check-circle text-main-600 me-2"></i> */}
                        <i className='me-5 btn-elifnic'> <MdLocalOffer /></i>
                        {offer}
                    </li>
                ))}
            </ul>

            {offers.length > 3 && (
                <button
                    onClick={() => setOpen(!open)}
                    className="text-main-600 font-medium hover:text-main-700 more_offers_btn transition-colors"
                >
                    {open ? 'Show Less -' : 'More Offers +'}
                </button>
            )}
        </div>
    )
}

export default Offers