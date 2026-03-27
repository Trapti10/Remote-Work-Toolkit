import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../Context/userContext'

const UserProtectedWrapper = ({
    children
}) => {

   const token = localStorage.getItem('token')
    const navigate = useNavigate()
    
    useEffect(() => {
   
        if(!token){
           navigate('/login')
       }
    }, [token])
    
  return (
    <>
      {children}  
    </>
  )
}

export default UserProtectedWrapper