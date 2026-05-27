import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProductDetailsBySlug } from '../../services/productService';

// Async thunk to fetch product details by slug
export const fetchProductBySlug = createAsyncThunk(
    'productDetails/fetchBySlug',
    async (slug, { rejectWithValue }) => {
        try {
            const response = await getProductDetailsBySlug(slug);
            if (response.status === 'success') {
                return response.data;
            }
            return rejectWithValue(response.message || 'Failed to fetch product details');
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch product details');
        }
    }
);

// Helper function to find matching variant based on selected options
const findMatchingVariant = (variants, selectedOptions) => {
    if (!variants || !Array.isArray(variants) || variants.length === 0) return null;
    if (!selectedOptions || Object.keys(selectedOptions).length === 0) return null;

    // Filter out empty variant objects
    const validVariants = variants.filter(v => v && v.variant);
    if (validVariants.length === 0) return null;

    // Get selected values and normalize them
    const selectedValues = Object.values(selectedOptions).map(v =>
        String(v).toLowerCase().trim()
    );

    // Find variant that matches all selected options
    const matchedVariant = validVariants.find(variant => {
        if (!variant.variant) return false;

        // Variant string format: "L / red / 10g"
        const variantParts = variant.variant.split('/').map(p =>
            p.toLowerCase().trim()
        );

        // Check if all selected values are in the variant parts
        return selectedValues.every(val =>
            variantParts.some(part => part === val)
        );
    });

    return matchedVariant || null;
};

// Helper function to group options by type
const groupOptionsByType = (options) => {
    if (!options || !Array.isArray(options)) return {};

    const grouped = {};

    options.forEach(option => {
        const type = option.display_type;
        if (!grouped[type]) {
            grouped[type] = [];
        }
        grouped[type].push(option);
    });

    // Further group 'list' type by option_type (Size, Weight, etc.)
    if (grouped.list) {
        const listGrouped = {};
        grouped.list.forEach(option => {
            const optionType = option.option_type || 'Other';
            if (!listGrouped[optionType]) {
                listGrouped[optionType] = [];
            }
            listGrouped[optionType].push(option);
        });
        grouped.list = listGrouped;
    }

    return grouped;
};

const initialState = {
    product: null,
    groupedOptions: {},
    selectedOptions: {}, // { Size: 'M', Color: 'red', Weight: '10g' }
    selectedVariant: null, // The matched variant based on selected options
    selectedImage: null,
    loading: false,
    error: null,
};

const productDetailsSlice = createSlice({
    name: 'productDetails',
    initialState,
    reducers: {
        // Set selected option and update image
        setSelectedOption: (state, action) => {
            const { optionType, value, connectingImage } = action.payload;
            state.selectedOptions[optionType] = value;

            // Update selected image if connecting image exists
            if (connectingImage && connectingImage.length > 0) {
                state.selectedImage = connectingImage[0];
            }

            // Find matching variant based on selected options
            state.selectedVariant = findMatchingVariant(state.product?.variants, state.selectedOptions);
        },

        // Set selected image directly
        setSelectedImage: (state, action) => {
            state.selectedImage = action.payload;
        },

        // Clear product details
        clearProductDetails: (state) => {
            state.product = null;
            state.groupedOptions = {};
            state.selectedOptions = {};
            state.selectedVariant = null;
            state.selectedImage = null;
            state.loading = false;
            state.error = null;
        },

        // Reset selected options
        resetSelectedOptions: (state) => {
            state.selectedOptions = {};
            state.selectedVariant = null;
            if (state.product?.product_thumb) {
                state.selectedImage = state.product.product_thumb;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductBySlug.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductBySlug.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
                state.groupedOptions = groupOptionsByType(action.payload.options);
                state.selectedImage = action.payload.product_thumb || (action.payload.images?.[0] || null);
                state.selectedOptions = {};
                state.error = null;
            })
            .addCase(fetchProductBySlug.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch product details';
                state.product = null;
            });
    },
});

// Export actions
export const {
    setSelectedOption,
    setSelectedImage,
    clearProductDetails,
    resetSelectedOptions,
} = productDetailsSlice.actions;

// Selectors
export const selectProductDetails = (state) => state.productDetails.product;
export const selectProductLoading = (state) => state.productDetails.loading;
export const selectProductError = (state) => state.productDetails.error;
export const selectGroupedOptions = (state) => state.productDetails.groupedOptions;
export const selectSelectedOptions = (state) => state.productDetails.selectedOptions;
export const selectSelectedImage = (state) => state.productDetails.selectedImage;

// Computed selector for discount percentage
export const selectDiscountPercentage = (state) => {
    const product = state.productDetails.product;
    if (!product) return 0;

    const price = parseFloat(product.price) || 0;
    const totalPrice = parseFloat(String(product.total_price).replace(/,/g, '')) || 0;

    if (price <= 0) return 0;
    return Math.round(((price - totalPrice) / price) * 100);
};

