import React from 'react'
import BgImg from  "../assets/bgImg.png"
import Btn1 from './Btn1'

const IntroSection = () => {
  return (
    <div>
      <div className="relative ">
        <img src={BgImg} alt="" className=' w-full h-200 object-cover'/>
        <div className="absolute top-20 left-10 px-20 w-180 ">
        <h1 className='text-5xl font-bold leading-15'>Simplify Remote Team Collaboration </h1>
        <p className="text-xl mt-5 text-gray-700 w-100">All-in-one toolkit for tasks, chat, file sharing, and productivity insights.</p>
        <div className="mt-10">
          <Btn1/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IntroSection
