import React from 'react'

import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import UserProtectedWrapper from './pages/UserProtectedWrapper'
import UserLogout from './pages/UserLogout'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/dashboard' element={
          <UserProtectedWrapper>
            <Dashboard/>
          </UserProtectedWrapper>
        }/>
      <Route path='/user/logout' element={
       <UserProtectedWrapper>
        <UserLogout/>
       </UserProtectedWrapper>
    }   />
      </Routes>
    </div>
  )
}

export default App