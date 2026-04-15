import React from 'react'
import BgImg from  "../assets/bgImg.png"
import Btn1 from './Btn1'
import { Link } from 'react-router-dom'

const IntroSection = () => {
  return (
    <div>
      <div className="relative">

        {/* Image */}
        <img 
          src={BgImg} 
          alt="" 
          className='w-full h-75 md:h-125 lg:h-175 object-cover'
        />

        {/* Text Content */}
        <div className="
          md:absolute 
          md:top-20 md:left-10 
          px-20 md:px-18 
          w-full md:w-150 md:items-baseline-last
          bg-white md:bg-transparent 
          py-6 md:py-0 left-20 flex flex-col justify-center items-center
        ">

          <h1 className='text-2xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight md:leading-15'>
            Simplify Remote Team Collaboration
          </h1>

          <p className="text-sm  md:text-lg mt-4 md:mt-5 font-sans text-gray-700 md:w-100">
            All-in-one toolkit for tasks, chat, file sharing, and productivity insights.
          </p>

          <div className="mt-5 hover:-translate-y-1 transition duration-300 cursor-pointer">
            <Link to='/signup'>
              <Btn1 text="Get Started"/>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default IntroSection