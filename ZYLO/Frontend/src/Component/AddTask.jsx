import { useState, useEffect } from "react";
import axios from "axios";

const AddTask = ({ close, refreshTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("Todo");

  const [users, setUsers] = useState([]);

  // ✅ Fetch users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/users`);
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  // ✅ Auto progress from status
  const getProgress = () => {
    if (status === "Todo") return "0%";
    if (status === "In Progress") return "50%";
    if (status === "Completed") return "100%";
  };

  // ✅ Create Task
  const createTask = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      await axios.post(`${import.meta.env.VITE_BASE_URL}/tasks`,
        {
          title,
          description,
          dueDate,
          priority,
          assignedTo,
          status,
          progress: getProgress(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      refreshTasks();
      close();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-150 rounded-2xl p-6 shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Task</h2>
          <button onClick={close}>✖</button>
        </div>

        {/* Task Name */}
        <input
          className="w-full border p-3 rounded-lg mb-3"
          placeholder="Task Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <textarea
          className="w-full border p-3 rounded-lg mb-3"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Row 1 */}
        <div className="flex gap-3 mb-3">
          {/* Due Date */}
          <input
            type="date"
            className="w-1/2 border p-3 rounded-lg"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          {/* Priority */}
          <select
            className="w-1/2 border p-3 rounded-lg"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        {/* Row 2 */}
        <div className="flex gap-3 mb-3">
          {/* Assignee */}
          <select
            className="w-1/2 border p-3 rounded-lg"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.email}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            className="w-1/2 border p-3 rounded-lg"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Todo</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={close}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={createTask}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Create Task
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddTask;