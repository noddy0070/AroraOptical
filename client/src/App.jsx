import {BrowserRouter,Routes, Route,useLocation } from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import PrimaryNavbar from './components/PrimaryNavbar.jsx'
import SecondaryNavbar from './components/SecondaryNavbar.jsx'
import Home from "./pages/Home/Home";
import Product from "./pages/Product/Product";
import Blog from "./pages/Home/Sections/Blog";
import FeeEyeTest from "./pages/Home/Sections/FreeEyeTest";
import AboutUS from "./pages/Home/Sections/AboutUs";
import Signup from "./pages/Auth/SignUp";
import Signin from "./pages/Auth/SignIn";
import Shop from "./pages/Shop/shop.jsx";
import Settings from "./pages/Settings/Setting.jsx";
import Cart from "./pages/Product/Cart.jsx";



const Layout = () => {
  const location = useLocation();
  const hideNavbars = ['/signin', '/signup']; // Routes to hide navbars

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
  
  return <BrowserRouter>
     <Layout />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product" element={<Product />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/free-eye-test" element={<FeeEyeTest />} />
      <Route path="/about-us" element={<AboutUS />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/signin' element={<Signin />} />
      <Route path='/shop' element={<Shop/>} />
      <Route path='/settings' element={<Settings/>} />
      <Route path='/cart' element={<Cart/>}/>
      <Route path='*' element={<h1>Not Found</h1>} />

    </Routes>

  </BrowserRouter>
  
}

