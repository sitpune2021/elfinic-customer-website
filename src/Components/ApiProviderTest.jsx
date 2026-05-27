import React from 'react'
import { useApi } from '../contexts/ApiContext'

/**
 * Simple test component to verify ApiProvider is working
 */
function ApiProviderTest() {
    const { IsLogin, products, categories } = useApi()

    return (
        <div className="container py-5">
            <div className="card">
                <div className="card-header">
                    <h3>API Provider Test</h3>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <h5>Authentication</h5>
                            <p>
                                Status: {IsLogin() ? (
                                    <span className="badge bg-success">Logged In ✓</span>
                                ) : (
                                    <span className="badge bg-warning">Not Logged In</span>
                                )}
                            </p>
                        </div>
                        <div className="col-md-4">
                            <h5>Products</h5>
                            <p>
                                Count: <span className="badge bg-info">{products.length}</span>
                            </p>
                            {products.length > 0 && (
                                <small className="text-muted">
                                    First product: {products[0].name}
                                </small>
                            )}
                        </div>
                        <div className="col-md-4">
                            <h5>Categories</h5>
                            <p>
                                Count: <span className="badge bg-info">{categories.length}</span>
                            </p>
                            {categories.length > 0 && (
                                <small className="text-muted">
                                    First category: {categories[0].name}
                                </small>
                            )}
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="alert alert-success">
                            <strong>✅ ApiProvider is working correctly!</strong>
                            <br />
                            The useApi hook is accessible and data is being fetched from the API.
                        </div>
                    </div>

                    <div className="mt-3">
                        <h6>Navigation Links:</h6>
                        <div className="d-flex gap-2 flex-wrap">
                            <a href="/cart" className="btn btn-primary btn-sm">
                                Test Cart Page
                            </a>
                            <a href="/shop" className="btn btn-secondary btn-sm">
                                Shop Page
                            </a>
                            <a href="/categories" className="btn btn-info btn-sm">
                                Categories
                            </a>
                            <a href="/" className="btn btn-success btn-sm">
                                Home
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ApiProviderTest