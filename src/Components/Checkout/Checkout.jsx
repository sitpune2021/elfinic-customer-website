import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../../contexts/ApiContext';
import { useConfirm } from '../../contexts/ConfirmContext';
import useElfinicPayment from '../../hooks/useElfinicPayment';
import { useLogout } from '../../hooks/useLogout';
import Heading from '../Home/Heading.jsx';
import { MdDateRange } from "react-icons/md";

import {
    fetchCart,
    removeFromCart,
    selectCartItems,
    selectCartLoading,
    selectCartError
} from '../../store/slices/cartSlice';
import { selectUser } from '../../store/slices/authSlice';
import {
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    selectAddress,
    selectAddresses,
    selectSelectedAddressId,
    selectSelectedAddress,
    selectAddressLoading,
    selectActionLoading
} from '../../store/slices/addressSlice';
import {
    getallDeliveryType,
    selectDeliveryTypes,
    selectDeliveryTypesLoading,
    selectDeliveryTypesError
} from '../../store/slices/apiSlice';
import {
    placeProductOrder,
    verifyOrderPayment,
    clearCurrentOrder,
    selectPlaceOrderLoading,
    selectPlaceOrderError,
    selectCurrentOrder,
    selectRazorpayOrderId,
    selectRazorpayKeyId,
    selectOrderId,
    selectOrderAmount,
    selectVerifyPaymentLoading
} from '../../store/slices/orderSlice';
import './Checkout.css';
import { toast } from 'react-toastify';
import DeliveryTypesComponent from '../DeliveryTypesComponent';
import ProductCard from '../Home/ProductCard.jsx';
import Product from '../Product.jsx';
import ApplyCoupon from './ApplyCoupon.jsx';
import Toolkit from '../External-lab/Toolkit.jsx';

