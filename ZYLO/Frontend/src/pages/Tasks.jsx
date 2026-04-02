import React, { useContext } from 'react'
import { UserDataContext } from '../Context/ContextUser'
import { MdDashboardCustomize, MdOutlineDashboard } from 'react-icons/md';
import { FaAlignLeft, FaCalendarAlt, FaChartLine, FaFlag, FaPlus, FaTasks, FaUsers } from 'react-icons/fa';
import { FaBarsProgress } from 'react-icons/fa6';
import { RiProgress2Fill } from 'react-icons/ri';

import axios from "axios"
import { useState } from 'react';
import { useEffect } from 'react';
import AddTask from '../Component/AddTask';

const Tasks = () => {

    const { user } = useContext(UserDataContext);
    const [tasks, setTasks] = useState([]);
    const token = localStorage.getItem("token");
    const [showModel, setShowModel] = useState(false)

    const fetchTasks = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/tasks`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            setTasks(res.data);

        } catch (error) {
            console.log(error);

        }
    }


    useEffect(() => {
        fetchTasks();
    }, []);

    const getPriorityColor = (priority) => {
        if (priority === "High") {
            return "text-red-500";
        } else if (priority === "Medium") {
            return "text-yellow-500";
        } else if (priority === "Low") {
            return "text-green-500";
        } else {
            return "text-gray-500";
        }

    }
    return (
        <div className=" min-h-screen ">
            <h1 className="text-lg mb-6 font-heading  text-purple-700">My Tasks</h1>
            <div className="mt-6 p-4 bg-white rounded-2xl shadow-md">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center justify-center">
                        <i className="text-xl text-gray-400"><MdDashboardCustomize /></i>
                        <h1 className="text-lg font-heading text-purple-700">To Do</h1>
                    </div>
                    <i className="text-zinc-700"><FaPlus onClick={() => setShowModel(true)} className='cursor-pointer'/></i>
                    {showModel && <AddTask 
                    close={() => setShowModel(false)}
                    refreshTasks={fetchTasks}
                    />}
                </div>

            </div>
            <div className="mt-6 bg-gray-100">
                <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
                    <table className="w-full text-left min-w-200">
                        <thead>
                            <tr className="text-gray-600 text-sm border-b">
                                <th className="py-2">
                                    <div className="flex items-center gap-2">
                                        <FaTasks className="text-purple-500" />
                                        Task
                                    </div>
                                </th>

                                <th>
                                    <div className="flex items-center gap-2">
                                        <FaAlignLeft className="text-purple-500" />
                                        Description
                                    </div>
                                </th>

                                <th>
                                    <div className="flex items-center gap-2">
                                        <FaUsers className="text-purple-500" />
                                        Assignee
                                    </div>
                                </th>

                                <th>
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-purple-500" />
                                        Due Date
                                    </div>
                                </th>

                                <th>
                                    <div className="flex items-center gap-2">
                                        <FaFlag className="text-purple-500" />
                                        Priority
                                    </div>
                                </th>

                                <th>
                                    <div className="flex items-center gap-2">
                                        <FaChartLine className="text-purple-500" />
                                        Progress
                                    </div>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task._id} className="border-b hover:bg-gray-50">
                                    {/* Task */}
                                    <td className="py-3 font-medium">{task.title}</td>

                                    {/* Description */}
                                    <td className="text-gray-500 text-sm">
                                        {task.description}
                                    </td>

                                    {/* Assignees */}
                                        <td>{task.assignedTo}
                                        {/* <div className="flex -space-x-2">
                                            {[...Array(task.assignedTo)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="w-7 h-7 rounded-full bg-purple-400 border-2 border-white"
                                                ></div>
                                            ))}
                                        </div> */}
                                    </td>

                                    {/* Date */}
                                    <td className="text-sm text-gray-600">
                                        {task.dueDate}
                                    </td>

                                    {/* Priority */}
                                    <td className={`font-medium ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                    </td>

                                    {/* Progress */}
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-gray-200 rounded-full">
                                                <div
                                                    className="h-2 bg-purple-500 rounded-full"
                                                    style={{ width: task.progress }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                {task.progress}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-2xl shadow-md">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center justify-center">
                        <i className="text-xl text-gray-400"><RiProgress2Fill /></i>
                        <h1 className="text-lg font-heading text-purple-700">On Going</h1>
                    </div>
                    <i className="text-zinc-700"><FaPlus /></i>
                </div>

            </div>
            <div className="mt-6 bg-gray-100 ">
                <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
                    <table className="w-full min-w-200 text-left">
                        <thead>
                            <tr className="text-gray-600 text-sm border-b">
                                <th className="py-2">
                                    <div className="flex items-center gap-2">
                                        <FaTasks className="text-purple-600" />
                                        Task
                                    </div>
                                </th>

                                <th>
                                    <div className="flex items-center gap-2">
                                        <FaAlignLeft className="text-purple-600" />
                                        Description
                                    </div>
                                </th>

                                <th>
                                    <div className="flex items-center gap-2">
                                        <FaUsers className="text-purple-600" />
                                        Assignee
                                    </div>
                                </th>

                                <th>
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-purple-600" />
                                        Due Date
                                    </div>
                                </th>

                                <th>
                                    <div className="flex items-center gap-2">
                                        <FaFlag className="text-purple-600" />
                                        Priority
                                    </div>
                                </th>

                                <th>
                                    <div className="flex items-center gap-2">
                                        <FaChartLine className="text-purple-600" />
                                        Progress
                                    </div>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {tasks.map((task) => (
                                <tr className="border-b hover:bg-gray-50">
                                    {/* Task */}
                                    <td className="py-3 font-medium">{task.title}</td>

                                    {/* Description */}
                                    <td className="text-gray-500 text-sm">
                                        {task.description}
                                    </td>

                                    {/* Assignees */}
                                    <td>
                                        <div className="flex -space-x-2">
                                            {[...Array(task.assignees)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="w-7 h-7 rounded-full bg-purple-400 border-2 border-white"
                                                ></div>
                                            ))}
                                        </div>
                                    </td>

                                    {/* Date */}
                                    <td className="text-sm text-gray-600">
                                        {task.dueDate}
                                    </td>

                                    {/* Priority */}
                                    <td className={`font-medium ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                    </td>

                                    {/* Progress */}
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-gray-200 rounded-full">
                                                <div
                                                    className="h-2 bg-purple-500 rounded-full"
                                                    style={{ width: task.progress }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                {task.progress}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Tasks