// Selector to get all product images including option images
export const selectAllProductImages = (state) => {
    const product = state.productDetails.product;
    if (!product) return [];

    return product.images || [];
};

// Selector for selected variant
export const selectSelectedVariant = (state) => state.productDetails.selectedVariant;

// Selector for current price (variant price or base price)
export const selectCurrentPrice = (state) => {
    const product = state.productDetails.product;
    const selectedVariant = state.productDetails.selectedVariant;

    if (!product) return { price: 0, originalPrice: 0, discountPercentage: 0 };

    // If variant is selected and has a price, use variant price
    if (selectedVariant && selectedVariant.variant_price) {
        const variantPrice = parseFloat(String(selectedVariant.variant_price).replace(/,/g, '')) || 0;
        const originalPrice = parseFloat(product.price) || 0;
        const discountPercentage = originalPrice > 0
            ? Math.round(((originalPrice - variantPrice) / originalPrice) * 100)
            : 0;

        return {
            price: variantPrice,
            originalPrice: originalPrice,
            discountPercentage: Math.abs(discountPercentage),
            priceDifference: selectedVariant.price_difference
        };
    }

    // Use base product price
    const totalPrice = parseFloat(String(product.total_price).replace(/,/g, '')) || 0;
    const originalPrice = parseFloat(product.price) || 0;
    const discountPercentage = originalPrice > 0
        ? Math.round(((originalPrice - totalPrice) / originalPrice) * 100)
        : 0;

    return {
        price: totalPrice,
        originalPrice: originalPrice,
        discountPercentage: discountPercentage,
        priceDifference: null
    };
};

// Selector for current stock (variant inventory or base stock)
export const selectCurrentStock = (state) => {
    const product = state.productDetails.product;
    const selectedVariant = state.productDetails.selectedVariant;
    const selectedOptions = state.productDetails.selectedOptions;
    const groupedOptions = state.productDetails.groupedOptions;

    if (!product) return { stock: 0, isOutOfStock: true };

    // Check if product has variants
    const hasVariants = product.variants &&
        Array.isArray(product.variants) &&
        product.variants.filter(v => v && v.variant).length > 0;

    // Check if product has options
    const hasOptions = product.options &&
        Array.isArray(product.options) &&
        product.options.length > 0;

    // If product has variants
    if (hasVariants) {
        // If options exist but not all are selected, we can't determine stock yet
        if (hasOptions) {
            const requiredOptionTypes = new Set();

            // Get all option types from grouped options
            if (groupedOptions.color && groupedOptions.color.length > 0) {
                requiredOptionTypes.add('Color');
            }
            if (groupedOptions.list) {
                Object.keys(groupedOptions.list).forEach(type => {
                    requiredOptionTypes.add(type);
                });
            }

            const selectedCount = Object.keys(selectedOptions).length;
            const requiredCount = requiredOptionTypes.size;

            // If not all options are selected, show base stock
            if (selectedCount < requiredCount) {
                const baseStock = parseInt(product.stock) || 0;
                return {
                    stock: baseStock,
                    isOutOfStock: baseStock <= 0,
                    allOptionsSelected: false
                };
            }
        }

        // If variant is matched, use variant inventory
        if (selectedVariant) {
            const variantStock = parseInt(selectedVariant.inventory) || 0;
            return {
                stock: variantStock,
                isOutOfStock: variantStock <= 0,
                allOptionsSelected: true,
                variantSku: selectedVariant.sku
            };
        }

        // Variant not found for selected options
        return {
            stock: 0,
            isOutOfStock: true,
            allOptionsSelected: true,
            variantNotFound: true
        };
    }

    // No variants, use base product stock
    const baseStock = parseInt(product.stock) || 0;
    return {
        stock: baseStock,
        isOutOfStock: baseStock <= 0,
        allOptionsSelected: true
    };
};

// Selector to check if all options are selected
export const selectAllOptionsSelected = (state) => {
    const groupedOptions = state.productDetails.groupedOptions;
    const selectedOptions = state.productDetails.selectedOptions;

    const requiredOptionTypes = new Set();

    if (groupedOptions.color && groupedOptions.color.length > 0) {
        requiredOptionTypes.add('Color');
    }
    if (groupedOptions.list) {
        Object.keys(groupedOptions.list).forEach(type => {
            requiredOptionTypes.add(type);
        });
    }

    if (requiredOptionTypes.size === 0) return true;

    return [...requiredOptionTypes].every(type =>
        selectedOptions[type] !== undefined && selectedOptions[type] !== null
    );
};

export default productDetailsSlice.reducer;
