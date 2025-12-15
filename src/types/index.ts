import { ReactNode } from "react"

export interface User {
  id: string
  name: string
  email: string
  image?: string
}

export interface Todo {
  priority: ReactNode
  name: ReactNode
  id: string
  text: string
  deadline: string
  status: 'pending' | 'done'
  finishedTime?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface SessionUser {
  id: string
  name: string
  email: string
  image?: string
}

declare module 'next-auth' {
  interface Session {
    user: SessionUser
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
  }
}

