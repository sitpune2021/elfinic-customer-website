import './App.css'
import { ToastContainer } from 'react-toastify'
import PaymentExamples from './Components/Payment/PaymentExamples';
import PaymentTest from './Components/Payment/PaymentTest';
import PaymentDebug from './Components/Payment/PaymentDebug';
import PaymentFixTest from './Components/Payment/PaymentFixTest';
import 'react-toastify/dist/ReactToastify.css'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { BrowserRouter as Router, Routes, Route, useNavigate, BrowserRouter } from 'react-router-dom'
import Home from './Components/Home'
import Navbar from './Components/Navbar/Navbar'
import Header from './Components/Header'
import ContactUs from './Components/ContactUs'
import Blog from './Components/Blog/Blog'
import BlogDetails from './Components/Blog/BlogDetails'
import AddToCart from './Components/AddToCart'
import Checkout from './Components/Checkout/Checkout'
import OrderSuccess from './Components/Checkout/OrderSuccess'
import ApiTestComponent from './Components/ApiTestComponent'
import BrandsTest from './Components/BrandsTest'
import { useApi } from './hooks/useApi'
import Categories from './Components/Categories'

import Shop from './Components/Product filter shop/Shop'
import SubCategories from './Components/SubCategories'
import Business from './Components/Business'
import ProductDetails from './Components/Product Details/ProductDetails'

import About from './Components/About'
import FAQ from './Components/FAQ/FAQ'
import TrackOrder from './Components/TrackOrder/TrackOrder'
import Profile from './Components/UserPanel/Profile'
import ProtectedRoute from './Components/UserPanel/ProtectedRoute'
import { ConfirmProvider } from './contexts/ConfirmContext'
import { PaymentProvider } from './contexts/PaymentContext'
import ApiProviderTest from './Components/ApiProviderTest'
import SignUp from './Components/Login-Sign-forms/SignUp';
import Login from './Components/Login-Sign-forms/Login';
import ForgotPassword from './Components/Login-Sign-forms/ForgotPassword';
import Footer from './Components/Footer/Footer';
import ScrollToTop from './Components/ScrollToTop';
import NotFound from './Components/NotFound';
import VendorList from './Components/Vendor-list/VendorList';
import TaxPolicy from './Components/PolicyFiles/TaxPolicy';
import ShippingPolicy from './Components/PolicyFiles/ShippingPolicy';
import ReturnExchangePolicy from './Components/PolicyFiles/ReturnExchangePolicy';
import PrivacyPolicy from './Components/PolicyFiles/PrivecyPolicy';
import SellerVendorPolicy from './Components/PolicyFiles/SellerVendorPolicy';
import VendorReturnPolicy from './Components/PolicyFiles/VendorReturnPolicy';
import VendorPaymentPolicy from './Components/PolicyFiles/VendorPaymentPolicy';
import VendorPortalUserPolicy from './Components/PolicyFiles/VendorPortalUserPolicy';
import VendorDetails from './Components/Vendor-list/VendorDetails';
import AllBrand from './Components/AllBrand';
import RouteTracker from './seo/RouteTracker';
import DynamicScriptLoader from './seo/DynamicScriptLoader';
import Mobileviewbottomtab from './Components/layout/Mobileviewbottomtab';

// Create a separate component for the app content that needs API context
// ✅ AppContent.jsx
function AppContent() {
  const { IsLogin } = useApi();

  return (
    <>
      <ScrollToTop />
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/track_order" element={<TrackOrder />} />
        <Route path="/blog/:slug" element={<BlogDetails />} />
        <Route path="/api-test" element={<ApiTestComponent />} />
        <Route path="/brands-test" element={<BrandsTest />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/business" element={<Business />} />
        <Route path="/cart" element={<AddToCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/subcategories/:id/:name" element={<SubCategories />} />
        <Route path="/product-details/:slug" element={<ProductDetails />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/taxpolicy" element={<TaxPolicy />} />
        <Route path="/shippingpolicy" element={<ShippingPolicy />} />
        <Route path="/returnexchangepolicy" element={<ReturnExchangePolicy />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/sellervendorpolicy" element={<SellerVendorPolicy />} />
        <Route path="/vendorreturnpolicy" element={<VendorReturnPolicy />} />
        <Route path="/vendorpaymentpolicy" element={<VendorPaymentPolicy />} />
        <Route path="/vendorportaluserpolicy" element={<VendorPortalUserPolicy />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/payment-examples" element={<PaymentExamples />} />
        <Route path="/payment-test" element={<PaymentTest />} />
        <Route path="/payment-debug" element={<PaymentDebug />} />
        <Route path="/payment-fix-test" element={<PaymentFixTest />} />
        <Route path="/api-provider-test" element={<ApiProviderTest />} />
        <Route path="/vendor-list" element={<VendorList />} />
        <Route path="/vendor-details/:id" element={<VendorDetails />} />
        <Route path='/all-brands' element={<AllBrand />} />
        <Route
          path="/profile/*"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <Mobileviewbottomtab />
      <div className="mbtab-spacer" />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}


function App() {
  return (
    <ConfirmProvider>
      <PaymentProvider>
        <BrowserRouter basename="/">
          <RouteTracker />
          <DynamicScriptLoader />
          <AppContent />
        </BrowserRouter>
      </PaymentProvider>
    </ConfirmProvider>
  );
}




export default App
