import React from 'react'
import LOGO from '../assets/logo.png'
import Btn1 from './Btn1'
import Btn2 from './Btn2'

const Navbar = () => {
  return (
    <div className='w-full h-20 bg-purple-100 flex justify-between items-center px-25 py-10 text-xl font-semibold'>
      <div className=" h-30">
        <img src={LOGO} alt="Logo" srcset="" className='h-full'/>
        </div>
        <div className="flex gap-10 items-center">
            <h1>Home</h1>
            <h1>Features</h1>
            <h1>About</h1>
            <div className="flex gap-4 justify-center items-center">
            <div className="w-full">
                <Btn1/>
            </div>
            <div className="w-full">
                <Btn2/>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar
