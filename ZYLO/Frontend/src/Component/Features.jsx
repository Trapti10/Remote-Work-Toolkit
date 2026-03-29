import React from 'react'
import { BiTask } from "react-icons/bi";
import featuresIllustration from "../assets/features_illustration.png"
import { IoIosChatboxes } from "react-icons/io";

const Features = () => {
    return (
        <div className='flex flex-col justify-center items-center gap-10 mb-15'>
            <div className="flex flex-col gap-4 justify-center items-center ">
                <h1 className="text-3xl font-heading font-bold">Everything Your Team Needs to Work Smarter</h1>
                <p className="text-xl text-gray-700">From task planning to real-time collaboration, everything is designed to help your team stay focused and productive.</p>
            </div>
            <div className="flex justify-center items-center">

                <div className="flex flex-col gap-15">
                    <div className="flex gap-4 item-center justify-center">

                        <div className="">
                            <h1 className="">Task Management</h1>

                        </div>
                        <div className="h-15 w-15 rounded-full flex bg-purple-400 items-center justify-center">
                            <BiTask className='size-10 text-white' />
                        </div>
                    </div>
                    <div className="flex gap-4 item-center justify-center">

                        <div className="">
                            <h1 className="">Team Chat</h1>
                        </div>
                        <div className="h-15 w-15 rounded-full flex bg-purple-400 items-center justify-center">
                            <IoIosChatboxes className='size-10 text-white' />
                        </div>

                    </div>
                    <div className="flex gap-4 item-center justify-center">

                        <div className="">
                            <h1 className="">File Sharing</h1>
                        </div>
                        <div className="h-15 w-15 rounded-full flex bg-purple-400 items-center justify-center">
                            <BiTask className='size-10 text-white' />
                        </div>
                    </div>
                </div>
                <div className="">
                    <img src={featuresIllustration} alt="" />
                </div>
                <div className="flex flex-col gap-15">
                    <div className="flex gap-4 items-center justify-center">
                        <div className="h-15 w-15 rounded-full flex bg-purple-400 items-center justify-center">
                            <BiTask className='size-10 text-white' />
                        </div>
                        <div className="flex flex-col gap-6">

                            <h1 className="">Performance Insights</h1>
                        </div>

                    </div>
                    <div className="flex gap-4 item-center justify-center">
                        <div className="h-15 w-15 rounded-full flex bg-purple-400 items-center justify-center">
                            <BiTask className='size-10 text-white' />
                        </div>
                        <div className="">
                            <h1 className="">Daily Work Reports</h1>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 item-center justify-center">

                    <div className="h-15 w-15 rounded-full flex bg-purple-400 items-center justify-center">
                        <BiTask className='size-10 text-white' />
                    </div>
                    <div className="">
                        <h1 className="">Smart Alerts</h1>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Features