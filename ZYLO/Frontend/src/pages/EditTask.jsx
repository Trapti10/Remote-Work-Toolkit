import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

const EditTask = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const [form, setForm] = useState({
        title: "",
        description: "",
        assignedTo: [],
        priority: "Medium",
        progress: 0,
        dueDate: "",
        status: "",
    });
    const [users, setUsers] = useState([]);

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const res = await api.get("/users");
                setUsers(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchUsers();
    }, [])


    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await api.get(`/tasks/${id}`);
                setForm(res.data)
            } catch (error) {
                console.log(error);
            }
        };
        fetchTask();
    }, [id])

    const getProgress = (status) => {
        if (status === "Todo") return 0;
        if (status === "In Progress") return 50;
        if (status === "Completed") return 100;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "status") {
            setForm({
                ...form,
                status: value,
                progress: getProgress(value),
            });
        } else {
            setForm({ ...form, [name]: value });
        }
    };
    const handleAssignees = (e) => {
        const selected = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        );
        console.log("Sending:", form.status);
        setForm({ ...form, assignedTo: selected });
    };

    console.log("Updated task", form);
    console.log("Sending status:", form.status);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            await api.put(`/tasks/${id}`, form);
            alert("Task Updated");
            navigate("/dashboard/tasks");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="w-full max-w-3xl m-auto bg-white shadow-xl rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-purple-700 mb-6">
                Edit Task
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Title */}
                <input
                    type="text"
                    name="title"
                    placeholder="Task Title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
                />

                {/* Description */}
                <textarea
                    name="description"
                    placeholder="Task Description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
                />

                <div className="flex gap-5">

                    {/* Assignees */}
                    <select
                        multiple
                        size={1}
                        value={form.assignedTo}
                        onChange={handleAssignees}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
                    >
                        {Array.isArray(users) && users.map((u) => (
                            <option key={u._id} value={u._id}>
                                {u?.fullname?.firstname} {u?.fullname?.lastname}
                            </option>
                        ))}
                    </select>

                    {/* Priority */}
                    <select
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                </div>
                <div className="flex gap-15">
                    <select
                        name="status"
                        className="w-1/2 border p-3 rounded-lg"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option>Todo</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                    </select>

                    {/* Due Date */}
                    <input
                        type="date"
                        name="dueDate"
                        value={form.dueDate}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
                    />
                </div>
                {/* Button */}
                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition"

                >
                    Update Task
                </button>
            </form>
        </div>
    );
};

export default EditTask;