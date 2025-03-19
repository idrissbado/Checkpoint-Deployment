const express = require("express")
const router = express.Router()
const Task = require("../models/Task")
const auth = require("../middleware/auth")

// Apply auth middleware to all routes
router.use(auth)

// GET all tasks for current user
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET a single task
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId })
    if (!task) return res.status(404).json({ message: "Task not found" })
    res.json(task)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// CREATE a task
router.post("/", async (req, res) => {
  const task = new Task({
    title: req.body.title,
    completed: req.body.completed || false,
    priority: req.body.priority || "medium",
    dueDate: req.body.dueDate,
    userId: req.userId,
  })

  try {
    const newTask = await task.save()
    res.status(201).json(newTask)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// UPDATE a task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId })
    if (!task) return res.status(404).json({ message: "Task not found" })

    if (req.body.title !== undefined) task.title = req.body.title
    if (req.body.completed !== undefined) task.completed = req.body.completed
    if (req.body.priority !== undefined) task.priority = req.body.priority
    if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate

    const updatedTask = await task.save()
    res.json(updatedTask)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId })
    if (!task) return res.status(404).json({ message: "Task not found" })

    await task.deleteOne()
    res.json({ message: "Task deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router

