import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';

import './swapBannerStyle.css';

// import required modules
import { EffectCards } from 'swiper/modules';
import { getSlider, selectApiResponse, selectApiLoading, selectApiError } from '../../store/slices/bannerSlice';

export default function SwapBanner() {
    const dispatch = useDispatch();
    const banners = useSelector(selectApiResponse('swaper'));
    const loading = useSelector(selectApiLoading('swaper'));
    const error = useSelector(selectApiError('swaper'));

    useEffect(() => {
        dispatch(getSlider('swaper'));
    }, [dispatch]);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">Failed to load banners</div>;
    }

    const bannerData = banners?.data || [];

    return (
        <>
            <Swiper
                effect={'cards'}
                grabCursor={true}
                modules={[EffectCards]}
                className="mySwiper"
            >
                {bannerData.map((banner) =>
                    banner.images?.map((img, imgIndex) => (
                        <SwiperSlide key={`${banner.id}-${imgIndex}`}>
                            <img src={`${banner.path}${img}`} alt={banner.Title || ''} />
                        </SwiperSlide>
                    ))
                )}
            </Swiper>
        </>
    );
}
