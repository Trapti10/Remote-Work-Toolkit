import React from 'react'
import { FaAlignLeft, FaCalendarAlt, FaChartLine, FaFlag, FaTasks, FaUsers } from 'react-icons/fa';


const TaskTable = ({ tasks, getPriorityColor, loading, error }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
            {loading && (
                <div className="flex justify-center items-center py-10">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            {!loading && error && (
                <div className="text-center py-10 text-red-500">
                    <p className="text-lg font-semibold">Something went wrong ❌</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}
            {!loading && !error && tasks.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    <p className="text-lg font-semibold">No Tasks Found</p>
                    <p className="text-sm">Start by creating your first task 🚀</p>
                </div>
            )}
            {!loading && tasks.length > 0 && (
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
                                <td>{task.assignedTo ?(
                                    <div className="flex -space-x-2">
                                        {(Array.isArray(task.assignedTo)
                                       ? task.assignedTo
                                       : [task.assignedTo]
                                    ).map((user, index) => (
                                                <div
                                                key={user?._id || index}
                                                className="w-7 h-7 rounded-full bg-purple-400 border-2 text-black border-white"
                                                >
                                                    {user.fullname?.firstname?.[0]}
                                                </div>
                                                ))}
                                                </div> 
                                ) : (
                                    "unassigned")}
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
            )}
        </div>

    )
}

export default TaskTable
