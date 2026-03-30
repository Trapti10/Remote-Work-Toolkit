import React from 'react'
import { motion } from 'framer-motion';
import project_workflow from '../assets/project_workflow.png'
import { FaStar } from "react-icons/fa";
import { FcCollaboration } from "react-icons/fc";
import { RiTeamFill } from "react-icons/ri";
import { BsFillGrid1X2Fill } from "react-icons/bs";
import { MdInsights } from "react-icons/md";

const benefits = [
    {
        id: 1,
        icon: <BsFillGrid1X2Fill/>,
        title: 'All-in-One Platform',
        para: "Manage tasks, chat, files, and reports without switching between tools.",
    },
    {
        id: 2,
        icon: <FaStar/>,
        title: 'Easy to use',
        para: "Clean interface designed for teams of all sizes — no learning curve.",
    },
    {
        id: 3,
        icon: <FcCollaboration/>,
        title: 'Real-Time Collaboration',
        para: "Stay connected with your team through instant updates and messaging.",
    },
    {
        id:4,
        icon: <RiTeamFill/>,
        title: 'Built for Startups',
        para: "Perfect for startups and remote teams to stay organized and productive.",
    },
    {
        id: 5,
        icon: <MdInsights/>,
        title: 'Smart Insights',
        para: "Track progress and performance with easy-to-understand analytics.",
    },
]

const WorkFlow = () => {
  return (
    <section className="bg-linear-to-b from-violet-200 to-violet-300 text-white py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">

        {/* Top Label */}
        <p className="text-black font-bold text-sm mb-2 tracking-widest">
          WHY ZYLO
        </p>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
          Why Teams Prefer Zylo
        </h2>

        {/* Subheading */}
        <p className="text-gray-700 mb-12 max-w-2xl mx-auto">
          Everything you need to simplify collaboration, boost productivity, and manage your team efficiently — all in one place.
        </p>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">

          {benefits.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-linear-to-b from-purple-500 to-purple-800 border border-white rounded-xl p-6 text-left 
              hover:shadow-purple-500/20 hover:shadow-lg hover:-translate-y-1 transition duration-300"
            >
              {/* Icon */}
              <div className="w-10 h-10 flex items-center justify-center bg-[#1f2937] rounded-md mb-4 text-purple-400 text-xl">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-100 text-sm">
                {item.para}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  )
}

export default WorkFlow
