import React, { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { toast } from "react-toastify";

function Wishlist({ product_id }) {
    const [wished, setWished] = useState(false);

    const { IsLogin, fetchWishlist, fetchRemoveFromWishlist, fetchAddToWishlist } = useApi();

    // On mount (or when product_id changes), check localStorage
    useEffect(() => {
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWished(savedWishlist.includes(String(product_id)));
    }, [product_id]);

    const handleAddToWishlist = async () => {
        if (IsLogin()) {
            // If already wished → remove
            if (wished) {
                try {
                    await fetchRemoveFromWishlist(product_id);
                    setWished(false);
                    toast.info("Removed from wishlist", { autoClose: 1500, toastId: `wishlist-remove-${product_id}` });
                } catch (error) {
                    console.error("Failed to remove from wishlist:", error);
                    toast.error("Failed to remove from wishlist", { autoClose: 2000, toastId: `wishlist-remove-error-${product_id}` });
                    // Keep the current state if API fails
                }
            } else {
                try {
                    await fetchAddToWishlist(product_id);
                    setWished(true);
                    toast.success("Added to wishlist", { autoClose: 1500, toastId: `wishlist-add-${product_id}` });
                } catch (error) {
                    console.error("Failed to add to wishlist:", error);
                    toast.error("Failed to add to wishlist", { autoClose: 2000, toastId: `wishlist-add-error-${product_id}` });
                    // Keep the current state if API fails
                }
            }
        } else {
            const existingWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

            if (wished) {
                // Remove from wishlist
                const updatedWishlist = existingWishlist.filter((id) => String(id) !== String(product_id));
                localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
                setWished(false);
                toast.info("Removed from wishlist", { autoClose: 1500, toastId: `wishlist-remove-${product_id}` });
            } else {
                // Add to wishlist
                localStorage.setItem(
                    "wishlist",
                    JSON.stringify([...existingWishlist, String(product_id)])
                );
                setWished(true);
                toast.success("Added to wishlist", { autoClose: 1500, toastId: `wishlist-add-${product_id}` });
            }
        }
    };

    return (
        <span

            onClick={handleAddToWishlist}
            className="d-flex text-28"
        >
            <i
                className={`ph-fill ph-heart ${wished ? "text-danger" : "text-gray-400"
                    }`}
            ></i>
        </span>
    );
}

export default Wishlist;
