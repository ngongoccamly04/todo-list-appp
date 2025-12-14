'use client'

import { useSession } from 'next-auth/react'
import AuthGuard from '@/app/components/AuthGuard'
import Header from '@/app/components/Header'
import TodoList from '@/app/components/TodoList'

export default function HomePage() {
  const { data: session } = useSession()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Header />
        <main>
          {session ? <TodoList /> : (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </main>
        
        <footer className="border-t py-6 mt-8">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2024 To-Do List App. Quản lý công việc hiệu quả.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Được xây dựng với Next.js 14 & Prisma
              </span>
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  )
}