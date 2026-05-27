import React from 'react'
import { useSelector } from 'react-redux';
import {
    selectProducts,
    selectProductsLoading,
    selectProductsError
} from '../../store/slices/productSearchSlice';
import ProductSection from '../ProductSection';
import Product from '../Product';

function ShopProducts({ productsData, loadingOverride, errorOverride, showRecommendations = true }) {
    const reduxProducts = useSelector(selectProducts);
    const isExternalMode = Array.isArray(productsData);

    const products = isExternalMode ? productsData : reduxProducts;
    const productsLoading = isExternalMode ? Boolean(loadingOverride) : useSelector(selectProductsLoading);
    const productsError = isExternalMode ? errorOverride : useSelector(selectProductsError);

    return (
        <>
            {productsLoading ? (
                <div className="shop-grid">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="shop-skeleton-card">
                            <div className="shop-skeleton-img"></div>
                            <div className="shop-skeleton-body">
                                <div className="shop-skeleton-line shop-skeleton-line--title"></div>
                                <div className="shop-skeleton-line shop-skeleton-line--rating"></div>
                                <div className="shop-skeleton-line shop-skeleton-line--price"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : productsError ? (
                <div className="text-center py-5">
                    <div className="alert alert-danger d-inline-flex align-items-center gap-2" role="alert">
                        <i className="ph ph-warning-circle"></i>
                        {productsError}
                    </div>
                </div>
            ) : !products || products.length === 0 ? (
                <>
                    <div className=' row'>
                        <div className="text-center py-5">
                            <div className="text-gray-400 mb-3">
                                <i className="ph ph-package" style={{ fontSize: '4rem' }}></i>
                            </div>
                            <h5 className="text-gray-600">No products found</h5>
                            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
                        </div>
                        {showRecommendations && (
                            <>
                                <ProductSection
                                    section="trending"
                                    title="Trending Products"
                                    subtitle="Editor's Choice"
                                    alignment="between"
                                    showViewAll={false}
                                    viewAllLink="/shop?show_section=featured"
                                    viewAllText="View All Products"
                                    limit={8}
                                    className="my-custom-class"
                                    gridClass="col-md-4 col-sm-4 col-lg-3 col-6"
                                />
                                <ProductSection
                                    section="featured"
                                    title="Featured Products"
                                    subtitle="Editor's Choice"
                                    alignment="between"
                                    showViewAll={false}
                                    viewAllLink="/shop?show_section=featured"
                                    viewAllText="View All Products"
                                    limit={8}
                                    className="my-custom-class"
                                    gridClass="col-md-4 col-sm-4 col-lg-3 col-6"
                                />
                            </>
                        )}
                    </div>
                </>
            ) : (
                <div className="shop-grid">
                    {products.map((product) => (
                        <Product key={product.id} product={product} />
                    ))}
                </div>
            )}
        </>
    )
}

export default ShopProducts