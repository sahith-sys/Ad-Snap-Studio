import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext";
import {useNavigate} from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {setUser} = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      const resp = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/login`,{
        email,
        password,
      })
      if(resp.data.success){
        localStorage.setItem("token",resp.data.token);
        localStorage.setItem("user",JSON.stringify(resp.data.user.name));
        navigate("/");
        setUser(resp.data.user.name);
      }
      else{
        toast.error(resp.data.message);
      }
    } catch (error) {
      console.log("Login error",error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center bg-white w-[400px] p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Login</h1>

        <form className="flex flex-col w-full" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 mt-2"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link to="/user/signup" className="text-blue-500 hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
