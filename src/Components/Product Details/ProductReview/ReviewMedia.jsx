import React, { useState } from 'react';
import './ReviewMedia.css';

function ReviewMedia({ images = [], videos = [] }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [currentMediaType, setCurrentMediaType] = useState('image'); // 'image' or 'video'

    const hasMedia = images.length > 0 || videos.length > 0;

    if (!hasMedia) return null;

    const openLightbox = (index, type) => {
        setCurrentMediaIndex(index);
        setCurrentMediaType(type);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const goToNext = () => {
        if (currentMediaType === 'image' && currentMediaIndex < images.length - 1) {
            setCurrentMediaIndex(currentMediaIndex + 1);
        } else if (currentMediaType === 'image' && videos.length > 0) {
            setCurrentMediaType('video');
            setCurrentMediaIndex(0);
        } else if (currentMediaType === 'video' && currentMediaIndex < videos.length - 1) {
            setCurrentMediaIndex(currentMediaIndex + 1);
        }
    };

    const goToPrevious = () => {
        if (currentMediaType === 'video' && currentMediaIndex > 0) {
            setCurrentMediaIndex(currentMediaIndex - 1);
        } else if (currentMediaType === 'video' && images.length > 0) {
            setCurrentMediaType('image');
            setCurrentMediaIndex(images.length - 1);
        } else if (currentMediaType === 'image' && currentMediaIndex > 0) {
            setCurrentMediaIndex(currentMediaIndex - 1);
        }
    };

    const getCurrentMedia = () => {
        if (currentMediaType === 'image') {
            return images[currentMediaIndex];
        } else {
            return videos[currentMediaIndex];
        }
    };

    const canGoNext = () => {
        if (currentMediaType === 'image') {
            return currentMediaIndex < images.length - 1 || videos.length > 0;
        } else {
            return currentMediaIndex < videos.length - 1;
        }
    };

    const canGoPrevious = () => {
        if (currentMediaType === 'image') {
            return currentMediaIndex > 0;
        } else {
            return currentMediaIndex > 0 || images.length > 0;
        }
    };

    return (
        <>
            <div className="review-media mt-3">
                {images.length > 0 && (
                    <div className="media-gallery">
                        {images.slice(0, 4).map((image, index) => (
                            <div 
                                key={`img-${index}`} 
                                className="media-item image-item"
                                onClick={() => openLightbox(index, 'image')}
                                role="button"
                                tabIndex={0}
                            >
                                <img src={image} alt={`Review image ${index + 1}`} />
                                {index === 3 && (images.length > 4 || videos.length > 0) && (
                                    <div className="media-overlay">
                                        <span>+{images.length - 4 + videos.length}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {videos.length > 0 && images.length < 4 && videos.slice(0, 4 - images.length).map((video, index) => (
                            <div 
                                key={`vid-${index}`} 
                                className="media-item video-item"
                                onClick={() => openLightbox(index, 'video')}
                                role="button"
                                tabIndex={0}
                            >
                                <video src={video} />
                                <div className="video-play-icon">
                                    <i className="ph-fill ph-play-circle"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {lightboxOpen && (
                <div className="media-lightbox" onClick={closeLightbox}>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
                            <i className="ph ph-x"></i>
                        </button>
                        
                        {canGoPrevious() && (
                            <button className="lightbox-nav lightbox-prev" onClick={goToPrevious} aria-label="Previous">
                                <i className="ph ph-caret-left"></i>
                            </button>
                        )}
                        
                        <div className="lightbox-media">
                            {currentMediaType === 'image' ? (
                                <img src={getCurrentMedia()} alt="Review" />
                            ) : (
                                <video src={getCurrentMedia()} controls autoPlay />
                            )}
                        </div>
                        
                        {canGoNext() && (
                            <button className="lightbox-nav lightbox-next" onClick={goToNext} aria-label="Next">
                                <i className="ph ph-caret-right"></i>
                            </button>
                        )}
                        
                        <div className="lightbox-counter">
                            {currentMediaType === 'image' ? (
                                <span>{currentMediaIndex + 1} / {images.length + videos.length}</span>
                            ) : (
                                <span>{images.length + currentMediaIndex + 1} / {images.length + videos.length}</span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ReviewMedia;
