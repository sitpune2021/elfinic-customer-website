import React, { useEffect } from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import "./BrandSlider.css"
import { useApi } from '../hooks/useApi'
import { Link } from 'react-router-dom'

function Brand() {
    const {
        brands,
        brandsLoading,
        brandsError,
        fetchBrands,
        image_path
    } = useApi();

    useEffect(() => {
        if (!brands || brands.length === 0) {
            fetchBrands();
        }
    }, [fetchBrands, brands]);

    const displayBrands = brands && brands.length > 0
        ? brands.map(brand => ({
            id: brand.id,
            name: brand.name,
            img: brand.image ? `${image_path}brand-images/${brand.image}` : null,
            status: brand.status
        }))
        : [];

    const skeletonItems = Array.from({ length: 10 }, (_, i) => ({ id: `sk-${i}` }));

    const sliderSettings = {
        slidesToShow: 10,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 3000,
        dots: false,
        pauseOnHover: true,
        arrows: false,
        draggable: true,
        infinite: true,
        cssEase: 'linear',
        rtl: document.documentElement.getAttribute('dir') === 'rtl',
        responsive: [
            { breakpoint: 1600, settings: { slidesToShow: 9 } },
            { breakpoint: 1400, settings: { slidesToShow: 8 } },
            { breakpoint: 1200, settings: { slidesToShow: 7 } },
            { breakpoint: 992, settings: { slidesToShow: 6 } },
            { breakpoint: 768, settings: { slidesToShow: 5 } },
            { breakpoint: 576, settings: { slidesToShow: 4 } },
            { breakpoint: 425, settings: { slidesToShow: 3 } },
            { breakpoint: 360, settings: { slidesToShow: 3 } },
        ]
    };

    return (
        <div className="brandSlider-root">
            <div className="container container-lg">
                <div className="brandSlider-container">
                    <div className="brandSlider-heading">
                        <h5>Top Brands</h5>
                        {brandsLoading && (
                            <span className="brandSlider-statusText" style={{ color: '#9ca3af' }}>Loading…</span>
                        )}
                        {brandsError && (
                            <span className="brandSlider-statusText" style={{ color: '#ef4444' }}>Failed to load</span>
                        )}
                    </div>

                    {brandsLoading ? (
                        <Slider {...sliderSettings} className="brandSlider-track">
                            {skeletonItems.map((item) => (
                                <div key={item.id} className="brandSlider-skeleton">
                                    <div className="brandSlider-skeletonBox" />
                                </div>
                            ))}
                        </Slider>
                    ) : brandsError ? (
                        <div className="brandSlider-empty">
                            <i className="ph ph-warning-circle" style={{ color: '#dc3545' }} />
                            <p>Failed to load brands</p>
                        </div>
                    ) : displayBrands.length > 0 ? (
                        <Slider {...sliderSettings} className="brandSlider-track">
                            {displayBrands.map((item, index) => (
                                <div key={item.id || index}>
                                    <div className="brandSlider-card">
                                        <Link to={'/shop?brand=' + item.name} className="brandSlider-link">
                                            {item.img ? (
                                                <img
                                                    src={item.img}
                                                    alt={item.name || `Brand ${index + 1}`}
                                                    className="brandSlider-img"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="brandSlider-noImg">
                                                    <i className="ph ph-image" />
                                                </div>
                                            )}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <div className="brandSlider-empty">
                            <i className="ph ph-storefront" style={{ color: '#9ca3af' }} />
                            <p>No brands available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Brand