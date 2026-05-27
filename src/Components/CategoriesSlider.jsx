import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, FreeMode } from 'swiper/modules';
import { useApi } from '../hooks/useApi';
import { Link } from 'react-router-dom';
import Heading from './Home/Heading';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import './CategoriesSlider.css';

export default function CategoriesSlider() {
    const { categories, categoriesLoading, categoriesError, image_path, fetchCategories } = useApi();

    useEffect(() => {
        if (!categories || categories.length === 0) {
            fetchCategories().catch(error => {
                console.error("Failed to fetch categories:", error);
            });
        }
    }, [fetchCategories, categories]);

    // Soft background colors for the circular image holder
    const bgColors = [
        '#fce4ec', '#e8eaf6', '#e0f2f1', '#fff3e0',
        '#f3e5f5', '#e8f5e9', '#fff8e1', '#e1f5fe'
    ];

    // Swiper breakpoints — show more cards, tighter spacing
    const swiperBreakpoints = {
        0: { slidesPerView: 4, spaceBetween: 8 },
        400: { slidesPerView: 5, spaceBetween: 8 },
        576: { slidesPerView: 6, spaceBetween: 10 },
        768: { slidesPerView: 7, spaceBetween: 12 },
        992: { slidesPerView: 8, spaceBetween: 14 },
        1200: { slidesPerView: 9, spaceBetween: 14 },
        1400: { slidesPerView: 10, spaceBetween: 16 }
    };

    return (
        <section className="catSlider-section" id="featureSection">
            <div className="container container-lg">
                <Heading
                    title="Popular Categories"
                    alignment="center"
                    showViewAll={false}
                />

                {categoriesLoading ? (
                    <div className="catSlider-skeleton-row">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="catSlider-skeleton-item">
                                <div className="catSlider-skeleton-circle" />
                                <div className="catSlider-skeleton-text" />
                            </div>
                        ))}
                    </div>
                ) : categoriesError ? (
                    <div className="text-center py-3">
                        <div className="alert alert-danger d-inline-block" role="alert">
                            <h6 className="alert-heading mb-1">Error Loading Categories</h6>
                            <button className="btn btn-sm btn-danger" onClick={() => window.location.reload()}>
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : categories && categories.length > 0 ? (
                    <div className="catSlider-wrapper">
                        <Swiper
                            modules={[Navigation, Autoplay, FreeMode]}
                            spaceBetween={14}
                            slidesPerView={10}
                            navigation
                            freeMode={{ enabled: true, sticky: false, momentumRatio: 0.5 }}
                            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                            loop={categories.length > 10}
                            breakpoints={swiperBreakpoints}
                            className="catSlider-swiper"
                        >
                            {categories.map((category, index) => (
                                <SwiperSlide key={category.id}>
                                    <Link to={`/subcategories/${category.id}/${category.name}`} className="catSlider-card">
                                        <div
                                            className="catSlider-img-circle"
                                            style={{ backgroundColor: bgColors[index % bgColors.length] }}
                                        >
                                            {category.image ? (
                                                <img
                                                    src={`${image_path}category-images/${category.image}`}
                                                    alt={category.name || 'Category'}
                                                    className="catSlider-img"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <i className="ph ph-image catSlider-placeholder-icon"></i>
                                            )}
                                        </div>
                                        <span className="catSlider-label">
                                            {category.name || 'Category'}
                                        </span>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <i className="ph ph-squares-four" style={{ fontSize: '40px', color: '#9ca3af' }}></i>
                        <p className="mt-2 mb-0" style={{ color: '#6b7280' }}>No categories available</p>
                    </div>
                )}
            </div>
        </section>
    );
}