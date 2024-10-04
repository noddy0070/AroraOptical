import {BrowserRouter,Routes, Route} from "react-router-dom";

import Home from "./pages/Home/Home";
import Product from "./pages/Product/Product";
import Blog from "./pages/Home/Blog";
import FeeEyeTest from "./pages/Home/FreeEyeTest";
import AboutUS from "./pages/Home/AboutUs";

export default function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product" element={<Product />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/free-eye-test" element={<FeeEyeTest />} />
      <Route path="/about-us" element={<AboutUS />} />


    </Routes>

  </BrowserRouter>
  
}

