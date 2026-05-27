import { useState, useEffect, useRef } from 'react';
import { useApi } from '../hooks/useApi';
import { Link, NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectCartTotalItems, fetchCart } from '../store/slices/cartSlice';
import MobileNavbar from './Navbar/MobileNavbar';
import { useLogout } from '../hooks/useLogout';


const Header = () => {
    const { categories, categoriesLoading, IsLogin } = useApi();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const dispatch = useAppDispatch();
    const cartItemCount = useAppSelector(selectCartTotalItems);
    const handleLogout = useLogout();

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    // Fetch cart data when component mounts or when user logs in
    useEffect(() => {
        if (IsLogin()) {
            dispatch(fetchCart());
        }
    }, [dispatch, IsLogin]);




    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <>
            {/*==================== Preloader Start ====================*/}
            {/* <div className="preloader">
                <img src="/images/icon/preloader.gif" alt="Loading..." />
            </div> */}
            {/*==================== Preloader End ====================*/}

            {/*==================== Overlay Start ====================*/}
            <div className="overlay"></div>
            {/*==================== Overlay End ====================*/}

            {/*==================== Sidebar Overlay End ====================*/}
            <div className="side-overlay"></div>
            {/*==================== Sidebar Overlay End ====================*/}

            {/* ==================== Scroll to Top End Here ==================== */}
            <div className="progress-wrap">
                <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
                    <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
                </svg>
            </div>
            {/* ==================== Scroll to Top End Here ==================== */}

            {/* ==================== Search Box Start Here ==================== */}

            {/* ==================== Search Box End Here ==================== */}

            {/* ==================== Mobile Menu Start Here ==================== */}
            <MobileNavbar></MobileNavbar>

            {/* ==================== Mobile Menu End Here ==================== */}

            {/* ======================= Middle Top Start ========================= */}
            <div className="header-top bg-main-600 flex-between">
                <div className="container container-lg">

                    <div className="flex-between flex-wrap gap-8">

                        <ul className="flex-align flex-wrap d-none d-xl-flex">
                            {/* <li className="border-right-item pe-12 me-12">
                                <span className="text-white text-sm">
                                    Buy one get one free on
                                    <span className="text-yellow">&nbsp; first order</span>
                                </span>
                            </li> */}
                            <li className="border-right-item pe-12 me-12">
                                <Link
                                    to={"/profile?section=orders"}
                                    className="text-white text-sm d-flex align-items-center gap-4 hover-text-decoration-underline"
                                >
                                    <img src="/images/icon/track-icon.png" alt="Track Icon" />
                                    <span className="">Track Your Order</span>
                                </Link>
                            </li>
                        </ul>

                        <ul className="header-top__right flex-align flex-wrap gap-16 w-auto">
                            {!IsLogin() ? (<>                            <li className="d-lg-flex d-none">
                                <NavLink to='/register' className="text-white text-sm hover-text-decoration-underline">
                                    Sign up
                                </NavLink>
                            </li>
                                <li className="d-lg-flex d-none">
                                    <NavLink to='/login' className="text-white text-sm hover-text-decoration-underline">
                                        Login
                                    </NavLink>
                                </li>
                            </>
                            ) : (
                                <li className="d-lg-flex d-none">
                                    <button
                                        onClick={handleLogout}
                                        className="text-white text-sm hover-text-decoration-underline bg-transparent border-0 p-0 cursor-pointer"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            )}


                        </ul>
                    </div>
                </div>
            </div>
            {/* ======================= Middle Top End ========================= */}


        </>
    );
};

export default Header;