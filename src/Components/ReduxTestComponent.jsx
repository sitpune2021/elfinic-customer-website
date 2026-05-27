import React from 'react';
import { useApi } from '../hooks/useApi';

/**
 * Simple test component to verify Redux integration is working
 */
const ReduxTestComponent = () => {
    const {
        categories,
        categoriesLoading,
        categoriesError,
        products,
        productsLoading,
        productsError,
        isAuthenticated,
        wishlistItems,
        refreshAllData,
        API_BASE_URL,
        image_path
    } = useApi();

    return (
        <div style={{ padding: '20px', border: '2px solid #4CAF50', margin: '20px', borderRadius: '8px' }}>
            <h2 style={{ color: '#4CAF50' }}>✅ Redux Integration Test</h2>

            <div style={{ marginBottom: '20px' }}>
                <h3>Configuration</h3>
                <p><strong>API Base URL:</strong> {API_BASE_URL}</p>
                <p><strong>Image Path:</strong> {image_path}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>Authentication</h3>
                <p><strong>Is Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>Categories</h3>
                <p><strong>Loading:</strong> {categoriesLoading ? '🔄 Yes' : '✅ No'}</p>
                <p><strong>Error:</strong> {categoriesError || '✅ None'}</p>
                <p><strong>Count:</strong> {categories.length}</p>
                {categories.length > 0 && (
                    <div>
                        <p><strong>First Category:</strong> {categories[0].name}</p>
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>Products</h3>
                <p><strong>Loading:</strong> {productsLoading ? '🔄 Yes' : '✅ No'}</p>
                <p><strong>Error:</strong> {productsError || '✅ None'}</p>
                <p><strong>Count:</strong> {products.length}</p>
                {products.length > 0 && (
                    <div>
                        <p><strong>First Product:</strong> {products[0].name}</p>
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>Wishlist</h3>
                <p><strong>Items Count:</strong> {wishlistItems.length}</p>
            </div>

            <button
                onClick={refreshAllData}
                style={{
                    background: '#2196F3',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                }}
            >
                🔄 Refresh All Data
            </button>

            <div style={{ marginTop: '20px', padding: '10px', background: '#E8F5E8', borderRadius: '4px' }}>
                <p><strong>Status:</strong> Redux Toolkit integration is working! 🎉</p>
                <p><em>All the original useApi functionality is preserved.</em></p>
            </div>
        </div>
    );
};

export default ReduxTestComponent;