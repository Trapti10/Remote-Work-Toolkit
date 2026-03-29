import React from 'react'
import { BiTask } from "react-icons/bi";
import featuresIllustration from "../assets/features_illustration.png"
import { IoIosChatboxes } from "react-icons/io";
import { FaFolderOpen } from "react-icons/fa6";
import Performance from './Performance';
import { TbReport } from "react-icons/tb";
import { HiMiniBellAlert } from "react-icons/hi2";

const Features = () => {


    const leftValues = value.slice(0, 3).map(item=>{
      return (
        <div className="flex md:flex-row-reverse items-center gap-7"  key={item.id}>
            <div >
                <span className='flex justify-center items-center bg-linear-to-b from-purple-500 to-purple-600 w-14 h-14 rounded-full text-white text-3xl'>{item.icon}</span>
            </div>
            <div className="md:text-right ">
                <h3 className='text-2xl text-zinc-800 font-bold'>{item.title}</h3>
                <p className='text-md text-zinc-600 mt-2'>{item.para}</p>
            </div>
        </div>
      )
    })
    const rightValues = value.slice(3, 6).map(item=>{
        return (
            <div className="flex flex-row items-center gap-7" key={item.id}>
            <div >
            <span className='flex justify-center items-center bg-linear-to-b from-purple-500 to-purple-600 w-14 h-14 rounded-full text-white text-3xl'>{item.icon}</span>
            </div>
            <div className="md:text-left">
            <h3 className='text-2xl text-zinc-800 font-bold'>{item.title}</h3>
            <p className='text-md text-zinc-600 mt-2'>{item.para}</p>
            </div>
        </div>
      )
    })
   

    return (
        <div className='flex flex-col justify-center items-center gap-10 mb-15 pl-15 pr-15'>
            <div className="flex flex-col gap-4 justify-center items-center ">
                <h1 className="text-3xl font-heading font-bold">Everything Your Team Needs to Work Smarter</h1>
                <p className="text-xl text-gray-700">From task planning to real-time collaboration, everything is designed to help your team stay focused and productive.</p>
            </div>
         <div className="flex md:flex-row flex-col gap-15 md:gap-5 mt-15">
                    {/* Left values */}
                    <div className="md:min-h-100 flex flex-col justify-between gap-15">
                       {leftValues}
                    </div>

                    {/* Features img */}
                    
                <div className="md:flex hidden w-1/3">
                    <img src={featuresIllustration} alt="" />
                </div>
                    
                    {/* Right values */}
                    <div className="md:min-h-100 flex flex-col justify-between gap-15">
                        {rightValues}
                    </div>
                </div>
        </div>

    )
}

export default Features


const value = [
    {
        id: 1,
         title: "Task Management",
         para: "Organize and track your team's tasks",
         icon: <BiTask />
    },
    {
        id: 2,
         title: "Team Chat",
         para: "Collaborate instantly with your team through fast, secure, and organized messaging.",
         icon: <IoIosChatboxes />
    },
    {
        id: 3,
         title: "File Sharing",
         para: "Upload, share, and access important files anytime, all in one secure workspace.",
         icon: <FaFolderOpen/>
    },
    {
        id: 4,
         title: "Performance",
         para: "Monitor team productivity and progress with simple and actionable analytics.",
         icon: <Performance/>
    },
    {
        id: 5,
         title: "Daily Work Reports",
         para: "Get automatic summaries of completed and pending tasks to stay on track.",
         icon: <TbReport/>
    },
    {
        id: 6,
         title: "Smart Alerts",
         para: "Receive timely updates on tasks, messages, and deadlines without missing anything.",
         icon: <HiMiniBellAlert />
    },
]