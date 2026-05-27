// Example: Using the Product Search Implementation

import React from 'react';
import { useProductSearch } from '../hooks/useProductSearch';

/**
 * Example component demonstrating how to use the product search system
 * This is a simplified example - refer to Shop.jsx for complete implementation
 */
function ProductSearchExample() {
    const {
        // State
        products,
        loading,
        error,
        filters,
        pagination,
        totalProducts,

        // Methods
        updateFilter,
        updatePriceRange,
        updateSearchQuery,
        updateSortBy,
        changePage,
        resetFilters,
        getShowingText,
        getPaginationRange
    } = useProductSearch();

    // Example: Search by name
    const handleSearch = (e) => {
        updateSearchQuery(e.target.value);
    };

    // Example: Filter by category
    const handleCategoryFilter = (categoryId) => {
        updateFilter({ category_id: categoryId });
    };

    // Example: Filter by brand
    const handleBrandFilter = (brandId) => {
        updateFilter({ brand_id: brandId });
    };

    // Example: Update price range
    const handlePriceChange = (minPrice, maxPrice) => {
        updatePriceRange([minPrice, maxPrice]);
    };

    // Example: Change sort option
    const handleSortChange = (sortOption) => {
        updateSortBy(sortOption);
    };

    // Example: Navigate to page
    const handlePageChange = (pageNumber) => {
        changePage(pageNumber);
    };

    // Example: Reset all filters
    const handleResetFilters = () => {
        resetFilters();
    };

    // Example: Multiple filters at once
    const handleMultipleFilters = () => {
        updateFilter({
            category_id: '123',
            brand_id: '456',
            price_min: 100,
            price_max: 5000
        });
    };

    return (
        <div className="product-search-example">
            <h2>Product Search Example</h2>

            {/* Search Input */}
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.name}
                    onChange={handleSearch}
                />
            </div>

            {/* Filters Section */}
            <div className="filters-section">
                {/* Category Filter Example */}
                <select onChange={(e) => handleCategoryFilter(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="1">Electronics</option>
                    <option value="2">Fashion</option>
                </select>

                {/* Brand Filter Example */}
                <select onChange={(e) => handleBrandFilter(e.target.value)}>
                    <option value="">All Brands</option>
                    <option value="1">Brand A</option>
                    <option value="2">Brand B</option>
                </select>

                {/* Sort Options */}
                <select onChange={(e) => handleSortChange(e.target.value)}>
                    <option value="popular">Popular</option>
                    <option value="latest">Latest</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                </select>

                {/* Reset Filters Button */}
                <button onClick={handleResetFilters}>
                    Reset Filters
                </button>
            </div>

            {/* Results Info */}
            <div className="results-info">
                <p>{getShowingText()}</p>
            </div>

            {/* Products Display */}
            <div className="products-section">
                {loading ? (
                    <div>Loading products...</div>
                ) : error ? (
                    <div>Error: {error}</div>
                ) : products.length === 0 ? (
                    <div>No products found</div>
                ) : (
                    <div className="products-grid">
                        {products.map((product) => (
                            <div key={product.id} className="product-card">
                                <h3>{product.name}</h3>
                                <p>Price: ₹{product.total_price || product.price}</p>
                                {/* Add more product details */}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.lastPage > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                    >
                        Previous
                    </button>

                    {getPaginationRange().map((page, index) => (
                        page === '...' ? (
                            <span key={`ellipsis-${index}`}>...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={pagination.currentPage === page ? 'active' : ''}
                            >
                                {page}
                            </button>
                        )
                    ))}

                    <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.lastPage}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Debug Info */}
            <div className="debug-info">
                <h4>Current Filters:</h4>
                <pre>{JSON.stringify(filters, null, 2)}</pre>

                <h4>Pagination Info:</h4>
                <pre>{JSON.stringify(pagination, null, 2)}</pre>
            </div>
        </div>
    );
}

export default ProductSearchExample;

// =============================================================================
// DIRECT REDUX USAGE EXAMPLE (Alternative to custom hook)
// =============================================================================

/*
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchProductsList,
    setFilter,
    setPage,
    setPriceRange,
    setSearchQuery,
    selectProducts,
    selectProductsLoading,
    selectFilters,
    selectPagination
} from '../store/slices/productSearchSlice';

function DirectReduxExample() {
    const dispatch = useDispatch();
    const products = useSelector(selectProducts);
    const loading = useSelector(selectProductsLoading);
    const filters = useSelector(selectFilters);
    const pagination = useSelector(selectPagination);

    // Fetch products when component mounts
    useEffect(() => {
        dispatch(fetchProductsList({
            page: 1,
            per_page: 12
        }));
    }, [dispatch]);

    // Update filter
    const handleCategoryChange = (categoryId) => {
        dispatch(setFilter({ category_id: categoryId }));
    };

    // Change page
    const handlePageChange = (page) => {
        dispatch(setPage(page));
    };

    // Search
    const handleSearch = (query) => {
        dispatch(setSearchQuery(query));
    };

    // Price range
    const handlePriceChange = (range) => {
        dispatch(setPriceRange(range));
    };

    return (
        // Your JSX
    );
}
*/

// =============================================================================
// API SERVICE USAGE EXAMPLE
// =============================================================================

/*
import { getProductsList, searchProducts } from '../services/productService';

async function fetchProductsManually() {
    try {
        const data = await getProductsList({
            category_id: '123',
            brand_id: '456',
            price_min: 100,
            price_max: 5000,
            page: 1,
            per_page: 12
        });
        
        console.log('Products:', data);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

async function searchProductsManually(keyword) {
    try {
        const data = await searchProducts(keyword, 1, 12);
        console.log('Search results:', data);
    } catch (error) {
        console.error('Error searching products:', error);
    }
}
*/
