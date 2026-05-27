/**
 * REAL-WORLD USAGE EXAMPLES
 * ==========================
 * 
 * Practical examples showing how to use ProductSection in different scenarios
 */

import React from 'react';
import ProductSection from './ProductSection';

// ============================================================================
// Example 1: E-Commerce Homepage
// ============================================================================

export function EcommerceHomepage() {
    return (
        <div className="homepage">
            {/* Hero Section (your existing slider) */}

            {/* ... */}

            {/* Featured Products Section */}
            <ProductSection
                section="featured"
                title="Featured Products"
                subtitle="Editor's Choice"
                alignment="between"
                limit={8}
            />

            {/* Promotional Banner */}
            {/* ... */}

            {/* Trending Products */}
            <ProductSection
                section="trending"
                title="Trending Now"
                subtitle="What's Hot"
                alignment="between"
                limit={6}
            />

            {/* Best Sellers */}
            <ProductSection
                section="best_seller"
                title="Best Sellers"
                subtitle="Most Popular"
                alignment="between"
                limit={6}
            />

            {/* Special Offers */}
            <ProductSection
                section="discounted"
                title="Special Offers"
                subtitle="Save Big Today"
                alignment="center"
                limit={8}
                className="bg-light py-5"
            />

            {/* Recommended For You */}
            <ProductSection
                section="recommended"
                title="Recommended For You"
                subtitle="Personalized Picks"
                alignment="center"
                showViewAll={false}
                limit={6}
            />
        </div>
    );
}

// ============================================================================
// Example 2: Shop/Category Page
// ============================================================================

export function ShopPage() {
    return (
        <div className="shop-page">
            <h1>Shop All Products</h1>

            {/* Filter sidebar */}
            {/* ... */}

            {/* Trending in this category */}
            <ProductSection
                section="trending"
                title="Trending in Electronics"
                alignment="between"
                limit={12}
                gridClass="col-lg-3 col-md-4 col-sm-6 col-12 mb-4"
            />

            {/* Best sellers in this category */}
            <ProductSection
                section="best_seller"
                title="Best Sellers"
                alignment="between"
                limit={12}
                gridClass="col-lg-3 col-md-4 col-sm-6 col-12 mb-4"
            />
        </div>
    );
}

// ============================================================================
// Example 3: Deals/Offers Page
// ============================================================================

export function DealsPage() {
    return (
        <div className="deals-page">
            <div className="page-header text-center mb-5">
                <h1>Today's Best Deals</h1>
                <p>Save big on our discounted products</p>
            </div>

            {/* Show only discounted products */}
            <ProductSection
                section="discounted"
                title="Limited Time Offers"
                subtitle="Hurry! Deals ending soon"
                alignment="center"
                showViewAll={false}
                limit={20}
                gridClass="col-xl-3 col-lg-4 col-md-6 col-12 mb-4"
            />

            {/* Also show featured deals */}
            <ProductSection
                section="featured"
                title="Featured Deals"
                alignment="center"
                showViewAll={false}
                limit={12}
                gridClass="col-xl-3 col-lg-4 col-md-6 col-12 mb-4"
            />
        </div>
    );
}

// ============================================================================
// Example 4: Product Detail Page - Recommended Section
// ============================================================================

export function ProductDetailPage() {
    return (
        <div className="product-detail-page">
            {/* Product details */}
            {/* ... */}

            {/* You may also like */}
            <ProductSection
                section="recommended"
                title="You May Also Like"
                subtitle="Based on your interests"
                alignment="center"
                showViewAll={false}
                limit={4}
                className="mt-5"
            />

            {/* Trending similar products */}
            <ProductSection
                section="trending"
                title="Trending Similar Products"
                alignment="between"
                limit={6}
                className="mt-4"
            />
        </div>
    );
}

// ============================================================================
// Example 5: User Dashboard - Personalized Section
// ============================================================================

export function UserDashboard() {
    return (
        <div className="user-dashboard">
            <h1>Welcome back, User!</h1>

            {/* Recommended based on browsing history */}
            <ProductSection
                section="recommended"
                title="Recommended For You"
                subtitle="Based on your recent activity"
                alignment="between"
                limit={8}
                viewAllLink="/recommendations"
                viewAllText="View All Recommendations"
            />

            {/* Featured products they might like */}
            <ProductSection
                section="featured"
                title="Featured Picks"
                subtitle="Curated just for you"
                alignment="between"
                limit={6}
            />
        </div>
    );
}

// ============================================================================
// Example 6: Mobile App Style - Grid Layout
// ============================================================================

