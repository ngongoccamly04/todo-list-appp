import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from '@/app/components/Providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'To-Do List App',
  description: 'Ứng dụng quản lý công việc cá nhân',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        {}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}