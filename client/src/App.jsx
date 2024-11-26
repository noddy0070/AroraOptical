import {BrowserRouter,Routes, Route} from "react-router-dom";
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

export default function App() {
  return <BrowserRouter>
    <PrimaryNavbar/>
    <SecondaryNavbar  />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product" element={<Product />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/free-eye-test" element={<FeeEyeTest />} />
      <Route path="/about-us" element={<AboutUS />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/signin' element={<Signin />} />
      <Route path='/shop' element={<Shop/>} />

    </Routes>

  </BrowserRouter>
  
}

