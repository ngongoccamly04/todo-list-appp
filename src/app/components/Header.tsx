'use client'

import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Bell, LogOut, User } from 'lucide-react'
import Image from 'next/image'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">To-Do List</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <User className="h-6 w-6" />
          )}
          <span className="hidden sm:inline">{session?.user?.name}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </header>
  )
}