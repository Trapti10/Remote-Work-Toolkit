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
        <section className='relative '>
            <div classname='w-full object-cover'>
                <img src={FooterImg} alt="" classname='' />
            </div>
            <div className="flex absolute top-7 px-14  justify-evenly gap-40">
                <div className="mt-15">
                    
                    <img src={logo} alt="" className='size-34 w-fit' />
                    <h3 className="-mt-4 ml-5 text-gray-300 font-sans text-md max-w-60">Empowering Remote teams with seamless collaboration</h3>
                </div>
                <div className="">
                    <h1 className="font-heading text-3xl font-bold text-gray-800 py-8">
                        Ready to boost your teams productivity?
                    </h1>
                    <div className="flex gap-4 justify-center items-center">
                        <Link to='/signup' className=' hover:-translate-y-1 transition duration-300'>
                            <Btn1 />
                        </Link>
                        <Link to='/login' className=' hover:-translate-y-1 transition duration-300'>
                            <Btn2 />
                        </Link>
                    </div>

                </div>
                    <div className="flex justify-evenly gap-3 items-center mt-48 text-3xl">
                        {socials.map((item) => (
                            <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer">
                                <div className="text-white p-1 rounded-full hover:bg-white/20 hover:text-purple-900 hover:scale-110 transition duration-400 cursor-pointer">
                                    {item.icon}
                                </div>
                            </a>
                        ))}
                    </div>
              
            </div>
        </section>
    )
}

export default Footer
