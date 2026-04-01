import React, { useContext } from 'react'
import { UserDataContext } from '../Context/ContextUser'

const Tasks = () => {

    const {user} = useContext(UserDataContext);


            
const tasks = [
  {
    title: "Content Creation",
    description: "Create engaging content (blogs, social media...)",
    assignees: 3,
    dueDate: "March 12, 2025",
    priority: "High",
    progress: "50%",
  },
  {
    title: "Blog Posts & Articles",
    description: "Write and publish articles...",
    assignees: 2,
    dueDate: "March 12, 2025",
    priority: "Low",
    progress: "40%",
  },
  {
    title: "Social Media Graphics",
    description: "Create visually appealing graphics...",
    assignees: 4,
    dueDate: "March 18, 2025",
    priority: "Medium",
    progress: "75%",
  },
  {
    title: "Video Content Production",
    description: "Produce engaging videos...",
    assignees: 1,
    dueDate: "April 5, 2025",
    priority: "High",
    progress: "0%",
  },
];

const getPriorityColor = (priority) => {
  if (priority === "High") return "text-red-500";
  if (priority === "Medium") return "text-yellow-500";
  return "text-green-500";
};


  return (
     <div className=" min-h-screen ">
      <h1 className="text-lg mb-6 font-heading  text-purple-700">My Tasks</h1>


      <div className="mt-6 p-6 bg-white rounded-2xl">
        <div className="flex justify-between">
            <i className=""></i>
          <h1 className="text-lg font-heading text-purple-700">To Do</h1>   
            
        </div>
      
        </div>
    <div className="mt-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 text-sm border-b">
              <th className="py-2">Task</th>
              <th>Description</th>
              <th>Assignee</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Progress</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
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
