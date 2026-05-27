import React from 'react'
import Product from './Product'
import { useApi } from '../hooks/useApi';
import { Link } from 'react-router-dom';
import Heading from './Home/Heading';

function TrendingProducts() {
    const { categories,
        categoriesLoading, products,
        productsLoading, image_path } = useApi();
    return (
        <section className="trending-products-three pt-40 overflow-hidden">
            <div className="container container-lg">
                {/* <div className="section-heading mb-24">
                    <div className="flex-between flex-wrap gap-8">
                        <h5 className="mb-0 text-uppercase">Trending Products</h5>
                        <Link to="/shop" className="btn-elifnic btn-sm text-decoration-underline">View All Products &gt;&gt;</Link>
                    </div>
                </div> */}
                {/* <Heading title={'Trending Products'} viewAllText={'View All Products'} viewAllLink={'/shop'}></Heading> */}
                <Heading
                    title="Trending Products"
                    subtitle="What's Hot"
                    viewAllText="Shop Trending"
                    viewAllLink="/shop"
                    animated={true}
                />
                <div className="row g-12">
                    {productsLoading ? (
                        <div className="text-center py-5">
                            <p>Loading products...</p>
                        </div>
                    ) : (
                        products && products.length > 0 ? (
                            products.slice(0, 6).map((product, i) => (
                                <div className="col-xxl-2 col-xl-2 col-sm-6 col-6 mb-24" key={i}>
                                    <Product product={product} />
                                </div>

                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <p>No products available</p>
                            </div>
                        )
                    )}
                </div>

            </div>
        </section >
    )
}

export default TrendingProducts