import React, { useContext, useState } from 'react'
import { UserDataContext } from '../Context/ContextUser'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BiBell } from 'react-icons/bi';
import { FaBars } from 'react-icons/fa6';
import logo from '../assets/logo.png'
import { FaSearch } from 'react-icons/fa';

import { GiHamburgerMenu } from "react-icons/gi";
import { TbMenu3 } from "react-icons/tb";
import Sidebar from './Sidebar';

const Topbar = ({open, setOpen}) => {

    const {user} = useContext(UserDataContext);

    const toggleMenu = () =>{
      setOpen(!open)
    }
    const navigate = useNavigate();

  return (
       <div className="flex justify-between items-center p-4 relative shadow-md bg-purple-200">
        <div className="flex gap-4 ">
        <button className='block md:hidden' onClick ={toggleMenu}>
                {open ?<TbMenu3/>: <GiHamburgerMenu/>}
                </button>
               <Link to='/' className=" h-10">
        <img src={logo} alt="Logo"  className='h-full'/>
        </Link>
        </div>
          <div className="hidden md:flex items-center border border-purple-400 px-3 py-2 rounded-lg w-1/3">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-full"
          />
        </div>

          <div className="flex items-center gap-4">
            <button className="bg-purple-600  py-2 rounded-lg md:w-28md:h-15 w-25 text-sm  hover:bg-purple-700">
              + New Task
            </button>
            <span
            onClick = {() =>{
            navigate('profile')
            }} 
            className='w-10 h-10 items-center flex flex-1 justify-center rounded-full bg-gray-500'>{user?.fullname?.firstname?.slice(0, 1)}
              
            </span>
          <button><BiBell/></button>

{/* Mobile Menu */}
<div   className={`fixed left-0 top-18  w-60 shadow-lg p-4 bg-purple-700 text-white  h-full transform transition-transform duration-300 md:hidden 
  ${open ? "translate-x-0" : "-translate-x-full"}`}>

      <NavLink
        to="/dashboard"
        className="block mb-3 hover:text-purple-400"
      >
        Dashboard
      </NavLink>

      <NavLink
        to="profile"
        className="block hover:text-purple-400"
      >
        Profile
      </NavLink>

    </div>
</div>

          </div>
      
      
  )
}

export default Topbar