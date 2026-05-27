import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWishlist, selectWishlistFullData, selectWishlistLoading, selectWishlistError } from '../../../store/slices/wishlistSlice';
import Heading from '../../Home/Heading';
import Product from '../../Product';
import { Link } from 'react-router-dom';

function WishlistSection() {
    const dispatch = useDispatch();
    const wishlistData = useSelector(selectWishlistFullData);
    const wishlistLoading = useSelector(selectWishlistLoading);
    const wishlistError = useSelector(selectWishlistError);
    const hasFetched = useRef(false);

    console.log("Wishlist data in WishlistSection:", wishlistData);


    useEffect(() => {
        // Only fetch if not already fetched and not currently loading
        if (!hasFetched.current && !wishlistLoading) {
            hasFetched.current = true;
            dispatch(fetchWishlist());
        }
    }, [dispatch, wishlistLoading]);

    // Reset hasFetched when component unmounts so it fetches fresh data next time
    useEffect(() => {
        return () => {
            hasFetched.current = false;
        };
    }, []);




    return (
        <section className="content-section active">
            <Heading
                title="My Wishlist"
                alignment="left"
                subtitle="Saved Items"
                showViewAll={false}
            />

            <div>
                <div className="row g-12">
                    {wishlistLoading ? (
                        <div className="d-flex justify-content-center align-items-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <span className="ms-3">Loading wishlist...</span>
                        </div>
                    ) : wishlistError ? (
                        <div className="alert alert-danger" role="alert">
                            <h6>Error loading wishlist</h6>
                            <p className="mb-2">{wishlistError}</p>
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => dispatch(fetchWishlist())}
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <>
                            {Array.isArray(wishlistData) && wishlistData.length > 0 ? (
                                wishlistData.map((item) => {
                                    // Extract the product data - wishlist item may have nested product or be the product itself
                                    const productData = item.product || item;
                                    const productId = item.product_id || productData.id || item.id;

                                    console.log("Rendering wishlist item:", { item, productData, productId });

                                    return (
                                        <div
                                            key={item.id || productId}
                                            className="col-xxl-3 col-xl-3 col-sm-6 col-md-4 col-6 mb-24"
                                        >
                                            <Product product={productData} />
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-5">
                                    <i className="ph ph-heart text-gray-300" style={{ fontSize: '4rem' }}></i>
                                    <h5 className="mt-3 text-gray-600">No items in your wishlist</h5>
                                    <p className="text-gray-500">Start adding products you love!</p>
                                    <Link to="/shop" className="mt-3">
                                        <small className="text-gray-500 bg-elifnic px-5 p-2 rounded-5 d-flex align-items-center gap-3">Continue Shopping <i className='ph ph-arrow-right'></i></small>
                                    </Link>

                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>



        </section >
    )
}

export default WishlistSection