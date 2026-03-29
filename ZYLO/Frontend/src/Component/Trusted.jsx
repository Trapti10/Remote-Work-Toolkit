import React from 'react'
import logo1 from'../assets/logo1.png'
import logo2 from'../assets/logo2.png'
import logo3 from'../assets/logo3.png'
import logo4 from'../assets/logo4.png'
import logo5 from'../assets/logo5.png'

const Trusted = () => {
  return (
    <div className='flex flex-col gap-7 items-center justify-center bg-purple-50 mb-20'>
    <h1 className="text-3xl font-heading font-bold">Trusted students, startups, and remote teams</h1>
    <div className="flex gap-8">
        <div className="flex justify-center items-center gap-2 text-violet-700 text-lg">
            <img src={logo1} alt="" />
            <h1 className='font-body'>StartUpHub</h1>
            </div>
        <div className="flex justify-center items-center gap-2 text-violet-700 text-lg">
            <img src={logo2} alt="" />
            <h1 className='font-sans'>TeamSync</h1>
            </div>
        <div className="flex justify-center items-center gap-2 text-violet-700 text-lg">
            <img src={logo3} alt="" />
           <h1 className='font-sans'>CodeSphere</h1>
            </div>
        <div className="flex justify-center items-center gap-2 text-violet-700 text-lg">
            <img src={logo4} alt="" />
            <h1 className='font-sans'>SwiftWork</h1>
            </div>
        <div className="flex justify-center items-center gap-2 text-violet-700 text-lg">
            <img src={logo5} alt="" />
            <h1 className='font-sans'>TetraWave</h1>
            </div>
    </div>
    </div>
  )
}

export default Trusted