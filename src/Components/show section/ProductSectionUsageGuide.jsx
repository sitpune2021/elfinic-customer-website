/**
 * DYNAMIC PRODUCT SECTION API INTEGRATION GUIDE
 * ==============================================
 * 
 * This guide shows how to integrate the dynamic product list API anywhere in your application.
 * API Endpoint: https://admin.elfinic.com/api/getProductsList
 * Method: GET
 * Query Params: ?show_section=trending (or featured, best_seller, discounted, recommended)
 * 
 * Example API Calls:
 * GET https://admin.elfinic.com/api/getProductsList?show_section=trending
 * GET https://admin.elfinic.com/api/getProductsList?show_section=featured
 * GET https://admin.elfinic.com/api/getProductsList?show_section=best_seller
 */

// ============================================================================
// METHOD 1: Using the ProductSection Component (Recommended - Easiest)
// ============================================================================

import ProductSection from './Components/ProductSection';

function MyPage() {
    return (
        <>
            {/* Trending Products */}
            <ProductSection
                section="trending"
                title="Trending Now"
                subtitle="Hot Picks"
                alignment="between"
                showViewAll={true}
                viewAllLink="/shop"
                limit={6}
            />

            {/* Featured Products */}
            <ProductSection
                section="featured"
                title="Featured Products"
                subtitle="Editor's Choice"
                alignment="center"
                showViewAll={true}
                limit={8}
            />

            {/* Best Sellers */}
            <ProductSection
                section="best_seller"
                title="Best Sellers"
                subtitle="Most Popular"
                limit={4}
            />

            {/* Discounted Products */}
            <ProductSection
                section="discounted"
                title="Special Offers"
                subtitle="Limited Time Deals"
            />

            {/* Recommended Products */}
            <ProductSection
                section="recommended"
                title="Recommended For You"
            />
        </>
    );
}

// ============================================================================
// METHOD 2: Using useApi Hook (For Custom Implementation)
// ============================================================================

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useApi } from '../hooks/useApi';
import { selectSectionProducts, selectSectionLoading, selectSectionError } from '../store/slices/productsSlice';
import Product from './Product';

