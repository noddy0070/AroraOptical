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



const Layout = () => {
  const location = useLocation();
  const hideNavbars = ['/signin', '/signup','/lens']; // Routes to hide navbars

  return (
    <>
      {!hideNavbars.includes(location.pathname) && (
        <>
          <PrimaryNavbar />
          <SecondaryNavbar />
        </>
      )}
    </>
  );
};


export default function App() {
  
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
    </Routes>

  </BrowserRouter>
  </div>
  
}

