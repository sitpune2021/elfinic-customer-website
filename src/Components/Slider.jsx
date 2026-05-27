import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SliderStyles.css";
import { useDispatch, useSelector } from "react-redux";
import { getSlider, selectApiLoading, selectApiError, selectApiResponse, image_path } from "../store/slices/bannerSlice";

export default function slider() {

    const dispatch = useDispatch();
    const sliderData = useSelector(selectApiResponse('slider'));
    const sliderLoading = useSelector(selectApiLoading('slider'));
    const sliderError = useSelector(selectApiError('slider'));
    const [imagesLoaded, setImagesLoaded] = useState({});
    const [allImagesLoaded, setAllImagesLoaded] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [timeLeft, setTimeLeft] = useState(5); // 5 seconds timer
    const [isTimerVisible, setIsTimerVisible] = useState(true); // Timer visibility state
    const sliderRef = useRef(null);

    useEffect(() => {
        // Dispatch an action to fetch slider data when the component mounts
        dispatch(getSlider('slider'));
    }, [dispatch]);

    // Get slider images from API response
    const getSliderImages = () => {
        if (sliderData?.data && sliderData.data.length > 0) {
            // Map through all banner objects and collect their images
            const slides = [];
            sliderData.data.forEach(banner => {
                // Only include active banners with images
                if (banner.status === 'active' && banner.images && banner.images.length > 0) {
                    banner.images.forEach(img => {
                        slides.push({
                            img: `${banner.path}${img}`,
                            title: banner.title || '',
                            link: banner.link || '#'
                        });
                    });
                }
            });
            return slides;
        }
        // Return empty array if no data
        return [];
    };

    const obj = getSliderImages();

    // Preload images and track loading state
    useEffect(() => {
        if (obj.length > 0) {
            setAllImagesLoaded(false);
            setImagesLoaded({});
            let loadedCount = 0;

            obj.forEach((item, index) => {
                const img = new Image();
                img.src = item.img;

                img.onload = () => {
                    loadedCount++;
                    setImagesLoaded(prev => ({ ...prev, [index]: true }));

                    if (loadedCount === obj.length) {
                        setAllImagesLoaded(true);
                    }
                };

                img.onerror = () => {
                    loadedCount++;
                    setImagesLoaded(prev => ({ ...prev, [index]: 'error' }));

                    if (loadedCount === obj.length) {
                        setAllImagesLoaded(true);
                    }
                };
            });
        } else if (obj.length === 0 && sliderData) {
            // If we have slider data but no valid images, mark as loaded
            setAllImagesLoaded(true);
        }
    }, [sliderData]);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: allImagesLoaded,
        autoplaySpeed: 5000, // 5 seconds
        pauseOnHover: true,
        arrows: true,
        fade: false, // Set to true if you want fade transition instead of slide
        cssEase: 'ease-in-out',
        lazyLoad: 'ondemand',
        adaptiveHeight: false, // Keep false for consistent height
        beforeChange: (current, next) => {
            setCurrentSlide(next);
            setTimeLeft(5); // Reset timer
        },
        customPaging: function (i) {
            return (
                <button className={`custom-dot ${i === currentSlide ? 'active' : ''}`}>
                    {i + 1}
                </button>
            );
        },
        dotsClass: "slick-dots custom-dots",
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false, // Hide arrows on mobile for better UX
                    dots: true
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    dots: true
                }
            }
        ]
    };

    // Timer countdown effect
    useEffect(() => {
        if (!allImagesLoaded) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    return 5; // Reset to 5 when it reaches 0
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentSlide, allImagesLoaded]);

    // Handle mouse and touch events for timer visibility
    const handleSliderEnter = () => {
        setIsTimerVisible(false);
    };

    const handleSliderLeave = () => {
        setIsTimerVisible(true);
    };

    const handleTouchStart = () => {
        setIsTimerVisible(false);
    };

    const handleTouchEnd = () => {
        // Add a small delay before showing timer again on touch end
        setTimeout(() => {
            setIsTimerVisible(true);
        }, 100);
    };

    // Show skeleton loading only when API is loading OR images are being preloaded
    if (sliderLoading || (obj.length > 0 && !allImagesLoaded)) {
        return (
            <div className="slider-container full-width-slider">
                <div className="slider-skeleton">
                    <div className="skeleton-slide"></div>
                </div>
            </div>
        );
    }

    // Don't show error, just return null silently
    if (sliderError || obj.length === 0) {
        console.warn("Slider Warning:", sliderError || "No slider images available");
        return null;
    }

    // Filter out images that failed to load
    const validImages = obj.filter((_, index) => imagesLoaded[index] === true);

    if (validImages.length === 0) {
        return null;
    }

    return (
        <div
            className="slider-container full-width-slider"
            onMouseEnter={handleSliderEnter}
            onMouseLeave={handleSliderLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
        >
            <div className={`timer-display ${isTimerVisible ? 'visible' : 'hidden'}`}>
                {/* <div className="timer-circle">
                    <span className="timer-text">{timeLeft}</span>
                </div> */}
            </div>
            <Slider ref={sliderRef} {...settings}>
                {validImages.map((item, index) => (
                    <div key={index} className="slide-item">
                        {item.link && item.link !== '#' ? (
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={item.img}
                                    alt={item.title || `Slide ${index + 1}`}
                                    loading={index === 0 ? "eager" : "lazy"}
                                    draggable="false"
                                />
                            </a>
                        ) : (
                            <img
                                src={item.img}
                                alt={item.title || `Slide ${index + 1}`}
                                loading={index === 0 ? "eager" : "lazy"}
                                draggable="false"
                            />
                        )}
                    </div>
                ))}
            </Slider>
        </div>
    );
}