import React, { useEffect } from 'react';
import { useApi } from '../hooks/useApi';

function BrandsTest() {
    const {
        brands,
        brandsLoading,
        brandsError,
        fetchBrands,
        image_path
    } = useApi();

    useEffect(() => {
        console.log('BrandsTest mounted, fetching brands...');
        fetchBrands();
    }, [fetchBrands]);

    useEffect(() => {
        console.log('Brands data updated:', {
            brands,
            brandsLoading,
            brandsError,
            image_path
        });
    }, [brands, brandsLoading, brandsError, image_path]);

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
            <h2>Brands API Test</h2>

            <div style={{ marginBottom: '20px' }}>
                <h3>Status:</h3>
                <p>Loading: {brandsLoading ? 'Yes' : 'No'}</p>
                <p>Error: {brandsError || 'None'}</p>
                <p>Brands Count: {brands ? brands.length : 0}</p>
                <p>Image Path: {image_path}</p>
            </div>

            <button onClick={fetchBrands} disabled={brandsLoading}>
                {brandsLoading ? 'Loading...' : 'Refresh Brands'}
            </button>

            {brandsError && (
                <div style={{ color: 'red', margin: '10px 0' }}>
                    Error: {brandsError}
                </div>
            )}

            {brands && brands.length > 0 && (
                <div>
                    <h3>Brands Data:</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                        {brands.map((brand) => (
                            <div key={brand.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
                                <h4>{brand.name}</h4>
                                <p>ID: {brand.id}</p>
                                <p>Status: {brand.status}</p>
                                <p>Description: {brand.description || 'None'}</p>
                                {brand.image && (
                                    <div>
                                        <p>Image: {brand.image}</p>
                                        <img
                                            src={`${image_path}${brand.image}`}
                                            alt={brand.name}
                                            style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain' }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                        <div style={{ display: 'none', color: 'red' }}>
                                            Image failed to load
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!brandsLoading && (!brands || brands.length === 0) && (
                <p>No brands found.</p>
            )}
        </div>
    );
}

export default BrandsTest;