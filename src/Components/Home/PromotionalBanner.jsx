import React, { useState, useEffect } from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useDispatch, useSelector } from 'react-redux'
import { getSlider, selectApiLoading, selectApiError, selectApiResponse } from '../../store/slices/bannerSlice'

function PromotionalBanner() {
    const dispatch = useDispatch()
    const sectionData = useSelector(selectApiResponse('section1'))
    const sectionLoading = useSelector(selectApiLoading('section1'))
    const sectionError = useSelector(selectApiError('section1'))
    const [imagesLoaded, setImagesLoaded] = useState({})
    const [allImagesLoaded, setAllImagesLoaded] = useState(false)

    useEffect(() => {
        dispatch(getSlider('section1'))
    }, [dispatch])

    // Parse API data to promotional format
    const getPromoData = () => {
        if (!sectionData?.data || sectionData.data.length === 0) return []

        const banner = sectionData.data[0]
        const titles = banner.Title ? banner.Title.split(',') : []
        const subtitles = banner.sub_title ? banner.sub_title.split(',') : []
        const buttonNames = banner.button_name ? banner.button_name.split(',') : []
        const links = banner.link ? banner.link.split(',') : []
        let images = [...(banner.images || [])]
        if (images.length >= 2) {
            [images[0], images[1]] = [images[1], images[0]]
        }

        return images.map((img, index) => {
            const titleParts = titles[index] ? titles[index].trim().split(' ') : ['', '']
            return {
                id: `${banner.id}-${index}`,
                image: `${banner.path}${img}`,
                title: titleParts[0] || '',
                highlight: titleParts.slice(1).join(' ') || '',
                subtitle: subtitles[index] ? subtitles[index].trim() : '',
                buttonText: buttonNames[index] ? buttonNames[index].trim() : 'Explore Now',
                link: links[index] ? links[index].trim() : '/shop',
                status: banner.status
            }
        }).filter(item => banner.status === 'active')
    }

    const promoData = getPromoData()

    // Handle image loading
    const handleImageLoad = (imageId) => {
        setImagesLoaded(prev => ({
            ...prev,
            [imageId]: true
        }));
    };

    // Preload images
    useEffect(() => {
        if (promoData.length === 0) return

        const preloadImages = () => {
            promoData.forEach(item => {
                const img = new Image();
                img.onload = () => handleImageLoad(item.id);
                img.onerror = () => handleImageLoad(item.id);
                img.src = item.image;
            });
        };

        preloadImages();
    }, [promoData.length]);

    // Check if all images are loaded
    useEffect(() => {
        const loadedCount = Object.keys(imagesLoaded).length;
        setAllImagesLoaded(loadedCount === promoData.length && Object.values(imagesLoaded).every(Boolean));
    }, [imagesLoaded, promoData.length]);

    // Show loading skeleton while fetching or loading images
    if (sectionLoading || (promoData.length > 0 && !allImagesLoaded)) {
        return (
            <section className="promo-three pb-5 mb-5 wow overflow-hidden">
                <div className="container container-lg">
                    <div className="row gy-4">
                        {[1, 2].map((item) => (
                            <div key={item} className="col-sm-6 px-20">
                                <SkeletonTheme baseColor="#f3f3f3" highlightColor="#e0e0e0">
                                    <div className="promo-three-item rounded-16 overflow-hidden" style={{ minHeight: '300px', position: 'relative' }}>
                                        <Skeleton height={300} borderRadius={16} />
                                        <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 2 }}>
                                            <Skeleton width={200} height={20} style={{ marginBottom: '10px' }} />
                                            <Skeleton width={150} height={35} style={{ marginBottom: '20px' }} />
                                            <Skeleton width={120} height={40} borderRadius={20} />
                                        </div>
                                    </div>
                                </SkeletonTheme>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    // Handle error or no data
    if (sectionError || promoData.length === 0) {
        return null
    }

    return (
        <section className="promo-three pb-5 mb-5 wow  overflow-hidden">
            <div className="container container-lg">
                <div className="row gy-4">
                    {promoData.map((item) => (
                        <div
                            key={item.id}
                            className="col-sm-6 px-20"
                        >
                            <div
                                className="promo-three-item bg-img rounded-16 overflow-hidden "
                                data-background-image={item.image}
                                style={{
                                    backgroundImage: `url(${item.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    minHeight: '300px'
                                }}
                            >
                                <div className="text-start">
                                    <span className="text-white mb-24">{item.subtitle}</span>
                                    <h2 className="text-white fw-medium mb-0 max-w-375">
                                        {item.title}{" "}
                                        <span
                                            className="fw-normal text-white font-heading-four wow bounceInDown"
                                            data-wow-duration="1s"
                                            data-wow-delay={item.delay}
                                        >
                                            {item.highlight}
                                        </span>
                                    </h2>
                                    <a
                                        href={item.link}
                                        className="btn btn-outline-white d-inline-flex align-items-center rounded-pill gap-8 mt-48"
                                    >
                                        {item.buttonText}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default PromotionalBanner