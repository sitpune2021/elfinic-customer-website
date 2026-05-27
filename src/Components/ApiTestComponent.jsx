import React from 'react';
import { useApi } from '../hooks/useApi';

const ApiTestComponent = () => {
    const {
        categories,
        categoriesLoading,
        categoriesError,
        products,
        productsLoading,
        productsError,
        fetchCategories,
        fetchProducts,
        refreshAllData
    } = useApi();

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
            <h2>API Test Component</h2>

            {/* Categories Section */}
            <div style={{ marginBottom: '30px' }}>
                <h3>Categories</h3>
                <button onClick={fetchCategories} disabled={categoriesLoading}>
                    {categoriesLoading ? 'Loading...' : 'Refresh Categories'}
                </button>

                {categoriesError && (
                    <div style={{ color: 'red', margin: '10px 0' }}>
                        Error: {categoriesError}
                    </div>
                )}

                {categoriesLoading ? (
                    <p>Loading categories...</p>
                ) : (
                    <div>
                        <p>Categories Count: {categories.length}</p>
                        <pre style={{ background: '#f5f5f5', padding: '10px', maxHeight: '200px', overflow: 'auto' }}>
                            {JSON.stringify(categories, null, 2)}
                        </pre>
                    </div>
                )}
            </div>

            {/* Products Section */}
            <div style={{ marginBottom: '30px' }}>
                <h3>Products</h3>
                <button onClick={fetchProducts} disabled={productsLoading}>
                    {productsLoading ? 'Loading...' : 'Refresh Products'}
                </button>

                {productsError && (
                    <div style={{ color: 'red', margin: '10px 0' }}>
                        Error: {productsError}
                    </div>
                )}

                {productsLoading ? (
                    <p>Loading products...</p>
                ) : (
                    <div>
                        <p>Products Count: {products.length}</p>
                        <pre style={{ background: '#f5f5f5', padding: '10px', maxHeight: '200px', overflow: 'auto' }}>
                            {JSON.stringify(products, null, 2)}
                        </pre>
                    </div>
                )}
            </div>

            {/* Refresh All Button */}
            <button
                onClick={refreshAllData}
                disabled={categoriesLoading || productsLoading}
                style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}
            >
                {(categoriesLoading || productsLoading) ? 'Loading...' : 'Refresh All Data'}
            </button>
        </div>
    );
};

export default ApiTestComponent;
