// ========== REACT AND ROUTING IMPORTS ==========
import {BrowserRouter,Routes, Route,useLocation } from "react-router-dom";
import React,{useState,useEffect} from "react";

// ========== NAVIGATION COMPONENTS ==========
import PrimaryNavbar from './components/PrimaryNavbar.jsx'
import SecondaryNavbar from './components/SecondaryNavbar.jsx'
import Footer from "./components/footer.jsx";

// ========== PUBLIC PAGES ==========
import Home from "./pages/Home/Home";
import Product from "./pages/Product/Product";
import Blog from "./pages/Home/Sections/Blog";
import FeeEyeTest from "./pages/Home/Sections/FreeEyeTest";
import AboutUs from "./pages/About-us.jsx";
import ThankYou from "./pages/Product/ThankYou";
import Accessories from "./pages/Shop/Accessories.jsx";

// ========== AUTHENTICATION PAGES ==========
import Signup from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login.jsx"

// ========== USER PAGES (PROTECTED) ==========
import Settings from "./pages/Settings/Setting.jsx";
import Cart from "./pages/Product/Cart.jsx";
import Checkout from "./pages/Product/Checkout.jsx";
import OrderDetails from "./pages/Product/OrderDetails.jsx";
import ShopURL from "./Routes/shopRoutes.jsx";
import Lens from "./pages/Lens/Lens.jsx";
import BookingForm from "./components/EyeTest/BookingForm.jsx";

// ========== ADMIN PAGES ==========
import Admin from "./pages/Admin/Admin.jsx";
import DashBoard from "./pages/Admin/Dashboard.jsx";
import Home2 from './pages/Admin/Home.jsx';

// ========== ADMIN - PRODUCT MANAGEMENT ==========
import Products from "./pages/Admin/Products/Products.jsx";
import AddProduct from "./pages/Admin/Products/AddProduct.jsx";
import EditProduct from "./pages/Admin/Products/EditProduct.jsx";

// ========== ADMIN - ORDER MANAGEMENT ==========
import Shopping from "./pages/Admin/Shopping.jsx";
import OrderManagement from "./pages/Admin/OrderManagement.jsx";

// ========== ADMIN - USER MANAGEMENT ==========
import User from "./pages/Admin/Users/User.jsx";
import AddUser from "./pages/Admin/Users/AddUser.jsx";
import ViewUser from './pages/Admin/Users/ViewUser.jsx';

// ========== ADMIN - ANALYTICS & SEARCH ==========
import Trending from "./pages/Admin/Trending.jsx";
import Search from "./pages/Admin/Search.jsx";

// ========== ADMIN - SYSTEM MANAGEMENT ==========
import Attributes from "./pages/Admin/Attributes.jsx";
import EyeTestManagement from "./pages/Admin/EyeTestManagement.jsx";

// ========== ADMIN - POLICY MANAGEMENT ==========
import CancellationPolicy from "./pages/Admin/CancellationPolicy.jsx";
import PrivacyPolicyAdmin from "./pages/Admin/PrivacyPolicy.jsx";
import ShippingPolicyAdmin from "./pages/Admin/ShippingPolicy.jsx";

// ========== POLICY PAGES (PUBLIC) ==========
import PrivacyPolicy from "./pages/Policies/PrivacyPolicy.jsx";
import ContactUs from "./pages/Policies/ContactUs.jsx";
import RefundPolicy from "./pages/Policies/RefundPolicy.jsx";
import ShippingPolicy from "./pages/Policies/ShippingPolicy.jsx";

// ========== UTILITIES & PROVIDERS ==========
import {ProtectedRoute} from "./providers/RoutesProvider.jsx";

/**
 * Layout Component - Handles Navigation Display Logic
 * Controls when to show/hide navigation bars based on current route
 */
const Layout = () => {
  const location = useLocation();
  const [isMobileView, setIsMobileView] = useState(false);

  // Routes where navigation bars should be hidden (exact matches)
  const hideNavbarsExact = ["/login", "/signup",];

  // Check if current route should hide navigation bars
  const shouldHideNavbar =
    hideNavbarsExact.includes(location.pathname) || location.pathname.includes("/Admin") || location.pathname.includes("/lens");

  // Handle responsive viewport changes
  useEffect(() => {
    const checkViewportWidth = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkViewportWidth(); // Check width on mount
    window.addEventListener("resize", checkViewportWidth); // Listen for window resize

    return () => window.removeEventListener("resize", checkViewportWidth); // Cleanup
  }, []);

  const isAdminRoute = location.pathname.includes("/Admin");

  // Show desktop-only message for admin routes on mobile
  if (isAdminRoute && isMobileView) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Desktop Access Required</h1>
          <p className="text-gray-700">
            This page can only be accessed from a desktop device. Please switch to a device with a larger screen (≥768px).
          </p>
        </div>
      </div>
    );
  }

  // Render navigation bars conditionally
  return (
    <>
      {!shouldHideNavbar && (
        <>
          <PrimaryNavbar />
          <SecondaryNavbar />
        </>
      )}
    </>
  );
};

