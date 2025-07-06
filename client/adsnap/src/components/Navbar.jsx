import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import "../index.css"; // Ensure you have Tailwind CSS set up
function Navbar() {
  const [user, setUser] = useState(false);

  return (
    <div>
      <nav className="flex justify-between items-center p-4">
        <div className="flex justify-center items-center space-x-2">
          <Link to="/">
            <img src={logo} alt="" className="w-15" />
          </Link>
          <div className="text-2xl font-bold text-black-100">AdSnap</div>
        </div>
        
        {!user ? (
          <div className=" align-center justify-center space-x-4">
            <Link
              to="/pricing"
              className="text-gray-700 hover:text-black-600 cursor-pointer hover:underline"
            >
              Pricing
            </Link>
            <Link
              to="/user/login"
              className="bg-black text-white px-4 py-2 rounded  hover:bg-gray-900 hover:scale-125 hover:shadow-xl transition-colors duration-300"
            >
              Login
            </Link>
          </div>
        ) : (
          <ul className="flex space-x-4">
            <li className="text-gray-700 hover:text-black-600 cursor-pointer">
              Home
            </li>
            <li className="text-gray-700 hover:text-black-600 cursor-pointer">
              About
            </li>
            <li className="text-gray-700 hover:text-black-600 cursor-pointer">
              Contact
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
