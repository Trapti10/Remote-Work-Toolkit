import React, { useContext } from 'react'
import ContextUser, { UserDataContext } from '../Context/ContextUser'
import Btn1 from "../Component/Btn1"
import { FaEdit } from 'react-icons/fa';

const UserProfile = () => {

  const { user } = useContext(UserDataContext);



  return (
    <div className=" min-h-screen p-6 bg-[#cfcfcf55]">
      <h1 className="text-lg mb-6 font-heading  text-purple-700">My Profile</h1>

      <div className="md:flex gap-8 items-center p-10 rounded-lg bg-white">
        <span className='flex items-center justify-center text-2xl bg-purple-400 text-white h-20 w-20 rounded-full'>
          {user?.fullname?.firstname.slice(0, 1)}
        </span>
        <div className="flex flex-col gap-1">
          <h3 className='text-xl text-purple-700'>{user?.fullname?.firstname} {user?.fullname?.lastname}</h3>
          <h3 className='text-sm text-gray-700'>{user?.role}</h3>
          <h3 className='text-sm text-gray-700'>{user?.email}</h3>
        </div>
      </div>

      <div className="mt-6 p-6 bg-white rounded-2xl">
        <div className="flex justify-between">
          <h1 className="text-lg font-heading text-purple-700">Personal Informtion</h1>

          <Btn1 text={<><FaEdit className="mr-2" /> Edit</>} />
        </div>
        <div className=" border border-gray-200 mt-2 mb-8"></div>
        <div className="grid md:grid-cols-3 grid-cols-2 gap-4 items-center justify-center">
          <div className="leading-8">
            <h3 >First Name</h3>
            <h3 className="text-gray-600">{user?.fullname?.firstname}</h3>

          </div>
          <div className="leading-8">
          <h3>Last Name </h3>
          <h3 className="text-gray-600">{user?.fullname?.lastname === "" ? "-" : user?.fullname?.lastname}</h3> 
          </div>
          <div className="leading-8">
          <h3>Date of Birth</h3>
          <h3 className="text-gray-600">10/03/2007</h3>
          </div>
  
         
          <div className="leading-8">
            <h3 >Email Address</h3>
            <h3 className="text-gray-600">-</h3>

          </div>
          <div className="leading-8">
          <h3>Phone Number </h3>
          <h3 className="text-gray-600">XXXXXX2345</h3> 
          </div>
          <div className="leading-8">
          <h3>User Role</h3>
          <h3 className="text-gray-600">{user?.role}</h3>
          </div>
  
         

        </div>
      </div>
    </div>
  )
}

export default UserProfile
