import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getallDeliveryType,
    selectDeliveryTypes,
    selectDeliveryTypesLoading,
    selectDeliveryTypesError
} from '../store/slices/apiSlice';

const DeliveryTypesComponent = () => {
    const dispatch = useDispatch();
    const [selectedDelivery, setSelectedDelivery] = useState('');

    // Use specific selectors for delivery types
    const deliveryTypes = useSelector(selectDeliveryTypes);
    const loading = useSelector(selectDeliveryTypesLoading);
    const error = useSelector(selectDeliveryTypesError);

    // Fetch delivery types when component mounts
    useEffect(() => {
        dispatch(getallDeliveryType());
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(getallDeliveryType());
    };

    const handleDeliverySelect = (deliveryId) => {
        setSelectedDelivery(deliveryId);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <p>Loading delivery types...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>Error loading delivery types: {error}</p>
                <button onClick={handleRefresh}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="delivery-types-container">
            <div className="header">
                <h2>Available Delivery Types</h2>
                <button onClick={handleRefresh}>Refresh</button>
            </div>


            {deliveryTypes ? (
                <div className="delivery-types-content">
                    {/* Check if we have delivery types data */}
                    {deliveryTypes.success && deliveryTypes.data ? (
                        <div className="delivery-list">
                            <h3>Choose Delivery Option:</h3>


                        </div>
                    ) : (
                        <div>
                            <p>No delivery types available</p>
                            <p>API Response Status: {deliveryTypes.success ? 'Success' : 'Failed'}</p>
                            {deliveryTypes.message && <p>Message: {deliveryTypes.message}</p>}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <p>No data loaded yet</p>
                    <button onClick={handleRefresh}>Load Delivery Types</button>
                </div>
            )}
        </div>
    );
};

export default DeliveryTypesComponent;