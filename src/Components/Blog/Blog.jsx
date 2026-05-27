import React, { useState, useEffect } from 'react'
import './BlogStyles.css'
import { useApi } from '../../hooks/useApi'
import { fakeBlogData, recentPosts, blogCategories, formatDate, getRelativeTime } from '../../data/blogData'

function Blog() {
    const { categories, categoriesLoading } = useApi();
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(3);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter posts based on search and category
    const filteredPosts = fakeBlogData.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? post.categoryId === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    // Combine API categories with blog categories for display
    const displayCategories = categoriesLoading ? blogCategories :
        categories.length > 0 ? categories.map(cat => ({
            id: cat.id.toString(),
            name: cat.name,
            count: fakeBlogData.filter(post => post.categoryId === cat.id.toString()).length,
            slug: cat.name.toLowerCase().replace(/\s+/g, '-')
        })) : blogCategories;

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategoryFilter = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
    };
    // Loading component
    const LoadingSkeleton = () => (
        <div className="loading-skeleton">
            <div className="blog-item">
                <div className="skeleton-img"></div>
                <div className="blog-item__content">
                    <div className="skeleton-badge"></div>
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-meta"></div>
                </div>
            </div>
        </div>
    );

    return (
        <section className="blog py-80 blog-component">
            <div className="container container-lg">
                <div className="row gy-5">
                    <div className="col-lg-8 pe-xl-4">
                        <div className="blog-item-wrapper">
                            {currentPosts.length > 0 ? (
                                currentPosts.map((post) => (
                                    <div key={post.id} className="blog-item">
                                        <a href={`/blog/${post.slug}`} className="w-100 h-100 rounded-16 overflow-hidden">
                                            <img src={post.featuredImage} alt={post.title} className="cover-img" />
                                        </a>
                                        <div className="blog-item__content mt-24">
                                            <span className="category-badge">{post.categoryName}</span>
                                            <h6 className="blog-title">
                                                <a href={`/blog/${post.slug}`} className="">{post.title}</a>
                                            </h6>
                                            <p className="blog-description">{post.excerpt}</p>

                                            <div className="blog-meta flex-align flex-wrap gap-24">
                                                <div className="blog-meta-item flex-align flex-wrap gap-8">
                                                    <span className="text-lg"><i className="ph ph-calendar-dots"></i></span>
                                                    <span className="text-sm">
                                                        <a href={`/blog/${post.slug}`}>{formatDate(post.publishedAt)}</a>
                                                    </span>
                                                </div>
                                                <div className="blog-meta-item flex-align flex-wrap gap-8">
                                                    <span className="text-lg"><i className="ph ph-chats-circle"></i></span>
                                                    <span className="text-sm">
                                                        <a href={`/blog/${post.slug}`}>{post.commentsCount} Comments</a>
                                                    </span>
                                                </div>
                                                <div className="blog-meta-item flex-align flex-wrap gap-8">
                                                    <span className="text-lg"><i className="ph ph-eye"></i></span>
                                                    <span className="text-sm">{post.views} Views</span>
                                                </div>
                                                <div className="blog-meta-item flex-align flex-wrap gap-8">
                                                    <span className="text-lg"><i className="ph ph-clock"></i></span>
                                                    <span className="text-sm">{post.readTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-posts-found text-center py-5">
                                    <h4 className="text-elifnic">No posts found</h4>
                                    <p className="text-gray-600">Try adjusting your search criteria or browse different categories.</p>
                                </div>
                            )}
                        </div>

                        {/* <!-- Pagination Start --> */}
                        {totalPages > 1 && (
                            <ul className="pagination flex-align flex-wrap gap-16">
                                <li className="page-item">
                                    <button
                                        className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                                    >
                                        <i className="ph-bold ph-arrow-left"></i>
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, index) => (
                                    <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                        <button
                                            className="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium"
                                            onClick={() => handlePageChange(index + 1)}
                                        >
                                            {String(index + 1).padStart(2, '0')}
                                        </button>
                                    </li>
                                ))}
                                <li className="page-item">
                                    <button
                                        className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                                    >
                                        <i className="ph-bold ph-arrow-right"></i>
                                    </button>
                                </li>
                            </ul>
                        )}
                        {/* <!-- Pagination End --> */}

                    </div>
                    <div className="col-lg-4 ps-xl-4">
                        {/* <!-- Search Start --> */}
                        <div className="blog-sidebar">
                            <h6 className="sidebar-title">Search Here</h6>
                            <form onSubmit={handleSearch}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="search-input form-control"
                                        placeholder="Search articles..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <button type="submit" className="search-btn btn text-2xl h-56 w-56 flex-center input-group-text">
                                        <i className="ph ph-magnifying-glass"></i>
                                    </button>
                                </div>
                            </form>
                            {searchTerm && (
                                <div className="search-results-info mt-3">
                                    <small className="text-gray-600">
                                        Found {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for "{searchTerm}"
                                        {filteredPosts.length > 0 && (
                                            <button
                                                className="btn-link text-elifnic ms-2"
                                                onClick={() => setSearchTerm('')}
                                                style={{ fontSize: '12px', textDecoration: 'underline' }}
                                            >
                                                Clear search
                                            </button>
                                        )}
                                    </small>
                                </div>
                            )}
                        </div>
                        {/* <!-- Search End --> */}

                        {/* <!-- Recent Post Start --> */}
                        <div className="blog-sidebar">
                            <h6 className="sidebar-title">Recent Posts</h6>
                            {recentPosts.map((post) => (
                                <div key={post.id} className="recent-post-item">
                                    <a href={`/blog/${post.slug}`} className="recent-post-img">
                                        <img src={post.featuredImage} alt={post.title} className="cover-img" />
                                    </a>
                                    <div className="recent-post-content flex-grow-1">
                                        <h6>
                                            <a href={`/blog/${post.slug}`}>{post.title}</a>
                                        </h6>
                                        <div className="blog-meta-item flex-align flex-wrap gap-8">
                                            <span><i className="ph ph-calendar-dots"></i></span>
                                            <span>
                                                <a href={`/blog/${post.slug}`}>{getRelativeTime(post.publishedAt)}</a>
                                            </span>
                                        </div>
                                        <div className="blog-meta-item flex-align flex-wrap gap-8 mt-1">
                                            <span className="category-mini-badge">{post.categoryName}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* <!-- Recent Post End --> */}

                        {/* <!-- Categories Start --> */}
                        <div className="blog-sidebar">
                            <h6 className="sidebar-title">Categories</h6>
                            <ul>
                                <li className="mb-16">
                                    <button
                                        className={`category-link w-100 ${selectedCategory === null ? 'active' : ''}`}
                                        onClick={() => handleCategoryFilter(null)}
                                        style={{ border: 'none', background: 'none', textAlign: 'left' }}
                                    >
                                        <span>All Posts ({fakeBlogData.length})</span>
                                        <span className="category-arrow"><i className="ph ph-arrow-right"></i></span>
                                    </button>
                                </li>
                                {displayCategories.map((category, index) => (
                                    <li key={category.id} className={index === displayCategories.length - 1 ? "mb-0" : "mb-16"}>
                                        <button
                                            className={`category-link w-100 ${selectedCategory === category.id ? 'active' : ''}`}
                                            onClick={() => handleCategoryFilter(category.id)}
                                            style={{ border: 'none', background: 'none', textAlign: 'left' }}
                                        >
                                            <span>{category.name} ({category.count})</span>
                                            <span className="category-arrow"><i className="ph ph-arrow-right"></i></span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {selectedCategory && (
                                <div className="mt-3">
                                    <button
                                        className="btn btn-sm text-elifnic"
                                        onClick={() => handleCategoryFilter(null)}
                                        style={{ fontSize: '12px', textDecoration: 'underline' }}
                                    >
                                        Show all categories
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* <!-- Tags End --> */}

                    </div>
                </div>
            </div>
        </section>
    )
}

export default Blog