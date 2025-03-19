"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Pencil,
  Trash2,
  Plus,
  Save,
  X,
  LogOut,
  SortAsc,
  SortDesc,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  LayoutDashboard,
  Search,
  MoreHorizontal,
} from "lucide-react"
import { createTask, deleteTask, getTasks, updateTask, logout } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskStats } from "@/components/task-stats"

interface Task {
  _id: string
  title: string
  completed: boolean
  priority?: "low" | "medium" | "high"
  dueDate?: string
  userId: string
}

export function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium")
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editedTitle, setEditedTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const { user, refreshUser } = useAuth()

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getTasks()
        setTasks(fetchedTasks)
      } catch (error) {
        console.error("Failed to fetch tasks:", error)
        toast({
          title: "Error",
          description: "Failed to fetch tasks",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [toast])

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return

    try {
      const newTask = await createTask({
        title: newTaskTitle,
        completed: false,
        priority: newTaskPriority,
      })
      setTasks([newTask, ...tasks])
      setNewTaskTitle("")
      toast({
        title: "Success",
        description: "Task added successfully",
      })
    } catch (error) {
      console.error("Failed to add task:", error)
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      })
    }
  }

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      const taskToUpdate = tasks.find((task) => task._id === taskId)
      if (!taskToUpdate) return

      const updatedTask = await updateTask(taskId, {
        ...taskToUpdate,
        completed: !completed,
      })

      setTasks(tasks.map((task) => (task._id === taskId ? { ...task, completed: !completed } : task)))
    } catch (error) {
      console.error("Failed to update task:", error)
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId)
      setTasks(tasks.filter((task) => task._id !== taskId))
      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
    } catch (error) {
      console.error("Failed to delete task:", error)
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  const startEditing = (taskId: string, currentTitle: string) => {
    setEditingTask(taskId)
    setEditedTitle(currentTitle)
  }

  const cancelEditing = () => {
    setEditingTask(null)
    setEditedTitle("")
  }

  const saveEdit = async (taskId: string) => {
    if (!editedTitle.trim()) return

    try {
      const taskToUpdate = tasks.find((task) => task._id === taskId)
      if (!taskToUpdate) return

      const updatedTask = await updateTask(taskId, {
        ...taskToUpdate,
        title: editedTitle,
      })

      setTasks(tasks.map((task) => (task._id === taskId ? { ...task, title: editedTitle } : task)))
      setEditingTask(null)
      toast({
        title: "Success",
        description: "Task updated successfully",
      })
    } catch (error) {
      console.error("Failed to update task:", error)
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    }
  }

  const updateTaskPriority = async (taskId: string, priority: "low" | "medium" | "high") => {
    try {
      const taskToUpdate = tasks.find((task) => task._id === taskId)
      if (!taskToUpdate) return

      const updatedTask = await updateTask(taskId, {
        ...taskToUpdate,
        priority,
      })

      setTasks(tasks.map((task) => (task._id === taskId ? { ...task, priority } : task)))
      toast({
        title: "Success",
        description: `Task priority updated to ${priority}`,
      })
    } catch (error) {
      console.error("Failed to update task priority:", error)
      toast({
        title: "Error",
        description: "Failed to update task priority",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      await refreshUser()
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      })
    } catch (error) {
      console.error("Failed to logout:", error)
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      })
    }
  }

  const filteredTasks = tasks
    .filter((task) => {
      // Filter by status
      if (filter === "active") return !task.completed
      if (filter === "completed") return task.completed
      return true
    })
    .filter((task) => {
      // Filter by search query
      if (!searchQuery) return true
      return task.title.toLowerCase().includes(searchQuery.toLowerCase())
    })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.title.localeCompare(b.title)
    } else {
      return b.title.localeCompare(a.title)
    }
  })

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "low":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  const getPriorityBadgeClass = (priority?: string) => {
    switch (priority) {
      case "high":
        return "priority-badge priority-high"
      case "medium":
        return "priority-badge priority-medium"
      case "low":
        return "priority-badge priority-low"
      default:
        return "priority-badge priority-medium"
    }
  }

  const completedTasksCount = tasks.filter((task) => task.completed).length
  const completionRate = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-10">
      <div className="container mx-auto py-10 max-w-5xl">
        {/* Dashboard Header */}
        <div className="dashboard-header rounded-xl mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Welcome, {user?.name || "User"}</h1>
              <p className="text-white/80 mt-1">Manage your tasks and boost your productivity</p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleLogout} className="shadow-md">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Task Statistics */}
        <TaskStats
          totalTasks={tasks.length}
          completedTasks={completedTasksCount}
          completionRate={completionRate}
          highPriorityTasks={tasks.filter((t) => t.priority === "high").length}
        />

        {/* Task Input */}
        <Card className="mb-8 shadow-lg border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Add New Task</CardTitle>
            <CardDescription>Create a new task to track your work</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                placeholder="What needs to be done?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTask()
                }}
                className="flex-1"
              />
              <Select value={newTaskPriority} onValueChange={(value: any) => setNewTaskPriority(value)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddTask} className="w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Task Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-[250px]"
              />
            </div>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="w-full md:w-auto"
          >
            {sortOrder === "asc" ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
            Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
          </Button>
        </div>

        {/* Tasks List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className="text-center py-16 border rounded-xl bg-slate-100/50 dark:bg-slate-800/50 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
              <LayoutDashboard className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">No tasks found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchQuery
                ? `No tasks matching "${searchQuery}"`
                : filter !== "all"
                  ? `No ${filter} tasks found. Try changing your filter.`
                  : "Add your first task to get started with Task Manager Pro."}
            </p>
            {(searchQuery || filter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setFilter("all")
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            {sortedTasks.map((task) => (
              <div
                key={task._id}
                className={`task-card ${task.completed ? "task-card-completed" : "task-card-active"}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleComplete(task._id, task.completed)}
                      id={`task-${task._id}`}
                      className="h-5 w-5 border-2"
                    />
                    {editingTask === task._id ? (
                      <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="flex-1"
                        autoFocus
                      />
                    ) : (
                      <div className="flex flex-col min-w-0">
                        <label
                          htmlFor={`task-${task._id}`}
                          className={`text-base font-medium truncate ${
                            task.completed ? "line-through text-slate-400 dark:text-slate-500" : ""
                          }`}
                        >
                          {task.title}
                        </label>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className={getPriorityBadgeClass(task.priority)}>
                            {getPriorityIcon(task.priority)}
                            <span className="ml-1">{task.priority}</span>
                          </span>
                          {task.dueDate && (
                            <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    {editingTask === task._id ? (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => saveEdit(task._id)}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={cancelEditing}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => startEditing(task._id, task.title)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => updateTaskPriority(task._id, "low")}>
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                              Set Low Priority
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateTaskPriority(task._id, "medium")}>
                              <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                              Set Medium Priority
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateTaskPriority(task._id, "high")}>
                              <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                              Set High Priority
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteTask(task._id)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Task
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Task Summary Footer */}
        {tasks.length > 0 && (
          <Card className="mt-6 border-none bg-slate-100/50 dark:bg-slate-800/50 shadow-sm">
            <CardFooter className="flex justify-between text-sm text-gray-500 dark:text-gray-400 p-4">
              <div>
                {tasks.length} task{tasks.length !== 1 ? "s" : ""} • {tasks.filter((t) => t.completed).length} completed
              </div>
              <div>
                {(filter !== "all" || searchQuery) && (
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => {
                      setFilter("all")
                      setSearchQuery("")
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

