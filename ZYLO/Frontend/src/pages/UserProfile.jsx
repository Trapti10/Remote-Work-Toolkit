import React, { useContext } from 'react'
import ContextUser, { UserDataContext } from '../Context/ContextUser'

const UserProfile = () => {

    const {user} = useContext(UserDataContext);
   


  return (
    <div className=" min-h-screen py-6">
      <h1 className="text-lg mb-6">My Profile</h1>

      <div className="md:flex gap-8 items-center p-10 bg-gray-200 rounded-lg">
        <span className='flex items-center justify-center text-2xl bg-purple-400 text-white h-20 w-20 rounded-full'>
          {user?.fullname?.firstname.slice(0,1)}
        </span>
        <div className="flex flex-col gap-1">
        <h3 className='text-xl text-purple-700'>{user?.fullname?.firstname} {user?.fullname?.lastname}</h3>
        <h3 className='text-sm text-gray-700'>{user?.role}</h3>
        <h3 className='text-sm text-gray-700'>{user?.email}</h3>
        </div>
      </div>

      <div className="">
        <div className="flex justify-between p-10">
      <h1 className="text-lg mb-6">Personal Informtion</h1>
           
        </div>
      </div>
    </div>
  )
}

export default UserProfile
