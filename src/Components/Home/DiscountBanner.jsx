import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getSlider, selectApiLoading, selectApiResponse, selectApiError } from '../../store/slices/bannerSlice';

// Skeleton Loader Component
const DiscountBannerSkeleton = () => {
    return (
        <section className="discount-three overflow-hidden pt-40">
            <div className="container container-lg">
                <div className="row gy-4">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="col-xl-4 col-sm-6">
                            <div className="discount-three-item rounded-16 overflow-hidden" style={{ minHeight: '300px', backgroundColor: '#f0f0f0', animation: 'pulse 1.5s ease-in-out infinite' }}>
                                <div className="text-start p-4">
                                    <div style={{ width: '60%', height: '16px', backgroundColor: '#e0e0e0', borderRadius: '4px', marginBottom: '16px' }}></div>
                                    <div style={{ width: '80%', height: '24px', backgroundColor: '#e0e0e0', borderRadius: '4px', marginBottom: '32px' }}></div>
                                    <div style={{ width: '120px', height: '40px', backgroundColor: '#e0e0e0', borderRadius: '20px' }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
            `}</style>
        </section>
    );
};

function DiscountBanner() {
    const dispatch = useDispatch();
    const sliderType = 'section2';

    const loading = useSelector(selectApiLoading(sliderType));
    const apiResponse = useSelector(selectApiResponse(sliderType));
    const error = useSelector(selectApiError(sliderType));

    useEffect(() => {
        dispatch(getSlider(sliderType));
    }, [dispatch]);

    // Parse API data into component format
    const discountData = useMemo(() => {
        if (!apiResponse?.data || apiResponse.data.length === 0) {
            return [];
        }

        const bannerData = apiResponse.data[0];
        const subtitles = bannerData.sub_title?.split(',') || [];
        const titles = bannerData.Title?.split(',') || [];
        const buttonNames = bannerData.button_name?.split(',') || [];
        const links = bannerData.link?.split(',') || [];
        const images = bannerData.images || [];
        const imagePath = bannerData.path || '';

        // Create array of discount items
        const maxLength = Math.max(subtitles.length, titles.length, images.length);
        return Array.from({ length: maxLength }, (_, index) => ({
            id: index + 1,
            image: images[index] ? `${imagePath}${images[index]}` : '/images/thumbs/discount-three-img1.png',
            discount: subtitles[index]?.trim() || 'Special Offer',
            title: titles[index]?.trim() || 'Collection',
            buttonText: buttonNames[index]?.trim() || 'Shop Now',
            link: links[index]?.trim() || '/shop',
        }));
    }, [apiResponse]);

    // Show skeleton while loading
    if (loading) {
        return <DiscountBannerSkeleton />;
    }

    // Show error message if API fails
    if (error) {
        console.error('Failed to load discount banners:', error);
        return null;
    }

    // Don't render if no data
    if (discountData.length === 0) {
        return null;
    }
    console.log("Discount Banner Data:", discountData);

    return (
        <section className="discount-three overflow-hidden pt-40">
            <div className="container container-lg">
                <div className="row gy-4">
                    {discountData.map((item) => (
                        <div key={item.id} className="col-xl-4 col-sm-6" >
                            <div className="discount-three-item bg-img rounded-16 overflow-hidden"
                                data-background-image={item.image}
                                style={{
                                    backgroundImage: `url(${item.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}>
                                <div className="text-start">
                                    <span className="fw-medium text-neutral-600 mb-4 text-uppercase">{item.discount}</span>
                                    <h6 className="fw-semibold mb-0 max-w-375">{item.title}</h6>
                                    <a href={item.link} className="btn btn-black rounded-pill gap-8 mt-32 flex-align d-inline-flex"
                                        tabIndex={0}>
                                        {item.buttonText}
                                        <span className="text-xl d-flex"><i className="ph ph-shopping-cart-simple"></i></span>
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

export default DiscountBanner