import React from 'react';
import Heading from './Heading';

const HeadingExamples = () => {
    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-12">
                    <h2 className="mb-4">Heading Component Examples</h2>

                    {/* Default Heading */}
                    <div className="mb-5">
                        <h4>Default Heading</h4>
                        <Heading title="Default Heading Title" />
                    </div>

                    {/* With Subtitle */}
                    <div className="mb-5">
                        <h4>With Subtitle</h4>
                        <Heading
                            title="Featured Products"
                            subtitle="Best Sellers"
                        />
                    </div>

                    {/* Different Sizes */}
                    <div className="mb-5">
                        <h4>Different Sizes</h4>
                        <div className="mb-3">
                            <Heading
                                title="Small Heading"
                                size="small"
                                subtitle="Small size"
                            />
                        </div>
                        <div className="mb-3">
                            <Heading
                                title="Medium Heading"
                                size="medium"
                                subtitle="Medium size (default)"
                            />
                        </div>
                        <div className="mb-3">
                            <Heading
                                title="Large Heading"
                                size="large"
                                subtitle="Large size"
                            />
                        </div>
                    </div>

                    {/* Different Alignments */}
                    <div className="mb-5">
                        <h4>Different Alignments</h4>
                        <div className="mb-3">
                            <Heading
                                title="Left Aligned"
                                alignment="left"
                                subtitle="Left alignment"
                                viewAllLink="/products"
                            />
                        </div>
                        <div className="mb-3">
                            <Heading
                                title="Center Aligned"
                                alignment="center"
                                subtitle="Center alignment"
                                showViewAll={false}
                            />
                        </div>
                        <div className="mb-3">
                            <Heading
                                title="Right Aligned"
                                alignment="right"
                                subtitle="Right alignment"
                                viewAllText="See More"
                            />
                        </div>
                        <div className="mb-3">
                            <Heading
                                title="Space Between"
                                alignment="between"
                                subtitle="Between alignment (default)"
                                viewAllText="View All Products"
                                viewAllLink="/shop"
                            />
                        </div>
                    </div>

                    {/* Without View All Button */}
                    <div className="mb-5">
                        <h4>Without View All Button</h4>
                        <Heading
                            title="Just a Title"
                            subtitle="No action button"
                            showViewAll={false}
                            alignment="center"
                        />
                    </div>

                    {/* With Animation */}
                    <div className="mb-5">
                        <h4>With Animation (WOW.js)</h4>
                        <Heading
                            title="Animated Heading"
                            subtitle="With animations"
                            animated={true}
                            viewAllText="Explore More"
                        />
                    </div>

                    {/* Custom Class */}
                    <div className="mb-5">
                        <h4>With Custom CSS Class</h4>
                        <Heading
                            title="Custom Styled"
                            subtitle="With custom class"
                            className="custom-heading-style"
                            viewAllText="Browse All"
                        />
                    </div>

                    {/* Real World Examples */}
                    <div className="mb-5">
                        <h4>Real World Examples</h4>

                        <div className="mb-4">
                            <Heading
                                title="Trending Products"
                                subtitle="What's Hot"
                                viewAllText="Shop Trending"
                                viewAllLink="/trending"
                                animated={true}
                            />
                        </div>

                        <div className="mb-4">
                            <Heading
                                title="New Arrivals"
                                subtitle="Fresh Collection"
                                alignment="center"
                                showViewAll={false}
                                size="large"
                            />
                        </div>

                        <div className="mb-4">
                            <Heading
                                title="Customer Reviews"
                                subtitle="What They Say"
                                alignment="center"
                                showViewAll={false}
                                size="medium"
                            />
                        </div>

                        <div className="mb-4">
                            <Heading
                                title="Popular Categories"
                                subtitle="Browse by Category"
                                viewAllText="View All Categories"
                                viewAllLink="/categories"
                                size="small"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeadingExamples;