import React from 'react'
import logo1 from'../assets/logo1.png'
import logo2 from'../assets/logo2.png'
import logo3 from'../assets/logo3.png'
import logo4 from'../assets/logo4.png'
import logo5 from'../assets/logo5.png'

const value = [
    {
        id: 1,
        img: logo1,
        name: "StartUpHub",
    },
    {
        id: 2,
        img: logo2,
        name: "TeamSync",
    },
    {
        id: 3,
        img: logo3,
        name: "CodeSphere",
    },
    {
        id: 4,
        img: logo4,
        name: "SwiftWork",
    },
    {
        id: 5,
        img: logo5,
        name: "TetraWave",
    },
]


const Trusted = () => {
  return (
    <div className='flex flex-col gap-7 items-center justify-center bg-purple-50 mb-20 p-8'>
    <h1 className="text-3xl font-heading font-bold">Trusted by students, startups, and remote teams</h1>
    <div className="flex gap-10">
        {
            value.map(item =>(

        <div key={item.id} className="flex justify-center items-center gap-2 text-violet-500 text-lg" >
            <img src={item.img} alt={item.name} />
            <h1 className='font-body'>{item.name}</h1>
            </div>
            ))
        }
    </div>
    </div>
  )
}

export default Trusted