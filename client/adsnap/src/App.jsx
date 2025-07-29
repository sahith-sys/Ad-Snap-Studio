import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./index.css";
import Home from "./components/Home";
import ImgGen from "./components/ImgGen";
import { ToastContainer } from "react-toastify";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Pricing from "./components/Pricing";
import BgGen from "./components/BgGen";
import AppContextProvider from "./components/AppContext";
import GenFill from "./components/GenFill";
import VectorGraphics from "./components/VectorGraphics";
import ProductEditing from "./components/ProductEditing";
import Test from "./components/Test";
import GenFillCopy from "./components/GenFillCopy";
import ComingSoon from "./components/ComingSoon";
import Footer from "./components/Footer";
import "@fortawesome/fontawesome-free/css/all.min.css";


function App() {
  const location = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const hideNavbar = ["/user/login", "/user/signup"];
  const shouldHideNavbar = hideNavbar.includes(location.pathname);
  
  return (
    <AppContextProvider>
    <div className="px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen border bg-gradient-to-b from-teal-50 to-orange-50">
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/user/login" element={<Login />}></Route>
        <Route path="/user/signup" element={<Signup />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/pricing" element={<Pricing />}></Route>
        <Route path="/bggen" element={<BgGen />}></Route>
        <Route path="/product-editing" element={<ProductEditing/>}></Route>
        <Route path="/gen-fill" element={<GenFill />}></Route>
        <Route path="/vector-graphics" element={<VectorGraphics />}></Route>
        <Route path="/imggen" element={<ImgGen />}></Route>
        <Route path="/test" element={<Test />}></Route>
        <Route path="*" element={<GenFillCopy />}></Route>
        <Route path="/coming-soon" element={<ComingSoon />}></Route>
      </Routes>
      <Footer />
      <ToastContainer />
    </div>
    </AppContextProvider>
  );
}

export default App;
