import {BrowserRouter,Routes, Route,useLocation } from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import PrimaryNavbar from './components/PrimaryNavbar.jsx'
import SecondaryNavbar from './components/SecondaryNavbar.jsx'
import Home from "./pages/Home/Home";
import Product from "./pages/Product/Product";
import Blog from "./pages/Home/Sections/Blog";
import FeeEyeTest from "./pages/Home/Sections/FreeEyeTest";
import Signup from "./pages/Auth/SignUp";
import Signin from "./pages/Auth/SignIn";
// import Shop from "./pages/Shop/shop.jsx";
import Settings from "./pages/Settings/Setting.jsx";
import Cart from "./pages/Product/Cart.jsx";
import ShopURL from "./Routes/shopRoutes.jsx";
import Lens from "./pages/Lens/Lens.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import React,{useState,useEffect} from "react";
import DashBoard from "./pages/Admin/Dashboard.jsx";



const Layout = () => {
  const location = useLocation();
  const [isMobileView, setIsMobileView] = useState(false);

  // Routes to hide navbars (exact matches)
  const hideNavbarsExact = ["/signin", "/signup", "/lens"];

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
  return <div className="h-screen"><BrowserRouter>
     <Layout />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product" element={<Product />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/free-eye-test" element={<FeeEyeTest />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/signin' element={<Signin />} />
      {/* <Route path='/shop' element={<Shop/>} /> */}
      <Route path='/shop/:category/:audience' element={<ShopURL />}/>
      <Route path='/settings' element={<Settings/>} />
      <Route path='/cart' element={<Cart/>}/>
      <Route path='*' element={<h1>Not Found</h1>} />
      <Route path='/lens' element={<Lens/>} />
      <Route path='/Admin' element={<Admin/>} />
      <Route path='/Admin/Dashboard' element={<DashBoard/>} />
    </Routes>

  </BrowserRouter>
  </div>
  
}