export function MobileStyleLayout() {
    return (
        <div className="mobile-layout">
            {/* 2 columns on mobile, 4 on tablet, 6 on desktop */}
            <ProductSection
                section="trending"
                title="Trending Now"
                alignment="center"
                limit={12}
                gridClass="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-6 mb-3"
            />

            <ProductSection
                section="featured"
                title="Featured"
                alignment="center"
                limit={12}
                gridClass="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-6 mb-3"
            />
        </div>
    );
}

// ============================================================================
// Example 7: Landing Page - Specific Categories
// ============================================================================

export function FashionLandingPage() {
    return (
        <div className="fashion-landing">
            <div className="hero-section">
                <h1>Fashion Collection 2024</h1>
            </div>

            {/* Trending in Fashion */}
            <ProductSection
                section="trending"
                title="Trending Fashion"
                subtitle="Latest Styles"
                alignment="center"
                limit={8}
                className="py-5"
            />

            {/* Featured Designer Collection */}
            <ProductSection
                section="featured"
                title="Designer Collection"
                subtitle="Exclusive Pieces"
                alignment="center"
                showViewAll={true}
                viewAllLink="/designer-collection"
                limit={6}
                className="bg-light py-5"
            />

            {/* Best Sellers in Fashion */}
            <ProductSection
                section="best_seller"
                title="Best Sellers"
                subtitle="Customer Favorites"
                alignment="center"
                limit={8}
                className="py-5"
            />
        </div>
    );
}

// ============================================================================
// Example 8: Sidebar Widget
// ============================================================================

export function SidebarWidget() {
    return (
        <aside className="sidebar">
            {/* Compact version with fewer products */}
            <ProductSection
                section="trending"
                title="Trending"
                alignment="left"
                showViewAll={true}
                viewAllText="View All"
                limit={3}
                gridClass="col-12 mb-3"
                className="sidebar-section"
            />

            <ProductSection
                section="best_seller"
                title="Best Sellers"
                alignment="left"
                showViewAll={true}
                viewAllText="View All"
                limit={3}
                gridClass="col-12 mb-3"
                className="sidebar-section mt-4"
            />
        </aside>
    );
}

// ============================================================================
// Example 9: Newsletter Popup - Featured Products
// ============================================================================

export function NewsletterPopup() {
    return (
        <div className="newsletter-popup">
            <h2>Subscribe to our Newsletter</h2>
            <p>Get 10% off on these featured products!</p>

            {/* Show 3 featured products in popup */}
            <ProductSection
                section="featured"
                title=""
                alignment="center"
                showViewAll={false}
                limit={3}
                gridClass="col-4 mb-2"
                className="popup-products"
            />

            {/* Newsletter form */}
            {/* ... */}
        </div>
    );
}

// ============================================================================
// Example 10: Seasonal Campaign Page
// ============================================================================

export function ChristmasCampaign() {
    return (
        <div className="christmas-campaign">
            <div className="campaign-header">
                <h1>🎄 Christmas Special Deals 🎄</h1>
            </div>

            {/* Special discounted products for Christmas */}
            <ProductSection
                section="discounted"
                title="Christmas Offers"
                subtitle="Up to 70% Off"
                alignment="center"
                limit={16}
                gridClass="col-xl-3 col-lg-4 col-md-6 col-12 mb-4"
                className="christmas-section"
            />

            {/* Featured gift ideas */}
            <ProductSection
                section="featured"
                title="Perfect Gift Ideas"
                subtitle="For your loved ones"
                alignment="center"
                limit={12}
                gridClass="col-xl-3 col-lg-4 col-md-6 col-12 mb-4"
                className="mt-5"
            />
        </div>
    );
}

// ============================================================================
// Example 11: Lazy Loading / Pagination Alternative
// ============================================================================

export function LazyLoadingExample() {
    return (
        <div className="lazy-loading-page">
            {/* Show 8 initially */}
            <ProductSection
                section="trending"
                title="All Trending Products"
                alignment="between"
                limit={8}
                gridClass="col-lg-3 col-md-4 col-sm-6 col-12 mb-4"
            />

            {/* Load more button or infinite scroll would go here */}
        </div>
    );
}

// ============================================================================
// Example 12: A/B Testing Different Sections
// ============================================================================

export function ABTestingExample() {
    // Randomly show different sections for testing
    const sections = ['trending', 'featured', 'best_seller'];
    const randomSection = sections[Math.floor(Math.random() * sections.length)];

    return (
        <ProductSection
            section={randomSection}
            title="Products You'll Love"
            alignment="center"
            limit={6}
        />
    );
}

// ============================================================================
// EXPORT ALL EXAMPLES
// ============================================================================

export default {
    EcommerceHomepage,
    ShopPage,
    DealsPage,
    ProductDetailPage,
    UserDashboard,
    MobileStyleLayout,
    FashionLandingPage,
    SidebarWidget,
    NewsletterPopup,
    ChristmasCampaign,
    LazyLoadingExample,
    ABTestingExample,
};
