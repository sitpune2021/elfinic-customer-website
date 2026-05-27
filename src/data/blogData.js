// Fake blog data with categories that match API context
export const fakeBlogData = [
    {
        id: 1,
        title: "How to Build a Successful E-commerce Business in 2025",
        slug: "successful-ecommerce-business-2025",
        excerpt: "Learn the essential steps to build a successful e-commerce business from scratch. Discover proven strategies for customer acquisition, retention, and scaling your online store effectively in today's competitive market.",
        content: `
            <p>Building a successful e-commerce business requires strategic planning, understanding your target market, and implementing the right technologies. In this comprehensive guide, we'll explore the key components that make an online business thrive in today's competitive marketplace.</p>
            
            <h3>Understanding Your Market</h3>
            <p>Before launching any e-commerce venture, conducting thorough market research is essential. This involves analyzing your competition, understanding customer pain points, and identifying gaps in the market that your business can fill.</p>
            
            <h3>Essential E-commerce Components</h3>
            <ul>
                <li>User-friendly website design and navigation</li>
                <li>Secure payment processing systems</li>
                <li>Efficient inventory management</li>
                <li>Customer service and support systems</li>
                <li>Marketing and SEO strategies</li>
            </ul>
            
            <p>The foundation of any successful e-commerce business lies in providing exceptional customer experience while maintaining operational efficiency. This balance requires careful planning and continuous optimization of your business processes.</p>
            
            <h3>Technology Stack Considerations</h3>
            <p>Choosing the right technology stack is crucial for scalability and performance. Consider factors such as your budget, technical expertise, expected traffic, and integration requirements when making these decisions.</p>
        `,
        featuredImage: "/images/thumbs/blog-img1.png",
        categoryId: "1", // Technology category
        categoryName: "Technology",
        author: {
            name: "Sarah Johnson",
            avatar: "/images/authors/author1.jpg"
        },
        publishedAt: "2025-09-15T10:00:00Z",
        updatedAt: "2025-09-15T10:00:00Z",
        commentsCount: 5,
        readTime: "8 min read",
        tags: ["e-commerce", "business", "startup", "online-store"],
        isFeature: true,
        views: 1250
    },
    {
        id: 2,
        title: "Digital Marketing Trends That Will Dominate 2025",
        slug: "digital-marketing-trends-2025",
        excerpt: "Explore the latest digital marketing trends that will dominate 2025. From AI-powered campaigns to personalized customer experiences, stay ahead of the competition with these cutting-edge strategies.",
        content: `
            <p>The digital marketing landscape is constantly evolving, and 2025 promises to bring revolutionary changes. Artificial intelligence, machine learning, and advanced personalization are reshaping how brands connect with their audiences in meaningful ways.</p>
            
            <h3>AI-Powered Marketing Automation</h3>
            <p>Artificial intelligence is no longer a luxury but a necessity in modern marketing. From chatbots that provide instant customer support to predictive analytics that forecast consumer behavior, AI is transforming every aspect of digital marketing.</p>
            
            <h3>Key Trends to Watch</h3>
            <ul>
                <li>Voice search optimization and smart speaker marketing</li>
                <li>Augmented reality shopping experiences</li>
                <li>Hyper-personalized content delivery</li>
                <li>Privacy-first marketing strategies</li>
                <li>Interactive video content and live streaming</li>
            </ul>
            
            <p>The most successful brands in 2025 will be those that can seamlessly blend technology with human creativity to create authentic connections with their audience. This means moving beyond traditional advertising to create value-driven content that educates, entertains, and inspires action.</p>
        `,
        featuredImage: "/images/thumbs/blog-img2.png",
        categoryId: "2", // Marketing category
        categoryName: "Marketing",
        author: {
            name: "Michael Chen",
            avatar: "/images/authors/author2.jpg"
        },
        publishedAt: "2025-09-10T14:30:00Z",
        updatedAt: "2025-09-10T14:30:00Z",
        commentsCount: 12,
        readTime: "6 min read",
        tags: ["digital-marketing", "ai", "trends", "2025"],
        isFeature: true,
        views: 2100
    },
    {
        id: 3,
        title: "Modern Web Development Best Practices for Performance",
        slug: "web-development-best-practices-performance",
        excerpt: "Discover the latest web development best practices that will help you build faster, more secure, and user-friendly websites. Learn about performance optimization, security measures, and modern development workflows.",
        content: "Modern web development has evolved significantly with new frameworks, tools, and methodologies. Performance optimization has become crucial for user experience and SEO. In this article, we'll cover essential best practices...",
        featuredImage: "/images/thumbs/blog-img3.png",
        categoryId: "3", // Development category
        categoryName: "Development",
        author: {
            name: "Alex Rodriguez",
            avatar: "/images/authors/author3.jpg"
        },
        publishedAt: "2025-09-05T09:15:00Z",
        updatedAt: "2025-09-05T09:15:00Z",
        commentsCount: 8,
        readTime: "10 min read",
        tags: ["web-development", "performance", "best-practices", "optimization"],
        isFeature: false,
        views: 980
    },
    {
        id: 4,
        title: "SEO Strategies That Actually Work in 2025",
        slug: "seo-strategies-2025",
        excerpt: "Uncover the most effective SEO strategies for 2025. Learn how to improve your search rankings with proven techniques that adapt to the latest search engine algorithms and user behavior patterns.",
        content: "Search engine optimization continues to be a critical factor for online success. With search algorithms becoming more sophisticated, it's essential to understand what truly drives rankings in 2025...",
        featuredImage: "/images/thumbs/blog-img4.png",
        categoryId: "2", // Marketing category
        categoryName: "Marketing",
        author: {
            name: "Emma Thompson",
            avatar: "/images/authors/author4.jpg"
        },
        publishedAt: "2025-08-28T16:45:00Z",
        updatedAt: "2025-08-28T16:45:00Z",
        commentsCount: 15,
        readTime: "7 min read",
        tags: ["seo", "marketing", "search-engine", "optimization"],
        isFeature: false,
        views: 1680
    },
    {
        id: 5,
        title: "Building Scalable React Applications: Architecture Guide",
        slug: "scalable-react-applications-architecture",
        excerpt: "Master the art of building scalable React applications with proper architecture patterns. Learn about component design, state management, and performance optimization techniques for large-scale projects.",
        content: "As React applications grow in complexity, maintaining scalability becomes crucial. This comprehensive guide covers architectural patterns, best practices, and tools that help you build maintainable React applications...",
        featuredImage: "/images/thumbs/blog-img5.png",
        categoryId: "3", // Development category
        categoryName: "Development",
        author: {
            name: "David Kim",
            avatar: "/images/authors/author5.jpg"
        },
        publishedAt: "2025-08-20T11:20:00Z",
        updatedAt: "2025-08-20T11:20:00Z",
        commentsCount: 22,
        readTime: "12 min read",
        tags: ["react", "javascript", "architecture", "scalability"],
        isFeature: false,
        views: 3200
    },
    {
        id: 6,
        title: "User Experience Design Principles for E-commerce",
        slug: "ux-design-principles-ecommerce",
        excerpt: "Transform your e-commerce site with proven UX design principles. Learn how to create intuitive user journeys, optimize conversion funnels, and design interfaces that drive sales and customer satisfaction.",
        content: "User experience design in e-commerce directly impacts conversion rates and customer satisfaction. This article explores fundamental UX principles that successful online stores implement to maximize their performance...",
        featuredImage: "/images/thumbs/blog-img6.png",
        categoryId: "4", // Design category
        categoryName: "Design",
        author: {
            name: "Jessica Park",
            avatar: "/images/authors/author6.jpg"
        },
        publishedAt: "2025-08-15T13:00:00Z",
        updatedAt: "2025-08-15T13:00:00Z",
        commentsCount: 9,
        readTime: "9 min read",
        tags: ["ux-design", "ecommerce", "user-experience", "conversion"],
        isFeature: false,
        views: 1450
    }
];

