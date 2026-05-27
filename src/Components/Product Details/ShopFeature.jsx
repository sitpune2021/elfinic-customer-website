import React from 'react'
import './ShopFeature.css'

function ShopFeature({ productFeature }) {
    const features = [
        // {
        //     id: 1,
        //     icon: '/images/shop_feature/orifinal_product.png',
        //     title: 'Original Products',
        //     bgColor: '#E8F5E9'
        // },
        // {
        //     id: 2,
        //     icon: '/images/shop_feature/cashondelivery.png',
        //     title: 'Cash on Delivery',
        //     bgColor: '#E3F2FD'
        // },
        // {
        //     id: 3,
        //     icon: '/images/shop_feature/7dayReplace.png',
        //     title: '7-day Returns',
        //     bgColor: '#FFF3E0'
        // }
    ]

    return (
        <div className="shop-feature-container">
            <div className="shop-feature-wrapper">
                {productFeature?.map((feature) => (
                    <div
                        key={feature.id}
                        className={`shop-feature-card rounded-0 `}
                    >
                        <div
                            className="shop-feature-icon overflow-hidden"
                            style={{ backgroundColor: feature.bgColor }}
                        >
                            <img
                                src={feature.icon}
                                className='feature-emoji img-fluid'
                                alt={feature.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    padding: '4px'
                                }}
                            />
                        </div>
                        <h3 className="shop-feature-title">{feature.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ShopFeature