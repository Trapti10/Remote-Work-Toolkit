import React, { useContext, useState } from 'react'
import "tailwindcss";
import SignUpImg from "../assets/SignUp_Img.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { UserDataContext } from '../Context/ContextUser';

const SignUp = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [userData, setUserData] = useState('')

  const navigate = useNavigate()

  const {user, setUser} = React.useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault();

     const fullname = { firstname };
  if (lastname && lastname.trim() !== "") {
    fullname.lastname = lastname;
  }

  const newUser = {
    fullname,
    email,
    password
  };

  try {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/users/register`,
    newUser,
    { headers: { "Content-Type": "application/json" } }
  );
  console.log("Signup success:", response.data);
} catch (err) {
  console.log("Signup failed:", err.response?.data || err.message);
}
  
    
if (response.status === 201) {
      const data = response.data;

      setUser(data.user);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    }


    setEmail('')
    setPassword('')
    setFirstname('')
    setLastname('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-violet-200 to-violet-100 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl flex flex-col md:flex-row sm:flex-row overflow-hidden">
        {/* Left Illustration */}
        <div className="flex md:w-full sm:w-1/2 w-full 
        bg-purple-100">
          <img src={SignUpImg} alt="Signup Illustration" className="w-full animate-float" draggable='false' /> </div>
        {/* Form */}
        <div className="bg-violet-300 sm:w-1/2 md:w-full">
          <div className="w-full p-6">
            <div className="bg-white p-4 rounded-3xl max-sm:-mt-10 md:mt-0">
              <h2 className="text-3xl font-bold text-gray-800 mb-6"> Create Account </h2>
              <form
                onSubmit={(e) => {
                  submitHandler(e)
                }}
                className="space-y-1">
                <h3>Enter your name</h3>
                <div className="flex gap-2">

                  <input
                    required
                    value={firstname}
                    onChange={(e) => {
                      setFirstname(e.target.value)
                    }}
                    type="text" placeholder="Enter first name" className="w-full p-3 border rounded-xl focus:outline-none border-gray-400 focus:ring-2 focus:ring-purple-400" />

                  <input
                    value={lastname}
                    onChange={(e) => {
                      setLastname(e.target.value)
                    }}
                    type="text" placeholder="Enter last name" className="w-full p-3 border rounded-xl focus:outline-none border-gray-400 focus:ring-2 focus:ring-purple-400" />

                </div>
                <h3>Email</h3>
                <input
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                  type="email" placeholder="Enter your email" className="w-full p-3 border border-gray-400  rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <h3>Password</h3>
                <input
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                  type="password" placeholder="Create a password" className="w-full p-3 border border-gray-400  rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <button className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition mt-2"> Sign Up </button>
              </form>
              <p className="text-center mt-6 text-sm"> Already have an account?{" "}  <Link to="/login" className="text-purple-600 cursor-pointer">
                Log In
              </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>);
}


export default SignUp