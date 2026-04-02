import { FaTasks, FaCheckCircle, FaClock, FaExclamationCircle } from "react-icons/fa";

import { useState } from "react";
import PieChartbox from "../Component/PieChartbox";
import BarChartbox from "../Component/BarChartbox";

import UserProfile from "./UserProfile";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserDataContext } from "../Context/ContextUser";


const initialTasks = [
  {
    id: 1,
    name: "Design Landing Page",
    user: "Trapti",
    due: "Today",
    progress: 100,
    status: "On Track",
  },
  {
    id: 2,
    name: "API Integration",
    user: "Shanti",
    due: "Tomorrow",
    progress: 60,
    status: "At Risk",
  },
  {
    id: 3,
    name: "Fix Bugs",
    user: "Prachi",
    due: "Today",
    progress: 30,
    status: "Overdue",
  },
  {
    id: 3,
    name: "Fix Bugs",
    user: "Mansi",
    due: "Today",
    progress: 40,
    status: "Overdue",
  },

]

const Dashboard = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("All");

  // Stats Calculation 
  const total = tasks.length;
  const completed = tasks.filter(t => t.progress === 100).length
  const pending = tasks.filter(t => t.progress < 100).length
  const overdue = tasks.filter(t => t.status === "Overdue").length


  const stats = [
    { title: "Total Tasks", value: total, icon: <FaTasks /> },
    { title: "Completed", value: completed, icon: <FaCheckCircle /> },
    { title: "Pending", value: pending, icon: <FaClock /> },
    { title: "Overdue", value: overdue, icon: <FaExclamationCircle /> },
  ];

  //Filter Logic.......
  
  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter((task) => task.status === filter)

  const navigate = useNavigate();

  const {user}  =useContext(UserDataContext);

  return (
    <div className="min-h-screen mt-6 text-black space-y-6">

      {/*  FILTER BUTTONS.... */}
      <div className="flex gap-3">
        {["All", "On Track", "At Risk", "Overdue"].map((item) => (
          <button
          key={item}
            onClick={() => setFilter(item)}
            className={`px-4 py-1 rounded-full text-sm border ${
              filter === item
                ? "bg-purple-600 text-white"
                : "bg-white text-black"
            } transition cursor-pointer`}
          >
            {item}
          </button>
        ))}
      </div>

       {/* STATS....*/}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white border p-4 rounded-xl flex items-center justify-between hover:shadow-lg   transition"
          >
            <div>
              <p className="text-gray-400 text-sm">{item.title}</p>
              <h2 className="text-xl font-bold">{item.value}</h2>
            </div>
   <div className="text-purple-500 text-2xl">{item.icon}</div>
          </div>
        ))}
      </div>

      {/*  TASK CARDS .....*/}
      <div className="grid md:grid-cols-2 gap-4 transition-transform">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border p-4 rounded-xl hover:shadow-lg  space-y-2"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{task.name}</h2>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  task.status === "On Track"
                    ? "bg-green-100 text-green-600"
                    : task.status === "At Risk"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {task.status}
              </span>
            </div>

            <p className="text-sm text-gray-500">
              Assigned to: {task.user}
            </p>

            <p className="text-sm text-gray-500">
              Due: {task.due}
            </p>

            {/* Progress Bar..... */}
            <div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-right mt-1">
                {task.progress}%
              </p>
            </div>
          </div>
        ))}
      </div>

      
      {filteredTasks.length === 0 && (
        <p className="text-center text-gray-400">No tasks found</p>
      )}

{/* Graphs and Chart.... */}
      <div className="grid md:grid-cols-2 gap-6">
  <PieChartbox tasks={tasks} />
     <BarChartbox tasks={tasks} />
      </div>

    </div>

    
  )
}

export default Dashboard;