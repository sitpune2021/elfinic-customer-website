import React from 'react'

function SizeChart() {
    const sizeData = [
        { size: 'S', chest: '36-38', waist: '30-32', length: '27-28' },
        { size: 'M', chest: '38-40', waist: '32-34', length: '28-29' },
        { size: 'L', chest: '40-42', waist: '34-36', length: '29-30' },
        { size: 'XL', chest: '42-44', waist: '36-38', length: '30-31' }
    ];

    return (
        <div className="">
            <div className="mb-3">
                <h6 className="text-gray-900 fw-semibold mb-3">
                    <i className="ph ph-ruler me-2"></i>
                    Size Chart
                </h6>
                <div className="w-100 rounded-8 border border-gray-100 p-3">
                    {/* Mobile View - Compact Design */}
                    <div className="d-block d-sm-none">
                        <div className="text-center small">
                            <div className="bg-gray-50 p-2 rounded-8 mb-2 fw-semibold">
                                Size Measurements (inches)
                            </div>
                            {sizeData.map((item, index) => (
                                <div key={index} className="border-bottom border-gray-200 py-2">
                                    <div className="fw-medium mb-1">{item.size}</div>
                                    <div className="d-flex justify-content-around text-muted">
                                        <span>C: {item.chest}</span>
                                        <span>W: {item.waist}</span>
                                        <span>L: {item.length}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Small Mobile View - Ultra Compact */}
                    <div className="d-none d-sm-block d-md-none">
                        <div className="row g-1 text-center small">
                            <div className="col-12 bg-gray-50 p-2 rounded-8 mb-1 fw-semibold">
                                <div className="row">
                                    <div className="col-3">Size</div>
                                    <div className="col-3">Chest</div>
                                    <div className="col-3">Waist</div>
                                    <div className="col-3">Length</div>
                                </div>
                            </div>
                            {sizeData.map((item, index) => (
                                <div key={index} className="col-12">
                                    <div className="border border-gray-200 p-2 rounded-8 mb-1">
                                        <div className="row align-items-center">
                                            <div className="col-3 fw-medium">{item.size}</div>
                                            <div className="col-3">{item.chest}</div>
                                            <div className="col-3">{item.waist}</div>
                                            <div className="col-3">{item.length}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tablet & Desktop View */}
                    <div className="d-none d-md-block">
                        <div className="table-responsive">
                            <table className="table table-bordered mb-0 small">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="fw-semibold px-3 py-2">Size</th>
                                        <th className="fw-semibold px-3 py-2">Chest (in)</th>
                                        <th className="fw-semibold px-3 py-2">Waist (in)</th>
                                        <th className="fw-semibold px-3 py-2">Length (in)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sizeData.map((item, index) => (
                                        <tr key={index}>
                                            <td className="fw-medium px-3 py-2">{item.size}</td>
                                            <td className="px-3 py-2">{item.chest}</td>
                                            <td className="px-3 py-2">{item.waist}</td>
                                            <td className="px-3 py-2">{item.length}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default SizeChart