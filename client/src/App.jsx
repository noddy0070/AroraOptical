// =========================
// Main React App Component
// =========================
// This file sets up the main application, routing, layout logic, and responsive design for both user and admin interfaces.

// ========== REACT AND ROUTING IMPORTS ==========
import {BrowserRouter,Routes, Route,useLocation } from "react-router-dom";
import {useState,useEffect} from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import SearchResults from "./pages/Search/SearchResults.jsx";

// ========== AUTHENTICATION PAGES ==========
import Signup from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login.jsx"
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import ResetPassword from "./pages/Auth/ResetPassword.jsx";

// ========== USER PAGES (PROTECTED) ==========
import Settings from "./pages/Settings/Setting.jsx";
import Cart from "./pages/Product/Cart.jsx";
import Checkout from "./pages/Product/Checkout.jsx";
import OrderDetails from "./pages/Product/OrderDetails.jsx";
import ShopURL from "./Routes/shopRoutes.jsx";
import Lens from "./pages/Lens/Lens.jsx";
import BookingForm from "./components/EyeTest/BookingForm.jsx";

// ========== ADMIN PAGES ==========
import DashBoard from "./pages/Admin/Dashboard.jsx";

// ========== ADMIN - PRODUCT MANAGEMENT ==========
import Products from "./pages/Admin/Products/Products.jsx";
import AddProduct from "./pages/Admin/Products/AddProduct.jsx";
import EditProduct from "./pages/Admin/Products/EditProduct.jsx";
import BulkUploadProducts from "./pages/Admin/Products/BulkUploadProducts.jsx";

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
import TermsAndConditionsAdmin from "./pages/Admin/TermsAndConditions.jsx";

// ========== POLICY PAGES (PUBLIC) ==========
import PrivacyPolicy from "./pages/Policies/PrivacyPolicy.jsx";
import ContactUs from "./pages/Policies/ContactUs.jsx";
import RefundPolicy from "./pages/Policies/RefundPolicy.jsx";
import ShippingPolicy from "./pages/Policies/ShippingPolicy.jsx";
import TermsAndConditions from "./pages/Policies/TermsAndConditions.jsx";

// ========== UTILITIES & PROVIDERS ==========
import {ProtectedRoute} from "./providers/RoutesProvider.jsx";

/**
 * Page Component - Sets document title for each route
 */
const Page = ({ title, children }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return children;
};

/**
 * Layout Component - Handles Navigation Display Logic
 * Controls when to show/hide navigation bars based on current route
 */
