import React from 'react'

import Navbar from '../Component/Navbar'
import IntroSection from '../Component/IntroSection'
import Trusted from '../Component/Trusted'
import Features from '../Component/Features'


const Home = () => {
  return (
    <div>
     <Navbar/>
     <IntroSection/>
     <Trusted/>
     <Features/>
    </div>
  )
}

export default Home
