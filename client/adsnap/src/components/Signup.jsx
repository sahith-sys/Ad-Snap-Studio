import React from 'react';
import { Link } from 'react-router-dom';
function Signup() {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='flex flex-col items-center justify-center bg-white w-[400px] p-8 rounded-2xl shadow-2xl'>
        <h1 className='text-3xl font-bold mb-6 text-gray-800'>Create Account</h1>

        <form className='flex flex-col w-full'>
          <input 
            type="text" 
            placeholder='Full Name' 
            className='border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400' 
          />
          <input 
            type="email" 
            placeholder='Email' 
            className='border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400' 
          />
          <input 
            type="password" 
            placeholder='Password' 
            className='border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400' 
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
