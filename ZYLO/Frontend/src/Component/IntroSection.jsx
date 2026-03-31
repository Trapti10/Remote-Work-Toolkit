import React from 'react'
import BgImg from  "../assets/bgImg.png"
import Btn1 from './Btn1'
import { Link } from 'react-router-dom'

const IntroSection = () => {
  return (
    <div >
      <div className="relative ">
        <img src={BgImg} alt="" className=' w-full h-200 object-cover'/>
        <div className="absolute top-20 left-10 px-18 w-180 ">
        <h1 className='text-5xl font-heading font-bold leading-15'>Simplify Remote Team Collaboration </h1>
        <p className="text-lg mt-5 font-sans text-gray-700 w-100">All-in-one toolkit for tasks, chat, file sharing, and productivity insights.</p>
       
       <div className="mt-5 hover:-translate-y-1 transition duration-300 cursor-pointer">
         <Link to='/signup'  className="mt-10 hover:-translate-y-1 transition duration-300 cursor-pointer">
          <Btn1 text="Get Started"/>
          </Link>
        </div>
        </div>
      </div>
    </div>
  )
}

export default IntroSection
