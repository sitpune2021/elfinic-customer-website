import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useApi } from '../../hooks/useApi';
import ErrorBoundary from './ErrorBoundary';

// Simple Image Magnifier Component (Custom Implementation)
const ImageMagnifier = ({ src, alt, onLoad, onError }) => {
    const [magnifierVisible, setMagnifierVisible] = useState(false);
    const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const imageRef = useRef(null);
    const magnifierRef = useRef(null);
    const containerRef = useRef(null);

    // Mobile detection with proper cleanup
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    // Reset states when src changes
    useEffect(() => {
        setMagnifierVisible(false);
        setIsImageLoaded(false);
        setMagnifierPosition({ x: 0, y: 0 });
        setImagePosition({ x: 0, y: 0 });
    }, [src]);

    const handleMouseMove = useCallback((e) => {
        if (!imageRef.current || isMobile || !isImageLoaded) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Ensure coordinates are within bounds
        if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
            return;
        }

        // Calculate magnifier position
        const magnifierWidth = 300;
        const magnifierHeight = 300;

        // Position magnifier to the right of the image
        let magnifierX = rect.right + 20;
        let magnifierY = rect.top + y - magnifierHeight / 2;

        // Adjust position if it goes out of viewport
        if (magnifierX + magnifierWidth > window.innerWidth) {
            magnifierX = rect.left - magnifierWidth - 20;
        }

        if (magnifierY < 0) {
            magnifierY = 0;
        }

        if (magnifierY + magnifierHeight > window.innerHeight) {
            magnifierY = window.innerHeight - magnifierHeight;
        }

        // Calculate the position on the zoomed image
        const imageX = (x / rect.width) * 100;
        const imageY = (y / rect.height) * 100;

        setMagnifierPosition({ x: magnifierX, y: magnifierY });
        setImagePosition({ x: imageX, y: imageY });
    }, [isMobile, isImageLoaded]);

    const handleMouseEnter = useCallback(() => {
        if (!isMobile && isImageLoaded) {
            setMagnifierVisible(true);
        }
    }, [isMobile, isImageLoaded]);

    const handleMouseLeave = useCallback(() => {
        setMagnifierVisible(false);
    }, []);

    const handleImageLoad = useCallback(() => {
        setIsImageLoaded(true);
        if (onLoad) onLoad();
    }, [onLoad]);

    // Check if image is already loaded (cached) on mount or src change
    useEffect(() => {
        if (imageRef.current && imageRef.current.complete && imageRef.current.naturalWidth > 0) {
            setIsImageLoaded(true);
            if (onLoad) onLoad();
        }
    }, [src, onLoad]);

    const handleImageError = useCallback((e) => {
        setIsImageLoaded(false);
        setMagnifierVisible(false);
        if (onError) onError(e);
    }, [onError]);

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img
                ref={imageRef}
                src={src}
                alt={alt}
                onLoad={handleImageLoad}
                onError={handleImageError}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    cursor: isMobile ? 'default' : 'zoom-in',
                    touchAction: 'auto'
                }}
            />

            {/* Magnifier - desktop only */}
            {!isMobile && magnifierVisible && isImageLoaded && (
                <div
                    ref={magnifierRef}
                    style={{
                        position: 'fixed',
                        left: `${magnifierPosition.x}px`,
                        top: `${magnifierPosition.y}px`,
                        width: '300px',
                        height: '300px',
                        border: '2px solid #6366f1',
                        borderRadius: '12px',
                        background: 'white',
                        backgroundImage: `url(${src})`,
                        backgroundSize: '200% 200%',
                        backgroundPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                        backgroundRepeat: 'no-repeat',
                        zIndex: 9999,
                        pointerEvents: 'none',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        overflow: 'hidden'
                    }}
                />
            )}

            {/* Lens overlay - only show on desktop */}
            {magnifierVisible && !isMobile && imageRef.current && isImageLoaded && (
                <div
                    style={{
                        position: 'absolute',
                        left: `${Math.max(0, Math.min((imagePosition.x / 100) * imageRef.current.offsetWidth - 50, imageRef.current.offsetWidth - 100))}px`,
                        top: `${Math.max(0, Math.min((imagePosition.y / 100) * imageRef.current.offsetHeight - 50, imageRef.current.offsetHeight - 100))}px`,
                        width: '100px',
                        height: '100px',
                        border: '2px solid #6366f1',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        pointerEvents: 'none',
                        zIndex: 10
                    }}
                />
            )}

            {/* Hint text */}
            {!isMobile && !magnifierVisible && isImageLoaded && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        pointerEvents: 'none',
                        zIndex: 5
                    }}
                >
                    Hover to zoom
                </div>
            )}
        </div>
    );
};

