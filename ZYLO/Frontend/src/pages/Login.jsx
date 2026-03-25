import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import "tailwindcss";
import LoginImg from "../assets/Login_Img.png"

const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userData, setUserData] = useState('')

  const submitHandler = (e)=>{
    e.preventDefault();
    setUserData({
      email: email,
      password: password
    })
    setEmail('')
    setPassword('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-violet-200 to-violet-100 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row sm:flex-row"> {/* Left Illustration Section */}
        <div className="flex md:w-full sm:w-1/2 w-full  bg-purple-100">
          <img src={LoginImg} alt="Login Illustration" className="w-full animate-float" draggable='false'/>
        </div> {/* Form Section */}
        <div className="bg-violet-300 sm:w-1/2 md:w-full">
          <div className="w-full p-6">
            <div className="bg-white p-4 rounded-3xl max-sm:-mt-10 md:mt-0">
              <h2 className="text-3xl font-bold text-gray-800 mb-6"> Welcome Back </h2>

              <form onSubmit={(e)=>{
                submitHandler(e)
              }}
              className="space-y-4">
                <h1>Email</h1>
                <input
                 required
                 value={email}
                 onChange={(e)=>{
                  setEmail(e.target.value)
                 }}
                  type="email" placeholder="Enter your email" className="w-full p-3 border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <h1>Password</h1>
                <input
                required 
                value={password}
                onChange={(e)=>{
                  setPassword(e.target.value)
                }}
                type="password" placeholder="Enter your password" className="w-full p-3 border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <div className="text-right text-sm text-purple-600 cursor-pointer">
                  Forgot password?
                </div>
                <button className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition"> Log In </button>
              </form>
              <p className="text-center mt-6 text-sm"> Don’t have an account?{" "}
                <Link to="/signup" className="text-purple-600 cursor-pointer">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
