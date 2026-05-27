import axios from 'axios'
import React, { useEffect, useState } from 'react'
import formatDate from '../External-lab/DateFormat';

function ExpectedDate({ pickup_postcode, delivery_postcode, weight, cod = 0 }) {
    console.log('ExpectedDate Props:', { pickup_postcode, delivery_postcode, weight, cod });
    const baseurl = import.meta.env.VITE_API_BASE_URL;
    const [expectedData, setExpectedData] = useState(null);
    useEffect(() => {
        const fetchExpectedDate = async () => {
            try {
                const queryParams = `?pickup_postcode=${pickup_postcode}&delivery_postcode=${delivery_postcode}&weight=${weight}&cod=${cod}`;
                const response = await axios.get(`${baseurl}/productDeliveryExpectedDate${queryParams}`);
                setExpectedData(response.data);
            } catch (error) {
                console.error('Error fetching expected date:', error);
            }
        }
        if (pickup_postcode && delivery_postcode) {
            fetchExpectedDate();
        }
    }, [pickup_postcode, delivery_postcode, weight, cod])


    return (
        <div>
            {expectedData?.data ? (
                <span className="text-gray-500">
                    {formatDate(expectedData?.data?.expected_delivery_date)}
                </span>
            ) : (
                <span className="text-gray-500">5-7 days</span>
            )}
        </div>
    )
}

export default ExpectedDate