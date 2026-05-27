import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import useApi from '../../../hooks/useApi';
import axios from 'axios';

function DownloadInvoice({ orderID, order_number }) {
    const { API_BASE_URL } = useApi();
    const [isLoading, setIsLoading] = useState(false);
    console.log("DownloadInvoice props:", { orderID });
    const user = localStorage.getItem("user");


    const handleDownloadInvoice = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login again");
                return;
            }

            const response = await axios.get(
                `${API_BASE_URL}/DownloadOrderInvoice`,
                {
                    params: {
                        order_id: orderID,
                        user_id: user ? JSON.parse(user).id : null,
                    },
                    responseType: "blob",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );


            // Create file
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `invoice_${order_number}.pdf`);
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error downloading invoice:", error);
            alert(
                error.response?.data?.message || "Failed to download invoice"
            );
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <button onClick={handleDownloadInvoice} className="download-invoice-btn">
            <FaDownload />
            <span>{isLoading ? 'Downloading...' : 'Download Invoice'}</span>
        </button>
    );
}

export default DownloadInvoice;
