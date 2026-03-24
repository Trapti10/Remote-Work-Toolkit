import React from 'react'
import "tailwindcss";
import SignUpImg from "../assets/SignUp_Img.png";

const SignUp = () => {
   return ( 
   <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-200 to-purple-400 p-4"> 
   <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl flex overflow-hidden"> {/* Left Illustration */}
       <div className="hidden md:flex w-1/2 bg-purple-100">
        <img src={SignUpImg} alt="Signup Illustration" className="w-full h-full animate-float" /> </div> {/* Form */} 
       <div className="w-full md:w-1/2 p-8"> 
       <h2 className="text-3xl font-bold text-gray-800 mb-6"> Create Account ✨ </h2> 
       <form className="space-y-4"> 
         <input type="text" placeholder="Enter your name" className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400" /> 
         <input type="email" placeholder="Enter your email" className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400" /> 
         <input type="password" placeholder="Create a password" className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400" /> 
         <button className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition"> Sign Up </button> 
         </form> 
         <p className="text-center mt-6 text-sm"> Already have an account?{" "} <span className="text-purple-600 cursor-pointer">Log In</span>
          </p> 
          </div>
           </div> 
           </div> ); 
}


export default SignUp