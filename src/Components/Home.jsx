import React from 'react'
import NewsLetter from './NewsLetter'
import { useApi } from '../hooks/useApi';
import Categories from './Categories.jsx';
import Product from './Product.jsx';
import Slider from './Slider.jsx';
import TextSlider from './TextSlider.jsx';
import ShopFeature from './ShopFeature.jsx';
import Brand from './Brand.jsx';
import Testimonial from './Testimonial.jsx';
import CategoriesSlider from './CategoriesSlider.jsx';
import TrendingProducts from './TrendingProducts.jsx';
import { Link } from 'react-router-dom';
import PromotionalBanner from './Home/PromotionalBanner.jsx';
import HeadingExamples from './Home/HeadingExamples.jsx';
import Heading from './Home/Heading.jsx';
import DiscountBanner from './Home/DiscountBanner.jsx';
import ProductSlider from './Home/ProductSlider.jsx';
import ReletedProducts from './ReletedProducts.jsx';
import ProductSection from './ProductSection.jsx';
import ProductSectionQuickStart, { MultiSectionPage } from './ProductSectionQuickStart.jsx';
import { EcommerceHomepage } from './ProductSectionRealWorldExamples.jsx';
// import HeadingUsageGuide from './Home/HeadingUsageGuide.jsx';


function Home() {
    const {
        products,
        productsLoading,
        productsError,
    } = useApi();

    // console.log("Categories:", categories);
    // console.log("Products:", products);
    // console.log("Categories Loading:", categoriesLoading);
    // console.log("Products Loading:", productsLoading);

    // console.log("Image Path:", image_path);


    return (<>

        {/* <!-- ==================================== Banner Three Start =================================== --> */}
        <Slider />
        {/* <!-- ==================================== Banner Three End =================================== --> */}
        <ProductSlider />
        {/* <!-- ============================ Feature Three Section start =============================== --> */}
        <CategoriesSlider />
        {/* <!-- ============================ Feature Three Section End =============================== --> */}
        {/* <!-- ========================= Trending Products Start ================================ --> */}
        <ProductSection
            section="trending"                    // Required: Section type
            title="Trending Products"            // Title to display
            subtitle="Hot Right Now"             // Subtitle (optional)
            alignment="between"                  // 'center' | 'between' | 'left'
            showViewAll={true}                   // Show "View All" link
            viewAllLink="/shop?show_section=trending"                  // Link for "View All"
            viewAllText="View All Products"      // Text for "View All"
            limit={6}                            // Number of products to show
            className="my-custom-class"          // Additional CSS classes
            gridClass="col-md-3 col-sm-4 col-lg-2 col-6" // Grid column classes
        />
        {/* <!-- ========================= Trending Products End ================================ --> */}

        {/* <!-- ========================= Trending Products Section (Dynamic API) ================================ --> */}

        <ProductSection
            section="featured"                    // Required: Section type
            title="Featured Products"            // Title to display
            subtitle="Editor's Choice"           // Subtitle (optional)
            alignment="between"                  // 'center' | 'between' | 'left'
            showViewAll={true}                   // Show "View All" link
            viewAllLink="/shop?show_section=featured"                  // Link for "View All"
            viewAllText="View All Products"      // Text for "View All"
            limit={6}                            // Number of products to show
            className="my-custom-class"          // Additional CSS classes
            gridClass="col-md-3 col-sm-4 col-lg-2 col-6" // Grid column classes
        />
        {/* <ProductSection section="best_seller" title="Best Sellers" /> */}

        {/* <!-- ========================= Trending Products Section End ================================ --> */}

        {/* <HeadingUsageGuide></HeadingUsageGuide> */}
        {/* <HeadingExamples></HeadingExamples> */}
        {/* <!-- ============================== Promotional Banner Three Start ========================== --> */}
        <PromotionalBanner />

        {/* <!-- ============================== Promotional Banner Three End ========================== --> */}


        {/* <!-- text slider --> */}
        <TextSlider />
        {/* <!-- text slider End --> */}

        {/* <!-- ========================= Discount Three Start ================================ --> */}
        <DiscountBanner />
        {/* <!-- ========================= Discount Three End ================================ --> */}

        {/* <!-- ============================= Popular Products Three start ============================ --> */}
        {/* <section className="popular-products-three overflow-hidden mt-20">
            <div className="container container-lg">
                <Heading
                    title="Popular Products"
                    alignment="between"
                    subtitle="Top Selling"
                    viewAllText="View All Products"
                    viewAllLink="/shop"
                />
                <div className="row g-12">

                    {productsLoading ? (
                        <p>Loading products...</p>
                    ) : products.length > 0 ? (
                        products.slice(0, 6).map((product) => (
                            <div className="col-xxl-2 col-xl-2 col-sm-6 col-6 mb-24" key={product.id}>
                                <Product product={product} />
                            </div>
                        ))
                    ) : (
                        <p>No products found.</p>
                    )}
                </div>
            </div>
        </section> */}
        {/* <!-- ============================= Popular Products Three End ============================ --> */}

        {/* <!-- ========================= Featured Products Section (Dynamic API) ================================ --> */}
        {/* <ProductSection
            section="featured"
            title="Featured Products"
            subtitle="Editor's Choice"
            alignment="between"
            showViewAll={true}
            viewAllLink="/shop"
            limit={6}
        /> */}
        {/* <!-- ========================= Featured Products Section End ================================ --> */}

        {/* <!-- ========================= Best Seller Section (Dynamic API) ================================ --> */}
        {/* <ProductSection
            section="best_seller"
            title="Best Sellers"
            subtitle="Most Popular"
            alignment="between"
            showViewAll={true}
            viewAllLink="/shop"
            limit={6}
        /> */}
        {/* <!-- ========================= Best Seller Section End ================================ --> */}

        {/* <!-- ========================= Discounted Products Section (Dynamic API) ================================ --> */}
        {/* <ProductSection
            section="discounted"
            title="Special Offers"
            subtitle="Limited Time Deals"
            alignment="between"
            showViewAll={true}
            viewAllLink="/shop"
            limit={6}
        /> */}
        {/* <!-- ========================= Discounted Products Section End ================================ --> */}

        {/* <!-- ========================= Recommended Products Section (Dynamic API) ================================ --> */}
        <ProductSection
            section="recommended"
            title="Recommended For You"
            subtitle="Just For You"
            alignment="center"
            showViewAll={false}
            limit={6}
        />
        {/* <!-- ========================= Recommended Products Section End ================================ --> */}

        {/* <!-- ================================ Brand Three Start ============================= --> */}
        <Brand />
        {/* <!-- ================================ Brand Three End ============================= --> */}



        {/* <!-- ============================== Testimonial section start ======================= --> */}
        <Testimonial />
        {/* <!-- ============================== Testimonial section start ======================= --> */}
        {/* <!-- ========================== Shipping Section Start ============================ --> */}
        <ShopFeature />
        {/* <!-- ========================== Shipping Section End ============================ --> */}



    </>

    )
}

export default Home
