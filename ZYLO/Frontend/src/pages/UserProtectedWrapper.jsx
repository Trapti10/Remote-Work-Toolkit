import React, { useContext, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../Context/ContextUser' 

const UserProtectedWrapper = ({
    children
}) => {

   const token = localStorage.getItem('token')
    const navigate = useNavigate()
    
     useEffect(() => {
       
       
          if(!token || token === "undefined" || token === "null"){
             return <Navigate to='/login'/>
         }
      
     }, [])
  return (
    <>
      {children}  
    </>
  )
}

export default UserProtectedWrapper