import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error for debugging
        console.error('ProductImages Error Boundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return (
                <div className="product-details__left">
                    <div
                        className="product-details__thumb-slider border border-gray-100 rounded-16"
                        style={{
                            padding: '20px',
                            minHeight: '400px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}
                    >
                        <div className="text-danger mb-3">
                            <i className="ph ph-warning-circle" style={{ fontSize: '48px' }}></i>
                        </div>
                        <h5 className="text-muted mb-2">Image Display Error</h5>
                        <p className="text-muted mb-3">
                            We're having trouble displaying the product images. Please try refreshing the page.
                        </p>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                                this.setState({ hasError: false, error: null, errorInfo: null });
                                window.location.reload();
                            }}
                        >
                            Refresh Page
                        </button>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-3" style={{ fontSize: '12px', textAlign: 'left' }}>
                                <summary>Error Details (Development)</summary>
                                <pre className="text-danger mt-2">
                                    {this.state.error && this.state.error.toString()}
                                    <br />
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;