// Recent posts data for sidebar
export const recentPosts = [
    {
        id: 7,
        title: "Top 10 SEO Strategies for Better Rankings",
        slug: "top-seo-strategies-better-rankings",
        featuredImage: "/images/thumbs/recent-post1.png",
        publishedAt: "2025-09-12T08:30:00Z",
        categoryName: "Marketing"
    },
    {
        id: 8,
        title: "Social Media Marketing Tips for Small Business",
        slug: "social-media-marketing-tips",
        featuredImage: "/images/thumbs/recent-post2.png",
        publishedAt: "2025-09-08T15:45:00Z",
        categoryName: "Marketing"
    },
    {
        id: 9,
        title: "Content Strategy for Sustainable Growth",
        slug: "content-strategy-sustainable-growth",
        featuredImage: "/images/thumbs/recent-post3.png",
        publishedAt: "2025-09-01T12:15:00Z",
        categoryName: "Content"
    },
    {
        id: 10,
        title: "Building Brand Authority in the Digital Age",
        slug: "building-brand-authority-digital",
        featuredImage: "/images/thumbs/recent-post4.png",
        publishedAt: "2025-08-28T09:00:00Z",
        categoryName: "Branding"
    }
];

// Blog categories with post counts
export const blogCategories = [
    { id: "1", name: "Technology", count: 12, slug: "technology" },
    { id: "2", name: "Marketing", count: 15, slug: "marketing" },
    { id: "3", name: "Development", count: 29, slug: "development" },
    { id: "4", name: "Design", count: 18, slug: "design" },
    { id: "5", name: "Business", count: 22, slug: "business" },
    { id: "6", name: "E-commerce", count: 11, slug: "ecommerce" },
    { id: "7", name: "Analytics", count: 8, slug: "analytics" }
];

