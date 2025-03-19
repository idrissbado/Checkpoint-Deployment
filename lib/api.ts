// API functions to interact with the backend

interface TaskData {
    title: string
    completed: boolean
    priority?: "low" | "medium" | "high"
    dueDate?: string
  }
  
  interface UserData {
    name: string
    email: string
    password: string
  }
  
  interface LoginData {
    email: string
    password: string
  }
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  
  // User Authentication
  export const register = async (userData: UserData) => {
    const response = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    })
  
    if (!response.ok) {
      throw new Error("Failed to register")
    }
  
    return response.json()
  }
  
  export const login = async (loginData: LoginData) => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
      credentials: "include",
    })
  
    if (!response.ok) {
      throw new Error("Failed to login")
    }
  
    return response.json()
  }
  
  export const logout = async () => {
    const response = await fetch(`${API_URL}/users/logout`, {
      method: "POST",
      credentials: "include",
    })
  
    if (!response.ok) {
      throw new Error("Failed to logout")
    }
  
    return response.json()
  }
  
  export const getCurrentUser = async () => {
    const response = await fetch(`${API_URL}/users/me`, {
      credentials: "include",
    })
  
    if (!response.ok) {
      throw new Error("Failed to get current user")
    }
  
    return response.json()
  }
  
  // Task Management
  export const getTasks = async () => {
    const response = await fetch(`${API_URL}/tasks`, {
      credentials: "include",
    })
  
    if (!response.ok) {
      throw new Error("Failed to fetch tasks")
    }
  
    return response.json()
  }
  
  export const createTask = async (taskData: TaskData) => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
      credentials: "include",
    })
  
    if (!response.ok) {
      throw new Error("Failed to create task")
    }
  
    return response.json()
  }
  
  export const updateTask = async (taskId: string, taskData: TaskData) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
      credentials: "include",
    })
  
    if (!response.ok) {
      throw new Error("Failed to update task")
    }
  
    return response.json()
  }
  
  export const deleteTask = async (taskId: string) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "DELETE",
      credentials: "include",
    })
  
    if (!response.ok) {
      throw new Error("Failed to delete task")
    }
  
    return response.json()
  }
  
  