import React from 'react'
import LOGO from '../assets/logo.png'
import Btn1 from './Btn1'
import Btn2 from './Btn2'
import { Link } from 'react-router-dom'

const Navbar = () => {

   const handleScroll = (id) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    }
  }

  return (
    <div className='w-full h-20 bg-purple-100 flex justify-between items-center px-25 py-10 text-md font-semibold'>
      <Link to='/' className=" h-30">
        <img src={LOGO} alt="Logo" srcset="" className='h-full'/>
        </Link>
        <div className="flex gap-10 items-center">
            <Link to='/' className='text-purple-800'>Home</Link>
              <h1 onClick={() => handleScroll("features")} className="cursor-pointer hover:text-purple-800"
        >
          Features
        </h1>
            <Link to='/about' className='hover:text-purple-800'>About</Link>
            <div className="flex gap-4 justify-center items-center">
            <Link to='/signup' className=" hover:-translate-y-1 transition duration-300 cursor-pointer">
                <Btn1/>
            </Link>
            <Link to='/login' className=" hover:-translate-y-1 transition duration-300 cursor-pointer">
                <Btn2/>
            </Link>
            </div>
        </div>
    </div>
  )
}

export default Navbar
