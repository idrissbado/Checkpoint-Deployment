const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
const path = require("path")
const taskRoutes = require("./routes/tasks")
const userRoutes = require("./routes/users")

// Load environment variables
dotenv.config()

// Create Express app
const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB cluster: task-managers"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err))

// API Routes
app.use("/api/tasks", taskRoutes)
app.use("/api/users", userRoutes)

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "../.next")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../", ".next", "server", "pages", "index.html"))
  })
}

// Set port
const PORT = process.env.PORT || 5000

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


