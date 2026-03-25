import React from 'react'
import { Link } from 'react-router-dom'
import SignUp from './SignUp'


const Home = () => {
  return (
    <div>
      <Link to="/login">Login</Link>
      <Link to="/signup">Sign Up</Link>
    </div>
  )
}

export default Home
