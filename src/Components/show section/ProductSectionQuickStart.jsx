/**
 * QUICK START GUIDE - Dynamic Product Sections
 * =============================================
 * 
 * Simple examples to get started quickly
 */

import React from 'react';
import ProductSection from './ProductSection';

// ============================================
// BASIC USAGE - Just pass the section type!
// ============================================

export function TrendingExample() {
    return <ProductSection section="trending" title="Trending Products" />;
}

export function FeaturedExample() {
    return <ProductSection section="featured" title="Featured Products" />;
}

export function BestSellerExample() {
    return <ProductSection section="best_seller" title="Best Sellers" />;
}

export function DiscountedExample() {
    return <ProductSection section="discounted" title="Special Offers" />;
}

export function RecommendedExample() {
    return <ProductSection section="recommended" title="Recommended For You" />;
}

// ============================================
// MULTIPLE SECTIONS IN ONE PAGE
// ============================================

export function MultiSectionPage() {
    return (
        <div>
            {/* Trending Section */}
            <ProductSection
                section="trending"
                title="Trending Now"
                subtitle="Hot Picks"
            />

            {/* Featured Section */}
            <ProductSection
                section="featured"
                title="Featured Products"
                subtitle="Editor's Choice"
            />

            {/* Best Sellers */}
            <ProductSection
                section="best_seller"
                title="Best Sellers"
                subtitle="Most Popular"
            />

            {/* Special Offers */}
            <ProductSection
                section="discounted"
                title="Special Offers"
                subtitle="Limited Time Deals"
            />

            {/* Recommended */}
            <ProductSection
                section="recommended"
                title="Just For You"
                subtitle="Personalized Picks"
            />
        </div>
    );
}

// ============================================
// COMMON CONFIGURATIONS
// ============================================

// Show only 4 products
export function LimitedProducts() {
    return (
        <ProductSection
            section="trending"
            title="Top 4 Trending"
            limit={4}
        />
    );
}

// Center aligned heading, no "View All" button
export function CenteredNoViewAll() {
    return (
        <ProductSection
            section="featured"
            title="Featured Collection"
            alignment="center"
            showViewAll={false}
        />
    );
}

// Custom grid layout (3 columns on desktop)
export function CustomGrid() {
    return (
        <ProductSection
            section="best_seller"
            title="Best Sellers"
            gridClass="col-lg-4 col-md-6 col-12 mb-4"
            limit={9}
        />
    );
}

// With custom link and text
export function CustomViewAll() {
    return (
        <ProductSection
            section="discounted"
            title="Today's Deals"
            viewAllLink="/deals"
            viewAllText="See All Deals"
        />
    );
}

// ============================================
// ALL AVAILABLE PROPS
// ============================================

export function AllPropsExample() {
    return (
        <ProductSection
            section="trending"                    // Required: Section type
            title="Trending Products"            // Title to display
            subtitle="Hot Right Now"             // Subtitle (optional)
            alignment="between"                  // 'center' | 'between' | 'left'
            showViewAll={true}                   // Show "View All" link
            viewAllLink="/shop"                  // Link for "View All"
            viewAllText="View All Products"      // Text for "View All"
            limit={6}                            // Number of products to show
            className="my-custom-class"          // Additional CSS classes
            gridClass="col-md-4 col-sm-6 col-12" // Grid column classes
        />
    );
}

// ============================================
// SECTION TYPES REFERENCE
// ============================================

/**
 * Available section types:
 * 
 * - "trending"     → Trending products
 * - "featured"     → Featured products
 * - "best_seller"  → Best selling products
 * - "discounted"   → Discounted/sale products
 * - "recommended"  → Recommended products
 */

export default {
    TrendingExample,
    FeaturedExample,
    BestSellerExample,
    DiscountedExample,
    RecommendedExample,
    MultiSectionPage,
    LimitedProducts,
    CenteredNoViewAll,
    CustomGrid,
    CustomViewAll,
    AllPropsExample,
};
