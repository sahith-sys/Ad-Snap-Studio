import React from "react";
import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <AppContextProvider>
    <div className="px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen border bg-gradient-to-b from-teal-50 to-orange-50">
      
      <Routes>
        <Route path="/user/login" element={<Login />}></Route>
        <Route path="/user/signup" element={<Signup />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/pricing" element={<Pricing />}></Route>
        <Route path="/imggen" element={<ImgGen />}></Route>
        <Route path="/bggen" element={<BgGen />}></Route>
      </Routes>
      <ToastContainer />
    </div>
    </AppContextProvider>
  );
}

export default App;
