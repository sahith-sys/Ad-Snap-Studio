import React from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="flex justify-between items-center py-3 gap-4 mt-20">
      <img src={logo} alt="Logo of AdSnap" className="w-15" />
      <p className="flex-1 text-sm text-gray-500 max-sm:hidden">
        Copyright &copy; {new Date().getFullYear()} AdSnap | All rights
        reserved.
      </p>
      <div className="flex gap-2.5">
        <Link to="https://xcom/Sahith_twts"><i className="fa-brands fa-x-twitter fa-xl" style={{ color: "#000000" }}></i></Link>
        <Link to="https://github.com/sahith-sys/Ad-Snap-Studio"><i className="fa-brands fa-github fa-xl" style={{ color: "#000000" }}></i></Link>
        <Link to="https://www.linkedin.com/in/sahith07/"><i className="fa-brands fa-linkedin fa-xl" style={{ color: "#1f60d1" }}></i></Link>
      </div>
    </div>
  );
}

export default Footer;
