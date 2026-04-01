// src/components/Sidebar.jsx


import { BiFile, BiSolidChat, BiSolidDashboard } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import { FaFolder, FaFolderMinus } from "react-icons/fa6";
import { NavLink } from "react-router-dom";


const Sidebar = () => {


  return (
    <div className={"px-10 py-4 w-60 bg-purple-700 text-white hidden md:block  h-full transform transition-transform duration-300"}>
<div className="flex flex-col gap-10">
      <div className="flex gap-3 items-center">
        <i className="text-xl"><BiSolidDashboard/></i>
      <NavLink
        to="/dashboard"
        className="block  hover:text-purple-400"
      >
        Dashboard
      </NavLink>
</div>
<div className="flex gap-3 items-center">
     <i className="text-xl"><FaTasks/></i>
      <NavLink
        to="tasks"
        className=" hover:text-purple-400"
      >
        Tasks
      </NavLink>
</div>
 <div className="flex gap-3 items-center">
        <i className="text-2xl"><BiSolidChat/></i> 
      <NavLink
        to="chat"
        className="block hover:text-purple-400"
      >
        Chat
      </NavLink>
</div>
 <div className="flex gap-3 items-center">
        <i className="text-2xl"><BiFile/></i>   
      <NavLink
        to="files"
        className="block hover:text-purple-400"
      >
        Files
      </NavLink>
</div>
 <div className="flex gap-3 items-center">
        <i className="text-xl"><FaFolderMinus/></i>  
      <NavLink
        to="summary"
        className="block hover:text-purple-400"
      >
        Summary
      </NavLink>
</div>
</div>
    </div>
  );
};

export default Sidebar;