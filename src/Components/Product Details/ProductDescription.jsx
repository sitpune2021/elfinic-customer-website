import React from 'react'
import './ProductDescription.css'

function ProductDescription() {
    return (
        <table className="product-details-table">
            <thead>
                <tr>
                    <th colSpan="2">
                        Product Details
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="label-column">Brand</td>
                    <td className="value-column">Half Moon</td>
                </tr>
                <tr>
                    <td className="label-column">Color</td>
                    <td className="value-column">Silver Grey</td>
                </tr>
                <tr>
                    <td className="label-column">Item Weight</td>
                    <td className="value-column">600 g</td>
                </tr>
                <tr>
                    <td className="label-column">Net Quantity</td>
                    <td className="value-column">1 Count</td>
                </tr>
                <tr>
                    <td className="label-column">Country of Origin</td>
                    <td className="value-column">India</td>
                </tr>
                <tr>
                    <td className="label-column">Manufacturer</td>
                    <td className="value-column">Amazing Bags</td>
                </tr>
                <tr>
                    <td className="label-column">Item Dimensions LxWxH</td>
                    <td className="value-column">22 x 30 x 50 Centimeters</td>
                </tr>
            </tbody>
        </table>

    )
}

export default ProductDescription