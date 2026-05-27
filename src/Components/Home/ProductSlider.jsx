// ProductSlider.jsx
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import ProductCard from "./ProductCard"; // your card component
import "./ProductSlider.css";
import { getSlider, selectApiError, selectApiLoading, selectApiResponse } from "../../store/slices/bannerSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ProductSlider = ({
  skeletonCount = 6
}) => {
  const dispatch = useDispatch();
  const sliderData = useSelector(selectApiResponse('slider2'));

  const sliderLoading = useSelector(selectApiLoading('slider2'));
  const sliderError = useSelector(selectApiError('slider2'));

  useEffect(() => {
    // Dispatch an action to fetch slider data when the component mounts
    dispatch(getSlider('slider2'));
  }, [dispatch]);

  // Map API data to product format
  const products = sliderData?.data ? sliderData.data.map(banner => ({
    id: banner.id,
    name: banner.sub_title || "Product",
    discount: banner.title || "",
    link: banner.link || "/shop",
    src: `${banner.path}${banner.images[0]}`,
    status: banner.status
  })).filter(product => product.status === 'active') : [];

  console.log("Slider 2 Products:", products);

  // Use API loading state
  const isLoading = sliderLoading;

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="skeleton-product-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-text skeleton-title"></div>
        <div className="skeleton-text skeleton-subtitle"></div>
      </div>
    </div>
  );

  // Show loading skeleton
  if (isLoading) {
    return (
      <div style={{ width: "100%", margin: "auto", padding: "20px 0" }}>
        <div className="skeleton-slider">
          {[...Array(skeletonCount)].map((_, index) => (
            <div key={index} className="skeleton-slide">
              <SkeletonCard />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle error state
  if (sliderError) {
    return (
      <div style={{ width: "100%", margin: "auto", padding: "20px 0", textAlign: "center" }}>
        <p>Failed to load products. Please try again later.</p>
      </div>
    );
  }

  // Handle no products
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div style={{ width: "100%", margin: "auto", padding: "10px 0" }}>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={12}
        slidesPerView={6}
        navigation
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={products.length > 6}
        breakpoints={{
          0: { slidesPerView: 2, spaceBetween: 8 },
          360: { slidesPerView: 2, spaceBetween: 10 },
          480: { slidesPerView: 3, spaceBetween: 10 },
          640: { slidesPerView: 3, spaceBetween: 12 },
          768: { slidesPerView: 4, spaceBetween: 12 },
          1024: { slidesPerView: 5, spaceBetween: 14 },
          1280: { slidesPerView: 5, spaceBetween: 16 },
          1520: { slidesPerView: 6, spaceBetween: 16 },
        }}
        style={{ paddingBottom: "10px" }}
        className="product-slider-loaded"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <Link to={product.link || "/shop"}>
              <ProductCard
                name={product.name}
                discount={product.discount}
                src={product.src}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
