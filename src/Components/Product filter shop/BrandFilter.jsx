import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import useApi from '../../hooks/useApi';
import FilterModal from './FilterModal';
import { setFilter, selectFilters } from '../../store/slices/productSearchSlice';

function BrandFilter() {
    const {
        brands,
        brandsLoading,
        brandsError,
        fetchBrands,
    } = useApi();

    const dispatch = useDispatch();
    const filters = useSelector(selectFilters);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [showBrandModal, setShowBrandModal] = useState(false);
    const BRAND_LIMIT = 6;

    // Fetch brands on component mount
    useEffect(() => {
        if (!brands || brands.length === 0) {
            fetchBrands();
        }
    }, [fetchBrands, brands]);

    // Sync local state with Redux state
    useEffect(() => {
        if (filters.brand_id) {
            setSelectedBrand(filters.brand_id);
        }
    }, [filters.brand_id]);

    const handleBrandClick = (brand, e) => {
        e.preventDefault();

        // Handle both object and ID for backwards compatibility
        const brandId = typeof brand === 'object' ? brand.id : brand;
        const brandName = typeof brand === 'object' ? brand.name : brand;

        setSelectedBrand(brandId);
        // Update Redux filter with brand name
        dispatch(setFilter({ brand_id: brandName }));
        // Close modal if open
        setShowBrandModal(false);
    };

    const handleShowMoreBrands = (e) => {
        e.preventDefault();
        setShowBrandModal(true);
    };

    // console.log("Brands data:", brands, brandsLoading, brandsError);
    return (
        <>
            {brandsLoading && <div className="loading-text">Loading brands...</div>}
            {brands && brands.length > 0 && (
                <>
                    {brands.slice(0, BRAND_LIMIT).map((brand) => (
                        <li className="mb-24" key={brand.id}>
                            <a
                                href="#"
                                className={`brand-link text-gray-900 hover-text-main-600 d-block ${selectedBrand === brand.id ? 'fw-medium text-main-600' : ''}`}
                                onClick={(e) => handleBrandClick(brand, e)}
                            >
                                {brand.name}
                                {selectedBrand === brand.id && (
                                    <i className="ph ph-check ms-2"></i>
                                )}
                            </a>
                        </li>
                    ))}
                    {brands.length > BRAND_LIMIT && (
                        <li className="mt-2">
                            <a
                                href="#"
                                className="more-link"
                                onClick={handleShowMoreBrands}
                            >
                                +{brands.length - BRAND_LIMIT} more brands
                                <i className="ph ph-arrow-right"></i>
                            </a>
                        </li>
                    )}
                </>
            )}

            {/* Brand Modal */}
            <FilterModal
                isOpen={showBrandModal}
                onClose={() => setShowBrandModal(false)}
                title="All Brands"
                items={brands || []}
                onItemClick={handleBrandClick}
                selectedId={selectedBrand}
            />
        </>
    )
}

export default BrandFilter