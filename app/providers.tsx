"use client"

import type React from "react"

import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "@/hooks/use-toast"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  )
}