// Utility functions
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
};

export const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
};

export const getBlogPostsByCategory = (categoryId) => {
    return fakeBlogData.filter(post => post.categoryId === categoryId);
};

export const getFeaturedPosts = () => {
    return fakeBlogData.filter(post => post.isFeature);
};

export const getPopularPosts = (limit = 5) => {
    return fakeBlogData
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
};

// Blog post comments data
export const blogComments = {
    1: [
        {
            id: 1,
            author: "Marvin McKinney",
            avatar: "/images/thumbs/comment-img1.png",
            date: "2025-09-16T14:30:00Z",
            content: "Excellent article! The insights about market research really helped me understand what I was missing in my business planning. Looking forward to implementing these strategies."
        },
        {
            id: 2,
            author: "Sarah Wilson",
            avatar: "/images/thumbs/comment-img2.png",
            date: "2025-09-16T16:45:00Z",
            content: "The technology stack section was particularly valuable. As someone just starting out, knowing what to prioritize makes all the difference."
        }
    ],
    2: [
        {
            id: 3,
            author: "Kristin Watson",
            avatar: "/images/thumbs/comment-img3.png",
            date: "2025-09-11T09:20:00Z",
            content: "AI-powered marketing is definitely the future. We've already seen great results from implementing chatbots and personalized content delivery."
        },
        {
            id: 4,
            author: "Robert Fox",
            avatar: "/images/thumbs/comment-img4.png",
            date: "2025-09-11T11:15:00Z",
            content: "Voice search optimization has been a game-changer for our local business. Great tips in this article!"
        }
    ],
    3: [
        {
            id: 5,
            author: "Jenny Wilson",
            avatar: "/images/thumbs/comment-img1.png",
            date: "2025-09-06T13:00:00Z",
            content: "As a developer, I appreciate the practical approach to performance optimization. The best practices mentioned here are exactly what we need in 2025."
        }
    ]
};

// Function to get comments for a specific blog post
export const getCommentsByPostId = (postId) => {
    return blogComments[postId] || [];
};

// Function to get blog post by slug
export const getBlogPostBySlug = (slug) => {
    return fakeBlogData.find(post => post.slug === slug);
};

// Function to get blog post by ID
export const getBlogPostById = (id) => {
    return fakeBlogData.find(post => post.id === parseInt(id));
};

// Function to get next and previous posts
export const getAdjacentPosts = (currentPostId) => {
    const currentIndex = fakeBlogData.findIndex(post => post.id === currentPostId);
    const previousPost = currentIndex > 0 ? fakeBlogData[currentIndex - 1] : null;
    const nextPost = currentIndex < fakeBlogData.length - 1 ? fakeBlogData[currentIndex + 1] : null;

    return { previousPost, nextPost };
};