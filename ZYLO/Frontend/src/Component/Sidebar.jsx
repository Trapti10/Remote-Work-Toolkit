// src/components/Sidebar.jsx


import { NavLink } from "react-router-dom";


const Sidebar = () => {


  return (
    <div className={"p-4 w-62 bg-purple-700 text-white hidden md:block  h-full transform transition-transform duration-300"}>

      <NavLink
        to="/dashboard"
        className="block mb-3 hover:text-purple-400"
      >
        Dashboard
      </NavLink>

      <NavLink
        to="profile"
        className="block hover:text-purple-400"
      >
        Profile
      </NavLink>

    </div>
  );
};

export default Sidebar;