function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { image_path, IsLogin, products, productsLoading } = useApi();
    const { confirmAction } = useConfirm();
    const { loading: paymentLoading } = useElfinicPayment();
    const handleLogout = useLogout();

    const cartItems = useSelector(selectCartItems);
    const loading = useSelector(selectCartLoading);
    const error = useSelector(selectCartError);
    const user = useSelector(selectUser);

    // Order state from Redux
    const placeOrderLoading = useSelector(selectPlaceOrderLoading);
    const placeOrderError = useSelector(selectPlaceOrderError);
    const currentOrder = useSelector(selectCurrentOrder);
    const razorpayOrderId = useSelector(selectRazorpayOrderId);
    const razorpayKeyId = useSelector(selectRazorpayKeyId);
    const orderId = useSelector(selectOrderId);
    const orderAmount = useSelector(selectOrderAmount);
    const verifyPaymentLoading = useSelector(selectVerifyPaymentLoading);

    // products 

    console.log("Products in Checkout:", products);
    // Address state from Redux
    const addresses = useSelector(selectAddresses);
    const selectedAddressId = useSelector(selectSelectedAddressId);
    const selectedAddress = useSelector(selectSelectedAddress);
    const addressLoading = useSelector(selectAddressLoading);
    const actionLoading = useSelector(selectActionLoading);

    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const [formErrors, setFormErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [removingItemId, setRemovingItemId] = useState(null);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const [selectedCartItemIds, setSelectedCartItemIds] = useState([]);
    const [selectionInitialized, setSelectionInitialized] = useState(false);

    // Saved addresses state
    const [showAllAddresses, setShowAllAddresses] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [editAddress, setEditAddress] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        type: 'Home',
        name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        is_default: 0
    });

    const sanitizeAddressInput = (field, rawValue) => {
        const value = typeof rawValue === 'string' ? rawValue : '';

        switch (field) {
            case 'name':
                return value.replace(/[^A-Za-z\s.'-]/g, '').replace(/\s+/g, ' ').slice(0, 60);
            case 'phone':
                return value.replace(/\D/g, '').slice(0, 10);
            case 'address_line1':
            case 'address_line2':
                return value.replace(/[^A-Za-z0-9\s,./#-]/g, '').replace(/\s+/g, ' ').slice(0, 120);
            case 'city':
            case 'state':
                return value.replace(/[^A-Za-z\s.'-]/g, '').replace(/\s+/g, ' ').slice(0, 50);
            case 'postal_code':
                return value.replace(/\D/g, '').slice(0, 6);
            case 'country':
                return value.replace(/[^A-Za-z\s]/g, '').replace(/\s+/g, ' ').slice(0, 50);
            default:
                return value;
        }
    };

    const validateAddressData = (addressData) => {
        const cleanedAddress = {
            ...addressData,
            name: (addressData?.name || '').trim(),
            phone: (addressData?.phone || '').trim(),
            address_line1: (addressData?.address_line1 || '').trim(),
            address_line2: (addressData?.address_line2 || '').trim(),
            city: (addressData?.city || '').trim(),
            state: (addressData?.state || '').trim(),
            postal_code: (addressData?.postal_code || '').trim(),
            country: (addressData?.country || 'India').trim()
        };

        const errors = {};

        if (!cleanedAddress.name) {
            errors.name = 'Full name is required';
        } else if (!/^[A-Za-z][A-Za-z\s.'-]{1,59}$/.test(cleanedAddress.name)) {
            errors.name = 'Name must be 2-60 letters only';
        }

        if (!cleanedAddress.phone) {
            errors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(cleanedAddress.phone)) {
            errors.phone = 'Phone number must be exactly 10 digits';
        }

        if (!cleanedAddress.address_line1) {
            errors.address_line1 = 'Address line 1 is required';
        } else if (!/^[A-Za-z0-9\s,./#-]{5,120}$/.test(cleanedAddress.address_line1)) {
            errors.address_line1 = 'Address must be 5-120 valid characters';
        }

        if (cleanedAddress.address_line2 && !/^[A-Za-z0-9\s,./#-]{3,120}$/.test(cleanedAddress.address_line2)) {
            errors.address_line2 = 'Address line 2 must be 3-120 valid characters';
        }

        if (!cleanedAddress.city) {
            errors.city = 'City is required';
        } else if (!/^[A-Za-z][A-Za-z\s.'-]{1,49}$/.test(cleanedAddress.city)) {
            errors.city = 'City must be 2-50 letters only';
        }

        if (!cleanedAddress.state) {
            errors.state = 'State is required';
        } else if (!/^[A-Za-z][A-Za-z\s.'-]{1,49}$/.test(cleanedAddress.state)) {
            errors.state = 'State must be 2-50 letters only';
        }

        if (!cleanedAddress.postal_code) {
            errors.postal_code = 'Pin code is required';
        } else if (!/^\d{6}$/.test(cleanedAddress.postal_code)) {
            errors.postal_code = 'Pin code must be exactly 6 digits';
        }

        if (!cleanedAddress.country) {
            errors.country = 'Country is required';
        } else if (!/^[A-Za-z\s]{2,50}$/.test(cleanedAddress.country)) {
            errors.country = 'Country must be 2-50 letters only';
        }

        return {
            errors,
            cleanedAddress,
            isValid: Object.keys(errors).length === 0
        };
    };

    const getCartItemId = (item) => item?.cart_id ?? item?.id;

    // Select all cart items by default the first time cart data is loaded.
    useEffect(() => {
        const currentIds = cartItems
            .map((item) => getCartItemId(item))
            .filter((id) => id !== undefined && id !== null);

        if (currentIds.length === 0) {
            setSelectedCartItemIds([]);
            setSelectionInitialized(false);
            return;
        }

        setSelectedCartItemIds((prevSelectedIds) => {
            if (!selectionInitialized) {
                return currentIds;
            }

            const remainingSelected = prevSelectedIds.filter((id) => currentIds.includes(id));
            const newItems = currentIds.filter((id) => !prevSelectedIds.includes(id));
            return [...remainingSelected, ...newItems];
        });

        if (!selectionInitialized) {
            setSelectionInitialized(true);
        }
    }, [cartItems, selectionInitialized]);

    const selectedCartItems = cartItems.filter((item) => selectedCartItemIds.includes(getCartItemId(item)));

    const selectedTotalItems = selectedCartItems.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0);

    const allItemsSelected = cartItems.length > 0 && selectedCartItems.length === cartItems.length;

    const handleSelectItem = (itemId) => {
        setSelectedCartItemIds((prevSelectedIds) => {
            if (prevSelectedIds.includes(itemId)) {
                return prevSelectedIds.filter((id) => id !== itemId);
            }
            return [...prevSelectedIds, itemId];
        });
    };

    const handleSelectAllItems = (checked) => {
        if (checked) {
            const allIds = cartItems
                .map((item) => getCartItemId(item))
                .filter((id) => id !== undefined && id !== null);
            setSelectedCartItemIds(allIds);
            return;
        }
        setSelectedCartItemIds([]);
    };

    useEffect(() => {
        let isMounted = true;

        const loadCheckoutData = async () => {
            if (IsLogin()) {
                try {
                    await Promise.all([
                        dispatch(fetchCart()),
                        dispatch(fetchAddresses())
                    ]);
                } catch (error) {
                    console.error('Error loading checkout data:', error);
                } finally {
                    if (isMounted) {
                        setInitialLoadComplete(true);
                    }
                }
            } else {
                navigate('/login');
            }
        };

        // Only load if not already loaded
        if (!initialLoadComplete) {
            loadCheckoutData();
        }

        return () => {
            isMounted = false;
        };
    }, []); // Empty dependency array to run only once on mount

    const handleNewAddressChange = (e) => {
        const { name, value, type, checked } = e.target;
        const sanitizedValue = type === 'checkbox' ? (checked ? 1 : 0) : sanitizeAddressInput(name, value);

        setNewAddress(prev => ({
            ...prev,
            [name]: sanitizedValue
        }));

        setFormErrors((prev) => {
            if (!prev.newAddress?.[name]) {
                return prev;
            }

            return {
                ...prev,
                newAddress: {
                    ...prev.newAddress,
                    [name]: ''
                }
            };
        });
    };

    const [selectedType, setSelectedType] = useState("");

    // Use specific selectors for delivery types
    const deliveryTypes = useSelector(selectDeliveryTypes);
    const deliveryTypesLoading = useSelector(selectDeliveryTypesLoading);
    const deliveryTypesError = useSelector(selectDeliveryTypesError);

    // console.log('Delivery Types:', deliveryTypes);

    // Fetch delivery types when component mounts (only if not already loaded)
    useEffect(() => {
        if (!deliveryTypes?.data?.length && !deliveryTypesLoading) {
            dispatch(getallDeliveryType());
        }
    }, []); // Run only once on mount

    // Auto-select free delivery type (or lowest charge) when data loads
    useEffect(() => {
        if (deliveryTypes?.data?.length > 0 && !selectedType) {
            // Find free delivery type first, otherwise find the one with lowest charge
            const freeType = deliveryTypes.data.find(type => type.charge === 0);
            const lowestChargeType = [...deliveryTypes.data].sort((a, b) => a.charge - b.charge)[0];
            const defaultType = freeType || lowestChargeType;
            setSelectedType(defaultType.type);
        }
    }, [deliveryTypes]);


    const handleAddressSelect = (addressId) => {
        dispatch(selectAddress(addressId));
    };

    const handleAddNewAddress = async (e) => {
        e.preventDefault();

        const { errors, cleanedAddress, isValid } = validateAddressData(newAddress);
        if (!isValid) {
            setFormErrors((prev) => ({ ...prev, newAddress: errors }));
            toast.error('Please enter valid address details');
            return;
        }

        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        const payload = {
            ...cleanedAddress,
            user_id: localUser.id || null
        };

        try {
            await dispatch(addAddress(payload)).unwrap();
            setShowAddressForm(false);
            setFormErrors((prev) => ({ ...prev, newAddress: {} }));

            // Reset form
            setNewAddress({
                type: 'Home',
                name: '',
                phone: '',
                address_line1: '',
                address_line2: '',
                city: '',
                state: '',
                postal_code: '',
                country: 'India',
                is_default: 0
            });

            toast.success('Address added successfully!');
        } catch (error) {
            toast.error(error || 'Failed to add address');
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (addresses.length === 1) {
            toast.error('You must have at least one address');
            return;
        }

        confirmAction({
            message: 'Are you sure you want to Delete this Address?',
            header: 'Remove Item',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, Remove',
            rejectLabel: 'Cancel',
            accept: async () => {
                try {
                    await dispatch(deleteAddress(addressId)).unwrap();
                } catch (error) {
                    console.error('Error removing item:', error);
                    toast.error(error || 'Failed to Delete Address');
                }
            },
            reject: () => {
                // User cancelled, do nothing
            }
        });
    };

    const handleEditAddress = (address) => {
        setEditingAddressId(address.id);
        setEditAddress({
            ...address,
            name: sanitizeAddressInput('name', address.name || ''),
            phone: sanitizeAddressInput('phone', address.phone || ''),
            address_line1: sanitizeAddressInput('address_line1', address.address_line1 || ''),
            address_line2: sanitizeAddressInput('address_line2', address.address_line2 || ''),
            city: sanitizeAddressInput('city', address.city || ''),
            state: sanitizeAddressInput('state', address.state || ''),
            postal_code: sanitizeAddressInput('postal_code', address.postal_code || ''),
            country: sanitizeAddressInput('country', address.country || 'India')
        });
        setFormErrors((prev) => ({ ...prev, editAddress: {} }));
    };

    const handleEditAddressChange = (e) => {
        const { name, value, type, checked } = e.target;
        const sanitizedValue = type === 'checkbox' ? (checked ? 1 : 0) : sanitizeAddressInput(name, value);

        setEditAddress(prev => ({
            ...prev,
            [name]: sanitizedValue
        }));

        setFormErrors((prev) => {
            if (!prev.editAddress?.[name]) {
                return prev;
            }

            return {
                ...prev,
                editAddress: {
                    ...prev.editAddress,
                    [name]: ''
                }
            };
        });
    };

    const handleUpdateAddress = async (e) => {
        e.preventDefault();

        const { errors, cleanedAddress, isValid } = validateAddressData(editAddress);
        if (!isValid) {
            setFormErrors((prev) => ({ ...prev, editAddress: errors }));
            toast.error('Please enter valid address details');
            return;
        }

        try {
            await dispatch(updateAddress({ ...editAddress, ...cleanedAddress })).unwrap();
            setEditingAddressId(null);
            setEditAddress(null);
            setFormErrors((prev) => ({ ...prev, editAddress: {} }));
            toast.success('Address updated successfully!');
        } catch (error) {
            toast.error(error || 'Failed to update address');
        }
    };

    const handleCancelEdit = () => {
        setEditingAddressId(null);
        setEditAddress(null);
        setFormErrors((prev) => ({ ...prev, editAddress: {} }));
    };

    const handleRemoveItem = async (cartId) => {
        confirmAction({
            message: 'Are you sure you want to remove this item from your cart?',
            header: 'Remove Item',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, Remove',
            rejectLabel: 'Cancel',
            accept: async () => {
                setIsRemoving(true);
                setRemovingItemId(cartId);
                try {
                    await dispatch(removeFromCart(cartId)).unwrap();
                    toast.success('Item removed from cart');
                } catch (error) {
                    console.error('Error removing item:', error);
                    toast.error(error || 'Failed to remove item from cart');
                } finally {
                    setIsRemoving(false);
                    setRemovingItemId(null);
                }
            },
            reject: () => {
                // User cancelled, do nothing
            }
        });
    };

    const getProductImage = (product) => {
        if (product?.product_thumb) {
            return `${image_path}products-thumbs/${product.product_thumb}`;
        }
        return '/images/thumbs/product-two-img1.png';
    };

    // Get selected variant from cart item
    const getSelectedVariant = (item) => {
        if (!item?.product?.variants || item.product.variants.length === 0) {
            return null;
        }
        // If variant_id is in cart item, find the matching variant
        if (item.variant_id) {
            return item.product.variants.find(v => v.id === item.variant_id) || null;
        }
        // If selected_variant is directly in cart item
        if (item.selected_variant) {
            return item.selected_variant;
        }
        // If variant name/string is stored
        if (item.variant) {
            return item.product.variants.find(v => v.variant === item.variant) || { variant: item.variant };
        }
        // Check if product has only one variant (auto-select)
        if (item.product.variants.length === 1) {
            return item.product.variants[0];
        }
        return null;
    };

    const getProductPrice = (product, selectedVariant = null) => {
        if (!product) return 0;

        // If variant is selected, use variant price
        if (selectedVariant && selectedVariant.variant_price) {
            const variantPrice = parseFloat(selectedVariant.variant_price);
            if (!isNaN(variantPrice) && variantPrice > 0) {
                return variantPrice;
            }
        }

        // Use total_price if available (already calculated: price - discount_price)
        if (product.total_price) {
            const cleanTotalPrice = typeof product.total_price === 'string'
                ? product.total_price.replace(/,/g, '')
                : product.total_price;
            const totalPrice = parseFloat(cleanTotalPrice);
            if (!isNaN(totalPrice) && totalPrice > 0) {
                return totalPrice;
            }
        }

        // Fallback: Calculate price - discount_price manually
        const regularPrice = parseFloat(product.price) || 0;
        const discountAmount = parseFloat(product.discount_price) || 0;
        if (regularPrice > 0) {
            return regularPrice - discountAmount;
        }

        return 0;
    };

    const calculateSubtotal = (item) => {
        const selectedVariant = getSelectedVariant(item);
        const price = getProductPrice(item.product, selectedVariant);
        return (price * item.quantity).toFixed(2);
    };

    const selectedSubtotal = selectedCartItems.reduce((acc, item) => {
        const variant = getSelectedVariant(item);
        const unitPrice = getProductPrice(item.product, variant);
        return acc + (unitPrice * item.quantity);
    }, 0);

    const calculateShipping = () => {
        if (selectedCartItems.length === 0) {
            return 0;
        }
        return selectedSubtotal >= 999 ? 0 : 99; // Free shipping
    };
    const getDeliveryCharge = () => {
        if (!selectedType || selectedType === '') {
            return 0;
        }

        const selectedDeliveryType = deliveryTypes?.data?.find(
            type => type.type === selectedType
        );

        return selectedDeliveryType ? parseFloat(selectedDeliveryType.charge) || 0 : 0;
    };

    // Coupon state
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    // Selected products changed, so reset coupon to avoid stale discount values.
    useEffect(() => {
        setAppliedCoupon((prevCoupon) => (prevCoupon ? null : prevCoupon));
    }, [selectedCartItemIds]);

    // Function to get discount amount
    const getDiscountAmount = () => {
        return appliedCoupon?.discount_amount || 0;
    };

    // Calculate grand total with discount
    const calculateGrandTotalWithDiscount = () => {
        const subtotal = selectedSubtotal;
        const shipping = calculateShipping();
        const delivery = getDeliveryCharge();
        const discount = getDiscountAmount();
        return Math.max(0, subtotal + shipping + delivery - discount).toFixed(2);
    };

    // Load Razorpay script
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
            if (existingScript) {
                resolve(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.head.appendChild(script);
        });
    };

    // Open Razorpay payment gateway
    const openRazorpayPayment = async (orderResponse) => {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            toast.error('Failed to load payment gateway. Please refresh and try again.');
            setIsProcessing(false);
            return;
        }

        const options = {
            key: orderResponse.key_id,
            amount: orderResponse.amount * 100, // Amount in paisa
            currency: orderResponse.currency || 'INR',
            name: 'Elfinic',
            description: `Order #${orderResponse.order_id}`,
            order_id: orderResponse.razorpay_order_id,
            prefill: {
                name: user?.name || selectedAddress?.name || '',
                email: user?.email || '',
                contact: selectedAddress?.phone || user?.phone || ''
            },
            theme: {
                color: '#3399cc'
            },
            handler: async (response) => {
                // Payment successful - verify with backend
                try {
                    // verify-payment endpoint expects:
                    // order_id: razorpay_order_id (e.g., "order_Rl4tFlnFkvTVD8")
                    // razorpay_payment_id: payment id from Razorpay
                    // razorpay_signature: signature from Razorpay
                    const verifyData = {
                        order_id: response.razorpay_order_id, // This is the razorpay_order_id
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    };

                    const verifyResult = await dispatch(verifyOrderPayment(verifyData)).unwrap();

                    toast.success('Payment successful! Your order has been placed.');

                    // Clear current order state
                    dispatch(clearCurrentOrder());

                    // Refresh cart
                    dispatch(fetchCart());

                    // Prepare order data for success page
                    const successOrderData = {
                        orderId: orderResponse.order_id,
                        orderNumber: `ORD${orderResponse.order_id}`,
                        paymentMethod: 'razorpay',
                        paymentId: response.razorpay_payment_id,
                        items: selectedCartItems.map(item => {
                            const variant = getSelectedVariant(item);
                            return {
                                name: item.product?.name || 'Product',
                                price: getProductPrice(item.product, variant),
                                quantity: item.quantity,
                                image: getProductImage(item.product),
                                variant: variant?.variant || null
                            };
                        }),
                        address: selectedAddress,
                        subtotal: selectedSubtotal,
                        shipping: calculateShipping(),
                        deliveryCharge: getDeliveryCharge(),
                        deliveryType: selectedType,
                        discount: getDiscountAmount(),
                        couponCode: appliedCoupon?.code || null,
                        total: parseFloat(calculateGrandTotalWithDiscount()),
                        orderDate: new Date().toISOString()
                    };

                    navigate('/order-success', {
                        state: {
                            orderData: successOrderData,
                            paymentResult: verifyResult
                        }
                    });
                } catch (verifyError) {
                    console.error('Payment verification failed:', verifyError);
                    toast.error('Payment verification failed. Please contact support.');
                }
                setIsProcessing(false);
            },
            modal: {
                ondismiss: () => {
                    toast.warning('Payment cancelled');
                    setIsProcessing(false);
                },
                escape: false,
                backdropclose: false
            }
        };

        try {
            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', (response) => {
                console.error('Payment failed:', response.error);
                toast.error(response.error?.description || 'Payment failed. Please try again.');
                setIsProcessing(false);
            });
            paymentObject.open();
        } catch (razorpayError) {
            console.error('Razorpay error:', razorpayError);
            toast.error('Failed to initialize payment. Please try again.');
            setIsProcessing(false);
        }
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        // Validate user and address selection
        if (!user) {
            toast.error('Please login to place order');
            navigate('/login');
            return;
        }

        if (!selectedAddress) {
            toast.error('Please select a delivery address');
            return;
        }

        if (!selectedType || selectedType === '') {
            toast.error('Please select a delivery type');
            return;
        }

        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        if (selectedCartItems.length === 0) {
            toast.error('Please select at least one product to place order');
            return;
        }

        setIsProcessing(true);

        try {
            // Prepare cart items for API
            const cartData = selectedCartItems.map(item => {
                const variant = getSelectedVariant(item);
                return {
                    product_id: item.product_id,
                    variant_id: item.variants_id || null,
                    quantity: item.quantity,
                    price: getProductPrice(item.product, variant),
                    discount: item.product?.discount_price ?
                        (parseFloat(item.product.price) - parseFloat(item.product.discount_price)) : 0
                };
            });

            // Calculate total amount
            const totalAmount = parseFloat(calculateGrandTotalWithDiscount());

            // Prepare order data
            const orderData = {
                user_id: user.id,
                address_id: selectedAddress.id,
                total_amount: totalAmount,
                coupon_code: appliedCoupon?.code || '',
                discount_amount: getDiscountAmount(),
                coins_used: 0,
                delivery_type: selectedType,
                delivery_charge: getDeliveryCharge(),
                shipping_charge: calculateShipping(),
                cart: cartData
            };

            console.log('Placing order with data:', orderData);

            // Handle Cash on Delivery
            if (paymentMethod === 'cod') {
                // For COD, directly place the order without payment gateway
                const orderResult = await dispatch(placeProductOrder(orderData)).unwrap();

                toast.success('Order placed successfully! Pay on delivery.');

                // Clear current order state
                dispatch(clearCurrentOrder());

                // Refresh cart
                dispatch(fetchCart());

                // Prepare order data for success page
                const successOrderData = {
                    orderId: orderResult.order_id,
                    orderNumber: `ORD${orderResult.order_id}`,
                    paymentMethod: 'cod',
                    items: selectedCartItems.map(item => {
                        const variant = getSelectedVariant(item);
                        return {
                            name: item.product?.name || 'Product',
                            price: getProductPrice(item.product, variant),
                            quantity: item.quantity,
                            image: getProductImage(item.product),
                            variant: variant?.variant || null
                        };
                    }),
                    address: selectedAddress,
                    subtotal: selectedSubtotal,
                    shipping: calculateShipping(),
                    deliveryCharge: getDeliveryCharge(),
                    deliveryType: selectedType,
                    discount: getDiscountAmount(),
                    couponCode: appliedCoupon?.code || null,
                    total: totalAmount,
                    orderDate: new Date().toISOString()
                };

                setIsProcessing(false);
                navigate('/order-success', { state: { orderData: successOrderData } });
                return;
            }

            // For online payment - place order first to get Razorpay order ID
            const orderResult = await dispatch(placeProductOrder(orderData)).unwrap();

            console.log('Order placed successfully:', orderResult);

            // Check if order was placed successfully
            if (orderResult.status === 'success' && orderResult.razorpay_order_id) {
                // Open Razorpay payment gateway
                await openRazorpayPayment(orderResult);
            } else {
                throw new Error('Failed to create payment order');
            }

        } catch (error) {
            console.error('Order placement error:', error);
            toast.error(error.message || error || 'Failed to process order. Please try again.');
            setIsProcessing(false);
        }
    };




    // Show skeleton loading only on initial load
    if (!initialLoadComplete && (loading || addressLoading)) {
        return (
            <>
                {/* Breadcrumb */}
                <div className="breadcrumb mb-0 py-18 bg-main-two-50">
                    <div className="container container-lg">
                        <div className="breadcrumb-wrapper flex-between flex-wrap gap-16">
                            <h6 className="mb-0">Order Checkout</h6>
                            <ul className="flex-align gap-8 flex-wrap">
                                <li className="text-sm">
                                    <Link to="/" className="text-gray-900 flex-align gap-8 hover-text-main-600">
                                        <i className="ph ph-house"></i>
                                        Home
                                    </Link>
                                </li>
                                <li className="flex-align">
                                    <i className="ph ph-caret-right"></i>
                                </li>
                                <li className="text-sm text-main-600"> Checkout </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Skeleton Loading */}
                <section className="checkout-section py-10">
                    <div className="container container-lg">
                        <div className="row">
                            {/* Left Side Skeleton */}
                            <div className="col-xl-8 col-lg-8">
                                {/* Profile Card Skeleton */}
                                <div className="profile-card mb-32">
                                    <div className="d-flex align-items-center gap-16">
                                        <div className="skeleton" style={{ width: '56px', height: '56px', borderRadius: '50%' }}></div>
                                        <div className="flex-grow-1">
                                            <div className="skeleton mb-2" style={{ width: '150px', height: '20px' }}></div>
                                            <div className="skeleton" style={{ width: '200px', height: '16px' }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Section Skeleton */}
                                <div className="address-section-checkout">
                                    <div className="d-flex justify-content-between align-items-center mb-24">
                                        <div className="skeleton" style={{ width: '200px', height: '24px' }}></div>
                                        <div className="skeleton" style={{ width: '140px', height: '38px', borderRadius: '8px' }}></div>
                                    </div>

                                    {/* Address Cards Skeleton */}
                                    {[1, 2].map((i) => (
                                        <div key={i} className="address-card mb-16" style={{ opacity: 0.6 }}>
                                            <div className="address-card-header">
                                                <div className="d-flex align-items-center gap-12">
                                                    <div className="skeleton" style={{ width: '20px', height: '20px', borderRadius: '50%' }}></div>
                                                    <div className="skeleton" style={{ width: '80px', height: '24px', borderRadius: '12px' }}></div>
                                                </div>
                                            </div>
                                            <div className="address-card-body">
                                                <div className="skeleton mb-2" style={{ width: '150px', height: '18px' }}></div>
                                                <div className="skeleton mb-2" style={{ width: '120px', height: '14px' }}></div>
                                                <div className="skeleton mb-2" style={{ width: '90%', height: '14px' }}></div>
                                                <div className="skeleton" style={{ width: '70%', height: '14px' }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Side Skeleton */}
                            <div className="col-xl-4 col-lg-5">
                                <div className="checkout-sidebar border border-gray-100 rounded-8 px-24 py-40 pt-0">
                                    <div className="skeleton mb-4" style={{ width: '100px', height: '16px' }}></div>
                                    <div className="skeleton mb-4" style={{ width: '120px', height: '24px' }}></div>

                                    {/* Cart Items Skeleton */}
                                    {[1, 2].map((i) => (
                                        <div key={i} className="d-flex align-items-center gap-16 mb-16 pb-16 border-bottom border-gray-100">
                                            <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '8px' }}></div>
                                            <div className="flex-grow-1">
                                                <div className="skeleton mb-2" style={{ width: '100%', height: '16px' }}></div>
                                                <div className="skeleton" style={{ width: '60%', height: '14px' }}></div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Totals Skeleton */}
                                    <div className="bg-color-three rounded-8 p-24 mb-24">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="d-flex justify-content-between mb-3">
                                                <div className="skeleton" style={{ width: '80px', height: '16px' }}></div>
                                                <div className="skeleton" style={{ width: '60px', height: '16px' }}></div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Button Skeleton */}
                                    <div className="skeleton" style={{ width: '100%', height: '48px', borderRadius: '8px' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    if (error) {
        return (
            <section className="checkout-section py-80">
                <div className="container container-lg">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 text-center">
                            <div className="alert alert-danger">
                                <h5>Error</h5>
                                <p>{error}</p>
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={() => dispatch(fetchCart())}
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (cartItems.length === 0) {
        return (
            <section className="checkout-section py-80">
                <div className="container container-lg">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 text-center">
                            <i className="ph ph-shopping-cart text-gray-400" style={{ fontSize: '4rem' }}></i>
                            <h3 className="mt-3 mb-3">Your Cart is Empty</h3>
                            <p className="text-gray-600 mb-4">Add items to your cart before checkout.</p>
                            <a href="/shop" className="btn btn-main">Continue Shopping</a>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            {/* <!-- ========================= Breadcrumb Start =============================== --> */}
            <div className="breadcrumb mb-0 py-18 bg-main-two-50">
                <div className="container container-lg">
                    <div className="breadcrumb-wrapper flex-between flex-wrap gap-16">
                        <h6 className="mb-0">Order Checkout</h6>
                        <ul className="flex-align gap-8 flex-wrap">
                            <li className="text-sm">
                                <Link to="/" className="text-gray-900 flex-align gap-8 hover-text-main-600">
                                    <i className="ph ph-house"></i>
                                    Home
                                </Link>
                            </li>
                            <li className="flex-align">
                                <i className="ph ph-caret-right"></i>
                            </li>
                            <li className="text-sm text-main-600"> Checkout </li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* <!-- ========================= Breadcrumb End =============================== --> */}


            {/* Checkout Section */}
            <section className="checkout-section py-10">
                <div className="container container-lg">
                    <div className="row">
                        {/* Billing Details Form */}
                        <div className="col-xl-8 col-lg-8">

                            {/* Profile and Address Section */}
                            {/* User Profile Card */}
                            <div className="profile-card mb-32">
                                <div className="d-flex align-items-center gap-16">
                                    <div className="profile-avatar-checkout">
                                        <i className="ph-fill ph-user-circle" style={{ fontSize: '3.5rem', color: '#2563eb' }}></i>
                                    </div>
                                    <div className="profile-info flex-grow-1 ">
                                        <h5 className="mb-4">{user?.name || user?.email?.split('@')[0] || 'Guest User'}</h5>
                                        <p className="text-gray-600 mb-0">
                                            <i className="ph ph-envelope me-2"></i>
                                            {user?.email || 'user@example.com'}
                                        </p>
                                        {user?.phone && (
                                            <p className="text-gray-600 mb-0">
                                                <i className="ph ph-phone me-2"></i>
                                                {user.phone}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-outline-main btn-sm d-flex align-items-center"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <i className="ph ph-user-circle me-2"></i>
                                        Change Account
                                    </button>
                                </div>
                            </div>

                            {/* Delivery Address Section */}
                            <div className="address-section-checkout">
                                <div className="d-flex justify-content-between align-items-center mb-24">
                                    <h6 className="mb-0 text-center">
                                        <i className="ph ph-map-pin me-2 text-main-600"></i>
                                        Delivery Address
                                        <br />
                                        <small style={{ fontSize: '13px' }} className=' fw-light'>

                                            Estimated delivery date:{" "}
                                            {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                        </small>
                                    </h6>


                                    <button
                                        className="btn btn-main btn-sm"
                                        onClick={() => setShowAddressForm(!showAddressForm)}
                                    >
                                        <i className="ph ph-plus me-2"></i>
                                        Add New Address
                                    </button>
                                </div>

                                {/* Add New Address Form */}
                                {showAddressForm && (
                                    <div className="address-form-card mb-24">
                                        <div className="d-flex justify-content-between align-items-center mb-20">
                                            <h6 className="mb-0">New Address</h6>
                                            <button
                                                className="btn-close"
                                                onClick={() => {
                                                    setShowAddressForm(false);
                                                    setFormErrors((prev) => ({ ...prev, newAddress: {} }));
                                                }}
                                            ></button>
                                        </div>
                                        <form onSubmit={handleAddNewAddress}>
                                            <div className="row gy-3">
                                                <div className="col-12">
                                                    <label className="text-sm mb-2">Address Type</label>
                                                    <div className="d-flex gap-12">
                                                        <label className="address-type-radio">
                                                            <input
                                                                type="radio"
                                                                name="type"
                                                                value="Home"
                                                                checked={newAddress.type === 'Home'}
                                                                onChange={handleNewAddressChange}
                                                            />
                                                            <span><i className="ph ph-house me-2"></i>Home</span>
                                                        </label>
                                                        <label className="address-type-radio">
                                                            <input
                                                                type="radio"
                                                                name="type"
                                                                value="Office"
                                                                checked={newAddress.type === 'Office'}
                                                                onChange={handleNewAddressChange}
                                                            />
                                                            <span><i className="ph ph-briefcase me-2"></i>Office</span>
                                                        </label>
                                                        <label className="address-type-radio">
                                                            <input
                                                                type="radio"
                                                                name="type"
                                                                value="Other"
                                                                checked={newAddress.type === 'Other'}
                                                                onChange={handleNewAddressChange}
                                                            />
                                                            <span><i className="ph ph-map-pin me-2"></i>Other</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="text-sm mb-2">Full Name <span className="text-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        className={`common-input ${formErrors.newAddress?.name ? 'is-invalid' : ''}`}
                                                        placeholder="Enter full name"
                                                        value={newAddress.name}
                                                        onChange={handleNewAddressChange}
                                                        maxLength={60}
                                                        required
                                                    />
                                                    {formErrors.newAddress?.name && (
                                                        <small className="text-danger d-block mt-1">{formErrors.newAddress.name}</small>
                                                    )}
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="text-sm mb-2">Phone Number <span className="text-danger">*</span></label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        className={`common-input ${formErrors.newAddress?.phone ? 'is-invalid' : ''}`}
                                                        placeholder="Enter phone number"
                                                        value={newAddress.phone}
                                                        onChange={handleNewAddressChange}
                                                        inputMode="numeric"
                                                        pattern="[0-9]{10}"
                                                        maxLength={10}
                                                        required
                                                    />
                                                    {formErrors.newAddress?.phone && (
                                                        <small className="text-danger d-block mt-1">{formErrors.newAddress.phone}</small>
                                                    )}
                                                </div>
                                                <div className="col-12">
                                                    <label className="text-sm mb-2">Address Line 1 <span className="text-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        name="address_line1"
                                                        className={`common-input ${formErrors.newAddress?.address_line1 ? 'is-invalid' : ''}`}
                                                        placeholder="House number, street name"
                                                        value={newAddress.address_line1}
                                                        onChange={handleNewAddressChange}
                                                        maxLength={120}
                                                        required
                                                    />
                                                    {formErrors.newAddress?.address_line1 && (
                                                        <small className="text-danger d-block mt-1">{formErrors.newAddress.address_line1}</small>
                                                    )}
                                                </div>
                                                <div className="col-12">
                                                    <label className="text-sm mb-2">Address Line 2</label>
                                                    <input
                                                        type="text"
                                                        name="address_line2"
                                                        className={`common-input ${formErrors.newAddress?.address_line2 ? 'is-invalid' : ''}`}
                                                        placeholder="Apartment, suite, etc. (optional)"
                                                        value={newAddress.address_line2}
                                                        onChange={handleNewAddressChange}
                                                        maxLength={120}
                                                    />
                                                    {formErrors.newAddress?.address_line2 && (
                                                        <small className="text-danger d-block mt-1">{formErrors.newAddress.address_line2}</small>
                                                    )}
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="text-sm mb-2">City <span className="text-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        className={`common-input ${formErrors.newAddress?.city ? 'is-invalid' : ''}`}
                                                        placeholder="Enter city"
                                                        value={newAddress.city}
                                                        onChange={handleNewAddressChange}
                                                        maxLength={50}
                                                        required
                                                    />
                                                    {formErrors.newAddress?.city && (
                                                        <small className="text-danger d-block mt-1">{formErrors.newAddress.city}</small>
                                                    )}
                                                </div>
                                                <div className="col-sm-6">
                                                    <label className="text-sm mb-2">State <span className="text-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        className={`common-input ${formErrors.newAddress?.state ? 'is-invalid' : ''}`}
                                                        placeholder="Enter state"
                                                        value={newAddress.state}
                                                        onChange={handleNewAddressChange}
                                                        maxLength={50}
                                                        required
                                                    />
                                                    {formErrors.newAddress?.state && (
                                                        <small className="text-danger d-block mt-1">{formErrors.newAddress.state}</small>
                                                    )}
                                                </div>
                                                <div className="col-12">
                                                    <label className="text-sm mb-2">Pin Code <span className="text-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        name="postal_code"
                                                        className={`common-input ${formErrors.newAddress?.postal_code ? 'is-invalid' : ''}`}
                                                        placeholder="Enter pin code"
                                                        value={newAddress.postal_code}
                                                        onChange={handleNewAddressChange}
                                                        inputMode="numeric"
                                                        pattern="[0-9]{6}"
                                                        maxLength={6}
                                                        required
                                                    />
                                                    {formErrors.newAddress?.postal_code && (
                                                        <small className="text-danger d-block mt-1">{formErrors.newAddress.postal_code}</small>
                                                    )}
                                                </div>
                                                <div className="col-12">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            name="is_default"
                                                            id="makeDefault"
                                                            checked={newAddress.is_default === 1}
                                                            onChange={handleNewAddressChange}
                                                        />
                                                        <label className="form-check-label text-sm" htmlFor="makeDefault">
                                                            Make this my default address
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="d-flex gap-12">
                                                        <button type="submit" className="btn btn-main flex-grow-1">
                                                            <i className="ph ph-check me-2"></i>
                                                            Save Address
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className=" btn-outline-gray"
                                                            onClick={() => {
                                                                setShowAddressForm(false);
                                                                setFormErrors((prev) => ({ ...prev, newAddress: {} }));
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Saved Addresses List */}
                                <div className="saved-addresses">
                                    {addressLoading ? (
                                        <div className="text-center py-4">
                                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                                                <span className="visually-hidden">Loading addresses...</span>
                                            </div>
                                        </div>
                                    ) : addresses.length === 0 ? (
                                        <div className="text-center py-4 text-gray-600">
                                            <i className="ph ph-map-pin" style={{ fontSize: '2rem' }}></i>
                                            <p className="mt-2 mb-0">No saved addresses yet. Add one to continue.</p>
                                        </div>
                                    ) : (
                                        <>
                                            {(showAllAddresses ? addresses : addresses.slice(0, 2)).map((address) =>
                                                editingAddressId === address.id ? (
                                                    // Edit Address Form
                                                    <div key={address.id} className="address-form-card mb-16">
                                                        <div className="d-flex justify-content-between align-items-center mb-20">
                                                            <h6 className="mb-0">Edit Address</h6>
                                                            <button
                                                                className="btn-close"
                                                                onClick={handleCancelEdit}
                                                            ></button>
                                                        </div>
                                                        <form onSubmit={handleUpdateAddress}>
                                                            <div className="row gy-3">
                                                                <div className="col-12">
                                                                    <label className="text-sm mb-2">Address Type</label>
                                                                    <div className="d-flex gap-12">
                                                                        <label className="address-type-radio">
                                                                            <input
                                                                                type="radio"
                                                                                name="type"
                                                                                value="Home"
                                                                                checked={editAddress.type === 'Home'}
                                                                                onChange={handleEditAddressChange}
                                                                            />
                                                                            <span><i className="ph ph-house me-2"></i>Home</span>
                                                                        </label>
                                                                        <label className="address-type-radio">
                                                                            <input
                                                                                type="radio"
                                                                                name="type"
                                                                                value="Office"
                                                                                checked={editAddress.type === 'Office'}
                                                                                onChange={handleEditAddressChange}
                                                                            />
                                                                            <span><i className="ph ph-briefcase me-2"></i>Office</span>
                                                                        </label>
                                                                        <label className="address-type-radio">
                                                                            <input
                                                                                type="radio"
                                                                                name="type"
                                                                                value="Other"
                                                                                checked={editAddress.type === 'Other'}
                                                                                onChange={handleEditAddressChange}
                                                                            />
                                                                            <span><i className="ph ph-map-pin me-2"></i>Other</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6">
                                                                    <label className="text-sm mb-2">Full Name <span className="text-danger">*</span></label>
                                                                    <input
                                                                        type="text"
                                                                        name="name"
                                                                        className={`common-input ${formErrors.editAddress?.name ? 'is-invalid' : ''}`}
                                                                        placeholder="Enter full name"
                                                                        value={editAddress.name}
                                                                        onChange={handleEditAddressChange}
                                                                        maxLength={60}
                                                                        required
                                                                    />
                                                                    {formErrors.editAddress?.name && (
                                                                        <small className="text-danger d-block mt-1">{formErrors.editAddress.name}</small>
                                                                    )}
                                                                </div>
                                                                <div className="col-sm-6">
                                                                    <label className="text-sm mb-2">Phone Number <span className="text-danger">*</span></label>
                                                                    <input
                                                                        type="tel"
                                                                        name="phone"
                                                                        className={`common-input ${formErrors.editAddress?.phone ? 'is-invalid' : ''}`}
                                                                        placeholder="Enter phone number"
                                                                        value={editAddress.phone}
                                                                        onChange={handleEditAddressChange}
                                                                        inputMode="numeric"
                                                                        pattern="[0-9]{10}"
                                                                        maxLength={10}
                                                                        required
                                                                    />
                                                                    {formErrors.editAddress?.phone && (
                                                                        <small className="text-danger d-block mt-1">{formErrors.editAddress.phone}</small>
                                                                    )}
                                                                </div>
                                                                <div className="col-12">
                                                                    <label className="text-sm mb-2">Address Line 1 <span className="text-danger">*</span></label>
                                                                    <input
                                                                        type="text"
                                                                        name="address_line1"
                                                                        className={`common-input ${formErrors.editAddress?.address_line1 ? 'is-invalid' : ''}`}
                                                                        placeholder="House number, street name"
                                                                        value={editAddress.address_line1}
                                                                        onChange={handleEditAddressChange}
                                                                        maxLength={120}
                                                                        required
                                                                    />
                                                                    {formErrors.editAddress?.address_line1 && (
                                                                        <small className="text-danger d-block mt-1">{formErrors.editAddress.address_line1}</small>
                                                                    )}
                                                                </div>
                                                                <div className="col-12">
                                                                    <label className="text-sm mb-2">Address Line 2</label>
                                                                    <input
                                                                        type="text"
                                                                        name="address_line2"
                                                                        className={`common-input ${formErrors.editAddress?.address_line2 ? 'is-invalid' : ''}`}
                                                                        placeholder="Apartment, suite, etc. (optional)"
                                                                        value={editAddress.address_line2 || ''}
                                                                        onChange={handleEditAddressChange}
                                                                        maxLength={120}
                                                                    />
                                                                    {formErrors.editAddress?.address_line2 && (
                                                                        <small className="text-danger d-block mt-1">{formErrors.editAddress.address_line2}</small>
                                                                    )}
                                                                </div>
                                                                <div className="col-sm-6">
                                                                    <label className="text-sm mb-2">City <span className="text-danger">*</span></label>
                                                                    <input
                                                                        type="text"
                                                                        name="city"
                                                                        className={`common-input ${formErrors.editAddress?.city ? 'is-invalid' : ''}`}
                                                                        placeholder="Enter city"
                                                                        value={editAddress.city}
                                                                        onChange={handleEditAddressChange}
                                                                        maxLength={50}
                                                                        required
                                                                    />
                                                                    {formErrors.editAddress?.city && (
                                                                        <small className="text-danger d-block mt-1">{formErrors.editAddress.city}</small>
                                                                    )}
                                                                </div>
                                                                <div className="col-sm-6">
                                                                    <label className="text-sm mb-2">State <span className="text-danger">*</span></label>
                                                                    <input
                                                                        type="text"
                                                                        name="state"
                                                                        className={`common-input ${formErrors.editAddress?.state ? 'is-invalid' : ''}`}
                                                                        placeholder="Enter state"
                                                                        value={editAddress.state}
                                                                        onChange={handleEditAddressChange}
                                                                        maxLength={50}
                                                                        required
                                                                    />
                                                                    {formErrors.editAddress?.state && (
                                                                        <small className="text-danger d-block mt-1">{formErrors.editAddress.state}</small>
                                                                    )}
                                                                </div>
                                                                <div className="col-12">
                                                                    <label className="text-sm mb-2">Pin Code <span className="text-danger">*</span></label>
                                                                    <input
                                                                        type="text"
                                                                        name="postal_code"
                                                                        className={`common-input ${formErrors.editAddress?.postal_code ? 'is-invalid' : ''}`}
                                                                        placeholder="Enter pin code"
                                                                        value={editAddress.postal_code}
                                                                        onChange={handleEditAddressChange}
                                                                        inputMode="numeric"
                                                                        pattern="[0-9]{6}"
                                                                        maxLength={6}
                                                                        required
                                                                    />
                                                                    {formErrors.editAddress?.postal_code && (
                                                                        <small className="text-danger d-block mt-1">{formErrors.editAddress.postal_code}</small>
                                                                    )}
                                                                </div>
                                                                <div className="col-12">
                                                                    <div className="form-check">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            name="is_default"
                                                                            id="editMakeDefault"
                                                                            checked={editAddress.is_default === 1}
                                                                            onChange={handleEditAddressChange}
                                                                        />
                                                                        <label className="form-check-label text-sm" htmlFor="editMakeDefault">
                                                                            Make this my default address
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12">
                                                                    <div className="d-flex gap-12">
                                                                        <button type="submit" className="btn btn-main flex-grow-1">
                                                                            <i className="ph ph-check me-2"></i>
                                                                            Update Address
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className=" btn-outline-gray"
                                                                            onClick={handleCancelEdit}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                ) : (
                                                    // Display Address Card
                                                    <div
                                                        key={address.id}
                                                        className={`address-card ${selectedAddressId === address.id ? 'selected' : ''
                                                            }`}
                                                        onClick={() => handleAddressSelect(address.id)}
                                                    >
                                                        <div className="address-card-header">
                                                            <div className="d-flex align-items-center gap-12">
                                                                <input
                                                                    type="radio"
                                                                    name="selectedAddress"
                                                                    checked={selectedAddressId === address.id}
                                                                    onChange={() => handleAddressSelect(address.id)}
                                                                    className="form-check-input m-0"
                                                                />
                                                                <div className="address-type-badge">
                                                                    {address.type === 'Home' && <i className="ph-fill ph-house"></i>}
                                                                    {address.type === 'Office' && <i className="ph-fill ph-briefcase"></i>}
                                                                    {address.type === 'Other' && <i className="ph-fill ph-map-pin"></i>}
                                                                    <span>{address.type}</span>
                                                                </div>
                                                                {address.is_default === 1 && (
                                                                    <span className="default-badge">Default</span>
                                                                )}
                                                            </div>
                                                            <div className="d-flex gap-8">
                                                                <button
                                                                    className="btn-edit"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEditAddress(address);
                                                                    }}
                                                                    title="Edit address"
                                                                >
                                                                    <i className="ph ph-pencil-simple"></i>
                                                                </button>
                                                                <button
                                                                    className="btn-delete"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteAddress(address.id);
                                                                    }}
                                                                    title="Delete address"
                                                                >
                                                                    <i className="ph ph-trash"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="address-card-body">
                                                            <h6 className="mb-8">{address.name}</h6>
                                                            <p className="text-sm text-gray-600 mb-4">
                                                                <i className="ph ph-phone me-2"></i>
                                                                {address.phone}
                                                            </p>
                                                            <p className="text-sm text-gray-700 mb-4">
                                                                {address.address_line1}
                                                                {address.address_line2 && `, ${address.address_line2}`}
                                                            </p>
                                                            <p className="text-sm text-gray-600 mb-0">
                                                                {address.city}, {address.state} - {address.postal_code}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            )}

                                            {addresses.length > 2 && (
                                                <div className="text-center mt-16">
                                                    <button
                                                        className="btn btn-outline-main btn-sm"
                                                        onClick={() => setShowAllAddresses(!showAllAddresses)}
                                                    >
                                                        <i className={`ph ${showAllAddresses ? 'ph-caret-up' : 'ph-caret-down'} me-2`}></i>
                                                        {showAllAddresses ? 'Show Less' : `View All Addresses (${addresses.length})`}
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className='mt-30'>
                                <Heading
                                    title="Related Products"
                                    size="small"
                                    subtitle="You may like these products too"
                                    showViewAll={true}
                                />
                                <div className="row g-12">
                                    {productsLoading ? (
                                        <p>Loading products...</p>
                                    ) : (
                                        products.slice(0, 4).map((product) => (
                                            <div className="col-6 col-md-3" key={product.id}>
                                                <Product product={product} />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                        </div>


                        <div className="col-xl-4 col-lg-5">
                            <div className="checkout-sidebar border border-gray-100 rounded-8 px-24 py-40 pt-0">
                                <Link
                                    to={'/cart'}
                                    className="back-to-cart-btn d-flex align-items-center gap-8 text-decoration-none text-gray-600 hover-text-main-600 py-16 mb-16 border-bottom border-gray-100"
                                >
                                    <i className="ph ph-arrow-left"></i>
                                    <span className="text-sm fw-medium">Your Cart</span>
                                </Link>
                                <h6 className="text-xl mb-32">Your Order</h6>

                                <div className="d-flex align-items-center justify-content-between mb-16">
                                    <label className="d-flex align-items-center gap-8 text-sm text-gray-700 m-0">
                                        <input
                                            type="checkbox"
                                            className="form-check-input m-0"
                                            checked={allItemsSelected}
                                            onChange={(e) => handleSelectAllItems(e.target.checked)}
                                        />
                                        Select all products
                                    </label>
                                    <span className="text-xs text-gray-500">
                                        {selectedCartItems.length}/{cartItems.length} selected
                                    </span>
                                </div>

                                {/* Order Items */}
                                <div className="mb-32">
                                    {cartItems.map((item) => (
                                        <div key={getCartItemId(item)} className="checkout-product position-relative d-flex align-items-center gap-16 mb-16 pb-16 border-bottom border-gray-100">
                                            <input
                                                type="checkbox"
                                                className="form-check-input m-0"
                                                checked={selectedCartItemIds.includes(getCartItemId(item))}
                                                onChange={() => handleSelectItem(getCartItemId(item))}
                                                onClick={(e) => e.stopPropagation()}
                                                aria-label={`Select ${item.product?.name || 'product'}`}
                                            />
                                            <div className="checkout-product__thumb">
                                                <img
                                                    src={getProductImage(item.product)}
                                                    alt={item.product?.name || 'Product'}
                                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                                                />
                                            </div>
                                            <div className="checkout-product__content flex-grow-1">
                                                <h6 className="text-sm mb-8 text-line-2">
                                                    {/* {item.product?.name || 'Product Name'} */}

                                                    <Toolkit text={item.product?.name || 'Product Name'} maxLength={22} ></Toolkit>
                                                </h6>
                                                <div className="d-flex justify-content-between">
                                                    <span className="text-gray-600 text-sm">Qty: {item.quantity}</span>
                                                    <span className="text-gray-900 fw-semibold">
                                                        &#8377; {calculateSubtotal(item)}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Remove button - positioned absolutely */}
                                            <button
                                                type="button"
                                                title={isRemoving && removingItemId === item.cart_id ? 'Removing...' : 'Remove Item'}
                                                className=" btn-sm m-2 text-danger"
                                                onClick={() => handleRemoveItem(item.cart_id)}
                                                disabled={isRemoving && removingItemId === item.cart_id}
                                                style={{
                                                    cursor: (isRemoving && removingItemId === item.cart_id) ? 'not-allowed' : 'pointer',
                                                    zIndex: 1,
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: '#dc3545',
                                                    opacity: (isRemoving && removingItemId === item.cart_id) ? 0.6 : 1
                                                }}
                                            >
                                                {(isRemoving && removingItemId === item.cart_id) ? (
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                ) : (
                                                    <i className="ph ph-x-circle" style={{ fontSize: '1.5rem' }}></i>
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Totals */}
                                <div className="bg-color-three rounded-8 p-24 mb-24">
                                    <div className="mb-16 flex-between gap-8">
                                        <span className="text-gray-900 font-heading-two">Subtotal</span>
                                        <span className="text-gray-900 fw-semibold">&#8377; {selectedSubtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="mb-16 flex-between gap-8">
                                        <span className="text-gray-900 font-heading-two">Items</span>
                                        <span className="text-gray-900 fw-semibold">{selectedTotalItems} items</span>
                                    </div>
                                    <div className="mb-16 flex-between gap-8">
                                        <span className="text-gray-900 font-heading-two">Shipping <br></br>
                                            <i style={{ fontSize: '0.675rem', color: '#6c757d' }}>Above &#8377;999+ Free</i>
                                        </span>
                                        <span className={`${calculateShipping() === 0 ? 'text-success' : 'text-black'} fw-semibold`}>&#8377;{calculateShipping() === 0 ? 'Free' : `${calculateShipping()}`}</span>
                                    </div>

                                    {/* Delivery Type Selection */}
                                    <div className="mb-16">
                                        <span className="text-gray-900 font-heading-two d-block mb-8">Delivery Type</span>
                                        {deliveryTypesLoading ? (
                                            <div className="d-flex align-items-center gap-8">
                                                <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                                                <small className="text-gray-500">Loading...</small>
                                            </div>
                                        ) : deliveryTypesError ? (
                                            <small className="text-danger">Error loading delivery types</small>
                                        ) : (
                                            <div className="delivery-type-options">
                                                {deliveryTypes?.data?.map((type) => (
                                                    <label
                                                        key={type.id}
                                                        className={`delivery-type-item d-flex align-items-center gap-8 py-6 px-8 rounded-4 mb-6 cursor-pointer ${selectedType === type.type ? 'bg-main-50 border border-main-200' : 'border border-gray-100'}`}
                                                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="deliveryType"
                                                            value={type.type}
                                                            checked={selectedType === type.type}
                                                            onChange={(e) => setSelectedType(e.target.value)}
                                                            className="form-check-input m-0"
                                                            style={{ width: '14px', height: '14px' }}
                                                        />
                                                        <span className="text-xs text-gray-700 flex-grow-1 text-capitalize">{type.type}</span>
                                                        <span className={`text-xs fw-semibold ${type.charge === 0 ? 'text-success' : 'text-gray-900'}`}>
                                                            {type.charge === 0 ? 'Free' : `₹${type.charge}`}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-between gap-8">
                                        <span className="text-gray-900 font-heading-two">Delivery Charge</span>
                                        <span className={`fw-semibold ${getDeliveryCharge() === 0 ? 'text-success' : 'text-gray-900'}`}>
                                            {getDeliveryCharge() === 0 ? 'Free' : `₹${getDeliveryCharge()}`}
                                        </span>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="mb-0 flex-between gap-8">
                                            <span className="text-success font-heading-two">
                                                Discount ({appliedCoupon.code})
                                            </span>
                                            <span className="text-success fw-semibold">
                                                - &#8377; {getDiscountAmount().toFixed(2)}
                                            </span>
                                        </div>
                                    )}

                                    {/* <div className="mb-0 flex-between gap-8">
                                        <span className="text-gray-900 font-heading-two">Tax (4%)</span>
                                        <span className="text-gray-900 fw-semibold">&#8377; {calculateTax()}</span>
                                    </div> */}

                                </div>

                                <div className="bg-color-three rounded-8 p-24 mb-32">
                                    <ApplyCoupon
                                        cartItems={selectedCartItems}
                                        cartSubtotal={selectedSubtotal}
                                        onCouponApplied={(couponData) => {
                                            setAppliedCoupon(couponData);
                                            if (couponData) {
                                                console.log('Coupon applied:', couponData);
                                            }
                                        }}
                                    />
                                </div>


                                <div className="bg-color-three rounded-8 p-24 mb-32">
                                    <div className="flex-between gap-8">
                                        <span className="text-gray-900 text-xl fw-bold">Total</span>
                                        <span className="text-main-600 text-xl fw-bold">&#8377; {calculateGrandTotalWithDiscount()}</span>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="mb-32">
                                    <h6 className="text-lg mb-16">Payment Method</h6>
                                    <div className="payment-method">
                                        {/* Cash on Delivery */}
                                        {/* <div className="form-check mb-16">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="paymentMethod"
                                                id="cod"
                                                value="cod"
                                                checked={paymentMethod === 'cod'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <label className="form-check-label fw-medium text-neutral-600" htmlFor="cod">
                                                <i className="ph-fill ph-money me-2"></i>
                                                Cash on Delivery (COD)
                                            </label>
                                        </div> */}
                                        {/* {paymentMethod === 'cod' && (
                                            <div className="payment-info bg-success-50 px-16 py-12 rounded-8 mb-16">
                                                <p className="text-sm text-gray-700 mb-2">
                                                    <i className="ph-fill ph-check-circle me-2 text-success"></i>
                                                    <strong>Pay with Cash on Delivery</strong>
                                                </p>
                                                <p className="text-sm text-gray-600 mb-0">
                                                    • Pay with cash when your order is delivered<br />
                                                    • No advance payment required<br />
                                                    • Extra charges may apply for COD orders
                                                </p>
                                            </div>
                                        )} */}

                                        {/* Online Payment via Backend API */}
                                        <div className="form-check mb-16">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="paymentMethod"
                                                id="razorpay"
                                                value="razorpay"
                                                checked={paymentMethod === 'razorpay'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <label className="form-check-label fw-medium text-neutral-600" htmlFor="razorpay">
                                                <i className="ph-fill ph-credit-card me-2"></i>
                                                Online Payment (UPI, Card, Wallet)
                                            </label>
                                        </div>
                                        {paymentMethod === 'razorpay' && (
                                            <div className="payment-info bg-main-50 px-16 py-12 rounded-8">
                                                <p className="text-sm text-gray-700 mb-2">
                                                    <i className="ph ph-shield-check me-2 text-success"></i>
                                                    <strong>Secure Online Payment</strong>
                                                </p>
                                                <p className="text-sm text-gray-600 mb-0">
                                                    • Pay using UPI, Credit/Debit Card, Net Banking, or Wallets<br />
                                                    • Instant order confirmation
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    type="button"
                                    className="btn btn-main w-100 rounded-8 py-18"
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing || placeOrderLoading || verifyPaymentLoading || selectedCartItems.length === 0}
                                >
                                    {(isProcessing || placeOrderLoading || verifyPaymentLoading) ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            {placeOrderLoading ? 'Creating Order...' : verifyPaymentLoading ? 'Verifying Payment...' : 'Processing...'}
                                        </>
                                    ) : (
                                        <>
                                            {paymentMethod === 'cod' ? (
                                                <>
                                                    <i className="ph-fill ph-check-circle me-2"></i>
                                                    Place Order (Pay on Delivery)
                                                </>
                                            ) : (
                                                <>
                                                    <i className="ph ph-lock-simple me-2"></i>
                                                    Proceed to Payment
                                                </>
                                            )}
                                        </>
                                    )}
                                </button>

                                <div className="text-center mt-10">
                                    <small className="text-gray-600">
                                        <i className="ph ph-shield-check me-1"></i>
                                        {paymentMethod === 'cod' ? '100% Safe & Secure Shopping' : '100% Secure Payment'}
                                    </small>
                                    <img src="/images/onlinePaymentoption.png" className=' img-fluid mt-10' alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Checkout;
