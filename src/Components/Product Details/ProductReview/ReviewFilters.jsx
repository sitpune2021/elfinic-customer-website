import React from 'react';
import './ReviewFilters.css';

function ReviewFilters({ currentSort, currentRating, onSortChange, onRatingChange }) {
    const sortOptions = [
        { value: 'latest', label: 'Latest' },
        { value: 'oldest', label: 'Oldest' },
        { value: 'highest', label: 'Highest Rating' },
        { value: 'lowest', label: 'Lowest Rating' }
    ];

    const ratingOptions = [
        { value: null, label: 'All Ratings' },
        { value: 5, label: '5 Stars' },
        { value: 4, label: '4 Stars' },
        { value: 3, label: '3 Stars' },
        { value: 2, label: '2 Stars' },
        { value: 1, label: '1 Star' }
    ];

    return (
        <div className="review-filters">
            <div className="row g-3 align-items-center">
                <div className="col-md-6 col-lg-4">
                    <div className="filter-group">
                        <label htmlFor="sortSelect" className="form-label text-sm fw-medium mb-2">
                            <i className="ph ph-sort-ascending me-2"></i>Sort By
                        </label>
                        <select 
                            id="sortSelect"
                            className="form-select form-select-sm"
                            value={currentSort}
                            onChange={(e) => onSortChange(e.target.value)}
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-md-6 col-lg-4">
                    <div className="filter-group">
                        <label htmlFor="ratingSelect" className="form-label text-sm fw-medium mb-2">
                            <i className="ph ph-star me-2"></i>Filter by Rating
                        </label>
                        <select 
                            id="ratingSelect"
                            className="form-select form-select-sm"
                            value={currentRating || ''}
                            onChange={(e) => onRatingChange(e.target.value ? Number(e.target.value) : null)}
                        >
                            {ratingOptions.map(option => (
                                <option key={option.value || 'all'} value={option.value || ''}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewFilters;
