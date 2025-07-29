import React, { useContext, useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import axios from "axios";
import "../index.css";
import { AppContext } from "./AppContext";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const { user, credits } = useContext(AppContext);
  const [logoutButton, setLogoutButton] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const Navigate = useNavigate();
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <div className="relative">
      <nav className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex justify-center items-center space-x-2">
          <Link to="/">
            <img src={logo} alt="" className="w-16" />
          </Link>
          <div className="text-2xl font-bold text-black-100">AdSnap</div>
        </div>

        {!user ? (
          <div>
            <div className=" items-center justify-center space-x-4">
              <Link
                to="/pricing"
                className="text-gray-700 hover:text-black-600 cursor-pointer hover:underline"
              >
                Pricing
              </Link>
              <button
                onClick={() => Navigate("/user/login")}
                className="bg-black text-white px-4 py-2 rounded  hover:bg-gray-900 hover:scale-105 hover:shadow-xl transition-colors duration-300 cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="hidden md:flex items-center justify-between space-x-4">
              <ul className="flex space-x-4 align-center justify-center">
                <Link to={"/pricing"} className="hover:underline">
                  <li>
                    <div>
                      <p>Credits Remaining: {credits}</p>
                    </div>
                  </li>
                </Link>
                <li className="text-gray-700 hover:text-black-600 cursor-pointer">
                  <img
                    src="https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
                    alt=""
                    className="w-8 h-8 relative rounded-full relative cursor-pointer"
                    onClick={() => setLogoutButton(!logoutButton)}
                  />
                  {logoutButton && (
                    <div className="absolute right-12 top-18 bg-white shadow-lg rounded-lg p-4">
                      <button
                        onClick={() => {
                          localStorage.removeItem("user");
                          localStorage.removeItem("token");
                          window.location.reload();
                        }}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </li>
                <li>
                  <p>Hi, {user.split(" ")[0]}</p>
                </li>
              </ul>
            </div>
            <div className="md:hidden">
              <button onClick={() => { setIsOpen(!isOpen); setShowFeatures(false); }} className="p-2 cursor-pointer">
                {isOpen ? <X /> : <Menu />}
              </button>

              {isOpen && (
                <div className="absolute z-100 flex flex-col gap-3 right-0 top-16 bg-white shadow-lg rounded-lg px-4 pb-4">
                  <div className="pt-2">
                    <h3>Hi, {user.split(" ")[0]}</h3>
                  </div>
                  <div>
                    <Link to={"/pricing"} onClick={() => setIsOpen(false)} className="hover:underline">
                      <p>Credits Remaining: {credits}</p>
                    </Link>
                  </div>
                  <div>
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => setShowFeatures(!showFeatures)}
                    >
                      <h3>Features</h3>
                      {!showFeatures ? (
                        <i
                          className="fa-solid fa-angle-down ms-3 mt-1"
                          style={{ color: "#000000" }}
                        ></i>
                      ) : (
                        <i
                          className="fa-solid fa-angle-up ms-3 mt-1"
                          style={{ color: "#000000" }}
                        ></i>
                      )}
                    </div>
                  </div>
                  {showFeatures && (
                    <div className="flex flex-col gap-2">
                      <Link to="/imggen" onClick={() => setIsOpen(false)} className="hover:underline">
                        Image Generation
                      </Link>
                      <Link to="/bggen" onClick={() => setIsOpen(false)} className="hover:underline">
                        Background Generation
                      </Link>
                      <Link to="/product-editing" onClick={() => setIsOpen(false)} className="hover:underline">
                        Product Editing
                      </Link>
                      <Link to="/coming-soon" onClick={() => setIsOpen(false)} className="hover:underline">
                        Generative Fill
                      </Link>
                      <Link to="/vector-graphics" onClick={() => setIsOpen(false)} className="hover:underline">
                        Vector Graphics
                      </Link>
                    </div>
                  )}
                  <div>
                    <button
                      onClick={() => {
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        window.location.reload();
                      }}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
