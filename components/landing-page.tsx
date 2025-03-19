"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { TaskDashboard } from "@/components/task-dashboard"
import { useAuth } from "@/hooks/use-auth"
import { CheckCircle, Clock, ListChecks } from "lucide-react"

export function LandingPage() {
  const { user, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("login")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    return <TaskDashboard />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container flex flex-col md:flex-row items-center justify-between min-h-screen py-12 gap-8">
        <div className="flex-1 max-w-2xl animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Task Manager Pro
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Organize your tasks efficiently and boost your productivity
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="stats-card flex flex-col items-center text-center p-6">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Stay Organized</h3>
              <p className="text-muted-foreground">Keep track of all your tasks in one place</p>
            </div>

            <div className="stats-card flex flex-col items-center text-center p-6">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Clock className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Save Time</h3>
              <p className="text-muted-foreground">Prioritize tasks and focus on what matters</p>
            </div>

            <div className="stats-card flex flex-col items-center text-center p-6">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <ListChecks className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">Monitor your productivity and achievements</p>
            </div>
          </div>

          <div className="hidden md:block">
            <p className="text-muted-foreground mb-4">
              Join thousands of users who have improved their productivity with Task Manager Pro.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium shadow-md"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">4,000+</span> users already registered
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto md:min-w-[400px] animate-slide-in">
          <Tabs defaultValue="login" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card className="border shadow-xl">
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <LoginForm onSuccess={() => {}} />
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-4">
                  <Button variant="link" onClick={() => setActiveTab("register")}>
                    Don&apos;t have an account? Register
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="register">
              <Card className="border shadow-xl">
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>Sign up to get started with Task Manager Pro</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RegisterForm onSuccess={() => setActiveTab("login")} />
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-4">
                  <Button variant="link" onClick={() => setActiveTab("login")}>
                    Already have an account? Login
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

