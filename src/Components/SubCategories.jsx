import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { useDispatch, useSelector } from 'react-redux';
import { selectSubCategories, selectSubCategoriesLoading, subCategories } from '../store/slices/apiSlice';
import './SubCategories.css';
import ProductSection from './ProductSection.jsx';


function SubCategories() {
    const { id, name } = useParams();
    const { API_BASE_URL, image_path } = useApi();
    const navigator = useNavigate();

    const dispatch = useDispatch();
    const fetchsubcategories = useSelector(selectSubCategories)
    const SubCategoriesLoading = useSelector(selectSubCategoriesLoading)


    useEffect(() => {
        if (id) {
            dispatch(subCategories(id));
        }
    }, [id]);
    console.log("Subcategories:", fetchsubcategories);



    return (
        <div className="my-5 container sub-container">
            {SubCategoriesLoading ? (
                // Skeleton Loading - Square card style
                <>
                    <div className="subcat-heading">Explore {name} Sub-Categories</div>
                    <div className="subcat-grid">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <div key={index} className="subcat-skeleton-card">
                                <div className="subcat-skeleton-img"></div>
                                <div className="subcat-skeleton-info">
                                    <div className="subcat-skeleton-title"></div>
                                    <div className="subcat-skeleton-sub"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : fetchsubcategories && fetchsubcategories.data && fetchsubcategories.data.length > 0 ? (
                <>
                    <div className="subcat-heading">Explore {name} Sub-Categories</div>
                    <div className="subcat-grid">
                        {fetchsubcategories.data.map((category) => (
                            <Link
                                key={category.id}
                                to={`/shop?subcategory=${category.name}`}
                                className="subcat-card"
                            >
                                <div className="subcat-img-box">
                                    {category.discount && (
                                        <span className="subcat-badge">
                                            {category.discount}% OFF
                                        </span>
                                    )}
                                    <img
                                        src={
                                            category.image
                                                ? `${image_path}sub-category-images/${category.image}`
                                                : 'https://via.placeholder.com/300x360?text=No+Image'
                                        }
                                        alt={category.name}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="subcat-info">
                                    <span className="subcat-name">{category.name}</span>
                                    {category.discount && (
                                        <span className="subcat-discount">
                                            Up To {category.discount}% Off
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>

                    <ProductSection
                        section="best_seller"
                        title="Best Seller Products"
                        subtitle="Editor's Choice"
                        alignment="between"
                        showViewAll={true}
                        viewAllLink="/shop?show_section=best_seller"
                        viewAllText="View All Products"
                        limit={6}
                        className="my-custom-class"
                        gridClass="col-md-3 col-sm-4 col-lg-2 col-6"
                    />
                </>
            ) : (
                <>{navigator(`/shop?category=${name}`)}</>
            )}
        </div>
    );
}

export default SubCategories;