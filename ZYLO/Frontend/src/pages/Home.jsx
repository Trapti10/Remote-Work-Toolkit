import React from 'react'

import Navbar from '../Component/Navbar'
import IntroSection from '../Component/IntroSection'
import Trusted from '../Component/Trusted'
import Features from '../Component/Features'
import WorkFlow from '../Component/WorkFlow'
import Footer from '../Component/Footer'


const Home = () => {
  return (
    <div >
     <Navbar/>
     <IntroSection/>
     <Trusted/>
     <Features/>
     <WorkFlow/>
     <Footer/>
    </div>
  )
}

export default Home
