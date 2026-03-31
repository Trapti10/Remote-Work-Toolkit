import { FaTasks, FaCheckCircle, FaClock, FaExclamationCircle } from "react-icons/fa";
import UserProfile from "./UserProfile";
import { useNavigate } from "react-router-dom";

const stats = [
  { title: "Total Tasks", value: 20, icon: <FaTasks /> },
  { title: "Completed", value: 14, icon: <FaCheckCircle /> },
  { title: "Pending", value: 4, icon: <FaClock /> },
  { title: "Overdue", value: 2, icon: <FaExclamationCircle /> },
];

const tasks = [
  {
    name: "Design Landing Page",
    user: "Trapti",
    due: "Today",
    progress: "80%",
    status: "On Track",
  },
  {
    name: "API Integration",
    user: "Aman",
    due: "Tomorrow",
    progress: "60%",
    status: "At Risk",
  },
];

const Dashboard = () => {


  const navigate = useNavigate();

  return (
    <div className=" min-h-screen mt-10 text-black">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((item, i) => (
            <div
              key={i}
              className="border-2 border-black p-4 rounded-xl flex items-center justify-between hover:shadow-purple-500/10 hover:shadow-lg transition"
            >
              <div>
                <p className="text-gray-400 text-sm">{item.title}</p>
                <h2 className="text-xl font-bold">{item.value}</h2>
              </div>
              <div className="text-purple-400 text-xl">{item.icon}</div>
            </div>
          ))}
        </div>

        {/* Charts Placeholder */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="border-2 border-black p-4 rounded-xl h-64 flex items-center justify-center text-gray-500">
            Task Completion Chart
          </div>
          <div className="border-2 border-black  p-4 rounded-xl h-64 flex items-center justify-center text-gray-500">
            Productivity Chart
          </div>
        </div>

        {/* Table */}
        <div className="border boerder-black p-4 rounded-xl">
          <h2 className="mb-4 font-semibold">Task Overview</h2>

          <table className="w-full text-sm">
            <thead className="text-gray-400">
              <tr>
                <th className="text-left py-2">Task</th>
                <th>Assigned</th>
                <th>Due</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task, i) => (
                <tr key={i} className="border-t border-gray-700 text-center">
                  <td className="text-left py-2">{task.name}</td>
                  <td>{task.user}</td>
                  <td>{task.due}</td>
                  <td>{task.progress}</td>
                  <td
                    className={`${
                      task.status === "On Track"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {task.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    
  );
};

export default Dashboard;