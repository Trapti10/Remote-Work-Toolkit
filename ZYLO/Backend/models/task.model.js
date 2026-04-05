const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title:{type:String, required: true},
    description: String,
    dueDate: String,
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low"},
    progress: {
        type: String,
        default: "0%",
    },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: [{ // assignee
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  status: {
    type: String,
    enum: ["Todo", "In Progress", "Completed"],
    default: "Todo",
  },
}, {timestamps: true})

const taskmodel = mongoose.model("Task", taskSchema)
module.exports = taskmodel;