function CustomProductDisplay() {
    const { fetchProductsBySection } = useApi();

    // Get trending products
    const trendingProducts = useSelector((state) => selectSectionProducts(state, 'trending'));
    const trendingLoading = useSelector((state) => selectSectionLoading(state, 'trending'));
    const trendingError = useSelector((state) => selectSectionError(state, 'trending'));

    // Get featured products
    const featuredProducts = useSelector((state) => selectSectionProducts(state, 'featured'));
    const featuredLoading = useSelector((state) => selectSectionLoading(state, 'featured'));

    useEffect(() => {
        // Fetch trending products
        fetchProductsBySection({ show_section: 'trending' });

        // Fetch featured products
        fetchProductsBySection({ show_section: 'featured' });

        // Fetch best sellers
        fetchProductsBySection({ show_section: 'best_seller' });

        // Fetch discounted products
        fetchProductsBySection({ show_section: 'discounted' });

        // Fetch recommended products
        fetchProductsBySection({ show_section: 'recommended' });
    }, [fetchProductsBySection]);

    return (
        <div>
            {/* Display Trending Products */}
            <section>
                <h2>Trending Products</h2>
                {trendingLoading ? (
                    <p>Loading...</p>
                ) : trendingError ? (
                    <p>Error: {trendingError}</p>
                ) : (
                    <div className="row">
                        {trendingProducts.slice(0, 6).map((product) => (
                            <div key={product.id} className="col-md-4">
                                <Product product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Display Featured Products */}
            <section>
                <h2>Featured Products</h2>
                {featuredLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="row">
                        {featuredProducts.slice(0, 6).map((product) => (
                            <div key={product.id} className="col-md-4">
                                <Product product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

// ============================================================================
// METHOD 3: Direct API Call (Using productService)
// ============================================================================

import { getProductsList } from '../services/productService';
import { useState, useEffect } from 'react';

function DirectApiExample() {
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch trending products
                const response = await getProductsList({ show_section: 'trending' });
                setTrendingProducts(response.data || response);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            {trendingProducts.map(product => (
                <div key={product.id}>
                    <h3>{product.name}</h3>
                    <p>{product.price}</p>
                </div>
            ))}
        </div>
    );
}

// ============================================================================
// AVAILABLE SECTION TYPES
// ============================================================================

const SECTION_TYPES = {
    TRENDING: 'trending',        // Trending products
    FEATURED: 'featured',        // Featured products
    BEST_SELLER: 'best_seller',  // Best selling products
    DISCOUNTED: 'discounted',    // Discounted products
    RECOMMENDED: 'recommended',  // Recommended products
};

// ============================================================================
// PRODUCT SECTION COMPONENT PROPS
// ============================================================================

/**
 * @param {string} section - Section type: 'trending', 'featured', 'best_seller', 'discounted', 'recommended'
 * @param {string} title - Section title to display
 * @param {string} subtitle - Section subtitle (optional)
 * @param {string} alignment - Heading alignment: 'center', 'between', 'left' (default: 'between')
 * @param {boolean} showViewAll - Whether to show "View All" link (default: true)
 * @param {string} viewAllLink - Link for "View All" button (default: '/shop')
 * @param {string} viewAllText - Text for "View All" button (default: 'View All Products')
 * @param {number} limit - Number of products to display (default: 6)
 * @param {string} className - Additional CSS classes (optional)
 * @param {string} gridClass - Grid column classes (default: 'col-xxl-2 col-xl-2 col-sm-6 col-6 mb-24')
 */

// ============================================================================
// EXAMPLE USAGE IN DIFFERENT PAGES
// ============================================================================

// Example 1: Shop Page with Trending
function ShopPage() {
    return (
        <ProductSection
            section="trending"
            title="Trending Products"
            subtitle="What's Hot Right Now"
            limit={12}
        />
    );
}

// Example 2: Home Page with Multiple Sections
function HomePage() {
    return (
        <>
            <ProductSection section="featured" title="Featured Products" limit={8} />
            <ProductSection section="trending" title="Trending Now" limit={6} />
            <ProductSection section="best_seller" title="Best Sellers" limit={6} />
        </>
    );
}

// Example 3: Deals Page with Discounted Products
function DealsPage() {
    return (
        <ProductSection
            section="discounted"
            title="Today's Deals"
            subtitle="Save Big Today"
            alignment="center"
            showViewAll={false}
            limit={20}
        />
    );
}

// Example 4: Custom Grid Layout
function CustomGridPage() {
    return (
        <ProductSection
            section="recommended"
            title="Recommended For You"
            gridClass="col-lg-3 col-md-4 col-sm-6 col-12 mb-4"
            limit={8}
        />
    );
}

// ============================================================================
// REDUX STATE STRUCTURE
// ============================================================================

/**
 * The products slice stores section-based products separately:
 * 
 * state.products = {
 *     data: [],                    // All products from getAllProducts
 *     loading: false,
 *     error: null,
 *     selectedProduct: null,
 *     selectedProductLoading: false,
 *     selectedProductError: null,
 *     sectionProducts: {           // Section-based products
 *         trending: [...],
 *         featured: [...],
 *         best_seller: [...],
 *         discounted: [...],
 *         recommended: [...],
 *     },
 *     sectionLoading: {            // Loading state per section
 *         trending: false,
 *         featured: false,
 *         // ...
 *     },
 *     sectionError: {              // Error state per section
 *         trending: null,
 *         featured: null,
 *         // ...
 *     }
 * }
 */

// ============================================================================
// TIPS AND BEST PRACTICES
// ============================================================================

/**
 * 1. Use ProductSection component for quick integration
 * 2. Data is cached in Redux - no duplicate API calls
 * 3. Each section loads independently
 * 4. Use limit prop to control number of displayed products
 * 5. Customize grid layout with gridClass prop
 * 6. Add custom styling with className prop
 * 7. Section data persists across page navigation
 * 8. Use Redux DevTools to inspect section data
 */

export default {
    SECTION_TYPES,
    // Components
    CustomProductDisplay,
    DirectApiExample,
    ShopPage,
    HomePage,
    DealsPage,
    CustomGridPage,
};
