import React, { useState } from 'react'
import LOGO from '../assets/logo.png'
import Btn1 from './Btn1'
import Btn2 from './Btn2'
import { Link } from 'react-router-dom'
import { Menu, X } from "lucide-react"

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false)

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
    <div className='w-full h-20 bg-purple-200 flex justify-between items-center px-6 md:px-20 py-4 text-md font-semibold shadow-2xl'>

      {/* Logo */}
      <Link to='/' className="h-10">
        <img src={LOGO} alt="Logo" className='h-full' />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-10 items-center">
        <Link to='/' className='text-purple-800'>Home</Link>

        <h1
          onClick={() => handleScroll("features")}
          className="cursor-pointer hover:text-purple-800"
        >
          Features
        </h1>

        <Link to='/about' className='hover:text-purple-800'>About</Link>

        <div className="flex gap-4 justify-center items-center">
          <Link to='/signup' className="hover:-translate-y-1 transition duration-300 cursor-pointer">
            <Btn1 text='Get Started' />
          </Link>

          <Link to='/login' className="hover:-translate-y-1 transition duration-300 cursor-pointer">
            <Btn2 />
          </Link>
        </div>
      </div>

      {/* Hamburger */}
      <div className="md:hidden">
        {isOpen ? (
          <X onClick={() => setIsOpen(false)} className="cursor-pointer" />
        ) : (
          <Menu onClick={() => setIsOpen(true)} className="cursor-pointer" />
        )}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-purple-200 flex flex-col items-center gap-6 py-6 shadow-md md:hidden z-50">

          <Link to='/' onClick={() => setIsOpen(false)}>Home</Link>

          <h1
            onClick={() => {
              handleScroll("features")
              setIsOpen(false)
            }}
            className="cursor-pointer"
          >
            Features
          </h1>

          <Link to='/about' onClick={() => setIsOpen(false)}>About</Link>

          <div className="flex flex-col gap-4">
            <Link to='/signup' onClick={() => setIsOpen(false)}>
              <Btn1 text='Get Started' />
            </Link>

            <Link to='/login' onClick={() => setIsOpen(false)}>
              <Btn2 />
            </Link>
          </div>

        </div>
      )}

    </div>
  )
}

export default Navbar