const Layout = () => {
  const location = useLocation();
  const [isMobileView, setIsMobileView] = useState(false);

  // Routes where navigation bars should be hidden (exact matches)
  const hideNavbarsExact = ["/login", "/signup", "/forgot-password", "/reset-password"];

  // Check if current route should hide navigation bars
  const shouldHideNavbar =
    hideNavbarsExact.includes(location.pathname) || location.pathname.includes("/Admin")||location.pathname.includes("/admin")  || location.pathname.includes("/lens");

  // Handle responsive viewport changes
  useEffect(() => {
    const checkViewportWidth = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkViewportWidth(); // Check width on mount
    window.addEventListener("resize", checkViewportWidth); // Listen for window resize

    return () => window.removeEventListener("resize", checkViewportWidth); // Cleanup
  }, []);

  const isAdminRoute = location.pathname.includes("/Admin") || location.pathname.includes("/admin");

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
      {/* Show navbars unless on login/signup/admin/lens routes */}
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
  const hideNavbarsExact = ["/login", "/signup", "/forgot-password", "/reset-password", "/admin"];

  // Check if current route should hide footer
  const shouldHideNavbar =
    hideNavbarsExact.includes(location.pathname) || location.pathname.includes("/Admin") ||location.pathname.includes("/admin") || location.pathname.includes("/lens");

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
      {/* Show footer unless on login/signup/admin/lens routes */}
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
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        toastStyle={{ zIndex: 999999 }}
      />
     {/* Navigation Layout - Controls when to show/hide navbars */}
     <Layout />

    <Routes>

      {/* ========== PUBLIC ROUTES ========== */}
      {/* These routes are accessible to all users without authentication */}
      
      <Route
        path="/"
        element={
          <Page title="Arora Opticals | Home">
            <Home />
          </Page>
        }
      />
      <Route
        path="/signup"
        element={
          <Page title="Arora Opticals | Sign Up">
            <Signup />
          </Page>
        }
      />
      <Route
        path="/login"
        element={
          <Page title="Arora Opticals | Login">
            <Login />
          </Page>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <Page title="Arora Opticals | Forgot password">
            <ForgotPassword />
          </Page>
        }
      />
      <Route
        path="/reset-password"
        element={
          <Page title="Arora Opticals | Reset password">
            <ResetPassword />
          </Page>
        }
      />
      <Route
        path="/shop/:category/:audience"
        element={
          <Page title="Arora Opticals | Shop">
            <ShopURL />
          </Page>
        }
      />
      <Route
        path="/product/:id"
        element={
          <Page title="Arora Opticals | Product Details">
            <Product />
          </Page>
        }
      />
      <Route
        path="/search"
        element={
          <Page title="Arora Opticals | Search Results">
            <SearchResults />
          </Page>
        }
      />
      <Route
        path="/blog"
        element={
          <Page title="Arora Opticals | Blog">
            <Blog />
          </Page>
        }
      />
      <Route
        path="/free-eye-test"
        element={
          <Page title="Arora Opticals | Free Eye Test">
            <FeeEyeTest />
          </Page>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <Page title="Arora Opticals | Privacy Policy">
            <PrivacyPolicy />
          </Page>
        }
      />
      <Route
        path="/contact-us"
        element={
          <Page title="Arora Opticals | Contact Us">
            <ContactUs />
          </Page>
        }
      />
      <Route
        path="/refund-policy"
        element={
          <Page title="Arora Opticals | Refund Policy">
            <RefundPolicy />
          </Page>
        }
      />
      <Route
        path="/shipping-policy"
        element={
          <Page title="Arora Opticals | Shipping Policy">
            <ShippingPolicy />
          </Page>
        }
      />
      <Route
        path="/terms-and-conditions"
        element={
          <Page title="Arora Opticals | Terms and Conditions">
            <TermsAndConditions />
          </Page>
        }
      />
      <Route
        path="/about-us"
        element={
          <Page title="Arora Opticals | About Us">
            <AboutUs />
          </Page>
        }
      />
      <Route
        path="/thank-you"
        element={
          <Page title="Arora Opticals | Thank You">
            <ThankYou />
          </Page>
        }
      />
      <Route
        path="/accessories"
        element={
          <Page title="Arora Opticals | Accessories">
            <Accessories />
          </Page>
        }
      />
      <Route
        path="*"
        element={
          <Page title="Arora Opticals | Page Not Found">
            <h1>Not Found</h1>
          </Page>
        }
      />

      {/* ========== PROTECTED USER ROUTES ========== */}
      {/* These routes require user authentication */}
      <Route element={<ProtectedRoute/>}>
        <Route
          path="/cart"
          element={
            <Page title="Arora Opticals | Cart">
              <Cart />
            </Page>
          }
        />
        <Route
          path="/checkout"
          element={
            <Page title="Arora Opticals | Checkout">
              <Checkout />
            </Page>
          }
        />
        <Route
          path="/order/:orderId"
          element={
            <Page title="Arora Opticals | Order Details">
              <OrderDetails />
            </Page>
          }
        />
        <Route
          path="/settings"
          element={
            <Page title="Arora Opticals | Settings">
              <Settings />
            </Page>
          }
        />
        <Route
          path="/lens/:id"
          element={
            <Page title="Arora Opticals | Lens">
              <Lens />
            </Page>
          }
        />
        <Route
          path="/eye-test"
          element={
            <Page title="Arora Opticals | Eye Test Booking">
              <BookingForm />
            </Page>
          }
        />
      </Route>

      {/* ========== ADMIN ROUTES ========== */}
      {/* These routes require admin authentication and desktop access */}
      <Route element={<ProtectedRoute/>}>
        <Route
          path="/admin"
          element={
            <Page title="Arora Opticals Admin | Dashboard">
              <DashBoard />
            </Page>
          }
        >
          {/* Admin Dashboard - Main admin interface */}
          {/* <Route index element={<Home2 />} /> */}
          <Route
            index
            element={
              <Page title="Arora Opticals Admin | Products">
                <Products />
              </Page>
            }
          />
          
          {/* Product Management */}
          <Route
            path="products"
            element={
              <Page title="Arora Opticals Admin | Products">
                <Products />
              </Page>
            }
          />
          <Route
            path="add-product"
            element={
              <Page title="Arora Opticals Admin | Add Product">
                <AddProduct />
              </Page>
            }
          />
          <Route
            path="edit-product/:id"
            element={
              <Page title="Arora Opticals Admin | Edit Product">
                <EditProduct />
              </Page>
            }
          />
          <Route
            path="products/bulk-upload"
            element={
              <Page title="Arora Opticals Admin | Bulk Upload Products">
                <BulkUploadProducts />
              </Page>
            }
          />
          
          {/* Order Management */}
          <Route
            path="orders"
            element={
              <Page title="Arora Opticals Admin | Orders">
                <Shopping />
              </Page>
            }
          />
          <Route
            path="order-management"
            element={
              <Page title="Arora Opticals Admin | Order Management">
                <OrderManagement />
              </Page>
            }
          />
          
          {/* User Management */}
          <Route
            path="user"
            element={
              <Page title="Arora Opticals Admin | Users">
                <User />
              </Page>
            }
          />
          <Route
            path="add-user"
            element={
              <Page title="Arora Opticals Admin | Add User">
                <AddUser />
              </Page>
            }
          />
          <Route
            path="view-user/:id"
            element={
              <Page title="Arora Opticals Admin | View User">
                <ViewUser />
              </Page>
            }
          />
          
          {/* Analytics and Search */}
          <Route
            path="analytics"
            element={
              <Page title="Arora Opticals Admin | Analytics">
                <Trending />
              </Page>
            }
          />
          <Route
            path="search"
            element={
              <Page title="Arora Opticals Admin | Search">
                <Search />
              </Page>
            }
          />
          
          {/* System Management */}
          <Route
            path="attributes"
            element={
              <Page title="Arora Opticals Admin | Attributes">
                <Attributes />
              </Page>
            }
          />
          <Route
            path="eye-test-management"
            element={
              <Page title="Arora Opticals Admin | Eye Test Management">
                <EyeTestManagement />
              </Page>
            }
          />
          
          {/* Policy Management */}
          <Route
            path="cancellation-policy"
            element={
              <Page title="Arora Opticals Admin | Cancellation Policy">
                <CancellationPolicy />
              </Page>
            }
          />
          <Route
            path="privacy-policy"
            element={
              <Page title="Arora Opticals Admin | Privacy Policy">
                <PrivacyPolicyAdmin />
              </Page>
            }
          />
          <Route
            path="shipping-policy"
            element={
              <Page title="Arora Opticals Admin | Shipping Policy">
                <ShippingPolicyAdmin />
              </Page>
            }
          />
          <Route
            path="terms-and-conditions"
            element={
              <Page title="Arora Opticals Admin | Terms and Conditions">
                <TermsAndConditionsAdmin />
              </Page>
            }
          />
          
          {/* Fallback for admin routes */}
          <Route
            path="*"
            element={
              <Page title="Arora Opticals Admin | Page Not Found">
                <p className="text-red-500 text-center">Page not found</p>
              </Page>
            }
          />
        </Route>
      </Route>
     
    </Routes>
    
    {/* Footer Layout - Controls when to show/hide footer */}
    <Layout2/>
  </BrowserRouter>
  </div>
  
}

