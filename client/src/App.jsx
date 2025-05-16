import {BrowserRouter,Routes, Route,useLocation } from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import PrimaryNavbar from './components/PrimaryNavbar.jsx'
import SecondaryNavbar from './components/SecondaryNavbar.jsx'
import Home from "./pages/Home/Home";
import Product from "./pages/Product/Product";
import Blog from "./pages/Home/Sections/Blog";
import FeeEyeTest from "./pages/Home/Sections/FreeEyeTest";
import Signup from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login.jsx"
// import Shop from "./pages/Shop/shop.jsx";
import Settings from "./pages/Settings/Setting.jsx";
import Cart from "./pages/Product/Cart.jsx";
import ShopURL from "./Routes/shopRoutes.jsx";
import Lens from "./pages/Lens/Lens.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import React,{useState,useEffect} from "react";
import DashBoard from "./pages/Admin/Dashboard.jsx";
import Products from "./pages/Admin/Products/Products.jsx";
import Shopping from "./pages/Admin/Shopping.jsx";
import User from "./pages/Admin/User.jsx";
import Trending from "./pages/Admin/Trending.jsx";
import Search from "./pages/Admin/Search.jsx";
import Home2 from './pages/Admin/Home.jsx';
import AddProduct from "./pages/Admin/Products/AddProduct.jsx";
import PrivacyPolicy from "./pages/Policies/PrivacyPolicy.jsx";
import ContactUs from "./pages/Policies/ContactUs.jsx";
import RefundPolicy from "./pages/Policies/RefundPolicy.jsx";
import ShippingPolicy from "./pages/Policies/ShippingPolicy.jsx";
import Footer from "./components/footer.jsx";
import Attributes from "./pages/Admin/Attributes.jsx";
import {ProtectedRoute} from "./providers/RoutesProvider.jsx";


const Layout = () => {
  const location = useLocation();
  const [isMobileView, setIsMobileView] = useState(false);

  // Routes to hide navbars (exact matches)
  const hideNavbarsExact = ["/login", "/signup", "/lens"];

  // Check if current route should hide navbars
  const shouldHideNavbar =
    hideNavbarsExact.includes(location.pathname) || location.pathname.includes("/Admin");

  useEffect(() => {
    const checkViewportWidth = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkViewportWidth(); // Check width on mount
    window.addEventListener("resize", checkViewportWidth); // Listen for window resize

    return () => window.removeEventListener("resize", checkViewportWidth); // Cleanup
  }, []);

  const isAdminRoute = location.pathname.includes("/Admin");

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

const Layout2 = () => {
  const location = useLocation();
  const [isMobileView, setIsMobileView] = useState(false);

  // Routes to hide navbars (exact matches)
  const hideNavbarsExact = ["/login", "/signup", "/lens"];

  // Check if current route should hide navbars
  const shouldHideNavbar =
    hideNavbarsExact.includes(location.pathname) || location.pathname.includes("/Admin");

  useEffect(() => {
    const checkViewportWidth = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkViewportWidth(); // Check width on mount
    window.addEventListener("resize", checkViewportWidth); // Listen for window resize

    return () => window.removeEventListener("resize", checkViewportWidth); // Cleanup
  }, []);

  const isAdminRoute = location.pathname.includes("/Admin");

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

export default function App() {
 
  const [isMobileView, setIsMobileView] = useState(false);
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
     <Layout />

    <Routes>

      {/* Public Routes Goes Here */}
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
      <Route path='*' element={<h1>Not Found</h1>} />

      {/* Routes that are authenticated and user role  */}
      <Route element={<ProtectedRoute/>}>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/settings' element={<Settings/>} />
        <Route path='/lens' element={<Lens/>} />
      </Route>


      {/* <Route path='/Admin' element={<Admin/>} /> */}

      <Route element={<ProtectedRoute/>}>
      <Route path="/Admin" element={<DashBoard />}>
            {/* Nested routes go here */}
            <Route index element={<Home2 />} /> {/* Default route when /Admin/Dashboard is visited */}
            <Route path="products" element={<Products />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="orders" element={<Shopping />} />
            <Route path="user" element={<User />} />
            <Route path="analytics" element={<Trending />} />
            <Route path="search" element={<Search />} />
            <Route path="attributes" element={<Attributes />} />
            <Route path="*" element={<p className="text-red-500 text-center">Page not found</p>} />
      </Route>
      </Route>
     
    </Routes>
    <Layout2/>
  </BrowserRouter>
  </div>
  
}

