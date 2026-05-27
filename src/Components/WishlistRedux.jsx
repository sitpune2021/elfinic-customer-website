import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addToWishlist,
    removeFromWishlist,
    selectIsInWishlist,
    selectWishlistItems,
    selectWishlistLoading
} from "../store/slices/wishlistSlice";
import { toast } from "react-toastify";
import useApi from "../hooks/useApi";
import { useNavigate } from "react-router-dom";

function WishlistRedux({ product_id }) {
    const navigate = useNavigate();
    const { IsLogin } = useApi();
    const dispatch = useDispatch();

    // Local loading state for this specific product
    const [isLoading, setIsLoading] = useState(false);

    // Get wishlist state - always check Redux state
    const isInWishlist = useSelector(state => selectIsInWishlist(state, product_id));
    const wishlistItems = useSelector(selectWishlistItems);



    // Wishlist is already fetched by ReduxProvider or WishlistSection - no need to fetch here

    const handleToggleWishlist = async (e) => {
        // Prevent event bubbling (important for product cards)
        e.stopPropagation();
        e.preventDefault();

        // Check if user is logged in first
        if (!IsLogin()) {
            toast.info("Please log in to manage your wishlist", {
                toastId: 'wishlist-login-required'
            });
            navigate("/login");
            return;
        }

        if (isLoading) return; // Prevent multiple clicks while loading

        setIsLoading(true);

        try {
            if (isInWishlist) {
                await dispatch(removeFromWishlist(product_id)).unwrap();
                toast.info("Removed from wishlist", {
                    autoClose: 1500,
                    toastId: `wishlist-remove-${product_id}`
                });
            } else {
                await dispatch(addToWishlist(product_id)).unwrap();
                toast.success("Added to wishlist", {
                    autoClose: 1500,
                    toastId: `wishlist-add-${product_id}`
                });
            }
        } catch (error) {
            console.error("Wishlist operation failed:", error);
            const action = isInWishlist ? "remove from" : "add to";
            toast.error(`Failed to ${action} wishlist`, {
                autoClose: 2000,
                toastId: `wishlist-error-${product_id}`
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Determine heart color based on login and wishlist status
    const getHeartColorClass = () => {
        if (!IsLogin()) {
            return "text-gray-400"; // Gray for logged out users
        }
        return isInWishlist ? "text-danger" : "text-gray-400";
    };

    return (
        <span
            onClick={handleToggleWishlist}
            className={`d-flex text-28 position-relative ${isLoading ? 'opacity-50' : ''}`}
            style={{
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease-in-out'
            }}
            title={
                isLoading
                    ? 'Processing...'
                    : !IsLogin()
                        ? 'Login to add to wishlist'
                        : (isInWishlist ? 'Remove from wishlist' : 'Add to wishlist')
            }
        >
            {isLoading ? (
                <div className="d-flex align-items-center justify-content-center">
                    <i className="ph ph-spinner ph-spin text-primary" style={{ fontSize: '20px' }}></i>
                </div>
            ) : (
                <i
                    className={`ph-fill ph-heart transition-all ${getHeartColorClass()}`}
                    style={{
                        transition: 'all 0.2s ease-in-out',
                        transform: isInWishlist && IsLogin() ? 'scale(1.1)' : 'scale(1)'
                    }}
                ></i>
            )}
        </span>
    );
}

export default WishlistRedux;