/**
 * Layout2 Component - Handles Footer Display Logic
 * Controls when to show/hide footer based on current route
 */
const Layout2 = () => {
  const location = useLocation();
  const [isMobileView, setIsMobileView] = useState(false);

  // Routes where footer should be hidden (exact matches)
  const hideNavbarsExact = ["/login", "/signup"];

  // Check if current route should hide footer
  const shouldHideNavbar =
    hideNavbarsExact.includes(location.pathname) || location.pathname.includes("/Admin") || location.pathname.includes("/lens");

  // Handle responsive viewport changes
  useEffect(() => {
    const checkViewportWidth = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkViewportWidth(); // Check width on mount
    window.addEventListener("resize", checkViewportWidth); // Listen for window resize

    return () => window.removeEventListener("resize", checkViewportWidth); // Cleanup
  }, []);

  const isAdminRoute = location.pathname.includes("/Admin");

  // Show desktop-only message for admin routes on mobile
  if (isAdminRoute && isMobileView) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Desktop Access Required</h1>
          <p className="text-gray-700">
            This page can only be accessed from a desktop device. Please switch to a device with a larger screen (≥768px).
          </p>
        </div>
      </div>
    );
  }

  // Render footer conditionally
  return (
    <>
      {!shouldHideNavbar && (
        <>
          <Footer />
        </>
      )}
    </>
  );
};

/**
 * Main App Component - Application Entry Point
 * Handles routing, layout management, and responsive design
 */
export default function App() {
 
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Handle responsive viewport changes for main app
  useEffect(() => {
    const checkViewportWidth = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkViewportWidth(); // Check on mount
    window.addEventListener('resize', checkViewportWidth); // Check on resize

    return () => window.removeEventListener('resize', checkViewportWidth); // Cleanup
  }, []);
  
  return <div className="h-screen">
    
    <BrowserRouter>
     {/* Navigation Layout - Controls when to show/hide navbars */}
     <Layout />

    <Routes>

      {/* ========== PUBLIC ROUTES ========== */}
      {/* These routes are accessible to all users without authentication */}
      
      <Route path="/" element={<Home />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/shop/:category/:audience' element={<ShopURL />}/>
      <Route path="/product/:id" element={<Product />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/free-eye-test" element={<FeeEyeTest />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
      <Route path='/contact-us'element={<ContactUs/>}/>
      <Route path='/refund-policy' element={<RefundPolicy/>}/>
      <Route path='/shipping-policy' element={<ShippingPolicy/>}/>
      <Route path='/about-us' element={<AboutUs/>}/>
      <Route path='/thank-you' element={<ThankYou />} />
      <Route path='/accessories' element={<Accessories />} />
      <Route path='*' element={<h1>Not Found</h1>} />

      {/* ========== PROTECTED USER ROUTES ========== */}
      {/* These routes require user authentication */}
      <Route element={<ProtectedRoute/>}>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path='/order/:orderId' element={<OrderDetails/>}/>
        <Route path='/settings' element={<Settings/>} />
        <Route path='/lens/:id' element={<Lens/>} />
        <Route path="/eye-test" element={<BookingForm/>}/>
      </Route>

      {/* ========== ADMIN ROUTES ========== */}
      {/* These routes require admin authentication and desktop access */}
      <Route element={<ProtectedRoute/>}>
        <Route path="/admin" element={<DashBoard />}>
          {/* Admin Dashboard - Main admin interface */}
          <Route index element={<Home2 />} />
          
          {/* Product Management */}
          <Route path="products" element={<Products />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:id" element={<EditProduct/>} />
          
          {/* Order Management */}
          <Route path="orders" element={<Shopping />} />
          <Route path="order-management" element={<OrderManagement/>}/>
          
          {/* User Management */}
          <Route path="user" element={<User />} />
          <Route path='add-user' element={<AddUser/>}/>
          <Route path="view-user/:id" element={<ViewUser/>} />
          
          {/* Analytics and Search */}
          <Route path="analytics" element={<Trending />} />
          <Route path="search" element={<Search />} />
          
          {/* System Management */}
          <Route path="attributes" element={<Attributes />} />
          <Route path="eye-test-management" element={<EyeTestManagement/>}/>
          
          {/* Policy Management */}
          <Route path="cancellation-policy" element={<CancellationPolicy/>}/>
          <Route path="privacy-policy" element={<PrivacyPolicyAdmin/>}/>
          <Route path="shipping-policy" element={<ShippingPolicyAdmin/>}/>
          
          {/* Fallback for admin routes */}
          <Route path="*" element={<p className="text-red-500 text-center">Page not found</p>} />
        </Route>
      </Route>
     
    </Routes>
    
    {/* Footer Layout - Controls when to show/hide footer */}
    <Layout2/>
  </BrowserRouter>
  </div>
  
}

