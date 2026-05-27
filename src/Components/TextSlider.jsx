import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSlider, selectApiLoading, selectApiError, selectApiResponse } from '../store/slices/bannerSlice'

function TextSlider() {
    const [isPaused, setIsPaused] = useState(false);
    const marqueeRef = useRef(null);
    const containerRef = useRef(null);

    const dispatch = useDispatch();
    const marqueeData = useSelector(selectApiResponse('marquee'));
    const marqueeLoading = useSelector(selectApiLoading('marquee'));
    const marqueeError = useSelector(selectApiError('marquee'));

    useEffect(() => {
        dispatch(getSlider('marquee'));
    }, [dispatch]);

    // Get marquee items from API
    const getMarqueeItems = () => {
        if (!marqueeData?.data || marqueeData.data.length === 0) return [];

        return marqueeData.data
            .filter(item => item.status === 'active')
            .map(item => ({
                id: item.id,
                title: item.Title || 'Featured'
            }));
    };

    const obj = getMarqueeItems();

    // Duplicate the array for seamless loop
    const duplicatedItems = [...obj, ...obj];

    const marqueeStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        animationName: isPaused ? 'none' : 'marquee',
        animationDuration: 'var(--marquee-duration, 20s)',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        animationPlayState: isPaused ? 'paused' : 'running',
        willChange: 'transform'
    };

    // Calculate animation duration based on content width
    useEffect(() => {
        const updateAnimationDuration = () => {
            if (marqueeRef.current && containerRef.current) {
                const marqueeWidth = marqueeRef.current.scrollWidth / 2; // Since we duplicated
                const containerWidth = containerRef.current.offsetWidth;
                const duration = (marqueeWidth / 100) * 2; // Adjust speed as needed

                // Update CSS variable
                document.documentElement.style.setProperty('--marquee-duration', `${duration}s`);
            }
        };

        updateAnimationDuration();
        window.addEventListener('resize', updateAnimationDuration);

        return () => {
            window.removeEventListener('resize', updateAnimationDuration);
        };
    }, [obj.length]);

    // Show loading skeleton
    if (marqueeLoading || obj.length === 0) {
        return (
            <div className="text-slider-section overflow-hidden bg-neutral-600 py-28">
                <div className="marquee-container" style={{ height: '60px', display: 'flex', alignItems: 'center' }}>
                    <div style={{
                        width: '100%',
                        height: '30px',
                        background: 'linear-gradient(90deg, #6b6b6b 25%, #7a7a7a 50%, #6b6b6b 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                        borderRadius: '4px'
                    }}></div>
                </div>
                <style jsx>{`
                    @keyframes shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                `}</style>
            </div>
        );
    }

    // Handle error - return null silently
    if (marqueeError) {
        return null;
    }

    return (
        <div className="text-slider-section overflow-hidden bg-neutral-600 py-28">
            <style jsx>{`
                :root {
                    --marquee-duration: 20s;
                }
                
                @keyframes marquee {
                    0% {
                        transform: translateX(0%);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                
                .marquee-container {
                    width: 100%;
                    overflow: hidden;
                    cursor: pointer;
                    position: relative;
                }
                
                .marquee-content {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    white-space: nowrap;
                    width: max-content;
                }
                
                .marquee-content:hover {
                    animation-play-state: paused !important;
                }
                
                .marquee-item {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    flex-shrink: 0;
                    transition: transform 0.2s ease;
                }
                
                .marquee-item:hover {
                    transform: scale(1.05);
                }
                
                /* Gradient overlays for smooth edges */
                .marquee-container::before,
                .marquee-container::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    width: 50px;
                    height: 100%;
                    z-index: 2;
                    pointer-events: none;
                }
                
                .marquee-container::before {
                    left: 0;
                    background: linear-gradient(to right, rgb(82 82 82) 0%, transparent 100%);
                }
                
                .marquee-container::after {
                    right: 0;
                    background: linear-gradient(to left, rgb(82 82 82) 0%, transparent 100%);
                }
            `}</style>

            <div
                ref={containerRef}
                className="marquee-container"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div
                    ref={marqueeRef}
                    className="marquee-content"
                    style={marqueeStyle}
                >
                    {duplicatedItems.map((item, index) => (
                        <div className="marquee-item" key={`${item.id}-${index}`}>
                            <span className="flex-shrink-0">
                                <img src="images/icon/star-color.png" alt="star" />
                            </span>
                            <h4 className="text-white mb-0 fw-medium">{item.title}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TextSlider;