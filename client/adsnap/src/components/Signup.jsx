import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify';
import { AppContext } from './AppContext';
import { useNavigate } from 'react-router-dom';

function Signup() {
  
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const[name, setName] = useState("");
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const resp = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/signup`,{
      email,
      password,
      name,
    })
    if(resp.data.success){
      toast.success("Signup successfull!");
      localStorage.setItem("token",resp.data.token);
      localStorage.setItem("user",JSON.stringify(resp.data.user.name));
      navigate("/");
      setUser(resp.data.user.name);
    }
    else{
      toast.error(resp.data.message);
    }
  } catch (error) {
    console.log("Signup error",error);
    toast.error("Signup failed. Please try again.");
  }
}


  
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='flex flex-col items-center justify-center bg-white w-[400px] p-8 rounded-2xl shadow-2xl'>
        <h1 className='text-3xl font-bold mb-6 text-gray-800'>Create Account</h1>

        <form className='flex flex-col w-full' onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder='Full Name' 
            className='border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
            value={name}
            onChange={(e)=> setName(e.target.value)} 
          />
          <input 
            type="email" 
            placeholder='Email' 
            className='border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
            value={email}
            onChange={(e)=> setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder='Password' 
            className='border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
            value={password}
            onChange={(e)=> setPassword(e.target.value)} 
          />

          <button 
            type="submit" 
            className='bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 mt-2'
          >
            Sign Up
          </button>
        </form>

        <p className='mt-4 text-gray-600 text-sm'>
          Already have an account?{' '}
          <Link to="/user/login" className='text-blue-500 hover:underline'>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
