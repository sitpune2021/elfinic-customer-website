import React from 'react';
import './ReviewPagination.css';

function ReviewPagination({ currentPage, totalReviews, limit, onPageChange }) {
    const totalPages = Math.ceil(totalReviews / limit);
    
    // Don't show pagination if there's only one page or no reviews
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        
        if (totalPages <= maxPagesToShow) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show first, last, current and adjacent pages
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        
        return pages;
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="review-pagination">
            <nav aria-label="Review pagination">
                <ul className="pagination justify-content-center mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                            className="page-link" 
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            aria-label="Previous"
                        >
                            <i className="ph ph-caret-left"></i>
                            <span className="d-none d-sm-inline ms-1">Previous</span>
                        </button>
                    </li>
                    
                    {pageNumbers.map((page, index) => (
                        page === '...' ? (
                            <li key={`ellipsis-${index}`} className="page-item disabled d-none d-md-block">
                                <span className="page-link">...</span>
                            </li>
                        ) : (
                            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                <button 
                                    className="page-link"
                                    onClick={() => onPageChange(page)}
                                >
                                    {page}
                                </button>
                            </li>
                        )
                    ))}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button 
                            className="page-link" 
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            aria-label="Next"
                        >
                            <span className="d-none d-sm-inline me-1">Next</span>
                            <i className="ph ph-caret-right"></i>
                        </button>
                    </li>
                </ul>
            </nav>
            
            <div className="pagination-info text-center mt-3">
                <small className="text-muted">
                    Page {currentPage} of {totalPages} ({totalReviews} total reviews)
                </small>
            </div>
        </div>
    );
}

export default ReviewPagination;
