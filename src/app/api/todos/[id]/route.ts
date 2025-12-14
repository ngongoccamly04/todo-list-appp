import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/app/lib/db'
import { authOptions } from '@/app/lib/auth'
import { todoSchema } from '@/app/lib/schema'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
    }

    const todo = await prisma.todo.findUnique({
      where: { id: params.id },
    })

    if (!todo) {
      return NextResponse.json({ error: 'Không tìm thấy công việc' }, { status: 404 })
    }

    if (todo.userId !== session.user.id) {
      return NextResponse.json({ error: 'Không có quyền' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = todoSchema.partial().parse(body)

    const updatedData: any = { ...validatedData }
    
    if (validatedData.deadline) {
      updatedData.deadline = new Date(validatedData.deadline)
    }

    if (validatedData.status === 'done' && todo.status !== 'done') {
      updatedData.finishedTime = new Date()
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: params.id },
      data: updatedData,
    })

    return NextResponse.json(updatedTodo)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
    }

    const todo = await prisma.todo.findUnique({
      where: { id: params.id },
    })

    if (!todo) {
      return NextResponse.json({ error: 'Không tìm thấy công việc' }, { status: 404 })
    }

    if (todo.userId !== session.user.id) {
      return NextResponse.json({ error: 'Không có quyền' }, { status: 403 })
    }

    await prisma.todo.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Đã xóa công việc' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}