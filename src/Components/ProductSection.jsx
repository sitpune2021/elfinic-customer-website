import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useApi } from '../hooks/useApi';
import { selectSectionProducts, selectSectionLoading, selectSectionError } from '../store/slices/productsSlice';
import Product from './Product';
import Heading from './Home/Heading';

/**
 * ProductSection Component
 * Displays products dynamically based on section type
 * 
 * @param {Object} props
 * @param {string} props.section - Section type: 'trending', 'featured', 'best_seller', 'discounted', 'recommended'
 * @param {string} props.title - Section title to display
 * @param {string} props.subtitle - Section subtitle
 * @param {string} props.alignment - Heading alignment: 'center', 'between', 'left'
 * @param {boolean} props.showViewAll - Whether to show "View All" link
 * @param {string} props.viewAllLink - Link for "View All" button
 * @param {string} props.viewAllText - Text for "View All" button
 * @param {number} props.limit - Number of products to display (default: 6)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.gridClass - Grid column classes (default: 'col-xxl-2 col-xl-2 col-sm-6 col-6 mb-24')
 */
const ProductSection = ({
    section = 'trending',
    title = 'Products',
    subtitle = '',
    alignment = 'between',
    showViewAll = true,
    viewAllLink = '/shop',
    viewAllText = 'View All Products',
    limit = 6,
    className = '',
    gridClass = 'col-xxl-2 col-xl-2 col-sm-6 col-6 mb-24',
}) => {
    const { fetchProductsBySection } = useApi();

    // Get section-specific data from Redux store
    const products = useSelector((state) => selectSectionProducts(state, section));
    const loading = useSelector((state) => selectSectionLoading(state, section));
    const error = useSelector((state) => selectSectionError(state, section));

    useEffect(() => {
        // Fetch products for this section if not already loaded
        if (!products || products.length === 0) {
            fetchProductsBySection({ show_section: section });
        }
    }, [section, fetchProductsBySection]);

    // Display limited number of products
    const displayProducts = products.slice(0, limit);
    // console.log(`Rendering ${section}`, displayProducts);

    return (
        <section className={`popular-products-three overflow-hidden my-20 ${className}`}>
            <div className="container container-lg">
                <Heading
                    title={title}
                    subtitle={subtitle}
                    alignment={alignment}
                    showViewAll={showViewAll}
                    viewAllText={viewAllText}
                    viewAllLink={viewAllLink}
                />

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading {section} products...</p>
                    </div>
                ) : displayProducts.length > 0 ? (
                    <div className="row g-12">
                        {displayProducts.map((product) => (
                            <div className={gridClass} key={product.id}>
                                <Product product={product} />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="alert alert-warning" role="alert">
                        <strong>Offline:</strong> Could not load {section} products. Please check your connection.
                    </div>
                ) : (
                    <div className="alert alert-info" role="alert">
                        No {section} products available.

                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductSection;
