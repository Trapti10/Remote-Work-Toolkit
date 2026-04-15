import React from 'react'
import FooterImg from '../assets/footer_img.png'
import logo from '../assets/logo.png'
import Btn1 from './Btn1'
import Btn2 from './Btn2'
import { FaFacebook, FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link } from 'react-router-dom'

const socials = [
    { id: 1, icon: <FaFacebook />, link: "https://facebook.com" },
    { id: 2, icon: <FaGithub />, link: "https://github.com" },
    { id: 3, icon: <FaTwitter />, link: "https://twitter.com" },
    { id: 4, icon: <FaLinkedin />, link: "https://linkedin.com" },
];

const Footer = () => {

    return (
        <section className='relative'>
            
            {/* Image */}
            <img 
                src={FooterImg} 
                alt="" 
                className='w-full h-100 md:h-auto object-cover'
            />

            <div className="absolute inset-0 px-6 md:px-14 py-6 flex flex-col justify-between">

                <div className="flex flex-col items-center text-center md:items-start md:text-left md:flex-row md:justify-evenly md:gap-40">

                    <div className="hidden md:block mt-25">
                        <img src={logo} alt="" className='h-10 mb-4 w-fit' />
                        <h3 className="text-gray-300 text-md max-w-60">
                            Empowering Remote teams with seamless collaboration
                        </h3>
                    </div>

                    <div>
                        <h1 className="text-lg md:text-3xl font-bold md:text-gray-800 py-10  md:py-8">
                            Ready to boost your teams productivity?
                        </h1>

                        <div className="flex  gap-3 md:gap-4 justify-center items-center">
                            <Link to='/signup'>
                                <Btn1 text="Get Started"/>
                            </Link>

                            <Link to='/login'>
                                <Btn2 />
                            </Link>
                        </div>
                    </div>

                    <div className="hidden md:flex justify-evenly gap-3 items-center mt-48 text-3xl">
                        {socials.map((item) => (
                            <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer">
                                <div className="text-white p-1 rounded-full hover:bg-white/20 hover:text-purple-900 hover:scale-110 transition duration-300 cursor-pointer">
                                    {item.icon}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="flex md:hidden justify-between items-center">

                    <img src={logo} alt="" className='h-8' />

                    <div className="flex gap-3 text-xl">
                        {socials.map((item) => (
                            <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer">
                                <div className="text-white p-2 rounded-full hover:bg-white/20 hover:scale-110 transition duration-300 cursor-pointer">
                                    {item.icon}
                                </div>
                            </a>
                        ))}
                    </div>

                </div>

            </div>
        </section>
    )
}

export default Footer