import React, { useState } from 'react'
import Sidebar from '../Component/Sidebar'
import Topbar from '../Component/Topbar'
import { Outlet } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'

const DashboardLayout = () => {

    const [open, setOpen] = useState(false);

    

  return (
    <div className='h-screen flex flex-col'>
        <Topbar open={open} setOpen={setOpen}/>
       
        <div className=" flex flex-1 overflow-hidden">
        <Sidebar/>

{open && (
        <div   
          onClick={() => setOpen(false)}
        ></div>
      )}
        <div className=" flex-1 overflow-y-auto ">
           <div className="flex justify-between flex-1 mb-5 mt-5 md:hidden items-center border border-purple-400 p-3 rounded-full">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="bg-transparent outline-none w-full"
                    />
                    <FaSearch className="text-gray-500 mr-2" />
                  </div>
        <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout