import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/app/lib/db'
import { authOptions } from '@/app/lib/auth'
import { todoSchema } from '@/app/lib/schema'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'deadline'

    const where: any = {
      userId: session.user.id,
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.text = {
        contains: search,
        mode: 'insensitive',
      }
    }

    const orderBy: any = {}
    if (sortBy === 'deadline') {
      orderBy.deadline = 'asc'
    } else if (sortBy === 'status') {
      orderBy.status = 'asc'
    }

    const todos = await prisma.todo.findMany({
      where,
      orderBy,
    })

    return NextResponse.json(todos)
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = todoSchema.parse(body)

    const todo = await prisma.todo.create({
      data: {
        ...validatedData,
        deadline: new Date(validatedData.deadline),
        userId: session.user.id,
      },
    })

    return NextResponse.json(todo, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}