// Custom styles for image magnify with improved zoom positioning
const magnifyStyles = `
  .react-product-details__images-slider {
    display: flex;
    gap: 12px;
    flex-wrap: nowrap;
    justify-content: flex-start;
    margin-top: 20px;
    max-height: 140px;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 10px 0;
  }
  
  .react-product-details__images-slider::-webkit-scrollbar {
    height: 4px;
  }
  
  .react-product-details__images-slider::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  .react-product-details__images-slider::-webkit-scrollbar-thumb {
    background: #6366f1;
    border-radius: 4px;
  }
  
  .react-product-details__images-slider::-webkit-scrollbar-thumb:hover {
    background: #4f46e5;
  }
  
  .react-product-details__images-slider > div {
    flex: 0 0 auto;
  }
  
  /* Mobile specific styles */
  @media (max-width: 768px) {
    .react-product-details__images-slider {
      gap: 8px;
      max-height: 80px;
      padding: 8px 0;
    }
    
    .react-product-details__images-slider > div .max-w-120 {
      min-height: 60px !important;
      min-width: 60px !important;
      max-width: 60px !important;
      max-height: 60px !important;
      padding: 4px !important;
    }
  }
  
  .react-magnify-container {
    position: relative;
    overflow: visible !important;
    background: #fafafa;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
  }
  
  .react-magnify-container img {
    transition: opacity 0.3s ease;
    border-radius: 16px;
  }
  
  .react-magnify-container img[src=""], 
  .react-magnify-container img:not([src]) {
    opacity: 0;
  }
  
  .cursor-pointer {
    cursor: pointer;
  }
  
  .transition-all {
    transition: all 0.3s ease;
  }
  
  .border-main-600 {
    border-color: #6366f1 !important;
  }
  
  .border-main-400 {
    border-color: #a5b4fc !important;
  }
  
  .shadow-sm {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  
  /* Loading state */
  .image-loading {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  /* Mobile responsive styles */
  @media (max-width: 768px) {
    .react-magnify-container {
      min-height: 300px !important;
    }
    
    .react-product-details__images-slider {
      justify-content: center;
    }
  }
  
  /* Prevent jQuery slick from interfering */
  .react-magnify-container.slick-slider,
  .react-product-details__images-slider.slick-slider {
    display: flex !important;
  }
  
  .react-magnify-container .slick-track,
  .react-product-details__images-slider .slick-track {
    display: contents !important;
  }
`;

