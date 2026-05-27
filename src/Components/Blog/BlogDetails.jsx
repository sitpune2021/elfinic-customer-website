import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './BlogStyles.css'
import { useApi } from '../../hooks/useApi'
import {
    getBlogPostBySlug,
    getCommentsByPostId,
    recentPosts,
    blogCategories,
    formatDate,
    getRelativeTime,
    getAdjacentPosts
} from '../../data/blogData'

function BlogDetails() {
    const { slug } = useParams();
    const { categories } = useApi();
    const [blogPost, setBlogPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [adjacentPosts, setAdjacentPosts] = useState({ previousPost: null, nextPost: null });
    const [newComment, setNewComment] = useState({ name: '', email: '', message: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            const post = getBlogPostBySlug(slug);
            if (post) {
                setBlogPost(post);
                setComments(getCommentsByPostId(post.id));
                setAdjacentPosts(getAdjacentPosts(post.id));
            }
            setLoading(false);
        }
    }, [slug]);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        // In a real application, this would make an API call
        const comment = {
            id: Date.now(),
            author: newComment.name,
            avatar: "/images/thumbs/comment-default.png",
            date: new Date().toISOString(),
            content: newComment.message
        };
        setComments([...comments, comment]);
        setNewComment({ name: '', email: '', message: '' });
    };

    const handleInputChange = (e) => {
        setNewComment({
            ...newComment,
            [e.target.name]: e.target.value
        });
    };

    if (loading) {
        return (
            <section className="blog-details py-80 blog-component">
                <div className="container container-lg">
                    <div className="loading-skeleton">
                        <div className="skeleton-img"></div>
                        <div className="skeleton-title"></div>
                        <div className="skeleton-text"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (!blogPost) {
        return (
            <section className="blog-details py-80 blog-component">
                <div className="container container-lg">
                    <div className="text-center py-5">
                        <h2 className="text-elifnic">Blog Post Not Found</h2>
                        <p>The blog post you're looking for doesn't exist.</p>
                        <a href="/blog" className="btn btn-elifnic mt-3">Back to Blog</a>
                    </div>
                </div>
            </section>
        );
    }
    return (
        <section className="blog-details py-80 blog-component">
            <div className="container container-lg">
                <div className="row gy-5">
                    <div className="col-lg-8 pe-xl-4">
                        <div className="blog-item-wrapper">
                            <div className="blog-item">
                                <img src={blogPost.featuredImage} alt={blogPost.title} className="cover-img rounded-16" />
                                <div className="blog-item__content mt-24">
                                    <span className="category-badge">{blogPost.categoryName}</span>
                                    <h1 className="blog-title mb-24">{blogPost.title}</h1>

                                    {/* Author and Meta Info */}
                                    <div className="author-info mb-32 pb-24 border-bottom border-gray-100">
                                        <div className="d-flex align-items-center gap-16 mb-16">
                                            <img
                                                src={blogPost.author.avatar}
                                                alt={blogPost.author.name}
                                                className="w-48 h-48 rounded-circle object-fit-cover"
                                            />
                                            <div>
                                                <h6 className="text-elifnic mb-0">{blogPost.author.name}</h6>
                                                <small className="text-gray-500">Author</small>
                                            </div>
                                        </div>

                                        <div className="blog-meta flex-align flex-wrap gap-24">
                                            <div className="blog-meta-item flex-align flex-wrap gap-8">
                                                <span className="text-lg"><i className="ph ph-calendar-dots"></i></span>
                                                <span className="text-sm">
                                                    {formatDate(blogPost.publishedAt)}
                                                </span>
                                            </div>
                                            <div className="blog-meta-item flex-align flex-wrap gap-8">
                                                <span className="text-lg"><i className="ph ph-chats-circle"></i></span>
                                                <span className="text-sm">
                                                    {comments.length} Comments
                                                </span>
                                            </div>
                                            <div className="blog-meta-item flex-align flex-wrap gap-8">
                                                <span className="text-lg"><i className="ph ph-eye"></i></span>
                                                <span className="text-sm">{blogPost.views} Views</span>
                                            </div>
                                            <div className="blog-meta-item flex-align flex-wrap gap-8">
                                                <span className="text-lg"><i className="ph ph-clock"></i></span>
                                                <span className="text-sm">{blogPost.readTime}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Blog Content */}
                                    <div className="blog-content" dangerouslySetInnerHTML={{ __html: blogPost.content }} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-48">
                            <div className="row gy-4">
                                <div className="col-sm-6 col-xs-6">
                                    <img src="assets/images/thumbs/blog-details-img1.png" alt="" className="rounded-16" />
                                </div>
                                <div className="col-sm-6 col-xs-6">
                                    <img src="assets/images/thumbs/blog-details-img2.png" alt="" className="rounded-16" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-48">
                            <p className="text-gray-700 mb-24">A great commerce experience cannot be distilled to a single
                                number. It’s not a Lighthouse score, or a set of Core Web Vitals figures, although both are
                                important inputs. A great commerce experience is a trilemma that carefully balances
                                competing needs of delivering great customer experience, dynamic storefront capabilities,
                                and long-term business.</p>
                        </div>

                        <div className="mt-48">
                            <h6 className="mb-32">The following are the four main market segments in which e-commerce is
                                present. These are the following:</h6>
                            <div className="row gy-4">
                                <div className="col-sm-6">
                                    <ul>
                                        <li className="d-flex align-items-start gap-8 mb-20">
                                            <span className="text-xl d-flex flex-shrink-0"><i className="ph ph-check"></i></span>
                                            <span className="text-gray-700 flex-grow-1">A great commerce experience cannot be
                                                distilled to a single number. </span>
                                        </li>
                                        <li className="d-flex align-items-start gap-8 mb-20">
                                            <span className="text-xl d-flex flex-shrink-0"><i className="ph ph-check"></i></span>
                                            <span className="text-gray-700 flex-grow-1">A great commerce experience cannot be
                                                distilled to a single number. </span>
                                        </li>
                                        <li className="d-flex align-items-start gap-8 mb-0">
                                            <span className="text-xl d-flex flex-shrink-0"><i className="ph ph-check"></i></span>
                                            <span className="text-gray-700 flex-grow-1">A great commerce experience cannot be
                                                distilled to a single number. </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-sm-6">
                                    <ul>
                                        <li className="d-flex align-items-start gap-8 mb-20">
                                            <span className="text-xl d-flex flex-shrink-0"><i className="ph ph-check"></i></span>
                                            <span className="text-gray-700 flex-grow-1">A great commerce experience cannot be
                                                distilled to a single number. </span>
                                        </li>
                                        <li className="d-flex align-items-start gap-8 mb-20">
                                            <span className="text-xl d-flex flex-shrink-0"><i className="ph ph-check"></i></span>
                                            <span className="text-gray-700 flex-grow-1">A great commerce experience cannot be
                                                distilled to a single number. </span>
                                        </li>
                                        <li className="d-flex align-items-start gap-8 mb-0">
                                            <span className="text-xl d-flex flex-shrink-0"><i className="ph ph-check"></i></span>
                                            <span className="text-gray-700 flex-grow-1">A great commerce experience cannot be
                                                distilled to a single number. </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="mt-48">
                            <div className="rounded-16 bg-main-50 p-24">
                                <span className="w-48 h-48 bg-main-600 text-white flex-center rounded-circle mb-24 text-2xl"><i
                                    className="ph ph-quotes"></i></span>
                                <p className="text-gray-700 mb-24">A great commerce experience cannot be distilled to a single
                                    number. It’s not a Lighthouse score, or a set of Core Web Vitals figures, although both
                                    are important inputs. A great commerce experience is a trilemma that carefully balances
                                    competing needs of delivering great customer experience, dynamic storefront
                                    capabilities, and long-term business.</p>
                                <div className="flex-align gap-8">
                                    <span className="text-15 fw-medium text-neutral-600 d-flex"><i
                                        className="ph-fill ph-star"></i></span>
                                    <span className="text-15 fw-medium text-neutral-600 d-flex"><i
                                        className="ph-fill ph-star"></i></span>
                                    <span className="text-15 fw-medium text-neutral-600 d-flex"><i
                                        className="ph-fill ph-star"></i></span>
                                    <span className="text-15 fw-medium text-neutral-600 d-flex"><i
                                        className="ph-fill ph-star"></i></span>
                                    <span className="text-15 fw-medium text-neutral-600 d-flex"><i
                                        className="ph-fill ph-star"></i></span>
                                </div>
                            </div>
                        </div>

                        {/* Tags Section */}
                        <div className="mt-48">
                            <div className="flex-align gap-8">
                                <h6 className="mb-0">Tags:</h6>
                                {blogPost.tags.map((tag, index) => (
                                    <a
                                        key={index}
                                        href={`/blog/tag/${tag}`}
                                        className="border border-gray-100 rounded-4 py-6 px-8 hover-bg-gray-100 text-gray-900"
                                    >
                                        {tag}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="my-48">
                            <span className="border-bottom border-gray-100 d-block"></span>
                        </div>

                        {/* Navigation */}
                        <div className="my-48 flex-between flex-sm-nowrap flex-wrap gap-24">
                            {adjacentPosts.previousPost && (
                                <div className="">
                                    <button type="button"
                                        className="mb-20 h6 text-gray-500 text-lg fw-normal hover-text-main-600">
                                        Previous Post
                                    </button>
                                    <h6 className="text-lg mb-0">
                                        <a href={`/blog/${adjacentPosts.previousPost.slug}`} className="">
                                            {adjacentPosts.previousPost.title}
                                        </a>
                                    </h6>
                                </div>
                            )}
                            {adjacentPosts.nextPost && (
                                <div className="text-end">
                                    <button type="button"
                                        className="mb-20 h6 text-gray-500 text-lg fw-normal hover-text-main-600">
                                        Next Post
                                    </button>
                                    <h6 className="text-lg mb-0">
                                        <a href={`/blog/${adjacentPosts.nextPost.slug}`} className="">
                                            {adjacentPosts.nextPost.title}
                                        </a>
                                    </h6>
                                </div>
                            )}
                        </div>

                        <div className="my-48">
                            <span className="border-bottom border-gray-100 d-block"></span>
                        </div>

                        {/* Comment Form */}
                        <div className="my-48">
                            <form onSubmit={handleCommentSubmit}>
                                <h6 className="mb-24">Leave a Comment</h6>
                                <div className="row gy-4">
                                    <div className="col-sm-6 col-xs-6">
                                        <label htmlFor="name"
                                            className="text-sm font-heading-two text-gray-900 fw-semibold mb-4">Full Name</label>
                                        <input
                                            type="text"
                                            className="common-input px-16"
                                            id="name"
                                            name="name"
                                            placeholder="Full name"
                                            value={newComment.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-sm-6 col-xs-6">
                                        <label htmlFor="email"
                                            className="text-sm font-heading-two text-gray-900 fw-semibold mb-4">Email Address</label>
                                        <input
                                            type="email"
                                            className="common-input px-16"
                                            id="email"
                                            name="email"
                                            placeholder="Email address"
                                            value={newComment.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-sm-12">
                                        <label htmlFor="message"
                                            className="text-sm font-heading-two text-gray-900 fw-semibold mb-4">Message</label>
                                        <textarea
                                            className="common-input px-16"
                                            id="message"
                                            name="message"
                                            placeholder="What's your thought about this blog..."
                                            value={newComment.message}
                                            onChange={handleInputChange}
                                            rows="5"
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="col-sm-12 mt-32">
                                        <button type="submit" className="btn bg-elifnic text-white py-18 px-32 rounded-8">
                                            Post Comment
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Comments Section */}
                        <div className="my-48">
                            <h6 className="mb-48">Comments ({comments.length})</h6>
                            {comments.length > 0 ? (
                                <>
                                    {comments.map((comment, index) => (
                                        <div
                                            key={comment.id}
                                            className={`d-flex align-items-start gap-16 mb-32 ${index < comments.length - 1 ? 'pb-32 border-bottom border-gray-100' : ''}`}
                                        >
                                            <img
                                                src={comment.avatar}
                                                alt={comment.author}
                                                className="w-40 h-40 rounded-circle object-fit-cover flex-shrink-0"
                                            />
                                            <div className="flex-grow-1">
                                                <div className="flex-align gap-8">
                                                    <h6 className="text-md fw-bold mb-0 text-elifnic">{comment.author}</h6>
                                                    <span className="w-6 h-6 bg-gray-500 rounded-circle"></span>
                                                    <span className="text-sm fw-medium text-gray-700">
                                                        {formatDate(comment.date)}
                                                    </span>
                                                </div>
                                                <p className="mt-16 text-gray-700">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="text-center py-5">
                                    <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
                                </div>
                            )}
                        </div>


                    </div>
                    <div className="col-lg-4 ps-xl-4">
                        {/* Search Start */}
                        <div className="blog-sidebar">
                            <h6 className="sidebar-title">Search Here</h6>
                            <form action="/blog">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="search-input form-control"
                                        placeholder="Search articles..."
                                        name="search"
                                    />
                                    <button type="submit" className="search-btn btn text-2xl h-56 w-56 flex-center input-group-text">
                                        <i className="ph ph-magnifying-glass"></i>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Recent Posts */}
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

                        {/* Categories */}
                        <div className="blog-sidebar">
                            <h6 className="sidebar-title">Categories</h6>
                            <ul>
                                {(categories.length > 0 ? categories : blogCategories).map((category, index) => (
                                    <li key={category.id} className={index === (categories.length > 0 ? categories.length : blogCategories.length) - 1 ? "mb-0" : "mb-16"}>
                                        <a
                                            href={`/blog/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="category-link"
                                        >
                                            <span>{category.name} ({category.count || 0})</span>
                                            <span className="category-arrow"><i className="ph ph-arrow-right"></i></span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Back to Blog */}
                        <div className="blog-sidebar">
                            <div className="text-center">
                                <a href="/blog" className="btn bg-skyblue text-elifnic py-12 px-24 rounded-8">
                                    <i className="ph ph-arrow-left me-2"></i>
                                    Back to Blog
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>


    )
}

export default BlogDetails