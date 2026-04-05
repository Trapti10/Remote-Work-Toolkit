import React, { useContext } from 'react'
import { UserDataContext } from '../Context/ContextUser'
import { MdDashboardCustomize } from 'react-icons/md';
import { RiProgress2Fill } from 'react-icons/ri';

import { useState } from 'react';
import { useEffect } from 'react';
import AddTask from '../Component/AddTask';
import api from '../api';
import TaskTable from '../Component/TaskTable';
import { FaPlus } from 'react-icons/fa';

const Tasks = () => {

    const [tasks, setTasks] = useState([]);
    const token = localStorage.getItem("token");
    const [showModel, setShowModel] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const fetchTasks = async () => {
        try {

            setLoading(true)

            const res = await api.get("/tasks",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setTasks(res.data);

        } catch (error) {
            setError("Failed to load tasks")
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchTasks();
    }, []);

    const todoTasks = tasks.filter(t => t.status?.toLowerCase() === "Todo");
    const ongoingTasks = tasks.filter(t => t.status?.toLowerCase() === "In Progress");
    const completedTasks = tasks.filter(t => t.status?.toLowerCase() === "Completed");

    console.log(todoTasks);
    console.log(ongoingTasks);
    console.log(completedTasks);


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
                    <i className="text-zinc-700"><FaPlus onClick={() => setShowModel(true)} className='cursor-pointer' /></i>
                    {showModel && <AddTask
                        close={() => setShowModel(false)}
                        refreshTasks={fetchTasks}
                    />}
                </div>

            </div>
            <div className="mt-6 bg-gray-100">
                <TaskTable tasks={todoTasks} getPriorityColor={getPriorityColor} loading={loading} error={error} />
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
                <TaskTable tasks={ongoingTasks} getPriorityColor={getPriorityColor} loading={loading} error={error} />
            </div>

            <div className="mt-6 p-4 bg-white rounded-2xl shadow-md">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center justify-center">
                        <i className="text-xl text-gray-400"><RiProgress2Fill /></i>
                        <h1 className="text-lg font-heading text-purple-700">Completed</h1>
                    </div>
                    <i className="text-zinc-700"><FaPlus /></i>
                </div>

            </div>
            <div className="mt-6 bg-gray-100 ">
                <TaskTable tasks={completedTasks} getPriorityColor={getPriorityColor} loading={loading} error={error} />
            </div>
        </div>
    )
}

export default Tasks