function ProductImages({ product, selectedImage: externalSelectedImage }) {
    const { image_path } = useApi();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [isComponentMounted, setIsComponentMounted] = useState(true);
    const isMountedRef = useRef(true);
    const componentRef = useRef(null);
    const currentImageSrcRef = useRef(null);

    // Product images array - handles both API images and fallback images
    const productImages = useMemo(() => {
        try {
            if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
                return product.images.map(img => {
                    // If the image is a full URL, use it directly
                    if (typeof img === 'string' && img.startsWith('http')) return img;
                    // If it's a relative path, prepend the image_path
                    return image_path && typeof img === 'string' ? `${image_path}products-images/${img}` : img;
                });
            }
            // Fallback images when product images are not available
            return [
                "/images/thumbs/product-details-two-thumb1.png",
                "/images/thumbs/product-details-two-thumb2.png",
                "/images/thumbs/product-details-two-thumb3.png",
                "/images/thumbs/product-img3.png",
                "/images/thumbs/product-img7.png"
            ];
        } catch (error) {
            console.error('Error processing product images:', error);
            return ["/images/default/imageno.png"];
        }
    }, [product?.images, image_path, product?.id]);

    // Component mounting/unmounting management
    useEffect(() => {
        setIsComponentMounted(true);
        isMountedRef.current = true;

        // Prevent jQuery slick from interfering with this component
        const preventJQuerySlick = () => {
            if (window.$ && componentRef.current) {
                // Find any slick-initialized elements within this component and destroy them
                const slickElements = window.$(componentRef.current).find('.slick-initialized');
                if (slickElements.length > 0) {
                    try {
                        slickElements.slick('unslick');
                        console.log('Destroyed jQuery slick instances in React component');
                    } catch (e) {
                        console.log('Note: jQuery slick cleanup attempted');
                    }
                }
            }
        };

        // Run immediately and after a small delay to catch any delayed jQuery initialization
        preventJQuerySlick();
        const timeout = setTimeout(preventJQuerySlick, 100);

        return () => {
            clearTimeout(timeout);
            setIsComponentMounted(false);
            isMountedRef.current = false;
        };
    }, []);

    // Reset selected image when product changes
    useEffect(() => {
        if (isMountedRef.current) {
            setSelectedImageIndex(0);
            setImageLoading(true);
            setImageError(false);
        }
    }, [product?.id]);

    // Sync with externally selected image (from Redux option selection)
    useEffect(() => {
        if (externalSelectedImage && productImages.length > 0 && isMountedRef.current) {
            // Find the index of the externally selected image
            const fullImagePath = image_path ? `${image_path}products-images/${externalSelectedImage}` : externalSelectedImage;
            const index = productImages.findIndex(img =>
                img === fullImagePath ||
                img.endsWith(externalSelectedImage) ||
                img.includes(externalSelectedImage)
            );
            if (index !== -1 && index !== selectedImageIndex) {
                setImageLoading(true);
                setSelectedImageIndex(index);
            }
        }
    }, [externalSelectedImage, productImages, image_path]);

    // Reset loading state only when image source actually changes
    useEffect(() => {
        const newSrc = productImages[selectedImageIndex];
        if (isMountedRef.current && newSrc !== currentImageSrcRef.current) {
            currentImageSrcRef.current = newSrc;
            setImageLoading(true);
            setImageError(false);

            // Check if image is already cached/complete
            if (newSrc) {
                const img = new Image();
                img.src = newSrc;
                if (img.complete) {
                    // Image is already cached, hide loader immediately
                    setImageLoading(false);
                }
            }
        }
    }, [selectedImageIndex, productImages]);

    const handleThumbnailClick = useCallback((index) => {
        if (index !== selectedImageIndex && isMountedRef.current && isComponentMounted) {
            setImageLoading(true);
            setSelectedImageIndex(index);
        }
    }, [selectedImageIndex, isComponentMounted]);

    const handleMainImageError = useCallback((e) => {
        console.log('Main image failed to load:', e.target.src);
        if (isMountedRef.current && isComponentMounted) {
            e.target.src = "/images/default/imageno.png";
            setImageError(true);
            setImageLoading(false);
        }
    }, [isComponentMounted]);

    const handleMainImageLoad = useCallback(() => {
        if (isMountedRef.current && isComponentMounted) {
            setImageLoading(false);
            setImageError(false);
        }
    }, [isComponentMounted]);

    const handleThumbnailError = useCallback((e) => {
        console.log('Thumbnail failed to load:', e.target.src);
        if (isMountedRef.current && isComponentMounted) {
            e.target.src = "/images/default/imageno.png";
        }
    }, [isComponentMounted]);

    const handleKeyDown = useCallback((e, index) => {
        if ((e.key === 'Enter' || e.key === ' ') && isComponentMounted) {
            e.preventDefault();
            if (index !== selectedImageIndex && isMountedRef.current) {
                setImageLoading(true);
                setSelectedImageIndex(index);
            }
        }
    }, [selectedImageIndex, isComponentMounted]);

    const handleNextImage = useCallback(() => {
        if (!isComponentMounted) return;
        const nextIndex = (selectedImageIndex + 1) % productImages.length;
        if (nextIndex !== selectedImageIndex && isMountedRef.current) {
            setImageLoading(true);
            setSelectedImageIndex(nextIndex);
        }
    }, [selectedImageIndex, productImages.length, isComponentMounted]);

    const handlePrevImage = useCallback(() => {
        if (!isComponentMounted) return;
        const prevIndex = (selectedImageIndex - 1 + productImages.length) % productImages.length;
        if (prevIndex !== selectedImageIndex && isMountedRef.current) {
            setImageLoading(true);
            setSelectedImageIndex(prevIndex);
        }
    }, [selectedImageIndex, productImages.length, isComponentMounted]);

    // Early return if product is not available (after all hooks)
    if (!product) {
        return (
            <>
                <style>{magnifyStyles}</style>
                <div className="product-details__left">
                    <div className="react-magnify-container border border-gray-100 rounded-16" style={{ padding: '20px', minHeight: '400px', position: 'relative' }} data-react-component="true">
                        <div className="d-flex align-items-center justify-content-center h-100">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <style>{magnifyStyles}</style>
            <div ref={componentRef} className="product-details__left">
                <div className="react-magnify-container border border-gray-100 rounded-16" style={{ padding: '20px', minHeight: '400px', position: 'relative' }} data-react-component="true">
                    {/* Navigation Arrows */}
                    {productImages.length > 1 && isComponentMounted && (
                        <>
                            <button
                                onClick={handlePrevImage}
                                className="position-absolute start-0 top-50 translate-middle-y bg-white border-0 rounded-circle shadow"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    zIndex: 10,
                                    left: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                aria-label="Previous image"
                                disabled={imageLoading}
                            >
                                <i className="ph ph-caret-left text-xl"></i>
                            </button>
                            <button
                                onClick={handleNextImage}
                                className="position-absolute end-0 top-50 translate-middle-y bg-white border-0 rounded-circle shadow"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    zIndex: 10,
                                    right: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                aria-label="Next image"
                                disabled={imageLoading}
                            >
                                <i className="ph ph-caret-right text-xl"></i>
                            </button>
                        </>
                    )}

                    {/* Image counter */}
                    <div
                        className="position-absolute bottom-0 end-0 bg-dark text-white px-2 py-1 rounded"
                        style={{
                            fontSize: '12px',
                            margin: '10px',
                            zIndex: 10
                        }}
                    >
                        {selectedImageIndex + 1} / {productImages.length}
                    </div>

                    {/* Loading overlay */}
                    {imageLoading && (
                        <div
                            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light bg-opacity-75"
                            style={{ zIndex: 5 }}
                        >
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}

                    {/* Custom Image Magnifier */}
                    {productImages[selectedImageIndex] && !imageError && isComponentMounted && (
                        <ImageMagnifier
                            src={productImages[selectedImageIndex]}
                            alt={product?.name || 'Product Image'}
                            onLoad={handleMainImageLoad}
                            onError={handleMainImageError}
                        />
                    )}

                    {/* Fallback image when there's an error */}
                    {imageError && isComponentMounted && (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img
                                src="/images/default/imageno.png"
                                alt="Product image not available"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain'
                                }}
                                onLoad={handleMainImageLoad}
                                onError={(e) => {
                                    console.error('Fallback image also failed to load');
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Thumbnail Images */}
                <div className="mt-24">
                    <div className="react-product-details__images-slider" data-react-component="true">
                        {productImages.map((image, index) => (
                            <div
                                key={`${product?.id || 'default'}-${index}`}
                                onClick={() => handleThumbnailClick(index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                tabIndex={0}
                                role="button"
                                aria-label={`View image ${index + 1} of ${productImages.length}`}
                            >
                                <div
                                    className={`max-w-120 max-h-120 h-100 flex-center border rounded-16 p-8 cursor-pointer transition-all ${selectedImageIndex === index
                                        ? 'border-main-600 border-2 shadow-sm'
                                        : 'border-gray-100 hover:border-main-400'
                                        }`}
                                    style={{
                                        cursor: 'pointer',
                                        minHeight: '120px',
                                        minWidth: '120px'
                                    }}
                                >
                                    <img
                                        src={image}
                                        alt={`${product?.name || 'Product'} thumbnail ${index + 1}`}
                                        onError={handleThumbnailError}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                        loading="lazy"
                                    />
                                    {selectedImageIndex === index && (
                                        <div
                                            className="position-absolute visually-hidden top-50 start-50 translate-middle bg-main-600 text-white rounded-circle"
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                fontSize: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <i className="ph ph-check"></i>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

// Wrapper component with error boundary
const ProductImagesWithErrorBoundary = (props) => {
    return (
        <ErrorBoundary>
            <ProductImages {...props} />
        </ErrorBoundary>
    );
};

export default ProductImagesWithErrorBoundary;