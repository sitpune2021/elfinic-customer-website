import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import WriteReview from './WriteReview';
import ReviewFilters from './ReviewFilters';
import ReviewPagination from './ReviewPagination';
import ReviewMedia from './ReviewMedia';
import {
    checkReviewEligibility,
    selectReviewEligibilityLoading,
    selectProductEligibility,
    selectHasCheckedEligibility,
} from '../../../store/slices/reviewEligibilitySlice';
import { selectIsAuthenticated, selectUser } from '../../../store/slices/authSlice';
import {
    fetchProductReviews,
    selectProductReviews,
    selectReviewsLoading,
    selectReviewsError,
    selectRatingSummary,
    selectReviewsList,
    selectReviewsCurrentPage,
    selectReviewsFilters,
} from '../../../store/slices/productReviewsSlice';
import './ProductReview.css';

// Accept optional productId prop so it can be forwarded to WriteReview without causing a ReferenceError
function ProductReview({ productId }) {
    const dispatch = useDispatch();

    // Local state for filters
    const [currentSort, setCurrentSort] = useState('latest');
    const [currentRating, setCurrentRating] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    // Auth state
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);

    // Review eligibility state
    const eligibilityLoading = useSelector(selectReviewEligibilityLoading);
    const productEligibility = useSelector((state) => selectProductEligibility(state, productId));
    const hasCheckedEligibility = useSelector((state) => selectHasCheckedEligibility(state, productId));

    // Product reviews state
    const reviewsLoading = useSelector(selectReviewsLoading);
    const reviewsError = useSelector(selectReviewsError);
    const ratingSummary = useSelector((state) => selectRatingSummary(state, productId));
    const reviewsList = useSelector((state) => selectReviewsList(state, productId));
    const storedPage = useSelector((state) => selectReviewsCurrentPage(state, productId));
    const filters = useSelector((state) => selectReviewsFilters(state, productId));

    // Fetch reviews when component mounts or filters change
    useEffect(() => {
        if (productId) {
            dispatch(fetchProductReviews({
                productId,
                page: currentPage,
                limit,
                sort: currentSort,
                rating: currentRating
            }));
        }
    }, [dispatch, productId, currentPage, currentSort, currentRating]);

    // Check eligibility when component mounts or when user/productId changes
    useEffect(() => {
        // Only check eligibility if user is authenticated and we have a valid productId
        // Check if we haven't checked eligibility for THIS specific product yet
        if (isAuthenticated && user?.id && productId && !hasCheckedEligibility) {
            console.log(`Checking eligibility for product ${productId}, hasChecked: ${hasCheckedEligibility}`);
            dispatch(checkReviewEligibility({ userId: user.id, productId }));
        }
    }, [dispatch, isAuthenticated, user?.id, productId, hasCheckedEligibility]);

    // Handle filter changes
    const handleSortChange = (newSort) => {
        setCurrentSort(newSort);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const handleRatingChange = (newRating) => {
        setCurrentRating(newRating);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        // Scroll to top of reviews section
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Determine if we should show the WriteReview component
    const shouldShowWriteReview = isAuthenticated && productEligibility?.eligible === true;

    // Use API data if available, otherwise show empty state
    const reviews = reviewsList.length > 0 ? reviewsList : [];
    const totalReviews = ratingSummary?.totalReviews || 0;
    const averageRating = ratingSummary?.averageRating || 0;
    const starCounts = ratingSummary?.starCounts || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    // Dynamic calculations for customer feedback summary
    const starLevels = [5, 4, 3, 2, 1];
    const getPercentage = (star) => {
        if (!totalReviews) return 0;
        return ((starCounts[star] || 0) / totalReviews) * 100;
    };
    const totalCountForStar = (star) => starCounts[star] || 0;

    const Stars = ({ value }) => (
        <>
            {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className={`text-xs fw-medium d-flex ${i <= value ? 'text-warning-600' : 'text-gray-400'}`}><i className="ph-fill ph-star"></i></span>
            ))}
        </>
    );

    return (
        <div className="product-review-section">
            {/* Filters */}
            <ReviewFilters
                currentSort={currentSort}
                currentRating={currentRating}
                onSortChange={handleSortChange}
                onRatingChange={handleRatingChange}
            />

            {/* Error State */}
            {reviewsError && (
                <div className="alert alert-danger" role="alert">
                    <i className="ph ph-warning-circle me-2"></i>
                    {reviewsError}
                </div>
            )}

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="reviews-list">
                        {/* Loading State */}
                        {reviewsLoading && (
                            <div className="text-center py-5">
                                <div className="spinner-border text-main-600" role="status">
                                    <span className="visually-hidden">Loading reviews...</span>
                                </div>
                                <p className="text-gray-600 mt-3">Loading reviews...</p>
                            </div>
                        )}

                        {/* Empty State */}
                        {!reviewsLoading && reviews.length === 0 && (
                            <div className="empty-reviews text-center py-5">
                                <i className="ph ph-chat-circle-dots text-gray-400" style={{ fontSize: '64px' }}></i>
                                <p className="text-gray-600 mt-3 mb-0">
                                    {currentRating ? `No ${currentRating}-star reviews yet.` : 'No reviews yet. Be the first to write one!'}
                                </p>
                            </div>
                        )}

                        {/* Reviews List */}
                        {!reviewsLoading && reviews.length > 0 && reviews.map((item) => {
                            return (
                                <div key={item.reviewId} className="review-item mb-4 pb-4 border-bottom border-gray-100">
                                    <div className="flex-between align-items-start gap-8 mb-3">
                                        <div className="">
                                            <h6 className="mb-2 text-md">{item.user?.name || 'Anonymous'}</h6>
                                            <div className="flex-align gap-8">
                                                <Stars value={item.rating} />
                                                <small className='btn-elifnic'>{item.title}</small>
                                            </div>
                                        </div>
                                        <span className="text-gray-800 text-xs">{item.post_at}</span>
                                    </div>
                                    {item.comment && (
                                        <p className="text-gray-700 mb-2">{item.comment}</p>
                                    )}
                                    {/* Review Media */}
                                    <ReviewMedia
                                        images={item.media?.images || []}
                                        videos={item.media?.videos || []}
                                    />
                                </div>
                            )
                        })}

                        {/* Pagination */}
                        {!reviewsLoading && reviews.length > 0 && (
                            <ReviewPagination
                                currentPage={currentPage}
                                totalReviews={totalReviews}
                                limit={limit}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="ms-xxl-5">
                        <h5 className="mb-24">Customers Feedback</h5>
                        <div className="d-flex flex-wrap gap-44">
                            <div
                                className="border border-gray-100 rounded-8 px-40 col-12 py-10 flex-center flex-column flex-shrink-0 text-center">
                                <h2 className="mb-6 text-main-600">{averageRating.toFixed(1)}</h2>
                                <div className="flex-center gap-8">
                                    <Stars value={Math.round(Number(averageRating))} />
                                </div>
                                <span className="mt-16 text-gray-500">Average Product Rating ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
                            </div>
                            <div className="border border-gray-100 rounded-8 px-24 py-40 flex-grow-1">
                                {starLevels.map((star, idx) => {
                                    const pct = getPercentage(star);
                                    const count = totalCountForStar(star);
                                    // Add margin-bottom except for last row
                                    const mbClass = idx !== starLevels.length - 1 ? 'mb-20' : 'mb-0';
                                    return (
                                        <div className={`flex-align gap-8 ${mbClass}`} key={star}>
                                            <span className="text-gray-900 flex-shrink-0">{star}</span>
                                            <div className="progress w-100 bg-gray-100 rounded-pill h-8" role="progressbar" aria-label={`${star} star rating`} aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
                                                <div className="progress-bar bg-main-600 rounded-pill" style={{ width: `${pct}%` }}></div>
                                            </div>
                                            <div className="flex-align gap-4">
                                                <Stars value={star} />
                                            </div>
                                            <span className="text-gray-900 flex-shrink-0">{count}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Show loading spinner while checking eligibility */}
                        {isAuthenticated && eligibilityLoading && !hasCheckedEligibility && (
                            <div className="mt-56 text-center">
                                <div className="spinner-border text-main-600" role="status">
                                    <span className="visually-hidden">Checking eligibility...</span>
                                </div>
                                <p className="text-gray-600 mt-8">Checking if you can write a review...</p>
                            </div>
                        )}

                        {/* Show WriteReview only if user is eligible */}
                        {shouldShowWriteReview && <WriteReview productId={productId} />}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ProductReview