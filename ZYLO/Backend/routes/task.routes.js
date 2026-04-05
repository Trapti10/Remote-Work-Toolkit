const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const Task = require("../models/task.model")

const authmiddleware = require('../middlewares/auth.middleware')

//create new task
router.post('/', authmiddleware.authUser, async (req, res) => {
    try {
        const { title, description, dueDate, priority, assignedTo, status } = req.body;

        console.log("BODY:", req.body);

        const task = await Task.create({
            title,
            description,
            dueDate,
            status,
            priority,
            user: req.user._id,
            assignedTo: Array.isArray(assignedTo)
                ? assignedTo
                : assignedTo
                    ? [assignedTo]
                    : []
        })

        res.status(201).json({ task, message: "New task created" });

    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})
// get all tasks
router.get("/", authmiddleware.authUser, async (req, res) => {
    try {

        const tasks = await Task.find({
            $or: [
                { user: req.user._id },        // created by user
                { assignedTo: req.user._id }   // assigned to user
            ]
        })
            .populate("assignedTo", "fullname email")
            .populate("user", "fullname email")
            .sort({ createdAt: -1 })
        res.json(tasks);


    } catch (error) {
        res.status(500).json({ message: error.message });
    }

})

//Update tasks
router.put('/:id', async (req, res) => {
    try {
        const updateTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.json(updateTask);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id)
        res.json({ message: "Task Deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
